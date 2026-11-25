import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionRoot } from "@/components/Motion";
import { RefCapture } from "@/components/RefCapture";

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
      <Header items={NAV} />
      <main id="contenido">{children}</main>
      <Footer />
    </div>
  );
}
