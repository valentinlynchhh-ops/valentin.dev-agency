import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  ARCHIVO_FOTO,
  ErrorFoto,
  MAX_BYTES_FOTO,
  MAX_FOTOS_HORA,
  claveCorrecta,
  cupo,
  descargar,
  hostExtraValido,
  hostPermitido,
  ipPrivada,
  leerPedido,
  lookupSeguro,
  procesar,
  rutaFoto,
  validarUrl,
  type Pedir,
} from "./demoImagenes.ts";

const codigo = async (p: Promise<unknown>) => {
  try {
    await p;
    return "ok";
  } catch (e) {
    return e instanceof ErrorFoto ? e.codigo : `otro:${(e as Error).message}`;
  }
};
const codigoSync = (f: () => unknown) => codigo(Promise.resolve().then(f));

async function* trozos(...partes: Uint8Array[]) {
  for (const p of partes) yield p;
}
const respuesta = (status: number, headers: Record<string, string>, ...cuerpo: Uint8Array[]) => ({ status, headers, cuerpo: trozos(...cuerpo), cortar: () => undefined });

test("IPs privadas, reservadas y trucos de IPv6", () => {
  for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.0.1", "172.31.255.255", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "224.0.0.1", "255.255.255.255", "198.18.0.1", "::1", "::", "fe80::1", "fc00::1", "fd12:3456::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "::ffff:10.0.0.1", "64:ff9b::a9fe:a9fe", "2002:7f00:1::", "ff02::1", "2001:db8::1", "no-es-ip", "999.1.1.1"])
    assert.ok(ipPrivada(ip), ip);
  for (const ip of ["157.240.1.35", "8.8.8.8", "172.32.0.1", "100.128.0.1", "2a03:2880:f12f:83:face:b00c::25de", "2606:4700::6810:84e5", "::ffff:8.8.8.8"]) assert.ok(!ipPrivada(ip), ip);
});

test("hosts: Instagram, Facebook y Wix sí; el resto solo si se lista y es un dominio común", () => {
  for (const h of ["scontent-eze1-1.cdninstagram.com", "instagram.feze1-1.fna.fbcdn.net", "static.wixstatic.com", "cdninstagram.com"]) assert.ok(hostPermitido(h), h);
  for (const h of ["evilcdninstagram.com", "cdninstagram.com.evil.com", "wixstatic.com", "x.static.wixstatic.com", "ejemplo.com", "localhost"]) assert.ok(!hostPermitido(h), h);
  assert.ok(hostPermitido("www.estudio.com.ar", ["www.estudio.com.ar"]));
  assert.ok(!hostPermitido("otro.com.ar", ["www.estudio.com.ar"]));
  for (const h of ["localhost", "127.0.0.1", "intranet", "algo.local", "metadata.google.internal", "x.arpa", "", "a..b.com", "UPPER.com"]) assert.ok(!hostExtraValido(h), h);
  assert.ok(hostExtraValido("www.estudio.com.ar"));
});

test("URLs: solo https al 443, sin credenciales ni IPs literales", async () => {
  assert.equal(validarUrl("https://static.wixstatic.com/media/a.jpg").hostname, "static.wixstatic.com");
  for (const [u, c] of [
    ["http://static.wixstatic.com/media/a.jpg", "url_invalida"],
    ["https://user:pw@static.wixstatic.com/a.jpg", "url_invalida"],
    ["https://static.wixstatic.com:8443/a.jpg", "url_invalida"],
    ["https://127.0.0.1/a.jpg", "host_no_permitido"],
    ["https://[::1]/a.jpg", "host_no_permitido"],
    ["https://169.254.169.254/latest/meta-data", "host_no_permitido"],
    ["file:///etc/passwd", "url_invalida"],
    ["javascript:alert(1)", "url_invalida"],
    ["https://ejemplo.com/a.jpg", "host_no_permitido"],
    ["no es url", "url_invalida"],
  ])
    assert.equal(await codigoSync(() => validarUrl(u)), c, u);
});

test("descarga: cada redirección se vuelve a validar (no se puede saltar a la red interna)", async () => {
  const vistos: string[] = [];
  const pedir: Pedir = async (url) => {
    vistos.push(url.href);
    if (url.pathname === "/a.jpg") return respuesta(302, { location: "https://169.254.169.254/latest" });
    if (url.pathname === "/b.jpg") return respuesta(301, { location: "http://static.wixstatic.com/media/c.jpg" });
    if (url.pathname === "/c.jpg") return respuesta(302, { location: "/media/d.jpg" });
    if (url.pathname === "/media/d.jpg") return respuesta(200, { "content-type": "image/jpeg" }, new Uint8Array([1, 2, 3]));
    if (url.pathname === "/loop.jpg") return respuesta(302, { location: "/loop.jpg" });
    return respuesta(404, {});
  };
  assert.equal(await codigo(descargar("https://static.wixstatic.com/a.jpg", [], pedir)), "host_no_permitido");
  assert.equal(await codigo(descargar("https://static.wixstatic.com/b.jpg", [], pedir)), "url_invalida");
  assert.deepEqual([...(await descargar("https://static.wixstatic.com/c.jpg", [], pedir))], [1, 2, 3]);
  assert.equal(await codigo(descargar("https://static.wixstatic.com/loop.jpg", [], pedir)), "demasiadas_redirecciones");
  assert.equal(await codigo(descargar("https://static.wixstatic.com/nada.jpg", [], pedir)), "descarga_fallida");
  assert.ok(!vistos.some((v) => v.includes("169.254")), "nunca pidió la IP interna");
});

