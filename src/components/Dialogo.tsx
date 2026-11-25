"use client";

import { useRef } from "react";

/* Diálogo accesible con <dialog> nativo: foco inicial, Escape, cierre explícito y devolución de foco al botón que lo abrió. */
export function Dialogo({ etiqueta, clase = "btn btn-outline", titulo, children, icono }: { etiqueta: string; clase?: string; titulo: string; children: React.ReactNode; icono?: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = `dlg-${titulo.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <>
      <button type="button" className={clase} onClick={() => ref.current?.showModal()} aria-haspopup="dialog">
        {icono}
        {etiqueta}
      </button>
      <dialog data-lenis-prevent
        ref={ref}
        className="vd-dialog"
        aria-labelledby={id}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="vd-dialog__in">
          <div className="vd-dialog__head">
            <h2 id={id} className="h3">
              {titulo}
            </h2>
            <button type="button" className="vd-dialog__x" onClick={() => ref.current?.close()} aria-label="Cerrar">
              ✕
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
