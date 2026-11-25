---
description: Arma una muestra web para un negocio con sus propias fotos y deja el link listo para mandar
argument-hint: <nombre del negocio> [link de Instagram o web del negocio]
---

Armá una muestra para: $ARGUMENTS

Seguí `docs/muestras.md` al pie de la letra. Resumen:

1. Reuní **solo datos verificables** del negocio (su web, Instagram o Google Maps): nombre, rubro, ciudad, qué ofrece, horarios y contacto si están publicados. Nada inventado: ni reseñas, ni cifras, ni años de trayectoria.
2. Las fotos son **del propio negocio** y se usan para mostrarle cómo quedaría. Si no hay fotos propias, armá la muestra sin fotos; nunca pongas fotos de stock como si fueran suyas.
3. Escribí el JSON en `scripts/muestras/pendientes/<slug>.json` con el formato de `scripts/muestras/ejemplos/`.
4. Generá y revisá: `node scripts/muestras/generar.mjs scripts/muestras/pendientes/<slug>.json`. Sacá capturas a 375 px y a 1440 px y mirá que no se vea floja.
5. Cargala en la tabla `muestras` (pedime OK antes de escribir en Supabase) y devolveme el link `/demo/<slug>`.
6. **No le escribas al negocio.** Dejá el mail o WhatsApp en borrador (usá `outbound/`) para que lo apruebe Valentín.
