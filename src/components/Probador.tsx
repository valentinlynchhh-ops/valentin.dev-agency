"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Flecha } from "./Marca";

const RUBROS = [
  { id: "juridico", nombre: "Estudio jurídico", slug: "ejemplo-estudio-juridico" },
  { id: "contable", nombre: "Estudio contable", slug: "ejemplo-estudio-contable" },
  { id: "inmobiliaria", nombre: "Inmobiliaria", slug: "ejemplo-inmobiliaria" },
] as const;

/* Probador: elegís un rubro y ves una muestra real (con datos ficticios, rotulada) dentro de un celular o una notebook.
   La imagen carga al instante; la página en vivo se monta solo si tocás «Probar en vivo» (así no pesa en equipos livianos). */
export function Probador() {
  const [rubro, setRubro] = useState<(typeof RUBROS)[number]["id"]>("juridico");
  const [equipo, setEquipo] = useState<"m" | "d">("m");
  const [vivo, setVivo] = useState(false);
  const pantalla = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);
  const actual = RUBROS.find((r) => r.id === rubro) ?? RUBROS[0];
  const base = equipo === "m" ? 390 : 1280;

  useEffect(() => {
    const el = pantalla.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / base));
    ro.observe(el);
    return () => ro.disconnect();
  }, [base]);

  return (
    <section id="probador" className="x-prob" aria-labelledby="t-prob">
      <div className="vd-wrap vd-wrap--wide x-prob__grid">
        <div className="x-prob__txt">
          <p className="label">Probador</p>
          <h2 id="t-prob" className="x-h2">
            Elegí un rubro. Mirá cómo quedaría.
          </h2>
          <p className="x-prob__p">Estas son muestras armadas con el mismo sistema que uso con cada cliente. Las de acá son de ejemplo, con datos inventados y rotuladas como tales.</p>
          <div className="x-seg" role="tablist" aria-label="Rubro">
            {RUBROS.map((r) => (
              <button key={r.id} type="button" role="tab" aria-selected={rubro === r.id} onClick={() => { setRubro(r.id); setVivo(false); }}>
                {r.nombre}
              </button>
            ))}
          </div>
          <div className="x-seg x-seg--chico" role="group" aria-label="Dispositivo">
            <button type="button" aria-pressed={equipo === "m"} onClick={() => { setEquipo("m"); setVivo(false); }}>Celular</button>
            <button type="button" aria-pressed={equipo === "d"} onClick={() => { setEquipo("d"); setVivo(false); }}>Escritorio</button>
          </div>
          <div className="vd-actions">
            <button type="button" className="btn btn-primary" onClick={() => setVivo(true)} disabled={vivo}>
              {vivo ? "En vivo" : "Probar en vivo"} <Flecha />
            </button>
            <a className="btn btn-outline" href={`/demo/${actual.slug}`} target="_blank" rel="noopener noreferrer">
              Abrir completa
            </a>
          </div>
          <p className="x-prob__p">
            ¿Querés ver la tuya? Te la armo con las fotos de tu negocio. <Link href="/#contacto">Pedime una muestra ↗</Link>
          </p>
        </div>
        <div className={`x-disp x-disp--${equipo}`} data-spot>
          <div className="x-disp__marco">
            <div className="x-disp__pantalla" ref={pantalla} style={{ ["--k" as string]: k, ["--base" as string]: `${base}px` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/img/probador-${rubro}-${equipo}.webp`} alt={`Muestra de ejemplo: ${actual.nombre}`} width={equipo === "m" ? 390 : 1280} height={equipo === "m" ? 844 : 800} loading="lazy" decoding="async" />
              {vivo && (
                <iframe key={`${rubro}-${equipo}`} src={`/demo/${actual.slug}`} title={`Muestra en vivo: ${actual.nombre}`} sandbox="allow-scripts" loading="lazy" style={{ width: base, height: equipo === "m" ? 844 : 800, transform: `scale(${k})` }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
