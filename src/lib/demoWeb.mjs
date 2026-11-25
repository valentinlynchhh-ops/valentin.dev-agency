/* Generador de muestras de web para prospectos (docs/ventas/demo-web.md). JavaScript puro, sin dependencias ni APIs de Node:
   lo usan la ruta /demo/[slug] (arma la página al pedirla cuando en la base hay un JSON) y el script
   scripts/demos/generar.mjs (archivo, SQL y link). Entrada: un JSON con los datos del negocio. Salida: UN HTML autocontenido.

   Reglas de honestidad (no se negocian): solo aparece como hecho lo que viene en el JSON. Sin testimonios, clientes,
   calificaciones, años de experiencia, premios ni cifras inventadas; si falta un dato, la sección no se muestra.
   Todo lo que entra se escapa y las URLs se validan (http/https, wa.me, mailto, tel). */
import { SLUG_DEMO, slugValido } from "./demos.ts";
import { CONDICIONES_WEB } from "./catalogo.ts";

export { SLUG_DEMO, slugValido };

export const SITIO = (process.env.NEXT_PUBLIC_SITE_URL || "https://valentin.dev").replace(/\/$/, "");
export const HOST_SITIO = new URL(SITIO).hostname;
export const DUENO = { nombre: "Valentín", whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, "") };
/* Si no hay WhatsApp configurado, el botón lleva al formulario del sitio (nunca a un número inventado). */
export const contactoDueno = (mensaje) => (DUENO.whatsapp ? linkWhatsapp(DUENO.whatsapp, mensaje) : `${SITIO}/contacto`);
const PLAZO = `${CONDICIONES_WEB.plazoDiasHabiles} días hábiles`;
export const TRABAJOS_DUENO = {
  "estudio-juridico": [
    { nombre: "rydabogados.com.ar", url: "https://rydabogados.com.ar" },
    { nombre: "abogadamasegosa.com", url: "https://abogadamasegosa.com" },
  ],
};

/* ---------- Escape y validación ---------- */
const MAPA = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" };
export const esc = (valor) => String(valor ?? "").replace(/[&<>"'`]/g, (c) => MAPA[c]);

const texto = (valor, max = 400) =>
  typeof valor === "string" || typeof valor === "number"
    ? String(valor).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max)
    : "";

/* Devuelve la URL normalizada si es segura (http/https, wa.me, mailto o tel), o "" si no. */
export function urlSegura(valor, permitidos = ["https:", "http:"]) {
  const crudo = texto(valor, 600);
  if (!crudo) return "";
  let url;
  try {
    url = new URL(crudo);
  } catch {
    return "";
  }
  if (!permitidos.includes(url.protocol)) return "";
  if ((url.protocol === "https:" || url.protocol === "http:") && (!url.hostname || url.username || url.password)) return "";
  return url.href;
}

const digitos = (valor) => texto(valor, 40).replace(/\D/g, "");

/* Número de WhatsApp en formato internacional para wa.me. Acepta "+54 9 11 1234-5678", "11 1234 5678" (se asume +54 9). */
export function numeroWhatsapp(valor) {
  let n = digitos(valor);
  if (!n) return "";
  if (n.startsWith("00")) n = n.slice(2);
  if (n.startsWith("0")) n = n.slice(1);
  if (n.length === 10) n = `549${n}`;
  if (n.startsWith("54") && !n.startsWith("549") && n.length === 12) n = `549${n.slice(2)}`;
  return n.length >= 10 && n.length <= 15 ? n : "";
}

export const linkWhatsapp = (numero, mensaje) =>
  numero ? `https://wa.me/${numero}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ""}` : "";

/* Teléfono para tel: sin tocar el 9 de los celulares (un fijo como "0230 442 2543" queda +542304422543). */
export function numeroTelefono(valor) {
  let n = digitos(valor);
  if (n.startsWith("00")) n = n.slice(2);
  else if (n.startsWith("0")) n = `54${n.slice(1)}`;
  else if (n.length === 10) n = `54${n}`;
  return n.length >= 8 && n.length <= 15 ? `+${n}` : "";
}

/* Dirección y ciudad sin repetir la ciudad cuando ya viene en la dirección. */
const lugarDe = (d) =>
  d.ciudad && d.direccion.toLowerCase().includes(d.ciudad.toLowerCase()) ? d.direccion : [d.direccion, d.ciudad].filter(Boolean).join(", ");

const EMAIL = /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,24}$/;
export const emailValido = (valor) => (EMAIL.test(texto(valor, 260)) ? texto(valor, 260) : "");

const HEX = /^#[0-9a-fA-F]{6}$/;
const color = (valor) => (HEX.test(texto(valor, 7)) ? texto(valor, 7).toLowerCase() : "");

function instagram(valor) {
  const crudo = texto(valor, 200);
  if (!crudo) return null;
  const url = urlSegura(crudo.startsWith("http") ? crudo : "", ["https:"]);
  let usuario = "";
  if (url) {
    const u = new URL(url);
    if (!/(^|\.)instagram\.com$/.test(u.hostname)) return null;
    usuario = u.pathname.split("/").filter(Boolean)[0] || "";
  } else usuario = crudo.replace(/^@/, "");
  if (!/^[A-Za-z0-9._]{1,30}$/.test(usuario)) return null;
  return { usuario, url: `https://www.instagram.com/${usuario}/` };
}

/* ---------- Fotos ---------- */
/* Las fotos de la muestra son del propio negocio y se guardan en valentin.dev/demo/img/<hash>.webp (las sube el endpoint
   POST /api/demo/imagenes, ver docs/ventas/demo-web.md). También se aceptan las de su propio sitio cuando el host es estable
   (Wix: static.wixstatic.com). Nunca links de Instagram o Facebook: vencen en horas. */
export const FOTO_PROPIA = /^\/demo\/img\/[0-9a-f]{32}\.webp$/;
export const HOSTS_FOTOS_SITIO = ["static.wixstatic.com"];
export const MAX_FOTOS = 14;

export function fotoPermitida(valor) {
  const url = urlSegura(valor, ["https:"]);
  if (!url) return "";
  const u = new URL(url);
  if (u.port || u.search || u.hash) return "";
  if (u.hostname === HOST_SITIO && FOTO_PROPIA.test(u.pathname)) return url;
  if (HOSTS_FOTOS_SITIO.includes(u.hostname) && /^\/media\/[A-Za-z0-9_~.\/,-]+$/.test(u.pathname)) return url;
  return "";
}

/* Variantes por ancho: las propias tienen <hash>-640.webp y <hash>-1024.webp; las de Wix se piden al tamaño con su URL. */
const ANCHOS = [640, 1024, 1600];
function varianteFoto(url, ancho) {
  const u = new URL(url);
  if (u.hostname === HOST_SITIO) return ancho >= 1600 ? url : url.replace(/\.webp$/, `-${ancho}.webp`);
  const partes = u.pathname.split("/");
  if (partes.length !== 3) return url;
  const archivo = partes[2];
  return `${u.origin}/media/${archivo}/v1/fit/w_${ancho},h_${ancho * 2},q_80,enc_auto/${archivo}`;
}
const srcsetDe = (url) => ANCHOS.map((a) => `${varianteFoto(url, a)} ${a}w`).join(", ");

/* "+8 mil": se redondea hacia abajo para no inflar el dato. */
export function seguidoresTexto(n) {
  const v = Math.floor(Number(n));
  if (!Number.isFinite(v) || v < 1) return "";
  if (v < 1000) return String(v);
  if (v < 1_000_000) return `+${Math.floor(v / 1000)} mil`;
  const m = Math.floor(v / 100_000) / 10;
  return `+${String(m).replace(".", ",")} ${m === 1 ? "millón" : "millones"}`;
}

export function slugDe(nombre) {
  const base = texto(nombre, 200)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return base.length >= 3 ? base : `muestra-${base || "web"}`.slice(0, 60);
}

/* ---------- Rubros ---------- */
const ALIAS = [
  [/jur[ií]dic|abogad|legal|derecho/, "estudio-juridico"],
  [/inmobil|propiedad|bienes ra/, "inmobiliaria"],
  [/contab|contador|impuest|estudio contable/, "estudio-contable"],
  [/arquitect|dise[nñ]o de interior|constru/, "arquitectura"],
  [/odont|dent|salud|m[eé]dic|cl[ií]nic|consultorio|kinesi|psic|nutric|veterin/, "salud"],
  [/comerci|distribu|mayorist|almac[eé]n|ferreter|corral[oó]n|insumo|proveedor/, "comercio-distribuidora"],
];
export function rubroDe(valor) {
  const r = texto(valor, 80).toLowerCase();
  if (TEMAS[r]) return r;
  for (const [patron, clave] of ALIAS) if (patron.test(r)) return clave;
  return "generico";
}

