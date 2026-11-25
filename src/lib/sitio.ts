/**
 * Fuente de verdad del sitio: páginas, textos, trabajos, pasos y preguntas.
 * De acá salen las páginas, los metadatos, el JSON-LD, el sitemap y llms.txt.
 * Los precios NO se escriben acá: salen de catalogo.ts.
 */
import { CATALOGO, CONDICIONES_WEB, PRECIO_MINIMO_USD, pagosWeb, precioTexto, servicioPorId, usd } from "./catalogo.ts";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://valentin.dev").replace(/\/$/, "");

export const MARCA = {
  nombre: "valentin.dev",
  /** Una línea: qué es esto. */
  lema: "Diseño y desarrollo web para negocios de Argentina. Sin intermediarios.",
  descripcion:
    "Páginas web, landings y sistemas a medida para negocios y profesionales de Argentina. Hablás directo con quien las diseña y las programa.",
  idioma: "es-AR",
  pais: "AR",
} as const;

export type Pagina = {
  ruta: string;
  /** Texto de la pestaña y del resultado de búsqueda (≤ 60 caracteres). */
  titulo: string;
  /** Descripción para buscadores y redes (≤ 155 caracteres). */
  descripcion: string;
  /** Etiqueta del menú. */
  nav: string;
  prioridad: number;
};

export const PAGINAS: readonly Pagina[] = [
  {
    ruta: "/",
    titulo: "valentin.dev · Diseño y desarrollo digital",
    descripcion: `Diseño y programo webs, landings y sistemas para negocios de Argentina. Landing ${precioTexto(servicioPorId("landing"))}, web con consultas ${precioTexto(servicioPorId("web"))}.`,
    nav: "Inicio",
    prioridad: 1,
  },
  {
    ruta: "/servicios",
    titulo: "Servicios · valentin.dev",
    descripcion: "Landings, webs a medida con sistema de consultas, CRM y agentes de voz. Qué incluye cada servicio y para quién es.",
    nav: "Servicios",
    prioridad: 0.9,
  },
  {
    ruta: "/precios",
    titulo: "Precios en dólares · valentin.dev",
    descripcion: `Landing ${precioTexto(servicioPorId("landing"))}, web a medida ${precioTexto(servicioPorId("web"))}, CRM o agente de voz ${precioTexto(servicioPorId("sistema"))}. Cómo se paga y qué incluye.`,
    nav: "Precios",
    prioridad: 0.9,
  },
  {
    ruta: "/como-trabajamos",
    titulo: "Cómo trabajo · valentin.dev",
    descripcion: "Cuatro pasos, 5 días hábiles y dos rondas de cambios para la web a medida. Qué pasa desde que me escribís hasta que se publica.",
    nav: "Cómo trabajo",
    prioridad: 0.7,
  },
  {
    ruta: "/preguntas-frecuentes",
    titulo: "Preguntas frecuentes · valentin.dev",
    descripcion: "Precio, plazos, pagos, dominio, hosting y cambios. Las dudas de siempre antes de contratar una web, contestadas claro.",
    nav: "Preguntas",
    prioridad: 0.6,
  },
  {
    ruta: "/museo",
    titulo: "Museo de trabajos · valentin.dev",
    descripcion: "Un recorrido por las salas del museo: cada sitio que diseñé y desarrollé, con su vista en escritorio y celular y un link para visitarlo.",
    nav: "Museo",
    prioridad: 0.7,
  },
  {
    ruta: "/cotizar",
    titulo: "Cotizá tu web · valentin.dev",
    descripcion: "Armá tu web en 4 pasos: tipo de sitio, funciones y detalles. Ves el precio base al instante y me llega tu pedido.",
    nav: "Cotizar",
    prioridad: 0.9,
  },
  {
    ruta: "/vendedores",
    titulo: "Vendedores · valentin.dev",
    descripcion: "Revendé mis webs y sistemas a medida y cobrá comisión sobre cada proyecto cobrado. Condiciones claras y postulación online.",
    nav: "Vendedores",
    prioridad: 0.7,
  },
  {
    ruta: "/recursos",
    titulo: "Recursos · valentin.dev",
    descripcion: "Todo lo útil en un solo lugar: cotizador, precios, preguntas frecuentes, cómo trabajo y el museo de trabajos.",
    nav: "Recursos",
    prioridad: 0.5,
  },
  {
    ruta: "/contacto",
    titulo: "Contacto · valentin.dev",
    descripcion: "Contame qué necesitás. Te respondo yo, sin intermediarios.",
    nav: "Contacto",
    prioridad: 0.8,
  },
] as const;

