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
    titulo: "valentin.dev · Webs y sistemas a medida en Argentina",
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
    ruta: "/trabajos",
    titulo: "Trabajos reales · valentin.dev",
    descripcion: "Sitios publicados: un estudio jurídico, una abogada en Pilar y una marca de ropa de Pilates. Con links para verlos en vivo.",
    nav: "Trabajos",
    prioridad: 0.8,
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
  /** Qué se ve: lo que tiene el sitio publicado. */
  incluye: readonly string[];
  imagenEscritorio: string;
  imagenCelular: string;
  altImagen: string;
};

export const TRABAJOS: readonly Trabajo[] = [
  {
    id: "rydabogados",
    nombre: "R&D Abogados",
    url: "https://rydabogados.com.ar",
    host: "rydabogados.com.ar",
    categoria: "Estudio jurídico",
    descripcion: "Sitio institucional de un estudio jurídico de Buenos Aires: áreas de práctica, jurisdicciones y formulario de contacto.",
    incluye: ["Áreas de práctica", "Jurisdicciones", "Formulario con motivo de contacto"],
    imagenEscritorio: "/trabajos/rydabogados-esc.jpg",
    imagenCelular: "/trabajos/rydabogados-cel.jpg",
    altImagen: "Captura de la portada de rydabogados.com.ar",
  },
  {
    id: "masegosa",
    nombre: "Melisa Masegosa, abogada",
    url: "https://abogadamasegosa.com",
    host: "abogadamasegosa.com",
    categoria: "Abogada · Pilar y CABA",
    descripcion: "Sitio personal de una abogada con reserva de turnos online y consulta directa por WhatsApp.",
    incluye: ["Agenda de turnos online", "Consulta por WhatsApp", "Preguntas frecuentes"],
    imagenEscritorio: "/trabajos/masegosa-esc.jpg",
    imagenCelular: "/trabajos/masegosa-cel.jpg",
    altImagen: "Captura de la portada de abogadamasegosa.com",
  },
  {
    id: "rebloom",
    nombre: "REBLOOM",
    url: "https://rebloomactive.com",
    host: "rebloomactive.com",
    categoria: "Ropa de Pilates · tienda",
    descripcion: "Sitio de una marca de ropa de Pilates: lookbook, guía de talles, preventa con reserva y pago con Mercado Pago.",
    incluye: ["Lookbook y fichas de producto", "Guía de talles", "Reserva y pago con Mercado Pago"],
    imagenEscritorio: "/trabajos/rebloom-esc.jpg",
    imagenCelular: "/trabajos/rebloom-cel.jpg",
    altImagen: "Captura de la portada de rebloomactive.com",
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
    a: "Sí, en la sección de trabajos hay sitios publicados con el link para entrar y verlos en vivo.",
  },
] as const;

/* ---------------------------------- Contacto ---------------------------------- */

export const TIPOS_CONSULTA = [
  { valor: "landing", etiqueta: "Una landing" },
  { valor: "web", etiqueta: "Una web con sistema de consultas" },
  { valor: "sistema", etiqueta: "Un CRM o agente de voz" },
  { valor: "no-se", etiqueta: "No sé, quiero que me orientes" },
] as const;

export type TipoConsulta = (typeof TIPOS_CONSULTA)[number]["valor"];

export const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");

export function linkWhatsApp(texto = "Hola, te escribo desde valentin.dev. Quería consultarte por una web."): string | null {
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}` : null;
}

export { CATALOGO };
