import type { Metadata } from "next";
import Link from "next/link";
import { metaPagina } from "@/lib/seo";
import { CATALOGO, precioTexto } from "@/lib/catalogo";
import { COMISION_PCT, MIN_PROYECTOS_MES, ejemplosComision } from "@/lib/vendedores";
import { Flecha } from "@/components/Marca";
import { Icon } from "@/components/Icon";
import { HorizonScene } from "@/components/Horizon";
import { HighlightText } from "@/components/HighlightText";
import { PostularForm } from "@/components/PostularForm";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/vendedores");

const PREGUNTAS = [
  { q: "¿Cómo se calcula la comisión?", a: `Es el ${COMISION_PCT}% de cada proyecto efectivamente cobrado. Si el cliente todavía no pagó, no hay comisión sobre esa parte.` },
  { q: "¿Cuándo y cómo se cobra?", a: "Forma y fechas de pago se acuerdan por escrito antes de empezar. No hay condiciones ocultas: lo que acordemos es lo que vale." },
  { q: "¿Qué pasa si un mes no llego al mínimo?", a: `El programa está pensado para quienes cierran al menos ${MIN_PROYECTOS_MES} proyectos cobrados por mes. Si un mes no llegás, lo hablamos y definimos si seguís.` },
  { q: "¿Cómo sé qué clientes son míos?", a: "Cada vendedor tiene un código. Las consultas que entran por tu link (valentin.dev/?ref=TUCODIGO) quedan asociadas a vos." },
  { q: "¿Necesito experiencia?", a: "Lo que más cuenta es que te guste vender. Contame tu experiencia, sea cual sea, en la postulación." },
] as const;

export default function Vendedores() {
  const ejemplos = ejemplosComision();
  return (
    <>
      <JsonLd ruta="/vendedores" />
      <section className="pg-hero" aria-labelledby="t-vend">
        <HorizonScene variante="vendedores" id="pvend" />
        <div className="pg-hero__in">
          <span className="vd-pill"><Icon name="users" size={22} /> Programa de vendedores</span>
          <h1 id="t-vend" className="vd-h1">
            Revendé mis webs y cobrá el <HighlightText>{`${COMISION_PCT}%.`}</HighlightText>
          </h1>
          <p className="vd-hero__sub">Conectá negocios con webs y sistemas a medida y cobrá comisión sobre cada proyecto cobrado.</p>
          <div className="vd-actions">
            <a href="#postular" className="btn btn-primary vd-btn-xl">Quiero sumarme <Flecha /></a>
            <a href="#condiciones" className="btn btn-outline vd-btn-xl">Ver condiciones <Icon name="down" size={20} /></a>
          </div>
        </div>
      </section>

      <section id="condiciones" className="pg-body" aria-labelledby="t-cond">
        <div className="pg-wrap">
          <h2 id="t-cond" className="vd-h2 pg-h2">Las condiciones, claras.</h2>
          <div className="pg-cards">
            <div className="vd-card"><Icon name="percent" size={34} /><span><b>{COMISION_PCT}% por proyecto cobrado</b><small>Sobre lo que el cliente efectivamente paga.</small></span></div>
            <div className="vd-card"><Icon name="bolt" size={34} /><span><b>Mínimo {MIN_PROYECTOS_MES} proyectos al mes</b><small>Para sostener el programa.</small></span></div>
            <div className="vd-card"><Icon name="route" size={34} /><span><b>Tu código de vendedor</b><small>Cada consulta por tu link queda a tu nombre.</small></span></div>
            <div className="vd-card"><Icon name="layers" size={34} /><span><b>Por escrito, antes de empezar</b><small>Forma y fechas de pago, sin letra chica.</small></span></div>
          </div>
        </div>
      </section>

      <section className="pg-body pg-body--alt" aria-labelledby="t-vende">
        <div className="pg-wrap">
          <h2 id="t-vende" className="vd-h2 pg-h2">Qué vendés y cuánto ganás.</h2>
          <p className="lead muted" style={{ marginBottom: 28 }}>Comisión calculada sobre el precio de lista. Son ejemplos, no resultados de nadie.</p>
          <div className="pg-tabla" role="table" aria-label="Servicios y comisión">
            <div role="row" className="pg-tabla__h"><span role="columnheader">Servicio</span><span role="columnheader">Precio</span><span role="columnheader">Tu comisión ({COMISION_PCT}%)</span></div>
            {CATALOGO.map((s, i) => (
              <div role="row" key={s.id}>
                <span role="cell"><b>{s.nombre}</b><small>{s.resumen}</small></span>
                <span role="cell">{precioTexto(s)}</span>
                <span role="cell" className="pg-comis">{ejemplos[i].texto}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pg-body" aria-labelledby="t-como">
        <div className="pg-wrap">
          <h2 id="t-como" className="vd-h2 pg-h2">Cómo funciona.</h2>
          <ol className="pg-pasos">
            <li><span><b>Te postulás.</b> Completás el formulario y te respondo yo.</span></li>
            <li><span><b>Recibís tu código.</b> Cada consulta que entre por tu link queda asociada a vos.</span></li>
            <li><span><b>Presentás y acompañás.</b> Conectás al negocio conmigo y lo acompañás hasta cerrar.</span></li>
            <li><span><b>Cobrás tu comisión.</b> El {COMISION_PCT}% de cada proyecto cobrado, según lo acordado por escrito.</span></li>
          </ol>
        </div>
      </section>

      <section id="postular" className="pg-body pg-body--alt" aria-labelledby="t-post">
        <div className="pg-wrap pg-wrap--chico">
          <h2 id="t-post" className="vd-h2 pg-h2">Postulate.</h2>
          <p className="lead muted" style={{ marginBottom: 24 }}>Te respondo yo. No te pido datos financieros ni documentos en esta instancia.</p>
          <div className="vd-card pg-form"><PostularForm id="pv" /></div>
        </div>
      </section>

      <section className="pg-body" aria-labelledby="t-faqv">
        <div className="pg-wrap pg-wrap--chico">
          <h2 id="t-faqv" className="vd-h2 pg-h2">Preguntas del programa.</h2>
          <div className="faq">
            {PREGUNTAS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p className="resp">{f.a}</p>
              </details>
            ))}
          </div>
          <p style={{ marginTop: 28 }}><Link href="/#contacto" className="link-text">¿Otra duda? Escribime <Flecha /></Link></p>
        </div>
      </section>
    </>
  );
}
