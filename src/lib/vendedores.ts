/* Programa de vendedores: ÚNICA fuente de las condiciones (las fijó Valentín el 25/11/2026).
   Lo usan la landing, la página /vendedores, el CRM y los tests: no se escriben a mano en otro lado. */
import { CATALOGO, usdFino } from "./catalogo.ts";

/** Comisión sobre cada proyecto efectivamente cobrado. */
export const COMISION_PCT = 15;
/** Mínimo de proyectos cobrados por mes para seguir en el programa. */
export const MIN_PROYECTOS_MES = 2;

/** Comisión (en dólares) sobre un monto cobrado. */
export function comisionDe(montoCobrado: number): number {
  if (!Number.isFinite(montoCobrado) || montoCobrado <= 0) return 0;
  return Math.round(montoCobrado * COMISION_PCT) / 100;
}

/** Ejemplos calculados sobre el precio de lista del catálogo (no son resultados de nadie). */
export function ejemplosComision(): { servicio: string; lista: number; comision: number; desde: boolean; texto: string }[] {
  return CATALOGO.map((s) => ({
    servicio: s.nombre,
    lista: s.usd,
    desde: s.desde,
    comision: comisionDe(s.usd),
    texto: `${s.desde ? "desde " : ""}${usdFino(comisionDe(s.usd))}`,
  }));
}

/** ¿Cumple el mínimo mensual? */
export const cumpleMinimo = (proyectosCobradosEnElMes: number): boolean => proyectosCobradosEnElMes >= MIN_PROYECTOS_MES;

/** Código de vendedor: letras y números, sin ambigüedades (sin 0/O/1/I). */
export const CODIGO_VENDEDOR = /^[A-HJ-NP-Z2-9]{6}$/;
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function generarCodigo(aleatorio: (max: number) => number = (m) => Math.floor(Math.random() * m)): string {
  let c = "";
  for (let i = 0; i < 6; i++) c += ALFABETO[aleatorio(ALFABETO.length)];
  return c;
}
export const codigoValido = (v: unknown): v is string => typeof v === "string" && CODIGO_VENDEDOR.test(v.toUpperCase());

export type Postulacion = { nombre: string; contacto: string; email: string | null; telefono: string | null; motivo: string; acepta: true };
export type ResultadoPostulacion = { ok: true; datos: Postulacion } | { ok: false; spam: boolean; errores: Partial<Record<"nombre" | "contacto" | "motivo" | "acepta", string>> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const t = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Valida la postulación de un vendedor (cliente y servidor). No pide datos financieros ni documentos. */
export function validarPostulacion(e: Record<string, unknown>): ResultadoPostulacion {
  if (typeof e.web === "string" && e.web.trim() !== "") return { ok: false, spam: true, errores: {} };
  const errores: Partial<Record<"nombre" | "contacto" | "motivo" | "acepta", string>> = {};
  const nombre = t(e.nombre, 120);
  const contacto = t(e.contacto, 160);
  const motivo = t(e.motivo, 1500);
  if (nombre.length < 2) errores.nombre = "Escribí tu nombre.";
  let email: string | null = null;
  let telefono: string | null = null;
  if (EMAIL.test(contacto)) email = contacto.toLowerCase();
  else if (/^[\d\s+()\-.]+$/.test(contacto) && contacto.replace(/\D/g, "").length >= 8 && contacto.replace(/\D/g, "").length <= 15) telefono = contacto;
  else errores.contacto = "Pasame un mail o un WhatsApp para poder responderte.";
  if (motivo.length < 10) errores.motivo = "Contame en una o dos líneas por qué te interesa o qué experiencia tenés vendiendo.";
  if (e.acepta !== true && e.acepta !== "on" && e.acepta !== "true") errores.acepta = "Necesito que aceptes que use tus datos para responderte.";
  if (Object.keys(errores).length) return { ok: false, spam: false, errores };
  return { ok: true, datos: { nombre, contacto, email, telefono, motivo, acepta: true } };
}
