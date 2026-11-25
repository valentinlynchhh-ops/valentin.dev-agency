/* Cotizador: arma el pedido de una web y calcula lo que SE PUEDE afirmar con datos del catálogo.
   El precio base sale de catalogo.ts. Lo que no tiene precio definido NUNCA se inventa: queda "a evaluar" y se
   confirma en la propuesta. Lógica pura (cliente y servidor) con tests. */
import { CATALOGO, CONDICIONES_WEB, pagosWeb, precioTexto, servicioPorId, usd, type ServicioId } from "./catalogo.ts";

export const RUBROS = [
  "Estudio jurídico",
  "Estudio contable",
  "Inmobiliaria",
  "Salud y consultorios",
  "Tienda o marca de producto",
  "Gastronomía",
  "Servicios profesionales",
  "Arquitectura y diseño",
  "Otro rubro",
] as const;

export type FuncionId = "whatsapp" | "formulario" | "consultas" | "turnos" | "tienda" | "blog" | "idiomas" | "panel" | "crm" | "voz" | "integraciones";

export type Funcion = { id: FuncionId; etiqueta: string; detalle: string; para: readonly ServicioId[] };

export const FUNCIONES: readonly Funcion[] = [
  { id: "whatsapp", etiqueta: "Botón de WhatsApp", detalle: "Que te escriban con un toque.", para: ["landing", "web"] },
  { id: "formulario", etiqueta: "Formulario de contacto", detalle: "Para pedir información o presupuesto.", para: ["landing", "web"] },
  { id: "consultas", etiqueta: "Consultas guardadas con aviso por mail", detalle: "Cada mensaje queda registrado y te llega un aviso.", para: ["web"] },
  { id: "turnos", etiqueta: "Reserva de turnos online", detalle: "Que elijan día y horario desde la web.", para: ["landing", "web", "sistema"] },
  { id: "tienda", etiqueta: "Tienda con pagos", detalle: "Catálogo y cobro online (ej. Mercado Pago).", para: ["web", "sistema"] },
  { id: "blog", etiqueta: "Blog o notas", detalle: "Para publicar contenido.", para: ["web"] },
  { id: "idiomas", etiqueta: "Más de un idioma", detalle: "Español y otro idioma.", para: ["landing", "web"] },
  { id: "panel", etiqueta: "Panel para editar el contenido", detalle: "Que puedas cambiar textos y fotos vos.", para: ["web", "sistema"] },
  { id: "crm", etiqueta: "CRM de contactos", detalle: "Contactos, estado de cada venta, notas y próximas acciones.", para: ["sistema"] },
  { id: "voz", etiqueta: "Agente de voz", detalle: "Para atender llamadas.", para: ["sistema"] },
  { id: "integraciones", etiqueta: "Integración con otras herramientas", detalle: "Planillas, mail, calendario, etc.", para: ["web", "sistema"] },
];

/** Funciones que ya vienen incluidas en el servicio, según lo publicado en SERVICIOS_DETALLE. */
const INCLUIDAS: Record<ServicioId, readonly FuncionId[]> = {
  landing: ["whatsapp", "formulario"],
  web: ["whatsapp", "formulario", "consultas"],
  sistema: ["crm", "voz"],
};

export const PLAZOS = [
  { valor: "ya", etiqueta: "Lo antes posible" },
  { valor: "mes", etiqueta: "En el mes" },
  { valor: "sin-apuro", etiqueta: "Sin apuro" },
] as const;

export const PAGINAS_APROX = [
  { valor: "1", etiqueta: "Una sola página" },
  { valor: "2-5", etiqueta: "De 2 a 5 páginas" },
  { valor: "6-10", etiqueta: "De 6 a 10 páginas" },
  { valor: "+10", etiqueta: "Más de 10" },
] as const;

export type Seleccion = {
  servicio: ServicioId;
  rubro: string;
  funciones: FuncionId[];
  paginas: string;
  materiales: "tengo" | "ayuda";
  referencias: string;
  plazo: string;
};

export type Cotizacion = {
  servicio: { id: ServicioId; nombre: string };
  precioBase: string;
  esDesde: boolean;
  condiciones: string[];
  incluidas: string[];
  aEvaluar: string[];
  nota: string;
};

const etiquetaDe = (id: FuncionId) => FUNCIONES.find((f) => f.id === id)?.etiqueta ?? id;

