import { ETIQUETA_ESTADO, type Estado } from "@/lib/crmLogica";

/** Etiqueta de estado: rectangular; solo "nuevo" va en amarillo (la señal que pide acción). */
export function Pill({ estado }: { estado: Estado }) {
  return (
    <span className="ad-pill" data-estado={estado}>
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}
