import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ESTADOS,
  clasificarAcciones,
  contarPorEstado,
  esEstado,
  fechaValida,
  hoyArgentina,
  limpiarBusqueda,
  linkWhatsApp,
  numeroWhatsApp,
  siguienteEstado,
  sumarDias,
  valorEnJuego,
  type AccionConContacto,
} from "./crmLogica.ts";

test("los estados son los acordados, en orden", () => {
  assert.deepEqual([...ESTADOS], ["nuevo", "contactado", "muestra_enviada", "propuesta", "senia", "entregado", "perdido"]);
  assert.ok(esEstado("senia"));
  assert.ok(!esEstado("ganado"));
});

test("siguiente estado", () => {
  assert.equal(siguienteEstado("nuevo"), "contactado");
  assert.equal(siguienteEstado("senia"), "entregado");
  assert.equal(siguienteEstado("entregado"), null);
  assert.equal(siguienteEstado("perdido"), null);
});

test("fechas: hoy en Argentina y suma de días", () => {
  // 02:00 UTC del 26 es todavía el 25 a la noche en Buenos Aires (UTC-3)
  assert.equal(hoyArgentina(new Date("2026-11-26T02:00:00Z")), "2026-11-25");
  assert.equal(sumarDias("2026-11-25", 1), "2026-11-26");
  assert.equal(sumarDias("2026-12-31", 1), "2027-01-01");
  assert.equal(sumarDias("2026-03-01", -1), "2026-02-28");
  assert.ok(fechaValida("2026-11-25"));
  assert.ok(!fechaValida("25/11/2026"));
});

test("tablero del día: vencidas, hoy y próximas; las hechas no cuentan", () => {
  const a = (id: string, vence_el: string, hecha = false): AccionConContacto => ({ id, contacto_id: "c", contacto_nombre: "X", texto: id, vence_el, hecha });
  const t = clasificarAcciones([a("1", "2026-11-26"), a("2", "2026-11-24"), a("3", "2026-11-25"), a("4", "2026-11-20", true), a("5", "2026-11-23")], "2026-11-25");
  assert.deepEqual(t.vencidas.map((x) => x.id), ["5", "2"]);
  assert.deepEqual(t.hoy.map((x) => x.id), ["3"]);
  assert.deepEqual(t.proximas.map((x) => x.id), ["1"]);
});

test("conteo y valor en juego", () => {
  const cs = [
    { estado: "nuevo" as const, valor_usd: 350 },
    { estado: "propuesta" as const, valor_usd: 450 },
    { estado: "entregado" as const, valor_usd: 900 },
    { estado: "perdido" as const, valor_usd: 450 },
  ];
  assert.equal(contarPorEstado(cs).nuevo, 1);
  assert.equal(contarPorEstado(cs).senia, 0);
  assert.equal(valorEnJuego(cs), 800);
});

test("WhatsApp argentino", () => {
  assert.equal(numeroWhatsApp("+54 9 11 5555-1234"), "5491155551234");
  assert.equal(numeroWhatsApp("011 5555-1234"), "5491155551234");
  assert.equal(numeroWhatsApp("11 5555 1234"), "5491155551234");
  assert.equal(numeroWhatsApp("11 15 5555 1234"), "5491155551234");
  assert.equal(numeroWhatsApp("123"), null);
  assert.equal(linkWhatsApp(null), null);
  assert.match(linkWhatsApp("11 5555 1234", "Hola ñ") ?? "", /^https:\/\/wa\.me\/5491155551234\?text=Hola%20%C3%B1$/);
});

test("la búsqueda no puede romper el filtro", () => {
  assert.equal(limpiarBusqueda("a,b%(c)*"), "a b c");
  assert.equal(limpiarBusqueda("  perez   "), "perez");
});
