import Link from "next/link";
import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { Cabecera } from "@/components/Cabecera";
import { TrabajosLista } from "@/components/Listas";
import { Flecha } from "@/components/Marca";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/trabajos");

export default function Trabajos() {
  return (
    <>
      <JsonLd ruta="/trabajos" />
      <Cabecera
        etiqueta="Trabajos"
        titulo={<>Sitios reales, <span className="highlight">publicados.</span></>}
        bajada="Tres sitios que están en línea ahora. Entrá y mirá cómo se ven y se usan, también en el celular."
      />
      <section className="section" style={{ paddingTop: 0, borderTop: 0 }}>
        <div className="container">
          <TrabajosLista variante="full" prioridad />
        </div>
      </section>
      <section className="section" data-surface="yellow" style={{ background: "var(--surface)", color: "var(--text)" }}>
        <div className="container" style={{ display: "grid", gap: 20 }}>
          <h2 className="h2">¿El tuyo es el próximo?</h2>
          <div>
            <Link href="/contacto" className="btn btn-inverse">Hablemos de tu proyecto <Flecha /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
