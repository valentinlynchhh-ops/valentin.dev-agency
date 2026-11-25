"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionPermitido } from "./Motion";

/* Texto resaltado con inversión real de letras. El texto accesible aparece UNA vez (capa base, blanca); encima va una copia
   aria-hidden en negro sobre el amarillo, recortada con clip-path. Al barrer, la franja amarilla y las letras negras se
   recortan juntas: el color cambia exactamente donde pasa el amarillo.
   Cadencia: al entrar en pantalla (umbral 45 %) y luego cada 5 s mientras sea visible. Sin JS o con reduced motion/pausa
   queda el estado final estático (negro sobre amarillo). */
export function HighlightText({ children, className = "", repetirMs = 5000 }: { children: string; className?: string; repetirMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [barrido, setBarrido] = useState(false);
  const permitido = useMotionPermitido();
  const visible = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !permitido) {
      setBarrido(false);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const lanzar = () => {
      if (!visible.current) return;
      setBarrido(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setBarrido(true)));
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (timer) clearInterval(timer);
        timer = undefined;
        if (e.isIntersecting) {
          lanzar();
          timer = setInterval(lanzar, repetirMs);
        } else setBarrido(false);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [permitido, repetirMs]);

  return (
    <span ref={ref} className={`vd-highlight ${className}`.trim()} data-sweep={barrido ? "true" : "false"} onAnimationEnd={() => setBarrido(false)}>
      <span>{children}</span>
      <span aria-hidden="true" className="vd-highlight-ink">
        {children}
      </span>
    </span>
  );
}