/** Lo que se puede afirmar: precio base del catálogo, qué viene incluido y qué se evalúa aparte. */
export function armarCotizacion(sel: Seleccion): Cotizacion {
  const s = servicioPorId(sel.servicio);
  const incluidasIds = new Set(INCLUIDAS[sel.servicio]);
  const permitidas = new Set(FUNCIONES.filter((f) => f.para.includes(sel.servicio)).map((f) => f.id));
  const elegidas = sel.funciones.filter((f) => permitidas.has(f));
  const incluidas = [...new Set([...INCLUIDAS[sel.servicio], ...elegidas.filter((f) => incluidasIds.has(f))])].map(etiquetaDe);
  const aEvaluar = elegidas.filter((f) => !incluidasIds.has(f)).map(etiquetaDe);
  const condiciones: string[] = [];
  if (sel.servicio === "web") {
    const p = pagosWeb();
    condiciones.push(
      `Pago: ${CONDICIONES_WEB.seniaInicioPct}% al arrancar (${usd(p.inicio)}) y ${CONDICIONES_WEB.pagoAlPublicarPct}% al publicar (${usd(p.publicar)})`,
      `Plazo: ${CONDICIONES_WEB.plazoDiasHabiles} días hábiles`,
      `Incluye ${CONDICIONES_WEB.incluye} y ${CONDICIONES_WEB.rondasDeCambios} rondas de cambios`,
    );
  }
  if (s.desde) condiciones.push('El precio es "desde": el final depende del alcance y se acuerda antes de empezar');
  return {
    servicio: { id: s.id, nombre: s.nombre },
    precioBase: precioTexto(s),
    esDesde: s.desde,
    condiciones,
    incluidas,
    aEvaluar,
    nota: aEvaluar.length
      ? "Lo que figura como «a evaluar» lo reviso y te confirmo, en la propuesta, si entra en el precio base o se cotiza aparte."
      : "Te confirmo el alcance y el precio final en la propuesta.",
  };
}

/** Texto plano del pedido (para el mail de aviso, la nota del CRM y el mensaje de WhatsApp). */
export function resumenTexto(sel: Seleccion, c: Cotizacion): string {
  const lineas = [
    `Servicio: ${c.servicio.nombre} — ${c.precioBase}`,
    `Rubro: ${sel.rubro}`,
    `Páginas: ${PAGINAS_APROX.find((p) => p.valor === sel.paginas)?.etiqueta ?? sel.paginas}`,
    `Materiales: ${sel.materiales === "tengo" ? "tiene logo y fotos" : "necesita ayuda con logo y fotos"}`,
    `Plazo: ${PLAZOS.find((p) => p.valor === sel.plazo)?.etiqueta ?? sel.plazo}`,
  ];
  if (c.incluidas.length) lineas.push(`Incluido: ${c.incluidas.join(", ")}`);
  if (c.aEvaluar.length) lineas.push(`A evaluar: ${c.aEvaluar.join(", ")}`);
  if (sel.referencias) lineas.push(`Referencias: ${sel.referencias}`);
  return lineas.join("\n");
}

const SERVICIOS = CATALOGO.map((s) => s.id) as readonly string[];
const txt = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export type ResultadoSeleccion = { ok: true; seleccion: Seleccion } | { ok: false; error: string };

/** Valida y normaliza una selección que llega de afuera. */
export function leerSeleccion(x: unknown): ResultadoSeleccion {
  const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
  if (typeof o.servicio !== "string" || !SERVICIOS.includes(o.servicio)) return { ok: false, error: "Elegí qué tipo de web necesitás." };
  const servicio = o.servicio as ServicioId;
  const rubro = txt(o.rubro, 60);
  if (!(RUBROS as readonly string[]).includes(rubro)) return { ok: false, error: "Elegí tu rubro." };
  const validas = new Set(FUNCIONES.filter((f) => f.para.includes(servicio)).map((f) => f.id as string));
  const funciones = (Array.isArray(o.funciones) ? o.funciones : []).filter((f): f is FuncionId => typeof f === "string" && validas.has(f));
  const paginas = PAGINAS_APROX.find((p) => p.valor === o.paginas)?.valor ?? "2-5";
  const plazo = PLAZOS.find((p) => p.valor === o.plazo)?.valor ?? "mes";
  return {
    ok: true,
    seleccion: {
      servicio,
      rubro,
      funciones: [...new Set(funciones)],
      paginas,
      materiales: o.materiales === "tengo" ? "tengo" : "ayuda",
      referencias: txt(o.referencias, 600),
      plazo,
    },
  };
}
