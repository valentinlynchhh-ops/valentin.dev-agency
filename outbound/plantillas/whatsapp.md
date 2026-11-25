# WhatsApp

Un solo mensaje, a un número que el negocio publica como contacto comercial. Sin audios, sin insistir.

Variables: `{{nombre}}`, `{{negocio}}`, `{{detalle}}` (una frase que empieza con "vi que…", ver `mail-frio.md`), `{{link_muestra}}`.

## Primer contacto (con muestra)

---8<---
Hola {{nombre}}, ¿cómo va? Soy Valentín, hago páginas web para negocios. Estuve mirando {{negocio}} y {{detalle}}. Armé una idea de cómo podría verse tu web con tus fotos: {{link_muestra}}

Si no es para vos, decime y no te molesto más.
---8<---

## Primer contacto (sin muestra)

---8<---
Hola {{nombre}}, ¿cómo va? Soy Valentín, diseño y programo webs para negocios. Estuve mirando {{negocio}} y {{detalle}}. ¿Querés que te muestre una idea de cómo se podría resolver? Es sin compromiso.
---8<---

## Si pregunta cuánto sale

---8<---
Una landing sale {{precio:landing}} y una web completa con sistema de consultas {{precio:web}}. En la web, el pago es {{pago_web}}, y queda lista en {{plazo_web}}. ¿Te cuento cómo sería la tuya?
---8<---

## Si dice que no
Respondo "Gracias por avisarme, no te escribo más." y lo anoto en el CRM como perdido. No vuelvo a escribirle.
