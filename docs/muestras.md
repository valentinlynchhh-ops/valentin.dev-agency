# Muestras de web para clientes (`/demo/<slug>`)

Armo la web de un negocio **con sus propios datos y sus propias fotos** y le mando el link, para que vea cómo quedaría. Este documento es para quien arma una muestra (yo, o una sesión de Claude Code con `/muestra`).

## Cómo funciona
- Cada muestra es **una fila de la tabla `muestras`** (`slug`, `datos` en JSON, ~1 KB). La página **se arma al pedirla** con el generador `src/lib/demoWeb.mjs`: es el mismo que usa el script, así que sale idéntica.
- `https://valentin.dev/demo/<slug>` (ruta `src/app/demo/[slug]/route.ts`) responde sin el marco del sitio, con `X-Robots-Tag: noindex, nofollow`, caché de 60 s y una CSP que solo deja estilos y scripts del propio archivo, letras de Google Fonts e imágenes de `/demo/img/` y de sitios propios en Wix. Sin conexiones ni formularios. Slug inexistente, inválido o dato roto: 404.
- **Publicar no necesita push ni deploy:** alcanza con el `insert` en la base. Un cambio tarda hasta 60 s en verse.
- Slug: `^[a-z0-9-]{3,60}$` (ej. `estudio-perez-san-isidro`).
- **Muestras de ejemplo (datos ficticios, funcionan aunque no haya base):** `/demo/ejemplo-estudio-juridico`, `/demo/ejemplo-estudio-contable` y `/demo/ejemplo-inmobiliaria`. Llevan el aviso «Ejemplo con datos ficticios».

## Armar y publicar
```bash
node scripts/muestras/generar.mjs datos.json --slug estudio-perez-san-isidro --out /tmp/muestra.html   # el HTML, para revisar
node scripts/muestras/generar.mjs datos.json --slug estudio-perez-san-isidro --sql                      # el insert (valida antes)
node scripts/muestras/generar.mjs datos.json --slug estudio-perez-san-isidro --url                      # el link
```
El `--sql` imprime `insert into public.muestras (slug, datos) values (...) on conflict (slug) do update ...;`. Se ejecuta en Supabase **con mi OK**. Después: `curl -s -o /dev/null -w "%{http_code}" https://valentin.dev/demo/SLUG` tiene que dar 200, y se mira la página en el celular antes de mandar el link.

Para borrar una muestra: `delete from public.muestras where slug = '<slug>';` (con OK).

## Entrada (JSON)
| Campo | Qué es |
| --- | --- |
| `negocio` (obligatorio) | Nombre tal como lo usa el negocio. |
| `rubro` | `estudio-juridico`, `inmobiliaria`, `estudio-contable`, `arquitectura`, `salud` (odontología, consultorios), `comercio-distribuidora` o cualquier texto (se reconoce «abogados», «contador», «mayorista»…; si no, diseño `generico`). |
| `ciudad`, `direccion` | Ciudad o barrio y dirección (aparecen en «Cómo llegar»). |
| `telefono`, `whatsapp`, `email` | Contacto. El WhatsApp se pasa a `wa.me` (acepta `+54 9 11 …`, `11 …`). |
| `servicios[]` | Textos o `{nombre, detalle}`, hasta 12. |
| `descripcion` | Una o dos oraciones sobre el negocio, sacadas de su web o su ficha. |
| `promesa` | Opcional: el titular. Si no viene, se usa uno del rubro que no afirma nada que no sepamos. |
| `diferenciales[]` | Opcional: hechos comprobados del negocio (por ejemplo «Atención en inglés» si su web lo dice). |
| `horarios` | Texto o lista. |
| `instagram` | `@usuario` o el link. |
| `colores` | Opcional `{primario, acento}` en `#rrggbb` (los de su marca). |
| `imagenes[]` | Fotos del propio negocio, hasta 14. Solo valen `https://valentin.dev/demo/img/<hash>.webp` (las que devuelve el endpoint) o fotos de su propia web en Wix. Cualquier otra URL se descarta sola. La primera es el hero. |
| `imagenesMeta[]` | Opcional, alineado con `imagenes`: `{pie, rol, servicio}`. `pie` (hasta 80 caracteres, solo datos ciertos). `rol`: `hero`, `galeria`, `servicio` (con `servicio`: número desde 0) o `banda`. |
| `origenFotos` | De dónde salieron las fotos, para el aviso: «su web (estudio.com.ar)» o «su Instagram (@usuario)». |
| `instagramSeguidores` | Número tal como lo dio el scrape; se muestra redondeado hacia abajo («+8 mil»). |
| `zona` | Zona de trabajo si la dice el negocio. |
| `preguntas[]` | Opcional: `{pregunta, respuesta}` que el negocio publicó. |
| `proceso[]` | Opcional: `{nombre, detalle}` **solo** si el negocio cuenta cómo trabaja. |
| `tituloGaleria` | Opcional: título de la galería. |
| `trabajosParecidos[]` | Opcional: sitios que hice (`"rydabogados.com.ar"` o `{nombre, url}`). Para estudios jurídicos ya salen por defecto los dos de abogados. |
| `ficticio` | `true` solo en los ejemplos de prueba: pone un aviso «Ejemplo con datos ficticios». |

