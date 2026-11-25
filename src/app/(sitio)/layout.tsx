import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PAGINAS } from "@/lib/sitio";

const ITEMS_NAV = PAGINAS.filter((p) => p.ruta !== "/").map((p) => ({ ruta: p.ruta, nav: p.nav }));

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <Header items={ITEMS_NAV} />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
