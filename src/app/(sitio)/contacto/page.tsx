import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { linkWhatsApp } from "@/lib/sitio";
import { Cabecera } from "@/components/Cabecera";
import { FormularioConsulta } from "@/components/FormularioConsulta";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/contacto");

export default function Contacto() {
  const wa = linkWhatsApp();
  return (
    <>
      <JsonLd ruta="/contacto" />
      <Cabecera
        etiqueta="Contacto"
        titulo={<>Contame <span className="highlight">qué necesitás.</span></>}
        bajada="Te respondo yo, sin intermediarios."
      />
      <section className="section" data-surface="yellow" style={{ background: "var(--surface)", color: "var(--text)", borderTop: 0 }}>
        <div className="container" style={{ maxWidth: 720, marginInline: "auto 0" }}>
          <FormularioConsulta origen="/contacto" />
          {wa && (
            <p style={{ marginTop: 24 }}>
              ¿Preferís WhatsApp? <a href={wa} rel="noopener" className="link-text">Escribime ahí</a>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
