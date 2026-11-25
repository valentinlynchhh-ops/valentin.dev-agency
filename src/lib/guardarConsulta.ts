/* Guarda una consulta (formulario, reunión o cotización) en Supabase y avisa por mail. Solo servidor.
   Lo usan /api/consulta y /api/cotizacion. Si falta la base responde con un error honesto: nunca simula un éxito. */
import { db } from "./db.ts";
import { enviarMail, escaparHtml } from "./mail.ts";
import { ETIQUETA_TIPO } from "./sitio.ts";
import { codigoValido } from "./vendedores.ts";
import type { ConsultaValida } from "./consulta.ts";

const intentos = new Map<string, number[]>();
const VENTANA_MS = 10 * 60 * 1000;
const MAX_INTENTOS = 6;

/** Tope por IP en memoria de la instancia: frena ráfagas, no reemplaza a un WAF. */
export function limitado(ip: string): boolean {
  const ahora = Date.now();
  const lista = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  lista.push(ahora);
  intentos.set(ip, lista);
  if (intentos.size > 5000) intentos.clear();
  return lista.length > MAX_INTENTOS;
}

export function ipDe(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
}

/** Código de vendedor guardado en la cookie `vd_ref` (si es válido). */
export function refDeCookie(req: Request): string | null {
  const m = /(?:^|;\s*)vd_ref=([A-Za-z0-9]{6})/.exec(req.headers.get("cookie") ?? "");
  const v = m?.[1]?.toUpperCase();
  return v && codigoValido(v) ? v : null;
}

const hoyArgentina = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(new Date());

export type Resultado = { ok: true } | { ok: false; status: number; mensaje: string };

export async function guardarConsulta(d: ConsultaValida, extra: { detalle?: unknown; ref?: string | null; accion?: string } = {}): Promise<Resultado> {
  const base = db();
  if (!base) {
    console.error("[consulta] Supabase sin configurar: la consulta NO se guardó");
    return { ok: false, status: 503, mensaje: "El formulario todavía no está conectado. Escribime por WhatsApp y lo resolvemos." };
  }
  try {
    let contactoId: string | null = null;
    if (d.email) {
      const { data: ya } = await base.from("contactos").select("id").ilike("email", d.email).maybeSingle();
      contactoId = ya?.id ?? null;
    }
    if (!contactoId) {
      const { data: nuevo, error } = await base
        .from("contactos")
        .insert({ nombre: d.nombre, email: d.email, telefono: d.telefono, origen: "web", estado: "nuevo", vendedor_ref: extra.ref ?? null })
        .select("id")
        .single();
      if (error) throw error;
      contactoId = nuevo.id;
    }
    const { data: consulta, error: eConsulta } = await base
      .from("consultas")
      .insert({
        contacto_id: contactoId,
        nombre: d.nombre,
        email: d.email,
        telefono: d.telefono,
        tipo: d.tipo,
        mensaje: d.mensaje,
        origen: d.origen,
        detalle: extra.detalle ?? null,
        ref: extra.ref ?? null,
      })
      .select("id")
      .single();
    if (eConsulta) throw eConsulta;
    await base.from("acciones").insert({ contacto_id: contactoId, texto: extra.accion ?? "Responder la consulta de la web", vence_el: hoyArgentina() });

    const destino = process.env.ADMIN_EMAIL;
    if (destino) {
      const tipo = ETIQUETA_TIPO[d.tipo] ?? d.tipo;
      const medio = d.email ?? d.telefono ?? "";
      const r = await enviarMail({
        to: destino,
        subject: `${tipo}: ${d.nombre}${extra.ref ? ` (vendedor ${extra.ref})` : ""}`,
        text: `Nombre: ${d.nombre}\nContacto: ${medio}\nTipo: ${tipo}\nDesde: ${d.origen}${extra.ref ? `\nVendedor: ${extra.ref}` : ""}\n\n${d.mensaje || "(sin mensaje)"}`,
        html: `<p><b>${escaparHtml(d.nombre)}</b> — ${escaparHtml(medio)}</p><p>${escaparHtml(tipo)}<br>Desde: ${escaparHtml(d.origen)}${extra.ref ? `<br>Vendedor: ${escaparHtml(extra.ref)}` : ""}</p><p>${escaparHtml(d.mensaje || "(sin mensaje)").replace(/\n/g, "<br>")}</p>`,
        replyTo: d.email ?? undefined,
      });
      if (r.ok) await base.from("consultas").update({ avisada: true }).eq("id", consulta.id);
      else console.error("[consulta] guardada pero el aviso por mail falló:", r.error);
    } else {
      console.error("[consulta] guardada, pero falta ADMIN_EMAIL: no se avisó por mail");
    }
    return { ok: true };
  } catch (e) {
    console.error("[consulta] error al guardar", e instanceof Error ? e.message : e);
    return { ok: false, status: 502, mensaje: "No pude guardar tu consulta. Probá de nuevo en un momento." };
  }
}
