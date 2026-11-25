# CLAUDE.md — valentin.dev

Contexto para cualquier sesión de Claude Code (en el celular, en la nube o local) que trabaje en este repo. **No contiene claves:** las claves viven en Vercel y en el entorno de cada sesión.

## Qué es
valentin.dev es la agencia web de Valentín (marca personal, independiente): **páginas web, landings y sistemas a medida para negocios de Argentina**. Este repo tiene todo:
- **La web de la agencia** (`src/app/(sitio)/`): una landing de seis secciones (inicio, proyectos, agendar, sobre mí, vendedores, cierre) más `/museo`, `/cotizar`, `/vendedores`, `/recursos`, servicios, precios, cómo trabajo, preguntas y contacto.
- **Un CRM mínimo** en `/admin` (contactos, estados de venta, notas, próximas acciones, tablero del día), pensado primero para el celular.
- **Un sistema de muestras** (`/demo/[slug]`): se arma la web de un negocio con sus propias fotos y se le manda el link.
- **Contenido** (`content/`) para Instagram y TikTok y **outbound** (`outbound/`) para escribirle a negocios.
- **Herramientas de Claude** (`.claude/`): skills de diseño, comandos y agentes de agencia.

Stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind 4, `motion`, Supabase, Resend, Vercel. Leé `AGENTS.md` (lo genera Next): esta versión de Next tiene cambios respecto de lo que se conocía; ante la duda, mirá `node_modules/next/dist/docs/`.

## Reglas de trabajo (del dueño)
- **Todo el copy en español rioplatense** (vos, "contame", "te muestro"), en primera persona singular: "diseño", "programo", "trabajo directo con vos". Sin tono de folleto: nada de "soluciones innovadoras" ni "llevamos tu negocio al siguiente nivel".
- **Nada inventado:** ni testimonios, ni logos de clientes, ni cifras, ni resultados, ni garantías que Valentín no haya dicho. Los trabajos que se pueden mostrar son solo los reales: **rydabogados.com.ar, abogadamasegosa.com y rebloomactive.com**. Antes de publicar algo de un cliente, confirmar que está de acuerdo.
- **Precios:** salen de un solo archivo, `src/lib/catalogo.ts`. **Nunca se escriben a mano en otro lado** (código, docs, contenido, plantillas): se importan o se usan tokens (`{{precio:landing}}`, `{{pago_web}}`, `{{plazo_web}}`). `src/lib/catalogo.test.ts` falla si aparece un precio en dólares fuera del catálogo. **Nunca se vende por menos del mínimo** (`PRECIO_MINIMO_USD` en `catalogo.ts`).
- **Web v2 (rediseño del 25/11/2026):** la web pública sigue el contrato de `docs/diseno-web-v2/` (leer `WEB-DESIGN-OVERRIDES.md`, `SECTIONS.md`, `MOTION.md`, `FUNCTIONALITY.md` y mirar las seis imágenes de `references/web-v2/`). **Para la web, ese paquete prevalece sobre `design.md` donde difieran** (logo `vd` con dos píxeles, squircle, horizontes animados, titulares en bold italic). `design.md` sigue valiendo para piezas de branding, redes y documentos. No se convierte una captura en imagen de fondo ni se inventan métricas, clientes, rankings o disponibilidad.
- **Diseño base:** todo sale de [`design.md`](design.md) (colores `#0A0A0A` / `#FFE600` / `#F5F5F0` exactos, tipografía, grilla, componentes, control de calidad §16). La referencia aprobada está en `references/branding-reference.webp`. No se inventan colores ni se redibuja el wordmark. Neue Montreal no está licenciada acá: se usa Inter como alternativa autorizada (design.md §4) y no se declara que sea la fuente original.
- **Claves, tokens y contraseñas:** nunca en el repo ni en el chat. Si hace falta una, se pide por el medio seguro de la sesión (la tarjeta de credenciales del entorno) o la carga Valentín directo en Vercel.
- **Nada de plata real, borrar datos ni mensajes a terceros sin su OK.** Eso incluye: crear proyectos con costo (Supabase), comprar dominios, mandar mails o WhatsApp a negocios, borrar tablas o filas. Los mails de prueba van a su casilla.
- **Una herramienta de diseño por vez.** Si varias sesiones tocan la web a la vez, se pisan.
- **No rediseñar lo que el dueño ya aprobó.** Se cambian cosas pedidas, no se "mejora" a gusto propio.

