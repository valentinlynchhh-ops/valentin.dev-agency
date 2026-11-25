/* Acceso a datos del CRM. En producción usa Supabase (service role, solo servidor). Con CRM_MODO=memoria y fuera de
   producción usa datos en memoria (ficticios) para probar la interfaz sin tocar ninguna base. */
import { db } from "./db.ts";
import {
  clasificarAcciones,
  contarPorEstado,
  limpiarBusqueda,
  type Accion,
  type AccionConContacto,
  type Consulta,
  type Contacto,
  type Estado,
  type Nota,
  type Origen,
  type Tablero,
} from "./crmLogica.ts";

export type NuevoContacto = {
  nombre: string;
  empresa?: string | null;
  email?: string | null;
  telefono?: string | null;
  rubro?: string | null;
  ciudad?: string | null;
  web?: string | null;
  instagram?: string | null;
  origen?: Origen;
  valor_usd?: number | null;
};

export type Ficha = { contacto: Contacto; notas: Nota[]; acciones: Accion[]; consultas: Consulta[] };

export type ResumenHoy = {
  tablero: Tablero;
  nuevos: Contacto[];
  porEstado: Record<Estado, number>;
  total: number;
  consultasSinAtender: number;
};

export interface RepoCRM {
  listar(filtro: { estado?: Estado; q?: string }): Promise<Contacto[]>;
  ficha(id: string): Promise<Ficha | null>;
  crear(datos: NuevoContacto): Promise<string>;
  editar(id: string, datos: Partial<NuevoContacto>): Promise<void>;
  cambiarEstado(id: string, estado: Estado): Promise<void>;
  nota(id: string, texto: string): Promise<void>;
  accion(id: string, texto: string, venceEl: string): Promise<void>;
  completar(accionId: string): Promise<void>;
  resumen(hoy: string): Promise<ResumenHoy>;
}

const LIMITE = 300;

/* ------------------------------- Supabase ------------------------------- */

function repoSupabase(): RepoCRM | null {
  const base = db();
  if (!base) return null;
  const ok = <T>(r: { data: T | null; error: { message: string } | null }): T => {
    if (r.error) throw new Error(r.error.message);
    return r.data as T;
  };
  return {
    async listar({ estado, q }) {
      let consulta = base.from("contactos").select("*").order("actualizado_at", { ascending: false }).limit(LIMITE);
      if (estado) consulta = consulta.eq("estado", estado);
      const limpio = q ? limpiarBusqueda(q) : "";
      if (limpio) {
        const p = `%${limpio}%`;
        consulta = consulta.or(`nombre.ilike.${p},empresa.ilike.${p},email.ilike.${p},telefono.ilike.${p},rubro.ilike.${p}`);
      }
      return ok(await consulta) as Contacto[];
    },
    async ficha(id) {
      const { data: contacto } = await base.from("contactos").select("*").eq("id", id).maybeSingle();
      if (!contacto) return null;
      const [notas, acciones, consultas] = await Promise.all([
        base.from("notas").select("*").eq("contacto_id", id).order("creado_at", { ascending: false }).limit(100),
        base.from("acciones").select("*").eq("contacto_id", id).order("hecha").order("vence_el").limit(50),
        base.from("consultas").select("id,tipo,mensaje,origen,creado_at").eq("contacto_id", id).order("creado_at", { ascending: false }).limit(20),
      ]);
      return { contacto: contacto as Contacto, notas: ok(notas) as Nota[], acciones: ok(acciones) as Accion[], consultas: ok(consultas) as Consulta[] };
    },
    async crear(datos) {
      const r = await base.from("contactos").insert({ origen: "manual", ...datos }).select("id").single();
      return (ok(r) as { id: string }).id;
    },
    async editar(id, datos) {
      ok(await base.from("contactos").update(datos).eq("id", id).select("id").single());
    },
    async cambiarEstado(id, estado) {
      ok(await base.from("contactos").update({ estado }).eq("id", id).select("id").single());
    },
    async nota(id, texto) {
      ok(await base.from("notas").insert({ contacto_id: id, texto }).select("id").single());
      await base.from("contactos").update({ actualizado_at: new Date().toISOString() }).eq("id", id);
    },
    async accion(id, texto, venceEl) {
      ok(await base.from("acciones").insert({ contacto_id: id, texto, vence_el: venceEl }).select("id").single());
    },
    async completar(accionId) {
      ok(await base.from("acciones").update({ hecha: true, hecha_at: new Date().toISOString() }).eq("id", accionId).select("id").single());
    },
    async resumen(hoy) {
      const [pend, nuevos, estados, sinAtender] = await Promise.all([
        base.from("acciones").select("id,contacto_id,texto,vence_el,hecha,contactos(nombre)").eq("hecha", false).order("vence_el").limit(200),
        base.from("contactos").select("*").eq("estado", "nuevo").order("creado_at", { ascending: false }).limit(10),
        base.from("contactos").select("estado").limit(5000),
        base.from("consultas").select("id", { count: "exact", head: true }).eq("avisada", false),
      ]);
      const acciones: AccionConContacto[] = (ok(pend) as unknown as (Accion & { contactos: { nombre: string } | { nombre: string }[] | null })[]).map((a) => {
        const c = Array.isArray(a.contactos) ? a.contactos[0] : a.contactos;
        return { id: a.id, contacto_id: a.contacto_id, texto: a.texto, vence_el: a.vence_el, hecha: a.hecha, contacto_nombre: c?.nombre ?? "(sin nombre)" };
      });
      const lista = ok(estados) as { estado: Estado }[];
      return {
        tablero: clasificarAcciones(acciones, hoy),
        nuevos: ok(nuevos) as Contacto[],
        porEstado: contarPorEstado(lista),
        total: lista.length,
        consultasSinAtender: sinAtender.count ?? 0,
      };
    },
  };
}

