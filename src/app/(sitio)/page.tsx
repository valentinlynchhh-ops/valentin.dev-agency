import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { PASOS, SERVICIOS_DETALLE, TRABAJOS } from "@/lib/sitio";
import { precioTexto, servicioPorId } from "@/lib/catalogo";
import { COMISION_PCT, MIN_PROYECTOS_MES, ejemplosComision } from "@/lib/vendedores";
import { Flecha } from "@/components/Marca";
import { Icon } from "@/components/Icon";
import { HorizonScene } from "@/components/Horizon";
import { HighlightText } from "@/components/HighlightText";
import { HeroGL } from "@/components/HeroGL";
import { Split, Marquee } from "@/components/Split";
import { Galeria } from "@/components/Galeria";
import { Dialogo } from "@/components/Dialogo";
import { ReunionPanel } from "@/components/ReunionPanel";
import { PostularForm } from "@/components/PostularForm";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/");

const ESPECIALIDADES = [
  { n: "Desarrollo", i: "code" },
  { n: "Diseño", i: "pen" },
  { n: "Automatizaciones", i: "bolt" },
  { n: "Producto", i: "layers" },
  { n: "Estrategia", i: "bars" },
] as const;

export default function Inicio() {
  return (
    <>
      <JsonLd ruta="/" />

      {/* 01 · Hero: shader de seda + titular cinético */}
      <section className="x-hero" aria-labelledby="t-h1" data-scrub>
        <HorizonScene variante="hero" id="hero" ligera />
        <HeroGL />
        <div className="x-hero__vel" aria-hidden="true" />
        <span className="x-px x-px--a" aria-hidden="true" />
        <span className="x-px x-px--b" aria-hidden="true" />
        <div className="x-hero__in">
          <p className="x-hero__tag label">
            <i aria-hidden="true" /> Agencia web · Argentina
          </p>
          <h1 id="t-h1" className="x-h1">
            <Split as="span" modo="carga" texto="Diseño productos" />
            <span className="x-h1__2">
              <Split as="span" modo="carga" texto="que generan" desde={3} /> <HighlightText>negocio.</HighlightText>
            </span>
          </h1>
          <p className="x-hero__sub">Estrategia, diseño y desarrollo digital para ideas que escalan.</p>
          <div className="vd-actions x-hero__cta">
            <Link href="/#contacto" className="btn btn-primary vd-btn-xl" data-mag>
              Hablemos <Flecha />
            </Link>
            <Link href="#proyectos" className="btn btn-outline vd-btn-xl" data-mag>
              Ver proyectos <Icon name="down" size={20} />
            </Link>
          </div>
          <p className="vd-hero__mini x-hero__mini">
            ¿Querés saber cuánto sale tu web? <Link href="/cotizar">Cotizala acá ↗</Link>
          </p>
        </div>
        <a href="#proyectos" className="x-scroll" aria-label="Ir a los proyectos">
          <span>Scroll</span>
          <i aria-hidden="true" />
        </a>
      </section>

      <Marquee>
        {["Landings", "Webs a medida", "Sistemas", "Automatizaciones", "Diseño", "Desarrollo"].map((p) => (
          <span key={p} className="x-marquee__i">
            {p} <i />
          </span>
        ))}
      </Marquee>

      {/* 02 · Qué hago */}
      <section className="x-serv" aria-labelledby="t-serv">
        <div className="vd-wrap vd-wrap--wide">
          <p className="label x-reveal">Qué hago</p>
          <h2 id="t-serv" className="x-h2">
            <Split texto="Tres cosas, bien hechas." />
          </h2>
          <ul className="x-serv__lista">
            {SERVICIOS_DETALLE.map((s, i) => (
              <li key={s.id} className="x-serv__fila" data-spot>
                <span className="x-serv__n">0{i + 1}</span>
                <div className="x-serv__t">
                  <h3>{s.nombre}</h3>
                  <p>{s.paraQuien}</p>
                </div>
                <b className="x-serv__p">{precioTexto(servicioPorId(s.id))}</b>
                <Link href="/cotizar" className="x-serv__go" aria-label={`Cotizar: ${s.nombre}`} data-mag>
                  <Flecha />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 · Proyectos: el museo (galería fijada) */}
      <Galeria />

      {/* 04 · Proceso */}
      <section className="x-proc" aria-labelledby="t-proc" data-scrub>
        <div className="vd-wrap vd-wrap--wide">
          <p className="label x-reveal">Cómo trabajo</p>
          <h2 id="t-proc" className="x-h2">
            <Split texto="Cuatro pasos, sin sorpresas." />
          </h2>
          <ol className="x-proc__lista">
            <span className="x-proc__linea" aria-hidden="true">
              <i />
            </span>
            {PASOS.map((p) => (
              <li key={p.n} className="x-proc__paso">
                <span className="x-proc__n" aria-hidden="true">
                  {p.n}
                </span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 · Agendar */}
      <section id="contacto" className="vd-agenda x-mesh" aria-labelledby="t-ag">
        <HorizonScene variante="agenda" id="age" />
        <div className="vd-wrap">
          <div className="vd-agenda__grid">
            <div className="vd-agenda__txt vd-rise">
              <span className="vd-pill">
                <Icon name="calendar" size={22} /> Hablemos
              </span>
              <h2 id="t-ag" className="vd-h2">
                ¿Tenés un proyecto{" "}
                <span className="vd-nowrap">
                  en <HighlightText>mente?</HighlightText>
                </span>
              </h2>
              <p className="vd-lead">Contame tu idea, objetivo o problema. Vemos juntos la mejor solución y te propongo un plan a medida.</p>
              <div className="vd-actions">
                <a href="#reunion" className="btn btn-primary vd-btn-xl">
                  Agendemos una charla <Flecha />
                </a>
                <Dialogo etiqueta="Cómo trabajo" clase="btn btn-outline vd-btn-xl" titulo="Así trabajo">
                  <ol>
                    {PASOS.map((p) => (
                      <li key={p.n}>
                        <b>{p.titulo}.</b> {p.texto}
                      </li>
                    ))}
                  </ol>
                  <Link href="/como-trabajamos" className="link-text">
                    Ver el detalle <Flecha />
                  </Link>
                </Dialogo>
              </div>
              <p className="vd-hero__mini">
                ¿Preferís ver el precio primero? <Link href="/cotizar">Armá y cotizá tu web ↗</Link>
              </p>
              <div className="vd-trato">
                <Image src="/brand/monogram.png" alt="" width={320} height={190} aria-hidden="true" />
                <span>Trato directo, de principio a fin.</span>
              </div>
            </div>
            <div id="reunion" className="vd-rise" style={{ scrollMarginTop: 110 }}>
              <ReunionPanel origen="/" />
            </div>
          </div>
          <div className="vd-benef vd-rise">
            {[
              ["bolt", "Respuesta rápida", "Sin vueltas."],
              ["layers", "Propuesta a medida", "Adaptada a tu negocio."],
              ["calendar", "Implementación ágil", "De la idea al resultado."],
              ["bars", "Foco en resultados", "Productos que generan valor."],
            ].map(([ic, t, d]) => (
              <div key={t}>
                <span className="vd-tile">
                  <Icon name={ic} size={28} />
                </span>
                <span>
                  <b>{t}</b>
                  <small>{d}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · Sobre mí */}
      <section id="sobre-mi" className="vd-sobre x-mesh" aria-labelledby="t-sobre">
        <HorizonScene variante="about" id="sob" />
        <div className="vd-wrap vd-wrap--wide">
          <div className="vd-sobre__grid">
            <div className="vd-retrato-wrap vd-rise">
              <svg className="x-anillo" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="x-circ" d="M100 100m-84 0a84 84 0 1 1 168 0a84 84 0 1 1-168 0" /></defs><text><textPath href="#x-circ">Diseño · Desarrollo · Automatizaciones · Producto · </textPath></text></svg>
              <div className="vd-retrato" data-spot>
                <Image src="/img/valentin.webp" alt="Retrato de Valentín Lynch" width={900} height={1200} sizes="(min-width: 1024px) 40vw, 90vw" />
              </div>
            </div>
            <div className="vd-sobre__txt vd-rise">
              <span className="vd-pill">
                <Icon name="user" size={22} /> Sobre mí
              </span>
              <h2 id="t-sobre" className="vd-h2">
                Ideas, tecnología y ejecución <HighlightText>real.</HighlightText>
              </h2>
              <p className="vd-lead">
                Soy Valentín Lynch, founder y desarrollador. Diseño, construyo y escalo productos digitales que resuelven problemas reales y generan negocio, combinando estrategia, diseño y tecnología.
              </p>
              <div className="vd-stats">
                <div className="vd-card">
                  <Icon name="layers" size={34} />
                  <span>
                    <b><span data-count={TRABAJOS.length}>{TRABAJOS.length}</span> sitios</b>
                    <small>En el museo de trabajos</small>
                  </span>
                </div>
                <div className="vd-card">
                  <Icon name="users" size={34} />
                  <span>
                    <b>Trato directo</b>
                    <small>De principio a fin</small>
                  </span>
                </div>
                <div className="vd-card">
                  <Icon name="bars" size={34} />
                  <span>
                    <b>Producto propio</b>
                    <small>Get Z Leads</small>
                  </span>
                </div>
              </div>
              <div className="vd-esp">
                <h3>Especialidades</h3>
                <ul>
                  {ESPECIALIDADES.map((e) => (
                    <li key={e.n}>
                      <Icon name={e.i} size={20} />
                      {e.n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 · Vendedores */}
      <section id="vendedores" className="vd-vend x-mesh" data-scrub aria-labelledby="t-vend">
        <HorizonScene variante="vendedores" id="ven" />
        <div className="vd-wrap vd-wrap--wide">
          <div className="vd-vend__grid">
            <div className="vd-vend__txt vd-rise">
              <span className="vd-pill">
                <Icon name="users" size={22} /> Vendedores
              </span>
              <h2 id="t-vend" className="vd-h2">
                Sumate al equipo de <HighlightText>ventas</HighlightText>
              </h2>
              <p className="vd-lead">
                Vendé mis webs y sistemas a medida a negocios de Argentina y cobrá el {COMISION_PCT}% de cada proyecto cobrado. Para sostener el programa, el mínimo es de {MIN_PROYECTOS_MES} proyectos por mes.
              </p>
              <div className="vd-actions">
                <Dialogo etiqueta="Quiero sumarme" clase="btn btn-primary vd-btn-xl" titulo="Postulate como vendedor">
                  <p className="muted">Te respondo yo. No te pido datos financieros ni documentos en esta instancia.</p>
                  <PostularForm id="pd" />
                </Dialogo>
                <Dialogo etiqueta="Cómo funciona" clase="btn btn-outline vd-btn-xl" titulo="Cómo funciona el programa">
                  <ol>
                    <li>Te postulás y te respondo yo.</li>
                    <li>Si te sumás, te paso tu código de vendedor. Cada consulta que entre por tu link queda asociada a vos.</li>
                    <li>Presentás la propuesta y acompañás al cliente hasta cerrar.</li>
                    <li>
                      Cobrás el <b><span data-count={COMISION_PCT}>{COMISION_PCT}</span>%</b> de cada proyecto efectivamente cobrado.
                    </li>
                  </ol>
                  <p>
                    <b>Mínimo:</b> {MIN_PROYECTOS_MES} proyectos cobrados por mes para seguir en el programa.
                  </p>
                  <p className="muted">Ejemplos calculados sobre el precio de lista (no son resultados de nadie):</p>
                  <ul className="vd-lista">
                    {ejemplosComision().map((e) => (
                      <li key={e.servicio}>
                        {e.servicio}: comisión {e.texto}
                      </li>
                    ))}
                  </ul>
                  <p className="muted">Las condiciones se acuerdan por escrito antes de empezar.</p>
                  <Link href="/vendedores" className="link-text">
                    Ver todas las condiciones <Flecha />
                  </Link>
                </Dialogo>
              </div>
            </div>
            <div className="vd-stack vd-rise">
              <div className="vd-panel vd-panel--back" aria-hidden="true">
                <div className="vd-panel__in vd-comis">
                  <span className="label">Comisiones por ventas</span>
                  <b>{COMISION_PCT}%</b>
                  <span>por proyecto cobrado</span>
                  <div className="vd-bars">
                    <i style={{ height: "28%" }} />
                    <i style={{ height: "44%" }} />
                    <i style={{ height: "62%" }} />
                    <i style={{ height: "100%" }} />
                  </div>
                  <span className="label">Esquema ilustrativo</span>
                </div>
              </div>
              <div className="vd-panel vd-panel--front">
                <div className="vd-panel__in">
                  <h3 className="vd-panel__t">Tu proceso comercial</h3>
                  <ol className="vd-pasos">
                    <li>Encontrá una oportunidad</li>
                    <li>Presentá la propuesta</li>
                    <li>Cerrá la venta</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="vd-benef vd-rise">
            {[
              ["percent", `${COMISION_PCT}% por proyecto cobrado`, "Comisión clara."],
              ["layers", "Webs y sistemas a medida", "Productos reales."],
              ["bolt", `Mínimo ${MIN_PROYECTOS_MES} proyectos al mes`, "Para sostener el programa."],
              ["route", "Tu código de vendedor", "Seguimiento de cada oportunidad."],
            ].map(([ic, t, d]) => (
              <div key={t}>
                <span className="vd-tile">
                  <Icon name={ic} size={28} />
                </span>
                <span>
                  <b>{t}</b>
                  <small>{d}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
