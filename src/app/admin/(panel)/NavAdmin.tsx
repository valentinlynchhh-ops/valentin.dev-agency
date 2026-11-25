"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", etiqueta: "Hoy", activo: (p: string) => p === "/admin" },
  { href: "/admin/contactos", etiqueta: "Contactos", activo: (p: string) => p.startsWith("/admin/contactos") && p !== "/admin/contactos/nuevo" },
  { href: "/admin/contactos/nuevo", etiqueta: "Nuevo", activo: (p: string) => p === "/admin/contactos/nuevo" },
];

export function NavAdmin() {
  const p = usePathname();
  return (
    <nav className="ad-nav" aria-label="CRM">
      {ITEMS.map((i) => (
        <Link key={i.href} href={i.href} aria-current={i.activo(p) ? "page" : undefined}>
          {i.etiqueta}
        </Link>
      ))}
    </nav>
  );
}
