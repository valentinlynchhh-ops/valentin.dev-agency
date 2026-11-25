"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Flecha, Lockup } from "./Marca";

type Item = { href: string; etiqueta: string };

/* Header fijo: transparente sobre el hero, sólido al bajar. Menú hamburguesa accesible en móvil (Escape, foco, aria-expanded). */
export function Header({ items }: { items: readonly Item[] }) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [solido, setSolido] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const alScroll = () => setSolido(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    document.addEventListener("keydown", alTecla);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTecla);
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  const actual = (href: string) => (!href.includes("#") && pathname === href ? "page" : undefined);

  return (
    <header className={`header${solido || abierto ? " is-solid" : ""}`}>
      <div className="header__in">
        <Link href="/" aria-label="valentin.dev, inicio" onClick={() => setAbierto(false)} style={{ textDecoration: "none" }}>
          <Lockup />
        </Link>
        <nav className="nav" aria-label="Principal">
          {items.map((it) => (
            <Link key={it.href} href={it.href} aria-current={actual(it.href)}>
              {it.etiqueta}
            </Link>
          ))}
        </nav>
        <Link href="/#contacto" className="btn btn-primary header__cta">
          Hablemos <Flecha />
        </Link>
        <button ref={boton} type="button" className="menu-btn" aria-expanded={abierto} aria-controls="menu-movil" onClick={() => setAbierto((v) => !v)}>
          {abierto ? "Cerrar" : "Menú"}
        </button>
      </div>
      {abierto && (
        <nav id="menu-movil" className="menu-panel" aria-label="Menú">
          {items.map((it) => (
            <Link key={it.href} href={it.href} aria-current={actual(it.href)} onClick={() => setAbierto(false)}>
              {it.etiqueta}
            </Link>
          ))}
          <Link href="/cotizar" onClick={() => setAbierto(false)}>
            Cotizar
          </Link>
          <Link href="/#contacto" className="btn btn-primary" onClick={() => setAbierto(false)}>
            Hablemos <Flecha />
          </Link>
        </nav>
      )}
    </header>
  );
}
