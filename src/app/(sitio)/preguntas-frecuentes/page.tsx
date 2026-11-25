import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { FAQ } from "@/lib/sitio";
import { Cabecera } from "@/components/Cabecera";
import { HighlightText } from "@/components/HighlightText";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/preguntas-frecuentes");

export default function Preguntas() {
  return (
    <>
      <JsonLd ruta="/preguntas-frecuentes" />
      <Cabecera
        etiqueta="Preguntas frecuentes"
        titulo={<>Lo que se pregunta antes de <HighlightText>contratar.</HighlightText></>}
      />
      <section className="section" style={{ paddingTop: 0, borderTop: 0 }}>
        <div className="container faq" style={{ maxWidth: 900 }}>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="resp">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
