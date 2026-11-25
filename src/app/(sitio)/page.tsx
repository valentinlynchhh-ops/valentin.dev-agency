import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { PASOS, TRABAJOS } from "@/lib/sitio";
import { COMISION_PCT, MIN_PROYECTOS_MES, ejemplosComision } from "@/lib/vendedores";
import { Flecha } from "@/components/Marca";
import { Icon } from "@/components/Icon";
import { HorizonScene } from "@/components/Horizon";
import { HighlightText } from "@/components/HighlightText";
import { Carrusel } from "@/components/Carrusel";
import { Tilt } from "@/components/Tilt";
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

      {/* 01 · Hero */}
      <section className="vd-hero" aria-labelledby="t-h1">
        <HorizonScene variante="hero" id="hero" />
        <div className="vd-hero__in">
          <h1 id="t-h1" className="vd-h1 vd-in">
            <span>Diseño productos</span>
            <span>
              que generan <HighlightText>negocio.</HighlightText>
            </span>
          </h1>
          <p className="vd-hero__sub vd-in vd-in-2">Estrategia, diseño y desarrollo digital para ideas que escalan.</p>
          <div className="vd-actions vd-in vd-in-3">
            <Link href="/#contacto" className="btn btn-primary vd-btn-xl">
              Hablemos <Flecha />
            </Link>
            <Link href="#proyectos" className="btn btn-outline vd-btn-xl">
              Ver proyectos <Icon name="down" size={20} />
            </Link>
          </div>
          <p className="vd-hero__mini vd-in vd-in-4">
            ¿Querés saber cuánto sale tu web? <Link href="/cotizar">Cotizala acá ↗</Link>
          </p>
        </div>
        <a href="#proyectos" className="vd-chevron" aria-label="Ir a los proyectos">
          <Icon name="down" size={32} />
        </a>
      </section>

      {/* 02 · Proyectos: el museo */}
      <section id="proyectos" className="vd-proy" aria-labelledby="t-proy">
        <HorizonScene variante="proyectos" id="pro" />
        <div className="vd-wrap vd-wrap--wide">
          <div className="vd-proy__head vd-rise">
            <h2 id="t-proy" className="vd-h2">
              De la idea a la <HighlightText>realidad.</HighlightText>
            </h2>
            <p>Algunos de los sitios y productos digitales que diseñé y desarrollé.</p>
          </div>
          <Carrusel etiqueta="Obras del museo" className="vd-rise">
            {TRABAJOS.map((t, i) => (
              <article key={t.id} className="vd-frame">
                <div className="vd-luz" aria-hidden="true" />
                <Tilt>
                  <a className="vd-art" href={t.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.nombre}: visitar ${t.host} (se abre en otra pestaña)`}>
                    <Image src={t.imagenCard} alt={t.altImagen} width={780} height={1012} sizes="(min-width: 1280px) 19vw, (min-width: 960px) 30vw, (min-width: 640px) 46vw, 76vw" priority={i === 0} />
                  </a>
                </Tilt>
                <div className="vd-cartela">
                  <span className="label">Sala 0{i + 1}</span>
                  <h3>
                    <a href={t.url} target="_blank" rel="noopener noreferrer">
                      {t.nombre} <Flecha />
                    </a>
                  </h3>
                  <p>{t.corta}</p>
                </div>
              </article>
            ))}
            <article className="vd-frame">
              <div className="vd-luz" aria-hidden="true" />
              <Tilt>
                <Link className="vd-art vd-art--vacio" href="/#contacto">
                  <span>
                    <span className="label">Próxima sala</span>
                    <b>Tu proyecto</b>
                  </span>
                </Link>
              </Tilt>
              <div className="vd-cartela">
                <span className="label">Sala 0{TRABAJOS.length + 1}</span>
                <h3>
                  <Link href="/#contacto" style={{ textDecoration: "none", display: "inline-flex", gap: 10, alignItems: "center" }}>
                    Esperando tu web <Flecha />
                  </Link>
                </h3>
                <p>El próximo en entrar al museo podés ser vos.</p>
              </div>
            </article>
          </Carrusel>
          <p className="vd-proy__more vd-rise">
            <Link href="/museo" className="btn btn-outline">
              Recorré el museo completo <Flecha />
            </Link>
          </p>
        </div>
      </section>

      {/* 03 · Agendar */}
      <section id="contacto" className="vd-agenda" aria-labelledby="t-ag">
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
      <section id="sobre-mi" className="vd-sobre" aria-labelledby="t-sobre">
        <HorizonScene variante="about" id="sob" />
        <div className="vd-wrap vd-wrap--wide">
          <div className="vd-sobre__grid">
            <div className="vd-retrato-wrap vd-rise">
              <div className="vd-retrato">
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
                    <b>{TRABAJOS.length} sitios</b>
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
      <section id="vendedores" className="vd-vend" aria-labelledby="t-vend">
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
                      Cobrás el <b>{COMISION_PCT}%</b> de cada proyecto efectivamente cobrado.
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
