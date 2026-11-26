"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { nivelAlto, puntero } from "@/lib/perf";

/* Capa de experiencia (v3). Un solo componente cliente con:
   - scroll con inercia (Lenis) y barra de progreso (--sp en <html>);
   - puntero normalizado (--px, --py) para parallax y shader;
   - cursor propio, botones magnéticos ([data-mag]) y luz que sigue al mouse ([data-spot]);
   - progreso de las secciones fijadas ([data-pin] → --p, --dx) y de las que se recorren ([data-scrub] → --t);
   - contadores ([data-count]).
   Todo se apaga con reduced motion o con la pausa manual: queda un sitio normal, sin nada oculto. */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function Experience() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const fino = matchMedia("(hover: hover) and (pointer: fine)");
    const alto = nivelAlto();
    root.dataset.perf = alto ? "high" : "lite";
    const permitido = () => !reduce.matches && root.dataset.motion !== "paused";
    const progreso = document.querySelector<HTMLElement>(".x-progreso");
    const hero = document.querySelector<HTMLElement>(".x-hero");
    let lenis: Lenis | null = null;
    let raf = 0;
    let vivo = true;

    /* ---------- scroll con inercia ---------- */
    const iniciarLenis = () => {
      if (lenis || !alto || !permitido()) return;
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: { offset: -84 } });
      root.dataset.lenis = "on";
    };
    const pararLenis = () => {
      lenis?.destroy();
      lenis = null;
      delete root.dataset.lenis;
    };

    /* ---------- pin + scrub ---------- */
    const pines = Array.from(document.querySelectorAll<HTMLElement>("[data-pin]"));
    const scrubs = Array.from(document.querySelectorAll<HTMLElement>("[data-scrub]"));
    const contadores = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    let vw = innerWidth;
    let vh = innerHeight;

    const medir = () => {
      vw = innerWidth;
      vh = innerHeight;
      const fijar = alto && permitido() && vw >= 1024;
      root.dataset.pin = fijar ? "on" : "off";
      for (const el of pines) {
        const pista = el.querySelector<HTMLElement>("[data-pin-track]");
        if (!pista) continue;
        const dx = fijar ? Math.max(0, pista.scrollWidth - pista.clientWidth) : 0;
        el.style.setProperty("--dx", `${dx}px`);
      }
    };

    /* Solo se calculan las secciones que están cerca de la pantalla (IntersectionObserver) y la barra se escribe
       directo en su elemento: nada de variables en <html>, que invalidaría el estilo de todo el documento. */
    const cerca = new Set<HTMLElement>();
    const ioCerca = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) cerca.add(e.target as HTMLElement);
          else cerca.delete(e.target as HTMLElement);
        }
        alScroll();
      },
      { rootMargin: "30% 0px 30% 0px" },
    );
    [...pines, ...scrubs].forEach((el) => ioCerca.observe(el));
    let tick = 0;
    const alScroll = () => {
      if (tick) return;
      tick = requestAnimationFrame(() => {
        tick = 0;
        const total = root.scrollHeight - vh;
        if (progreso) progreso.style.transform = `scaleX(${total > 0 ? (scrollY / total).toFixed(4) : 0})`;
        for (const el of cerca) {
          const r = el.getBoundingClientRect();
          if (el.hasAttribute("data-pin")) {
            if (root.dataset.pin !== "on") continue;
            const largo = r.height - vh;
            el.style.setProperty("--p", (largo > 0 ? clamp(-r.top / largo) : 0).toFixed(4));
          } else {
            el.style.setProperty("--t", clamp((vh - r.top) / (vh + r.height)).toFixed(4));
          }
        }
      });
    };

    /* ---------- contadores ---------- */
    const vistos = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting || vistos.has(e.target)) continue;
          vistos.add(e.target);
          const el = e.target as HTMLElement;
          const fin = Number(el.dataset.count);
          if (!permitido() || !Number.isFinite(fin)) {
            el.textContent = String(fin);
            continue;
          }
          const t0 = performance.now();
          const dur = 1400;
          const paso = (t: number) => {
            const k = clamp((t - t0) / dur);
            el.textContent = String(Math.round(fin * (1 - Math.pow(1 - k, 4))));
            if (k < 1 && vivo) requestAnimationFrame(paso);
          };
          requestAnimationFrame(paso);
        }
      },
      { threshold: 0.6 },
    );
    contadores.forEach((c) => io.observe(c));

    /* Elementos que solo animan mientras se ven ([data-vivo] → data-in): en celular las vistas de las webs se recorren solas. */
    const ioVivo = new IntersectionObserver((es) => es.forEach((e) => ((e.target as HTMLElement).dataset.in = e.isIntersecting ? "1" : "0")), { threshold: 0.35 });
    document.querySelectorAll("[data-vivo]").forEach((el) => ioVivo.observe(el));

    /* ---------- puntero, cursor, magnético, luz ---------- */
    const cursor = document.getElementById("vd-cursor");
    let cx = -100;
    let cy = -100;
    let tx = -100;
    let ty = -100;
    const alMover = (e: PointerEvent) => {
      if (!alto || e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      puntero.x = e.clientX / vw;
      puntero.y = e.clientY / vh;
      if (hero && scrollY < vh) {
        hero.style.setProperty("--px", puntero.x.toFixed(3));
        hero.style.setProperty("--py", puntero.y.toFixed(3));
      }
      const t = e.target as Element | null;
      const sobre = t?.closest("a, button, summary, [data-cursor], input, textarea, select, label");
      cursor?.toggleAttribute("data-hover", !!sobre);
      const spot = t?.closest<HTMLElement>("[data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }
      const mag = t?.closest<HTMLElement>("[data-mag]");
      if (mag && permitido()) {
        const r = mag.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mag.style.setProperty("--mx", `${(dx * 0.22).toFixed(1)}px`);
        mag.style.setProperty("--my", `${(dy * 0.28).toFixed(1)}px`);
      }
    };
    const alSalir = (e: PointerEvent) => {
      const m = (e.target as Element | null)?.closest<HTMLElement>("[data-mag]");
      if (m) {
        m.style.removeProperty("--mx");
        m.style.removeProperty("--my");
      }
    };

    const ciclo = (t: number) => {
      if (!vivo) return;
      lenis?.raf(t);
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      if (cursor) cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(ciclo);
    };

    const aplicar = () => {
      if (permitido()) iniciarLenis();
      else pararLenis();
      root.dataset.cursor = alto && permitido() && fino.matches ? "on" : "off";
      medir();
      alScroll();
    };

    aplicar();
    if (alto) raf = requestAnimationFrame(ciclo);
    addEventListener("scroll", alScroll, { passive: true });
    addEventListener("resize", aplicar);
    addEventListener("pointermove", alMover, { passive: true });
    document.addEventListener("pointerout", alSalir);
    const mo = new MutationObserver(aplicar);
    mo.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    reduce.addEventListener("change", aplicar);
    const ro = new ResizeObserver(() => {
      medir();
      alScroll();
    });
    ro.observe(document.body);

    /* Si el foco entra a una tarjeta de la galería fijada (teclado), llevamos el scroll hasta ella. */
    const alFoco = (e: FocusEvent) => {
      if (root.dataset.pin !== "on") return;
      const card = (e.target as Element).closest<HTMLElement>("[data-pin] [data-pin-card]");
      const sec = card?.closest<HTMLElement>("[data-pin]");
      const pista = sec?.querySelector<HTMLElement>("[data-pin-track]");
      if (!card || !sec || !pista) return;
      const dx = Number.parseFloat(sec.style.getPropertyValue("--dx")) || 0;
      if (dx <= 0) return;
      const objetivo = clamp((card.offsetLeft - (pista.clientWidth - card.offsetWidth) / 2) / dx);
      const r = sec.getBoundingClientRect();
      const y = scrollY + r.top + objetivo * (r.height - vh);
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else scrollTo({ top: y });
    };
    document.addEventListener("focusin", alFoco);

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      removeEventListener("scroll", alScroll);
      removeEventListener("resize", aplicar);
      removeEventListener("pointermove", alMover);
      document.removeEventListener("pointerout", alSalir);
      document.removeEventListener("focusin", alFoco);
      mo.disconnect();
      ioCerca.disconnect();
      ioVivo.disconnect();
      cancelAnimationFrame(tick);
      ro.disconnect();
      io.disconnect();
      reduce.removeEventListener("change", aplicar);
      pararLenis();
      delete root.dataset.pin;
      delete root.dataset.cursor;
    };
  }, []);

  return <div id="vd-cursor" className="x-cursor" aria-hidden="true" />;
}