## Infra
- **GitHub:** `valentinlynchhh-ops/valentin.dev-agency`. Rama de producción: `main`.
- **Vercel:** proyecto `valentin-dev`, equipo `valentin-lynch-s-projects`. Funciones en `gru1` (São Paulo, `vercel.json`). **Push a `main` = deploy a producción.** Cada rama y cada pull request genera una **vista previa** con su propia URL.
- **Dominio:** `valentin.dev`. Pasos para apuntarlo en [`docs/vercel-y-dominio.md`](docs/vercel-y-dominio.md).
- **Supabase:** proyecto propio de la agencia (a crear: ver `docs/herramientas.md`). Migraciones en `supabase/migrations/`; el servidor usa la service role (`SUPABASE_SERVICE_ROLE_KEY`). Las tablas tienen RLS activada y **sin políticas públicas**: el navegador nunca las toca.
- **Resend:** mails de aviso de consultas y de outbound. El dominio de envío tiene que estar verificado en Resend antes de mandar.
- **Formulario de consulta:** `POST /api/consulta` valida, guarda en `consultas`/`contactos` y avisa por mail a `ADMIN_EMAIL`. Si falta la base responde 503 con un mensaje honesto: **nunca simula un envío exitoso.**
- **CRM (`/admin`):** login con `ADMIN_PASSWORD`, sesión firmada con `ADMIN_SECRET` (cookie `vd_admin`, 30 días), protegido por `src/proxy.ts`. Con `CRM_MODO=memoria` (solo desarrollo, ignorado en producción) usa datos de ejemplo en memoria.
- **Muestras:** `/demo/<slug>` arma la página desde la fila de la tabla `muestras` (JSON chico) con `src/lib/demoWeb.mjs`. Fotos: `POST /api/muestras/fotos` (cabecera `x-demo-token` = `CRON_SECRET`) las descarga, valida, pasa a WebP y las guarda en el bucket privado `muestras`; se sirven en `/demo/img/<hash>.webp`. Hay 3 ejemplos ficticios que funcionan sin base (`/demo/ejemplo-estudio-juridico`, `-contable`, `-inmobiliaria`). Ver `docs/muestras.md`.
- **Cotizador (`/cotizar`):** `src/lib/cotizador.ts` (puro, con tests) arma el pedido; el **precio base sale del catálogo** y lo que no tiene precio definido queda «a evaluar»: nunca se inventan montos de extras. Guarda en `consultas` (tipo `cotizacion`, con `detalle` jsonb) vía `POST /api/cotizacion`.
- **Reuniones:** no hay calendario conectado, así que el panel de la landing **solicita** una reunión (día y franja preferidos) y yo la confirmo; no muestra horarios inventados. Se guarda como consulta tipo `reunion`.
- **Programa de vendedores:** las condiciones viven en `src/lib/vendedores.ts` (**15% sobre cada proyecto cobrado, mínimo 2 proyectos al mes**, fijadas por el dueño el 25/11/2026); la landing, `/vendedores`, el CRM y los tests las importan, nunca se escriben a mano. Postulación en `POST /api/vendedores` (tabla `postulaciones_vendedores`); en `/admin/vendedores` se aprueba (genera el código de 6 letras) o rechaza. Los links `?ref=CODIGO` guardan una cookie de 30 días y la consulta queda atribuida (`consultas.ref`, `contactos.vendedor_ref`). La comisión del CRM es una **estimación** sobre lo entregado: hay que validar el cobro real. Borrador de términos en `docs/programa-vendedores.md`.
- **Contacto público** (lo pasó el dueño el 25/11/2026): `valentinlynch7@gmail.com` y WhatsApp +54 9 11 5809-2000 (`src/lib/sitio.ts`). No hay redes sociales confirmadas: no se muestran.
- **Estudio Saucedo** aparece en la maqueta pero **no está publicado**: falta confirmar autoría y URL (`src/lib/sitio.test.ts` lo vigila).
- **Movimiento:** `src/components/Motion.tsx` decide si hay animación continua (reduced motion, pausa manual persistente y pestaña oculta). El resaltado (`HighlightText`) repite cada 5 s solo mientras es visible. Las apariciones al scroll son CSS (`animation-timeline: view()`), sin JS, y no hay nada oculto sin ellas. No usar `vd-rise` dentro de un contenedor con scroll horizontal.
- **Outbound:** los frenos (tope diario, lista de bajas, horario, frecuencia) viven en `src/lib/outbound.ts` con tests. `POST /api/outbound/enviar` está **apagado por defecto** (`ajustes.outbound_envio_automatico`): mientras no se prenda, todo es borrador y lo aprueba Valentín. Cada mail lleva un link de baja firmado (`/api/outbound/baja`).
- **Rutinas en la nube:** tareas programadas de Claude Code documentadas en [`docs/rutinas.md`](docs/rutinas.md), con cómo apagar cada una.

