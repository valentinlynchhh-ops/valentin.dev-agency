import { modoCRM } from "@/lib/crm";
import { listarPostulaciones, resumenVendedores } from "@/lib/vendedoresDb";
import { COMISION_PCT, MIN_PROYECTOS_MES } from "@/lib/vendedores";
import { usdFino } from "@/lib/catalogo";
import { SITE_URL } from "@/lib/sitio";
import { aprobarVendedor, rechazarVendedor } from "../../acciones";

export default async function Vendedores({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  if (modoCRM() !== "supabase")
    return (
      <section>
        <h1 className="ad-titulo">Vendedores</h1>
        <div className="ad-vacio"><p><b>La base todavía no está conectada.</b></p><p>Cuando haya base, acá aparecen las postulaciones y los códigos.</p></div>
      </section>
    );
  const [lista, resumen] = await Promise.all([listarPostulaciones(), resumenVendedores()]);
  const nuevas = lista.filter((p) => p.estado === "nueva");
  return (
    <section>
      <h1 className="ad-titulo">Vendedores</h1>
      <p className="ad-meta">{COMISION_PCT}% por proyecto cobrado · mínimo {MIN_PROYECTOS_MES} proyectos al mes</p>
      {ok && <p className="ad-ok" role="status">Listo.</p>}
      {error && <p className="estado" role="alert">No se pudo completar la acción.</p>}

      <div className="ad-bloque">
        <h2 className="ad-sub">Postulaciones nuevas ({nuevas.length})</h2>
        {nuevas.length === 0 && <p className="ad-vacio">No hay postulaciones nuevas.</p>}
        {nuevas.map((p) => (
          <div key={p.id} className="ad-vend">
            <p><b>{p.nombre}</b> · {p.email ?? p.telefono}</p>
            <p className="ad-nota" style={{ whiteSpace: "pre-wrap" }}>{p.motivo}</p>
            <div className="ad-vend__acc">
              <form action={aprobarVendedor}><input type="hidden" name="id" value={p.id} /><button className="btn btn-primary" type="submit">Aprobar y dar código</button></form>
              <form action={rechazarVendedor}><input type="hidden" name="id" value={p.id} /><button className="btn btn-outline" type="submit">Rechazar</button></form>
            </div>
          </div>
        ))}
      </div>

      <div className="ad-bloque">
        <h2 className="ad-sub">Vendedores activos ({resumen.length})</h2>
        {resumen.length === 0 && <p className="ad-vacio">Todavía no aprobaste a nadie.</p>}
        {resumen.map((v) => (
          <div key={v.id} className="ad-vend">
            <p><b>{v.nombre}</b> · código <b>{v.codigo}</b></p>
            <p className="ad-nota">Link: {SITE_URL}/?ref={v.codigo}</p>
            <p className="ad-nota">{v.consultas} consultas · {v.contactos} contactos · {v.entregados} entregados · {usdFino(v.valorEntregado)} entregados</p>
            <p><b>Comisión estimada: {usdFino(v.comisionEstimada)}</b> <span className="ad-nota">(sobre lo entregado; validá el cobro real antes de pagar)</span></p>
          </div>
        ))}
      </div>
    </section>
  );
}
