import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { PASOS } from "@/lib/sitio";
import { Cabecera } from "@/components/Cabecera";
import { HighlightText } from "@/components/HighlightText";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/como-trabajamos");

export default function ComoTrabajo() {
  return (
    <>
      <JsonLd ruta="/como-trabajamos" />
      <Cabecera
        etiqueta="Cómo trabajo"
        titulo={<>Cuatro pasos, sin <HighlightText>sorpresas.</HighlightText></>}
        bajada="En todo el proceso hablás conmigo. Así se ve desde que me escribís hasta que tu web está publicada."
      />
      <section className="section" style={{ paddingTop: 0, borderTop: 0 }}>
        <div className="container lista">
          {PASOS.map((p) => (
            <article key={p.n} className="lista__item">
              <p className="lista__n">{p.n} /</p>
              <h2 className="h3">{p.titulo}</h2>
              <p className="muted" style={{ maxWidth: "52ch" }}>{p.texto}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
