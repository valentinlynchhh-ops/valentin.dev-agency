#!/usr/bin/env node
/* Muestras de web para clientes (docs/muestras.md). El generador vive en src/lib/demoWeb.mjs (lo usa también la ruta
   /demo/[slug]); este script lo llama desde la terminal.

   Uso:
     node scripts/muestras/generar.mjs datos.json [--slug mi-slug] [--out muestra.html] [--sql] [--url]

   --sql  insert en la tabla `muestras` (guarda el JSON; la página se arma al pedirla). Valida antes de devolverlo.
   --out  escribe el HTML.   --url  imprime el link. */
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { SLUG_DEMO, generar, normalizar, slugDe, slugValido, urlDemo } from "../../src/lib/demoWeb.mjs";

export * from "../../src/lib/demoWeb.mjs";

/* Comillas de dólar con una etiqueta al azar que no aparece en el contenido. */
function comillas(contenido, prefijo) {
  let etiqueta;
  do etiqueta = `${prefijo}${randomBytes(6).toString("hex")}`;
  while (contenido.includes(`$${etiqueta}$`));
  return `$${etiqueta}$${contenido}$${etiqueta}$`;
}

/* Insert compacto con los datos en JSON (una línea). Valida que el JSON arme una página antes de devolverlo. */
export function sqlPublicarJson(slug, datos) {
  if (!slugValido(slug)) throw new Error(`Slug inválido: ${slug} (tiene que cumplir ${SLUG_DEMO})`);
  normalizar(datos);
  const json = JSON.stringify(datos);
  if (json.length > 20_000) throw new Error("El JSON pasa de 20 KB");
  return `insert into public.muestras (slug, datos) values ('${slug}', ${comillas(json, "j")}::jsonb) on conflict (slug) do update set datos = excluded.datos;`;
}

function cli(argv) {
  const args = argv.slice(2);
  const opcion = (nombre) => {
    const i = args.indexOf(nombre);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const archivo = args.find((a, i) => !a.startsWith("--") && !["--slug", "--out"].includes(args[i - 1]));
  if (!archivo) {
    console.error("Uso: node scripts/muestras/generar.mjs datos.json [--slug mi-slug] [--out muestra.html] [--sql] [--url]");
    process.exit(2);
  }
  const datos = JSON.parse(readFileSync(archivo, "utf8"));
  const slug = opcion("--slug") || datos.slug || slugDe(datos.negocio);
  if (!slugValido(slug)) {
    console.error(`Slug inválido: ${slug}`);
    process.exit(2);
  }
  const html = generar(datos);
  const out = opcion("--out");
  if (out) writeFileSync(out, html);
  if (args.includes("--sql")) console.log(sqlPublicarJson(slug, datos));
  if (args.includes("--url")) console.log(urlDemo(slug));
  if (!out && !["--sql", "--url"].some((x) => args.includes(x))) process.stdout.write(html);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) cli(process.argv);
