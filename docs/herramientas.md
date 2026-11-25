# Herramientas y conectores (MCP)

Qué conectores necesita el proyecto, para qué se usa cada uno y cuáles tenés que conectar vos desde los ajustes de tu cuenta de Claude. Los conectores se activan en **claude.ai → Ajustes → Conectores** (desde el celular también). Una sesión de Claude Code en la nube usa los conectores de tu cuenta; no hace falta pegar claves en el chat.

Estado verificado en la sesión de armado (25/11/2026): ✔ = lo probé con una llamada real · ◻ = aparece disponible pero no lo probé.

| Conector | Para qué | Estado | ¿Qué tenés que hacer vos? |
|---|---|---|---|
| **GitHub** | Repo `valentin.dev-agency`: ramas, commits, merge a `main` | ✔ Conectado (push probado) | Nada. Si algún día falla el push: instalá la app de Claude en tu organización de GitHub |
| **Vercel** | Proyecto `valentin-dev`: deploys, vistas previas, logs, variables de entorno, dominios | ✔ Conectado (equipo `valentin-lynch-s-projects`) | Nada para usarlo. Las **claves de terceros** (contraseña del CRM, claves de Resend y Supabase) las cargás vos en Vercel → Settings → Environment Variables |
| **Supabase** | Base de datos del CRM, consultas, muestras y outbound; migraciones | ✔ Conectado (organización «consultorio», plan Pro) | **Decidir el proyecto nuevo** (tiene costo mensual; ver abajo). Hasta entonces el formulario y el CRM no guardan nada |
| **Resend** | Aviso de consultas por mail y envíos de outbound | ✔ Conectado | **Verificar el dominio de envío** de la agencia en Resend (hoy solo está verificado `getzleads.com`, que es de otro negocio: no usarlo para valentin.dev) |
| **Firecrawl** | Leer sitios de clientes y prospectos (datos y fotos para las muestras) | ✔ Conectado (lo usé para leer tus 3 trabajos) | Nada |
| **Gmail** | Rutinas: revisar respuestas, dejar **borradores** de seguimientos, mandarte el parte del día | ◻ Disponible | Confirmar que está conectado a la casilla que querés usar para la agencia |
| **Google Calendar** | Agendar reuniones con prospectos y recordatorios de seguimiento | ◻ Disponible | Confirmar el calendario que querés usar |
| **Apify** | Scraping de Instagram y Google Maps para armar listas de negocios | ◻ Disponible; en la sesión de armado el plugin de Apify no cargó sus herramientas | Revisar que esté conectado y con saldo. **Cuesta por uso**: se pide OK antes de gastar |
| **ElevenLabs** | Voz del agente de voz (producto «CRM o agente de voz») y voz en off de videos | ◻ Disponible | Solo si lo vas a usar para un cliente. **Cuesta por créditos**: se pide OK antes de generar |
| **Twilio** | Números y llamadas del agente de voz | ◻ Disponible | Solo si vendés agentes de voz. **Cuesta por uso**: se pide OK |
| **Windsor.ai** | Leer y, más adelante, **publicar** en Instagram/TikTok desde una rutina | ◻ Disponible, sin cuentas sociales conectadas | Conectar tus cuentas de Instagram y TikTok si querés publicación automática (hoy no está activa) |

## Proyecto de Supabase: costo y decisión pendiente
Tu organización de Supabase («consultorio») está en **plan Pro** y ya tiene **2 proyectos activos** (más uno pausado). Un tercer proyecto activo suma un costo mensual propio; el monto exacto lo confirma Supabase al crearlo y esta conexión no lo muestra antes. **No creé el proyecto** porque pediste que no te cobren y a la vez una base nueva: las dos cosas no se pueden.

Opciones (elegí una y me avisás):
1. **Proyecto nuevo** (recomendado): base separada y limpia. Tiene costo mensual extra. Se crea en Supabase → New project, o me pedís que lo cree y te muestro el costo antes.
2. **Usar un proyecto existente** con prefijo de tablas: sin costo extra, pero mezcla datos (y tendría que mirar primero qué contiene).
3. **Esperar**: todo queda escrito (`supabase/migrations/`) y el formulario responde con un aviso honesto hasta que haya base.

Cuando haya proyecto: aplicar las dos migraciones de `supabase/migrations/` (en orden) y cargar en Vercel `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API).

## Qué tenés que conectar o cargar vos (resumen)
1. **Supabase:** decidir el proyecto (arriba) y cargar sus dos claves en Vercel.
2. **Resend:** verificar el dominio de envío y cargar `RESEND_API_KEY` y `RESEND_FROM` en Vercel.
3. **Vercel:** cargar `ADMIN_PASSWORD` (tu contraseña del CRM), `ADMIN_EMAIL` (donde querés recibir las consultas) y, opcional, `NEXT_PUBLIC_WHATSAPP`. También cargás vos `ADMIN_SECRET` y `CRON_SECRET` (textos largos y aleatorios; para generarlos, en cualquier terminal: `openssl rand -hex 32`, o con un generador de contraseñas de 64 caracteres). Una sesión de Claude no los genera ni los ve.
4. **Gmail y Google Calendar:** confirmar casilla y calendario de la agencia (para las rutinas).
5. **Instagram y TikTok:** crear las cuentas (`content/perfiles.md`); conectarlas a Windsor.ai solo si querés publicación automática.
6. **Dominio `valentin.dev`:** pasos en [`vercel-y-dominio.md`](vercel-y-dominio.md).
