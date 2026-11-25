/* Outbound: plantillas con tokens y reglas que protegen la casilla (tope diario, lista de bajas, horario, frecuencia).
   Lógica pura y con tests. Los precios NUNCA se escriben en las plantillas: se usan {{precio:landing|web|sistema}}. */
import { CATALOGO, CONDICIONES_WEB, precioTexto, type ServicioId } from "./catalogo.ts";

/** Tope duro: aunque OUTBOUND_TOPE_DIA diga más, no se pasa de acá. */
export const TOPE_MAXIMO_DIA = 40;
export const TOPE_POR_DEFECTO = 15;
export const MAX_SEGUIMIENTOS = 3;
export const DIAS_ENTRE_SEGUIMIENTOS = 3;

export function topeDiario(env: string | undefined = process.env.OUTBOUND_TOPE_DIA): number {
  const n = Number(env);
  if (!Number.isFinite(n) || n < 0) return TOPE_POR_DEFECTO;
  return Math.min(Math.floor(n), TOPE_MAXIMO_DIA);
}

export type ResultadoRender = { texto: string; faltan: string[] };

/** Reemplaza {{variable}} y {{precio:servicio}}. Lo que falte queda a la vista en `faltan` (nunca se envía así). */
/** Condiciones de la web a medida, desde el catálogo: {{pago_web}} y {{plazo_web}}. */
const CONDICIONES: Record<string, string> = {
  pago_web: `${CONDICIONES_WEB.seniaInicioPct}% al arrancar y ${CONDICIONES_WEB.pagoAlPublicarPct}% al publicar`,
  plazo_web: `${CONDICIONES_WEB.plazoDiasHabiles} días hábiles`,
  incluye_web: `${CONDICIONES_WEB.incluye} y ${CONDICIONES_WEB.rondasDeCambios} rondas de cambios`,
};

export function renderizar(plantilla: string, datos: Record<string, string | undefined>): ResultadoRender {
  const faltan = new Set<string>();
  const texto = plantilla.replace(/\{\{\s*([a-z_]+)(?::([a-z]+))?\s*\}\}/gi, (crudo, clave: string, arg?: string) => {
    if (clave === "precio") {
      const s = CATALOGO.find((x) => x.id === (arg as ServicioId));
      if (!s) {
        faltan.add(crudo);
        return crudo;
      }
      return precioTexto(s);
    }
    if (CONDICIONES[clave]) return CONDICIONES[clave];
    const v = datos[clave];
    if (v === undefined || v.trim() === "") {
      faltan.add(`{{${clave}}}`);
      return crudo;
    }
    return v.trim();
  });
  return { texto, faltan: [...faltan] };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const emailValido = (e: string): boolean => EMAIL.test(e);

/** Día de la semana (1 = lunes … 7 = domingo) y hora en Argentina. */
export function momentoArgentina(ahora: Date): { dia: number; hora: number } {
  const partes = new Intl.DateTimeFormat("en-US", { timeZone: "America/Argentina/Buenos_Aires", weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(ahora);
  const dia = ({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 } as Record<string, number>)[partes.find((p) => p.type === "weekday")?.value ?? ""] ?? 0;
  const hora = Number(partes.find((p) => p.type === "hour")?.value ?? -1);
  return { dia, hora };
}

/** Lunes a viernes de 9 a 18 h (hora de Argentina). */
export function enHorarioDeEnvio(ahora: Date): boolean {
  const { dia, hora } = momentoArgentina(ahora);
  return dia >= 1 && dia <= 5 && hora >= 9 && hora < 18;
}

export type TipoEnvio = "frio" | "seguimiento" | "respuesta";

export type EntradaEnvio = {
  ahora: Date;
  destino: string;
  tipo: TipoEnvio;
  /** Emails en la lista de bajas (en minúscula). */
  bajas: ReadonlySet<string>;
  /** Mails ya enviados hoy (todos los contactos). */
  enviadosHoy: number;
  tope?: number;
  /** Mails ya enviados antes a este contacto (frío + seguimientos). */
  enviosPrevios: number;
  /** Fecha del último mail a este contacto, si hubo. */
  ultimoEnvio: Date | null;
};

export type Veredicto = { ok: true } | { ok: false; motivo: string };

/** ¿Se puede mandar este mail ahora? Devuelve el motivo exacto si no. Las respuestas a quien escribió primero saltean frecuencia y horario. */
export function evaluarEnvio(e: EntradaEnvio): Veredicto {
  const destino = e.destino.trim().toLowerCase();
  if (!emailValido(destino)) return { ok: false, motivo: "El mail no es válido." };
  if (e.bajas.has(destino)) return { ok: false, motivo: "Está en la lista de bajas: no se le escribe más." };
  const tope = Math.min(e.tope ?? topeDiario(), TOPE_MAXIMO_DIA);
  if (e.enviadosHoy >= tope) return { ok: false, motivo: `Tope diario alcanzado (${tope}).` };
  if (e.tipo === "respuesta") return { ok: true };
  if (!enHorarioDeEnvio(e.ahora)) return { ok: false, motivo: "Fuera de horario (lunes a viernes de 9 a 18 h)." };
  if (e.tipo === "frio") {
    if (e.enviosPrevios > 0) return { ok: false, motivo: "Ya se le escribió: corresponde un seguimiento, no un mail en frío." };
    return { ok: true };
  }
  if (e.enviosPrevios === 0) return { ok: false, motivo: "Todavía no hubo un primer mail: no corresponde un seguimiento." };
  if (e.enviosPrevios > MAX_SEGUIMIENTOS) return { ok: false, motivo: `Ya recibió el primer mail y ${MAX_SEGUIMIENTOS} seguimientos: se cierra.` };
  if (e.ultimoEnvio) {
    const dias = (e.ahora.getTime() - e.ultimoEnvio.getTime()) / 86_400_000;
    if (dias < DIAS_ENTRE_SEGUIMIENTOS) return { ok: false, motivo: `Pasaron menos de ${DIAS_ENTRE_SEGUIMIENTOS} días desde el último mail.` };
  }
  return { ok: true };
}