/* -------------------------- Memoria (solo desarrollo) -------------------------- */

type Estadoo = { contactos: Contacto[]; notas: Nota[]; acciones: Accion[]; consultas: (Consulta & { contacto_id: string })[] };

function semilla(): Estadoo {
  const ahora = new Date().toISOString();
  const hoy = ahora.slice(0, 10);
  const mk = (n: number, nombre: string, estado: Estado, extra: Partial<Contacto> = {}): Contacto => ({
    id: `00000000-0000-4000-8000-00000000000${n}`,
    nombre,
    empresa: null,
    email: null,
    telefono: null,
    rubro: null,
    ciudad: null,
    web: null,
    instagram: null,
    origen: "manual",
    estado,
    valor_usd: null,
    estado_at: ahora,
    creado_at: ahora,
    actualizado_at: ahora,
    ...extra,
  });
  const contactos = [
    mk(1, "Ana (ejemplo ficticio)", "nuevo", { telefono: "11 5555 1234", rubro: "Estudio contable", ciudad: "San Isidro", origen: "web" }),
    mk(2, "Marcos (ejemplo ficticio)", "muestra_enviada", { email: "marcos@ejemplo.test", rubro: "Inmobiliaria", ciudad: "Pilar", valor_usd: 450 }),
    mk(3, "Lucía (ejemplo ficticio)", "propuesta", { telefono: "11 5555 9876", rubro: "Salud", ciudad: "CABA", valor_usd: 350 }),
  ];
  return {
    contactos,
    notas: [{ id: "n1", contacto_id: contactos[1].id, texto: "Datos de ejemplo para probar la pantalla.", creado_at: ahora }],
    acciones: [
      { id: "a1", contacto_id: contactos[0].id, texto: "Responder la consulta de la web", vence_el: hoy, hecha: false },
      { id: "a2", contacto_id: contactos[1].id, texto: "Seguimiento de la muestra", vence_el: hoy, hecha: false },
    ],
    consultas: [{ id: "q1", contacto_id: contactos[0].id, tipo: "landing", mensaje: "Hola, quiero una landing.", origen: "/", creado_at: ahora }],
  };
}

function repoMemoria(): RepoCRM {
  const g = globalThis as unknown as { __crmMemoria?: Estadoo };
  const e = (g.__crmMemoria ??= semilla());
  const nombreDe = (id: string) => e.contactos.find((c) => c.id === id)?.nombre ?? "(sin nombre)";
  const tocar = (id: string) => {
    const c = e.contactos.find((x) => x.id === id);
    if (c) c.actualizado_at = new Date().toISOString();
  };
  return {
    async listar({ estado, q }) {
      const t = q ? limpiarBusqueda(q).toLowerCase() : "";
      return e.contactos
        .filter((c) => (!estado || c.estado === estado) && (!t || [c.nombre, c.empresa, c.email, c.telefono, c.rubro].some((x) => x?.toLowerCase().includes(t))))
        .sort((a, b) => b.actualizado_at.localeCompare(a.actualizado_at));
    },
    async ficha(id) {
      const contacto = e.contactos.find((c) => c.id === id);
      if (!contacto) return null;
      return {
        contacto,
        notas: e.notas.filter((n) => n.contacto_id === id),
        acciones: e.acciones.filter((a) => a.contacto_id === id),
        consultas: e.consultas.filter((q) => q.contacto_id === id),
      };
    },
    async crear(datos) {
      const ahora = new Date().toISOString();
      const id = crypto.randomUUID();
      e.contactos.push({ empresa: null, email: null, telefono: null, rubro: null, ciudad: null, web: null, instagram: null, valor_usd: null, origen: "manual", ...datos, id, estado: "nuevo", estado_at: ahora, creado_at: ahora, actualizado_at: ahora });
      return id;
    },
    async editar(id, datos) {
      const c = e.contactos.find((x) => x.id === id);
      if (c) Object.assign(c, datos, { actualizado_at: new Date().toISOString() });
    },
    async cambiarEstado(id, estado) {
      const c = e.contactos.find((x) => x.id === id);
      if (c) Object.assign(c, { estado, estado_at: new Date().toISOString(), actualizado_at: new Date().toISOString() });
    },
    async nota(id, texto) {
      e.notas.unshift({ id: crypto.randomUUID(), contacto_id: id, texto, creado_at: new Date().toISOString() });
      tocar(id);
    },
    async accion(id, texto, venceEl) {
      e.acciones.push({ id: crypto.randomUUID(), contacto_id: id, texto, vence_el: venceEl, hecha: false });
    },
    async completar(accionId) {
      const a = e.acciones.find((x) => x.id === accionId);
      if (a) a.hecha = true;
    },
    async resumen(hoy) {
      const acciones = e.acciones.map((a) => ({ ...a, contacto_nombre: nombreDe(a.contacto_id) }));
      return {
        tablero: clasificarAcciones(acciones, hoy),
        nuevos: e.contactos.filter((c) => c.estado === "nuevo"),
        porEstado: contarPorEstado(e.contactos),
        total: e.contactos.length,
        consultasSinAtender: 0,
      };
    },
  };
}

export type ModoCRM = "supabase" | "memoria" | "sin-base";

export function modoCRM(): ModoCRM {
  if (process.env.CRM_MODO === "memoria" && process.env.NODE_ENV !== "production") return "memoria";
  return db() ? "supabase" : "sin-base";
}

/** Repositorio del CRM, o null si no hay base conectada. */
export function repo(): RepoCRM | null {
  const m = modoCRM();
  if (m === "memoria") return repoMemoria();
  if (m === "supabase") return repoSupabase();
  return null;
}
