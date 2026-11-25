/* Lógica pura del CRM (sin base de datos): estados, fechas, tablero del día y links de contacto. Con tests. */

export const ESTADOS = ["nuevo", "contactado", "muestra_enviada", "propuesta", "senia", "entregado", "perdido"] as const;
export type Estado = (typeof ESTADOS)[number];

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  muestra_enviada: "Muestra enviada",
  propuesta: "Propuesta",
  senia: "Seña",
  entregado: "Entregado",
  perdido: "Perdido",
};

export const esEstado = (v: unknown): v is Estado => typeof v === "string" && (ESTADOS as readonly string[]).includes(v);

/** Siguiente paso natural de una venta (null si ya terminó o se perdió). */
export function siguienteEstado(e: Estado): Estado | null {
  if (e === "entregado" || e === "perdido") return null;
  return ESTADOS[ESTADOS.indexOf(e) + 1] as Estado;
}

export type Origen = "web" | "manual" | "outbound" | "referido";
export const ORIGENES: readonly Origen[] = ["manual", "web", "outbound", "referido"];

export type Contacto = {
  id: string;
  nombre: string;
  empresa: string | null;
  email: string | null;
  telefono: string | null;
  rubro: string | null;
  ciudad: string | null;
  web: string | null;
  instagram: string | null;
  origen: Origen;
  estado: Estado;
  valor_usd: number | null;
  estado_at: string;
  creado_at: string;
  actualizado_at: string;
};

export type Nota = { id: string; contacto_id: string; texto: string; creado_at: string };
export type Accion = { id: string; contacto_id: string; texto: string; vence_el: string; hecha: boolean };
export type AccionConContacto = Accion & { contacto_nombre: string };
export type Consulta = { id: string; tipo: string; mensaje: string; origen: string; creado_at: string };

/** Fecha de hoy en Argentina, "AAAA-MM-DD". */
export function hoyArgentina(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }).format(ahora);
}

/** Suma días a una fecha "AAAA-MM-DD" (sin problemas de zona horaria). */
export function sumarDias(fecha: string, dias: number): string {
  const [a, m, d] = fecha.split("-").map(Number);
  const t = new Date(Date.UTC(a, m - 1, d + dias));
  return t.toISOString().slice(0, 10);
}

export const fechaValida = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

/** "mar 25 nov" para mostrar. */
export function fechaCorta(fecha: string): string {
  const [a, m, d] = fecha.split("-").map(Number);
  return new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(a, m - 1, d)));
}

export type Tablero = {
  vencidas: AccionConContacto[];
  hoy: AccionConContacto[];
  proximas: AccionConContacto[];
};

/** Reparte las acciones pendientes según su fecha respecto de hoy. Las más viejas primero. */
export function clasificarAcciones(acciones: readonly AccionConContacto[], hoy: string): Tablero {
  const pend = acciones.filter((a) => !a.hecha).sort((a, b) => a.vence_el.localeCompare(b.vence_el));
  return {
    vencidas: pend.filter((a) => a.vence_el < hoy),
    hoy: pend.filter((a) => a.vence_el === hoy),
    proximas: pend.filter((a) => a.vence_el > hoy),
  };
}

export function contarPorEstado(contactos: readonly Pick<Contacto, "estado">[]): Record<Estado, number> {
  const r = Object.fromEntries(ESTADOS.map((e) => [e, 0])) as Record<Estado, number>;
  for (const c of contactos) r[c.estado] += 1;
  return r;
}

/** Plata en juego: suma de valores de ventas abiertas (todo menos entregado y perdido). */
export function valorEnJuego(contactos: readonly Pick<Contacto, "estado" | "valor_usd">[]): number {
  return contactos.filter((c) => c.estado !== "entregado" && c.estado !== "perdido").reduce((s, c) => s + (c.valor_usd ?? 0), 0);
}

/** Deja solo dígitos de un teléfono argentino y arma el número para wa.me (54 9 + área + número). */
export function numeroWhatsApp(telefono: string): string | null {
  let d = telefono.replace(/\D/g, "");
  if (d.length < 8) return null;
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("549")) return d;
  if (d.startsWith("54")) return `549${d.slice(2)}`;
  if (d.startsWith("0")) d = d.slice(1);
  d = d.replace(/^(\d{2,4})15(\d{6,8})$/, "$1$2"); // "11 15 1234 5678" → "11 1234 5678"
  return `549${d}`;
}

export function linkWhatsApp(telefono: string | null, texto?: string): string | null {
  if (!telefono) return null;
  const n = numeroWhatsApp(telefono);
  return n ? `https://wa.me/${n}${texto ? `?text=${encodeURIComponent(texto)}` : ""}` : null;
}

export const linkLlamar = (telefono: string | null): string | null => {
  const d = telefono?.replace(/[^\d+]/g, "") ?? "";
  return d.length >= 8 ? `tel:${d}` : null;
};

export const linkMail = (email: string | null): string | null => (email ? `mailto:${email}` : null);

/** Texto de búsqueda seguro para armar filtros (saca los caracteres que rompen la sintaxis del filtro). */
export const limpiarBusqueda = (q: string): string => q.replace(/[%,()*\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
