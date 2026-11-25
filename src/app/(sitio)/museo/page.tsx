import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { metaPagina } from "@/lib/seo";
import { TRABAJOS } from "@/lib/sitio";
import { Flecha } from "@/components/Marca";
import { Icon } from "@/components/Icon";
import { HorizonScene } from "@/components/Horizon";
import { HighlightText } from "@/components/HighlightText";
import { Tilt } from "@/components/Tilt";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = metaPagina("/museo");

const ESCENAS = ["about", "vendedores", "agenda", "about"] as const;

export default function Museo() {
  return (
    <>
      <JsonLd ruta="/museo" />

      <nav className="mu-salas" aria-label="Salas del museo">
        <a href="#hall" aria-label="Hall de entrada"><span /></a>
        {TRABAJOS.map((t, i) => (
          <a key={t.id} href={`#sala-${t.id}`} aria-label={`Sala ${i + 1}: ${t.nombre}`}><span /></a>
        ))}
        <a href="#sala-tuya" aria-label="Tu sala"><span /></a>
      </nav>

      <section id="hall" className="mu-hall" aria-labelledby="t-museo">
        <HorizonScene variante="hero" id="mhall" />
        <div className="mu-cono" aria-hidden="true" />
        <div className="mu-hall__in">
          <span className="vd-pill"><Icon name="frame" size={22} /> Museo de trabajos</span>
          <h1 id="t-museo" className="vd-h1 vd-in">
            <span>Entrá al</span>
            <span><HighlightText>museo.</HighlightText></span>
          </h1>
          <p className="vd-hero__sub vd-in vd-in-2">Cada sala es un sitio real que diseñé y desarrollé. Recorrelas en orden o saltá a la que quieras.</p>
          <div className="vd-actions vd-in vd-in-3">
            <a href={`#sala-${TRABAJOS[0].id}`} className="btn btn-primary vd-btn-xl">Empezar el recorrido <Icon name="down" size={20} /></a>
            <Link href="/#contacto" className="btn btn-outline vd-btn-xl">Quiero mi sala <Flecha /></Link>
          </div>
        </div>
      </section>

      {TRABAJOS.map((t, i) => (
        <section key={t.id} id={`sala-${t.id}`} className={`mu-sala${i % 2 ? " mu-sala--inv" : ""}`} aria-labelledby={`t-${t.id}`}>
          <HorizonScene variante={ESCENAS[i % ESCENAS.length]} id={`ms${i}`} ligera />
          <div className="mu-sala__grid">
            <div className="mu-placa vd-rise">
              <span className="label">Sala 0{i + 1} · {t.categoria}</span>
              <h2 id={`t-${t.id}`} className="vd-h2 mu-placa__t">{t.nombre}</h2>
              <p className="mu-placa__p">{t.descripcion}</p>
              <ul className="mu-chips" aria-label={`Qué incluye ${t.nombre}`}>
                {t.incluye.map((x) => (
                  <li key={x} className="tag">{x}</li>
                ))}
              </ul>
              <div className="vd-actions" style={{ justifyContent: "flex-start" }}>
                <a href={t.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Visitar {t.host} <Flecha /><span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </div>
            </div>
            <Tilt className="mu-obra-wrap" max={5}>
              <div className="mu-obra">
                <div className="mu-luz" aria-hidden="true" />
                <a className="mu-marco" href={t.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.nombre}: visitar ${t.host} (se abre en otra pestaña)`}>
                  <Image src={t.imagenEscritorio} alt={`${t.altImagen} en escritorio`} width={1440} height={900} sizes="(min-width: 1024px) 56vw, 92vw" priority={i === 0} />
                </a>
                <div className="mu-cel" aria-hidden="true">
                  <Image src={t.imagenCelular} alt="" width={390} height={844} sizes="(min-width: 1024px) 14vw, 30vw" />
                </div>
                <div className="mu-piso" aria-hidden="true" />
              </div>
            </Tilt>
          </div>
        </section>
      ))}

      <section id="sala-tuya" className="mu-sala mu-sala--tuya" aria-labelledby="t-tuya">
        <HorizonScene variante="final" id="mtuya" ligera />
        <div className="mu-tuya vd-rise">
          <span className="label">Sala 0{TRABAJOS.length + 1} · Reservada</span>
          <h2 id="t-tuya" className="vd-h2">
            Tu proyecto es la <HighlightText>próxima sala.</HighlightText>
          </h2>
          <p className="vd-hero__sub">Contame qué tenés en mente y lo pensamos juntos.</p>
          <div className="vd-actions">
            <Link href="/#contacto" className="btn btn-primary vd-btn-xl">Hablemos <Flecha /></Link>
            <Link href="/cotizar" className="btn btn-outline vd-btn-xl">Cotizar mi web <Flecha /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
