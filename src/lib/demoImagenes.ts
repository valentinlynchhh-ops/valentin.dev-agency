/* Fotos de las muestras de web (/demo/<slug>): el endpoint POST /api/demo/imagenes baja cada foto del propio negocio
   (Instagram, Facebook o su web) en el momento, la valida, la pasa a WebP con sharp y la guarda para siempre; la página la
   pide a valentin.dev/demo/img/<hash>.webp. Los links de Instagram y Facebook vienen firmados y vencen en horas, por eso
   no se pueden enlazar directo. Ver docs/ventas/demo-web.md.

   Seguridad (lo que se baja lo elige quien llama, así que se trata como hostil):
   - solo https, puerto 443, sin usuario ni clave en la URL;
   - hosts permitidos: *.cdninstagram.com, *.fbcdn.net, static.wixstatic.com y los que la llamada liste en `hostsExtra`;
   - cada IP a la que se conecta se revisa en el momento de conectar (no antes), así un DNS que cambia no lleva a la red
     interna: se rechazan privadas, loopback, link-local, CGNAT, multicast, reservadas y las IPv6 equivalentes;
   - cada redirección se vuelve a validar entera (máximo 3);
   - máximo 8 MB por foto (se corta la descarga al pasarse), content-type image/* y formato real comprobado por sharp,
     con tope de píxeles contra imágenes bomba.
   Este archivo no importa nada de Next ni de la base: lo prueban los tests de node directamente. */
import { createHash } from "node:crypto";
import { lookup as dnsLookup, type LookupAddress } from "node:dns";
import https from "node:https";
import { isIP } from "node:net";
import type { IncomingMessage } from "node:http";

export const MAX_BYTES_FOTO = 8 * 1024 * 1024;
export const MAX_URLS_LLAMADA = 12;
export const MAX_FOTOS_HORA = 60;
export const MAX_CUERPO = 16 * 1024;
export const MAX_REDIRECCIONES = 3;
export const MAX_PIXELES = 40_000_000;
export const ANCHOS_FOTO = [1600, 1024, 640] as const;
export const CARPETA_DEMO = "00000000-0000-4000-8000-0000000de300";
export const BASE_FOTOS = `${(process.env.NEXT_PUBLIC_SITE_URL || "https://valentin.dev").replace(/\/$/, "")}/demo/img/`;
export const ARCHIVO_FOTO = /^([0-9a-f]{32})(-640|-1024)?\.webp$/;

const SUFIJOS_PERMITIDOS = ["cdninstagram.com", "fbcdn.net"];
const HOSTS_EXACTOS = ["static.wixstatic.com"];

export type CodigoError =
  | "url_invalida"
  | "host_no_permitido"
  | "ip_privada"
  | "demasiadas_redirecciones"
  | "descarga_fallida"
  | "no_es_imagen"
  | "muy_grande"
  | "imagen_invalida"
  | "guardado_fallido";

export class ErrorFoto extends Error {
  codigo: CodigoError;
  constructor(codigo: CodigoError) {
    super(codigo);
    this.codigo = codigo;
  }
}

/* ---------- Hosts ---------- */
const HOSTNAME = /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/* Un host extra es un nombre de dominio común (no una IP ni "localhost"). La IP real se revisa igual al conectar. */
export const hostExtraValido = (host: unknown): host is string =>
  typeof host === "string" && HOSTNAME.test(host) && isIP(host) === 0 && !/(^|\.)(localhost|local|internal|lan|home|arpa)$/.test(host);

export function hostPermitido(host: string, extras: readonly string[] = []): boolean {
  const h = host.toLowerCase();
  if (HOSTS_EXACTOS.includes(h)) return true;
  if (SUFIJOS_PERMITIDOS.some((s) => h === s || h.endsWith(`.${s}`))) return true;
  return extras.some((e) => hostExtraValido(e) && e === h);
}

/* ---------- IPs ---------- */
function ipv4APartes(ip: string): number[] | null {
  const p = ip.split(".").map(Number);
  return p.length === 4 && p.every((n) => Number.isInteger(n) && n >= 0 && n <= 255) ? p : null;
}

function ipv4Privada(ip: string): boolean {
  const p = ipv4APartes(ip);
  if (!p) return true;
  const [a, b, c] = p;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) ||
    (a === 192 && b === 88 && c === 99) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

/* Expande una IPv6 a sus 8 grupos de 16 bits (acepta "::" y un IPv4 al final). */
function ipv6AGrupos(ip: string): number[] | null {
  let s = ip.toLowerCase().split("%")[0];
  const v4 = s.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (v4) {
    const p = ipv4APartes(v4[1]);
    if (!p) return null;
    s = s.slice(0, -v4[1].length) + `${((p[0] << 8) | p[1]).toString(16)}:${((p[2] << 8) | p[3]).toString(16)}`;
  }
  const mitades = s.split("::");
  if (mitades.length > 2) return null;
  const parte = (x: string) => (x ? x.split(":") : []);
  const izq = parte(mitades[0]);
  const der = mitades.length === 2 ? parte(mitades[1]) : [];
  const faltan = 8 - izq.length - der.length;
  if ((mitades.length === 1 && faltan !== 0) || faltan < 0) return null;
  const grupos = [...izq, ...Array(mitades.length === 2 ? faltan : 0).fill("0"), ...der].map((g) => (/^[0-9a-f]{1,4}$/.test(g) ? parseInt(g, 16) : NaN));
  return grupos.length === 8 && grupos.every((g) => !Number.isNaN(g)) ? grupos : null;
}

