import { CATALOGO, precioTexto } from "@/lib/catalogo";
import { SERVICIOS_DETALLE } from "@/lib/sitio";

export function PreciosLista({ nivel = "h3" }: { nivel?: "h2" | "h3" }) {
  const Titulo = nivel;
  return (
    <div>
      {CATALOGO.map((s) => {
        const d = SERVICIOS_DETALLE.find((x) => x.id === s.id);
        return (
          <div key={s.id} className="precio-fila">
            <div>
              <Titulo className="h3">{s.nombre}</Titulo>
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
