"use client";

import { useEffect } from "react";
import Lenis from "lenis";

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
    const permitido = () => !reduce.matches && root.dataset.motion !== "paused";
    let lenis: Lenis | null = null;
    let raf = 0;
    let vivo = true;

    /* ---------- scroll con inercia ---------- */
    const iniciarLenis = () => {
      if (lenis || !permitido()) return;
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
      const fijar = permitido() && vw >= 1024 && fino.matches;
      root.dataset.pin = fijar ? "on" : "off";
      for (const el of pines) {
        const pista = el.querySelector<HTMLElement>("[data-pin-track]");
        if (!pista) continue;
        const dx = fijar ? Math.max(0, pista.scrollWidth - pista.clientWidth) : 0;
        el.style.setProperty("--dx", `${dx}px`);
      }
    };

    const alScroll = () => {
      const y = scrollY;
      const total = root.scrollHeight - vh;
      root.style.setProperty("--sp", total > 0 ? (y / total).toFixed(4) : "0");
      root.style.setProperty("--sy", String(Math.round(y)));
      if (root.dataset.pin === "on") {
        for (const el of pines) {
          const r = el.getBoundingClientRect();
          const largo = r.height - vh;
          el.style.setProperty("--p", (largo > 0 ? clamp(-r.top / largo) : 0).toFixed(4));
        }
      }
      for (const el of scrubs) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--t", clamp((vh - r.top) / (vh + r.height)).toFixed(4));
      }
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

    /* ---------- puntero, cursor, magnético, luz ---------- */
    const cursor = document.getElementById("vd-cursor");
    let cx = -100;
    let cy = -100;
    let tx = -100;
    let ty = -100;
    const alMover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      root.style.setProperty("--px", (e.clientX / vw).toFixed(3));
      root.style.setProperty("--py", (e.clientY / vh).toFixed(3));
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
      root.dataset.cursor = permitido() && fino.matches ? "on" : "off";
      medir();
      alScroll();
    };

    aplicar();
    raf = requestAnimationFrame(ciclo);
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
