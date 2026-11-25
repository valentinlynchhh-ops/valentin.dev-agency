import Link from "next/link";
import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { CATALOGO, precioTexto } from "@/lib/catalogo";
import { linkWhatsApp } from "@/lib/sitio";
import { Escalera, Flecha } from "@/components/Marca";
import { TrabajosLista, PreciosLista } from "@/components/Listas";
import { FormularioConsulta } from "@/components/FormularioConsulta";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/");

export default function Inicio() {
  const wa = linkWhatsApp();
  return (
    <>
      <JsonLd ruta="/" />

      <section className="hero">
        <div className="container hero__grid">
          <div style={{ display: "grid", gap: 24 }}>
            <p className="label rise">Diseño · Desarrollo · Sistemas — Argentina</p>
            <h1 className="h1 rise">
              Diseño y programo tu web. <span className="highlight">Sin intermediarios.</span>
            </h1>
            <p className="lead hero__lead rise">
              Páginas web, landings y sistemas a medida para negocios y profesionales de Argentina. Hablás conmigo, que soy quien las diseña y las construye.
            </p>
            <div className="hero__actions rise">
              <a href="#consulta" className="btn btn-primary">
                Contame tu proyecto <Flecha />
              </a>
              <Link href="/trabajos" className="link-text">Ver trabajos</Link>
            </div>
          </div>
          <div className="hero__precios rise" role="list" aria-label="Precios en dólares">
            {CATALOGO.map((s) => (
              <div key={s.id} role="listitem">
                <span>{s.nombre}</span>
                <b>{precioTexto(s)}</b>
              </div>
            ))}
          </div>
        </div>
        <div className="container"><Escalera /></div>
      </section>

      <section className="section" aria-labelledby="t-trabajos">
        <div className="container">
          <div className="section__head">
            <p className="label">01 / Trabajos reales</p>
            <h2 id="t-trabajos" className="h2">Sitios publicados, para entrar y mirar.</h2>
          </div>
          <TrabajosLista variante="home" />
          <p style={{ marginTop: 32 }}>
            <Link href="/trabajos" className="link-text">Ver todos los trabajos <Flecha /></Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="t-precios">
        <div className="container">
          <div className="section__head">
            <p className="label">02 / Cuánto sale</p>
            <h2 id="t-precios" className="h2">Precios claros, en dólares.</h2>
          </div>
          <PreciosLista />
          <p style={{ marginTop: 32 }}>
            <Link href="/precios" className="link-text">Cómo se paga y qué incluye <Flecha /></Link>
          </p>
        </div>
      </section>

      <section id="consulta" className="section section--yellow" data-surface="yellow" style={{ background: "var(--surface)", color: "var(--text)" }} aria-labelledby="t-consulta">
        <div className="container consulta-grid" style={{ display: "grid", gap: 32 }}>
          <div className="section__head" style={{ marginBottom: 0 }}>
            <p className="label">03 / Consulta</p>
            <h2 id="t-consulta" className="h2">¿Qué estás construyendo?</h2>
            <p className="lead">Contame en un minuto. Te respondo yo.</p>
          </div>
          <div style={{ maxWidth: 640 }}>
            <FormularioConsulta origen="/" />
            {wa && (
              <p style={{ marginTop: 20 }}>
                ¿Preferís WhatsApp? <a href={wa} rel="noopener" className="link-text">Escribime ahí</a>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