/* Cada rubro tiene su letra, su paleta y su ritmo de página: no es la misma página con otro texto. */
export const TEMAS = {
  "estudio-juridico": {
    fuente: "family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Public+Sans:wght@400;500;600",
    display: '"Newsreader", Georgia, serif',
    cuerpo: '"Public Sans", system-ui, sans-serif',
    tituloPeso: 500,
    tracking: "-0.02em",
    paleta: { fondo: "#f4f5f7", superficie: "#ffffff", tinta: "#131b27", tinta2: "#475467", primario: "#17263b", acento: "#a8843f", banda: "#17263b" },
    radio: "6px",
    foto: "dividido",
    tituloGaleria: "El estudio",
    hero: "editorial",
    servicios: "lista",
    orden: ["servicios", "razones", "galeria", "contacto"],
    promesa: (d) => `Tu consulta legal en ${d.ciudad || "tu ciudad"}, con una respuesta clara.`,
    tituloServicios: "Áreas de práctica",
    tituloRazones: "Cómo te atendemos",
    cta: "Consultar por WhatsApp",
    mensaje: (d) => `Hola, quería hacer una consulta con ${d.negocio}.`,
  },
  inmobiliaria: {
    fuente: "family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Manrope:wght@400;500;600",
    display: '"Bricolage Grotesque", system-ui, sans-serif',
    cuerpo: '"Manrope", system-ui, sans-serif',
    tituloPeso: 700,
    tracking: "-0.035em",
    paleta: { fondo: "#ffffff", superficie: "#f1f5f2", tinta: "#0f1f1a", tinta2: "#4a5a54", primario: "#0f4c3a", acento: "#e3a33b", banda: "#0f4c3a" },
    radio: "20px",
    foto: "inmersivo",
    tituloGaleria: "Fotos",
    hero: "buscador",
    servicios: "bento",
    orden: ["servicios", "galeria", "razones", "contacto"],
    promesa: (d) => `Propiedades en ${d.ciudad || "tu zona"}. Contanos qué buscás.`,
    tituloServicios: "Lo que hacemos",
    tituloRazones: "Dónde y cuándo",
    cta: "Escribir por WhatsApp",
    mensaje: (d) => `Hola ${d.negocio}, quería hacer una consulta por una propiedad.`,
  },
  "estudio-contable": {
    fuente: "family=Schibsted+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600",
    display: '"Schibsted Grotesk", system-ui, sans-serif',
    cuerpo: '"Inter", system-ui, sans-serif',
    tituloPeso: 700,
    tracking: "-0.03em",
    paleta: { fondo: "#f5f7fa", superficie: "#ffffff", tinta: "#0d1b2e", tinta2: "#4b5b70", primario: "#1747a6", acento: "#0f8a6a", banda: "#0d1b2e" },
    radio: "14px",
    foto: "dividido",
    tituloGaleria: "El estudio",
    hero: "tarjeta",
    servicios: "check",
    orden: ["servicios", "razones", "galeria", "contacto"],
    promesa: (d) => `Tus impuestos y tu contabilidad al día, con un estudio en ${d.ciudad || "tu ciudad"}.`,
    tituloServicios: "Servicios",
    tituloRazones: "Cómo trabajamos con vos",
    cta: "Consultar por WhatsApp",
    mensaje: (d) => `Hola ${d.negocio}, quería consultar por sus servicios contables.`,
  },
  arquitectura: {
    fuente: "family=Archivo:wdth,wght@62..125,400;62..125,500;62..125,800",
    display: '"Archivo", system-ui, sans-serif',
    cuerpo: '"Archivo", system-ui, sans-serif',
    tituloPeso: 800,
    tracking: "-0.04em",
    paleta: { fondo: "#eceef0", superficie: "#f7f8f9", tinta: "#121212", tinta2: "#4b5058", primario: "#121212", acento: "#c8471d", banda: "#121212" },
    radio: "0px",
    foto: "inmersivo",
    tituloGaleria: "Obras",
    hero: "monumental",
    servicios: "indice",
    orden: ["galeria", "servicios", "razones", "contacto"],
    promesa: (d) => `Proyecto y obra en ${d.ciudad || "tu ciudad"}.`,
    tituloServicios: "Qué hacemos",
    tituloRazones: "Estudio",
    cta: "Contanos tu proyecto",
    mensaje: (d) => `Hola ${d.negocio}, quería contarles un proyecto.`,
  },
  salud: {
    fuente: "family=Figtree:wght@400;500;600;700",
    display: '"Figtree", system-ui, sans-serif',
    cuerpo: '"Figtree", system-ui, sans-serif',
    tituloPeso: 700,
    tracking: "-0.03em",
    paleta: { fondo: "#f6fafa", superficie: "#ffffff", tinta: "#0f2a2e", tinta2: "#4a6266", primario: "#0d6f78", acento: "#d8efec", banda: "#0d4f56" },
    radio: "22px",
    foto: "marco",
    tituloGaleria: "Fotos",
    hero: "turno",
    servicios: "pastillas",
    orden: ["razones", "servicios", "galeria", "contacto"],
    promesa: (d) => `Pedí tu turno en ${d.negocio} por WhatsApp.`,
    tituloServicios: "Tratamientos y servicios",
    tituloRazones: "Para venir",
    cta: "Pedir turno por WhatsApp",
    mensaje: (d) => `Hola ${d.negocio}, quería pedir un turno.`,
  },
  "comercio-distribuidora": {
    fuente: "family=Barlow+Condensed:wght@600;800&family=Barlow:wght@400;500;600",
    display: '"Barlow Condensed", "Arial Narrow", sans-serif',
    cuerpo: '"Barlow", system-ui, sans-serif',
    tituloPeso: 800,
    tracking: "-0.01em",
    paleta: { fondo: "#ffffff", superficie: "#f3f3f1", tinta: "#141414", tinta2: "#4d4d4a", primario: "#ffcc1a", acento: "#141414", banda: "#141414" },
    radio: "10px",
    foto: "inmersivo",
    tituloGaleria: "Fotos",
    hero: "banda",
    servicios: "bloques",
    orden: ["servicios", "razones", "galeria", "contacto"],
    promesa: (d) => `Hacé tu pedido a ${d.negocio} por WhatsApp.`,
    tituloServicios: "Qué vendemos",
    tituloRazones: "Para comprar",
    cta: "Hacer un pedido",
    mensaje: (d) => `Hola ${d.negocio}, quería hacer un pedido.`,
  },
  generico: {
    fuente: "family=Plus+Jakarta+Sans:wght@400;500;600;700;800",
    display: '"Plus Jakarta Sans", system-ui, sans-serif',
    cuerpo: '"Plus Jakarta Sans", system-ui, sans-serif',
    tituloPeso: 750,
    tracking: "-0.03em",
    paleta: { fondo: "#f6f8fb", superficie: "#ffffff", tinta: "#101826", tinta2: "#4a5668", primario: "#1d4ed8", acento: "#0f766e", banda: "#0f1f44" },
    radio: "18px",
    foto: "inmersivo",
    tituloGaleria: "Fotos",
    hero: "tarjeta",
    servicios: "bento",
    orden: ["servicios", "razones", "galeria", "contacto"],
    promesa: (d) => {
      const rubro = d.rubroTexto && d.rubroTexto.length <= 40 ? d.rubroTexto.charAt(0).toUpperCase() + d.rubroTexto.slice(1) : d.negocio;
      return `${rubro}${d.ciudad ? ` en ${d.ciudad}` : ""}.`;
    },
    tituloServicios: "Qué hacemos",
    tituloRazones: "Para contactarnos",
    cta: "Escribir por WhatsApp",
    mensaje: (d) => `Hola ${d.negocio}, quería hacer una consulta.`,
  },
};

/* ---------- Datos ---------- */
export function normalizar(entrada) {
  if (!entrada || typeof entrada !== "object") throw new Error("La entrada tiene que ser un objeto JSON");
  const negocio = texto(entrada.negocio, 90);
  if (!negocio) throw new Error("Falta `negocio`");
  const lista = (valor, max) => (Array.isArray(valor) ? valor : []).slice(0, max);
  const servicios = lista(entrada.servicios, 12)
    .map((s) => (typeof s === "string" ? { nombre: texto(s, 80), detalle: "" } : { nombre: texto(s?.nombre, 80), detalle: texto(s?.detalle, 220) }))
    .filter((s) => s.nombre);
  const horarios = Array.isArray(entrada.horarios)
    ? entrada.horarios.map((h) => texto(h, 80)).filter(Boolean).slice(0, 7)
    : texto(entrada.horarios, 160)
      ? [texto(entrada.horarios, 160)]
      : [];
  const trabajos = lista(entrada.trabajosParecidos, 4)
    .map((t) => {
      const url = urlSegura(typeof t === "string" ? (t.startsWith("http") ? t : `https://${t}`) : t?.url, ["https:", "http:"]);
      if (!url) return null;
      return { url, nombre: texto(typeof t === "string" ? new URL(url).hostname.replace(/^www\./, "") : t?.nombre || new URL(url).hostname, 60) };
    })
    .filter(Boolean);
  const rubro = rubroDe(entrada.rubro);
  const colores = entrada.colores && typeof entrada.colores === "object" ? entrada.colores : {};
  /* Fotos con su pie y su lugar (rol): hero, galeria, servicio (con el número de servicio) o banda. */
  const metas = lista(entrada.imagenesMeta, MAX_FOTOS);
  const fotos = lista(entrada.imagenes, MAX_FOTOS)
    .map((u, i) => {
      const url = fotoPermitida(u);
      if (!url) return null;
      const m = metas[i] && typeof metas[i] === "object" ? metas[i] : {};
      const rol = ["hero", "galeria", "servicio", "banda"].includes(m.rol) ? m.rol : "";
      const servicio = Number.isInteger(m.servicio) && m.servicio >= 0 && m.servicio < 12 ? m.servicio : -1;
      return { url, pie: texto(m.pie, 80), rol, servicio };
    })
    .filter(Boolean);
  const pares = (valor, max, a, b, largoA, largoB) =>
    lista(valor, max)
      .map((x) => ({ [a]: texto(x?.[a], largoA), [b]: texto(x?.[b], largoB) }))
      .filter((x) => x[a] && x[b]);
  return {
    negocio,
    rubro,
    rubroTexto: texto(entrada.rubro, 80),
    ciudad: texto(entrada.ciudad, 60),
    direccion: texto(entrada.direccion, 140),
    telefono: texto(entrada.telefono, 30),
    tel: numeroTelefono(entrada.telefono),
    whatsapp: numeroWhatsapp(entrada.whatsapp),
    whatsappVisible: texto(entrada.whatsapp, 30),
    email: emailValido(entrada.email),
    servicios,
    descripcion: texto(entrada.descripcion, 420),
    promesa: texto(entrada.promesa, 120),
    diferenciales: lista(entrada.diferenciales, 4).map((x) => texto(x, 160)).filter(Boolean),
    colores: { primario: color(colores.primario), acento: color(colores.acento) },
    instagram: instagram(entrada.instagram),
    seguidores: seguidoresTexto(entrada.instagramSeguidores),
    horarios,
    fotos,
    imagenes: fotos.map((f) => f.url),
    origenFotos: texto(entrada.origenFotos, 90),
    tituloGaleria: texto(entrada.tituloGaleria, 40),
    preguntas: pares(entrada.preguntas, 8, "pregunta", "respuesta", 140, 420),
    proceso: pares(entrada.proceso, 6, "nombre", "detalle", 60, 220),
    zona: texto(entrada.zona, 80),
    trabajos: trabajos.length ? trabajos : TRABAJOS_DUENO[rubro] || [],
    ficticio: entrada.ficticio === true,
  };
}

