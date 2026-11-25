import Link from "next/link";
import { repo, modoCRM } from "@/lib/crm";
import { ESTADOS, ETIQUETA_ESTADO, fechaCorta, hoyArgentina, type AccionConContacto } from "@/lib/crmLogica";
import { completarAccion } from "../acciones";

function Accion({ a }: { a: AccionConContacto }) {
  return (
    <li className="ad-fila">
      <form action={completarAccion} className="ad-check">
        <input type="hidden" name="accion" value={a.id} />
        <input type="hidden" name="vuelta" value="/admin" />
        <button type="submit" aria-label={`Marcar como hecha: ${a.texto}`} className="ad-tilde" />
      </form>
      <Link href={`/admin/contactos/${a.contacto_id}`} className="ad-fila__cuerpo">
        <b>{a.contacto_nombre}</b>
        <span>{a.texto}</span>
      </Link>
      <span className="ad-fecha">{fechaCorta(a.vence_el)}</span>
    </li>
  );
}

export default async function Hoy({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const r = repo();
  const hoy = hoyArgentina();

  if (!r) {
    return (
      <section>
        <h1 className="ad-titulo">Hoy</h1>
        <div className="ad-vacio">
          <p><b>La base todavía no está conectada.</b></p>
          <p>Hace falta el proyecto de Supabase y sus claves en Vercel (NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY). Los pasos están en docs/herramientas.md.</p>
        </div>
      </section>
    );
  }

  const res = await r.resumen(hoy);
  const { vencidas, hoy: deHoy, proximas } = res.tablero;
  const pendientesAhora = vencidas.length + deHoy.length;
  const max = Math.max(1, ...ESTADOS.map((e) => res.porEstado[e]));

  return (
    <section>
      <p className="label">{fechaCorta(hoy)}</p>
      <h1 className="ad-titulo">Hoy</h1>
      {error === "sin-base" && <p className="estado" role="alert">La base no está conectada: no se guardó nada.</p>}
      {modoCRM() === "supabase" && res.consultasSinAtender > 0 && (
        <p className="ad-alerta">{res.consultasSinAtender} consulta{res.consultasSinAtender === 1 ? "" : "s"} de la web sin aviso por mail. Revisá que RESEND_API_KEY y ADMIN_EMAIL estén en Vercel.</p>
      )}

      <div className="ad-bloque">
        <h2 className="ad-sub">Para hacer ({pendientesAhora})</h2>
        {pendientesAhora === 0 ? (
          <p className="ad-vacio">Nada pendiente para hoy. Cargá una próxima acción desde la ficha de un contacto.</p>
        ) : (
          <ul className="ad-lista">
            {vencidas.map((a) => (
              <Accion key={a.id} a={a} />
            ))}
            {deHoy.map((a) => (
              <Accion key={a.id} a={a} />
            ))}
          </ul>
        )}
        {vencidas.length > 0 && <p className="ad-nota">Las primeras {vencidas.length} están vencidas.</p>}
      </div>

      {res.nuevos.length > 0 && (
        <div className="ad-bloque">
          <h2 className="ad-sub">Nuevos ({res.nuevos.length})</h2>
          <ul className="ad-lista">
            {res.nuevos.map((c) => (
              <li key={c.id}>
                <Link href={`/admin/contactos/${c.id}`} className="ad-fila ad-fila--link">
                  <span className="ad-fila__cuerpo">
                    <b>{c.nombre}</b>
                    <span>{[c.rubro, c.ciudad].filter(Boolean).join(" · ") || c.origen}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="ad-bloque">
        <h2 className="ad-sub">Embudo ({res.total})</h2>
        <ul className="ad-embudo">
          {ESTADOS.map((e) => (
            <li key={e}>
              <Link href={`/admin/contactos?estado=${e}`}>
                <span>{ETIQUETA_ESTADO[e]}</span>
                <span className="ad-barra" aria-hidden="true">
                  <i style={{ width: `${(res.porEstado[e] / max) * 100}%` }} />
                </span>
                <b>{res.porEstado[e]}</b>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {proximas.length > 0 && (
        <div className="ad-bloque">
          <h2 className="ad-sub">Próximas ({proximas.length})</h2>
          <ul className="ad-lista">
            {proximas.slice(0, 8).map((a) => (
              <Accion key={a.id} a={a} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
