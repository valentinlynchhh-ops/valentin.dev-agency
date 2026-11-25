import Link from "next/link";
import { Icon } from "./Icon";
import { Lockup } from "./Marca";
import { HorizonScene } from "./Horizon";
import { MotionToggle } from "./Motion";
import { Flecha } from "./Marca";
import { EMAIL_PUBLICO, WHATSAPP_VISIBLE, linkWhatsApp } from "@/lib/sitio";
import { HighlightText } from "./HighlightText";

/** Cierre + footer (#footer): H2 de cierre con el mismo CTA, y grilla de 4 columnas con datos reales. */
export function Footer({ conCierre = true }: { conCierre?: boolean }) {
  const wa = linkWhatsApp();
  return (
    <footer id="footer" className="footer">
      <HorizonScene variante="final" id="fin" />
      {conCierre && (
        <section className="vd-cierre" aria-labelledby="t-cierre">
          <h2 id="t-cierre" className="vd-h2 vd-cierre__h">
            <span>Hagamos algo que</span>{" "}
            <span className="vd-nowrap">
              <HighlightText>valga la pena.</HighlightText>
            </span>
          </h2>
          <p className="vd-cierre__p">Contame qué tenés en mente. Yo me encargo de hacerlo realidad.</p>
          <Link href="/#contacto" className="btn btn-primary vd-btn-xl">
            Hablemos de tu proyecto <Flecha />
          </Link>
        </section>
      )}
      <div className="footer__in">
        <hr className="footer__line" />
        <div className="footer__grid">
          <div>
            <Link href="/" aria-label="valentin.dev, inicio" style={{ textDecoration: "none" }}>
              <Lockup tam="lg" />
            </Link>
            <p className="footer__tag">Diseño y desarrollo digital independiente.</p>
          </div>
          <div>
            <nav aria-label="Secciones">
              <ul>
                <li><Link href="/#proyectos">Proyectos</Link></li>
                <li><Link href="/servicios">Servicios</Link></li>
                <li><Link href="/#sobre-mi">Sobre mí</Link></li>
                <li><Link href="/vendedores">Vendedores</Link></li>
              </ul>
            </nav>
          </div>
          <div>
            <ul aria-label="Contacto">
              <li>
                <a href={`mailto:${EMAIL_PUBLICO}`}>
                  <Icon name="mail" className="footer__ico" />
                  {EMAIL_PUBLICO}
                </a>
              </li>
              {wa && (
                <li>
                  <a href={wa} rel="noopener">
                    <Icon name="whatsapp" className="footer__ico" />
                    {WHATSAPP_VISIBLE}
                  </a>
                </li>
              )}
              <li>
                <span style={{ display: "inline-flex", gap: 12, alignItems: "center", minHeight: 40 }}>
                  <Icon name="pin" className="footer__ico" />
                  Argentina
                </span>
              </li>
            </ul>
          </div>
          <div>
            <nav aria-label="Más">
              <ul>
                <li><Link href="/cotizar">Cotizar mi web</Link></li>
                <li><Link href="/museo">Museo de trabajos</Link></li>
                <li><Link href="/precios">Precios</Link></li>
                <li><Link href="/como-trabajamos">Cómo trabajo</Link></li>
                <li><Link href="/preguntas-frecuentes">Preguntas</Link></li>
                <li><Link href="/recursos">Recursos</Link></li>
              </ul>
            </nav>
          </div>
        </div>
        <hr className="footer__line" />
        <div className="footer__legal">
          <span>© {new Date().getFullYear()} valentin.dev</span>
          <MotionToggle />
          <a href="#inicio" style={{ minHeight: 44 }}>
            Volver arriba ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
