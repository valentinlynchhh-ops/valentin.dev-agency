#!/usr/bin/env node
/* Rellena una plantilla de outbound/ o content/ con datos reales y con los precios del catálogo.

   Uso:
     node scripts/outbound/render.mjs outbound/plantillas/mail-frio.md --nombre Ana --negocio "Estudio Pérez" \
       --rubro "estudio contable" --ciudad "San Isidro" --detalle "vi que no tienen formulario de contacto" \
       --link_muestra https://valentin.dev/demo/estudio-perez

   Si falta alguna variable, avisa cuál y sale con error: nunca imprime una plantilla a medio llenar como si estuviera lista. */
import { readFileSync } from "node:fs";
import { renderizar } from "../../src/lib/outbound.ts";

const [archivo, ...resto] = process.argv.slice(2);
if (!archivo) {
  console.error("Uso: node scripts/outbound/render.mjs <plantilla.md> --variable valor ...");
  process.exit(2);
}
const datos = {};
for (let i = 0; i < resto.length; i += 2) {
  if (!resto[i]?.startsWith("--")) {
    console.error(`Argumento inesperado: ${resto[i]}`);
    process.exit(2);
  }
  datos[resto[i].slice(2)] = resto[i + 1] ?? "";
}
// Solo se renderiza lo que está entre las marcas ---8<--- (el resto es la explicación de la plantilla).
let crudo = readFileSync(archivo, "utf8");
const bloques = [...crudo.matchAll(/---8<---\n([\s\S]*?)\n---8<---/g)].map((m) => m[1]);
if (bloques.length) crudo = bloques.join("\n\n=====\n\n");
const { texto, faltan } = renderizar(crudo, datos);
if (faltan.length) {
  console.error(`Faltan datos: ${faltan.join(", ")}`);
  process.exit(1);
}
process.stdout.write(texto + "\n");
