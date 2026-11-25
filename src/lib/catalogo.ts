/**
 * ÚNICA fuente de precios y condiciones de valentin.dev.
 * Ningún otro archivo del repo escribe un precio a mano: todos importan de acá.
 * (src/lib/catalogo.test.ts falla si aparece un "US$ <número>" fuera de este archivo.)
 */

/** Nunca se vende por menos de este monto. */
export const PRECIO_MINIMO_USD = 350;

export type ServicioId = "landing" | "web" | "sistema";

export type Servicio = {
  id: ServicioId;
  nombre: string;
  /** Monto en dólares. */
  usd: number;
  /** true = "desde": el precio final depende del alcance. */
  desde: boolean;
  resumen: string;
};

export const CATALOGO: readonly Servicio[] = [
  {
    id: "landing",
    nombre: "Landing",
    usd: 350,
    desde: false,
    resumen: "Una página para presentar tu negocio y que te escriban.",
  },
  {
    id: "web",
    nombre: "Web a medida con sistema de consultas",
    usd: 450,
    desde: false,
    resumen: "Sitio completo; cada consulta queda guardada y te llega un aviso por mail.",
  },
  {
    id: "sistema",
    nombre: "CRM o agente de voz",
    usd: 900,
    desde: true,
    resumen: "Sistemas a medida para ordenar tus contactos o atender llamadas.",
  },
] as const;

/** Condiciones de la web a medida con sistema de consultas. */
export const CONDICIONES_WEB = {
  seniaInicioPct: 50,
  pagoAlPublicarPct: 50,
  plazoDiasHabiles: 5,
  rondasDeCambios: 2,
  incluye: "dominio y hosting el primer año",
} as const;

export function servicioPorId(id: ServicioId): Servicio {
  const s = CATALOGO.find((x) => x.id === id);
  if (!s) throw new Error(`Servicio desconocido: ${id}`);
  return s;
}

/** "US$450" / "US$1.200" (separador de miles argentino). */
export function usd(monto: number): string {
  return `US$${monto.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

/** "US$350" o "desde US$900". */
export function precioTexto(s: Servicio): string {
  return s.desde ? `desde ${usd(s.usd)}` : usd(s.usd);
}

/** Importe de cada pago de la web a medida, calculado desde el catálogo. */
export function pagosWeb(): { inicio: number; publicar: number } {
  const total = servicioPorId("web").usd;
  return {
    inicio: Math.round((total * CONDICIONES_WEB.seniaInicioPct) / 100),
    publicar: Math.round((total * CONDICIONES_WEB.pagoAlPublicarPct) / 100),
  };
}

/** Línea corta con los tres precios, para hero, metadatos y llms.txt. */
export function resumenPrecios(): string {
  return CATALOGO.map((s) => `${s.nombre}: ${precioTexto(s)}`).join(" · ");
}
