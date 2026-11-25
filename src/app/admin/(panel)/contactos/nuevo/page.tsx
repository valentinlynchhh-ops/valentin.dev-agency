import { ORIGENES } from "@/lib/crmLogica";
import { crearContacto } from "../../../acciones";

const ORIGEN_ETIQUETA = { manual: "Lo cargué yo", web: "Formulario de la web", outbound: "Mail o WhatsApp en frío", referido: "Referido" } as const;

export default async function NuevoContacto({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <section>
      <h1 className="ad-titulo">Nuevo contacto</h1>
      <form action={crearContacto} className="form">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" className="input" required autoComplete="off" />
          {error === "nombre" && <p className="field-error" role="alert">Escribí un nombre.</p>}
        </div>
        <div className="field">
          <label htmlFor="empresa">Negocio <span className="opt">(opcional)</span></label>
          <input id="empresa" name="empresa" className="input" autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="telefono">WhatsApp o teléfono <span className="opt">(opcional)</span></label>
          <input id="telefono" name="telefono" className="input" inputMode="tel" autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="email">Mail <span className="opt">(opcional)</span></label>
          <input id="email" name="email" type="email" className="input" autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="rubro">Rubro <span className="opt">(opcional)</span></label>
          <input id="rubro" name="rubro" className="input" placeholder="Estudio contable, inmobiliaria…" autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="ciudad">Ciudad <span className="opt">(opcional)</span></label>
          <input id="ciudad" name="ciudad" className="input" autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="origen">¿De dónde salió?</label>
          <select id="origen" name="origen" className="input" defaultValue="manual">
            {ORIGENES.map((o) => (
              <option key={o} value={o}>{ORIGEN_ETIQUETA[o]}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Guardar contacto</button>
      </form>
    </section>
  );
}
