import Link from "next/link";
import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { FAQ } from "@/lib/sitio";
import { Cabecera } from "@/components/Cabecera";
import { Flecha } from "@/components/Marca";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/preguntas-frecuentes");

export default function Preguntas() {
  return (
    <>
      <JsonLd ruta="/preguntas-frecuentes" />
      <Cabecera
        etiqueta="Preguntas frecuentes"
        titulo={<>Lo que se pregunta <span className="highlight">antes de contratar.</span></>}
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
      <section className="section" data-surface="yellow" style={{ background: "var(--surface)", color: "var(--text)" }}>
        <div className="container" style={{ display: "grid", gap: 20 }}>
          <h2 className="h2">¿Te quedó una duda?</h2>
          <div>
            <Link href="/contacto" className="btn btn-inverse">Preguntame <Flecha /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
