import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { PAGINAS, TRABAJOS, EMAIL_PUBLICO, WHATSAPP } from "./sitio.ts";

test("páginas: título ≤ 60 y descripción ≤ 155 caracteres, rutas únicas", () => {
  const rutas = new Set<string>();
  for (const p of PAGINAS) {
    assert.ok(p.titulo.length <= 60, `${p.ruta}: título de ${p.titulo.length}`);
    assert.ok(p.descripcion.length <= 155, `${p.ruta}: descripción de ${p.descripcion.length}`);
    assert.ok(!rutas.has(p.ruta), `ruta duplicada ${p.ruta}`);
    rutas.add(p.ruta);
  }
});

test("trabajos: solo los confirmados, URLs https únicas y capturas que existen", () => {
  assert.deepEqual(TRABAJOS.map((t) => t.host).sort(), ["abogadamasegosa.com", "getzleads.com", "rebloomactive.com", "rydabogados.com.ar"]);
  assert.equal(new Set(TRABAJOS.map((t) => t.url)).size, TRABAJOS.length);
  for (const t of TRABAJOS) {
    assert.ok(t.url.startsWith("https://"), t.url);
    for (const img of [t.imagenCard, t.imagenEscritorio, t.imagenCelular]) assert.ok(existsSync(join("public", img)), `falta ${img}`);
  }
});

test("Estudio Saucedo no está publicado hasta confirmar autoría", () => {
  assert.ok(!JSON.stringify(TRABAJOS).toLowerCase().includes("saucedo"));
});

test("contacto público confirmado por el dueño", () => {
  assert.equal(EMAIL_PUBLICO, "valentinlynch7@gmail.com");
  assert.equal(WHATSAPP, "5491158092000");
});

test("los activos de marca existen", () => {
  for (const f of ["public/brand/monogram.png", "public/brand/logo-original.webp", "public/img/valentin.webp", "src/app/icon.png", "src/app/favicon.ico", "references/web-v2/01-hero.jpg"]) assert.ok(existsSync(f), f);
});
