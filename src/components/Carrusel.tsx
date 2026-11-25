"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/* Carrusel con scroll-snap nativo, sin autoplay. Cada «posición» es un paso de una tarjeta: con 5 obras y 3 visibles hay
   3 posiciones; con 5 visibles no hay nada que mover y los controles no aparecen (no se simulan páginas). */
export function Carrusel({ children, etiqueta, className = "" }: { children: React.ReactNode; etiqueta: string; className?: string }) {
  const riel = useRef<HTMLDivElement>(null);
  const paso = useRef(0);
  const [desborda, setDesborda] = useState(false);
  const [activo, setActivo] = useState(0);
  const [posiciones, setPosiciones] = useState(1);

  const medir = useCallback(() => {
    const r = riel.current;
    const primero = r?.children[0] as HTMLElement | undefined;
    if (!r || !primero) return;
    const gap = parseFloat(getComputedStyle(r).columnGap) || 0;
    paso.current = primero.offsetWidth + gap;
    const util = r.clientWidth - parseFloat(getComputedStyle(r).paddingLeft) * 2;
    const visibles = Math.max(1, Math.floor((util + gap + 2) / paso.current));
    const total = r.children.length;
    const pos = Math.max(1, total - visibles + 1);
    setDesborda(r.scrollWidth > r.clientWidth + 2);
    setPosiciones(pos);
    setActivo(Math.min(pos - 1, Math.max(0, Math.round(r.scrollLeft / paso.current))));
  }, []);

  useEffect(() => {
    medir();
    const r = riel.current;
    if (!r) return;
    const ro = new ResizeObserver(medir);
    ro.observe(r);
    r.addEventListener("scroll", medir, { passive: true });
    return () => {
      ro.disconnect();
      r.removeEventListener("scroll", medir);
    };
  }, [medir]);

  const ir = (i: number) => {
    const r = riel.current;
    if (!r) return;
    const destino = Math.max(0, Math.min(i, posiciones - 1));
    r.scrollTo({ left: destino * paso.current, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className={`vd-carrusel ${className}`.trim()}>
      <div ref={riel} className="vd-rail" role="group" aria-roledescription="carrusel" aria-label={etiqueta} tabIndex={0}>
        {children}
      </div>
      {desborda && (
        <div className="vd-controles" role="group" aria-label="Controles del carrusel">
          <button type="button" className="vd-circ" onClick={() => ir(activo - 1)} disabled={activo === 0} aria-label="Obras anteriores">
            <Icon name="left" size={22} />
          </button>
          <div className="vd-seg" role="group" aria-label="Posición">
            {Array.from({ length: posiciones }, (_, i) => (
              <button key={i} type="button" aria-current={i === activo ? "true" : undefined} aria-label={`Ir a la posición ${i + 1} de ${posiciones}`} className={i === activo ? "is-on" : ""} onClick={() => ir(i)} />
            ))}
          </div>
          <button type="button" className="vd-circ" onClick={() => ir(activo + 1)} disabled={activo >= posiciones - 1} aria-label="Obras siguientes">
            <Icon name="right" size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
