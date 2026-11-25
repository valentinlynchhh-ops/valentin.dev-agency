/** Wordmark y motivos gráficos de valentin.dev (design.md §3 y §5). CSS/SVG, sin librerías. */

export function Wordmark({ mono = false, className = "" }: { mono?: boolean; className?: string }) {
  return (
    <span className={`wm${mono ? " wm--mono" : ""} ${className}`.trim()} role="img" aria-label="valentin.dev">
      <span aria-hidden="true">valentin</span>
      <span className="wm__b" aria-hidden="true">
        <span>.dev</span>
      </span>
    </span>
  );
}

/** Flecha noreste de brazos ortogonales y terminaciones rectas. */
export function Flecha({ className = "arrow" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 16 16 4M6 4h10v10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="butt" strokeLinejoin="miter" />
    </svg>
  );
}

/** Escalera modular: bloques cuadrados unidos, sin esquinas redondeadas. Único motivo del hero. */
export function Escalera({ className = "escalera" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 50 50" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M0 50V40h10V30h10V20h10V10h10V0h10v50z" />
    </svg>
  );
}
