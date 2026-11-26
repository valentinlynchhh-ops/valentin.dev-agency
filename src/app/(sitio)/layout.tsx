import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionRoot } from "@/components/Motion";
import Link from "next/link";
import { linkWhatsApp } from "@/lib/sitio";
import { RefCapture } from "@/components/RefCapture";
import { Experience } from "@/components/Experience";
import "lenis/dist/lenis.css";
import "../experiencia.css";

/* Navegación principal (maqueta aprobada): Proyectos, Servicios, Sobre mí, Recursos. Cada ítem tiene destino real. */
const NAV = [
  { href: "/#proyectos", etiqueta: "Proyectos" },
  { href: "/servicios", etiqueta: "Servicios" },
  { href: "/#sobre-mi", etiqueta: "Sobre mí" },
  { href: "/recursos", etiqueta: "Recursos" },
] as const;

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="inicio">
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <MotionRoot />
      <RefCapture />
      <Experience />
      <div className="x-progreso" aria-hidden="true" />
      <Header items={NAV} />
      <main id="contenido">{children}</main>
      <Footer />
      <nav className="x-barra" aria-label="Acciones rápidas">
        <Link href="/cotizar">Cotizar mi web</Link>
        {linkWhatsApp() && (
          <a href={linkWhatsApp()!} rel="noopener" className="x-barra__wa">
            WhatsApp
          </a>
        )}
      </nav>
    </div>
  );
}
