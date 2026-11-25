import Link from "next/link";
import { Wordmark } from "@/components/Marca";
import { modoCRM } from "@/lib/crm";
import { salir } from "../acciones";
import { NavAdmin } from "./NavAdmin";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const modo = modoCRM();
  return (
    <>
      <header className="ad-top">
        <Link href="/admin" aria-label="Hoy" style={{ textDecoration: "none" }}>
          <Wordmark mono />
        </Link>
        <form action={salir}>
          <button type="submit" className="ad-salir">Salir</button>
        </form>
      </header>
      {modo === "memoria" && <p className="ad-aviso">Modo desarrollo: datos de ejemplo en memoria. No se guarda nada.</p>}
      <main className="ad-main">{children}</main>
      <NavAdmin />
    </>
  );
}
