"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ADMIN, DURACION_S, adminConfigurado, contrasenaCorrecta, crearToken, tokenValido } from "@/lib/adminSesion";
import { repo } from "@/lib/crm";
import { esEstado, fechaValida, hoyArgentina, sumarDias, type Origen, ORIGENES } from "@/lib/crmLogica";

/* Acciones del CRM. Cada una revisa la sesión por su cuenta (además del proxy) y guarda solo lo que validó. */

const texto = (f: FormData, k: string, max = 200): string => {
  const v = f.get(k);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
};
const opcional = (f: FormData, k: string, max = 200): string | null => texto(f, k, max) || null;

async function exigirSesion() {
  if (!(await tokenValido((await cookies()).get(COOKIE_ADMIN)?.value))) redirect("/admin/login");
}

function exigirRepo() {
  const r = repo();
  if (!r) redirect("/admin?error=sin-base");
  return r;
}

/* Tope de intentos de login por IP (en memoria de la instancia: frena fuerza bruta casual). */
const intentos = new Map<string, number[]>();

export async function entrar(formData: FormData) {
  if (!adminConfigurado()) redirect("/admin/login?error=config");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";
  const ahora = Date.now();
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < 15 * 60_000);
  if (recientes.length >= 5) redirect("/admin/login?error=espera");
  if (!(await contrasenaCorrecta(texto(formData, "clave", 200)))) {
    intentos.set(ip, [...recientes, ahora]);
    redirect("/admin/login?error=clave");
  }
  intentos.delete(ip);
  (await cookies()).set(COOKIE_ADMIN, await crearToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/admin", maxAge: DURACION_S });
  redirect("/admin");
}

export async function salir() {
  (await cookies()).delete({ name: COOKIE_ADMIN, path: "/admin" });
  redirect("/admin/login");
}

export async function crearContacto(formData: FormData) {
  await exigirSesion();
  const nombre = texto(formData, "nombre", 120);
  if (nombre.length < 2) redirect("/admin/contactos/nuevo?error=nombre");
  const origenCrudo = texto(formData, "origen", 20) as Origen;
  const valor = Number(texto(formData, "valor_usd", 8));
  const id = await exigirRepo().crear({
    nombre,
    empresa: opcional(formData, "empresa", 120),
    email: opcional(formData, "email", 160)?.toLowerCase() ?? null,
    telefono: opcional(formData, "telefono", 40),
    rubro: opcional(formData, "rubro", 80),
    ciudad: opcional(formData, "ciudad", 80),
    web: opcional(formData, "web", 200),
    instagram: opcional(formData, "instagram", 80),
    origen: ORIGENES.includes(origenCrudo) ? origenCrudo : "manual",
    valor_usd: Number.isFinite(valor) && valor > 0 ? Math.round(valor) : null,
  });
  redirect(`/admin/contactos/${id}?ok=1`);
}

export async function guardarDatos(formData: FormData) {
  await exigirSesion();
  const id = texto(formData, "id", 60);
  const valor = Number(texto(formData, "valor_usd", 8));
  await exigirRepo().editar(id, {
    empresa: opcional(formData, "empresa", 120),
    email: opcional(formData, "email", 160)?.toLowerCase() ?? null,
    telefono: opcional(formData, "telefono", 40),
    rubro: opcional(formData, "rubro", 80),
    ciudad: opcional(formData, "ciudad", 80),
    web: opcional(formData, "web", 200),
    instagram: opcional(formData, "instagram", 80),
    valor_usd: Number.isFinite(valor) && valor > 0 ? Math.round(valor) : null,
  });
  redirect(`/admin/contactos/${id}?ok=1`);
}

export async function moverEstado(formData: FormData) {
  await exigirSesion();
  const id = texto(formData, "id", 60);
  const estado = texto(formData, "estado", 30);
  if (!esEstado(estado)) redirect(`/admin/contactos/${id}?error=estado`);
  await exigirRepo().cambiarEstado(id, estado);
  redirect(`/admin/contactos/${id}?ok=1`);
}

export async function agregarNota(formData: FormData) {
  await exigirSesion();
  const id = texto(formData, "id", 60);
  const t = texto(formData, "texto", 4000);
  if (t) await exigirRepo().nota(id, t);
  redirect(`/admin/contactos/${id}?ok=1`);
}

export async function agregarAccion(formData: FormData) {
  await exigirSesion();
  const id = texto(formData, "id", 60);
  const t = texto(formData, "texto", 500);
  const dias = Number(texto(formData, "dias", 3));
  const fecha = texto(formData, "fecha", 10);
  const hoy = hoyArgentina();
  const vence = Number.isInteger(dias) && dias > 0 && dias <= 90 ? sumarDias(hoy, dias) : fechaValida(fecha) ? fecha : sumarDias(hoy, 1);
  if (t) await exigirRepo().accion(id, t, vence);
  redirect(`/admin/contactos/${id}?ok=1`);
}

export async function completarAccion(formData: FormData) {
  await exigirSesion();
  await exigirRepo().completar(texto(formData, "accion", 60));
  const vuelta = texto(formData, "vuelta", 80);
  redirect(vuelta.startsWith("/admin") ? vuelta : "/admin");
}
