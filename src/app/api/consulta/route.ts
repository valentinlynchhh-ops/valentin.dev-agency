import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validarConsulta } from "@/lib/consulta";
import { enviarMail, escaparHtml } from "@/lib/mail";
import { TIPOS_CONSULTA } from "@/lib/sitio";

export const runtime = "nodejs";

// Tope por IP, en memoria de la instancia: frena ráfagas, no reemplaza a un WAF.
const intentos = new Map<string, number[]>();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_INTENTOS = 5;

function limitado(ip: string): boolean {
  const ahora = Date.now();
  const lista = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  lista.push(ahora);
  intentos.set(ip, lista);
  if (intentos.size > 5000) intentos.clear();
  return lista.length > MAX_INTENTOS;
}

function hoyArgentina(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date());
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
  if (limitado(ip)) {
    return NextResponse.json({ ok: false, mensaje: "Mandaste varias consultas seguidas. Probá de nuevo en unos minutos." }, { status: 429 });
  }

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
  const d = v.datos;

  const base = db();
  if (!base) {
    console.error("[consulta] Supabase sin configurar: la consulta NO se guardó");
    return NextResponse.json(
      { ok: false, mensaje: "El formulario todavía no está conectado. Escribime por otro medio y lo resolvemos." },
      { status: 503 },
    );
  }

  try {
    // Contacto: reusa uno existente por mail; si no, lo crea.
    let contactoId: string | null = null;
    if (d.email) {
      const { data: ya } = await base.from("contactos").select("id").ilike("email", d.email).maybeSingle();
      contactoId = ya?.id ?? null;
    }
    if (!contactoId) {
      const { data: nuevo, error } = await base
        .from("contactos")
        .insert({ nombre: d.nombre, email: d.email, telefono: d.telefono, origen: "web", estado: "nuevo" })
        .select("id")
        .single();
      if (error) throw error;
      contactoId = nuevo.id;
    }

    const { data: consulta, error: eConsulta } = await base
      .from("consultas")
      .insert({ contacto_id: contactoId, nombre: d.nombre, email: d.email, telefono: d.telefono, tipo: d.tipo, mensaje: d.mensaje, origen: d.origen })
      .select("id")
      .single();
    if (eConsulta) throw eConsulta;

    await base.from("acciones").insert({ contacto_id: contactoId, texto: "Responder la consulta de la web", vence_el: hoyArgentina() });

    // Aviso por mail. Si falla, la consulta ya está guardada y queda marcada sin avisar.
    const destino = process.env.ADMIN_EMAIL;
    if (destino) {
      const tipo = TIPOS_CONSULTA.find((t) => t.valor === d.tipo)?.etiqueta ?? d.tipo;
      const medio = d.email ?? d.telefono ?? "";
      const r = await enviarMail({
        to: destino,
        subject: `Consulta nueva: ${d.nombre} (${tipo})`,
        text: `Nombre: ${d.nombre}\nContacto: ${medio}\nNecesita: ${tipo}\nDesde: ${d.origen}\n\n${d.mensaje || "(sin mensaje)"}`,
        html: `<p><b>${escaparHtml(d.nombre)}</b> — ${escaparHtml(medio)}</p><p>Necesita: ${escaparHtml(tipo)}<br>Desde: ${escaparHtml(d.origen)}</p><p>${escaparHtml(d.mensaje || "(sin mensaje)").replace(/\n/g, "<br>")}</p>`,
        replyTo: d.email ?? undefined,
      });
      if (r.ok) await base.from("consultas").update({ avisada: true }).eq("id", consulta.id);
      else console.error("[consulta] guardada pero el aviso por mail falló:", r.error);
    } else {
      console.error("[consulta] guardada, pero falta ADMIN_EMAIL: no se avisó por mail");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[consulta] error al guardar", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, mensaje: "No pude guardar tu consulta. Probá de nuevo en un momento." }, { status: 502 });
  }
}
