"use client";

import { useRef, useState } from "react";
import { Flecha } from "./Marca";
import { TIPOS_CONSULTA } from "@/lib/sitio";
import { validarConsulta } from "@/lib/consulta";

type Estado = "reposo" | "enviando" | "ok" | "error";
type Errores = Partial<Record<"nombre" | "contacto" | "tipo" | "mensaje", string>>;

export function FormularioConsulta({ origen = "/" }: { origen?: string }) {
  const [estado, setEstado] = useState<Estado>("reposo");
  const [errores, setErrores] = useState<Errores>({});
  const [aviso, setAviso] = useState("");
  const form = useRef<HTMLFormElement>(null);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    const datos = Object.fromEntries(new FormData(e.currentTarget).entries());
    const previa = validarConsulta({ ...datos, origen });
    if (!previa.ok && !previa.spam) {
      setErrores(previa.errores);
      setEstado("reposo");
      setAviso("");
      const primero = Object.keys(previa.errores)[0];
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
      return;
    }
    setErrores({});
    setEstado("enviando");
    setAviso("");
    try {
      const r = await fetch("/api/consulta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...datos, origen }),
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; errores?: Errores; mensaje?: string };
      if (r.ok && j.ok) {
        setEstado("ok");
        form.current?.reset();
        return;
      }
      if (j.errores) setErrores(j.errores);
      setAviso(j.mensaje ?? "No pude enviar tu consulta. Probá de nuevo en un momento.");
      setEstado("error");
    } catch {
      setAviso("No hay conexión. Revisá tu internet y probá de nuevo. Lo que escribiste sigue acá.");
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div className="estado estado--ok" role="status">
        <p style={{ fontWeight: 700, fontSize: "1.25rem" }}>Recibí tu consulta.</p>
        <p style={{ fontWeight: 400, marginTop: 6 }}>Te respondo yo, por el medio que dejaste.</p>
      </div>
    );
  }

  const id = (n: string) => `consulta-${n}`;
  return (
    <form ref={form} className="form" onSubmit={enviar} noValidate aria-describedby={aviso ? id("aviso") : undefined}>
      <div className="field">
        <label htmlFor={id("nombre")}>Tu nombre</label>
        <input id={id("nombre")} name="nombre" className="input" autoComplete="name" required aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? id("nombre-e") : undefined} />
        {errores.nombre && <p id={id("nombre-e")} className="field-error">{errores.nombre}</p>}
      </div>
      <div className="field">
        <label htmlFor={id("contacto")}>Mail o WhatsApp</label>
        <input id={id("contacto")} name="contacto" className="input" autoComplete="email" inputMode="email" required aria-invalid={!!errores.contacto} aria-describedby={errores.contacto ? id("contacto-e") : undefined} />
        {errores.contacto && <p id={id("contacto-e")} className="field-error">{errores.contacto}</p>}
      </div>
      <div className="field">
        <label htmlFor={id("tipo")}>¿Qué necesitás?</label>
        <select id={id("tipo")} name="tipo" className="input" required defaultValue="" aria-invalid={!!errores.tipo} aria-describedby={errores.tipo ? id("tipo-e") : undefined}>
          <option value="" disabled>Elegí una opción</option>
          {TIPOS_CONSULTA.map((t) => (
            <option key={t.valor} value={t.valor}>{t.etiqueta}</option>
          ))}
        </select>
        {errores.tipo && <p id={id("tipo-e")} className="field-error">{errores.tipo}</p>}
      </div>
      <div className="field">
        <label htmlFor={id("mensaje")}>Contame en pocas líneas <span className="opt">(opcional)</span></label>
        <textarea id={id("mensaje")} name="mensaje" className="input" maxLength={2000} />
      </div>
      {/* Honeypot: oculto para personas, los robots lo completan. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id("web")}>No completar</label>
        <input id={id("web")} name="web" tabIndex={-1} autoComplete="off" />
      </div>
      {aviso && (
        <p id={id("aviso")} className="estado" role="alert">{aviso}</p>
      )}
      <button type="submit" className="btn btn-primary" disabled={estado === "enviando"} aria-busy={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Enviar consulta"} <Flecha />
      </button>
    </form>
  );
}
