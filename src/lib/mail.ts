/** Envío por Resend (API REST, sin dependencias). Las claves salen del entorno, nunca del repo. */

export type Mail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export function mailConfigurado(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

export async function enviarMail(m: Mail): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const clave = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!clave || !from) return { ok: false, error: "Resend sin configurar (RESEND_API_KEY / RESEND_FROM)" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${clave}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: [m.to], subject: m.subject, text: m.text, html: m.html, reply_to: m.replyTo }),
    });
    const j = (await r.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!r.ok || !j.id) return { ok: false, error: j.message ?? `HTTP ${r.status}` };
    return { ok: true, id: j.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "error de red" };
  }
}

export function escaparHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}