/* ---------- Color ---------- */
function luminancia(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contraste = (a, b) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const textoSobre = (fondo, tinta) => (contraste(fondo, "#ffffff") >= contraste(fondo, tinta) ? "#ffffff" : tinta);

/* ---------- Íconos (SVG propio de un solo trazo; WhatsApp e Instagram son los de simple-icons, CC0) ---------- */
const WA = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";
const IG = "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4m5.2-9.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4";
const TRAZOS = {
  tel: '<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  lugar: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};
/* Cada ícono se dibuja una sola vez en un sprite al principio del body y se reusa con <use>: la página pesa menos. */
const icono = (nombre, clase = "ic") => `<svg class="${clase}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${nombre}"/></svg>`;
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="${WA}"/></symbol><symbol id="i-ig" viewBox="0 0 24 24"><path fill="currentColor" d="${IG}"/></symbol>${Object.entries(
  TRAZOS,
)
  .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`)
  .join("")}</svg>`;

/* ---------- Piezas ---------- */
function botonWa(d, t, clase = "btn btn-1", etiqueta = t.cta) {
  if (d.whatsapp) return `<a class="${clase}" href="${esc(linkWhatsapp(d.whatsapp, t.mensaje(d)))}" target="_blank" rel="noopener">${icono("wa")}<span>${esc(etiqueta)}</span></a>`;
  if (d.tel) return `<a class="${clase}" href="tel:${esc(d.tel)}">${icono("tel")}<span>Llamar</span></a>`;
  if (d.email) return `<a class="${clase}" href="mailto:${esc(d.email)}">${icono("mail")}<span>Escribir un mail</span></a>`;
  return "";
}

function datosRapidos(d) {
  const items = [];
  if (d.direccion || d.ciudad) items.push(`<li>${icono("lugar")}<span>${esc(lugarDe(d))}</span></li>`);
  if (d.horarios[0]) items.push(`<li>${icono("reloj")}<span>${esc(d.horarios[0])}</span></li>`);
  return items.length ? `<ul class="rapidos">${items.join("")}</ul>` : "";
}

function heroDe(d, t) {
  const crudo = d.promesa || t.promesa(d);
  const promesa = esc(crudo);
  const largo = crudo.length > 62 ? ' class="h1-l"' : crudo.length > 42 ? ' class="h1-m"' : "";
  const desc = d.descripcion ? `<p class="bajada">${esc(d.descripcion)}</p>` : "";
  const secundario = d.servicios.length ? `<a class="btn btn-2" href="#servicios">${esc(t.tituloServicios)}</a>` : "";
  const acciones = `<div class="acciones">${botonWa(d, t)}${secundario}</div>`;
  const img = d.imagenes[0] ? `<img class="hero-img" src="${esc(d.imagenes[0])}" alt="${esc(d.negocio)}" width="1200" height="800" fetchpriority="high">` : "";
  switch (t.hero) {
    case "editorial":
      return `<header class="hero hero-editorial"><div class="w"><h1${largo}>${promesa}</h1>${desc}${acciones}${datosRapidos(d)}</div><svg class="hero-linea" viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 39.5H1200" /></svg></header>`;
    case "buscador": {
      const chips = d.servicios.slice(0, 6).map((s) =>
        d.whatsapp
          ? `<a class="chip" href="${esc(linkWhatsapp(d.whatsapp, `Hola ${d.negocio}, quería consultar por: ${s.nombre}.`))}" target="_blank" rel="noopener">${esc(s.nombre)}${icono("flecha", "ic ic-s")}</a>`
          : `<span class="chip">${esc(s.nombre)}</span>`,
      );
      const buscador = chips.length ? `<div class="buscador"><p class="buscador-t">¿Qué estás buscando?</p><div class="chips">${chips.join("")}</div></div>` : "";
      return `<header class="hero hero-buscador"><div class="w"><div class="hero-txt"><h1${largo}>${promesa}</h1>${desc}${acciones}</div>${buscador}</div>${img ? `<div class="w hero-foto">${img}</div>` : ""}</header>`;
    }
    case "tarjeta": {
      const items = d.servicios.slice(0, 5).map((s) => `<li>${icono("check")}<span>${esc(s.nombre)}</span></li>`).join("");
      const tarjeta = items ? `<aside class="hero-tarjeta" aria-label="Servicios de ${esc(d.negocio)}"><p class="ht-t">${esc(t.tituloServicios)}</p><ul>${items}</ul>${d.horarios[0] ? `<p class="ht-pie">${icono("reloj")}${esc(d.horarios[0])}</p>` : ""}</aside>` : "";
      return `<header class="hero hero-tarjeta-l"><div class="w grid-hero"><div class="hero-txt"><h1${largo}>${promesa}</h1>${desc}${acciones}${datosRapidos(d)}</div>${tarjeta}</div></header>`;
    }
    case "monumental":
      return `<header class="hero hero-monumental"><div class="w"><h1 class="nombre-xl">${esc(d.negocio)}</h1><div class="mono-fila"><p class="promesa">${promesa}</p><div>${desc}${acciones}</div></div></div>${img ? `<div class="mono-img">${img}</div>` : `<div class="w"><svg class="plano" viewBox="0 0 1200 260" aria-hidden="true"><path d="M0 259.5H1200M80 259.5V60h380v199.5M460 140h300v119.5M760 20h360v239.5M80 160h380M900 20v239.5M1000 140h120" /></svg></div>`}</header>`;
    case "turno":
      return `<header class="hero hero-turno"><div class="w"><div class="turno-caja"><h1${largo}>${promesa}</h1>${desc}${acciones}${datosRapidos(d)}</div></div></header>`;
    case "banda":
      return `<header class="hero hero-banda"><div class="w"><h1${largo}>${promesa}</h1>${desc}${acciones}</div><div class="cinta" aria-hidden="true"></div></header>`;
    default:
      return "";
  }
}

function seccionServicios(d, t) {
  if (!d.servicios.length) return "";
  const s = d.servicios;
  let cuerpo = "";
  switch (t.servicios) {
    case "lista":
    case "indice":
      cuerpo = `<ul class="srv-lista">${s.map((x) => `<li data-r><h3>${esc(x.nombre)}</h3>${x.detalle ? `<p>${esc(x.detalle)}</p>` : ""}</li>`).join("")}</ul>`;
      break;
    case "check":
      cuerpo = `<ul class="srv-check">${s.map((x) => `<li data-r><span class="tilde">${icono("check")}</span><div><h3>${esc(x.nombre)}</h3>${x.detalle ? `<p>${esc(x.detalle)}</p>` : ""}</div></li>`).join("")}</ul>`;
      break;
    case "pastillas":
      cuerpo = `<ul class="srv-pastillas">${s.map((x) => `<li data-r><h3>${esc(x.nombre)}</h3>${x.detalle ? `<p>${esc(x.detalle)}</p>` : ""}</li>`).join("")}</ul>`;
      break;
    case "bloques":
      cuerpo = `<ul class="srv-bloques">${s.map((x) => `<li data-r><h3>${esc(x.nombre)}</h3>${x.detalle ? `<p>${esc(x.detalle)}</p>` : ""}${d.whatsapp ? `<a href="${esc(linkWhatsapp(d.whatsapp, `Hola ${d.negocio}, quería consultar por: ${x.nombre}.`))}" target="_blank" rel="noopener">Consultar${icono("flecha", "ic ic-s")}</a>` : ""}</li>`).join("")}</ul>`;
      break;
    default:
      cuerpo = `<ul class="srv-bento">${s.map((x, i) => `<li data-r class="${claseBento(i, s.length)}"><h3>${esc(x.nombre)}</h3>${x.detalle ? `<p>${esc(x.detalle)}</p>` : ""}${i === 0 && d.whatsapp ? `<a class="consultar" href="${esc(linkWhatsapp(d.whatsapp, `Hola ${d.negocio}, quería consultar por: ${x.nombre}.`))}" target="_blank" rel="noopener">Consultar${icono("flecha", "ic ic-s")}</a>` : ""}</li>`).join("")}</ul>`;
  }
  return `<section id="servicios" class="sec sec-servicios"><div class="w"><h2 data-r>${esc(t.tituloServicios)}</h2>${cuerpo}</div></section>`;
}

/* Bento: la primera tarjeta grande (2×2 si hay al menos 3) y la última fila siempre completa en 3 columnas. */
function claseBento(i, n) {
  if (i === 0) return n >= 3 ? "grande" : n === 2 ? "grande ancha2" : "grande ancha3";
  if (n < 3 || i !== n - 1) return "";
  const resto = (n - 3) % 3;
  return resto === 1 ? "ancha3" : resto === 2 ? "ancha2" : "";
}

/* Solo datos que vinieron en la entrada: diferenciales escritos por quien arma la muestra, el canal, el lugar y el horario. */
export function razonesDe(d) {
  const r = d.diferenciales.map((x) => ({ icono: "check", titulo: x, detalle: "" }));
  if (d.whatsapp) r.push({ icono: "wa", titulo: "Consultas por WhatsApp", detalle: d.whatsappVisible ? `Escribinos al ${d.whatsappVisible}.` : "Escribinos desde el botón." });
  if (d.direccion) r.push({ icono: "lugar", titulo: d.ciudad ? `En ${d.ciudad}` : "Dirección", detalle: d.direccion });
  if (d.horarios.length) r.push({ icono: "reloj", titulo: "Horarios", detalle: d.horarios.join(" / ") });
  if (d.email && !d.whatsapp) r.push({ icono: "mail", titulo: "Consultas por mail", detalle: d.email });
  return r;
}

function seccionRazones(d, t) {
  const r = razonesDe(d);
  if (r.length < 2) return "";
  return `<section class="sec sec-razones"><div class="w"><h2 data-r>${esc(t.tituloRazones)}</h2><ul class="razones">${r
    .map((x) => `<li data-r>${icono(x.icono)}<div><h3>${esc(x.titulo)}</h3>${x.detalle ? `<p>${esc(x.detalle)}</p>` : ""}</div></li>`)
    .join("")}</ul></div></section>`;
}

function seccionGaleria(d) {
  const fotos = d.imagenes.slice(t_hero_usa_img(d) ? 1 : 0);
  if (!fotos.length) return "";
  return `<section class="sec sec-galeria" aria-label="Fotos"><div class="w galeria">${fotos
    .map((u) => `<figure data-r><img src="${esc(u)}" alt="${esc(d.negocio)}" loading="lazy" width="900" height="675"></figure>`)
    .join("")}</div></section>`;
}
const t_hero_usa_img = (d) => ["buscador", "monumental"].includes(TEMAS[d.rubro].hero) && d.imagenes.length > 0;

function seccionContacto(d, t) {
  const filas = [];
  if (d.whatsapp) filas.push(`<a class="fila" href="${esc(linkWhatsapp(d.whatsapp, t.mensaje(d)))}" target="_blank" rel="noopener">${icono("wa")}<span><b>WhatsApp</b>${esc(d.whatsappVisible || `+${d.whatsapp}`)}</span></a>`);
  if (d.tel) filas.push(`<a class="fila" href="tel:${esc(d.tel)}">${icono("tel")}<span><b>Teléfono</b>${esc(d.telefono)}</span></a>`);
  if (d.email) filas.push(`<a class="fila" href="mailto:${esc(d.email)}">${icono("mail")}<span><b>Mail</b>${esc(d.email)}</span></a>`);
  if (d.direccion) {
    const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.negocio}, ${lugarDe(d)}`)}`;
    filas.push(`<a class="fila" href="${esc(mapa)}" target="_blank" rel="noopener">${icono("lugar")}<span><b>Cómo llegar</b>${esc(lugarDe(d))}</span></a>`);
  }
  if (d.instagram) filas.push(`<a class="fila" href="${esc(d.instagram.url)}" target="_blank" rel="noopener">${icono("ig")}<span><b>Instagram</b>@${esc(d.instagram.usuario)}${d.seguidores ? ` · ${esc(d.seguidores)} seguidores` : ""}</span></a>`);
  if (!filas.length) return "";
  const horarios = d.horarios.length ? `<div class="horarios">${icono("reloj")}<ul>${d.horarios.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>` : "";
  return `<section id="contacto" class="sec sec-contacto"><div class="w contacto"><div class="contacto-txt" data-r><h2>Hablemos</h2><p>${esc(d.negocio)}${d.ciudad ? `, ${esc(d.ciudad)}` : ""}.</p>${horarios}${botonWa(d, t)}</div><div class="filas" data-r>${filas.join("")}</div></div></section>`;
}

function seccionPropuesta(d) {
  const msg = `Hola Valentín, vi la propuesta de web para ${d.negocio} y me interesa.`;
  const trabajos = d.trabajos.length
    ? `<p class="trabajos">Otros sitios que hice: ${d.trabajos.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.nombre)}</a>`).join(", ")}.</p>`
    : "";
  return `<section id="propuesta" class="propuesta"><div class="w"><h2>Esta página es una propuesta</h2><p>La preparó ${esc(DUENO.nombre)} como ejemplo para ${esc(d.negocio)}. No es el sitio actual del negocio: los datos salen de información pública y se revisan con vos antes de publicar nada.</p>${d.fotos.length ? `<p>Las fotos son de ${esc(d.negocio)}, tomadas de ${esc(d.origenFotos || "su web y su perfil público")}. En la versión final van las que elijas.</p>` : ""}<p>Si te gusta, la dejamos online en ${PLAZO}, con tu dominio y tus textos.</p><a class="btn btn-prop" href="${esc(contactoDueno(msg))}" target="_blank" rel="noopener">${icono("wa")}<span>Quiero esta web</span></a>${trabajos}</div></section>`;
}

/* ---------- Estilos ---------- */
function estilos(d, t) {
  const p = { ...t.paleta };
  if (d.colores.primario) p.primario = d.colores.primario;
  if (d.colores.acento) p.acento = d.colores.acento;
  const sobrePrimario = textoSobre(p.primario, p.tinta);
  const sobreBanda = textoSobre(p.banda, p.tinta);
  return `
:root{--fondo:${p.fondo};--sup:${p.superficie};--tinta:${p.tinta};--tinta2:${p.tinta2};--pri:${p.primario};--sobre-pri:${sobrePrimario};--acento:${p.acento};--banda:${p.banda};--sobre-banda:${sobreBanda};--r:${t.radio};--disp:${t.display};--cuerpo:${t.cuerpo};--peso:${t.tituloPeso};--trk:${t.tracking};--linea:color-mix(in srgb,var(--tinta) 12%,transparent);--franja:64px;--ease:cubic-bezier(.22,1,.36,1);color-scheme:light}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;scroll-padding-top:72px}
body{margin:0;background:var(--fondo);color:var(--tinta);font:17px/1.6 var(--cuerpo);-webkit-font-smoothing:antialiased;padding-bottom:calc(var(--franja) + env(safe-area-inset-bottom))}
img{max-width:100%;display:block;height:auto}a{color:inherit}
::selection{background:color-mix(in srgb,var(--pri) 30%,transparent)}
:focus-visible{outline:3px solid color-mix(in srgb,var(--pri) 55%,#3b82f6);outline-offset:3px;border-radius:4px}
h1,h2,h3{font-family:var(--disp);font-weight:var(--peso);letter-spacing:var(--trk);line-height:1.06;text-wrap:balance;margin:0}
h2{font-size:clamp(30px,5vw,52px);margin-bottom:clamp(28px,4vw,48px)}
h3{font-size:20px;line-height:1.25;letter-spacing:-.01em}
p{margin:0;text-wrap:pretty}
.w{width:min(1160px,100% - 40px);margin-inline:auto}
.ic{width:20px;height:20px;flex:none}.ic-s{width:16px;height:16px}
.sec{padding-block:clamp(56px,9vw,112px)}
.aviso{background:#fff3c4;color:#4a3b00;font-size:14px;text-align:center;padding:8px 16px}
.nav{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--fondo) 94%,transparent);border-bottom:1px solid var(--linea)}
.nav .w{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:60px}
.marca{font-family:var(--disp);font-weight:var(--peso);font-size:19px;letter-spacing:-.01em;text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nav nav{display:flex;align-items:center;gap:24px;font-size:15px}
.nav nav a:not(.btn){text-decoration:none;color:var(--tinta2)}.nav nav a:not(.btn):hover{color:var(--tinta)}
.nav .btn{min-height:42px;padding:0 16px;font-size:15px}
@media (max-width:759px){.nav nav a:not(.btn){display:none}.nav .btn{display:none}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:54px;padding:0 24px;border-radius:max(var(--r),8px);font:600 16px/1 var(--cuerpo);text-decoration:none;transition:transform .15s var(--ease),background-color .2s,box-shadow .2s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.btn:active{transform:scale(.97)}
.btn-1{background:var(--pri);color:var(--sobre-pri);box-shadow:0 1px 2px rgba(0,0,0,.08),0 10px 24px -12px color-mix(in srgb,var(--pri) 70%,transparent)}
@media (hover:hover){.btn-1:hover{transform:translateY(-1px);background:color-mix(in srgb,var(--pri) 90%,#fff)}.btn-2:hover{background:color-mix(in srgb,var(--tinta) 6%,transparent)}}
.btn-2{border:1px solid color-mix(in srgb,currentColor 28%,transparent);color:inherit}
.acciones{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.bajada{font-size:clamp(18px,2.1vw,21px);line-height:1.55;color:var(--tinta2);max-width:38em;margin-top:20px}
.firma{font-weight:600;font-size:15px;letter-spacing:.01em;margin-bottom:20px;color:var(--tinta2)}
.rapidos{list-style:none;padding:0;margin:28px 0 0;display:flex;flex-wrap:wrap;gap:10px 24px;font-size:15px;color:var(--tinta2)}
.rapidos li{display:flex;align-items:center;gap:8px}
.hero h1{font-size:clamp(40px,7.4vw,84px);max-width:15em}
.hero h1.h1-m{font-size:clamp(36px,6vw,68px)!important}.hero h1.h1-l{font-size:clamp(32px,4.8vw,56px)!important}
@media (max-width:559px){.acciones .btn-1{flex:1 1 100%}}
@keyframes sube{from{transform:translateY(14px);opacity:.001}to{transform:none;opacity:1}}
@keyframes sube-h{from{transform:translateY(18px)}to{transform:none}}
@media (prefers-reduced-motion:no-preference){.hero h1{animation:sube-h .7s var(--ease) both}.hero .bajada,.hero .acciones,.hero .rapidos,.hero aside,.hero .buscador{animation:sube .7s var(--ease) both}.hero .bajada{animation-delay:.08s}.hero .acciones{animation-delay:.14s}.hero .rapidos,.hero aside,.hero .buscador{animation-delay:.2s}
html.rv [data-r]{opacity:0;transform:translateY(16px);transition:opacity .6s var(--ease),transform .6s var(--ease)}html.rv [data-r].in{opacity:1;transform:none}}
/* Servicios */
.srv-lista,.srv-check,.srv-pastillas,.srv-bloques,.srv-bento,.razones{list-style:none;margin:0;padding:0}
.srv-lista{border-top:1px solid var(--linea)}
.srv-lista li{display:grid;gap:8px;padding:24px 0;border-bottom:1px solid var(--linea)}
.srv-lista p,.srv-check p,.srv-pastillas p,.srv-bloques p,.srv-bento p,.razones p{color:var(--tinta2);font-size:16px;line-height:1.55;max-width:46em}
@media (min-width:760px){.srv-lista li{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:32px;align-items:baseline;padding:32px 0}}
.srv-check{display:grid;gap:12px}
@media (min-width:760px){.srv-check{grid-template-columns:1fr 1fr;gap:16px}}
.srv-check li{display:flex;gap:16px;background:var(--sup);border:1px solid var(--linea);border-radius:var(--r);padding:22px}
.tilde{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:color-mix(in srgb,var(--acento) 14%,transparent);color:var(--acento);flex:none}
.srv-check h3{margin-bottom:6px}
.srv-pastillas{display:grid;gap:12px}
@media (min-width:640px){.srv-pastillas{grid-template-columns:repeat(2,1fr)}}@media (min-width:1000px){.srv-pastillas{grid-template-columns:repeat(3,1fr)}}
.srv-pastillas li{background:var(--sup);border-radius:var(--r);padding:24px;box-shadow:0 1px 2px rgba(15,42,46,.05),0 12px 30px -18px rgba(13,111,120,.35)}
.srv-pastillas h3{margin-bottom:6px}
.srv-bento{display:grid;gap:12px}
@media (min-width:760px){.srv-bento{grid-template-columns:repeat(3,1fr);gap:16px}.srv-bento .grande{grid-column:span 2;grid-row:span 2}.srv-bento .ancha2{grid-column:span 2}.srv-bento .ancha3{grid-column:1/-1}.srv-bento .grande.ancha2,.srv-bento .grande.ancha3{grid-row:auto}}
.srv-bento li{background:var(--sup);border-radius:var(--r);padding:clamp(22px,3vw,32px);display:flex;flex-direction:column;justify-content:flex-end;min-height:150px;gap:8px}
.srv-bento .grande{background:var(--pri);color:var(--sobre-pri);min-height:240px}
.srv-bento .grande h3{font-size:clamp(26px,3.2vw,40px);line-height:1.05;letter-spacing:var(--trk)}
.srv-bento .grande p{color:inherit;opacity:.86}
.srv-bento .consultar{order:-1;margin-bottom:auto;align-self:flex-start;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;background:color-mix(in srgb,var(--sobre-pri) 14%,transparent);font-weight:600;font-size:15px;text-decoration:none}
.srv-bloques{display:grid;gap:12px}
@media (min-width:640px){.srv-bloques{grid-template-columns:repeat(2,1fr)}}@media (min-width:1000px){.srv-bloques{grid-template-columns:repeat(3,1fr)}}
.srv-bloques li{border:2px solid var(--tinta);border-radius:var(--r);padding:22px;display:flex;flex-direction:column;gap:8px}
.srv-bloques h3{font-size:28px;line-height:1;letter-spacing:0;text-transform:uppercase}
.srv-bloques a{margin-top:auto;padding-top:8px;display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:15px;text-underline-offset:4px;min-height:44px}
/* Razones */
.razones{display:grid;gap:12px}
@media (min-width:760px){.razones{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}}
.razones li{display:flex;gap:14px;align-items:flex-start;padding:22px;border-radius:var(--r);background:var(--sup);border:1px solid var(--linea)}
.razones li>.ic{color:var(--pri);margin-top:2px}
.razones h3{font-size:18px;margin-bottom:4px}
/* Galería */
.galeria{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}
.galeria figure{margin:0;overflow:hidden;border-radius:var(--r);aspect-ratio:4/3;background:var(--sup)}
.galeria img{width:100%;height:100%;object-fit:cover;transition:transform .5s var(--ease)}
@media (hover:hover){.galeria figure:hover img{transform:scale(1.03)}}
/* Contacto */
.sec-contacto{background:var(--banda);color:var(--sobre-banda)}
.contacto{display:grid;gap:32px}
@media (min-width:860px){.contacto{grid-template-columns:5fr 7fr;gap:64px;align-items:start}}
.contacto-txt h2{margin-bottom:16px}
.contacto-txt>p{opacity:.8;font-size:18px}
.contacto-txt .btn{margin-top:28px}
.sec-contacto .btn-1{background:var(--sobre-banda);color:var(--banda);box-shadow:none}
.horarios{display:flex;gap:12px;margin-top:24px;opacity:.9}.horarios ul{list-style:none;margin:0;padding:0}
.filas{display:grid;border-top:1px solid color-mix(in srgb,currentColor 18%,transparent)}
.fila{display:flex;align-items:center;gap:16px;padding:18px 4px;min-height:64px;text-decoration:none;border-bottom:1px solid color-mix(in srgb,currentColor 18%,transparent);transition:background-color .2s}
.fila span{display:grid;gap:2px;min-width:0;overflow-wrap:anywhere}.fila b{font-weight:600;font-size:14px;opacity:.7}
@media (hover:hover){.fila:hover{background:color-mix(in srgb,currentColor 6%,transparent)}}
/* Propuesta */
.propuesta{padding-block:clamp(48px,7vw,80px);background:#f2f4f7;color:#18212d;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;border-top:1px solid rgba(0,0,0,.06)}
.propuesta .w{max-width:680px}
.propuesta h2{font-family:inherit;font-size:clamp(24px,3.4vw,32px);font-weight:700;letter-spacing:-.02em;margin-bottom:14px}
.propuesta p{color:#3c4858;font-size:16px;margin-bottom:10px}
.btn-prop{background:#18212d;color:#fff;margin-top:14px;font-family:inherit}
.trabajos{margin-top:22px!important;font-size:15px!important}.trabajos a{color:#0a5fb4;text-underline-offset:3px}
.pie{padding:28px 0;font-size:14px;color:var(--tinta2);background:var(--fondo)}
.pie .w{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px}
/* Franja fija de la propuesta y botón flotante del negocio */
.franja{position:fixed;inset:auto 0 0 0;z-index:40;background:#111820;color:#e9eef4;font:500 13px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;padding:8px 12px calc(8px + env(safe-area-inset-bottom));min-height:calc(var(--franja) + env(safe-area-inset-bottom));display:flex;align-items:center}
@media (max-width:559px){:root{--franja:70px}}
.franja .w{display:flex;align-items:center;justify-content:space-between;gap:12px;width:min(1160px,100%)}
.franja p{min-width:0}
@media (max-width:559px){.franja{font-size:12.5px}}
.franja a{flex:none;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border-radius:999px;background:#25d366;color:#0b1f12;font-weight:700;font-size:14px;text-decoration:none}
.franja a .ic{width:18px;height:18px}
.flota{position:fixed;right:16px;bottom:calc(var(--franja) + 14px + env(safe-area-inset-bottom));z-index:30;width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:var(--pri);color:var(--sobre-pri);box-shadow:0 2px 6px rgba(0,0,0,.18),0 14px 28px -10px rgba(0,0,0,.4);transition:transform .3s var(--ease),opacity .3s var(--ease)}
.flota .ic{width:28px;height:28px}
.flota.oculta,.flota.en-hero{transform:translateY(12px) scale(.9);opacity:0;pointer-events:none}
@media (min-width:760px){.flota{display:none}}
${estilosTema(t)}`;
}

function estilosTema(t) {
  switch (t.hero) {
    case "editorial":
      return `.hero-editorial{background:var(--banda);color:var(--sobre-banda);padding:clamp(64px,12vw,148px) 0 0;position:relative}
.hero-editorial .firma{color:var(--acento);font-family:var(--cuerpo)}
.hero-editorial h1{font-weight:400;font-size:clamp(42px,7.6vw,92px);line-height:1.02;max-width:13em}
.hero-editorial .bajada{color:color-mix(in srgb,var(--sobre-banda) 78%,transparent)}
.hero-editorial .rapidos{color:color-mix(in srgb,var(--sobre-banda) 72%,transparent)}
.hero-editorial .btn-1{background:var(--acento);color:#17130a}
.hero-editorial .w{padding-bottom:clamp(56px,9vw,104px)}
.hero-linea{display:block;width:100%;height:40px;stroke:var(--acento);stroke-width:1;fill:none;opacity:.6}
.nav{background:color-mix(in srgb,var(--banda) 96%,transparent);color:var(--sobre-banda);border-color:color-mix(in srgb,var(--sobre-banda) 14%,transparent)}.nav nav a:not(.btn){color:color-mix(in srgb,var(--sobre-banda) 75%,transparent)}.nav nav a:not(.btn):hover{color:var(--sobre-banda)}.nav .btn-1{background:var(--acento);color:#17130a;box-shadow:none}
.srv-lista h3{font-size:clamp(24px,2.6vw,32px);font-weight:500;letter-spacing:-.015em}
.sec-razones{background:var(--sup)}.sec-razones .razones li{background:var(--fondo);border:0;border-radius:var(--r)}
.sec-razones .razones li>.ic{color:var(--acento)}`;
    case "buscador":
      return `.hero-buscador{padding:clamp(48px,9vw,112px) 0 clamp(40px,6vw,72px)}
.hero-buscador .w:first-child{display:grid;gap:40px}
@media (min-width:960px){.hero-buscador .w:first-child{grid-template-columns:7fr 5fr;align-items:end;gap:64px}}
.hero-buscador h1{font-size:clamp(42px,7.2vw,88px);line-height:.98}
.buscador{background:var(--sup);border-radius:var(--r);padding:24px}
.buscador-t{font-weight:600;margin-bottom:14px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:999px;background:var(--fondo);border:1px solid var(--linea);text-decoration:none;font-weight:500;font-size:15px;transition:background-color .2s,border-color .2s,transform .15s var(--ease)}
.chip .ic{color:var(--pri)}
.chip:active{transform:scale(.97)}
@media (hover:hover){.chip:hover{border-color:var(--pri);background:color-mix(in srgb,var(--pri) 6%,var(--fondo))}}
.hero-foto{margin-top:40px}.hero-foto img{border-radius:var(--r);width:100%;aspect-ratio:16/8;object-fit:cover}
.sec-servicios{background:var(--fondo)}
.sec-razones{background:var(--sup)}.sec-razones .razones li{background:var(--fondo);border:0}
.btn-1{background:var(--pri)}`;
    case "tarjeta":
      return `.hero-tarjeta-l{padding:clamp(48px,9vw,112px) 0;background:linear-gradient(180deg,var(--sup),var(--fondo))}
.grid-hero{display:grid;gap:40px}
@media (min-width:960px){.grid-hero{grid-template-columns:7fr 5fr;align-items:center;gap:72px}}
.hero-tarjeta{background:var(--sup);border:1px solid var(--linea);border-radius:calc(var(--r) + 6px);padding:28px;box-shadow:0 1px 2px rgba(13,27,46,.06),0 24px 48px -28px rgba(23,71,166,.45)}
.ht-t{font-family:var(--disp);font-weight:var(--peso);font-size:20px;letter-spacing:-.01em;padding-bottom:16px;margin-bottom:8px;border-bottom:1px solid var(--linea)}
.hero-tarjeta ul{list-style:none;margin:0;padding:0}
.hero-tarjeta li{display:flex;gap:12px;align-items:center;padding:11px 0;font-weight:500}
.hero-tarjeta li .ic{color:var(--acento);width:22px;height:22px}
.ht-pie{display:flex;gap:10px;align-items:center;margin-top:12px;padding-top:16px;border-top:1px solid var(--linea);font-size:15px;color:var(--tinta2)}`;
    case "monumental":
      return `.hero-monumental{padding:clamp(32px,6vw,72px) 0 0}
.nombre-xl{font-size:clamp(44px,11vw,168px)!important;font-variation-settings:"wdth" 108;line-height:.92!important;letter-spacing:-.04em;max-width:none!important;overflow-wrap:break-word;hyphens:manual}
.mono-fila{display:grid;gap:24px;margin-top:clamp(28px,5vw,56px);padding-top:24px;border-top:2px solid var(--tinta)}
@media (min-width:860px){.mono-fila{grid-template-columns:1fr 1fr;gap:64px}}
.promesa{font-size:clamp(24px,3vw,36px);font-weight:500;line-height:1.15;letter-spacing:-.02em;font-variation-settings:"wdth" 100}
.mono-fila .bajada{margin-top:0}
.mono-img{margin-top:clamp(40px,6vw,72px)}.mono-img img{width:100%;aspect-ratio:21/9;object-fit:cover}
.plano{display:block;width:100%;height:auto;margin-top:clamp(40px,6vw,72px);stroke:var(--tinta);stroke-width:1.5;fill:none}
.plano path{stroke-dasharray:3200;stroke-dashoffset:0}
@media (prefers-reduced-motion:no-preference){.plano path{animation:traza 2.2s var(--ease) both .2s}@keyframes traza{from{stroke-dashoffset:3200}to{stroke-dashoffset:0}}}
.btn,.srv-lista li,.razones li{border-radius:0}
.btn-1{background:var(--acento);color:#fff;box-shadow:none}
.srv-lista h3{font-size:clamp(26px,3.4vw,44px);font-variation-settings:"wdth" 110;letter-spacing:-.03em}
.sec-servicios{background:var(--sup)}
.sec-razones .razones li{background:transparent;border:0;border-top:2px solid var(--tinta);padding:20px 0}
.sec-razones .razones li>.ic{color:var(--acento)}
.galeria figure{border-radius:0}`;
    case "turno":
      return `.hero-turno{padding:clamp(20px,4vw,40px) 0}
.turno-caja{background:radial-gradient(120% 90% at 100% 0%,var(--acento),transparent 60%),var(--sup);border-radius:calc(var(--r) + 10px);padding:clamp(32px,7vw,88px) clamp(24px,6vw,80px);text-align:center;display:flex;flex-direction:column;align-items:center;box-shadow:0 1px 2px rgba(15,42,46,.05),0 30px 60px -40px rgba(13,111,120,.5)}
.turno-caja h1{max-width:14em}.turno-caja .bajada{margin-inline:auto}.turno-caja .acciones,.turno-caja .rapidos{justify-content:center}
.sec-razones .razones li{background:var(--sup);border:0;box-shadow:0 1px 2px rgba(15,42,46,.05)}
.srv-pastillas li{border-radius:var(--r)}`;
    case "banda":
      return `.hero-banda{background:var(--pri);color:var(--tinta);padding:clamp(48px,9vw,112px) 0 0;overflow:hidden}
.hero-banda .firma{color:var(--tinta);font-size:16px;display:flex;gap:12px;flex-wrap:wrap}.hero-banda .firma span{opacity:.7;font-weight:500}
.hero-banda h1{font-size:clamp(52px,10vw,128px);line-height:.92;text-transform:uppercase;letter-spacing:-.01em;max-width:11em}
.hero-banda .bajada{color:#2b2a24}
.hero-banda .btn-1{background:var(--tinta);color:#fff;box-shadow:none}.hero-banda .btn-2{border-color:var(--tinta)}
.hero-banda .w{padding-bottom:clamp(48px,7vw,88px)}
.cinta{height:22px;background:repeating-linear-gradient(-45deg,var(--tinta) 0 14px,var(--pri) 14px 28px)}
.btn-1{background:var(--tinta);color:#fff}
.sec-contacto .btn-1{background:var(--pri);color:var(--tinta)}
.flota{background:var(--tinta);color:var(--pri)}
.sec-razones{background:var(--sup)}.sec-razones .razones li{background:#fff;border:0}
.razones li>.ic{color:var(--tinta)}`;
    default:
      return "";
  }
}

/* ---------- Modo con fotos ---------- */
/* Con al menos una foto la página cambia de forma: la primera foto ocupa el hero y el resto arma la galería, los servicios
   (si la foto dice a qué servicio va) y una banda de cierre. Cada rubro conserva su letra, su paleta y su forma de hero. */
const CIERRE = {
  arquitectura: "Contanos tu proyecto",
  "estudio-juridico": "Contanos tu consulta",
  inmobiliaria: "Contanos qué estás buscando",
  "estudio-contable": "Contanos qué necesitás",
  salud: "Pedí tu turno",
  "comercio-distribuidora": "Hacé tu pedido",
  generico: "Escribinos",
};

export function repartirFotos(d) {
  const fotos = d.fotos;
  if (!fotos.length) return { hero: null, galeria: [], banda: null, porServicio: new Map() };
  const conRol = fotos.some((f) => f.rol);
  const hero = fotos.find((f) => f.rol === "hero") || fotos.find((f) => !f.rol) || fotos[0];
  let resto = fotos.filter((f) => f !== hero);
  const porServicio = new Map();
  for (const f of resto) if (f.rol === "servicio" && f.servicio >= 0 && f.servicio < d.servicios.length && !porServicio.has(f.servicio)) porServicio.set(f.servicio, f);
  resto = resto.filter((f) => ![...porServicio.values()].includes(f));
  let banda = resto.find((f) => f.rol === "banda") || null;
  if (!banda && !conRol && resto.length >= 4) banda = resto[resto.length - 1];
  const galeria = resto.filter((f) => f !== banda);
  return { hero, galeria, banda, porServicio };
}

function imgFoto(f, d, { clase = "", sizes = "100vw", prioridad = false, ancho = 1600, alto = 1067 } = {}) {
  const alt = f.pie ? `${d.negocio}: ${f.pie}` : `Foto de ${d.negocio}`;
  return `<img${clase ? ` class="${clase}"` : ""} src="${esc(varianteFoto(f.url, 1600))}" srcset="${esc(srcsetDe(f.url))}" sizes="${esc(sizes)}" alt="${esc(alt)}" width="${ancho}" height="${alto}"${prioridad ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

function heroFoto(d, t, f) {
  const promesa = esc(d.promesa || t.promesa(d));
  const secundario = d.servicios.length ? `<a class="btn btn-2" href="#servicios">${esc(t.tituloServicios)}</a>` : "";
  const acciones = `<div class="acciones">${botonWa(d, t)}${secundario}</div>`;
  const pie = f.pie ? `<p class="fh-pie">${esc(f.pie)}</p>` : "";
  if (t.foto === "dividido") {
    return `<header class="fh fh-div"><figure class="fh-div-foto">${imgFoto(f, d, { clase: "fh-img", sizes: "(min-width:960px) 50vw, 100vw", prioridad: true })}${pie}</figure><div class="fh-div-txt"><div class="fh-div-in"><h1>${promesa}</h1>${d.descripcion ? `<p class="bajada">${esc(d.descripcion)}</p>` : ""}${acciones}${datosRapidos(d)}</div></div></header>`;
  }
  if (t.foto === "marco") {
    return `<header class="fh fh-marco"><div class="w"><div class="marco">${imgFoto(f, d, { clase: "fh-img", sizes: "(min-width:1200px) 1160px, 100vw", prioridad: true })}<div class="fh-velo"></div><div class="marco-txt"><h1>${promesa}</h1>${acciones}</div></div>${datosRapidos(d)}</div></header>`;
  }
  const nombre = t.hero === "monumental";
  const largo = d.negocio.length > 22 ? " fh-nombre-l" : d.negocio.length > 14 ? " fh-nombre-m" : "";
  const cuerpo = nombre
    ? `<h1 class="fh-nombre${largo}">${esc(d.negocio)}</h1><div class="fh-fila"><p class="fh-promesa">${promesa}</p>${acciones}</div>`
    : `<h1 class="fh-h1">${promesa}</h1>${acciones}`;
  return `<header class="fh fh-inm${nombre ? " fh-mono" : ""}">${imgFoto(f, d, { clase: "fh-img", prioridad: true })}<div class="fh-velo"></div><div class="w fh-txt">${cuerpo}</div>${pie}</header>`;
}

function seccionIntro(d) {
  const hechos = [];
  if (d.zona || d.ciudad) hechos.push(`<li>${icono("lugar")}<span>${esc(d.zona || d.ciudad)}</span></li>`);
  for (const x of d.diferenciales) hechos.push(`<li>${icono("check")}<span>${esc(x)}</span></li>`);
  if (d.instagram) hechos.push(`<li>${icono("ig")}<a href="${esc(d.instagram.url)}" target="_blank" rel="noopener">@${esc(d.instagram.usuario)}${d.seguidores ? `<span class="seg">${esc(d.seguidores)} seguidores</span>` : ""}</a></li>`);
  if (!d.descripcion && hechos.length < 2) return "";
  return `<section class="sec intro"><div class="w intro-g">${d.descripcion ? `<p class="intro-t" data-r>${esc(d.descripcion)}</p>` : ""}${hechos.length ? `<ul class="hechos" data-r>${hechos.join("")}</ul>` : ""}</div></section>`;
}

/* Galería asimétrica: filas de 12 columnas con plantillas que se alternan (grande + alta, tres iguales, 5 + 7, panorámica)
   y la última fila siempre completa. En el celular, una foto ancha y dos a la mitad. */
const FILAS = [[8, 4], [4, 4, 4], [5, 7], [12]];
export function filasGaleria(n) {
  const filas = [];
  let i = 0;
  let k = 0;
  while (i < n) {
    const resto = n - i;
    let fila = FILAS[k % FILAS.length];
    if (resto < fila.length) fila = resto === 1 ? [12] : [6, 6];
    filas.push(fila);
    i += fila.length;
    k++;
  }
  return filas;
}

function seccionGaleriaFotos(d, t, fotos) {
  if (!fotos.length) return "";
  let i = 0;
  let movil = 0;
  const filas = filasGaleria(fotos.length).map((fila) => {
    const celdas = fila.map((cols) => {
      const f = fotos[i++];
      const quedan = fotos.length - i;
      const completa = movil % 3 === 0 || (movil % 3 === 1 && quedan === 0);
      movil++;
      const sizes = cols >= 8 ? "(min-width:760px) 66vw, 100vw" : cols >= 5 ? "(min-width:760px) 50vw, 100vw" : "(min-width:760px) 33vw, 50vw";
      return `<figure class="g-f${completa ? " m-full" : ""}" style="--c:${cols}" data-r>${imgFoto(f, d, { sizes })}${f.pie ? `<figcaption>${esc(f.pie)}</figcaption>` : ""}</figure>`;
    });
    return `<div class="g-fila g-${fila.join("-")}">${celdas.join("")}</div>`;
  });
  return `<section id="fotos" class="sec galeria-f" aria-labelledby="t-fotos"><div class="w"><h2 id="t-fotos" data-r>${esc(d.tituloGaleria || t.tituloGaleria)}</h2><div class="g">${filas.join("")}</div></div></section>`;
}

function seccionServiciosFotos(d, t, porServicio) {
  if (!d.servicios.length) return "";
  if (!porServicio.size) return seccionServicios(d, t);
  let lado = 0;
  const items = d.servicios.map((s, i) => {
    const f = porServicio.get(i);
    const txt = `<div class="fs-txt"><h3>${esc(s.nombre)}</h3>${s.detalle ? `<p>${esc(s.detalle)}</p>` : ""}</div>`;
    if (!f) return `<li class="fs-i" data-r>${txt}</li>`;
    const flip = lado++ % 2 === 1 ? " fs-flip" : "";
    return `<li class="fs-i fs-con${flip}" data-r>${txt}<figure class="fs-foto">${imgFoto(f, d, { sizes: "(min-width:860px) 55vw, 100vw" })}${f.pie ? `<figcaption>${esc(f.pie)}</figcaption>` : ""}</figure></li>`;
  });
  return `<section id="servicios" class="sec fs"><div class="w"><h2 data-r>${esc(t.tituloServicios)}</h2><ul class="fs-l">${items.join("")}</ul></div></section>`;
}

function seccionProceso(d) {
  if (d.proceso.length < 2) return "";
  return `<section class="sec proc"><div class="w"><h2 data-r>Cómo trabajamos</h2><ol class="proc-l">${d.proceso
    .map((p, i) => `<li data-r><span class="proc-n" aria-hidden="true">${i + 1}</span><h3>${esc(p.nombre)}</h3><p>${esc(p.detalle)}</p></li>`)
    .join("")}</ol></div></section>`;
}

function seccionPreguntas(d) {
  if (!d.preguntas.length) return "";
  return `<section class="sec preg"><div class="w preg-g"><h2 data-r>Preguntas frecuentes</h2><div class="preg-l" data-r>${d.preguntas
    .map((p) => `<details><summary><span>${esc(p.pregunta)}</span><svg class="mas" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></summary><p>${esc(p.respuesta)}</p></details>`)
    .join("")}</div></div></section>`;
}

function seccionBanda(d, t, f) {
  if (!f) return "";
  return `<section class="banda-f" aria-label="${esc(CIERRE[d.rubro])}">${imgFoto(f, d)}<div class="fh-velo"></div><div class="w banda-txt" data-r><h2>${esc(CIERRE[d.rubro])}</h2>${botonWa(d, t, "btn btn-1", "Escribir por WhatsApp")}</div>${f.pie ? `<p class="fh-pie">${esc(f.pie)}</p>` : ""}</section>`;
}

function estilosFoto(t) {
  const inm = t.foto === "inmersivo";
  return `
/* Modo con fotos */
.fh{position:relative}
.fh-img{display:block;width:100%;height:100%;object-fit:cover}
.fh-velo{position:absolute;inset:0;pointer-events:none;background:linear-gradient(0deg,rgba(10,10,10,.86) 0%,rgba(10,10,10,.62) 26%,rgba(10,10,10,.18) 50%,rgba(10,10,10,0) 64%),linear-gradient(180deg,rgba(10,10,10,.45) 0%,rgba(10,10,10,0) 20%)}
.fh-pie{position:absolute;right:clamp(16px,3vw,32px);top:clamp(76px,9vw,96px);z-index:2;margin:0;font:500 13px/1.3 var(--cuerpo);letter-spacing:.02em;color:rgba(255,255,255,.82)}
.fh-inm{height:calc(100svh - var(--franja) - env(safe-area-inset-bottom));min-height:560px;max-height:1000px;overflow:hidden;color:#fff;background:#1a1a1a}
.fh-inm .fh-img{position:absolute;inset:0}
.fh-txt{position:absolute;left:0;right:0;bottom:clamp(28px,5vh,56px);z-index:2}
.fh-nombre{font-size:clamp(68px,20vw,104px);line-height:.88;letter-spacing:-.035em;font-variation-settings:"wdth" 112;max-width:none;color:#fff;margin-left:-.04em}
@media (min-width:760px){.fh-nombre{font-size:min(11.6vw,200px);white-space:nowrap}.fh-nombre-m{font-size:min(8.4vw,150px)}.fh-nombre-l{font-size:min(6vw,110px);white-space:normal}}
@media (max-width:759px){.fh-nombre-m{font-size:clamp(48px,14vw,80px)}.fh-nombre-l{font-size:clamp(40px,11vw,64px)}}
.fh-fila{display:grid;gap:20px;margin-top:clamp(20px,2.6vw,32px);padding-top:clamp(18px,2vw,24px);border-top:1px solid rgba(255,255,255,.32)}
@media (min-width:900px){.fh-fila{grid-template-columns:1fr auto;align-items:center;gap:40px}.fh-fila .acciones{margin-top:0!important}}
.fh-promesa{font:500 clamp(20px,2.2vw,28px)/1.25 var(--disp);letter-spacing:-.015em;max-width:24em;color:rgba(255,255,255,.94)}
.fh-h1{font-size:clamp(44px,7.6vw,104px);line-height:.98;max-width:12em;color:#fff}
.fh-inm .acciones{margin-top:clamp(24px,3vw,36px)}
.fh-mono .acciones{margin-top:0}
.fh-inm .btn-2{color:#fff;border-color:rgba(255,255,255,.5)}
@media (hover:hover){.fh-inm .btn-2:hover{background:rgba(255,255,255,.12)}}
@media (max-width:559px){.fh-inm .btn-2,.marco .btn-2{display:none}.marco{height:min(74svh,640px);min-height:480px}}
@media (prefers-reduced-motion:no-preference){.fh-img{animation:acerca 1.8s var(--ease) both}@keyframes acerca{from{transform:scale(1.07)}to{transform:none}}.fh-promesa{animation:sube .8s var(--ease) both .1s}.fh-inm .acciones{animation:sube .8s var(--ease) both .18s}.fh-txt h1{animation:sube-h .9s var(--ease) both}}
${inm ? `html.sobre .nav{position:fixed;left:0;right:0;background:linear-gradient(180deg,rgba(10,10,10,.4),rgba(10,10,10,0));border-color:transparent;color:#fff;transition:background-color .35s var(--ease),color .35s var(--ease),border-color .35s}
html.sobre .nav .marca{color:inherit}html.sobre .nav nav a:not(.btn){color:rgba(255,255,255,.82)}
html.sobre .nav.solida{background:var(--fondo);color:var(--tinta);border-color:var(--linea)}html.sobre .nav.solida nav a:not(.btn){color:var(--tinta2)}` : ""}
.fh-div{display:grid;background:var(--banda);color:var(--sobre-banda)}
.fh-div-foto{margin:0;position:relative;aspect-ratio:4/3;overflow:hidden}
.fh-div-txt{display:flex;align-items:center;padding:clamp(40px,7vw,96px) clamp(20px,5vw,80px)}
.fh-div-in{max-width:34rem}
.fh-div h1{font-size:clamp(38px,5.4vw,72px);line-height:1.02}
.fh-div .bajada{color:color-mix(in srgb,var(--sobre-banda) 78%,transparent)}
.fh-div .rapidos{color:color-mix(in srgb,var(--sobre-banda) 72%,transparent)}
.fh-div .btn-1{background:var(--acento);color:${"#111"};box-shadow:none}
.fh-div .btn-2{color:var(--sobre-banda)}
@media (min-width:960px){.fh-div{grid-template-columns:1fr 1fr;min-height:min(88svh,860px)}.fh-div-foto{order:2;aspect-ratio:auto}.fh-div-txt{order:1}}
.fh-marco{padding:clamp(12px,2vw,24px) 0 clamp(24px,4vw,48px)}
.marco{position:relative;overflow:hidden;border-radius:calc(var(--r) + 10px);height:min(82svh,760px);min-height:520px;color:#fff;background:#1a1a1a}
.marco .fh-img{position:absolute;inset:0}
.marco-txt{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:clamp(24px,5vw,64px)}
.marco h1{font-size:clamp(36px,6vw,80px);line-height:1;max-width:13em}
.marco .btn-2{color:#fff;border-color:rgba(255,255,255,.5)}
.fh-marco .rapidos{margin-top:20px}
/* Intro */
.intro{padding-block:clamp(64px,10vw,140px)}
.intro-g{display:grid;gap:clamp(32px,5vw,72px)}
@media (min-width:900px){.intro-g{grid-template-columns:minmax(0,8fr) minmax(0,4fr);align-items:end}}
.intro-t{font:500 clamp(24px,3.2vw,44px)/1.18 var(--disp);letter-spacing:-.022em;max-width:24em;text-wrap:balance}
.hechos{list-style:none;margin:0;padding:0;border-top:1px solid var(--linea)}
.hechos li{display:flex;gap:12px;align-items:flex-start;padding:16px 0;border-bottom:1px solid var(--linea);font-size:16px;color:var(--tinta2)}
.hechos .ic{color:var(--acento);margin-top:3px}
.hechos a{text-decoration:none;color:var(--tinta);font-weight:600;display:grid;gap:2px}.hechos a:hover{text-decoration:underline;text-underline-offset:3px}
.seg{font-weight:400;color:var(--tinta2)}
/* Galería */
.galeria-f{padding-top:0}
.galeria-f h2{margin-bottom:clamp(24px,3vw,40px)}
.g{display:grid;gap:clamp(8px,1vw,14px)}
.g-fila{display:grid;gap:inherit;grid-template-columns:repeat(12,minmax(0,1fr))}
.g-f{position:relative;margin:0;overflow:hidden;background:var(--sup);grid-column:span var(--c);border-radius:var(--r)}
.g-8-4{aspect-ratio:12/5.6}.g-4-4-4{aspect-ratio:12/5}.g-5-7{aspect-ratio:12/4.6}.g-12{aspect-ratio:12/5.2}.g-6-6{aspect-ratio:12/4.8}
.g-f img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.g-f figcaption,.fs-foto figcaption{position:absolute;left:0;right:0;bottom:0;padding:28px 16px 12px;font:500 13px/1.3 var(--cuerpo);letter-spacing:.02em;color:#fff;background:linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,0))}
@media (hover:hover){.g-f:hover img{transform:scale(1.035)}}
@media (max-width:759px){.g{grid-template-columns:1fr 1fr}.g-fila{display:contents}.g-f{grid-column:span 1;aspect-ratio:4/5}.g-f.m-full{grid-column:1/-1;aspect-ratio:4/3}}
@media (prefers-reduced-motion:no-preference){html.rv .g-f[data-r] img{transform:scale(1.08)}html.rv .g-f[data-r].in img{transform:none;transition:transform 1.4s var(--ease)}}
/* Servicios con fotos */
.fs-l{list-style:none;margin:0;padding:0;border-top:1px solid var(--linea)}
.fs-i{display:grid;gap:12px 32px;padding:clamp(24px,3vw,40px) 0;border-bottom:1px solid var(--linea)}
.fs-txt h3{font-size:clamp(26px,3.2vw,44px);line-height:1.02;letter-spacing:-.03em}
.fs-txt p{color:var(--tinta2);font-size:16.5px;line-height:1.6;max-width:40em;margin-top:12px}
.fs-foto{position:relative;margin:0;overflow:hidden;border-radius:var(--r);aspect-ratio:16/10;background:var(--sup)}
.fs-foto img{width:100%;height:100%;object-fit:cover}
@media (min-width:860px){.fs-i{grid-template-columns:minmax(0,5fr) minmax(0,7fr);align-items:center}.fs-i:not(.fs-con) .fs-txt{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:32px;grid-column:1/-1;align-items:baseline}.fs-i:not(.fs-con) .fs-txt p{margin-top:0}.fs-flip .fs-txt{order:2}.fs-flip{grid-template-columns:minmax(0,7fr) minmax(0,5fr)}}
/* Proceso */
.proc-l{list-style:none;margin:0;padding:0;display:grid;gap:12px}
@media (min-width:760px){.proc-l{grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px}}
.proc-l li{border-top:2px solid var(--tinta);padding-top:18px}
.proc-n{display:block;font:600 15px/1 var(--cuerpo);color:var(--acento);margin-bottom:14px;font-variant-numeric:tabular-nums}
.proc-l h3{margin-bottom:8px}.proc-l p{color:var(--tinta2);font-size:16px}
/* Banda de cierre */
.banda-f{position:relative;height:min(78svh,760px);min-height:480px;overflow:hidden;color:#fff;background:#1a1a1a;display:flex;align-items:flex-end}
.banda-f>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 65%}
@media (max-width:759px){.banda-f{height:64svh;min-height:420px}}
.banda-txt{position:relative;z-index:2;padding-bottom:clamp(48px,8vw,96px)}
.banda-txt h2{font-size:clamp(40px,7vw,96px);line-height:.95;margin-bottom:28px;color:#fff;max-width:10em}
/* Preguntas */
.preg{background:var(--sup)}
.preg-g{display:grid;gap:24px}
@media (min-width:900px){.preg-g{grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:64px}.preg-g h2{position:sticky;top:96px;align-self:start}}
.preg-l{border-top:1px solid var(--linea)}
.preg-l details{border-bottom:1px solid var(--linea)}
.preg-l summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 0;min-height:64px;cursor:pointer;font:var(--peso) clamp(19px,2vw,24px)/1.25 var(--disp);letter-spacing:-.015em;-webkit-tap-highlight-color:transparent}
.preg-l summary::-webkit-details-marker{display:none}
.mas{width:22px;height:22px;flex:none;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;transition:transform .25s var(--ease)}
.preg-l details[open] .mas{transform:rotate(45deg)}
.preg-l details p{padding:0 0 24px;color:var(--tinta2);max-width:44em}
@media (hover:hover){.preg-l summary:hover{color:var(--pri)}}`;
}

const SCRIPT_CABEZA = `(function(){try{var de=document.documentElement;if(de.getAttribute('data-nav')==='sobre'&&'IntersectionObserver' in window)de.classList.add('sobre');if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;document.documentElement.classList.add('rv');setTimeout(function(){document.querySelectorAll('[data-r]:not(.in)').forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight)e.classList.add('in')})},2500)}catch(e){}})();`;
const SCRIPT_PIE = `(function(){var d=document.documentElement;if(d.classList.contains('rv')){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});document.querySelectorAll('[data-r]').forEach(function(e){io.observe(e)})}var f=document.querySelector('.flota'),c=document.getElementById('contacto');if(f&&c&&'IntersectionObserver' in window){new IntersectionObserver(function(es){f.classList.toggle('oculta',es[0].isIntersecting)},{threshold:.15}).observe(c)}var n=document.querySelector('.nav'),h=document.querySelector('.fh-inm');if(n&&h&&'IntersectionObserver' in window){new IntersectionObserver(function(es){n.classList.toggle('solida',!es[0].isIntersecting)},{rootMargin:'-72px 0px 0px 0px'}).observe(h)}var fh=document.querySelector('.fh');if(f&&fh&&'IntersectionObserver' in window){new IntersectionObserver(function(es){f.classList.toggle('en-hero',es[0].isIntersecting)},{threshold:.35}).observe(fh)}})();`;

/* ---------- Página ---------- */
export function generar(entrada) {
  const d = normalizar(entrada);
  const t = TEMAS[d.rubro];
  const conFotos = d.fotos.length > 0;
  const reparto = repartirFotos(d);
  const secciones = {
    servicios: seccionServicios(d, t),
    razones: seccionRazones(d, t),
    galeria: seccionGaleria(d),
    contacto: seccionContacto(d, t),
  };
  /* Con fotos: hero de foto, presentación, galería, servicios (con sus fotos), cómo trabajamos (solo si vino en los datos),
     banda de cierre, preguntas y contacto. Sin fotos: el orden de secciones propio de cada rubro. */
  const cuerpo = conFotos
    ? [heroFoto(d, t, reparto.hero), seccionIntro(d), seccionGaleriaFotos(d, t, reparto.galeria), seccionServiciosFotos(d, t, reparto.porServicio), seccionProceso(d), seccionBanda(d, t, reparto.banda), seccionPreguntas(d), secciones.contacto].join("")
    : heroDe(d, t) + t.orden.map((k) => secciones[k]).join("") + seccionProceso(d) + seccionPreguntas(d);
  const navLinks = [
    conFotos && reparto.galeria.length ? `<a href="#fotos">${esc(d.tituloGaleria || t.tituloGaleria)}</a>` : "",
    d.servicios.length ? `<a href="#servicios">${esc(t.tituloServicios)}</a>` : "",
    secciones.contacto ? `<a href="#contacto">Contacto</a>` : "",
  ].join("");
  const flota = d.whatsapp ? `<a class="flota" href="${esc(linkWhatsapp(d.whatsapp, t.mensaje(d)))}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp a ${esc(d.negocio)}">${icono("wa")}</a>` : "";
  const titulo = `${d.negocio}${d.ciudad ? ` · ${d.ciudad}` : ""}`;
  const descripcion = d.descripcion || (typeof t.promesa === "function" ? t.promesa(d) : "");
  const fuentes = `https://fonts.googleapis.com/css2?${t.fuente}&display=swap`;
  const msgDueno = `Hola Valentín, vi la propuesta de web para ${d.negocio} y me interesa.`;
  return `<!doctype html>
<html lang="es" data-rubro="${esc(d.rubro)}"${conFotos && t.foto === "inmersivo" ? ' data-nav="sobre"' : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<meta name="theme-color" content="${esc(t.hero === "editorial" || t.hero === "banda" ? (d.colores.primario && t.hero === "banda" ? d.colores.primario : t.hero === "banda" ? t.paleta.primario : t.paleta.banda) : t.paleta.fondo)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(fuentes)}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${esc(fuentes)}"></noscript>
<script>${SCRIPT_CABEZA}</script>
${conFotos ? `<link rel="preload" as="image" href="${esc(varianteFoto(reparto.hero.url, 1600))}" imagesrcset="${esc(srcsetDe(reparto.hero.url))}" imagesizes="${t.foto === "dividido" ? "(min-width:960px) 50vw, 100vw" : "100vw"}" fetchpriority="high">` : ""}
<style>${estilos(d, t)}${conFotos ? estilosFoto(t) : ""}</style>
</head>
<body>
${SPRITE}
${d.ficticio ? '<p class="aviso">Ejemplo con datos ficticios: este negocio no existe.</p>' : ""}
<div class="nav"><div class="w"><a class="marca" href="#">${esc(d.negocio)}</a><nav aria-label="Secciones">${navLinks}${botonWa(d, t, "btn btn-1", "WhatsApp")}</nav></div></div>
<main>
${cuerpo}
</main>
${seccionPropuesta(d)}
<footer class="pie"><div class="w"><span>${esc(d.negocio)}${d.ciudad ? `, ${esc(d.ciudad)}` : ""}</span><span>Sitio de ejemplo, no oficial</span></div></footer>
${flota}
<div class="franja" role="note"><div class="w"><p>Propuesta de ejemplo preparada por ${esc(DUENO.nombre)} · Si te gusta, la dejamos online en ${PLAZO}</p><a href="${esc(contactoDueno(msgDueno))}" target="_blank" rel="noopener">${icono("wa")}<span>La quiero</span></a></div></div>
<script>${SCRIPT_PIE}</script>
</body>
</html>
`;
}

/* ---------- Publicación ---------- */
export const urlDemo = (slug) => `${SITIO}/demo/${slug}`;

/* ---------- Muestra guardada en la base ---------- */
/* Lo que hay en `ajustes.valor` para `demo:<slug>`: un JSON con los datos (la página se arma al pedirla; registro de ~1 KB)
   o el HTML ya generado. Devuelve el HTML a servir, o null si el valor está vacío, es un JSON roto, pasa de 20 KB o no
   tiene `negocio` (la ruta responde 404, nunca 500). */
export const MAX_JSON_DEMO = 20_000;

export function htmlDeValor(valor) {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim();
  if (!limpio) return null;
  if (!limpio.startsWith("{")) return valor;
  if (limpio.length > MAX_JSON_DEMO) return null;
  try {
    const datos = JSON.parse(limpio);
    if (!datos || typeof datos !== "object" || Array.isArray(datos)) return null;
    return generar(datos);
  } catch {
    return null;
  }
}
