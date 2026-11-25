import type { Metadata } from "next";
import Link from "next/link";
import { metaPagina } from "@/lib/seo";
import { Flecha } from "@/components/Marca";
import { Icon } from "@/components/Icon";
import { HorizonScene } from "@/components/Horizon";
import { HighlightText } from "@/components/HighlightText";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/recursos");

const RECURSOS = [
  { href: "/cotizar", icono: "calendar", t: "Cotizador", d: "Armá tu web en 4 pasos y mirá el precio base al instante." },
  { href: "/precios", icono: "percent", t: "Precios", d: "Cuánto sale cada servicio y cómo se paga." },
  { href: "/como-trabajamos", icono: "route", t: "Cómo trabajo", d: "Los pasos desde que me escribís hasta que se publica." },
  { href: "/preguntas-frecuentes", icono: "pen", t: "Preguntas frecuentes", d: "Precio, plazos, pagos, dominio, hosting y cambios." },
  { href: "/museo", icono: "frame", t: "Museo de trabajos", d: "Cada sitio que diseñé y desarrollé, con su vista en escritorio y celular." },
  { href: "/vendedores", icono: "users", t: "Programa de vendedores", d: "Revendé mis webs y cobrá comisión por proyecto cobrado." },
  { href: "/llms.txt", icono: "code", t: "Para asistentes de IA", d: "Un resumen de este sitio en texto plano (llms.txt), generado de las mismas fuentes." },
] as const;

export default function Recursos() {
  return (
    <>
      <JsonLd ruta="/recursos" />
      <section className="pg-hero pg-hero--chico" aria-labelledby="t-rec">
        <HorizonScene variante="proyectos" id="rec" />
        <div className="pg-hero__in">
          <p className="label">Recursos</p>
          <h1 id="t-rec" className="vd-h1">
            Todo lo útil, <HighlightText>a mano.</HighlightText>
          </h1>
          <p className="vd-hero__sub">Herramientas y respuestas para decidir tu web con tranquilidad.</p>
        </div>
      </section>
      <section className="pg-body" aria-label="Recursos">
        <div className="pg-wrap">
          <ul className="pg-recursos">
            {RECURSOS.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="vd-card pg-recurso">
                  <Icon name={r.icono} size={30} />
                  <span>
                    <b>{r.t}</b>
                    <small>{r.d}</small>
                  </span>
                  <Flecha />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
