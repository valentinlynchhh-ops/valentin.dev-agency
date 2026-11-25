"use client";

import { useEffect } from "react";

/* Si la URL trae ?ref=CODIGO (código de un vendedor), lo guarda 30 días en una cookie para atribuir la consulta.
   Solo guarda códigos con el formato válido; no registra nada más. */
export function RefCapture() {
  useEffect(() => {
    const ref = new URLSearchParams(location.search).get("ref")?.toUpperCase();
    if (ref && /^[A-HJ-NP-Z2-9]{6}$/.test(ref)) document.cookie = `vd_ref=${ref}; max-age=${60 * 60 * 24 * 30}; path=/; samesite=lax`;
  }, []);
  return null;
}
