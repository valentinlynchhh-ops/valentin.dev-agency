import { Wordmark } from "@/components/Marca";
import { adminConfigurado } from "@/lib/adminSesion";
import { entrar } from "../acciones";

const MENSAJES: Record<string, string> = {
  clave: "Contraseña incorrecta.",
  espera: "Demasiados intentos. Esperá unos minutos.",
  config: "El acceso todavía no está configurado (faltan ADMIN_PASSWORD y ADMIN_SECRET en Vercel).",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const aviso = error ? MENSAJES[error] : !adminConfigurado() ? MENSAJES.config : null;
  return (
    <main className="ad-login">
      <div className="ad-login__caja">
        <Wordmark />
        <h1 className="ad-titulo">Mi sistema</h1>
        <form action={entrar} className="form">
          <div className="field">
            <label htmlFor="clave">Contraseña</label>
            <input id="clave" name="clave" type="password" className="input" autoComplete="current-password" required autoFocus />
          </div>
          {aviso && <p className="estado" role="alert">{aviso}</p>}
          <button type="submit" className="btn btn-primary">Entrar</button>
        </form>
      </div>
    </main>
  );
}
