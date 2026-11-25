/* Link de baja de los mails: va firmado (HMAC con ADMIN_SECRET) para que nadie pueda dar de baja a un tercero adivinando la URL. */

const enc = new TextEncoder();

async function hmacHex(texto: string, secreto: string): Promise<string> {
  const clave = await crypto.subtle.importKey("raw", enc.encode(secreto), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const f = await crypto.subtle.sign("HMAC", clave, enc.encode(texto));
  return [...new Uint8Array(f)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export async function firmaBaja(email: string, secreto = process.env.ADMIN_SECRET ?? ""): Promise<string> {
  return hmacHex(`baja:${email.trim().toLowerCase()}`, secreto);
}

export async function bajaValida(email: string, firma: string, secreto = process.env.ADMIN_SECRET ?? ""): Promise<boolean> {
  if (secreto.length < 16 || !/^[0-9a-f]{32}$/.test(firma)) return false;
  const esperada = await firmaBaja(email, secreto);
  let r = 0;
  for (let i = 0; i < 32; i++) r |= esperada.charCodeAt(i) ^ firma.charCodeAt(i);
  return r === 0;
}

export async function linkBaja(email: string, sitio: string): Promise<string> {
  const e = email.trim().toLowerCase();
  return `${sitio}/api/outbound/baja?e=${encodeURIComponent(e)}&f=${await firmaBaja(e)}`;
}
