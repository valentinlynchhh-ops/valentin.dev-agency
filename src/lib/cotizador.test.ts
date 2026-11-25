import { test } from "node:test";
import assert from "node:assert/strict";
import { armarCotizacion, leerSeleccion, resumenTexto, type Seleccion } from "./cotizador.ts";
import { precioTexto, servicioPorId, usd, pagosWeb } from "./catalogo.ts";

const base = (o: Partial<Seleccion> = {}): Seleccion => ({ servicio: "web", rubro: "Estudio jurídico", funciones: [], paginas: "2-5", materiales: "ayuda", referencias: "", plazo: "mes", ...o });

test("el precio base sale del catálogo", () => {
  for (const id of ["landing", "web", "sistema"] as const) {
    assert.equal(armarCotizacion(base({ servicio: id })).precioBase, precioTexto(servicioPorId(id)));
  }
});

test("web: condiciones de pago calculadas desde el catálogo", () => {
  const c = armarCotizacion(base());
  const p = pagosWeb();
  assert.ok(c.condiciones.some((x) => x.includes(usd(p.inicio)) && x.includes(usd(p.publicar))));
  assert.ok(c.condiciones.some((x) => x.includes("5 días hábiles")));
});

test("sistema: es 'desde' y lo dice", () => {
  const c = armarCotizacion(base({ servicio: "sistema" }));
  assert.equal(c.esDesde, true);
  assert.ok(c.condiciones.some((x) => x.includes("desde")));
});

test("lo incluido se separa de lo que se evalúa, sin inventar precios", () => {
  const c = armarCotizacion(base({ funciones: ["consultas", "turnos", "tienda"] }));
  assert.deepEqual(c.aEvaluar, ["Reserva de turnos online", "Tienda con pagos"]);
  assert.ok(c.incluidas.includes("Consultas guardadas con aviso por mail"));
  assert.ok(!/US\$\s?\d/.test(c.aEvaluar.join(" ")), "lo a evaluar nunca lleva un monto");
});

test("las funciones que no corresponden al servicio se descartan", () => {
  const c = armarCotizacion(base({ servicio: "landing", funciones: ["crm", "voz", "turnos"] }));
  assert.deepEqual(c.aEvaluar, ["Reserva de turnos online"]);
});

test("validación de entrada", () => {
  assert.equal(leerSeleccion({}).ok, false);
  assert.equal(leerSeleccion({ servicio: "web", rubro: "Inventado" }).ok, false);
  const r = leerSeleccion({ servicio: "landing", rubro: "Inmobiliaria", funciones: ["whatsapp", "crm", "x"], paginas: "zz", plazo: "ya", referencias: "a".repeat(2000) });
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.deepEqual(r.seleccion.funciones, ["whatsapp"]);
    assert.equal(r.seleccion.paginas, "2-5");
    assert.equal(r.seleccion.referencias.length, 600);
  }
});

test("el resumen incluye lo esencial", () => {
  const s = base({ funciones: ["turnos"], referencias: "https://ejemplo.com" });
  const t = resumenTexto(s, armarCotizacion(s));
  for (const frag of ["Estudio jurídico", "Reserva de turnos online", "https://ejemplo.com", precioTexto(servicioPorId("web"))]) assert.ok(t.includes(frag), frag);
});
