/* Acceso a datos del programa de vendedores (solo servidor). */
import { db } from "./db.ts";
import { COMISION_PCT, MIN_PROYECTOS_MES, comisionDe, generarCodigo } from "./vendedores.ts";

export type Postulacion = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  motivo: string;
  estado: "nueva" | "aprobada" | "rechazada";
  codigo: string | null;
  creado_at: string;
};

export type ResumenVendedor = Postulacion & { consultas: number; contactos: number; entregados: number; valorEntregado: number; comisionEstimada: number };

export async function listarPostulaciones(): Promise<Postulacion[]> {
  const base = db();
  if (!base) return [];
  const { data } = await base.from("postulaciones_vendedores").select("*").order("creado_at", { ascending: false }).limit(200);
  return (data ?? []) as Postulacion[];
}

/** Aprobada → genera un código único (reintenta si choca). Devuelve el código o null. */
export async function aprobar(id: string): Promise<string | null> {
  const base = db();
  if (!base) return null;
  for (let i = 0; i < 6; i++) {
    const codigo = generarCodigo();
    const { error } = await base.from("postulaciones_vendedores").update({ estado: "aprobada", codigo, resuelta_at: new Date().toISOString() }).eq("id", id).is("codigo", null);
    if (!error) return codigo;
    if (!/duplicate|unique/i.test(error.message)) return null;
  }
  return null;
}

export async function rechazar(id: string): Promise<void> {
  const base = db();
  if (!base) return;
  await base.from("postulaciones_vendedores").update({ estado: "rechazada", resuelta_at: new Date().toISOString() }).eq("id", id);
}

/** Por cada vendedor aprobado: sus contactos y una comisión ESTIMADA sobre lo entregado (hay que validar el cobro real). */
export async function resumenVendedores(): Promise<ResumenVendedor[]> {
  const base = db();
  if (!base) return [];
  const aprobadas = (await listarPostulaciones()).filter((p) => p.estado === "aprobada" && p.codigo);
  if (!aprobadas.length) return [];
  const codigos = aprobadas.map((p) => p.codigo as string);
  const [contactos, consultas] = await Promise.all([
    base.from("contactos").select("vendedor_ref,estado,valor_usd").in("vendedor_ref", codigos).limit(5000),
    base.from("consultas").select("ref").in("ref", codigos).limit(5000),
  ]);
  return aprobadas.map((p) => {
    const mios = (contactos.data ?? []).filter((c) => c.vendedor_ref === p.codigo);
    const entregados = mios.filter((c) => c.estado === "entregado");
    const valorEntregado = entregados.reduce((s, c) => s + (c.valor_usd ?? 0), 0);
    return { ...p, consultas: (consultas.data ?? []).filter((c) => c.ref === p.codigo).length, contactos: mios.length, entregados: entregados.length, valorEntregado, comisionEstimada: comisionDe(valorEntregado) };
  });
}

export const REGLAS = { COMISION_PCT, MIN_PROYECTOS_MES };
