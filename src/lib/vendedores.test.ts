import { test } from "node:test";
import assert from "node:assert/strict";
import { COMISION_PCT, MIN_PROYECTOS_MES, codigoValido, comisionDe, cumpleMinimo, ejemplosComision, generarCodigo, validarPostulacion } from "./vendedores.ts";
import { CATALOGO } from "./catalogo.ts";

test("condiciones fijadas por el dueño", () => {
  assert.equal(COMISION_PCT, 15);
  assert.equal(MIN_PROYECTOS_MES, 2);
});

test("comisión sobre lo cobrado", () => {
  assert.equal(comisionDe(1000), 150);
  assert.equal(comisionDe(350), 52.5);
  assert.equal(comisionDe(0), 0);
  assert.equal(comisionDe(-5), 0);
  assert.equal(comisionDe(Number.NaN), 0);
});

test("los ejemplos salen del catálogo, uno por servicio", () => {
  const e = ejemplosComision();
  assert.equal(e.length, CATALOGO.length);
  for (const [i, x] of e.entries()) assert.equal(x.comision, comisionDe(CATALOGO[i].usd));
});

test("mínimo mensual", () => {
  assert.equal(cumpleMinimo(1), false);
  assert.equal(cumpleMinimo(2), true);
  assert.equal(cumpleMinimo(5), true);
});

test("códigos de vendedor", () => {
  for (let i = 0; i < 50; i++) assert.ok(codigoValido(generarCodigo()));
  assert.ok(!codigoValido("ABC"));
  assert.ok(!codigoValido("OOOOOO"), "sin letras ambiguas");
  assert.ok(codigoValido("abcdef".toUpperCase()));
});

test("postulación válida", () => {
  const r = validarPostulacion({ nombre: "Ana Gómez", contacto: "ana@correo.com", motivo: "Vendí servicios a pymes dos años.", acepta: true });
  assert.equal(r.ok, true);
});

test("postulación inválida y spam", () => {
  const r = validarPostulacion({ nombre: "A", contacto: "x", motivo: "corto" });
  assert.equal(r.ok, false);
  if (!r.ok) assert.deepEqual(Object.keys(r.errores).sort(), ["acepta", "contacto", "motivo", "nombre"]);
  const s = validarPostulacion({ nombre: "Ana Gómez", contacto: "ana@correo.com", motivo: "Vendo desde hace años", acepta: true, web: "x" });
  assert.equal(s.ok === false && s.spam, true);
});
