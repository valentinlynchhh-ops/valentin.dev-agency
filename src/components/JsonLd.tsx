import { ldDePagina } from "@/lib/seo";

/** JSON-LD de una página, generado desde las fuentes de verdad. */
export function JsonLd({ ruta }: { ruta: string }) {
  return (
    <>
      {ldDePagina(ruta).map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Contenido propio y serializado: escapamos "<" para que no cierre el script.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
