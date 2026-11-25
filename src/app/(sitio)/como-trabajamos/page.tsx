import Link from "next/link";
import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { PASOS } from "@/lib/sitio";
import { Cabecera } from "@/components/Cabecera";
import { Flecha } from "@/components/Marca";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/como-trabajamos");

export default function ComoTrabajo() {
  return (
    <>
      <JsonLd ruta="/como-trabajamos" />
      <Cabecera
        etiqueta="Cómo trabajo"
        titulo={<>Cuatro pasos, <span className="highlight">sin sorpresas.</span></>}
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
      <section className="section" data-surface="yellow" style={{ background: "var(--surface)", color: "var(--text)" }}>
        <div className="container" style={{ display: "grid", gap: 20 }}>
          <h2 className="h2">Arrancamos cuando quieras.</h2>
          <div>
            <Link href="/contacto" className="btn btn-inverse">Contame tu proyecto <Flecha /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