export function paginaPorRuta(ruta: string): Pagina {
  const p = PAGINAS.find((x) => x.ruta === ruta);
  if (!p) throw new Error(`Página desconocida: ${ruta}`);
  return p;
}

/* ------------------------------ Trabajos reales ------------------------------ */

export type Trabajo = {
  id: string;
  nombre: string;
  url: string;
  host: string;
  categoria: string;
  /** Una oración, solo lo que se puede comprobar entrando al sitio. */
  descripcion: string;
  /** Descripción corta para la cartela del museo. */
  corta: string;
  incluye: readonly string[];
  /** Vista vertical 390×506 (tarjetas y marcos). */
  imagenCard: string;
  imagenEscritorio: string;
  imagenCelular: string;
  altImagen: string;
};

/** Solo sitios cuya autoría y URL están confirmadas. Estudio Saucedo (que aparece en la maqueta) queda afuera hasta confirmarlo. */
export const TRABAJOS: readonly Trabajo[] = [
  {
    id: "rydabogados",
    nombre: "R&D Abogados",
    url: "https://rydabogados.com.ar",
    host: "rydabogados.com.ar",
    categoria: "Estudio jurídico",
    descripcion: "Sitio institucional de un estudio jurídico de Buenos Aires: áreas de práctica, jurisdicciones y formulario de contacto.",
    corta: "Web institucional para estudio jurídico.",
    incluye: ["Áreas de práctica", "Jurisdicciones", "Formulario con motivo de contacto"],
    imagenCard: "/trabajos/rydabogados-card.jpg",
    imagenEscritorio: "/trabajos/rydabogados-esc.jpg",
    imagenCelular: "/trabajos/rydabogados-cel.jpg",
    altImagen: "Captura de la portada de rydabogados.com.ar",
  },
  {
    id: "masegosa",
    nombre: "Melisa Masegosa",
    url: "https://abogadamasegosa.com",
    host: "abogadamasegosa.com",
    categoria: "Abogada · Pilar y CABA",
    descripcion: "Sitio personal de una abogada con reserva de turnos online y consulta directa por WhatsApp.",
    corta: "Marca personal y turnos online.",
    incluye: ["Agenda de turnos online", "Consulta por WhatsApp", "Preguntas frecuentes"],
    imagenCard: "/trabajos/masegosa-card.jpg",
    imagenEscritorio: "/trabajos/masegosa-esc.jpg",
    imagenCelular: "/trabajos/masegosa-cel.jpg",
    altImagen: "Captura de la portada de abogadamasegosa.com",
  },
  {
    id: "rebloom",
    nombre: "Rebloom Active",
    url: "https://rebloomactive.com",
    host: "rebloomactive.com",
    categoria: "Ropa de Pilates · tienda",
    descripcion: "Sitio de una marca de ropa de Pilates: lookbook, guía de talles, preventa con reserva y pago con Mercado Pago.",
    corta: "Tienda de ropa de Pilates con preventa.",
    incluye: ["Lookbook y fichas de producto", "Guía de talles", "Reserva y pago con Mercado Pago"],
    imagenCard: "/trabajos/rebloom-card.jpg",
    imagenEscritorio: "/trabajos/rebloom-esc.jpg",
    imagenCelular: "/trabajos/rebloom-cel.jpg",
    altImagen: "Captura de la portada de rebloomactive.com",
  },
  {
    id: "getzleads",
    nombre: "Get Z Leads",
    url: "https://getzleads.com",
    host: "getzleads.com",
    categoria: "Producto propio · plataforma B2B",
    descripcion: "Plataforma propia de prospección B2B: bases de negocios locales a pedido, con muestra gratis.",
    corta: "Plataforma de prospección B2B.",
    incluye: ["Bases de negocios a pedido", "Muestra gratis", "Mini CRM para trabajar la base"],
    imagenCard: "/trabajos/getzleads-card.jpg",
    imagenEscritorio: "/trabajos/getzleads-esc.jpg",
    imagenCelular: "/trabajos/getzleads-cel.jpg",
    altImagen: "Captura de la portada de getzleads.com",
  },
] as const;

