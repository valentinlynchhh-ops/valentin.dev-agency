# valentin.dev

La web, el CRM y las herramientas de mi agencia: webs, landings y sistemas a medida para negocios de Argentina. **Todo vive en la nube: se edita desde el celular, la compu o cualquier dispositivo, sin instalar nada.**

- Web pública: https://valentin.dev (cuando el dominio esté apuntado; ver [`docs/vercel-y-dominio.md`](docs/vercel-y-dominio.md))
- Mi sistema (CRM): `/admin`
- Reglas del proyecto: [`CLAUDE.md`](CLAUDE.md) · Diseño: [`design.md`](design.md)

## Qué hay en la web
- **Landing** con seis secciones: inicio, proyectos (el museo), agendar una reunión, sobre mí, vendedores y cierre.
- **/museo:** recorrido por salas, una por cada sitio publicado.
- **/cotizar:** armás tu web en 4 pasos y ves el precio base al instante.
- **/vendedores:** programa de reventa (15% por proyecto cobrado, mínimo 2 proyectos al mes) con postulación online.
- **/admin:** mi CRM (contactos, ventas, vendedores).

## Abrir el proyecto en Claude Code desde el celular
1. Abrí **claude.ai/code** en el navegador del celular (o la app de Claude) e iniciá sesión.
2. Tocá **Nueva sesión** y elegí el repo **`valentin.dev-agency`**.
3. Claude lee `CLAUDE.md` solo y ya sabe cómo se trabaja acá. Pedile lo que necesites en español.

## Publicar un cambio
**Push a `main` = deploy en Vercel.** El camino normal:
1. Pedile el cambio a Claude. Trabaja en una rama.
2. Mirá la **vista previa**: cada rama genera su propia URL en Vercel (Claude te la pasa; también aparece en la pestaña *Deployments* del proyecto `valentin-dev`).
3. Cuando te guste, decile «publicalo»: Claude corre los controles (tipos, lint, tests, build y capturas) y, si pasan, lo mergea a `main`. En 1 o 2 minutos está en producción.
4. Si algo sale mal: en Vercel → *Deployments* → el anterior → *Promote to Production* (o pedile a Claude que haga el rollback).

## Qué pedirle a Claude para las tareas de todos los días
| Quiero… | Pedile |
|---|---|
| Cambiar un texto o un precio | «Cambiá [texto] en la web» · «El precio de la landing pasa a ser X» (sale de `catalogo.ts`) |
| Agregar un trabajo nuevo | «Sumá este trabajo al portfolio: [link]» (saca la captura y lo agrega con descripción verificable) |
| Revisar cómo se ve algo | «`/revisar-diseno` [URL]» |
| Armar una muestra para un negocio | «`/muestra` [nombre del negocio y su Instagram o web]» |
| Escribirle a un negocio | «`/mail-frio` [negocio, rubro, ciudad, algo que viste]» (deja un borrador, no envía) |
| Hacer un guion de TikTok | «`/guion-tiktok` [tema]» |
| Ver cómo viene el día | «Dame el parte del día» (consultas nuevas, acciones vencidas, seguimientos) |
| Ver errores en producción | «Fijate si hay errores en producción» (logs de Vercel) |

## Cómo está armado (para quien lo toque)
```
src/app/(sitio)/   páginas públicas        src/app/admin/    CRM (login, hoy, contactos)
src/app/demo/      muestras para clientes  src/app/api/      consulta, muestras/fotos, outbound
src/lib/           catalogo.ts (precios) · sitio.ts (textos) · seo.ts · crm.ts · outbound.ts
content/           Instagram y TikTok      outbound/         plantillas y reglas de envío
supabase/          migraciones SQL         docs/             herramientas, rutinas, muestras, dominio
.claude/           skills, comandos y agentes de Claude
```

## Comandos
```bash
npm install
npm run dev          # desarrollo
npm run verificar    # tipos + lint + tests + build (lo que corre antes de publicar)
```
