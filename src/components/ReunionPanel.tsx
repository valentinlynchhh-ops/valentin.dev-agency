"use client";

import { useState } from "react";
import { Flecha, Lockup } from "./Marca";
import { validarConsulta } from "@/lib/consulta";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie"] as const;
const FRANJAS = ["Mañana", "Tarde", "Cuando puedas"] as const;
type Estado = "reposo" | "enviando" | "ok" | "error";
type Errores = Partial<Record<"nombre" | "contacto" | "tipo" | "mensaje", string>>;

/* Pedido de reunión. No hay calendario conectado, así que NO muestra horarios inventados: el visitante elige cuándo le
   viene bien y yo se lo confirmo. «Solicitar» ≠ «reservar»: la confirmación es real solo cuando el servidor guardó el pedido. */
export function ReunionPanel({ origen = "/" }: { origen?: string }) {
  const [dia, setDia] = useState<string>("");
  const [franja, setFranja] = useState<string>("Cuando puedas");
  const [estado, setEstado] = useState<Estado>("reposo");
  const [errores, setErrores] = useState<Errores>({});
  const [aviso, setAviso] = useState("");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    const f = e.currentTarget;
    const datos = Object.fromEntries(new FormData(f).entries());
    const preferencia = [dia, franja].filter(Boolean).join(" · ");
    const cuerpo = { ...datos, tipo: "reunion", preferencia, origen };
    const previa = validarConsulta(cuerpo);
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
      const r = await fetch("/api/consulta", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(cuerpo) });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; errores?: Errores; mensaje?: string };
      if (r.ok && j.ok) {
        setEstado("ok");
        return;
      }
      if (j.errores) setErrores(j.errores);
      setAviso(j.mensaje ?? "No pude enviar tu pedido. Probá de nuevo en un momento.");
      setEstado("error");
    } catch {
      setAviso("No hay conexión. Lo que escribiste sigue acá: probá de nuevo.");
      setEstado("error");
    }
  }

  return (
    <div className="vd-panel vd-panel--agenda">
      <div className="vd-panel__in">
        <Lockup tam="sm" />
        <h3 className="vd-panel__t">Pedí una reunión</h3>
        {estado === "ok" ? (
          <div className="estado estado--ok" role="status">
            <p style={{ fontWeight: 800, fontSize: "1.3rem", fontStyle: "italic" }}>Recibí tu pedido.</p>
            <p style={{ marginTop: 6, fontWeight: 400 }}>Te confirmo el horario por el medio que dejaste.</p>
          </div>
        ) : (
          <form className="vd-form" onSubmit={enviar} noValidate>
            <fieldset className="vd-chips">
              <legend>¿Qué día te viene bien?</legend>
              <div>
                {DIAS.map((d) => (
                  <label key={d}>
                    <input type="radio" name="dia" value={d} checked={dia === d} onChange={() => setDia(d)} />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="vd-chips">
              <legend>¿En qué franja?</legend>
              <div>
                {FRANJAS.map((x) => (
                  <label key={x}>
                    <input type="radio" name="franja" value={x} checked={franja === x} onChange={() => setFranja(x)} />
                    <span>{x}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="vd-duo">
              <div className="field">
                <label htmlFor="r-nombre">Tu nombre</label>
                <input id="r-nombre" name="nombre" className="input" autoComplete="name" required aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? "r-nombre-e" : undefined} />
                {errores.nombre && <p id="r-nombre-e" className="field-error">{errores.nombre}</p>}
              </div>
              <div className="field">
                <label htmlFor="r-contacto">Mail o WhatsApp</label>
                <input id="r-contacto" name="contacto" className="input" autoComplete="email" inputMode="email" required aria-invalid={!!errores.contacto} aria-describedby={errores.contacto ? "r-contacto-e" : undefined} />
                {errores.contacto && <p id="r-contacto-e" className="field-error">{errores.contacto}</p>}
              </div>
            </div>
            <div className="field">
              <label htmlFor="r-mensaje">Tu idea o problema <span className="opt">(opcional)</span></label>
              <textarea id="r-mensaje" name="mensaje" className="input" maxLength={2000} rows={3} />
            </div>
            <div className="hp" aria-hidden="true">
              <label htmlFor="r-web">No completar</label>
              <input id="r-web" name="web" tabIndex={-1} autoComplete="off" />
            </div>
            {aviso && <p className="estado" role="alert">{aviso}</p>}
            <button type="submit" className="btn btn-primary" disabled={estado === "enviando"} aria-busy={estado === "enviando"}>
              {estado === "enviando" ? "Enviando…" : "Solicitar reunión"} <Flecha />
            </button>
            <p className="vd-nota">Es un pedido, no una reserva: te confirmo yo el horario. Hora de Argentina.</p>
          </form>
        )}
      </div>
    </div>
  );
}
