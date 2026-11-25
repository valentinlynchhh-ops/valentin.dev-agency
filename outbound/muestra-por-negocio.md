# Cómo armar la muestra para cada negocio

La muestra es una página con **la información real del negocio** y **sus propias fotos**, armada para que vea cómo quedaría su web. Es lo que hace que un mail en frío no sea un mail en frío cualquiera.

Detalle técnico completo en [`docs/muestras.md`](../docs/muestras.md). Resumen de trabajo:

## 1. Juntá datos verificables (10 minutos)
Del sitio, Instagram o Google Maps del negocio: nombre, rubro, ciudad y dirección, qué ofrece, horarios, WhatsApp o teléfono **publicados**, y su Instagram.
- Escribí solo lo que ellos ya publican. Nada de reseñas inventadas, años de trayectoria ni cifras que no estén en su web.
- Si falta un dato, dejá el campo vacío: la muestra se arma igual.

## 2. Fotos del propio negocio
Usá fotos que **ellos ya publican** (su web o su Instagram) para mostrarles cómo quedaría. Se suben con `POST /api/muestras/fotos` (descarga, valida, pasa a WebP y guarda). Nunca fotos de stock presentadas como suyas. Si no hay fotos propias, la muestra va sin fotos.

## 3. Armá el JSON
Copiá un ejemplo de `scripts/muestras/ejemplos/` (el más parecido al rubro), a `scripts/muestras/pendientes/<slug>.json`, y completalo. El slug es el nombre del negocio y la zona, en minúsculas y con guiones: `estudio-perez-san-isidro`.

## 4. Generá y revisá
```bash
node scripts/muestras/generar.mjs scripts/muestras/pendientes/estudio-perez-san-isidro.json --out /tmp/muestra.html
```
Abrí el HTML en el celular (o con capturas a 375 px) y mirá: ¿se ve bien? ¿Los datos son todos ciertos? ¿Algo suena a invento? Si algo se ve flojo, no se manda.

## 5. Publicala
Con OK de Valentín, se carga en la tabla `muestras` (el generador imprime el `insert` con `--sql`). El link queda en `https://valentin.dev/demo/<slug>`. La página no se indexa en Google y avisa que es una propuesta, no el sitio actual del negocio.

## 6. Mandala
Con la plantilla de mail o WhatsApp con muestra (`outbound/plantillas/`), `{{link_muestra}}` = el link del paso 5. **El envío lo aprueba Valentín.**

## Cuando el negocio responde
- Si le gusta → CRM: `muestra_enviada` → `propuesta`, y se habla de alcance y precio (que sale de `catalogo.ts`).
- Si no → `perdido`, y se puede borrar la muestra (`delete from public.muestras where slug = '<slug>';`).
