import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { Cotizador } from "@/components/Cotizador";
import { HorizonScene } from "@/components/Horizon";
import { HighlightText } from "@/components/HighlightText";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/cotizar");

export default function Cotizar() {
  return (
    <>
      <JsonLd ruta="/cotizar" />
      <section className="pg-hero pg-hero--cot" aria-labelledby="t-cot">
        <HorizonScene variante="proyectos" id="cot" />
        <div className="pg-hero__in">
          <p className="label">Cotizador</p>
          <h1 id="t-cot" className="vd-h1">
            Armá tu web y <HighlightText>cotizala.</HighlightText>
          </h1>
          <p className="vd-hero__sub">Cuatro pasos. Ves el precio base al instante y el pedido me llega directo a mí.</p>
        </div>
      </section>
      <section className="pg-body" aria-label="Armador de la web">
        <Cotizador />
      </section>
    </>
  );
}
