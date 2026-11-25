import { NextResponse } from "next/server";
import { armarCotizacion, leerSeleccion, resumenTexto } from "@/lib/cotizador";
import { validarConsulta } from "@/lib/consulta";
import { guardarConsulta, ipDe, limitado, refDeCookie } from "@/lib/guardarConsulta";

export const runtime = "nodejs";

/* POST /api/cotizacion — guarda el pedido armado en el cotizador como una consulta de tipo "cotizacion" con el detalle
   completo, y avisa por mail. El precio que se muestra y se guarda es siempre el base del catálogo. */
export async function POST(req: Request) {
  if (limitado(ipDe(req))) return NextResponse.json({ ok: false, mensaje: "Mandaste varios pedidos seguidos. Probá de nuevo en unos minutos." }, { status: 429 });
  const cuerpo = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!cuerpo) return NextResponse.json({ ok: false, mensaje: "No pude leer tu pedido." }, { status: 400 });

  const sel = leerSeleccion(cuerpo.seleccion);
  if (!sel.ok) return NextResponse.json({ ok: false, mensaje: sel.error }, { status: 422 });
  const cot = armarCotizacion(sel.seleccion);

  const nota = typeof cuerpo.mensaje === "string" ? cuerpo.mensaje.trim().slice(0, 800) : "";
  const v = validarConsulta({ nombre: cuerpo.nombre, contacto: cuerpo.contacto, web: cuerpo.web, tipo: "cotizacion", origen: "/cotizar", mensaje: `${resumenTexto(sel.seleccion, cot)}${nota ? `\n\nNota: ${nota}` : ""}` });
  if (!v.ok) {
    if (v.spam) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, errores: v.errores, mensaje: "Revisá los campos marcados." }, { status: 422 });
  }
  const r = await guardarConsulta(v.datos, { detalle: { seleccion: sel.seleccion, cotizacion: cot }, ref: refDeCookie(req), accion: "Responder la cotización armada en la web" });
  return r.ok ? NextResponse.json({ ok: true, cotizacion: cot }) : NextResponse.json({ ok: false, mensaje: r.mensaje }, { status: r.status });
}
