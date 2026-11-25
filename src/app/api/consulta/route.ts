import { NextResponse } from "next/server";
import { validarConsulta } from "@/lib/consulta";
import { guardarConsulta, ipDe, limitado, refDeCookie } from "@/lib/guardarConsulta";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (limitado(ipDe(req))) return NextResponse.json({ ok: false, mensaje: "Mandaste varias consultas seguidas. Probá de nuevo en unos minutos." }, { status: 429 });
  let cuerpo: unknown;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, mensaje: "No pude leer tu consulta." }, { status: 400 });
  }
  const v = validarConsulta((cuerpo ?? {}) as Record<string, unknown>);
  if (!v.ok) {
    // Un robot que completó el honeypot recibe "ok" y no se guarda nada.
    if (v.spam) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, errores: v.errores, mensaje: "Revisá los campos marcados." }, { status: 422 });
  }
  const accion = v.datos.tipo === "reunion" ? "Confirmar la reunión que pidió" : undefined;
  const r = await guardarConsulta(v.datos, { ref: refDeCookie(req), accion });
  return r.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, mensaje: r.mensaje }, { status: r.status });
}
