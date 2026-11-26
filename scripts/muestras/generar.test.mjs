import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
process.env.NEXT_PUBLIC_WHATSAPP = "5491112345678";
process.env.NEXT_PUBLIC_SITE_URL = "https://valentin.dev";
const { MAX_JSON_DEMO, TEMAS, esc, filasGaleria, fotoPermitida, generar, htmlDeValor, normalizar, repartirFotos, seguidoresTexto, numeroTelefono, numeroWhatsapp, razonesDe, rubroDe, slugDe, slugValido, sqlPublicarJson, urlDemo, urlSegura } = await import("./generar.mjs");
const { CSP_DEMO, cabecerasDemo } = await import("../../src/lib/demos.ts");

const aqui = dirname(fileURLToPath(import.meta.url));
const ejemplos = readdirSync(join(aqui, "ejemplos"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => [f, JSON.parse(readFileSync(join(aqui, "ejemplos", f), "utf8"))]);
const minimo = { negocio: "Ferretería Ejemplo", rubro: "comercio", whatsapp: "+54 9 11 0000-0000", servicios: ["Tornillos"] };
const FOTO = "https://valentin.dev/demo/img/0123456789abcdef0123456789abcdef.webp";
const foto = (i) => `https://valentin.dev/demo/img/${String(i).padStart(2, "0")}${"a".repeat(30)}.webp`;
const conFotos = (n, extra = {}) => ({
  negocio: "Estudio Ejemplo Fotos",
  rubro: "arquitectura",
  ficticio: true,
  ciudad: "Pilar",
  whatsapp: "+54 9 11 0000-0000",
  email: "hola@ejemplo.example",
  descripcion: "Estudio de ejemplo con datos ficticios.",
  servicios: [{ nombre: "Proyecto", detalle: "Planos." }, { nombre: "Dirección de obra" }, { nombre: "Renders" }],
  imagenes: Array.from({ length: n }, (_, i) => foto(i)),
  ...extra,
});

test("slug: solo minúsculas, números y guiones, de 3 a 60", () => {
  for (const ok of ["abc", "ejemplo-estudio-juridico", "a1-b2", "x".repeat(60)]) assert.ok(slugValido(ok), ok);
  for (const mal of ["ab", "x".repeat(61), "Mayus", "con espacio", "a_b", "ñandu", "../etc", "a/b", "", null, 12]) assert.ok(!slugValido(mal), String(mal));
});

test("slugDe arma un slug válido desde el nombre", () => {
  assert.equal(slugDe("Estudio Pérez & Asociados"), "estudio-perez-y-asociados");
  assert.ok(slugValido(slugDe("Ñ")));
  assert.ok(slugValido(slugDe("x".repeat(200))));
});

test("rubros: alias y genérico", () => {
  assert.equal(rubroDe("Abogados"), "estudio-juridico");
  assert.equal(rubroDe("odontologia"), "salud");
  assert.equal(rubroDe("Distribuidora mayorista"), "comercio-distribuidora");
  assert.equal(rubroDe("contador"), "estudio-contable");
  assert.equal(rubroDe("peluquería"), "generico");
  assert.equal(Object.keys(TEMAS).length, 7);
});

test("los ejemplos generan HTML completo, sin marcadores sin resolver y con wa.me", () => {
  assert.ok(ejemplos.length >= 3);
  for (const [nombre, datos] of ejemplos) {
    assert.equal(datos.ficticio, true, `${nombre} tiene que estar marcado como ficticio`);
    const html = generar(datos);
    assert.match(html, /^<!doctype html>/);
    assert.ok(!/\$\{|undefined|NaN|\[object Object\]/.test(html), `${nombre}: valor sin resolver`);
    const marcado = html.replace(/<style>[\s\S]*?<\/style>|<script>[\s\S]*?<\/script>/g, "");
    assert.ok(!/\{\{|\}\}/.test(marcado), `${nombre}: marcador {{ }} sin resolver`);
    assert.match(html, /href="https:\/\/wa\.me\/\d{10,15}\?text=/);
    assert.match(html, /Propuesta de ejemplo preparada por Valentín · Si te gusta, la dejamos online en 5 días hábiles/);
    assert.match(html, /wa\.me\/5491112345678/);
    assert.match(html, /No es el sitio actual del negocio/);
    assert.match(html, /datos ficticios/);
    assert.match(html, /mailto:/);
    assert.match(html, /<meta name="robots" content="noindex,nofollow">/);
  }
});

test("cada rubro tiene su propio diseño", () => {
  const firmas = new Set(Object.keys(TEMAS).map((r) => `${TEMAS[r].hero}|${TEMAS[r].servicios}|${TEMAS[r].fuente}`));
  assert.equal(firmas.size, 7);
});

test("todo lo que entra se escapa (XSS)", () => {
  const malo = '<script>alert(1)</script>"\'><img src=x onerror=alert(2)>';
  const html = generar({
    negocio: malo,
    rubro: malo,
    ciudad: malo,
    direccion: malo,
    descripcion: malo,
    promesa: malo,
    horarios: [malo],
    diferenciales: [malo],
    servicios: [malo, { nombre: malo, detalle: malo }],
    whatsapp: "+54 9 11 0000-0000",
    email: "hola@ejemplo.example",
  });
  assert.ok(!html.includes("<script>alert"), "script sin escapar");
  assert.ok(!html.includes("<img src=x"), "img sin escapar");
  assert.ok(!/onerror=alert/.test(html.replace(/&lt;img src=x onerror=alert\(2\)&gt;/g, "")), "atributo sin escapar");
  assert.equal((html.match(/<script>/g) || []).length, 2, "solo los dos scripts propios");
  assert.equal(esc(`<a href="x">'&\``), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#96;");
});

test("las URLs se validan: nada de javascript:, data: ni hosts raros", () => {
  assert.equal(urlSegura("javascript:alert(1)"), "");
  assert.equal(urlSegura("data:text/html,hola"), "");
  assert.equal(urlSegura("https://user:pass@ejemplo.com"), "");
  assert.equal(urlSegura("https://ejemplo.com/a b"), "https://ejemplo.com/a%20b");
  const html = generar({ ...minimo, imagenes: ["javascript:alert(1)", "http://inseguro.example/a.jpg", "https://ok.example/a.jpg", `${FOTO}`], instagram: "javascript:alert(1)", trabajosParecidos: ["javascript:alert(1)"], email: "no es mail", colores: { primario: "red;}</style><script>" } });
  assert.ok(!html.includes("javascript:"));
  assert.ok(!html.includes("inseguro.example"));
  assert.ok(!html.includes("ok.example"), "fotos solo de valentin.dev/demo/img o de hosts propios estables");
  assert.ok(html.includes(`src="${FOTO}"`));
  assert.ok(!html.includes("mailto:"));
  assert.ok(!html.includes("</style><script>"));
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) assert.match(href, /^(https:\/\/|mailto:|tel:\+|#)/, href);
});

test("WhatsApp: números argentinos a formato wa.me", () => {
  assert.equal(numeroWhatsapp("+54 9 11 1234-5678"), "5491112345678");
  assert.equal(numeroWhatsapp("11 1234 5678"), "5491112345678");
  assert.equal(numeroWhatsapp("+54 11 1234-5678"), "5491112345678");
  assert.equal(numeroWhatsapp("hola"), "");
  assert.equal(numeroWhatsapp("123"), "");
});

test("honestidad: sin datos no hay secciones inventadas", () => {
  const html = generar({ negocio: "Ejemplo Mínimo", rubro: "generico", email: "a@ejemplo.example" });
  assert.ok(!/testimoni|reseñ|clientes satisfechos|años de experiencia|★|premio/i.test(html));
  assert.ok(!html.includes('id="servicios"'));
  assert.ok(!html.includes("sec-razones"));
  assert.deepEqual(razonesDe(normalizar({ negocio: "X", horarios: "Lunes" })).map((r) => r.titulo), ["Horarios"]);
  assert.throws(() => generar({}), /negocio/);
});

test("link de la muestra", () => {
  assert.equal(urlDemo("ejemplo-x"), "https://valentin.dev/demo/ejemplo-x");
});

test("cabeceras de la ruta: noindex, caché corta y CSP sin conexiones", () => {
  const c = cabecerasDemo(true);
  assert.equal(c["x-robots-tag"], "noindex, nofollow");
  assert.equal(c["cache-control"], "public, max-age=60");
  assert.match(c["content-type"], /^text\/html/);
  assert.match(CSP_DEMO, /connect-src 'none'/);
  assert.match(CSP_DEMO, /font-src https:\/\/fonts\.gstatic\.com/);
  assert.match(CSP_DEMO, /frame-ancestors 'self'/);
  assert.equal(cabecerasDemo(false)["cache-control"], "no-store");
});

test("modo JSON: la ruta arma la misma página que el script", () => {
  const datos = ejemplos[0][1];
  assert.equal(htmlDeValor(JSON.stringify(datos)), generar(datos));
  assert.equal(htmlDeValor(`  \n${JSON.stringify(datos, null, 2)}\n`), generar(datos));
});

test("teléfono fijo sin 9 y ciudad sin repetir", () => {
  assert.equal(numeroTelefono("0230 442 2543"), "+542304422543");
  assert.equal(numeroTelefono("+54 11 0000-0000"), "+541100000000");
  assert.equal(numeroTelefono("123"), "");
  const html = generar({ negocio: "X", rubro: "contador", telefono: "0230 442 2543", ciudad: "Pilar, Buenos Aires", direccion: "Juan B. Justo 638, Pilar, Buenos Aires" });
  assert.ok(html.includes('href="tel:+542304422543"'));
  assert.ok(!html.includes("Pilar, Buenos Aires, Pilar"));
});

test("modo HTML: un valor que no es JSON se sirve tal cual", () => {
  const html = generar(ejemplos[0][1]);
  assert.equal(htmlDeValor(html), html);
});

test("modo JSON: valores rotos, vacíos o enormes dan null (404, nunca 500)", () => {
  for (const malo of ["", "   ", "{", "{negocio: 1}", '{"negocio": ""}', "{}", '{"rubro":"salud"}', null, undefined, 42]) assert.equal(htmlDeValor(malo), null, String(malo));
  const enorme = JSON.stringify({ negocio: "X", descripcion: "a".repeat(MAX_JSON_DEMO) });
  assert.ok(enorme.length > 20_000);
  assert.equal(htmlDeValor(enorme), null);
});

test("modo JSON: mismo escape que el script", () => {
  const malo = '<script>alert(1)</script>"><img src=x onerror=alert(2)>';
  const html = htmlDeValor(JSON.stringify({ negocio: malo, descripcion: malo, servicios: [malo], whatsapp: "11 0000 0000", instagram: "javascript:alert(1)" }));
  assert.ok(html && !html.includes("<script>alert") && !html.includes("<img src=x") && !html.includes("javascript:"));
});

test("insert compacto: JSON en una línea con comillas de dólar", () => {
  const datos = ejemplos[0][1];
  const sql = sqlPublicarJson("ejemplo-x", datos);
  const m = sql.match(/^insert into public\.muestras \(slug, datos\) values \('ejemplo-x', \$(j[0-9a-f]+)\$(.*)\$\1\$::jsonb\) on conflict \(slug\) do update set datos = excluded\.datos;$/s);
  assert.ok(m, sql);
  assert.deepEqual(JSON.parse(m[2]), datos);
  assert.ok(sql.length < 3000);
  assert.throws(() => sqlPublicarJson("ejemplo-x", { rubro: "salud" }), /negocio/);
});

/* ---------- Modo con fotos ---------- */
test("fotos: solo valentin.dev/demo/img/<hash>.webp o la web propia en Wix; nunca Instagram ni Facebook directo", () => {
  assert.equal(fotoPermitida(FOTO), FOTO);
  assert.ok(fotoPermitida("https://static.wixstatic.com/media/7f7970_abc~mv2.jpg"));
  for (const mala of [
    "https://scontent.cdninstagram.com/v/t51/foto.jpg?oh=1&oe=2",
    "https://scontent.xx.fbcdn.net/foto.jpg",
    "http://valentin.dev/demo/img/0123456789abcdef0123456789abcdef.webp",
    "https://valentin.dev/demo/img/../../admin.webp",
    "https://valentin.dev/demo/img/0123456789abcdef0123456789abcdef.webp?x=1",
    "https://valentin.dev:444/demo/img/0123456789abcdef0123456789abcdef.webp",
    "https://valentin.dev.evil.com/demo/img/0123456789abcdef0123456789abcdef.webp",
    "https://static.wixstatic.com/otra/cosa.jpg",
    "javascript:alert(1)",
    "data:image/png;base64,AAAA",
  ])
    assert.equal(fotoPermitida(mala), "", mala);
});

test("seguidores: redondeado hacia abajo, en palabras", () => {
  assert.equal(seguidoresTexto(8538), "+8 mil");
  assert.equal(seguidoresTexto(999), "999");
  assert.equal(seguidoresTexto(1_250_000), "+1,2 millones");
  assert.equal(seguidoresTexto("x"), "");
  assert.equal(seguidoresTexto(0), "");
});

test("galería asimétrica: las filas siempre suman 12 columnas y usan todas las fotos", () => {
  for (let n = 1; n <= 13; n++) {
    const filas = filasGaleria(n);
    assert.equal(filas.flat().length, n, `n=${n}`);
    for (const f of filas) assert.equal(f.reduce((a, b) => a + b, 0), 12, `n=${n} ${f}`);
  }
  assert.deepEqual(filasGaleria(8), [[8, 4], [4, 4, 4], [5, 7], [12]]);
});

test("con fotos: hero de foto, galería, banda de cierre y aviso de que las fotos son del negocio", () => {
  const html = generar(conFotos(6, { instagram: "@ejemplo", instagramSeguidores: 8538 }));
  assert.match(html, /<header class="fh fh-inm fh-mono">/);
  assert.match(html, /fetchpriority="high"/);
  assert.match(html, /<link rel="preload" as="image"/);
  assert.match(html, /srcset="[^"]*-640\.webp 640w, [^"]*-1024\.webp 1024w, [^"]*\.webp 1600w"/);
  assert.match(html, /id="fotos"/);
  assert.match(html, /class="banda-f"/);
  assert.match(html, /Las fotos son de Estudio Ejemplo Fotos, tomadas de su web y su perfil público/);
  assert.match(html, /\+8 mil seguidores/);
  assert.match(html, /data-nav="sobre"/);
  assert.match(html, /Propuesta de ejemplo preparada por Valentín · Si te gusta, la dejamos online en 5 días hábiles/);
  assert.match(html, /No es el sitio actual del negocio/);
  assert.equal((html.match(/loading="lazy"/g) || []).length, 5, "todas menos la del hero cargan tarde");
  for (const [, src] of html.matchAll(/src="([^"]+)"/g)) assert.ok(src.startsWith("https://valentin.dev/demo/img/"), src);
});

test("con 1 a 3 fotos no se rompe: sin banda y sin huecos", () => {
  const uno = generar(conFotos(1));
  assert.match(uno, /fh-inm/);
  assert.ok(!uno.includes('id="fotos"'));
  assert.ok(!uno.includes(`class="banda-f"`));
  const tres = generar(conFotos(3));
  assert.match(tres, /class="g-fila g-8-4"/);
  assert.ok(!tres.includes(`class="banda-f"`));
  assert.match(generar(conFotos(5)), /class="banda-f"/);
});

test("roles de las fotos: hero, servicio con su foto y banda; pies escapados", () => {
  const datos = conFotos(5, {
    imagenesMeta: [{ rol: "banda" }, { rol: "hero", pie: "Obra <b>1</b>" }, { rol: "servicio", servicio: 1, pie: "En obra" }, {}, { rol: "servicio", servicio: 99 }],
  });
  const r = repartirFotos(normalizar(datos));
  assert.equal(r.hero.url, foto(1));
  assert.equal(r.banda.url, foto(0));
  assert.equal(r.porServicio.get(1).url, foto(2));
  assert.deepEqual(r.galeria.map((f) => f.url), [foto(3), foto(4)], "un servicio que no existe vuelve a la galería");
  const html = generar(datos);
  assert.match(html, /class="fs-i fs-con"/);
  assert.ok(html.includes("Obra &lt;b&gt;1&lt;/b&gt;"));
  assert.ok(!html.includes("<b>1</b>"));
});

test("cada rubro con fotos tiene su forma de hero y sin fotos queda el diseño de siempre", () => {
  const formas = { "estudio-juridico": "fh-div", "estudio-contable": "fh-div", salud: "fh-marco", inmobiliaria: "fh-inm", "comercio-distribuidora": "fh-inm", generico: "fh-inm", arquitectura: "fh-mono" };
  for (const [rubro, clase] of Object.entries(formas)) assert.match(generar(conFotos(5, { rubro })), new RegExp(`class="fh [^"]*${clase}`), rubro);
  const sin = generar(conFotos(0));
  assert.ok(!sin.includes('class="fh'));
  assert.match(sin, /hero-monumental/);
});

test("preguntas y cómo trabajamos: solo si vienen en los datos, escapadas", () => {
  const malo = "<img src=x onerror=alert(1)>";
  const html = generar(conFotos(2, { preguntas: [{ pregunta: malo, respuesta: "Sí." }, { pregunta: "Sin respuesta" }], proceso: [{ nombre: "Idea", detalle: "Charla." }, { nombre: "Obra", detalle: malo }] }));
  assert.match(html, /Preguntas frecuentes/);
  assert.equal((html.match(/<details>/g) || []).length, 1);
  assert.match(html, /Cómo trabajamos/);
  assert.ok(!html.includes("<img src=x"));
  const sin = generar(conFotos(2));
  assert.ok(!sin.includes("Preguntas frecuentes"));
  assert.ok(!sin.includes("Cómo trabajamos"));
});