/* --------------------------------- Servicios --------------------------------- */

export type ServicioDetalle = {
  id: "landing" | "web" | "sistema";
  nombre: string;
  paraQuien: string;
  entregables: readonly string[];
  nota?: string;
};

export const SERVICIOS_DETALLE: readonly ServicioDetalle[] = [
  {
    id: "landing",
    nombre: "Landing",
    paraQuien: "Para el negocio o profesional que necesita una página clara para mostrar lo que hace y que lo contacten.",
    entregables: [
      "Una página diseñada a medida, pensada primero para el celular",
      "Botón de WhatsApp y formulario de contacto",
      "Títulos y descripciones para que Google la entienda",
    ],
  },
  {
    id: "web",
    nombre: "Web a medida con sistema de consultas",
    paraQuien: "Para quien necesita un sitio completo con varias secciones y no perder ninguna consulta.",
    entregables: [
      "Sitio de varias páginas, diseñado y programado a medida",
      "Formulario de consultas: cada mensaje queda guardado y te llega un aviso por mail",
      `${CONDICIONES_WEB.incluye.charAt(0).toUpperCase()}${CONDICIONES_WEB.incluye.slice(1)}`,
      `${CONDICIONES_WEB.rondasDeCambios} rondas de cambios`,
    ],
    nota: `Se entrega en ${CONDICIONES_WEB.plazoDiasHabiles} días hábiles.`,
  },
  {
    id: "sistema",
    nombre: "CRM o agente de voz",
    paraQuien: "Para el negocio que ya tiene clientes y quiere ordenarlos, o atender llamadas sin perder ninguna.",
    entregables: [
      "CRM a medida: contactos, estado de cada venta, notas y próximas acciones",
      "Agente de voz para atender llamadas",
      "Alcance definido con vos antes de arrancar",
    ],
    nota: "El precio es \"desde\": el final depende del alcance y se acuerda antes de empezar.",
  },
] as const;

/* ---------------------------------- Proceso ---------------------------------- */

export type Paso = { n: string; titulo: string; texto: string };

export const PASOS: readonly Paso[] = [
  {
    n: "01",
    titulo: "Me contás qué necesitás",
    texto: "Por el formulario o por WhatsApp. Con unas líneas alcanza: qué hacés, a quién le vendés y qué querés lograr con la web.",
  },
  {
    n: "02",
    titulo: "Propuesta y arranque",
    texto: `Te paso el alcance y el precio cerrado. Al aceptar, se abona el ${CONDICIONES_WEB.seniaInicioPct}% (${usd(pagosWeb().inicio)} en la web a medida) y empiezo.`,
  },
  {
    n: "03",
    titulo: "Lo diseño y lo programo",
    texto: `En ${CONDICIONES_WEB.plazoDiasHabiles} días hábiles tenés la web lista para revisar. Hay ${CONDICIONES_WEB.rondasDeCambios} rondas de cambios.`,
  },
  {
    n: "04",
    titulo: "Se publica",
    texto: `Al publicar se abona el ${CONDICIONES_WEB.pagoAlPublicarPct}% restante (${usd(pagosWeb().publicar)}). Dominio y hosting del primer año quedan incluidos.`,
  },
] as const;

