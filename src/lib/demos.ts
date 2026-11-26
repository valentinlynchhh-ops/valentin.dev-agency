/* Muestras de web para clientes (/demo/[slug]). Los datos de cada muestra (JSON chico) viven en la tabla `muestras` de
   Supabase y la página se arma al pedirla con src/lib/demoWeb.mjs. Este archivo no tiene dependencias: lo importan
   también los scripts de Node. */

export const SLUG_DEMO = /^[a-z0-9-]{3,60}$/;

export const slugValido = (slug: unknown): slug is string => typeof slug === "string" && SLUG_DEMO.test(slug);

const sitio = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://valentin.dev").replace(/\/$/, "");

/* Política de contenido: estilos y scripts en línea (los del propio archivo), letras de Google Fonts e imágenes solo de
   las fotos guardadas (/demo/img/) y de los sitios propios con host estable (Wix). Sin conexiones, formularios, marcos ni
   plugins: el HTML sale de la base y no puede llamar a nadie. */
export const CSP_DEMO = [
  "default-src 'none'",
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  `img-src 'self' ${sitio()}/demo/img/ https://static.wixstatic.com/media/ data:`,
  "script-src 'unsafe-inline'",
  "connect-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'self'",
  "object-src 'none'",
].join("; ");

export const cabecerasDemo = (encontrada: boolean): Record<string, string> => ({
  "content-type": "text/html; charset=utf-8",
  "x-robots-tag": "noindex, nofollow",
  "cache-control": encontrada ? "public, max-age=60" : "no-store",
  "content-security-policy": CSP_DEMO,
  "referrer-policy": "no-referrer",
});

export const PAGINA_NO_ENCONTRADA = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Muestra no disponible</title><style>body{margin:0;min-height:100svh;display:grid;place-items:center;font:17px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;background:#0a0a0a;color:#f5f5f0;padding:24px}main{max-width:30rem}h1{font-size:32px;line-height:1.05;letter-spacing:-.04em;margin:0 0 12px}a{color:#ffe600}</style></head><body><main><h1>Esta muestra no está disponible</h1><p>El link puede estar mal copiado o la propuesta ya se retiró. Si te la mandé yo, escribime y te la vuelvo a pasar.</p><p><a href="/contacto">Escribirme</a></p></main></body></html>`;