export function ipPrivada(ip: string): boolean {
  const tipo = isIP(ip);
  if (tipo === 4) return ipv4Privada(ip);
  if (tipo !== 6) return true;
  const g = ipv6AGrupos(ip);
  if (!g) return true;
  const v4De = (a: number, b: number) => `${a >> 8}.${a & 255}.${b >> 8}.${b & 255}`;
  if (g.slice(0, 7).every((x) => x === 0)) return true; // :: y ::1
  if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) return ipv4Privada(v4De(g[6], g[7])); // ::ffff:a.b.c.d
  if (g.slice(0, 6).every((x) => x === 0)) return true; // ::a.b.c.d (obsoleta)
  if (g[0] === 0x64 && g[1] === 0xff9b) return ipv4Privada(v4De(g[6], g[7])); // NAT64
  if ((g[0] & 0xfe00) === 0xfc00) return true; // fc00::/7
  if ((g[0] & 0xffc0) === 0xfe80) return true; // fe80::/10
  if ((g[0] & 0xff00) === 0xff00) return true; // multicast
  if (g[0] === 0x2001 && g[1] === 0x0db8) return true; // documentación
  if (g[0] === 0x2002) return ipv4Privada(v4De(g[1], g[2])); // 6to4
  if (g[0] === 0x0100 && g[1] === 0 && g[2] === 0 && g[3] === 0) return true; // descarte
  return false;
}

/* ---------- URLs ---------- */
export function validarUrl(crudo: unknown, extras: readonly string[] = []): URL {
  if (typeof crudo !== "string" || crudo.length > 2048) throw new ErrorFoto("url_invalida");
  let url: URL;
  try {
    url = new URL(crudo);
  } catch {
    throw new ErrorFoto("url_invalida");
  }
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) throw new ErrorFoto("url_invalida");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (isIP(host)) throw new ErrorFoto("host_no_permitido");
  if (!hostPermitido(host, extras)) throw new ErrorFoto("host_no_permitido");
  return url;
}

/* ---------- Descarga ---------- */
type Respuesta = { status: number; headers: Record<string, string | string[] | undefined>; cuerpo: AsyncIterable<Uint8Array>; cortar: () => void };
export type Pedir = (url: URL) => Promise<Respuesta>;

/* El lookup que usa la conexión: si alguna dirección del nombre es privada, no se conecta. */
type CallbackLookup = (err: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void;
export function lookupSeguro(hostname: string, opciones: { all?: boolean } | number | undefined, callback: CallbackLookup) {
  const todas = typeof opciones === "object" && opciones?.all;
  dnsLookup(hostname, { all: true }, (err, direcciones) => {
    if (err) return callback(err, "", 4);
    if (!direcciones.length || direcciones.some((d) => ipPrivada(d.address))) {
      const e: NodeJS.ErrnoException = new Error("ip_privada");
      e.code = "EZLPRIVADA";
      return callback(e, "", 4);
    }
    if (todas) return callback(null, direcciones);
    callback(null, direcciones[0].address, direcciones[0].family);
  });
}

export const pedirHttps: Pedir = (url) =>
  new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        lookup: lookupSeguro as never,
        timeout: 15_000,
        headers: { "user-agent": "Mozilla/5.0 (compatible; ZLeadsMuestras/1.0)", accept: "image/avif,image/webp,image/*;q=0.9" },
      },
      (res: IncomingMessage) => resolve({ status: res.statusCode || 0, headers: res.headers, cuerpo: res, cortar: () => res.destroy() }),
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", (e: NodeJS.ErrnoException) => reject(e.code === "EZLPRIVADA" ? new ErrorFoto("ip_privada") : new ErrorFoto("descarga_fallida")));
  });

const cabecera = (h: Respuesta["headers"], k: string) => {
  const v = h[k];
  return Array.isArray(v) ? v[0] || "" : v || "";
};

