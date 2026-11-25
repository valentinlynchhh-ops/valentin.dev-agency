import type { Metadata } from "next";
import Link from "next/link";
import { metaPagina } from "@/lib/seo";
import { EMAIL_PUBLICO, WHATSAPP_VISIBLE, linkWhatsApp } from "@/lib/sitio";
import { Cabecera } from "@/components/Cabecera";
import { HighlightText } from "@/components/HighlightText";
import { FormularioConsulta } from "@/components/FormularioConsulta";
import { Icon } from "@/components/Icon";
import { Flecha } from "@/components/Marca";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/contacto");

export default function Contacto() {
  const wa = linkWhatsApp();
  return (
    <>
      <JsonLd ruta="/contacto" />
      <Cabecera etiqueta="Contacto" titulo={<>Contame qué <HighlightText>necesitás.</HighlightText></>} bajada="Te respondo yo, sin intermediarios." />
      <section className="pg-body" style={{ paddingTop: 0 }}>
        <div className="pg-wrap" style={{ display: "grid", gap: 32 }}>
          <div className="contacto-grid">
            <div className="vd-card pg-form" style={{ display: "block" }}>
              <FormularioConsulta origen="/contacto" />
            </div>
            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              {wa && (
                <a href={wa} rel="noopener" className="vd-card pg-recurso">
                  <Icon name="whatsapp" size={30} />
                  <span><b>WhatsApp</b><small>{WHATSAPP_VISIBLE}</small></span>
                  <Flecha />
                </a>
              )}
              <a href={`mailto:${EMAIL_PUBLICO}`} className="vd-card pg-recurso">
                <Icon name="mail" size={30} />
                <span><b>Mail</b><small>{EMAIL_PUBLICO}</small></span>
                <Flecha />
              </a>
              <Link href="/cotizar" className="vd-card pg-recurso">
                <Icon name="calendar" size={30} />
                <span><b>Cotizá tu web</b><small>Armala en 4 pasos y mirá el precio base.</small></span>
                <Flecha />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
