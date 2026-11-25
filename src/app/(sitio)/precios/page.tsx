import Link from "next/link";
import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { CONDICIONES_WEB, PRECIO_MINIMO_USD, pagosWeb, usd } from "@/lib/catalogo";
import { Cabecera } from "@/components/Cabecera";
import { HighlightText } from "@/components/HighlightText";
import { PreciosLista } from "@/components/Listas";
import { Flecha } from "@/components/Marca";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/precios");

export default function Precios() {
  const pagos = pagosWeb();
  return (
    <>
      <JsonLd ruta="/precios" />
      <Cabecera
        etiqueta="Precios"
        titulo={<>Sabés cuánto sale antes de <HighlightText>arrancar.</HighlightText></>}
        bajada={`Precios en dólares. Nunca trabajo por menos de ${usd(PRECIO_MINIMO_USD)}.`}
      />
      <section className="section" style={{ paddingTop: 0, borderTop: 0 }}>
        <div className="container">
          <PreciosLista nivel="h2" />
        </div>
      </section>
      <section className="section" aria-labelledby="t-cond">
        <div className="container" style={{ display: "grid", gap: 28 }}>
          <div className="section__head" style={{ marginBottom: 0 }}>
            <p className="label">Web a medida con sistema de consultas</p>
            <h2 id="t-cond" className="h2">Cómo se paga y qué incluye.</h2>
          </div>
          <dl className="lista" style={{ margin: 0 }}>
            <div className="lista__item" style={{ gridTemplateColumns: "1fr" }}>
              <dt className="label">Al arrancar</dt>
              <dd style={{ margin: 0 }}>{CONDICIONES_WEB.seniaInicioPct}% — {usd(pagos.inicio)}</dd>
            </div>
            <div className="lista__item" style={{ gridTemplateColumns: "1fr" }}>
              <dt className="label">Al publicar</dt>
              <dd style={{ margin: 0 }}>{CONDICIONES_WEB.pagoAlPublicarPct}% — {usd(pagos.publicar)}</dd>
            </div>
            <div className="lista__item" style={{ gridTemplateColumns: "1fr" }}>
              <dt className="label">Plazo</dt>
              <dd style={{ margin: 0 }}>{CONDICIONES_WEB.plazoDiasHabiles} días hábiles</dd>
            </div>
            <div className="lista__item" style={{ gridTemplateColumns: "1fr" }}>
              <dt className="label">Incluye</dt>
              <dd style={{ margin: 0 }}>
                {CONDICIONES_WEB.incluye.charAt(0).toUpperCase() + CONDICIONES_WEB.incluye.slice(1)} y {CONDICIONES_WEB.rondasDeCambios} rondas de cambios
              </dd>
            </div>
          </dl>
          <p>
            <Link href="/cotizar" className="btn btn-primary">Cotizar mi web <Flecha /></Link>
          </p>
        </div>
      </section>
    </>
  );
}
