import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { SERVICIOS_DETALLE } from "@/lib/sitio";
import { precioTexto, servicioPorId } from "@/lib/catalogo";
import { Cabecera } from "@/components/Cabecera";
import { HighlightText } from "@/components/HighlightText";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/servicios");

export default function Servicios() {
  return (
    <>
      <JsonLd ruta="/servicios" />
      <Cabecera
        etiqueta="Servicios"
        titulo={<>Tres cosas que hago <HighlightText>bien.</HighlightText></>}
        bajada="Landings, webs a medida y sistemas para ordenar tu negocio. Todo lo diseño y lo programo yo."
      />
      <section className="section" style={{ paddingTop: 0, borderTop: 0 }}>
        <div className="container lista">
          {SERVICIOS_DETALLE.map((s, i) => (
            <article key={s.id} className="lista__item">
              <p className="lista__n">0{i + 1} /</p>
              <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
                <h2 className="h2" style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)" }}>{s.nombre}</h2>
                <p className="muted">{s.paraQuien}</p>
                <p style={{ fontWeight: 700, fontSize: "1.25rem" }}>{precioTexto(servicioPorId(s.id))}</p>
              </div>
              <div>
                <ul>
                  {s.entregables.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
                {s.nota && <p className="muted" style={{ marginTop: 12 }}>{s.nota}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
