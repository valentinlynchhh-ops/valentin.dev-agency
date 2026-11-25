import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { CATALOGO, PRECIO_MINIMO_USD, CONDICIONES_WEB, pagosWeb, usd, precioTexto, servicioPorId } from "./catalogo.ts";

test("ningún servicio cuesta menos del mínimo", () => {
  for (const s of CATALOGO) assert.ok(s.usd >= PRECIO_MINIMO_USD, `${s.id} por debajo de ${PRECIO_MINIMO_USD}`);
});

test("precios acordados", () => {
  assert.equal(servicioPorId("landing").usd, 350);
  assert.equal(servicioPorId("web").usd, 450);
  assert.equal(servicioPorId("sistema").usd, 900);
  assert.equal(servicioPorId("sistema").desde, true);
});

test("condiciones de la web", () => {
  assert.equal(CONDICIONES_WEB.seniaInicioPct + CONDICIONES_WEB.pagoAlPublicarPct, 100);
  assert.equal(CONDICIONES_WEB.plazoDiasHabiles, 5);
  assert.equal(CONDICIONES_WEB.rondasDeCambios, 2);
  assert.deepEqual(pagosWeb(), { inicio: 225, publicar: 225 });
});

test("formato", () => {
  assert.equal(usd(450), "US$450");
  assert.equal(precioTexto(servicioPorId("sistema")), "desde US$900");
});

function archivos(dir: string, salida: string[] = []): string[] {
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) archivos(ruta, salida);
    else if (/\.(tsx?|mjs|md|json)$/.test(nombre)) salida.push(ruta);
  }
  return salida;
}

test("ningún precio escrito a mano fuera de catalogo.ts", () => {
  const permitidos = new Set([join("src", "lib", "catalogo.ts"), join("src", "lib", "catalogo.test.ts")]);
  const patron = /US\$\s?\d|USD\s?\d|\d+\s?(?:USD|dólares)\b/i;
  const infractores: string[] = [];
  // Archivos sueltos de la raíz que también se revisan.
  const raiz = ["README.md", "CLAUDE.md", "AGENTS.md"].filter((f) => { try { statSync(f); return true; } catch { return false; } });
  for (const f of raiz) {
    readFileSync(f, "utf8").split("\n").forEach((l, i) => { if (patron.test(l)) infractores.push(`${f}:${i + 1}: ${l.trim().slice(0, 90)}`); });
  }
  for (const base of ["src", "scripts", "content", "outbound", "docs", ".claude/commands", ".claude/agents"]) {
    let lista: string[] = [];
    try {
      lista = archivos(base);
    } catch {
      continue;
    }
    for (const f of lista) {
      if (permitidos.has(f)) continue;
      const lineas = readFileSync(f, "utf8").split("\n");
      lineas.forEach((l, i) => {
        if (patron.test(l)) infractores.push(`${f}:${i + 1}: ${l.trim().slice(0, 90)}`);
      });
    }
  }
  assert.deepEqual(infractores, [], "Hay precios fuera de src/lib/catalogo.ts:\n" + infractores.join("\n"));
});
