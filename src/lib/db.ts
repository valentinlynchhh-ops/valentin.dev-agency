import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null | undefined;

/** Cliente de Supabase con la service role. Solo servidor. Devuelve null si falta la configuración. */
export function db(): SupabaseClient | null {
  if (cliente !== undefined) return cliente;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  cliente = url && clave ? createClient(url, clave, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return cliente;
}

export function hayBase(): boolean {
  return db() !== null;
}
