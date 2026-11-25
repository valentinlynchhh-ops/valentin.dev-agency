"use client";

import { useState } from "react";
import { Flecha } from "./Marca";
import { validarPostulacion } from "@/lib/vendedores";

type Estado = "reposo" | "enviando" | "ok" | "error";
type Errores = Partial<Record<"nombre" | "contacto" | "motivo" | "acepta", string>>;

/* Postulación al programa de vendedores. Pide lo mínimo (sin datos financieros ni documentos) y avisa para qué se usan. */
export function PostularForm({ id = "p" }: { id?: string }) {
  const [estado, setEstado] = useState<Estado>("reposo");
  const [errores, setErrores] = useState<Errores>({});
  const [aviso, setAviso] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    const f = e.currentTarget;
    const fd = new FormData(f);
    const datos = { ...Object.fromEntries(fd.entries()), acepta: fd.get("acepta") === "on" };
    const previa = validarPostulacion(datos);
    if (!previa.ok && !previa.spam) {
      setErrores(previa.errores);
      setAviso("");
      f.querySelector<HTMLElement>(`[name="${Object.keys(previa.errores)[0]}"]`)?.focus();
      return;
    }
    setErrores({});
    setAviso("");
    setEstado("enviando");
    try {
      const r = await fetch("/api/vendedores", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(datos) });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; errores?: Errores; mensaje?: string };
      if (r.ok && j.ok) {
        setEstado("ok");
        return;
      }
      if (j.errores) setErrores(j.errores);
      setAviso(j.mensaje ?? "No pude enviar tu postulación. Probá de nuevo en un momento.");
      setEstado("error");
    } catch {
      setAviso("No hay conexión. Lo que escribiste sigue acá: probá de nuevo.");
      setEstado("error");
    }
  }

  if (estado === "ok")
    return (
      <div className="estado estado--ok" role="status">
        <p style={{ fontWeight: 800, fontSize: "1.3rem", fontStyle: "italic" }}>Recibí tu postulación.</p>
        <p style={{ marginTop: 6, fontWeight: 400 }}>La reviso y te respondo yo, por el medio que dejaste.</p>
      </div>
    );

  return (
    <form className="form" onSubmit={enviar} noValidate>
      <div className="field">
        <label htmlFor={`${id}-nombre`}>Tu nombre</label>
        <input id={`${id}-nombre`} name="nombre" className="input" autoComplete="name" required aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? `${id}-nombre-e` : undefined} />
        {errores.nombre && <p id={`${id}-nombre-e`} className="field-error">{errores.nombre}</p>}
      </div>
      <div className="field">
        <label htmlFor={`${id}-contacto`}>Mail o WhatsApp</label>
        <input id={`${id}-contacto`} name="contacto" className="input" autoComplete="email" inputMode="email" required aria-invalid={!!errores.contacto} aria-describedby={errores.contacto ? `${id}-contacto-e` : undefined} />
        {errores.contacto && <p id={`${id}-contacto-e`} className="field-error">{errores.contacto}</p>}
      </div>
      <div className="field">
        <label htmlFor={`${id}-motivo`}>¿Por qué te interesa y qué experiencia vendiendo tenés?</label>
        <textarea id={`${id}-motivo`} name="motivo" className="input" maxLength={1500} rows={4} required aria-invalid={!!errores.motivo} aria-describedby={errores.motivo ? `${id}-motivo-e` : undefined} />
        {errores.motivo && <p id={`${id}-motivo-e`} className="field-error">{errores.motivo}</p>}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-web`}>No completar</label>
        <input id={`${id}-web`} name="web" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field">
        <label className="vd-check">
          <input type="checkbox" name="acepta" aria-invalid={!!errores.acepta} aria-describedby={errores.acepta ? `${id}-acepta-e` : undefined} />
          <span>Acepto que Valentín use estos datos para responderme sobre el programa. No me piden datos financieros ni documentos.</span>
        </label>
        {errores.acepta && <p id={`${id}-acepta-e`} className="field-error">{errores.acepta}</p>}
      </div>
      {aviso && <p className="estado" role="alert">{aviso}</p>}
      <button type="submit" className="btn btn-primary" disabled={estado === "enviando"} aria-busy={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Enviar postulación"} <Flecha />
      </button>
    </form>
  );
}