export async function descargar(crudo: string, extras: readonly string[] = [], pedir: Pedir = pedirHttps): Promise<Uint8Array> {
  let url = validarUrl(crudo, extras);
  for (let saltos = 0; ; saltos++) {
    const r = await pedir(url);
    if (r.status >= 300 && r.status < 400) {
      r.cortar();
      const destino = cabecera(r.headers, "location");
      if (!destino || saltos >= MAX_REDIRECCIONES) throw new ErrorFoto(destino ? "demasiadas_redirecciones" : "descarga_fallida");
      let siguiente: string;
      try {
        siguiente = new URL(destino, url).href;
      } catch {
        throw new ErrorFoto("url_invalida");
      }
      url = validarUrl(siguiente, extras);
      continue;
    }
    if (r.status !== 200) {
      r.cortar();
      throw new ErrorFoto("descarga_fallida");
    }
    const tipo = cabecera(r.headers, "content-type").toLowerCase();
    if (!tipo.startsWith("image/")) {
      r.cortar();
      throw new ErrorFoto("no_es_imagen");
    }
    if (Number(cabecera(r.headers, "content-length")) > MAX_BYTES_FOTO) {
      r.cortar();
      throw new ErrorFoto("muy_grande");
    }
    const partes: Uint8Array[] = [];
    let total = 0;
    try {
      for await (const parte of r.cuerpo) {
        total += parte.byteLength;
        if (total > MAX_BYTES_FOTO) {
          r.cortar();
          throw new ErrorFoto("muy_grande");
        }
        partes.push(parte);
      }
    } catch (e) {
      throw e instanceof ErrorFoto ? e : new ErrorFoto("descarga_fallida");
    }
    const bytes = new Uint8Array(total);
    let i = 0;
    for (const p of partes) {
      bytes.set(p, i);
      i += p.byteLength;
    }
    return bytes;
  }
}

/* ---------- Conversión ---------- */
export type Variantes = { hash: string; ancho: number; alto: number; archivos: { nombre: string; bytes: Uint8Array }[] };

export async function procesar(bytes: Uint8Array): Promise<Variantes> {
  const { default: sharp } = await import("sharp");
  const opciones = { limitInputPixels: MAX_PIXELES, failOn: "error" as const };
  let meta;
  try {
    meta = await sharp(bytes, opciones).metadata();
  } catch {
    throw new ErrorFoto("imagen_invalida");
  }
  if (!meta.format || !["jpeg", "png", "webp", "avif", "gif", "heif"].includes(meta.format)) throw new ErrorFoto("imagen_invalida");
  const salida: { nombre: string; bytes: Uint8Array }[] = [];
  let hash = "";
  let ancho = 0;
  let alto = 0;
  try {
    for (const w of ANCHOS_FOTO) {
      const { data, info } = await sharp(bytes, opciones)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: w === 1600 ? 78 : 76, effort: 4 })
        .toBuffer({ resolveWithObject: true });
      if (w === 1600) {
        hash = createHash("sha256").update(data).digest("hex").slice(0, 32);
        ancho = info.width;
        alto = info.height;
      }
      salida.push({ nombre: nombreFoto(hash, w), bytes: new Uint8Array(data) });
    }
  } catch {
    throw new ErrorFoto("imagen_invalida");
  }
  return { hash, ancho, alto, archivos: salida };
}

export const nombreFoto = (hash: string, ancho: number) => (ancho >= 1600 ? `${hash}.webp` : `${hash}-${ancho}.webp`);
export const rutaFoto = (nombre: string) => `${CARPETA_DEMO}/${nombre}`;

/* ---------- Cuerpo del pedido ---------- */
export type Pedido = { slug: string; urls: string[]; hostsExtra: string[] };

export function leerPedido(json: unknown): Pedido | null {
  if (!json || typeof json !== "object" || Array.isArray(json)) return null;
  const o = json as Record<string, unknown>;
  if (typeof o.slug !== "string" || !/^[a-z0-9-]{3,60}$/.test(o.slug)) return null;
  if (!Array.isArray(o.urls) || o.urls.length < 1 || o.urls.length > MAX_URLS_LLAMADA) return null;
  if (!o.urls.every((u) => typeof u === "string" && u.length <= 2048)) return null;
  const extras = o.hostsExtra === undefined ? [] : o.hostsExtra;
  if (!Array.isArray(extras) || extras.length > 5 || !extras.every((h) => hostExtraValido(h))) return null;
  return { slug: o.slug, urls: [...new Set(o.urls as string[])], hostsExtra: extras as string[] };
}

/* ---------- Límite por hora ---------- */
export type Uso = { hora: string; n: number };
export const horaDe = (ahora: Date) => ahora.toISOString().slice(0, 13);

export function cupo(uso: Uso | null, ahora: Date, pedidas: number, max = MAX_FOTOS_HORA): { ok: boolean; uso: Uso; minutos: number } {
  const hora = horaDe(ahora);
  const n = uso && uso.hora === hora && Number.isFinite(uso.n) ? uso.n : 0;
  if (n + pedidas > max) return { ok: false, uso: { hora, n }, minutos: 60 - ahora.getUTCMinutes() };
  return { ok: true, uso: { hora, n: n + pedidas }, minutos: 0 };
}

/* Compara la clave en tiempo constante (sobre los hashes, así el largo no importa). */
export function claveCorrecta(recibida: unknown, guardada: unknown): boolean {
  if (typeof recibida !== "string" || typeof guardada !== "string" || guardada.length < 32 || recibida.length > 256) return false;
  const a = createHash("sha256").update(recibida).digest();
  const b = createHash("sha256").update(guardada).digest();
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a[i] ^ b[i];
  return dif === 0;
}
