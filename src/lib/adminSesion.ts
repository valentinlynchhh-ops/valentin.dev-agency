/* Sesión del CRM: cookie firmada (HMAC-SHA256 con ADMIN_SECRET) que vence a los 30 días.
   Usa Web Crypto, así sirve igual en el proxy y en el servidor. La contraseña (ADMIN_PASSWORD) vive solo en Vercel. */

export const COOKIE_ADMIN = "vd_admin";
export const DURACION_S = 60 * 60 * 24 * 30;

const enc = new TextEncoder();

async function firmar(texto: string, secreto: string): Promise<string> {
  const clave = await crypto.subtle.importKey("raw", enc.encode(secreto), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const f = await crypto.subtle.sign("HMAC", clave, enc.encode(texto));
  return [...new Uint8Array(f)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function iguales(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export const adminConfigurado = (): boolean => Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.length >= 16);

export async function crearToken(ahora = Date.now()): Promise<string> {
  const secreto = process.env.ADMIN_SECRET ?? "";
  const vence = Math.floor(ahora / 1000) + DURACION_S;
  return `${vence}.${await firmar(String(vence), secreto)}`;
}

export async function tokenValido(token: string | undefined, ahora = Date.now()): Promise<boolean> {
  const secreto = process.env.ADMIN_SECRET;
  if (!token || !secreto || secreto.length < 16) return false;
  const [vence, firma] = token.split(".");
  if (!vence || !firma || !/^\d+$/.test(vence) || Number(vence) < Math.floor(ahora / 1000)) return false;
  return iguales(firma, await firmar(vence, secreto));
}

export async function contrasenaCorrecta(intento: string): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  // Se firman ambas para comparar en tiempo constante sin importar el largo.
  const clave = process.env.ADMIN_SECRET || "x";
  return iguales(await firmar(intento, clave), await firmar(real, clave));
}
