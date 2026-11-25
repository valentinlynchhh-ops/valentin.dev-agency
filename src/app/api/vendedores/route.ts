import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enviarMail, escaparHtml } from "@/lib/mail";
import { ipDe, limitado } from "@/lib/guardarConsulta";
import { COMISION_PCT, MIN_PROYECTOS_MES, validarPostulacion } from "@/lib/vendedores";

export const runtime = "nodejs";

/* POST /api/vendedores — postulación al programa de vendedores. Guarda en `postulaciones_vendedores` y avisa por mail.
   No pide datos financieros ni documentos. Sin base responde 503: nunca simula un éxito. */
export async function POST(req: Request) {
  if (limitado(ipDe(req))) return NextResponse.json({ ok: false, mensaje: "Mandaste varias postulaciones seguidas. Probá de nuevo en unos minutos." }, { status: 429 });
  const cuerpo = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!cuerpo) return NextResponse.json({ ok: false, mensaje: "No pude leer tu postulación." }, { status: 400 });
  const v = validarPostulacion(cuerpo);
  if (!v.ok) {
    if (v.spam) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, errores: v.errores, mensaje: "Revisá los campos marcados." }, { status: 422 });
  }
  const d = v.datos;
  const base = db();
  if (!base) {
    console.error("[vendedores] Supabase sin configurar: la postulación NO se guardó");
    return NextResponse.json({ ok: false, mensaje: "La postulación online todavía no está conectada. Escribime por WhatsApp y lo resolvemos." }, { status: 503 });
  }
  const { error } = await base.from("postulaciones_vendedores").insert({ nombre: d.nombre, email: d.email, telefono: d.telefono, motivo: d.motivo });
  if (error) {
    console.error("[vendedores] error al guardar", error.message);
    return NextResponse.json({ ok: false, mensaje: "No pude guardar tu postulación. Probá de nuevo en un momento." }, { status: 502 });
  }
  const destino = process.env.ADMIN_EMAIL;
  if (destino) {
    const r = await enviarMail({
      to: destino,
      subject: `Postulación de vendedor: ${d.nombre}`,
      text: `Nombre: ${d.nombre}\nContacto: ${d.contacto}\n\n${d.motivo}\n\n(Programa: ${COMISION_PCT}% por proyecto cobrado, mínimo ${MIN_PROYECTOS_MES} proyectos al mes.)`,
      html: `<p><b>${escaparHtml(d.nombre)}</b> — ${escaparHtml(d.contacto)}</p><p>${escaparHtml(d.motivo).replace(/\n/g, "<br>")}</p>`,
      replyTo: d.email ?? undefined,
    });
    if (!r.ok) console.error("[vendedores] guardada pero el aviso por mail falló:", r.error);
  }
  return NextResponse.json({ ok: true });
}
