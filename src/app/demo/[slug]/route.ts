import { db } from "@/lib/db";
import { PAGINA_NO_ENCONTRADA, cabecerasDemo, slugValido } from "@/lib/demos";
import { htmlDeValor } from "@/lib/demoWeb.mjs";
import { MUESTRAS_EJEMPLO } from "@/lib/muestrasEjemplo";

/* Muestra de web para un cliente: la fila de `muestras` guarda los datos del negocio (JSON chico) y la página se arma
   acá con el generador de src/lib/demoWeb.mjs. Es una ruta, no una página: no pasa por el marco del sitio. No se indexa.
   Un slug inválido, un dato roto o una fila inexistente dan 404. Ver docs/muestras.md. */
export const dynamic = "force-dynamic";

async function htmlDe(slug: string): Promise<string | null> {
  const base = db();
  if (base) {
    const { data, error } = await base.from("muestras").select("datos").eq("slug", slug).maybeSingle();
    if (!error && data) return htmlDeValor(JSON.stringify(data.datos));
  }
  const ejemplo = MUESTRAS_EJEMPLO[slug];
  return ejemplo ? htmlDeValor(JSON.stringify(ejemplo)) : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const html = slugValido(slug) ? await htmlDe(slug).catch(() => null) : null;
  if (!html) return new Response(PAGINA_NO_ENCONTRADA, { status: 404, headers: cabecerasDemo(false) });
  return new Response(html, { status: 200, headers: cabecerasDemo(true) });
}
