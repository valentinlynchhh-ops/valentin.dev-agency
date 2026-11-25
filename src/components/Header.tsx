"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Flecha, Wordmark } from "./Marca";

type Item = { ruta: string; nav: string };

export function Header({ items }: { items: readonly Item[] }) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

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

  const actual = (ruta: string) => (pathname === ruta ? "page" : undefined);

  return (
    <header className="header">
      <div className="container header__in">
        <Link href="/" aria-label="valentin.dev, inicio" onClick={() => setAbierto(false)} style={{ textDecoration: "none" }}>
          <Wordmark />
        </Link>
        <nav className="nav" aria-label="Principal">
          {items.map((it) => (
            <Link key={it.ruta} href={it.ruta} aria-current={actual(it.ruta)}>
              {it.nav}
            </Link>
          ))}
          <Link href="/contacto" className="btn btn-primary" style={{ minHeight: 44, padding: "8px 18px" }}>
            Hablemos <Flecha />
          </Link>
        </nav>
        <button
          ref={boton}
          type="button"
          className="menu-btn"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((v) => !v)}
        >
          {abierto ? "Cerrar" : "Menú"}
        </button>
      </div>
      {abierto && (
        <nav id="menu-movil" className="menu-panel" aria-label="Menú">
          {items.map((it) => (
            <Link key={it.ruta} href={it.ruta} aria-current={actual(it.ruta)} onClick={() => setAbierto(false)}>
              {it.nav}
            </Link>
          ))}
          <Link href="/contacto" className="btn btn-primary" onClick={() => setAbierto(false)}>
            Hablemos <Flecha />
          </Link>
        </nav>
      )}
    </header>
  );
}
