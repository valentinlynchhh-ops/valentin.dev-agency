import { Fragment, type ElementType, type ReactNode } from "react";

/* Titular cinético: cada palabra sube desde una máscara, escalonada (--i). La animación es CSS atada al scroll
   (animation-timeline: view()) o a la carga ("carga"); sin soporte queda todo visible. Se lee como texto normal. */
export function Split({ texto, as: Tag = "span", modo = "scroll", desde = 0, className = "" }: { texto: string; as?: ElementType; modo?: "scroll" | "carga"; desde?: number; className?: string }) {
  const palabras = texto.split(" ");
  return (
    <Tag className={`x-split x-split--${modo} ${className}`.trim()}>
      {palabras.map((p, i) => (
        <Fragment key={i}>
          <span className="x-w" style={{ ["--i" as string]: i + desde }}>
            <span>{p}</span>
          </span>
          {i < palabras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* Cinta que corre sin parar (CSS). El contenido se duplica y se oculta el duplicado a lectores de pantalla. */
export function Marquee({ children, inversa = false, className = "" }: { children: ReactNode; inversa?: boolean; className?: string }) {
  return (
    <div className={`x-marquee${inversa ? " x-marquee--inv" : ""} ${className}`.trim()} aria-hidden="true">
      <div className="x-marquee__t">
        <div>{children}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}
