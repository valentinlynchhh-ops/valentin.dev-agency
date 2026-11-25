# Informe de QA — web v2 (25/11/2026)

Resultados reales de lo que se ejecutó. Lo que no se pudo comprobar figura como tal.

| Campo | Resultado |
|---|---|
| Framework y stack preservado | Next.js 16 (App Router, Turbopack), React 19, Tailwind 4, TypeScript. CSS propio con tokens; SVG para los horizontes; sin librerías de animación (CSS + IntersectionObserver). Backend: rutas de Next + Supabase (sin conectar). |
| Referencias comparadas / capturas | Seis imágenes de `references/web-v2/` contra capturas a 1536×864 en `qa/capturas/` (inicio, proyectos, agendar, sobre mí, vendedores, cierre) y a 390×844. Comparación visual hecha a ojo, **no hay medición píxel a píxel**. |
| Diferencias intencionales | Sin avatares ni «+20 personas», sin cifras 10+/15+/3+, sin ranking ni montos de vendedores, sin horarios de agenda inventados, sin botón play (no hay video), sin Estudio Saucedo (autoría sin confirmar), sin redes (sin URL confirmada). La 5.ª tarjeta del carrusel es «Tu proyecto» (próxima sala), no una obra falsa. Fuente Inter en lugar de Neue Montreal (sin licencia). |
| Tipografía y licencia | Inter variable (derecha e itálica real, `@fontsource-variable/inter`, licencia OFL). Neue Montreal no está incluida: queda pendiente si se consigue la licencia. |
| Proyectos verificados y assets reales | R&D Abogados, Melisa Masegosa, Rebloom Active y Get Z Leads: capturas reales de las URLs publicadas (Playwright, 25/11/2026), en escritorio, celular y vertical. Pendiente confirmar con cada cliente que se pueden mostrar. |
| Agenda / contacto / postulación | **Solicitud** de reunión (día y franja preferidos), cotizador y postulación de vendedores: validan en cliente y servidor, tienen honeypot y tope por IP, y **sin base conectada responden con un aviso honesto (503), sin simular éxito** (comprobado). Con Supabase conectado deberían guardar: **no se pudo probar contra una base real**. |
| Datos no confirmados omitidos | Redes sociales, ubicación más precisa que «Argentina», Estudio Saucedo, cifras de la sección Sobre mí, términos de pago de los vendedores. |
| Build / lint / test | `npm run verificar` (typecheck + eslint + 85 tests + build): exit 0, sin advertencias. |
| Viewports | 320×568, 360×800, 390×844, 768×1024, 1024×768, 1280×800, 1536×864, 1920×1080: sin desborde horizontal en `/`, `/museo`, `/cotizar`, `/vendedores`, `/servicios`, `/contacto`. Navegador: **solo Chromium**; Safari/WebKit y Firefox sin probar. |
| Motion / pausa / reduced motion | Resaltado: barrido al entrar y cada ~5 s (medido: 3,8 s y 8,8 s tras la carga), una sola copia accesible del texto, sin cambio de ancho. Pausa manual persistente y reduced motion: sin barridos y contenido visible (comprobado). Horizontes y apariciones al scroll: CSS. |
| Funcional (Playwright, 37 comprobaciones) | 37/37: navegación sin enlaces muertos, un h1, diálogos (abrir, Escape, devolución de foco), formularios, cotizador completo, carrusel con scroll real y sin controles falsos a 1536 px, menú móvil, botones ≥ 44 px, redirección `/trabajos` → `/museo`, sitemap y llms.txt. |
| Performance (Lighthouse, celular, build local) | `/` 96 · `/museo` 95 · `/cotizar` 94 · `/vendedores` 94. Accesibilidad 100, buenas prácticas 100, SEO 100 en las cuatro. LCP entre 2,4 y 2,9 s. Son mediciones de laboratorio con el build local, no datos de campo. |

## Pendiente
- Probar contra una base real (formularios, cotizador, vendedores) cuando exista el proyecto de Supabase y aplicar `supabase/migrations/202611260001_web_v2.sql`.
- Probar en Safari/iOS y Firefox (esquinas squircle y animaciones por scroll tienen fallback, pero no se vieron).
- Revisión visual del dueño de las seis secciones contra sus referencias.
