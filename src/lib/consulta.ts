import { TIPOS_CONSULTA, type TipoConsulta } from "./sitio.ts";

export type ConsultaEntrada = {
  nombre?: unknown;
  contacto?: unknown;
  tipo?: unknown;
  mensaje?: unknown;
  /** Honeypot: un humano nunca lo completa. */
  web?: unknown;
  origen?: unknown;
};

export type ConsultaValida = {
  nombre: string;
  email: string | null;
  telefono: string | null;
  tipo: TipoConsulta;
  mensaje: string;
  origen: string;
};

export type ResultadoValidacion =
  | { ok: true; datos: ConsultaValida }
  | { ok: false; spam: boolean; errores: Partial<Record<"nombre" | "contacto" | "tipo" | "mensaje", string>> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texto(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function validarConsulta(e: ConsultaEntrada): ResultadoValidacion {
  if (typeof e.web === "string" && e.web.trim() !== "") return { ok: false, spam: true, errores: {} };

  const errores: Partial<Record<"nombre" | "contacto" | "tipo" | "mensaje", string>> = {};
  const nombre = texto(e.nombre, 120);
  const contacto = texto(e.contacto, 160);
  const mensaje = texto(e.mensaje, 2000);
  const tipo = texto(e.tipo, 20);

  if (nombre.length < 2) errores.nombre = "Escribí tu nombre.";

  let email: string | null = null;
  let telefono: string | null = null;
  if (EMAIL.test(contacto)) email = contacto.toLowerCase();
  else {
    const digitos = contacto.replace(/\D/g, "");
    if (digitos.length >= 8 && digitos.length <= 15 && /^[\d\s+()\-.]+$/.test(contacto)) telefono = contacto;
    else errores.contacto = "Pasame un mail o un WhatsApp para poder responderte.";
  }

  const tipoValido = TIPOS_CONSULTA.find((t) => t.valor === tipo);
  if (!tipoValido) errores.tipo = "Elegí qué necesitás.";

  if (Object.keys(errores).length > 0 || !tipoValido) return { ok: false, spam: false, errores };

  return {
    ok: true,
    datos: { nombre, email, telefono, tipo: tipoValido.valor, mensaje, origen: texto(e.origen, 80) || "/" },
  };
}
