# Los primeros 9 posts de Instagram

Formato de cada pieza: **1080×1350 (4:5)**, un archivo por slide. Ritmo del feed (design.md §12.5): `N` negro · `Y` amarillo · `W` blanco roto.

```
1 N / Statement     2 N / Caso real     3 Y / Oferta
4 N / Quién soy     5 Y / Proceso       6 N / Portfolio
7 W / Editorial     8 N / Opinión       9 Y / Lanzamiento
```

Todas las piezas llevan el wordmark `valentin.dev` pequeño, el número de slide discreto y **una sola acción al final**. Los precios y condiciones salen de tokens (`node scripts/outbound/render.mjs content/instagram-primeros-9.md` los rellena para ver el texto final).

---

## Post 1 · N · Statement — «Tu web no tiene que parecerse a todas las demás.»
- **Pieza:** 1 imagen. Fondo negro, titular blanco en 3 líneas; «parecerse a todas las demás» en bloque amarillo con texto negro. Escalera de píxeles pequeña abajo a la derecha.
- **Texto exacto:** «Tu web no tiene que parecerse a todas las demás.»
- **Pie:** «Diseño y programo webs a medida para negocios de Argentina. Hablás conmigo, sin intermediarios. Contame tu proyecto por mensaje.»
- **Guion/idea:** presenta la postura de la marca. Sin foto ni captura.

## Post 2 · N · Caso real — R&D Abogados
- **Pieza:** carrusel de 4 slides.
  1. Captura grande de la portada de rydabogados.com.ar (`public/trabajos/rydabogados-esc.jpg`). Texto: «Un estudio jurídico, una web clara.»
  2. Captura en celular (`rydabogados-cel.jpg`). Texto: «Pensada para leerse en el celular.»
  3. Lo que tiene: «Áreas de práctica · Jurisdicciones · Formulario de contacto con motivo.»
  4. Cierre: «¿El tuyo es el próximo?» + «Escribime».
- **Pie:** «Un estudio jurídico de Buenos Aires. Sitio institucional con áreas de práctica, jurisdicciones y formulario de contacto. Podés verlo en rydabogados.com.ar.»
- **Antes de publicar:** confirmar con el estudio que se puede mostrar.

## Post 3 · Y · Oferta — Precios claros
- **Pieza:** 1 imagen amarilla, texto negro, tres líneas alineadas a la izquierda con la grilla de precios.
- **Texto exacto:**
  - «Landing — {{precio:landing}}»
  - «Web a medida con sistema de consultas — {{precio:web}}»
  - «CRM o agente de voz — {{precio:sistema}}»
  - Línea de pie: «Web a medida: {{pago_web}}. Lista en {{plazo_web}}.»
- **Pie:** «Precios en dólares, sin letra chica. Si no sabés cuál te sirve, contame tu negocio y te oriento.»
- **Sin** descuentos ni urgencia.

## Post 4 · N · Quién soy
- **Pieza:** 1 imagen. Dos versiones según haya foto: **(a)** con una foto real de Valentín en blanco y negro (recorte asimétrico) o **(b)** solo tipografía.
- **Texto exacto:** «Soy Valentín. Diseño y programo webs. Lo que hablás conmigo es lo que se construye.»
- **Pie:** «Trabajo solo, y por eso respondo yo. Si tenés un negocio y una web que no te convence, escribime.»
- **Pendiente:** foto real si se elige la versión (a). No usar fotos generadas por IA de una persona.

## Post 5 · Y · Proceso — 4 pasos
- **Pieza:** carrusel de 5 slides, amarillo y negro alternados.
  1. «Así trabajo. 4 pasos.»
  2. «01 — Me contás qué necesitás.»
  3. «02 — Propuesta y arranque.»
  4. «03 — Lo diseño y lo programo en {{plazo_web}}.»
  5. «04 — Se publica. Dominio y hosting el primer año.» + «Hablemos».
- **Pie:** «Sin sorpresas: sabés qué se hace, cuánto sale y cuándo. En la web a medida, el pago es {{pago_web}}.»

## Post 6 · N · Portfolio — Melisa Masegosa, abogada
- **Pieza:** carrusel de 3 slides con las capturas reales (`masegosa-esc.jpg`, `masegosa-cel.jpg`).
  1. «Una abogada, un sitio que se entiende.»
  2. Captura de escritorio + «Reserva de turnos online.»
  3. Captura de celular + «Consulta directa por WhatsApp.»
- **Pie:** «Sitio personal de una abogada de Pilar y CABA, con agenda de turnos online y consulta por WhatsApp. abogadamasegosa.com»
- **Antes de publicar:** confirmar con ella que se puede mostrar.

## Post 7 · W · Editorial — Una web no necesita 20 páginas
- **Pieza:** 1 imagen en blanco roto, texto negro, titular grande, línea fina divisoria, flecha noreste pequeña.
- **Texto exacto:** «Una web no necesita 20 páginas. Necesita que se entienda qué hacés.»
- **Pie:** «Lo primero que miro de la web de un negocio es si en 5 segundos entiendo qué ofrece y cómo contactarlo. El resto es secundario.»

## Post 8 · N · Opinión — Mirá tu web en el celular
- **Pieza:** 1 imagen. Fondo negro, «Mirá tu web desde el celular.» y debajo, en gris: «Ahora imaginá que sos un cliente nuevo.»
- **Pie:** «Mucha gente encuentra un negocio desde el celular. Si el menú se corta o no se entiende cómo contactar, se va. Hacé la prueba hoy.»
- **Guion/idea:** apela a una prueba que cualquiera puede hacer; no usa cifras.

## Post 9 · Y · Lanzamiento — REBLOOM, de cero a tienda
- **Pieza:** carrusel de 4 slides con capturas de rebloomactive.com (`rebloom-esc.jpg`, `rebloom-cel.jpg`).
  1. «Una marca de ropa de Pilates, de cero a preventa.»
  2. «Lookbook y fichas de producto.»
  3. «Guía de talles.»
  4. «Reserva y pago con Mercado Pago.» + «Escribime».
- **Pie:** «Sitio de una marca de ropa de Pilates con lookbook, guía de talles, preventa con reserva y pago con Mercado Pago. rebloomactive.com»
- **Antes de publicar:** confirmar con la marca. **No** usar el código de descuento ni textos de su preventa como si fueran míos.
- **Nota:** si se prefiere un post de «valentin.dev ya está online» (lanzamiento de la agencia), usarlo solo cuando el dominio esté publicado y funcionando.
