import { db } from "./db.ts";

/* Archivos de las muestras: bucket privado `muestras` de Supabase Storage (lo crea la migración). Solo servidor. */
const BUCKET = "muestras";

export async function subirBytes(path: string, bytes: Uint8Array, tipo: string): Promise<boolean> {
  const base = db();
  if (!base) return false;
  const { error } = await base.storage.from(BUCKET).upload(path, bytes, { contentType: tipo, upsert: true, cacheControl: "31536000" });
  return !error;
}

export async function bajarArchivo(path: string): Promise<Response | null> {
  const base = db();
  if (!base) return null;
  const { data, error } = await base.storage.from(BUCKET).download(path);
  if (error || !data) return null;
  return new Response(data);
}
