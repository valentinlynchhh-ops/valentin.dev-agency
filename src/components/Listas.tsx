import Image from "next/image";
import { CATALOGO, precioTexto } from "@/lib/catalogo";
import { SERVICIOS_DETALLE, TRABAJOS } from "@/lib/sitio";
import { Flecha } from "./Marca";

export function TrabajosLista({ variante = "home", prioridad = false }: { variante?: "home" | "full"; prioridad?: boolean }) {
  return (
    <div className={`trabajos trabajos--${variante}`}>
      {TRABAJOS.map((t, i) => (
        <article key={t.id} className="trabajo">
          <a href={t.url} target="_blank" rel="noopener" className="trabajo__img" aria-label={`Ver ${t.nombre} en ${t.host} (se abre en otra pestaña)`}>
            <Image
              src={t.imagenEscritorio}
              alt={t.altImagen}
              width={1440}
              height={900}
              sizes={variante === "full" ? "(min-width: 900px) 58vw, 100vw" : i === 0 ? "(min-width: 900px) 58vw, 100vw" : "(min-width: 900px) 40vw, 100vw"}
              priority={prioridad && i === 0}
            />
          </a>
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            <div className="trabajo__meta">
              <h3 className="h3">{t.nombre}</h3>
              <span className="label">{t.categoria}</span>
            </div>
            <p className="muted">{t.descripcion}</p>
            {variante === "full" && (
              <ul aria-label={`Qué incluye ${t.nombre}`}>
                {t.incluye.map((x) => (
                  <li key={x} className="tag">{x}</li>
                ))}
              </ul>
            )}
            <a href={t.url} target="_blank" rel="noopener" className="link-text">
              {t.host} <Flecha className="arrow" />
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PreciosLista() {
  return (
    <div>
      {CATALOGO.map((s) => {
        const d = SERVICIOS_DETALLE.find((x) => x.id === s.id);
        return (
          <div key={s.id} className="precio-fila">
            <div>
              <h3 className="h3">{s.nombre}</h3>
              <p className="muted" style={{ marginTop: 6 }}>{s.resumen}</p>
            </div>
            <p className="precio-monto">{precioTexto(s)}</p>
            <p className="muted">{d?.nota ?? ""}</p>
          </div>
        );
      })}
    </div>
  );
}
