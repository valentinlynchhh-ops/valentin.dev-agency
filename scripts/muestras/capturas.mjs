#!/usr/bin/env node
/* Capturas de las muestras de web (una por rubro) en celular (375×812) y compu (1440×900), para revisarlas con los ojos.
   Uso: node scripts/demos/capturas.mjs <carpeta-salida>
   Usa los ejemplos de scripts/demos/ejemplos/ y arma con datos ficticios los rubros que no tienen archivo. */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generar } from "./generar.mjs";

const pw = await import("/opt/node-tools/node_modules/playwright/index.mjs").catch(() => import("playwright"));
const aqui = dirname(fileURLToPath(import.meta.url));
const salida = process.argv[2] || join(aqui, "capturas");
mkdirSync(salida, { recursive: true });

const base = { ficticio: true, ciudad: "Buenos Aires", direccion: "Calle Ejemplo 100", whatsapp: "+54 9 11 0000-0000", telefono: "+54 11 0000-0000", email: "hola@ejemplo.example", horarios: ["Lunes a viernes de 9 a 18 h"] };
const extra = {
  arquitectura: { ...base, negocio: "Estudio Ejemplo Norte Arquitectura", rubro: "arquitectura", descripcion: "Estudio de arquitectura de ejemplo con datos ficticios: vivienda, reformas e interiores.", servicios: [{ nombre: "Vivienda unifamiliar", detalle: "Proyecto y dirección de obra." }, { nombre: "Reformas", detalle: "Cocinas, baños y ampliaciones." }, { nombre: "Interiores", detalle: "Diseño de espacios y equipamiento." }, { nombre: "Trámites municipales" }] },
  salud: { ...base, negocio: "Consultorio Odontológico Ejemplo", rubro: "odontologia", descripcion: "Consultorio de ejemplo con datos ficticios en Palermo.", servicios: [{ nombre: "Limpieza y control" }, { nombre: "Ortodoncia", detalle: "Brackets y alineadores." }, { nombre: "Implantes" }, { nombre: "Blanqueamiento" }, { nombre: "Odontopediatría", detalle: "Atención para chicos." }] },
  comercio: { ...base, negocio: "Distribuidora Ejemplo Sur", rubro: "distribuidora", descripcion: "Distribuidora de ejemplo con datos ficticios: insumos de limpieza y descartables para comercios.", servicios: [{ nombre: "Limpieza", detalle: "Lavandina, detergentes y desinfectantes por bulto." }, { nombre: "Descartables", detalle: "Bandejas, vasos y bolsas." }, { nombre: "Papelería", detalle: "Rollos de cocina y papel higiénico institucional." }] },
  generico: { ...base, negocio: "Taller Ejemplo Mecánica Integral", rubro: "taller mecánico", descripcion: "Taller de ejemplo con datos ficticios.", servicios: [{ nombre: "Service completo", detalle: "Aceite, filtros y revisión general." }, { nombre: "Frenos" }, { nombre: "Tren delantero" }, { nombre: "Diagnóstico computarizado" }] },
};
const muestras = Object.fromEntries([
  ...readdirSync(join(aqui, "ejemplos")).filter((f) => f.endsWith(".json")).map((f) => [f.replace(".json", ""), JSON.parse(readFileSync(join(aqui, "ejemplos", f), "utf8"))]),
  ...Object.entries(extra),
]);

const navegador = await pw.chromium.launch({ executablePath: process.env.CHROME || undefined });
for (const [nombre, datos] of Object.entries(muestras)) {
  const html = generar(datos);
  writeFileSync(join(salida, `${nombre}.html`), html);
  for (const [vista, viewport] of [["celular", { width: 375, height: 812 }], ["compu", { width: 1440, height: 900 }]]) {
    const pagina = await navegador.newPage({ viewport, deviceScaleFactor: vista === "celular" ? 2 : 1 });
    await pagina.setContent(html, { waitUntil: "networkidle" }).catch(() => undefined);
    await pagina.evaluate(() => document.querySelectorAll("[data-r]").forEach((e) => e.classList.add("in")));
    await pagina.waitForTimeout(900);
    await pagina.screenshot({ path: join(salida, `${nombre}-${vista}.png`) });
    await pagina.screenshot({ path: join(salida, `${nombre}-${vista}-completa.png`), fullPage: true });
    const ancho = await pagina.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ancho > 0) console.warn(`${nombre} ${vista}: scroll horizontal de ${ancho}px`);
    await pagina.close();
  }
  console.log(`listo ${nombre}`);
}
await navegador.close();