Cada rubro tiene su letra, su paleta y su orden de secciones. Con al menos una foto la página cambia a **modo fotos** (hero a pantalla completa, galería, servicios con su foto, banda de cierre). Sin fotos queda el diseño base.

## Fotos: de un negocio a una muestra publicada
El gasto en proveedores se pide con OK antes de hacerlo: las fotos de la propia web son gratis; el scraping de Instagram cuesta por uso.

1. **Su web primero (gratis).** `curl -sL -A "Mozilla/5.0" https://SU-WEB/` y las páginas de obras/proyectos/servicios. Juntar `og:image` y las `<img>` grandes; descartar logos, íconos y capturas. (Alternativa: Firecrawl, que ya está conectado.)
2. **Instagram, si la web no alcanza.** Con el conector de Apify (`apify/instagram-profile-scraper`), **con tope de gasto por corrida y con mi OK**. Los links de Instagram **vencen en horas**: bajar y subir al endpoint en la misma sesión.
3. **Mirar y elegir.** Bajar las candidatas a una carpeta nueva y **mirarlas**. Elegir 6 a 12 fotos limpias: sin texto encima, sin capturas de pantalla, sin baja resolución. Orden: la más fuerte primero (hero), después variedad. Un render se rotula «Render» en el pie: nunca hacerlo pasar por obra hecha.
4. **Subirlas al endpoint** (las guarda para siempre en `/demo/img/`):
   ```bash
   curl -s https://valentin.dev/api/muestras/fotos -H "x-demo-token: $CRON_SECRET" -H "content-type: application/json" \
     -d '{"slug":"SLUG","urls":["https://static.wixstatic.com/media/...","https://scontent-...cdninstagram.com/..."]}'
   ```
   `CRON_SECRET` vive en Vercel: no se imprime ni se guarda en archivos.
   - Hasta 12 URLs por llamada y 60 fotos por hora. Hosts permitidos: `*.cdninstagram.com`, `*.fbcdn.net`, `static.wixstatic.com`; otra web propia va en `"hostsExtra":["www.su-web.com.ar"]` (se revisa que no apunte a la red interna). Solo https, máximo 8 MB por foto, solo imágenes de verdad.
   - Respuesta: `{"imagenes":[{"fuente","url","ancho","alto"} | {"fuente","error"}]}`. La `url` es la que va en `imagenes[]` (hay variantes `-1024` y `-640` que la página usa sola). Errores: `host_no_permitido`, `url_invalida`, `ip_privada`, `demasiadas_redirecciones`, `descarga_fallida` (link vencido: volver a scrapear), `no_es_imagen`, `muy_grande`, `imagen_invalida`, `guardado_fallido`; 401 clave mal, 413 cuerpo grande, 429 tope por hora, 503 sin base.
   - El nombre es el hash del contenido: subir dos veces la misma foto da la misma URL.
5. **Armar el JSON** con `imagenes`, `imagenesMeta`, `origenFotos`, `instagramSeguidores`; publicar; comprobar 200 de la página y de cada foto; mirarla en el celular.

## Reglas que no se rompen
- **Solo lo que vino en el JSON aparece como hecho.** Nada de testimonios, clientes, calificaciones, años de experiencia, premios ni cifras. Si falta un dato, la sección no sale.
- Los datos salen de la web, la ficha de Google o el Instagram **del propio negocio**. Nunca de otro negocio.
- Toda muestra lleva la franja fija «Propuesta de ejemplo preparada por Valentín · Si te gusta, la dejamos online en 5 días hábiles» (el plazo sale de `catalogo.ts`) y una sección que aclara que **no es el sitio actual** del negocio. El botón lleva al WhatsApp de `NEXT_PUBLIC_WHATSAPP` o, si no está cargado, al formulario del sitio.
- Todo se escapa y las URLs se validan: no hace falta limpiar la entrada a mano, pero no pegar HTML en los campos.
- **No usar fotos de bancos de imágenes** como si fueran del negocio.
- Nunca poner en la página links de Instagram o Facebook a fotos: vencen. Siempre pasar por el endpoint.
- **No le escribo al negocio sin mi OK.** La muestra se publica y el mensaje queda en borrador (ver `outbound/`).

## Revisar antes de mandar
`node scripts/muestras/capturas.mjs <carpeta>` saca capturas de cada rubro (375×812 y 1440×900) con los ejemplos de `scripts/muestras/ejemplos/`. Tests: `node --test scripts/muestras/*.test.mjs src/lib/demoImagenes.test.ts`.