## Variables de entorno (solo nombres)
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `CRON_SECRET`, `OUTBOUND_TOPE_DIA`, `CRM_MODO` (solo desarrollo). Ver `.env.example`. Los valores viven en Vercel; no hace falta tenerlos para editar código ni publicar.

## Cómo trabajar
- `npm install`, `npm run dev`, `npm run verificar` (tipos + lint + tests + build), o por separado: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
- **Una sola fuente de verdad del sitio:** textos, páginas, trabajos, pasos y preguntas en `src/lib/sitio.ts`; precios en `src/lib/catalogo.ts`; metadatos y JSON-LD en `src/lib/seo.ts`; `llms.txt` y sitemap se generan de ahí. Al agregar una página: sumarla a `PAGINAS` en `sitio.ts` (con título ≤ 60 y descripción ≤ 155 caracteres), crear la ruta con `metaPagina` y `JsonLd`, un único `h1`.
- **Las imports relativas dentro de `src/lib/` llevan la extensión `.ts`** (`./catalogo.ts`): así los tests de Node las resuelven sin compilar.
- Para revisar una pantalla: capturas a **375 px** y a **1440 px** (Playwright ya está en el entorno de la nube) y mirarlas, no solo leer el código. Comandos útiles: `/revisar-diseno`, `/muestra`, `/guion-tiktok`, `/mail-frio`; agentes: `director-de-arte`, `redactor`, `qa-web`.
- **Skills de diseño** (`.claude/skills/`): `impeccable`, `taste-skill`, `emil-design-eng`, `animate`, `apple-design` y el resto. Usarlas como criterio al tocar la web o el CRM, siempre subordinadas a `design.md`.
- Los tests que dependen del reloj usan fechas fijas; los que dependen de la base se prueban con la capa en memoria, no contra producción.

## Autorización de publicación (dada por el dueño en el encargo del 25/11/2026)
Se puede, sin preguntarle cada vez:
- **Publicar en `main`** (merge o push) cuando se termina un cambio y **pasan todos los controles**.
- Cargar o actualizar en Vercel las **variables de entorno no secretas** del proyecto `valentin-dev` (ej. `NEXT_PUBLIC_SITE_URL`). **Los secretos** (`ADMIN_PASSWORD`, `ADMIN_SECRET`, `CRON_SECRET`, claves de Supabase y Resend) **los carga Valentín directo en Vercel**: una sesión no los genera ni los ve.

Condiciones, siempre:
- **Probar antes de publicar:** `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` y una prueba real de cada pantalla y endpoint tocados (capturas a 375 px y a escritorio). Una migración se revisa antes de aplicarla y se verifica después.
- **Si algo falla, no publicar** y contarle a Valentín qué pasó, con el error real.
- Esta autorización **no cubre**: gastar plata real (proyectos de Supabase con costo, dominios, planes), borrar datos, mandar mails o mensajes a terceros, prender el envío automático de outbound, ni imprimir o commitear secretos. Todo eso se confirma antes.
