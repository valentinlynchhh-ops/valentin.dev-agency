import Link from "next/link";
import { notFound } from "next/navigation";
import { repo } from "@/lib/crm";
import { ESTADOS, ETIQUETA_ESTADO, fechaCorta, hoyArgentina, linkLlamar, linkMail, linkWhatsApp, siguienteEstado } from "@/lib/crmLogica";
import { ETIQUETA_TIPO } from "@/lib/sitio";
import { agregarAccion, agregarNota, completarAccion, guardarDatos, moverEstado } from "../../../acciones";
import { Pill } from "../../Pill";

const hora = (iso: string) => new Intl.DateTimeFormat("es-AR", { timeZone: "America/Argentina/Buenos_Aires", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export default async function Ficha({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { id } = await params;
  const { ok, error } = await searchParams;
  const r = repo();
  if (!r) notFound();
  const f = await r.ficha(id).catch(() => null);
  if (!f) notFound();
  const { contacto: c, notas, acciones, consultas } = f;
  const hoy = hoyArgentina();
  const pendientes = acciones.filter((a) => !a.hecha);
  const hechas = acciones.filter((a) => a.hecha).slice(0, 3);
  const proximo = siguienteEstado(c.estado);
  const wa = linkWhatsApp(c.telefono);
  const llamar = linkLlamar(c.telefono);
  const mail = linkMail(c.email);

  return (
    <section>
      <p className="label"><Link href="/admin/contactos" className="link-text" style={{ minHeight: 0 }}>← Contactos</Link></p>
      <h1 className="ad-titulo">{c.nombre}</h1>
      <p className="ad-meta">{[c.empresa, c.rubro, c.ciudad].filter(Boolean).join(" · ") || "Sin más datos"}</p>
      {ok && <p className="ad-ok" role="status">Guardado.</p>}
      {error && <p className="estado" role="alert">No se pudo guardar. Revisá los datos.</p>}

      <div className="ad-contacto">
        {wa && <a className="btn btn-primary" href={wa} target="_blank" rel="noopener">WhatsApp</a>}
        {llamar && <a className="btn btn-outline" href={llamar}>Llamar</a>}
        {mail && <a className="btn btn-outline" href={mail}>Mail</a>}
        {!wa && !llamar && !mail && <p className="ad-nota">Cargá un teléfono o un mail para contactarlo desde acá.</p>}
      </div>

      <div className="ad-bloque">
        <h2 className="ad-sub">Estado de la venta</h2>
        <p style={{ marginBottom: 12 }}><Pill estado={c.estado} /> <span className="ad-nota">desde {fechaCorta(c.estado_at.slice(0, 10))}</span></p>
        {proximo && (
          <form action={moverEstado} style={{ marginBottom: 12 }}>
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="estado" value={proximo} />
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Pasar a «{ETIQUETA_ESTADO[proximo]}»</button>
          </form>
        )}
        <form action={moverEstado} className="ad-inline">
          <input type="hidden" name="id" value={c.id} />
          <label htmlFor="estado" className="sr-only">Cambiar estado</label>
          <select id="estado" name="estado" className="input" defaultValue={c.estado}>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{ETIQUETA_ESTADO[e]}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-outline">Mover</button>
        </form>
      </div>

      <div className="ad-bloque">
        <h2 className="ad-sub">Próximas acciones</h2>
        {pendientes.length === 0 && <p className="ad-vacio">Sin acciones pendientes. Dejá una para no perder este contacto.</p>}
        <ul className="ad-lista">
          {pendientes.map((a) => (
            <li key={a.id} className="ad-fila">
              <form action={completarAccion} className="ad-check">
                <input type="hidden" name="accion" value={a.id} />
                <input type="hidden" name="vuelta" value={`/admin/contactos/${c.id}`} />
                <button type="submit" aria-label={`Marcar como hecha: ${a.texto}`} className="ad-tilde" />
              </form>
              <span className="ad-fila__cuerpo">
                <b>{a.texto}</b>
                <span className={a.vence_el < hoy ? "ad-vencida" : undefined}>{a.vence_el < hoy ? "Vencida · " : ""}{fechaCorta(a.vence_el)}</span>
              </span>
            </li>
          ))}
        </ul>
        {hechas.length > 0 && <p className="ad-nota" style={{ marginTop: 8 }}>Hechas: {hechas.map((a) => a.texto).join(" · ")}</p>}
        <form action={agregarAccion} className="form" style={{ marginTop: 16 }}>
          <input type="hidden" name="id" value={c.id} />
          <div className="field">
            <label htmlFor="accion-texto">Nueva acción</label>
            <input id="accion-texto" name="texto" className="input" placeholder="Mandar la muestra, llamar, seguimiento…" required />
          </div>
          <div className="ad-dias" role="group" aria-label="¿Para cuándo?">
            <button type="submit" name="dias" value="1" className="btn btn-outline">Mañana</button>
            <button type="submit" name="dias" value="3" className="btn btn-outline">En 3 días</button>
            <button type="submit" name="dias" value="7" className="btn btn-outline">En 1 semana</button>
          </div>
        </form>
      </div>

      <div className="ad-bloque">
        <h2 className="ad-sub">Notas</h2>
        <form action={agregarNota} className="form">
          <input type="hidden" name="id" value={c.id} />
          <div className="field">
            <label htmlFor="nota-texto" className="sr-only">Nueva nota</label>
            <textarea id="nota-texto" name="texto" className="input" placeholder="Qué hablaron, qué pidió, qué falta…" required maxLength={4000} />
          </div>
          <button type="submit" className="btn btn-outline">Guardar nota</button>
        </form>
        <ul className="ad-lista" style={{ marginTop: 16 }}>
          {notas.map((n) => (
            <li key={n.id} className="ad-nota-item">
              <span className="ad-nota">{hora(n.creado_at)}</span>
              <p>{n.texto}</p>
            </li>
          ))}
        </ul>
      </div>

      {consultas.length > 0 && (
        <div className="ad-bloque">
          <h2 className="ad-sub">Consultas de la web</h2>
          <ul className="ad-lista">
            {consultas.map((q) => (
              <li key={q.id} className="ad-nota-item">
                <span className="ad-nota">{hora(q.creado_at)} · {ETIQUETA_TIPO[q.tipo] ?? q.tipo}</span>
                <p>{q.mensaje || "(sin mensaje)"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <details className="ad-bloque ad-datos">
        <summary className="ad-sub">Datos del contacto</summary>
        <form action={guardarDatos} className="form" style={{ marginTop: 16 }}>
          <input type="hidden" name="id" value={c.id} />
          {(
            [
              ["empresa", "Negocio", c.empresa, "text"],
              ["telefono", "WhatsApp o teléfono", c.telefono, "tel"],
              ["email", "Mail", c.email, "email"],
              ["rubro", "Rubro", c.rubro, "text"],
              ["ciudad", "Ciudad", c.ciudad, "text"],
              ["web", "Web actual", c.web, "text"],
              ["instagram", "Instagram", c.instagram, "text"],
              ["valor_usd", "Valor de la venta (US$)", c.valor_usd, "number"],
            ] as const
          ).map(([k, etiqueta, valor, tipo]) => (
            <div className="field" key={k}>
              <label htmlFor={`d-${k}`}>{etiqueta}</label>
              <input id={`d-${k}`} name={k} type={tipo} className="input" defaultValue={valor ?? ""} inputMode={tipo === "number" ? "numeric" : undefined} />
            </div>
          ))}
          <button type="submit" className="btn btn-outline">Guardar datos</button>
        </form>
      </details>
    </section>
  );
}
