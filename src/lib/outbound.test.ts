import { test } from "node:test";
import assert from "node:assert/strict";
import { precioTexto, servicioPorId } from "./catalogo.ts";
import { enHorarioDeEnvio, evaluarEnvio, renderizar, topeDiario, TOPE_MAXIMO_DIA, type EntradaEnvio } from "./outbound.ts";

// Mié 25/11/2026 11:00 en Argentina (UTC-3) = 14:00 UTC
const MIE_11 = new Date("2026-11-25T14:00:00Z");
const SAB_11 = new Date("2026-11-28T14:00:00Z");
const MIE_20 = new Date("2026-11-25T23:00:00Z");

const base = (o: Partial<EntradaEnvio> = {}): EntradaEnvio => ({
  ahora: MIE_11,
  destino: "ana@negocio.com.ar",
  tipo: "frio",
  bajas: new Set<string>(),
  enviadosHoy: 0,
  tope: 15,
  enviosPrevios: 0,
  ultimoEnvio: null,
  ...o,
});

test("tokens: variables y precios salen del catálogo", () => {
  const r = renderizar("Hola {{nombre}}, la landing sale {{precio:landing}} y el sistema {{precio:sistema}}.", { nombre: "Ana" });
  assert.equal(r.texto, `Hola Ana, la landing sale ${precioTexto(servicioPorId("landing"))} y el sistema ${precioTexto(servicioPorId("sistema"))}.`);
  assert.deepEqual(r.faltan, []);
});

test("tokens: lo que falta queda marcado y no se inventa", () => {
  const r = renderizar("Hola {{nombre}} de {{negocio}} {{precio:inexistente}}", { nombre: "Ana" });
  assert.deepEqual(r.faltan.sort(), ["{{negocio}}", "{{precio:inexistente}}"].sort());
  assert.match(r.texto, /\{\{negocio\}\}/);
});

test("tope diario: respeta el entorno y nunca pasa del máximo duro", () => {
  assert.equal(topeDiario(undefined), 15);
  assert.equal(topeDiario("10"), 10);
  assert.equal(topeDiario("500"), TOPE_MAXIMO_DIA);
  assert.equal(topeDiario("abc"), 15);
  assert.equal(topeDiario("-3"), 15);
});

test("horario: lunes a viernes de 9 a 18 en Argentina", () => {
  assert.ok(enHorarioDeEnvio(MIE_11));
  assert.ok(!enHorarioDeEnvio(SAB_11));
  assert.ok(!enHorarioDeEnvio(MIE_20));
  assert.ok(!enHorarioDeEnvio(new Date("2026-11-25T11:59:00Z"))); // 8:59 ART
  assert.ok(enHorarioDeEnvio(new Date("2026-11-25T12:00:00Z"))); // 9:00 ART
});

test("un mail en frío válido en horario pasa", () => {
  assert.deepEqual(evaluarEnvio(base()), { ok: true });
});

test("la lista de bajas bloquea siempre, incluso respuestas", () => {
  const bajas = new Set(["ana@negocio.com.ar"]);
  for (const tipo of ["frio", "seguimiento", "respuesta"] as const) {
    const v = evaluarEnvio(base({ bajas, tipo, enviosPrevios: 1 }));
    assert.equal(v.ok, false, tipo);
  }
  assert.equal(evaluarEnvio(base({ bajas, destino: "ANA@Negocio.com.ar" })).ok, false, "no distingue mayúsculas");
});

test("el tope diario corta", () => {
  assert.equal(evaluarEnvio(base({ enviadosHoy: 15 })).ok, false);
  assert.equal(evaluarEnvio(base({ enviadosHoy: 14 })).ok, true);
  assert.equal(evaluarEnvio(base({ enviadosHoy: 40, tope: 999 })).ok, false, "tope duro");
});

test("fuera de horario no sale nada en frío ni seguimiento, pero sí una respuesta", () => {
  assert.equal(evaluarEnvio(base({ ahora: SAB_11 })).ok, false);
  assert.equal(evaluarEnvio(base({ ahora: MIE_20, tipo: "seguimiento", enviosPrevios: 1 })).ok, false);
  assert.equal(evaluarEnvio(base({ ahora: SAB_11, tipo: "respuesta" })).ok, true);
});

test("frío: solo el primero", () => {
  assert.equal(evaluarEnvio(base({ enviosPrevios: 1 })).ok, false);
});

test("seguimientos: hace falta un primer mail, 3 días de espera y un máximo de 3", () => {
  const dia = 86_400_000;
  assert.equal(evaluarEnvio(base({ tipo: "seguimiento", enviosPrevios: 0 })).ok, false);
  assert.equal(evaluarEnvio(base({ tipo: "seguimiento", enviosPrevios: 1, ultimoEnvio: new Date(MIE_11.getTime() - 1 * dia) })).ok, false);
  assert.equal(evaluarEnvio(base({ tipo: "seguimiento", enviosPrevios: 1, ultimoEnvio: new Date(MIE_11.getTime() - 3 * dia) })).ok, true);
  assert.equal(evaluarEnvio(base({ tipo: "seguimiento", enviosPrevios: 3, ultimoEnvio: new Date(MIE_11.getTime() - 5 * dia) })).ok, true);
  assert.equal(evaluarEnvio(base({ tipo: "seguimiento", enviosPrevios: 4, ultimoEnvio: new Date(MIE_11.getTime() - 9 * dia) })).ok, false);
});

test("mail inválido", () => {
  assert.equal(evaluarEnvio(base({ destino: "no-es-mail" })).ok, false);
});
