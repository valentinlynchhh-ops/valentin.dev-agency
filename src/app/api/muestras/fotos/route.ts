import { db } from "@/lib/db";
import { subirBytes } from "@/lib/archivos";
import {
  BASE_FOTOS,
  ErrorFoto,
  MAX_CUERPO,
  claveCorrecta,
  cupo,
  descargar,
  leerPedido,
  nombreFoto,
  procesar,
  rutaFoto,
  type Uso,
} from "@/lib/demoImagenes";

/* POST /api/muestras/fotos — guarda para siempre las fotos de una muestra (docs/muestras.md).
   Cabecera x-demo-token = CRON_SECRET (vive en Vercel). Cuerpo {slug, urls: [...] (1 a 12), hostsExtra?: [...]}.
   Responde {imagenes: [{fuente, url, ancho, alto} | {fuente, error}]}; las URLs quedan en /demo/img/<hash>.webp
   (más -1024 y -640). Tope: 60 fotos por hora. Los errores dicen qué pasó sin detalles internos. */
export const maxDuration = 60;
export const runtime = "nodejs";

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

const CLAVE_USO = "muestras_fotos_uso";

/* Lee el cuerpo con tope de tamaño aunque no venga content-length. */
async function cuerpoLimitado(request: Request): Promise<string | null> {
  if (Number(request.headers.get("content-length")) > MAX_CUERPO) return null;
  const lector = request.body?.getReader();
  if (!lector) return "";
  const partes: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await lector.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_CUERPO) {
      await lector.cancel().catch(() => undefined);
      return null;
    }
    partes.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(partes));
}

async function unaFoto(fuente: string, extras: string[]) {
  try {
    const bytes = await descargar(fuente, extras);
    const v = await procesar(bytes);
    for (const a of v.archivos) {
      if (!(await subirBytes(rutaFoto(a.nombre), a.bytes, "image/webp"))) throw new ErrorFoto("guardado_fallido");
    }
    return { fuente, url: `${BASE_FOTOS}${nombreFoto(v.hash, 1600)}`, ancho: v.ancho, alto: v.alto };
  } catch (e) {
    return { fuente, error: e instanceof ErrorFoto ? e.codigo : "descarga_fallida" };
  }
}

export async function POST(request: Request) {
  const base = db();
  if (!base) return json({ error: "no_disponible" }, 503);
  if (!claveCorrecta(request.headers.get("x-demo-token"), process.env.CRON_SECRET)) return json({ error: "no_autorizado" }, 401);

  const texto = await cuerpoLimitado(request).catch(() => null);
  if (texto === null) return json({ error: "cuerpo_muy_grande" }, 413);
  let crudo: unknown;
  try {
    crudo = JSON.parse(texto);
  } catch {
    return json({ error: "json_invalido" }, 400);
  }
  const pedido = leerPedido(crudo);
  if (!pedido) return json({ error: "pedido_invalido", ayuda: "slug (a-z, 0-9, -), urls: 1 a 12 links https, hostsExtra opcional (hasta 5 dominios)" }, 400);

  const { data: fila } = await base.from("ajustes").select("valor").eq("clave", CLAVE_USO).maybeSingle();
  const c = cupo((fila?.valor as Uso | undefined) ?? null, new Date(), pedido.urls.length);
  if (!c.ok) return json({ error: "limite_por_hora", reintentar_en_minutos: c.minutos }, 429);
  await base.from("ajustes").upsert({ clave: CLAVE_USO, valor: c.uso, actualizado_at: new Date().toISOString() });

  /* De a 3 a la vez, en el orden en que vinieron. */
  const resultados: Awaited<ReturnType<typeof unaFoto>>[] = new Array(pedido.urls.length);
  let siguiente = 0;
  await Promise.all(
    Array.from({ length: Math.min(3, pedido.urls.length) }, async () => {
      while (siguiente < pedido.urls.length) {
        const i = siguiente++;
        resultados[i] = await unaFoto(pedido.urls[i], pedido.hostsExtra);
      }
    }),
  );
  return json({ slug: pedido.slug, imagenes: resultados });
}
