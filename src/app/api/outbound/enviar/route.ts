import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { linkBaja } from "@/lib/baja";
import { enviarMail, mailConfigurado } from "@/lib/mail";
import { evaluarEnvio, topeDiario, type TipoEnvio } from "@/lib/outbound";
import { SITE_URL } from "@/lib/sitio";
import { claveCorrecta } from "@/lib/demoImagenes";

/* POST /api/outbound/enviar — manda UN mail a UN contacto del CRM con todos los frenos puestos.
   Cabecera x-cron-secret = CRON_SECRET. Cuerpo: { contacto_id, tipo: "frio"|"seguimiento"|"respuesta", asunto, cuerpo }.
   Está APAGADO por defecto: solo envía si `ajustes.outbound_envio_automatico` vale true (lo prendés vos). Sin eso responde
   409 "modo_borrador" y no sale nada: las rutinas dejan borradores y vos los aprobás. Ver outbound/README.md. */
export const runtime = "nodejs";

const TIPOS: readonly TipoEnvio[] = ["frio", "seguimiento", "respuesta"];
const inicioDelDiaAR = (ahora: Date) => {
  const dia = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(ahora);
  return new Date(`${dia}T00:00:00-03:00`);
};

export async function POST(req: Request) {
  if (!claveCorrecta(req.headers.get("x-cron-secret"), process.env.CRON_SECRET)) return NextResponse.json({ error: "no_autorizado" }, { status: 401 });
  const base = db();
  if (!base) return NextResponse.json({ error: "no_disponible" }, { status: 503 });

  const { data: interruptor } = await base.from("ajustes").select("valor").eq("clave", "outbound_envio_automatico").maybeSingle();
  if (interruptor?.valor !== true) return NextResponse.json({ error: "modo_borrador", ayuda: "El envío automático está apagado. Dejá un borrador para que lo apruebe Valentín." }, { status: 409 });
  if (!mailConfigurado()) return NextResponse.json({ error: "mail_sin_configurar" }, { status: 503 });

  const cuerpo = (await req.json().catch(() => null)) as { contacto_id?: string; tipo?: string; asunto?: string; cuerpo?: string } | null;
  const tipo = cuerpo?.tipo as TipoEnvio;
  if (!cuerpo?.contacto_id || !TIPOS.includes(tipo) || !cuerpo.asunto?.trim() || !cuerpo.cuerpo?.trim()) return NextResponse.json({ error: "pedido_invalido" }, { status: 400 });
  if (/\{\{[^}]+\}\}/.test(`${cuerpo.asunto}${cuerpo.cuerpo}`)) return NextResponse.json({ error: "plantilla_incompleta", ayuda: "Quedaron variables {{...}} sin completar." }, { status: 400 });

  const { data: contacto } = await base.from("contactos").select("id,email").eq("id", cuerpo.contacto_id).maybeSingle();
  if (!contacto?.email) return NextResponse.json({ error: "contacto_sin_mail" }, { status: 404 });
  const destino = String(contacto.email).toLowerCase();

  const ahora = new Date();
  const [bajas, hoy, previos] = await Promise.all([
    base.from("bajas").select("email").eq("email", destino),
    base.from("envios").select("id", { count: "exact", head: true }).eq("canal", "mail").neq("tipo", "prueba").neq("estado", "error").gte("creado_at", inicioDelDiaAR(ahora).toISOString()),
    base.from("envios").select("creado_at").eq("contacto_id", contacto.id).eq("canal", "mail").neq("tipo", "prueba").neq("estado", "error").order("creado_at", { ascending: false }),
  ]);
  const v = evaluarEnvio({
    ahora,
    destino,
    tipo,
    bajas: new Set((bajas.data ?? []).map((b) => String(b.email))),
    enviadosHoy: hoy.count ?? 0,
    tope: topeDiario(),
    enviosPrevios: previos.data?.length ?? 0,
    ultimoEnvio: previos.data?.[0] ? new Date(previos.data[0].creado_at) : null,
  });
  if (!v.ok) return NextResponse.json({ error: "bloqueado", motivo: v.motivo }, { status: 422 });

  const pie = `\n\n—\nSi no querés recibir más mis mails, avisame acá: ${await linkBaja(destino, SITE_URL)}`;
  const r = await enviarMail({ to: destino, subject: cuerpo.asunto.trim(), text: `${cuerpo.cuerpo.trim()}${pie}` });
  await base.from("envios").insert({ contacto_id: contacto.id, canal: "mail", tipo, destino, asunto: cuerpo.asunto.trim(), estado: r.ok ? "enviado" : "error" });
  if (!r.ok) return NextResponse.json({ error: "envio_fallido", detalle: r.error }, { status: 502 });
  if (tipo === "frio") await base.from("contactos").update({ estado: "contactado" }).eq("id", contacto.id).eq("estado", "nuevo");
  return NextResponse.json({ ok: true });
}
