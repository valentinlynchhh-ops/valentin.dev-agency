import { test } from "node:test";
import assert from "node:assert/strict";
import { validarConsulta } from "./consulta.ts";

test("acepta mail", () => {
  const r = validarConsulta({ nombre: "Ana", contacto: "ANA@correo.com", tipo: "landing", mensaje: "Hola" });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.datos.email, "ana@correo.com");
    assert.equal(r.datos.telefono, null);
  }
});

test("acepta WhatsApp", () => {
  const r = validarConsulta({ nombre: "Ana", contacto: "+54 9 11 5555-1234", tipo: "web" });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.datos.telefono, "+54 9 11 5555-1234");
});

test("rechaza contacto inválido, nombre corto y tipo desconocido", () => {
  const r = validarConsulta({ nombre: "A", contacto: "hola", tipo: "otro" });
  assert.equal(r.ok, false);
  if (!r.ok) assert.deepEqual(Object.keys(r.errores).sort(), ["contacto", "nombre", "tipo"]);
});

test("honeypot marca spam", () => {
  const r = validarConsulta({ nombre: "Ana", contacto: "a@b.co", tipo: "landing", web: "http://spam" });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.spam, true);
});

test("recorta mensajes largos", () => {
  const r = validarConsulta({ nombre: "Ana", contacto: "a@b.co", tipo: "landing", mensaje: "x".repeat(5000) });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.datos.mensaje.length, 2000);
});