test("descarga: tamaño máximo (anunciado o real) y content-type", async () => {
  const grande = new Uint8Array(1024 * 1024);
  const pedir: Pedir = async (url) => {
    if (url.pathname === "/anuncia.jpg") return respuesta(200, { "content-type": "image/jpeg", "content-length": String(MAX_BYTES_FOTO + 1) });
    if (url.pathname === "/miente.jpg") return respuesta(200, { "content-type": "image/jpeg", "content-length": "10" }, ...Array(9).fill(grande));
    if (url.pathname === "/html.jpg") return respuesta(200, { "content-type": "text/html" }, new Uint8Array([60]));
    return respuesta(200, { "content-type": "image/png" }, ...Array(8).fill(grande));
  };
  assert.equal(await codigo(descargar("https://static.wixstatic.com/anuncia.jpg", [], pedir)), "muy_grande");
  assert.equal(await codigo(descargar("https://static.wixstatic.com/miente.jpg", [], pedir)), "muy_grande");
  assert.equal(await codigo(descargar("https://static.wixstatic.com/html.jpg", [], pedir)), "no_es_imagen");
  assert.equal((await descargar("https://static.wixstatic.com/justo.jpg", [], pedir)).byteLength, MAX_BYTES_FOTO);
});

test("el lookup de la conexión rechaza nombres que resuelven a IPs privadas", async () => {
  const resultado = await new Promise<string>((r) => lookupSeguro("localhost", { all: true }, (err) => r(err ? String(err.code) : "conectó")));
  assert.equal(resultado, "EZLPRIVADA");
});

test("procesar: WebP de 1600, 1024 y 640 con nombre por hash; lo que no es imagen se rechaza", async () => {
  const jpg = await sharp({ create: { width: 2400, height: 1600, channels: 3, background: { r: 120, g: 140, b: 160 } } }).jpeg().toBuffer();
  const v = await procesar(new Uint8Array(jpg));
  assert.match(v.hash, /^[0-9a-f]{32}$/);
  assert.equal(v.ancho, 1600);
  assert.equal(v.alto, 1067);
  assert.deepEqual(v.archivos.map((a) => a.nombre), [`${v.hash}.webp`, `${v.hash}-1024.webp`, `${v.hash}-640.webp`]);
  for (const a of v.archivos) {
    assert.match(a.nombre, ARCHIVO_FOTO);
    const m = await sharp(a.bytes).metadata();
    assert.equal(m.format, "webp");
  }
  assert.equal((await sharp(v.archivos[2].bytes).metadata()).width, 640);
  const chica = await sharp({ create: { width: 500, height: 400, channels: 3, background: "#fff" } }).png().toBuffer();
  assert.equal((await procesar(new Uint8Array(chica))).ancho, 500, "no agranda");
  assert.equal(await codigo(procesar(new TextEncoder().encode("<svg onload=alert(1)></svg>"))), "imagen_invalida");
  assert.equal(await codigo(procesar(new Uint8Array([0xff, 0xd8, 0xff, 0x00]))), "imagen_invalida");
  assert.equal(rutaFoto(`${v.hash}.webp`), `00000000-0000-4000-8000-0000000de300/${v.hash}.webp`);
});

test("nombre de archivo servido: solo hash y variantes conocidas", () => {
  for (const ok of ["0123456789abcdef0123456789abcdef.webp", "0123456789abcdef0123456789abcdef-640.webp", "0123456789abcdef0123456789abcdef-1024.webp"]) assert.match(ok, ARCHIVO_FOTO);
  for (const mal of ["../x.webp", "0123456789abcdef0123456789abcdef-800.webp", "0123456789ABCDEF0123456789abcdef.webp", "0123456789abcdef0123456789abcdef.jpg", "x.webp"]) assert.doesNotMatch(mal, ARCHIVO_FOTO);
});

test("pedido: slug, 1 a 12 URLs y hosts extra válidos", () => {
  assert.deepEqual(leerPedido({ slug: "estudio-x", urls: ["https://a", "https://a"] }), { slug: "estudio-x", urls: ["https://a"], hostsExtra: [] });
  for (const malo of [null, [], "x", { slug: "X", urls: ["a"] }, { slug: "abc", urls: [] }, { slug: "abc", urls: Array(13).fill("u") }, { slug: "abc", urls: [1] }, { slug: "abc", urls: ["a"], hostsExtra: ["localhost"] }, { slug: "abc", urls: ["a"], hostsExtra: "x.com" }])
    assert.equal(leerPedido(malo), null, JSON.stringify(malo));
});

test("límite por hora: suma dentro de la hora y arranca de cero en la siguiente", () => {
  const t = new Date("2026-11-24T18:20:00Z");
  assert.deepEqual(cupo(null, t, 12), { ok: true, uso: { hora: "2026-11-24T18", n: 12 }, minutos: 0 });
  assert.equal(cupo({ hora: "2026-11-24T18", n: 50 }, t, 12).ok, false);
  assert.equal(cupo({ hora: "2026-11-24T18", n: 50 }, t, 12).minutos, 40);
  assert.equal(cupo({ hora: "2026-11-24T17", n: MAX_FOTOS_HORA }, t, 12).ok, true);
});

test("clave: exacta, en tiempo constante y nunca con una guardada vacía", () => {
  const clave = "a".repeat(64);
  assert.ok(claveCorrecta(clave, clave));
  assert.ok(!claveCorrecta(clave.slice(1), clave));
  assert.ok(!claveCorrecta("", ""));
  assert.ok(!claveCorrecta(null, clave));
  assert.ok(!claveCorrecta(clave, null));
  assert.ok(!claveCorrecta("x", "x"));
});
