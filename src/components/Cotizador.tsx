"use client";

import { useMemo, useRef, useState } from "react";
import { CATALOGO, precioTexto } from "@/lib/catalogo";
import { FUNCIONES, PAGINAS_APROX, PLAZOS, RUBROS, armarCotizacion, resumenTexto, type FuncionId, type Seleccion } from "@/lib/cotizador";
import { EMAIL_PUBLICO, linkWhatsApp } from "@/lib/sitio";
import { Flecha } from "./Marca";
import { Icon } from "./Icon";

type Servicio = Seleccion["servicio"];
type Estado = "reposo" | "enviando" | "ok" | "error";
const PASOS = ["Tipo de web", "Tu negocio", "Funciones", "Detalles y envío"] as const;

const INICIAL: Seleccion = { servicio: "web", rubro: "", funciones: [], paginas: "2-5", materiales: "ayuda", referencias: "", plazo: "mes" };

/* Armador de la web. El precio que se ve es SIEMPRE el base del catálogo; lo que no tiene precio definido figura como
   «a evaluar» y se confirma en la propuesta. Envía a /api/cotizacion (guarda y avisa). Sin base responde con aviso honesto. */
export function Cotizador() {
  const [paso, setPaso] = useState(0);
  const [sel, setSel] = useState<Seleccion>(INICIAL);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState<Estado>("reposo");
  const [error, setError] = useState("");
  const [errCampos, setErrCampos] = useState<Record<string, string>>({});
  const raiz = useRef<HTMLDivElement>(null);

  const cot = useMemo(() => armarCotizacion(sel), [sel]);
  const funcionesDisponibles = FUNCIONES.filter((f) => f.para.includes(sel.servicio));
  const incluidas = new Set(cot.incluidas);

  const set = <K extends keyof Seleccion>(k: K, v: Seleccion[K]) => setSel((s) => ({ ...s, [k]: v }));
  const cambiarServicio = (id: Servicio) => setSel((s) => ({ ...s, servicio: id, funciones: s.funciones.filter((f) => FUNCIONES.find((x) => x.id === f)?.para.includes(id)) }));
  const alternar = (id: FuncionId) => setSel((s) => ({ ...s, funciones: s.funciones.includes(id) ? s.funciones.filter((x) => x !== id) : [...s.funciones, id] }));

  function ir(n: number) {
    setPaso(n);
    setError("");
    raiz.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  function siguiente() {
    if (paso === 1 && !sel.rubro) {
      setError("Elegí tu rubro para seguir.");
      return;
    }
    ir(paso + 1);
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (estado === "enviando") return;
    const f = e.currentTarget;
    const web = (new FormData(f).get("web") as string) ?? "";
    const faltan: Record<string, string> = {};
    if (nombre.trim().length < 2) faltan.nombre = "Escribí tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contacto.trim()) && !(/^[\d\s+()\-.]+$/.test(contacto) && contacto.replace(/\D/g, "").length >= 8)) faltan.contacto = "Pasame un mail o un WhatsApp para responderte.";
    setErrCampos(faltan);
    if (Object.keys(faltan).length) {
      f.querySelector<HTMLElement>(`[name="${Object.keys(faltan)[0]}"]`)?.focus();
      return;
    }
    setEstado("enviando");
    setError("");
    try {
      const r = await fetch("/api/cotizacion", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ seleccion: sel, nombre, contacto, mensaje, web }) });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; mensaje?: string };
      if (r.ok && j.ok) {
        setEstado("ok");
        raiz.current?.scrollIntoView({ block: "start" });
        return;
      }
      setError(j.mensaje ?? "No pude enviar el pedido. Probá de nuevo en un momento.");
      setEstado("error");
    } catch {
      setError("No hay conexión. Lo que armaste sigue acá: probá de nuevo.");
      setEstado("error");
    }
  }

  const wa = linkWhatsApp(`Hola Valentín, armé mi web en el cotizador:\n\n${resumenTexto(sel, cot)}`);

  if (estado === "ok")
    return (
      <div ref={raiz} className="cot-ok vd-card">
        <Icon name="check" size={40} />
        <h2 className="h2" style={{ fontSize: "clamp(2rem,4vw,3.4rem)" }}>Recibí tu pedido.</h2>
        <p className="lead">Te respondo yo con la propuesta y el alcance. Esto es lo que me llegó:</p>
        <pre className="cot-resumen">{resumenTexto(sel, cot)}</pre>
        <div className="vd-actions" style={{ justifyContent: "flex-start" }}>
          {wa && (
            <a href={wa} className="btn btn-primary" rel="noopener" target="_blank">
              Escribirme por WhatsApp <Flecha />
            </a>
          )}
          <a href={`mailto:${EMAIL_PUBLICO}`} className="btn btn-outline">Mandar un mail</a>
        </div>
      </div>
    );

  return (
    <div ref={raiz} className="cot">
      <ol className="cot-pasos" aria-label="Progreso">
        {PASOS.map((p, i) => (
          <li key={p} aria-current={i === paso ? "step" : undefined} className={i < paso ? "is-hecho" : i === paso ? "is-on" : ""}>
            <button type="button" onClick={() => i < paso && ir(i)} disabled={i >= paso} aria-label={`Paso ${i + 1}: ${p}${i < paso ? " (volver)" : ""}`}>
              <span>{i + 1}</span> {p}
            </button>
          </li>
        ))}
      </ol>

      <div className="cot-grid">
        <form className="cot-form" onSubmit={enviar} noValidate>
          {paso === 0 && (
            <fieldset className="cot-set">
              <legend className="h3">¿Qué necesitás?</legend>
              <div className="cot-opciones">
                {CATALOGO.map((s) => (
                  <label key={s.id} className="cot-op">
                    <input type="radio" name="servicio" value={s.id} checked={sel.servicio === s.id} onChange={() => cambiarServicio(s.id)} />
                    <span className="cot-op__in">
                      <b>{s.nombre}</b>
                      <small>{s.resumen}</small>
                      <em>{precioTexto(s)}</em>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {paso === 1 && (
            <div className="cot-set">
              <h3 className="h3">Contame de tu negocio</h3>
              <div className="field">
                <label htmlFor="c-rubro">Rubro</label>
                <select id="c-rubro" className="input" value={sel.rubro} onChange={(e) => set("rubro", e.target.value)} aria-invalid={!!error && !sel.rubro}>
                  <option value="" disabled>Elegí tu rubro</option>
                  {RUBROS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <fieldset className="vd-chips">
                <legend>¿Cuántas páginas más o menos?</legend>
                <div>
                  {PAGINAS_APROX.map((p) => (
                    <label key={p.valor}>
                      <input type="radio" name="paginas" value={p.valor} checked={sel.paginas === p.valor} onChange={() => set("paginas", p.valor)} />
                      <span>{p.etiqueta}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="vd-chips">
                <legend>Logo y fotos</legend>
                <div>
                  <label><input type="radio" name="mat" checked={sel.materiales === "tengo"} onChange={() => set("materiales", "tengo")} /><span>Ya tengo logo y fotos</span></label>
                  <label><input type="radio" name="mat" checked={sel.materiales === "ayuda"} onChange={() => set("materiales", "ayuda")} /><span>Necesito ayuda con eso</span></label>
                </div>
              </fieldset>
            </div>
          )}

          {paso === 2 && (
            <fieldset className="cot-set">
              <legend className="h3">¿Qué tiene que hacer tu web?</legend>
              <p className="muted">Lo que ya viene incluido figura marcado. Lo demás lo reviso y te confirmo si entra en el precio base o se cotiza aparte.</p>
              <div className="cot-funcs">
                {funcionesDisponibles.map((f) => {
                  const inc = incluidas.has(f.etiqueta);
                  return (
                    <label key={f.id} className={`cot-func${inc ? " is-inc" : ""}`}>
                      <input type="checkbox" checked={inc || sel.funciones.includes(f.id)} disabled={inc} onChange={() => alternar(f.id)} />
                      <span>
                        <b>{f.etiqueta}</b>
                        <small>{inc ? "Incluido en el precio base" : f.detalle}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {paso === 3 && (
            <div className="cot-set">
              <h3 className="h3">Últimos detalles</h3>
              <fieldset className="vd-chips">
                <legend>¿Para cuándo la querés?</legend>
                <div>
                  {PLAZOS.map((p) => (
                    <label key={p.valor}>
                      <input type="radio" name="plazo" value={p.valor} checked={sel.plazo === p.valor} onChange={() => set("plazo", p.valor)} />
                      <span>{p.etiqueta}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field">
                <label htmlFor="c-ref">Sitios que te gustan <span className="opt">(opcional)</span></label>
                <textarea id="c-ref" className="input" rows={3} maxLength={600} value={sel.referencias} onChange={(e) => set("referencias", e.target.value)} placeholder="Links o nombres de webs que te inspiran" />
              </div>
              <div className="vd-duo">
                <div className="field">
                  <label htmlFor="c-nombre">Tu nombre</label>
                  <input id="c-nombre" name="nombre" className="input" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} aria-invalid={!!errCampos.nombre} aria-describedby={errCampos.nombre ? "c-nombre-e" : undefined} />
                  {errCampos.nombre && <p id="c-nombre-e" className="field-error">{errCampos.nombre}</p>}
                </div>
                <div className="field">
                  <label htmlFor="c-contacto">Mail o WhatsApp</label>
                  <input id="c-contacto" name="contacto" className="input" autoComplete="email" inputMode="email" value={contacto} onChange={(e) => setContacto(e.target.value)} aria-invalid={!!errCampos.contacto} aria-describedby={errCampos.contacto ? "c-contacto-e" : undefined} />
                  {errCampos.contacto && <p id="c-contacto-e" className="field-error">{errCampos.contacto}</p>}
                </div>
              </div>
              <div className="field">
                <label htmlFor="c-msg">Algo más que quieras contarme <span className="opt">(opcional)</span></label>
                <textarea id="c-msg" className="input" rows={3} maxLength={800} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
              </div>
              <div className="hp" aria-hidden="true">
                <label htmlFor="c-web">No completar</label>
                <input id="c-web" name="web" tabIndex={-1} autoComplete="off" />
              </div>
            </div>
          )}

          {error && <p className="estado" role="alert">{error}</p>}
          <div className="cot-nav">
            {paso > 0 && (
              <button type="button" className="btn btn-outline" onClick={() => ir(paso - 1)}>Volver</button>
            )}
            {paso < PASOS.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={siguiente}>
                Siguiente <Flecha />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={estado === "enviando"} aria-busy={estado === "enviando"}>
                {estado === "enviando" ? "Enviando…" : "Enviar mi pedido"} <Flecha />
              </button>
            )}
          </div>
        </form>

        <aside className="cot-resumen-card vd-card" aria-label="Resumen de tu web" aria-live="polite">
          <span className="label">Tu web</span>
          <b className="cot-servicio">{cot.servicio.nombre}</b>
          <div className="cot-precio">
            <span>{cot.esDesde ? "Desde" : "Precio base"}</span>
            <strong>{cot.precioBase.replace("desde ", "")}</strong>
          </div>
          {cot.incluidas.length > 0 && (
            <div>
              <span className="label">Incluido</span>
              <ul>{cot.incluidas.map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}</ul>
            </div>
          )}
          {cot.aEvaluar.length > 0 && (
            <div>
              <span className="label">A evaluar</span>
              <ul>{cot.aEvaluar.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}
          {cot.condiciones.length > 0 && (
            <div>
              <span className="label">Condiciones</span>
              <ul className="cot-cond">{cot.condiciones.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}
          <p className="vd-nota">{cot.nota}</p>
        </aside>
      </div>
    </div>
  );
}
