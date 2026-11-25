# valentin.dev — Web visual system v2.0

Este addendum es específico del sitio aprobado en las seis referencias. El `design.md` original permanece intacto y sirve para futuras piezas de branding. **Para esta web, este documento prevalece cuando exista conflicto.**

| Tema | Manual original | Web aprobada — aplicar aquí |
|---|---|---|
| Logo | v.d sobre paralelogramo | Monograma `vd` con dos píxeles, amarillo sobre negro, asset original; lockup blanco separado |
| Contenedores | 0–12 px de radio | Squircle de esquinas continuas; tarjetas 24–32 px a 1536 px; CTA 22–28 px, no óvalo perfecto |
| Highlights | Rectangulares, mate | Cápsula ligeramente sesgada, curvas suaves, amarillo plano con inversión localizada de letras |
| Motion | Reveal breve y sin ciclos permanentes | Horizonte ambiental continuo y rehighlight a 5 s mientras visible, con pausa y reduced motion |
| Materialidad | Textura analógica y sin glow | Curvas suaves carbón/amarillo, rim light fino blanco cálido y bloom localizado, paneles oscuros discretos |
| Layout | Hero editorial variable | Hero centrado monumental, luego portfolio, reunión, sobre mí, vendedores y footer, exactamente en ese orden |
| Tipografía | Neue Montreal Regular/Medium/Bold | Mantener familia; usar Bold Italic/Oblique en titulares grandes; UI y párrafos rectos |

## Tokens base

```css
:root {
  --vd-black: #0A0A0A; --vd-yellow: #FFE600; --vd-white: #F5F5F0;
  --vd-surface: #141414; --vd-surface-hover: #1B1B1B;
  --vd-text-muted: #C4C4BE; --vd-border: #383838; --vd-control-border: #737373;
  --vd-radius-button: 24px; --vd-radius-card: 28px; --vd-radius-sm: 14px;
  --vd-max: 1440px; --vd-gutter: clamp(20px, 6.8vw, 116px);
  --vd-ease: cubic-bezier(.22,1,.36,1);
}
```

Peso de color global 60/30/10 como intención, no auditoría de píxeles. Negro profundo manda; amarillo en CTA, highlight, logo y luces. Blanco roto para letras y brillos finos; grises solo derivados para jerarquía. Las previews del portfolio son la excepción de color por pertenecer a trabajos reales. Sin verde lima ni tonos naranja/mostaza como color de interfaz. La iluminación ambiental puede mezclar valores de negro/amarillo/blanco sin cambiar los tokens.

## Tipografía y escala

Familia primaria Neue Montreal autorizada: regular 400, medium 500, bold 700, bold italic/oblique 700. No simular que hay fuente licenciada si no la hay. Inter con itálica real o fuente existente autorizada como fallback; ajustar ancho, altura y tracking mediante comparación. No incluir archivos de fuentes de terceros sin licencia. Sans recta en navegación, cuerpo y botones. H1 desktop de referencia ~104 px a 1672 de ancho, `clamp(50px, 6.7vw, 124px)` como punto inicial; line-height .97–1.04, tracking -0.045em. H2 66–88 px a 1536, `clamp(36px, 5vw, 96px)`, line-height 1.0. H3 22–27 px; cuerpo 20–26 px en secciones amplias, 16–18 px móvil; botones 16–21 px. No cambiar a serif para el sitio general. Usar tracking ligeramente negativo en display, no en texto pequeño. Comparar ancho de cada línea con la imagen, no solo tamaño nominal.

## Componentes

**Lockup:** monograma transparente de `assets/brand/monogram-transparent.png` con proporción original, ~72×43 px a 1536; a su derecha `valentin.dev` blanco 24–26 px bold, gap 10–14. No recortar píxeles superiores. Usar PNG/fuente HTML; no falsificar vector original.

**CTA primario:** amarillo sólido, texto negro medio/bold, icono noreste; altura 60–68 desktop, 52–56 móvil; padding 26–40 px, radio 22–28 con curva continua. CTA secundario transparente, borde gris legible 1 px, blanco, mismas proporciones. Hover: brillo breve localizado por pseudo-elemento y elevación de 1–2 px; active: escala .98; foco: outline visible. No poner flechas/triángulos sin significado, no hacer botones falsos.

**Highlight:** palabra o frase en negro sobre amarillo plano; en reposo tiene padding óptico .14–.22em horizontal y .03–.08em vertical; radio proporcional 0.24em–0.30em; leve inclinación coherente con display. La forma no debe ser un óvalo; el texto no debe inclinarse dos veces. En movimiento se usa máscara sincronizada para cambiar exactamente el color donde aparece la franja. No afectar el ancho ni salto de línea durante animación.

**Cards:** 24–32 px radio en grandes, 14–22 px pequeños. Usar `corner-shape: squircle` solo cuando el navegador lo soporte, fallback border-radius y, si se necesita exactitud, máscara SVG. No recortar el outline de foco. Paneles de reunión/portrait/vendedores pueden tener inclinación de 3–6° y rim light concentrado en una esquina; elementos realmente interactivos deben quedar legibles y sin distorsión excesiva. No todas las tarjetas tienen glow. En portfolio la captura manda; no teñir el proyecto de amarillo.

**Fondos:** no usar un gradiente negro-amarillo global por sección. Construir formas negras con rellenos sutiles, crestas Bezier, dos capas de luz (línea fina nítida + halo suave), sombras oscuras y masas amarillas localizadas. Una trayectoria grande arriba/abajo según sección y zonas tranquilas detrás del texto. Consultar `MOTION.md` y el SVG de estudio. Mantener línea de horizonte coherente entre secciones, sin repetición literal del mismo arco ni bordes rectangulares abruptos. No edificios, nebulosas, esferas, render cromado genérico o animación de partículas sin sentido.

**Iconografía:** SVG outline coherente, grosor 1.7–2, tamaño 18–24 en botones y 28–34 en features. No emojis. Usar recursos disponibles, no iconos genéricos de colores. Iconos puramente decorativos `aria-hidden`.

## Layout y responsive

Desktop: recrear geometría relativa de las referencias. Contenedor hero ~86% ancho, portfolio ~92%, CTA/about ~86%, vendedores ~89%, footer ~86%. Usar grilla flexible y `max-width` generoso, sin convertir todo a columnas de SaaS. Hero ~100svh en desktop con contenido libre de recorte; resto altura natural alrededor de 0.9–1.05 viewport en ancho de referencia. Separación por curvas, no padding vacío arbitrario.

Tablet: mantener dos columnas solo si texto y UI legibles; carrusel 2–3 tarjetas visibles. Móvil: 16–24 px gutter, menú hamburguesa cerrado, H1 centrado con 2–4 líneas, CTA cómodos, portfolio con scroll snap 1 tarjeta + peek de la siguiente; CTA/about/vendedores en una columna, portrait sin deformar, beneficios en 2 columnas si caben o en una. Footer en grilla de dos o una columna. Ningún scroll horizontal de la página salvo el carrusel interno. No forzar seis pantallas de altura fija en móvil. Revisar 320 px y zoom.
