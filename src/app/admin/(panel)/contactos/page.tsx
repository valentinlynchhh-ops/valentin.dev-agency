import Link from "next/link";
import { repo } from "@/lib/crm";
import { ESTADOS, ETIQUETA_ESTADO, esEstado } from "@/lib/crmLogica";
import { Pill } from "../Pill";

export default async function Contactos({ searchParams }: { searchParams: Promise<{ estado?: string; q?: string }> }) {
  const { estado, q } = await searchParams;
  const filtro = esEstado(estado) ? estado : undefined;
  const r = repo();
  const lista = r ? await r.listar({ estado: filtro, q }) : [];

  return (
    <section>
      <h1 className="ad-titulo">Contactos</h1>
      <form className="ad-buscar" role="search" action="/admin/contactos">
        {filtro && <input type="hidden" name="estado" value={filtro} />}
        <label htmlFor="q" className="sr-only">Buscar</label>
        <input id="q" name="q" type="search" defaultValue={q ?? ""} className="input" placeholder="Buscar por nombre, rubro, mail…" />
        <button type="submit" className="btn btn-outline">Buscar</button>
      </form>

      <nav className="ad-chips" aria-label="Filtrar por estado">
        <Link href="/admin/contactos" aria-current={!filtro ? "true" : undefined}>Todos</Link>
        {ESTADOS.map((e) => (
          <Link key={e} href={`/admin/contactos?estado=${e}`} aria-current={filtro === e ? "true" : undefined}>
            {ETIQUETA_ESTADO[e]}
          </Link>
        ))}
      </nav>

      {!r ? (
        <p className="ad-vacio">La base todavía no está conectada.</p>
      ) : lista.length === 0 ? (
        <p className="ad-vacio">
          {q || filtro ? "No hay contactos con ese filtro." : "Todavía no cargaste ningún contacto."}{" "}
          <Link href="/admin/contactos/nuevo" className="link-text">Cargar uno</Link>
        </p>
      ) : (
        <ul className="ad-lista">
          {lista.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/contactos/${c.id}`} className="ad-fila ad-fila--link">
                <span className="ad-fila__cuerpo">
                  <b>{c.nombre}</b>
                  <span>{[c.empresa, c.rubro, c.ciudad].filter(Boolean).join(" · ") || "Sin datos todavía"}</span>
                </span>
                <Pill estado={c.estado} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
