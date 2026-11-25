# Secuencia de seguimiento

Después del primer mail: **hasta 3 seguimientos**, separados por al menos 3 días, y después se cierra. Si responde (sí o no), la secuencia se corta en el momento. Si pide la baja, va a `bajas`.

Calendario sugerido: día 0 primer mail · día 3 seguimiento 1 · día 7 seguimiento 2 · día 14 cierre.

Variables: `{{nombre}}`, `{{negocio}}`, `{{link_muestra}}`.

## Seguimiento 1 (día 3)

---8<---
Asunto: Re: Una idea para la web de {{negocio}}

Hola {{nombre}}, te escribo por si el mail anterior se perdió. Te dejo de nuevo la idea que armé para {{negocio}}: {{link_muestra}}

Si querés cambiar algo, lo ajusto.

Valentín

Si no querés que te escriba más, respondé "baja" y listo.
---8<---

## Seguimiento 2 (día 7)

---8<---
Asunto: Re: Una idea para la web de {{negocio}}

Hola {{nombre}}, sé que hay mil cosas. Una sola pregunta: ¿la web es algo que tengan pensado renovar este año, o no es prioridad ahora? Con eso sé si vale la pena que te vuelva a escribir.

Valentín

Si no querés que te escriba más, respondé "baja" y listo.
---8<---

## Cierre (día 14)

---8<---
Asunto: Re: Una idea para la web de {{negocio}}

Hola {{nombre}}, no quiero llenarte la casilla, así que este es mi último mail. La idea para {{negocio}} queda acá por si más adelante la querés ver: {{link_muestra}}

Mucha suerte con todo.

Valentín
---8<---

## Si responde

- **"Sí, contame"** → paso a `contactado` en el CRM, respondo yo en el día y propongo una charla corta.
- **"Cuánto sale"** → uso la plantilla de WhatsApp "Si pregunta cuánto sale" (los precios salen del catálogo).
- **"No"** → agradezco una vez, paso a `perdido`, no escribo más.
- **"Baja" o parecido** → lo cargo en `bajas` ya mismo.
