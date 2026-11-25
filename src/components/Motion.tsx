"use client";

import { useEffect, useSyncExternalStore } from "react";

/* Sistema de motion: un solo lugar decide si hay animación continua.
   - Respeta prefers-reduced-motion (y escucha sus cambios).
   - Pausa manual persistente (localStorage, sin rastreo).
   - Pausa cuando la pestaña está oculta.
   Marca <html data-motion="on|paused"> y data-visible="true|false"; el CSS y los componentes leen eso. */

const CLAVE = "vd-motion";

function suscribir(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  document.addEventListener("visibilitychange", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
    document.removeEventListener("visibilitychange", cb);
  };
}
const permitido = () => document.documentElement.dataset.motion !== "paused" && !matchMedia("(prefers-reduced-motion: reduce)").matches && document.visibilityState === "visible";
const pausadoAhora = () => document.documentElement.dataset.motion === "paused";

/** ¿Hay que animar ahora? Falso con reduced motion, pausa manual o pestaña oculta. */
export function useMotionPermitido(): boolean {
  return useSyncExternalStore(suscribir, permitido, () => true);
}

/** Aplica la preferencia guardada al cargar. */
export function MotionRoot() {
  useEffect(() => {
    try {
      if (localStorage.getItem(CLAVE) === "paused") document.documentElement.dataset.motion = "paused";
    } catch {
      /* sin almacenamiento: queda activo */
    }
  }, []);
  return null;
}

/** Botón discreto «Pausar animaciones» (footer). */
export function MotionToggle() {
  const pausado = useSyncExternalStore(suscribir, pausadoAhora, () => false);
  return (
    <button
      type="button"
      aria-pressed={pausado}
      onClick={() => {
        const nuevo = !pausado;
        document.documentElement.dataset.motion = nuevo ? "paused" : "on";
        try {
          localStorage.setItem(CLAVE, nuevo ? "paused" : "on");
        } catch {
          /* ignorar */
        }
      }}
    >
      {pausado ? "Reanudar animaciones" : "Pausar animaciones"}
    </button>
  );
}
