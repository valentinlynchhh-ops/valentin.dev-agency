import Image from "next/image";

/** Lockup de marca: monograma original (amarillo, con los dos píxeles) + «valentin.dev» en blanco. Sin ®, sin caja extra. */
export function Lockup({ tam = "md", className = "" }: { tam?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span className={`lockup${tam === "md" ? "" : ` lockup--${tam}`} ${className}`.trim()} role="img" aria-label="valentin.dev">
      <Image src="/brand/monogram.png" alt="" width={320} height={190} priority={tam === "md"} aria-hidden="true" />
      <span aria-hidden="true">valentin.dev</span>
    </span>
  );
}

/** Compatibilidad: el CRM y las páginas internas importan Wordmark. */
export function Wordmark({ className = "" }: { mono?: boolean; className?: string }) {
  return <Lockup tam="sm" className={className} />;
}

/** Flecha noreste de brazos ortogonales y terminaciones rectas. */
export function Flecha({ className = "arrow" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 16 16 4M6 4h10v10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="butt" strokeLinejoin="miter" />
    </svg>
  );
}
