import Image from "next/image";
import Link from "next/link";
import { TRABAJOS } from "@/lib/sitio";
import { Flecha } from "./Marca";
import { Split } from "./Split";

/* El museo en la home: en escritorio la sección queda fijada y las obras pasan de costado con el scroll;
   al apoyar el mouse, la web real se recorre dentro del marco. En celular y con reduced motion es un carrusel
   con scroll táctil (mismo HTML, el CSS decide). El progreso lo calcula Experience.tsx (--p, --dx). */
export function Galeria() {
  return (
    <section id="proyectos" className="x-gal" data-pin aria-labelledby="t-proy">
      <div className="x-gal__stage">
        <div className="x-gal__head">
          <p className="label">Museo de trabajos · {TRABAJOS.length} obras reales</p>
          <h2 id="t-proy" className="x-h2">
            <Split texto="De la idea a la realidad." />
          </h2>
        </div>
        <div className="x-gal__track" data-pin-track tabIndex={-1}>
          {TRABAJOS.map((t, i) => (
            <article key={t.id} className="x-obra" data-pin-card data-spot>
              <a className="x-obra__marco" href={t.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.nombre}: visitar ${t.host} (se abre en otra pestaña)`} data-cursor>
                <span className="x-obra__barra" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <b>{t.host}</b>
                </span>
                <span className="x-obra__vista">
                  <Image src={`/trabajos/${t.id}-largo.jpg`} alt={t.altImagen} width={585} height={3600} sizes="(min-width: 1024px) 28vw, 80vw" priority={i === 0} />
                </span>
                <span className="x-obra__ver" aria-hidden="true">
                  Recorrer la web
                </span>
              </a>
              <div className="x-obra__cartela">
                <span className="label">Sala 0{i + 1}</span>
                <h3>
                  <a href={t.url} target="_blank" rel="noopener noreferrer">
                    {t.nombre} <Flecha />
                  </a>
                </h3>
                <p>{t.corta}</p>
              </div>
            </article>
          ))}
          <article className="x-obra x-obra--vacia" data-pin-card>
            <Link href="/#contacto" className="x-obra__vacio" data-cursor>
              <span className="label">Próxima sala</span>
              <b>Tu proyecto</b>
              <span>El próximo en entrar al museo podés ser vos.</span>
            </Link>
          </article>
        </div>
        <div className="x-gal__pie">
          <span className="x-gal__prog" aria-hidden="true">
            <i />
          </span>
          <Link href="/museo" className="btn btn-outline">
            Recorré el museo completo <Flecha />
          </Link>
        </div>
      </div>
    </section>
  );
}
