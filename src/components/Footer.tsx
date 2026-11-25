import Link from "next/link";
import { Wordmark } from "./Marca";
import { PAGINAS, linkWhatsApp } from "@/lib/sitio";

export function Footer() {
  const wa = linkWhatsApp();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <Link href="/" aria-label="valentin.dev, inicio" style={{ textDecoration: "none" }}>
            <Wordmark mono />
          </Link>
          <p className="muted" style={{ maxWidth: "28em" }}>
            Diseño y desarrollo web para negocios de Argentina. Hablás directo conmigo.
          </p>
        </div>
        <nav aria-label="Secciones">
          <p className="label" style={{ marginBottom: 8 }}>Secciones</p>
          <ul>
            {PAGINAS.filter((p) => p.ruta !== "/").map((p) => (
              <li key={p.ruta}>
                <Link href={p.ruta}>{p.nav}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="label" style={{ marginBottom: 8 }}>Contacto</p>
          <ul>
            <li>
              <Link href="/contacto">Formulario de consulta</Link>
            </li>
            {wa && (
              <li>
                <a href={wa} rel="noopener">WhatsApp</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="container" style={{ marginTop: 40 }}>
        <p className="label">© {new Date().getFullYear()} valentin.dev · Argentina</p>
      </div>
    </footer>
  );
}
