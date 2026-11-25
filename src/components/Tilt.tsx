"use client";

import { useEffect, useRef } from "react";
import { useMotionPermitido } from "./Motion";

/* Inclinación 3D según el puntero (solo con mouse, sin reduced motion ni pausa). Expone --rx, --ry, --mx y --my al CSS,
   que decide qué hacer con ellos. No mueve nada si no hay puntero fino: en táctil queda plano. */
export function Tilt({ children, className = "", max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const permitido = useMotionPermitido();

  useEffect(() => {
    const el = ref.current;
    if (!el || !permitido || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    const mover = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
        el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      });
    };
    const salir = () => {
      cancelAnimationFrame(raf);
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", salir);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", salir);
    };
  }, [permitido, max]);

  return (
    <div ref={ref} className={`vd-tilt ${className}`.trim()}>
      {children}
    </div>
  );
}