/* -------------------------------- Preguntas -------------------------------- */

export type Pregunta = { q: string; a: string };

export const FAQ: readonly Pregunta[] = [
  {
    q: "¿Cuánto sale una web?",
    a: `Una landing sale ${precioTexto(servicioPorId("landing"))} y una web a medida con sistema de consultas ${precioTexto(servicioPorId("web"))}. Un CRM o un agente de voz, ${precioTexto(servicioPorId("sistema"))} según el alcance. Los precios son en dólares y nunca trabajo por menos de ${usd(PRECIO_MINIMO_USD)}.`,
  },
  {
    q: "¿Cuánto tarda?",
    a: `La web a medida con sistema de consultas se entrega en ${CONDICIONES_WEB.plazoDiasHabiles} días hábiles desde que arrancamos. Para el resto, el plazo se acuerda en la propuesta.`,
  },
  {
    q: "¿Cómo se paga?",
    a: `En la web a medida, el ${CONDICIONES_WEB.seniaInicioPct}% al arrancar (${usd(pagosWeb().inicio)}) y el ${CONDICIONES_WEB.pagoAlPublicarPct}% al publicar (${usd(pagosWeb().publicar)}).`,
  },
  {
    q: "¿Qué incluye el precio de la web a medida?",
    a: `${CONDICIONES_WEB.incluye.charAt(0).toUpperCase()}${CONDICIONES_WEB.incluye.slice(1)}, ${CONDICIONES_WEB.rondasDeCambios} rondas de cambios y el formulario de consultas que guarda cada mensaje y te avisa por mail.`,
  },
  {
    q: "¿Cuántos cambios puedo pedir?",
    a: `La web a medida incluye ${CONDICIONES_WEB.rondasDeCambios} rondas de cambios. Si necesitás más, lo hablamos antes de hacerlos.`,
  },
  {
    q: "¿Quién la hace?",
    a: "Yo. Diseño, programo y publico. No hay intermediarios ni equipos en el medio: lo que hablás conmigo es lo que se construye.",
  },
  {
    q: "¿Puedo ver trabajos tuyos?",
    a: "Sí, en el museo de trabajos hay sitios publicados con el link para entrar y verlos en vivo.",
  },
] as const;

/* ---------------------------------- Contacto ---------------------------------- */

/** Contacto público: lo pasó Valentín el 25/11/2026 para publicar en el sitio. Redes sociales: ninguna confirmada, no se muestran. */
export const EMAIL_PUBLICO = "valentinlynch7@gmail.com";
export const WHATSAPP_VISIBLE = "+54 9 11 5809-2000";

export const TIPOS_CONSULTA = [
  { valor: "landing", etiqueta: "Una landing" },
  { valor: "web", etiqueta: "Una web con sistema de consultas" },
  { valor: "sistema", etiqueta: "Un CRM o agente de voz" },
  { valor: "no-se", etiqueta: "No sé, quiero que me orientes" },
] as const;

export type TipoConsulta = (typeof TIPOS_CONSULTA)[number]["valor"];

/** Tipos que no se eligen en el formulario corto pero también quedan guardados (reunión pedida y cotización armada). */
export const TIPOS_GUARDADOS = [...TIPOS_CONSULTA.map((t) => t.valor), "reunion", "cotizacion"] as const;
export const ETIQUETA_TIPO: Record<string, string> = {
  ...Object.fromEntries(TIPOS_CONSULTA.map((t) => [t.valor, t.etiqueta])),
  reunion: "Pidió una reunión",
  cotizacion: "Armó una cotización",
};

export const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || "5491158092000").replace(/\D/g, "");

export function linkWhatsApp(texto = "Hola, te escribo desde valentin.dev. Quería consultarte por una web."): string | null {
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}` : null;
}

export { CATALOGO };
