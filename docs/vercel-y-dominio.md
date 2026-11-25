# Vercel y el dominio valentin.dev

## Cómo está conectado
- Proyecto de Vercel: **`valentin-dev`**, equipo `valentin-lynch-s-projects`, conectado al repo `valentinlynchhh-ops/valentin.dev-agency`.
- **Push a `main` = deploy a producción.** Cada rama y cada pull request genera una **vista previa** con su propia URL (`valentin-dev-git-<rama>-…vercel.app`).
- Región de las funciones: `gru1` (São Paulo), en `vercel.json`.
- Variables de entorno: Vercel → proyecto `valentin-dev` → Settings → Environment Variables. Los nombres están en `.env.example`.

## Apuntar valentin.dev al proyecto (pasos exactos)

> Este paso lo hacés vos porque depende de dónde está registrado el dominio. Yo no compro ni transfiero dominios.

### Paso 1 · Agregar el dominio en Vercel
1. Abrí **vercel.com** → equipo *Valentin Lynch's projects* → proyecto **valentin-dev** → **Settings** → **Domains**.
2. Tocá **Add Domain** y escribí `valentin.dev`. Elegí «Connect to an environment → Production».
3. Repetí con `www.valentin.dev` y elegí **Redirect to valentin.dev** (así `www` lleva a la versión sin www).
4. Vercel te muestra los registros DNS que necesita. Son estos (confirmá en pantalla los valores exactos que te muestra tu proyecto):

| Tipo | Nombre / Host | Valor |
|---|---|---|
| `A` | `@` (o vacío) | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

### Paso 2 · Cargar esos registros donde esté el DNS
- **Si el dominio lo compraste en un registrador** (Namecheap, GoDaddy, Cloudflare, NIC, etc.): entrá a su panel → *DNS* / *Zona DNS* del dominio → agregá los dos registros de la tabla. Si ya hay un `A` para `@` o un `CNAME` para `www`, reemplazalos.
- **Si preferís que Vercel maneje el DNS:** en el registrador cambiá los *nameservers* por los que te muestra Vercel (`ns1.vercel-dns.com` y `ns2.vercel-dns.com`).

### Paso 3 · Esperar y comprobar
1. Volvé a Vercel → Domains. Cuando cada fila muestre **Valid Configuration** (tilde verde), está listo. Puede tardar de unos minutos a unas horas.
2. Probá `https://valentin.dev` en el navegador: tiene que cargar la web con el candado.
3. Confirmá que `NEXT_PUBLIC_SITE_URL=https://valentin.dev` está cargada en Vercel (Production). De ahí salen el sitemap, los links canónicos y las imágenes de vista previa. Si la cambiás, hay que volver a desplegar.

### Paso 4 · Avisarle a Google (opcional, recomendado)
En **Google Search Console** agregá la propiedad `valentin.dev` y enviá `https://valentin.dev/sitemap.xml`.

## Mails desde el dominio (Resend)
Para que los avisos y el outbound salgan desde `@valentin.dev`:
1. Resend → **Domains** → **Add Domain** → `valentin.dev` (región São Paulo).
2. Resend te da registros `TXT` (SPF), `CNAME` (DKIM) y, para recibir, `MX`. Cargalos en el mismo DNS del paso 2.
3. Tocá **Verify** en Resend. Cuando figure *verified*, cargá en Vercel `RESEND_FROM` con una dirección de ese dominio (ej. `valentin.dev <hola@valentin.dev>`).
4. **No uses el dominio `getzleads.com`** para esto: es de otro negocio.
5. Antes de mandar mails en frío, **calentá el dominio** (pocos por día al principio): ver `outbound/README.md`.

## Si algo sale mal
- La web no carga: mirá *Deployments* en Vercel; el último debe estar en *Ready*. Pedile a Claude «fijate los logs de producción».
- Quedó una versión rota en producción: *Deployments* → el anterior que funcionaba → **Promote to Production**.
