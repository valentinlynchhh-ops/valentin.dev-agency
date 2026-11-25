import { CATALOGO, CONDICIONES_WEB, PRECIO_MINIMO_USD, precioTexto, usd } from "./catalogo.ts";
import { FAQ, MARCA, PAGINAS, SERVICIOS_DETALLE, SITE_URL, TRABAJOS } from "./sitio.ts";

/** llms.txt generado desde las mismas fuentes que las páginas: no hay copia a mano que se desactualice. */
export function llmsTxt(): string {
  const l: string[] = [];
  l.push(`# ${MARCA.nombre}`, "", `> ${MARCA.descripcion}`, "");
  l.push("## Páginas", "");
  for (const p of PAGINAS) l.push(`- [${p.nav}](${SITE_URL}${p.ruta === "/" ? "" : p.ruta}): ${p.descripcion}`);
  l.push("", "## Servicios y precios (en dólares)", "");
  for (const s of CATALOGO) l.push(`- ${s.nombre}: ${precioTexto(s)}. ${s.resumen}`);
  l.push(`- Precio mínimo de cualquier trabajo: ${usd(PRECIO_MINIMO_USD)}.`);
  l.push(
    `- Web a medida con sistema de consultas: ${CONDICIONES_WEB.seniaInicioPct}% al arrancar y ${CONDICIONES_WEB.pagoAlPublicarPct}% al publicar, ${CONDICIONES_WEB.plazoDiasHabiles} días hábiles, ${CONDICIONES_WEB.incluye}, ${CONDICIONES_WEB.rondasDeCambios} rondas de cambios.`,
  );
  l.push("", "## Qué incluye cada servicio", "");
  for (const s of SERVICIOS_DETALLE) l.push(`- ${s.nombre}: ${s.entregables.join("; ")}.`);
  l.push("", "## Trabajos publicados", "");
  for (const t of TRABAJOS) l.push(`- [${t.nombre}](${t.url}): ${t.descripcion}`);
  l.push("", "## Preguntas frecuentes", "");
  for (const f of FAQ) l.push(`- ${f.q} ${f.a}`);
  l.push("");
  return l.join("\n");
}
