import { db } from "@/lib/db";
import { bajaValida } from "@/lib/baja";
import { emailValido } from "@/lib/outbound";
import { escaparHtml } from "@/lib/mail";

/* Baja de los mails de valentin.dev. El link del mail trae el mail y una firma. GET muestra un botón de confirmación
   (así los antivirus que abren los links no dan de baja a nadie); POST registra la baja en la tabla `bajas`. */
export const runtime = "nodejs";

const PAGINA = (cuerpo: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Baja · valentin.dev</title><style>body{margin:0;min-height:100svh;display:grid;place-items:center;font:17px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;background:#0a0a0a;color:#f5f5f0;padding:24px}main{max-width:30rem}h1{font-size:32px;line-height:1.05;letter-spacing:-.04em;margin:0 0 12px}button{font:inherit;font-weight:700;min-height:52px;padding:12px 24px;background:#ffe600;color:#0a0a0a;border:0;cursor:pointer}code{background:#202020;padding:2px 6px}</style></head><body><main>${cuerpo}</main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } },
  );

export async function GET(req: Request) {
  const u = new URL(req.url);
  const e = (u.searchParams.get("e") ?? "").trim().toLowerCase();
  const f = u.searchParams.get("f") ?? "";
  if (!emailValido(e) || !(await bajaValida(e, f))) return PAGINA("<h1>Link inválido</h1><p>El link de baja está incompleto o vencido. Respondé el mail con la palabra «baja» y te saco igual.</p>", 400);
  return PAGINA(
    `<h1>¿Dejás de recibir mis mails?</h1><p>Voy a sacar <code>${escaparHtml(e)}</code> de mi lista y no te escribo más.</p><form method="post"><input type="hidden" name="e" value="${escaparHtml(e)}"><input type="hidden" name="f" value="${escaparHtml(f)}"><button type="submit">Sí, no me escribas más</button></form>`,
  );
}

export async function POST(req: Request) {
  const datos = await req.formData().catch(() => null);
  const e = String(datos?.get("e") ?? "").trim().toLowerCase();
  const f = String(datos?.get("f") ?? "");
  if (!emailValido(e) || !(await bajaValida(e, f))) return PAGINA("<h1>Link inválido</h1><p>No pude confirmar la baja. Respondé el mail con la palabra «baja».</p>", 400);
  const base = db();
  if (!base) return PAGINA("<h1>Ahora no puedo registrarlo</h1><p>Respondé el mail con la palabra «baja» y te saco igual.</p>", 503);
  const { error } = await base.from("bajas").upsert({ email: e, motivo: "baja por link" });
  if (error) return PAGINA("<h1>Ahora no puedo registrarlo</h1><p>Respondé el mail con la palabra «baja» y te saco igual.</p>", 502);
  // Si el mail pertenece a un contacto, queda marcado como perdido y con una nota.
  const { data: c } = await base.from("contactos").select("id").ilike("email", e).maybeSingle();
  if (c) {
    await base.from("contactos").update({ estado: "perdido" }).eq("id", c.id);
    await base.from("notas").insert({ contacto_id: c.id, texto: "Se dio de baja desde el link del mail. No escribirle más." });
  }
  return PAGINA("<h1>Listo</h1><p>Ya no te escribo más. Perdón la molestia.</p>");
}
