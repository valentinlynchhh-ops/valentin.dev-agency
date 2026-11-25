# valentin.dev — DESIGN.md

**Versión 1.0 · Sistema maestro de identidad visual · ES / instrucciones compatibles con LLMs**

> Este archivo es la especificación normativa de la identidad visual de valentin.dev. Adjuntarlo junto con la carta de branding aprobada (`branding-reference.png`) a cualquier conversación de diseño, generación de imágenes o implementación web. No tratarlo como un moodboard opcional: conservar sus invariantes, adaptar únicamente lo que corresponda al formato y objetivo comercial.

## 0. Instrucción maestra para cualquier modelo

Actuá como director de arte, diseñador de identidad senior y, cuando corresponda, diseñador de producto y desarrollador frontend. Tu responsabilidad es entregar una pieza que pertenezca inequívocamente a valentin.dev y que parezca diseñada por un profesional que tomó decisiones deliberadas, no una plantilla genérica generada por IA. La identidad es personal, independiente, digital, editorial, neo-brutalista refinada, de contraste alto, con referencias a impresión analógica y gráfica industrial. No es una marca de carreras, ropa urbana, gaming, criptomonedas ni una agencia corporativa convencional.

### Contrato de ejecución

1. Leé todo el archivo y examiná la referencia aprobada antes de diseñar.
2. Identificá entregable, audiencia, canal, idioma, objetivo y acción esperada. Si el brief ya los define, no preguntes otra vez. Si falta algo no crítico, asumí una opción conservadora e indicá la decisión solo cuando sea útil.
3. Separá **identidad** (estable) de **composición** (adaptable) y **contenido** (específico de cada pieza).
4. Elegí una idea visual dominante y una jerarquía inequívoca. No combines todos los recursos de este archivo en cada diseño.
5. Respetá el negro dominante, amarillo cálido y blanco roto, el wordmark, el sistema tipográfico, la geometría y el lenguaje editorial.
6. Si el usuario pide una imagen, generá la pieza terminada, no un mockup de la pieza ni un esquema del prompt. Si pide una web funcional, entregá código o implementación real, no una captura ficticia de una web. Si pide un archivo editable, mantené capas, texto y componentes editables cuando la herramienta lo permita.
7. No inventes clientes, cifras, testimonios, logos de terceros, premios, proyectos, resultados ni disponibilidad comercial. No uses placeholders visibles en una entrega final salvo que el usuario solicite una plantilla.
8. Verificá el resultado con la rúbrica de calidad del final. Si hay fallas, corregí antes de entregar cuando la herramienta lo permita.

### Prioridad de fuentes

- El pedido actual define contenido, formato y restricciones particulares. Una modificación explícita de identidad del usuario prevalece sobre este archivo para esa tarea.
- Este archivo fija los valores exactos de implementación: colores, reglas, componentes y restricciones.
- La **última carta aprobada** fija la dirección visual, la forma del wordmark y la sensibilidad editorial. Las referencias anteriores son inspiración secundaria y no deben reintroducir amarillo ácido ni exceso de collage.
- Las reglas de legibilidad, accesibilidad, funcionamiento y veracidad prevalecen sobre una solución decorativa.
- No extrapolar de un mockup que una tipografía, dominio, registro de marca o activo está legalmente disponible.

### ADN en una frase

**Independent creative developer. Swiss editorial discipline × refined neo-brutalism × warm signal yellow × restrained analogue print.**

En español: desarrollador creativo independiente, con precisión editorial, brutalismo digital refinado, amarillo de señalización cálido y una sensibilidad de impresión física controlada.

## 1. Posicionamiento y personalidad

### Identidad

- Nombre visible: `valentin.dev` (todo en minúsculas).
- Categoría: marca personal de diseño y desarrollo digital; no una agencia impersonal.
- Ámbitos: Product, Design, Web Development, Growth. Son áreas de trabajo, no promesas de resultados.
- Idea central: contacto directo con la persona que piensa, diseña y construye el proyecto.
- Audiencia: empresas, fundadores, profesionales y equipos que valoran diseño cuidado y soluciones digitales reales.
- Percepción deseada: criterio, independencia, precisión, claridad, iniciativa, solvencia técnica y un punto de rebeldía visual.
- No transmitir: improvisación amateur, lujo ostentoso, hype de IA, agresividad comercial, estética de consultora genérica.

### Voz y copy

Usar primera persona singular cuando se hable del trabajo personal ("Diseño", "Desarrollo", "Trabajo directamente con vos"). Usar plural solo cuando exista un equipo real y el contexto lo justifique. Español rioplatense natural para Argentina; inglés natural para público internacional. No mezclar idiomas por decoración: las etiquetas técnicas en inglés son aceptables si forman parte del sistema gráfico, pero el mensaje principal debe estar en el idioma de la audiencia.

Frases cortas, verbos concretos, titulares con intención. Un titular puede dividirse en dos o tres líneas para énfasis; no separar palabras arbitrariamente. Evitar "transformamos tu presencia digital", "llevamos tu negocio al siguiente nivel", "soluciones innovadoras", "revolucionario", "la mejor agencia" y lenguaje inflado. El diseño debe vender con claridad, evidencia y personalidad, no con promesas vacías.

Ejemplos opcionales (no slogans obligatorios):

| Contexto | Copy |
|---|---|
| Hero ES | Diseño y desarrollo digital. Sin intermediarios. |
| Hero EN | Independent by design. |
| Oferta | Tu próxima web, diseñada y desarrollada conmigo. |
| Portfolio | Del problema al producto. |
| Editorial | Menos ruido. Más intención. |
| CTA | Hablemos de tu proyecto. |
| Referencia visual aprobada | Web / Products / Growth. |

No usar ® ni ™ como adorno si no se ha confirmado la condición legal o si el usuario no lo solicita. No afirmar que `valentin.dev` es un dominio activo o propio sin verificarlo.

## 2. Sistema cromático — fuente de verdad

La distribución objetivo de la identidad es **60% negro / 30% amarillo / 10% blanco roto**. Esta proporción describe el peso visual global, no exige que cada pieza tenga exactamente esa cantidad de píxeles. Una publicación amarilla puede formar parte de un sistema mayoritariamente negro. Una pantalla de lectura puede necesitar más blanco tipográfico. Mantener siempre la familia cromática y el contraste.

| Token | Nombre | HEX | RGB | Rol |
|---|---|---|---|---|
| brand.black | Carbon Black | `#0A0A0A` | 10, 10, 10 | Fondo principal, tinta sobre amarillo/blanco |
| brand.yellow | Signal Yellow | `#FFE600` | 255, 230, 0 | Acento, titulares resaltados, botones, bloques, símbolo |
| brand.white | Paper White | `#F5F5F0` | 245, 245, 240 | Texto sobre negro, soporte editorial |

El amarillo es **amarillo puro cálido, intenso y ligeramente dorado**, no chartreuse ni lima neón. No usar `#D7FF00`, `#EFFF2A`, verdes ácidos, naranja, mostaza o dorado metalizado. No confundir brillo con emisión de luz: el amarillo es plano, mate, sólido, no glow. Los HEX son los que figuran en la última referencia aprobada; son el estándar digital incluso si la imagen rasterizada exhibe variaciones por textura, iluminación o compresión.

### Tonos funcionales derivados (no nuevos colores de marca)

| Token | Valor | Uso |
|---|---|---|
| surface.raised | `#141414` | Panel oscuro secundario, modal |
| surface.hover | `#202020` | Hover discreto |
| border.subtle | `#343434` | Divisores no interactivos |
| border.control | `#737373` | Contorno de controles que requiere contraste |
| text.secondary | `#A3A3A0` | Texto secundario sobre negro |
| text.muted.light | `#555552` | Texto secundario sobre papel |
| yellow.hover | `#EBD300` | Hover de CTA amarillo |

Estos grises se derivan de los neutros para usabilidad; no aparecen como paleta protagonista. Estados semánticos de error, éxito o advertencia pueden usar color funcional accesible si es indispensable en producto, siempre con texto/icono adicional, nunca como extensión de la identidad promocional.

### Parejas cromáticas y accesibilidad

- Negro sobre amarillo: titular, botón, etiqueta, símbolo. Excelente contraste.
- Blanco roto sobre negro: lectura, titulares y navegación.
- Amarillo sobre negro: enlaces, foco, énfasis y gráficos.
- Negro sobre blanco roto: piezas de lectura y papelería.
- Blanco sobre amarillo: prohibido para texto informativo; contraste insuficiente.
- Amarillo sobre blanco: no usar para texto o iconos funcionales; puede ser una forma decorativa con contorno negro.
- Texto normal: objetivo WCAG 2.2 AA de 4.5:1; texto grande y elementos UI relevantes: 3:1 cuando corresponda. Medir combinaciones reales, incluidas imágenes y estados.

### Reglas de proporción

Para una pieza oscura estándar: fondo negro amplio, un bloque o highlight amarillo claramente visible, texto blanco roto; no convertir el 30% amarillo en decenas de acentos diminutos. En una campaña de 10 piezas, alternar aproximadamente 6 oscuras, 3 amarillas y 1 clara como punto de partida, sin confundir cantidad de piezas con proporción exacta de superficie.

No usar gradientes cromáticos de marca, sombras amarillas, resplandores, glassmorphism ni fondos arcoíris. Las transiciones tonales naturales de fotografías monocromáticas sí están permitidas. La impresión física requiere perfil ICC de imprenta y prueba de color: no prometer equivalencia CMYK exacta con el amarillo de pantalla.

## 3. Wordmark, monograma y arquitectura de marca

### 3.1 Wordmark principal

La referencia aprobada muestra `valentin.dev` en sans grotesca pesada de minúsculas. `valentin` en blanco roto, `.dev` en negro con inclinación óptica, sobre un paralelogramo amarillo inclinado hacia adelante. El punto pertenece al nombre y debe aparecer una sola vez, con alineación y espaciado óptico coherentes. El conjunto debe sentirse como una única firma, no dos marcas pegadas.

- Fondo preferente negro.
- Peso bold, kerning compacto pero no apelmazado.
- Caja amarilla sólida, sin bordes ni sombra. Inclinación aproximada 10–13 grados respecto de la vertical como regla inicial de reconstrucción; ajustar ópticamente contra la referencia.
- Mantener texto nítido y sin deformaciones arbitrarias. La inclinación del texto no debe perjudicar la lectura de `dev`.
- Margen interno de la caja suficiente para que las letras no toquen el borde. No recortar ascendentes ni la v.
- No cambiar el punto por guion, barra, estrella, dos puntos ni otro carácter.
- No capitalizar `Valentin.Dev`, `VALENTIN.DEV` ni usar acento en el wordmark. El nombre personal en copy sí puede llevar tilde.

### 3.2 Variantes autorizadas

| Variante | Aplicación |
|---|---|
| Principal bicolor | Hero, portada, pieza institucional |
| Wordmark monocromo blanco | Navbar oscura, firma pequeña, footer |
| Wordmark monocromo negro | Fondo amarillo o papel, impresión a una tinta |
| Monograma `v.d` negro sobre paralelogramo amarillo | Sticker, marca secundaria, aplicaciones compactas |
| Flecha noreste dentro de cuadrado de contorno blanco | Icono secundario de acción o motivo visual; no sustituye al wordmark como marca primaria |

El monograma es secundario; no inventar una familia de isotipos nuevos por pieza. Si se utiliza favicon, preferir `v.d` simplificado o una adaptación aprobada y comprobar legibilidad a 16, 32 y 48 px. No usar la flecha como logo único si la marca no queda identificable.

### 3.3 Espacio, escala y activos

Unidad de protección propuesta: `x = altura de la v minúscula`. Mantener al menos 0.5x alrededor del wordmark en usos generales y 1x en portadas con aire. Tamaño mínimo inicial digital: wordmark principal 140 px de ancho; monocromo 96 px; monograma 24 px. Validar visualmente en contexto. En impresión, probar wordmark a 30 mm y monograma a 8 mm antes de fijar mínimos de producción.

No estirar, comprimir, rotar todo el wordmark, agregar biseles, contornos, efectos cromados, glitch animado permanente o sombras. No colocarlo directamente sobre una foto ruidosa. Usar versión sólida y fondo adecuado.

**Importante:** la carta aprobada es una imagen rasterizada, no un logotipo vectorial maestro. Estas reglas son una reconstrucción normativa propuesta. Para reproducción idéntica, crear una versión vectorial, ajustar ópticamente con la referencia, aprobarla y conservarla como SVG/PDF. A partir de entonces, insertar el mismo activo; no pedir a un modelo generativo que redibuje el logo cada vez. No recortar una captura de baja resolución y presentarla como vector original.

Nombres de activos recomendados (crear cuando existan, no asumir que ya están disponibles):

```text
assets/brand/wordmark-primary.svg
assets/brand/wordmark-white.svg
assets/brand/wordmark-black.svg
assets/brand/monogram.svg
assets/brand/favicon.svg
assets/brand/graphic-step.svg
assets/brand/graphic-arrow.svg
assets/brand/texture-paper.webp
assets/brand/texture-halftone.svg
```

## 4. Tipografía — sistema editorial

### Familia principal

**Neue Montreal**, de estética grotesca contemporánea, es la referencia tipográfica aprobada. Usar Regular, Medium y Bold según los archivos de fuente legítimamente disponibles. No asumir que se dispone de licencia web o de redistribución. Si no está disponible, usar una alternativa autorizada y ajustar métricas; no declarar falsamente que se está usando la fuente original.

Fallback recomendado: Inter → Helvetica Neue → Arial → sans-serif. Space Grotesk puede utilizarse si se aprueba una alternativa con carácter más tecnológico, no mezclarla automáticamente con Neue Montreal. Una sola familia principal por pieza.

Familia auxiliar opcional para etiquetas de código, folios y metadatos: IBM Plex Mono o monospace del sistema. No usar monoespaciada para párrafos largos o botones por defecto. Limitarla a aproximadamente 5–10% de la superficie tipográfica.

### Escala web (puntos de partida responsivos)

| Rol | Desktop | Mobile | Peso | Interlineado | Tracking |
|---|---|---|---|---|---|
| Display XL | 96–144 px | 48–68 px | 700 | 0.90–0.98 | -0.055em |
| H1 | 64–96 px | 40–56 px | 700 | 0.98–1.04 | -0.045em |
| H2 | 40–64 px | 30–40 px | 700 | 1.05 | -0.035em |
| H3 | 24–32 px | 22–28 px | 600–700 | 1.15 | -0.02em |
| Lead | 22–26 px | 18–22 px | 400–500 | 1.35 | -0.01em |
| Body | 16–18 px | 16–18 px | 400 | 1.5–1.65 | 0 |
| UI | 14–16 px | 14–16 px | 500–600 | 1.3 | 0 |
| Caption | 12–13 px | 12–13 px | 400–500 | 1.4 | 0.015em |
| Label mono | 11–13 px | 11–13 px | 400–500 | 1.4 | 0.04em |

No fijar un display de 144 px en móvil. Usar `clamp()` y cortes de línea deliberados. Para texto corrido, ancho recomendado 45–70 caracteres. No justificar párrafos. Preferir alineación izquierda. Centrar únicamente cuando la composición lo pida.

### Composición de titulares

- Uno o dos pesos visuales por titular, no cinco estilos.
- Un highlight amarillo puede encerrar una palabra o una línea clave. Texto negro dentro del highlight.
- Highlight rectangular con padding óptico horizontal de 0.12–0.20em y vertical de 0.02–0.08em; ajustar por fuente. No convertirlo en píldora redondeada.
- Alternar titulares blancos sobre negro con bloques amarillos. No resaltar cada palabra.
- Las mayúsculas completas funcionan para declaraciones y etiquetas cortas; para comunicación personal, preferir sentence case cuando sea más natural.
- No utilizar tipografías futuristas de ciencia ficción, stencil militar, scripts caligráficos, fuentes de carreras ni texto con contorno como estilo dominante.
- Corregir tildes, signos, tracking y viudas. En imágenes generadas, solicitar texto mínimo y comprobar ortografía; si hay errores, componer el texto posteriormente con herramientas tipográficas.

## 5. Gramática gráfica

La identidad se reconoce por relaciones entre pocos recursos, no por acumular símbolos. Cada composición utiliza **un motivo principal y hasta dos auxiliares**, además del wordmark si corresponde.

| Motivo | Construcción | Uso recomendado | Evitar |
|---|---|---|---|
| Escalera pixelada | Módulos cuadrados unidos, ascenso diagonal, sin esquinas redondeadas | Bordes de imágenes, transición de sección, esquina de cartel | Pixel art multicolor o efecto glitch aleatorio |
| Flecha noreste | Dos brazos ortogonales de igual peso, diagonal ascendente | CTA, señal editorial, dirección de lectura | Repetir flechas por toda la pieza |
| Asterisco de ocho brazos | Cuatro ejes cruzados, trazo uniforme, centro común | Sello editorial, detalle puntual | Confundir con logo principal o con marca ajena |
| Globo wireframe | Elipse y líneas meridianas/paralelos finos | Metadatos globales, recursos digitales | Planeta 3D cromado, hologramas |
| Líneas divisorias | Trazo fino de 1 px en web, gris o blanco moderado | Estructura editorial | Enmarcar compulsivamente todo |
| Halftone | Puntos circulares monocromos en retícula regular | Fotografía tratada, transición tonal, fondo parcial | Ruido aleatorio, semitono de colores |
| Diagonal sólida | Banda o paralelogramo amarillo | Firma `.dev`, sticker, énfasis | Convertir la página en una gráfica de carreras |

### Construcción modular propuesta

Usar una unidad `u` de 8 px en web o 1/120 del lado corto en gráfica, ajustada a escala. Una escalera típica de 4–5 niveles usa bloques de 1u a 3u, sin redondeo; su silueta es una forma continua, no una nube de cuadraditos. La flecha usa terminaciones rectas, ángulos precisos y un ancho de trazo de 1/7 a 1/9 de su caja. El asterisco usa ocho rayos equidistantes. El globo debe ser lineal, de menor peso que la flecha. Estos parámetros son propuestas de sistematización para futuros SVG, no medidas extraídas de un vector original.

### Restricciones

No usar cinta WARNING literal, checkerboard dominante, rayos agresivos de motorsport, llamas, cyberpunk, emojis decorativos, ilustraciones de robots, cubos 3D, órbitas luminosas, partículas, blobs, redes neuronales, iconografía stock o pseudo-código como relleno. La estética industrial existe como precisión y materialidad, no como disfraz temático.

## 6. Materialidad, fotografía y textura

La última referencia aprobada incluye papel amarillo arrugado, plástico transparente sobre negro, trama de puntos, hormigón monocromático, tela negra y papelería. Son un vocabulario **secundario**. El efecto artesanal surge de la selección y la edición, no de ensuciar todo.

| Material | Dirección | Límite de uso |
|---|---|---|
| Papel amarillo | Tinta plana, fibra fina, arrugas reales, bordes naturales | Una pieza protagonista o recorte localizado |
| Papel blanco roto | Mate, grano de papel, bordes limpios o un corte natural | Tarjetas, folios, etiquetas |
| Plástico transparente | Reflejos especulares reales sobre negro, pliegues verosímiles | Foto o textura parcial; no overlay global |
| Hormigón | Arquitectura, luz lateral, grano mineral sutil, escala creíble | Fondo de foto, no UI interactiva |
| Halftone | Puntos regulares, alto contraste, aspecto de impresión | Zona delimitada, una sola escala de trama por pieza |
| Tela negra | Tejido mate, macro realista, etiqueta amarilla | Aplicaciones físicas si aportan al concepto |

### Intensidad de textura

- Web funcional: superficies UI limpias. Textura únicamente en imágenes, portadas o pseudo-elementos decorativos de baja opacidad, típicamente 2–5% si se usa grano. Nunca sobre inputs o texto pequeño.
- Social editorial: una textura principal con presencia visible y, opcionalmente, una secundaria pequeña. Aproximadamente 10–20% de la composición puede estar materialmente tratada si el concepto lo pide.
- Branding board: muestras acotadas de varios materiales, con áreas de descanso.
- Documentos comerciales: casi ninguna textura; priorizar lectura.

No aplicar filtros vintage globales, polvo en todas las esquinas, arañazos falsos, bordes rasgados en cada tarjeta, papel flotante con sombras imposibles, efecto VHS, brillo de IA ni grano tan fuerte que cambie el color de marca.

### Fotografía

Monocromática, realista, editorial, contrastada sin destruir detalle. Luz natural lateral o luz de estudio sencilla. Recortes intencionales, perspectiva coherente, profundidad de campo creíble. Sujetos relevantes: el desarrollador real, escritorio real, proceso, arquitectura, material, detalles de producto, pantallas reales. Evitar ejecutivos stock sonriendo, manos de IA sobre laptops, modelos genéricos que parezcan representar al fundador, fondos de oficina inventados, poses de lujo, objetos sin propósito.

Si se pide foto personal, usar una referencia autorizada del usuario; no inventar su cara ni representar una persona generada como él. Si no hay referencia, usar composición tipográfica, imágenes de trabajo reales o una fotografía conceptual sin atribución personal. No fingir que un mockup representa un cliente real. No usar fotografías de terceros sin derechos adecuados.

## 7. Layout, grilla y ritmo

### Sistema de composición

Neo-brutalismo refinado significa planos sólidos, bordes definidos, contraste fuerte y jerarquía directa, combinado con rigor editorial suizo. No significa llenar todo de tarjetas con bordes negros y sombras de 8 px.

- Una idea dominante por pantalla o pieza; una zona de descanso clara.
- Alineaciones comunes entre titulares, texto, imágenes y metadatos.
- Asimetría intencional: un bloque dominante y otro secundario, unidos por la grilla.
- Evitar centrado sistemático, simetría de plantilla, mosaicos bento sin necesidad, filas de seis tarjetas idénticas.
- Permitir cortes editoriales de imágenes y titulares grandes sin recortar información esencial.
- Mantener margen seguro uniforme; una ruptura de grilla debe tener intención visible.
- Evitar diagonales múltiples compitiendo con el wordmark.

### Grilla web

| Breakpoint | Columnas | Margen horizontal | Gutter |
|---|---|---|---|
| 360–639 px | 4 | 20 px (16 px en casos estrechos) | 12 px |
| 640–1023 px | 8 | 32 px | 20 px |
| 1024–1439 px | 12 | 48 px | 24 px |
| 1440+ px | 12 | 64–80 px | 24–32 px |

Ancho máximo orientativo de contenido: 1440 px. Secciones de lectura: 680–780 px. Imágenes full bleed permitidas si respetan la jerarquía. Ritmo vertical desktop: 96–144 px entre secciones, 48–72 px en móvil. Evitar que las secciones sean obligatoriamente de 100vh; el contenido determina su altura.

### Espaciado

Escala de 4 px: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 144`. Usar pocas medidas repetidas. Distancia entre elementos relacionados menor que distancia entre grupos. Alineación óptica puede corregirse 1–3 px sin romper el sistema.

### Bordes y elevación

Radio base: 0 px para bloques editoriales y CTA principal. 2–4 px para controles cuando la legibilidad lo requiera. 8–12 px solo para contenedores de producto, mockups de dispositivos o elementos funcionales específicos. Nada de píldoras por defecto. Bordes de 1 px; 2 px en estados de foco o elementos expresivos. Sombras: ninguna por defecto; una sombra dura y corta de 3–4 px solo en una pieza gráfica deliberadamente brutalista. Modales pueden usar sombra funcional neutra. No neumorphism.

## 8. Design tokens — implementación agnóstica al framework

Usar variables semánticas. No repetir hexadecimales arbitrarios en cada componente. El siguiente CSS es una base normativa propuesta; puede incorporarse a React, Astro, HTML, Next.js, Vue, Svelte o cualquier otro entorno. No requiere una librería de UI específica.

```css
:root {
  color-scheme: dark;
  --brand-black: #0A0A0A;
  --brand-yellow: #FFE600;
  --brand-white: #F5F5F0;
  --surface: var(--brand-black);
  --surface-raised: #141414;
  --surface-hover: #202020;
  --text: var(--brand-white);
  --text-secondary: #A3A3A0;
  --border: #343434;
  --border-control: #737373;
  --accent: var(--brand-yellow);
  --accent-hover: #EBD300;
  --on-accent: var(--brand-black);
  --font-display: 'Neue Montreal', Inter, 'Helvetica Neue', Arial, sans-serif;
  --font-body: var(--font-display);
  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-bold: 700;
  --display-xl: clamp(3rem, 9vw, 9rem);
  --h1: clamp(2.5rem, 6.7vw, 6rem);
  --h2: clamp(1.875rem, 4.4vw, 4rem);
  --h3: clamp(1.375rem, 2.2vw, 2rem);
  --body-size: clamp(1rem, 1.25vw, 1.125rem);
  --tracking-display: -0.055em;
  --tracking-heading: -0.035em;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-30: 120px;
  --space-36: 144px;
  --radius-editorial: 0px;
  --radius-control: 2px;
  --radius-functional: 8px;
  --line: 1px;
  --max-width: 1440px;
  --gutter: 24px;
  --page-margin: clamp(20px, 5vw, 80px);
  --duration-fast: 150ms;
  --duration-normal: 240ms;
  --duration-editorial: 420ms;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
[data-surface='paper'] {
  color-scheme: light;
  --surface: var(--brand-white);
  --text: var(--brand-black);
  --text-secondary: #555552;
  --border: #D1D1CC;
  --border-control: #737373;
}
[data-surface='yellow'] {
  color-scheme: light;
  --surface: var(--brand-yellow);
  --text: var(--brand-black);
  --text-secondary: #3D3700;
  --border: #827600;
  --border-control: #0A0A0A;
}
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; background: var(--surface); color: var(--text); font-family: var(--font-body); font-size: var(--body-size); line-height: 1.55; }
img { display: block; max-width: 100%; height: auto; }
button, input, textarea, select { font: inherit; }
a { color: inherit; }
::selection { background: var(--brand-yellow); color: var(--brand-black); }
:focus-visible { outline: 2px solid var(--brand-yellow); outline-offset: 4px; }
[data-surface='paper'] :focus-visible,
[data-surface='yellow'] :focus-visible { outline-color: var(--brand-black); }
.container { width: 100%; max-width: var(--max-width); margin-inline: auto; padding-inline: var(--page-margin); }
.display { font-family: var(--font-display); font-size: var(--display-xl); font-weight: var(--weight-bold); line-height: .96; letter-spacing: var(--tracking-display); }
.heading { font-size: var(--h1); font-weight: var(--weight-bold); line-height: 1.02; letter-spacing: var(--tracking-heading); }
.highlight { background: var(--brand-yellow); color: var(--brand-black); padding: .02em .14em .06em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.label { font-family: var(--font-mono); font-size: .75rem; letter-spacing: .04em; line-height: 1.4; }
@media (max-width: 639px) {
  :root { --gutter: 12px; --page-margin: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```

Definir `@font-face` solo si se dispone de archivos y licencia. Utilizar `font-display: swap`; no bloquear el render esperando la fuente. No inventar rutas a fuentes o assets. Si existe un repositorio, inspeccionar antes de modificarlo, respetar su arquitectura y preservar funcionalidad.

### Mapeo opcional a sistemas de componentes

- Tailwind: mapear `background`, `foreground`, `primary`, `primary-foreground`, `muted`, `border`, `ring` a los tokens equivalentes. No usar por defecto los valores morados, azulados o radios de una plantilla.
- shadcn/ui u otro kit: reutilizar su semántica, teclado y accesibilidad, pero ajustar visualmente radios, tipografía, bordes, pesos y paleta. No copiar su apariencia sin modificar.
- Figma: crear variables de color primitivas y semánticas, estilos tipográficos, auto layout, componentes con variantes y documentación de uso. Crear los assets vectoriales una vez aprobados.
- Generadores de imágenes: expresar los mismos tokens como colores visuales y relaciones compositivas. El código CSS no garantiza colores exactos dentro de una imagen generada; corregir con edición posterior si se requiere exactitud de píxel.

## 9. Biblioteca de componentes UI

Los componentes deben ser sólidos, utilizables, accesibles y de apariencia propia. Los siguientes son contratos de comportamiento y presentación, no una obligación de usar todos en cada producto.

### 9.1 Botones

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| Primary | Yellow | Black | Ninguno o 1 px yellow | Acción principal |
| Secondary dark | Transparente | White | 1 px gris de control | Acción secundaria |
| Secondary light | Transparente | Black | 1 px black | Fondo papel/amarillo |
| Inverse | Black | White | 1 px black | Acción principal sobre amarillo |
| Text | Transparente | Color de texto con subrayado o flecha | Ninguno | Navegación, links secundarios |

Altura visual 48–56 px para CTA; padding horizontal 20–28 px; tipografía 15–16 px medium/bold; radio 0–2 px. Una flecha noreste de 16–20 px es opcional. Alinear texto e icono con gap 12 px. En móvil, usar ancho completo cuando beneficie la acción. No usar botones enormes sin motivo. Objetivo táctil 44×44 px o superior, incluidos botones icon-only.

Estados: default → hover (cambio de tono o inversión clara) → active (cambio breve sin desplazamiento de layout) → focus-visible (contorno visible) → loading (mantener ancho y comunicar estado) → disabled (contraste razonable, no interactivo, motivo explicado si es relevante). No ocultar el texto al mostrar un spinner. No animar continuamente la flecha. No presentar controles decorativos que parezcan accionables.

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 12px; min-height: 48px; padding: 12px 24px;
  border: 1px solid transparent; border-radius: var(--radius-control);
  font-weight: 700; font-size: 1rem; line-height: 1.2;
  text-decoration: none; cursor: pointer;
  transition: background-color var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast);
}
.btn-primary { background: var(--brand-yellow); color: var(--brand-black); }
.btn-primary:hover { background: var(--accent-hover); }
.btn-outline { color: var(--text); border-color: var(--border-control); background: transparent; }
.btn-outline:hover { background: var(--text); color: var(--surface); }
.btn:disabled, .btn[aria-disabled='true'] { opacity: .55; cursor: not-allowed; }
```

En enlaces con `aria-disabled`, impedir activación mediante lógica real o no renderizar el enlace; el atributo por sí solo no lo deshabilita.

### 9.2 Navegación y header

Header de 64–80 px, fondo negro, wordmark monocromo o bicolor pequeño a la izquierda, links concisos a la derecha. CTA amarillo solo cuando se justifique. Divisor inferior discreto. No encerrar todo en una píldora flotante. Navegación sticky opcional, sin tapar anclas ni foco. Mobile: logo, botón de menú etiquetado, panel accesible, cierre por Escape, devolver foco al disparador. Mostrar estado activo con subrayado amarillo o indicador inequívoco, no solo color.

### 9.3 Hero

El hero debe presentar la persona, qué hace y para quién, no un eslogan abstracto de tres palabras que no explica nada. Composición típica: etiqueta pequeña, H1 grande, una línea resaltada, párrafo de 1–3 líneas, un CTA primario, link secundario y prueba visual real cuando exista. No colocar cinco CTAs, logos de marcas inventadas o una barra de métricas ficticias. Una foto real puede acompañar, pero no es obligatoria. Evitar renderizar una laptop genérica como foco cuando los proyectos reales son más útiles.

### 9.4 Cards y listas de servicios

Preferir listados editoriales con línea divisoria y numeración (`01 /`, `02 /`, etc.) antes que seis cards genéricas con iconos. Una card oscura usa fondo negro/raised, borde sutil, padding 24–32 px, radio 0–4 px, título de 24–32 px. Una card amarilla puede ser destacada solo si hay motivo. Las tarjetas de portfolio usan imagen real en ratio 4:3 o 16:10, título, descripción de una línea, categoría y enlace. Mostrar estado hover y foco sin transformar toda la card en una animación exagerada. No anidar botones dentro de un enlace que ocupa toda la card.

### 9.5 Formularios

Labels visibles arriba de cada campo; placeholder solo como ejemplo. Altura 48–52 px, borde de control, fondo negro/raised, texto blanco, padding 12–16 px. Campo de textarea con altura inicial 120–160 px. Foco amarillo sobre negro y negro sobre papel. Errores debajo del campo con mensaje accionable; relacionar con `aria-describedby`; indicar requerido de forma comprensible. Validar en frontend y backend cuando corresponda. Mantener valores al fallar, estados de envío y confirmación real. No pedir datos que no sean necesarios. No incluir formularios simulados o promesas de respuesta no confirmadas.

### 9.6 Tags, badges y metadatos

Tags editoriales rectangulares, 11–13 px, uppercase opcional, borde de 1 px o fondo amarillo para un único estado relevante. No usar diez tags de colores. Metadatos como `01 / PROJECT`, `WEB DEVELOPMENT`, `2026` solo si aportan información. No inventar coordenadas, códigos de barras o números de serie para simular profundidad visual. Un barcode decorativo no debe aparentar ser un código escaneable funcional.

### 9.7 Divisores, acordeones y tabs

Divisor de 1 px alineado a la grilla. Acordeón: encabezado legible, icono plus/minus, estados expandidos accesibles y transición discreta, soporte teclado. Tabs: fila de etiquetas con subrayado o fondo amarillo en activo; scroll horizontal controlado en móvil si es necesario. Si el control es navegación, usar enlaces; si cambia paneles, usar semántica de tabs. No crear interacciones por decoración.

### 9.8 Modales, menús y avisos

Modal con overlay oscuro neutro, panel elevado, bordes definidos, título y cierre explícito. Atrapado de foco cuando corresponde, Escape, devolución de foco, scroll interno. Toasts con mensajes útiles y duración suficiente; errores críticos persistentes. Evitar overlays que bloqueen contenido por marketing. No usar animación de escala elástica.

### 9.9 Datos, tablas y dashboards

Cuando el pedido sea un CRM, producto o dashboard de valentin.dev, preservar el sistema pero priorizar densidad funcional y lectura: fondo negro/raised, encabezados claros, números alineados, separadores discretos, amarillo para métrica clave o acción, gráficos con colores diferenciables y etiquetas. No usar amarillo en todas las series. Colores semánticos son excepción funcional. Tablas responsivas con scroll o vistas adaptadas, no cortar datos. Estados vacíos explican la siguiente acción, no usan ilustraciones stock. Skeletons solo mientras hay carga real y sin pulsos agresivos.

### 9.10 Footer

Una firma personal, links relevantes, contacto real, información legal si aplica. Puede cerrar con bloque amarillo amplio y CTA negro. No agregar columnas ficticias de una empresa de cien empleados. Mostrar año dinámico solo si se implementa correctamente. No agregar ®. No repetir todos los servicios tres veces.

## 10. Arquitectura web — del brief a la implementación

### 10.1 Landing de marca personal: patrón recomendado

El orden es adaptable; no hay que incluir secciones sin contenido real.

| Orden | Sección | Contenido y composición |
|---|---|---|
| 01 | Header | Wordmark, trabajos, servicios, contacto; links reales |
| 02 | Hero | H1 orientado a valor, primera persona, highlight amarillo, CTA principal |
| 03 | Selected work | 2–4 proyectos reales con captura, problema y rol; grilla asimétrica |
| 04 | Services | Lista editorial numerada de servicios, entregables claros |
| 05 | About | Presentación personal breve y foto real opcional; explicar cómo trabaja |
| 06 | Process | 3–4 pasos concretos: entender, diseñar, construir, iterar; adaptar al proceso real |
| 07 | Proof | Casos, métricas, testimonios verificables; omitir si no existen |
| 08 | FAQ | Solo dudas relevantes de contratación |
| 09 | Contact | Bloque amarillo o negro con CTA destacado, contacto real |
| 10 | Footer | Firma y enlaces |

El sitio debe sentirse como portfolio de un profesional independiente, no como una landing de SaaS financiada por inversores. Priorizar imágenes de trabajos reales y una propuesta de valor específica. Nunca fabricar logos de clientes ni cifras de conversión.

### 10.2 Wireframe conceptual desktop

```text
┌──────────────────────────────────────────────────────────┐
│ valentin.dev              Trabajo   Servicios   Contacto │
├──────────────────────────────────────────────────────────┤
│  INDEPENDENT CREATIVE DEVELOPER                          │
│  Diseño y desarrollo             [imagen real /          │
│  digital.                        proyecto real /        │
│  [ Sin intermediarios. ]         motivo modular]        │
│  Explicación breve y concreta.                           │
│  [ Hablemos ↗ ]   Ver proyectos                          │
├──────────────────────────────────────────────────────────┤
│  01 / TRABAJO SELECCIONADO                              │
│  [ proyecto principal amplio ]    [ segundo proyecto ]  │
│  Título / rol / resultado real                           │
├──────────────────────────────────────────────────────────┤
│  02 / SERVICIOS                                         │
│  01  Diseño web                 Descripción          ↗  │
│  02  Desarrollo                 Descripción          ↗  │
├──────────────────────────────────────────────────────────┤
│  [bloque amarillo] ¿Qué estás construyendo?             │
│  [ Hablemos ↗ ]                                         │
└──────────────────────────────────────────────────────────┘
```

No reproducir este esquema literalmente si el contenido exige otro. En móvil, mantener el orden lógico de lectura y evitar imágenes decorativas que empujen el CTA demasiado abajo.

### 10.3 Requisitos de producción

- HTML semántico, un H1 principal coherente, orden de headings lógico, landmarks y skip link.
- WCAG 2.2 AA como objetivo de diseño: navegación por teclado, foco visible, labels, contraste, alt text útil, información no dependiente del color, soporte de zoom y reducción de movimiento.
- Responsive real a 320, 360, 390, 768, 1024, 1440 y 1920 px; probar overflow, títulos, navegación y formularios. No esconder funcionalidades importantes en móvil.
- Imágenes optimizadas, tamaños definidos para evitar layout shift, `srcset`/`sizes` cuando corresponde, lazy loading bajo el fold, prioridad solo para el recurso LCP real.
- Objetivos de rendimiento orientativos: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 en datos de campo cuando estén disponibles. No garantizar resultados sin medición. Auditar con herramientas apropiadas.
- No agregar librerías pesadas para efectos menores. Usar CSS/SVG para motivos geométricos. Evitar canvas/WebGL si no aporta a la tarea.
- SEO real: title, description, canonical si se conoce, Open Graph, favicon, contenido indexable. No inventar URL canónica ni rutas inexistentes. Structured data solo si es veraz.
- Formularios, CTAs, links, navegación y estados deben funcionar. No inventar servicios de email, bases de datos, endpoints ni secretos. Si faltan credenciales o integración, informar qué está pendiente y no simular un envío exitoso.
- No reescribir backend o arquitectura existente solo por razones visuales. Inspeccionar el proyecto antes de editar. Mantener configuraciones y funcionalidades no relacionadas.
- Si se entrega código, incluir instrucciones de ejecución y dependencias reales. Si se entrega diseño visual, dejar claro que no es una web funcional.

### 10.4 Motion design

La energía nace del ritmo, no de animar todo. Microinteracciones 120–180 ms; transiciones de panel 200–300 ms; reveal editorial 300–450 ms. Desplazamientos de 4–16 px como máximo para reveal discreto. Curva ease-out. Hover de flecha: 2–4 px opcionales. Cambio de imagen en portfolio sin reflow. No ocultar contenido esencial hasta que JavaScript anime. No scroll hijacking, cursores custom obligatorios, textos que persiguen el puntero, parallax intenso, marquesinas automáticas sin control o animaciones infinitas distractoras. Si una marquesina es necesaria, permitir pausa y respetar reduced motion.

## 11. Dirección de imágenes generativas

### 11.1 Reglas de generación y edición

El objetivo no es pedir "sin IA" como palabra mágica; es eliminar causas observables de apariencia sintética: exceso de efectos, tipografía inconsistente, materiales imposibles, anatomía incorrecta, iluminación incoherente, objetos genéricos, falsa profundidad, layouts sin criterio.

- Mantener plano 2D por defecto para piezas gráficas. No mostrar la pieza fotografiada sobre una mesa salvo que se solicite mockup.
- Para assets fotográficos, indicar sujeto, encuadre, iluminación, material y tratamiento; no llenar el prompt de adjetivos contradictorios.
- Preferir una sola pieza final por imagen, salvo que el usuario pida una plancha o carrusel.
- Mantener texto breve. Si la ortografía y geometría exactas son críticas, generar fotografía o textura sin texto y componer tipografía, logo, CTA y colores posteriormente mediante herramientas vectoriales o de layout.
- Usar la referencia adjunta como guía de identidad, no recrear el branding board completo cuando se solicita un post individual.
- No copiar exactamente el contenido de referencias ajenas: extraer lenguaje, producir composición original.
- No usar marcas de agua, firmas ficticias, texto ilegible, bordes de interfaz del generador ni pseudo-metadata.

### 11.2 Prompt base — para generación de una pieza visual

Copiar este bloque y reemplazar las variables. Adjuntar este archivo y la referencia aprobada si el modelo admite adjuntos.

```text
Design ONE finished, original visual for valentin.dev, an independent creative developer.
Read DESIGN.md in full and use the attached approved branding board as the identity reference, not as the layout to copy.

DELIVERABLE: [poster / Instagram post / LinkedIn creative / web hero visual / cover / etc.]
DIMENSIONS AND ASPECT RATIO: [specify]
AUDIENCE: [specify]
OBJECTIVE: [specify]
EXACT COPY: [specify; do not invent extra text]
REAL ASSETS: [attached photos / screenshots / vector wordmark / none]

Art direction: refined neo-brutalism, independent editorial graphic design, Swiss-inspired typographic discipline, restrained analogue print materiality.
Color identity: carbon black #0A0A0A dominant (60%), warm pure signal yellow #FFE600 (30%), paper white #F5F5F0 (10%). Not acid lime, not mustard, not orange. Flat matte color, no colored gradients or glow.
Typography: Neue Montreal style grotesk, bold headlines, carefully kerned, compact leading, clean regular body type. Optional restrained mono metadata.
Composition: asymmetric but precisely aligned, one dominant idea, ample negative space, clear reading order, controlled grid, no generic card mosaic. Use ONE signature graphic motif such as the stepped pixel block or northeast arrow; at most two secondary motifs.
Wordmark: valentin.dev lowercase. Preserve the approved logo. If a vector logo is supplied, leave an appropriate reserved area or insert it without redrawing, as the tool permits.
Material: black-and-white editorial photography or one restrained tactile print texture only when it adds meaning. Crisp text, believable physical detail, natural grain, no fake distressed overlay across everything.
Make it look like a carefully art-directed independent design studio project, not a generic AI-generated agency template.
Output the actual requested design, edge to edge, not a mockup, unless a mockup is explicitly requested.
Do not add invented claims, logos, random text, copyright marks or stock placeholders.
```

### 11.3 Negative direction / anti-slop

```text
Avoid: neon lime or chartreuse, gradients, glassmorphism, glows, 3D floating shapes, fake chrome, excessive grain, torn paper everywhere, generic device mockups, distorted type, fake microtext, meaningless barcodes, duplicated arrows, excessive badges, rounded SaaS cards, symmetrical template layouts, fake stock founders, plastic skin, artificial hands, cinematic lighting unrelated to the subject, arbitrary diagonal stripes, motorsport clichés, futuristic UI decoration, fake metrics, fake testimonials, watermark, oversaturated colors, compositional clutter.
```

Negative prompts are guidance, not a substitute for visual verification. Some models do not support a separate negative-prompt field; include these restrictions in the primary prompt.

### 11.4 Prompt — asset fotográfico o textura

```text
Create a single photographic asset, NOT a complete design and NO TEXT.
Subject: [specific material / real attached person / architecture / workspace].
Framing: [specific crop]. Lighting: natural directional side light, physically plausible shadows.
Treatment: neutral monochrome, deep charcoal blacks with retained shadow detail, paper-like highlights, restrained real photographic grain, sharp focal point, clean composition.
For yellow paper only: matte warm signal yellow matching #FFE600 under neutral light, realistic fine paper fibers, one natural fold or edge, no excessive damage.
Leave [specified area] quiet for later typography. No logos, graphics, fake handwriting or invented people represented as real.
```

### 11.5 Prompt — edición conservadora

```text
Edit the attached approved piece rather than redesigning it.
LOCK: wordmark, typography family and hierarchy, #0A0A0A / #FFE600 / #F5F5F0 palette, layout alignment, proportions, motif geometry, texture character, and all elements not explicitly named below.
CHANGE ONLY: [list exact changes].
Keep the same composition and visual identity. Do not introduce new symbols, gradients, fonts, colors, or decoration. Maintain exact spelling and legibility. If the requested edit conflicts with a locked element, explain the conflict briefly or apply only the explicit override.
```

## 12. Social media — Instagram, LinkedIn y anuncios

### 12.1 Formatos de trabajo

Tamaños de producción recomendados, no afirmación de límites actuales de plataformas. Las plataformas cambian recortes y requisitos; verificar antes de publicar cuando sea importante.

| Formato | Canvas recomendado | Margen editorial inicial |
|---|---|---|
| Instagram feed vertical | 1080×1350, 4:5 | 64–80 px |
| Instagram feed cuadrado | 1080×1080, 1:1 | 64 px |
| Stories / Reels cover | 1080×1920, 9:16 | Laterales 64 px; reservar zonas de interfaz arriba/abajo según plataforma |
| LinkedIn post vertical | 1080×1350, 4:5 | 72 px |
| LinkedIn post cuadrado | 1200×1200, 1:1 | 72 px |
| Open Graph / preview web | 1200×630, 1.91:1 aprox. | 72 px, contenido esencial central |
| Creatividad horizontal | 1200×628 o según placement | 64–80 px |
| Carrusel | 1080×1350 por slide, tamaño uniforme | 64–80 px |

Para covers de perfiles, banners o placements publicitarios, confirmar las dimensiones y zonas cubiertas por avatares/interfaz específicas. No prometer que cualquier imagen se verá completa en todos los recortes.

### 12.2 Tipografía de una pieza social de 1080 px de ancho

- Titular dominante: 96–160 px según longitud y composición.
- Subtitular: 40–56 px.
- Texto explicativo: 28–40 px si es indispensable.
- Metadata: 20–26 px, no usarla para información esencial.
- Wordmark: aprox. 150–260 px de ancho según rol.
- Validar a escala de pantalla de 360 px: el mensaje principal debe entenderse sin zoom. No reducir texto para hacerlo caber; editar el copy.

### 12.3 Familias de creatividades

**A. Statement / posicionamiento.** Fondo negro, titular blanco de 2–4 líneas, una palabra en bloque amarillo, firma pequeña, un gesto gráfico. Sin foto por defecto. Objetivo: recordar quién es la marca y qué piensa.

**B. Proof / caso real.** Captura real del trabajo o foto del producto, título claro, contexto breve, rol específico y resultado verificable si existe. No sobrecargar con cinco pantallas minúsculas. La imagen del producto debe ocupar espacio suficiente para que se reconozca.

**C. Founder / personal.** Foto real monocromática, recorte editorial asimétrico, pequeño bloque amarillo o escalera modular, texto en primera persona. No inventar retrato. No aplicar pixelación sobre toda la cara si la intención es generar confianza; conservar identificación y expresión.

**D. Offer / adquisición.** Beneficio específico y para quién, qué se entrega, un CTA. Precio, plazo y alcance solo si están confirmados. Fondo negro o amarillo; priorizar claridad sobre efectos.

**E. Process / educación.** Numeración editorial, pasos reales, una captura de proceso o diagrama simple. Un concepto por slide; no convertirlo en infografía llena de iconos.

**F. Launch / anuncio.** Titular de lanzamiento, evidencia visual del producto, CTA o URL real. Banda amarilla localizada. No usar cuenta regresiva ficticia.

**G. Editorial / opinión.** Una frase relevante con tipografía protagonista; puede usar papel blanco y texto negro como descanso en el feed. No fabricar citas de terceros.

### 12.4 Carruseles

Estructura adaptable de 5–7 slides: hook → contexto → problema → explicación → ejemplo/prueba → conclusión → CTA. No alargar artificialmente si se puede explicar en tres. Mantener el mismo ancho, grilla, familia tipográfica, folio y posición general del wordmark. Alternar fondos para ritmo: negro dominante, uno o dos amarillos, blanco ocasional. La numeración es discreta. El primer slide funciona solo; cada slide añade información; el último invita a una acción concreta. Entregar cada slide como imagen separada si se solicita publicación, no solamente un collage de preview.

### 12.5 Feed coherente sin plantilla repetitiva

Ejemplo de nueve publicaciones (N = negro, Y = amarillo, W = blanco):

```text
N / Caso real     N / Statement    Y / Oferta
N / Founder       Y / Proceso      N / Portfolio
W / Editorial     N / Opinión      Y / Lanzamiento
```

Esto es una guía de ritmo, no un mosaico obligatorio. Cada pieza debe poder compartirse de manera independiente. No cortar imágenes o titulares entre posts para lograr un puzzle de feed salvo petición expresa.

### 12.6 Ads: claridad y pruebas

Un creativo debe responder rápidamente: ¿qué ofrece?, ¿a quién?, ¿por qué importa?, ¿qué hago después? No confundir identidad estética con eficacia comercial. Crear variantes controladas si se solicita test: misma marca y oferta, cambiar una variable (hook, foto, formato o CTA). No afirmar que una creatividad convertirá más sin evidencia. Para publicidad, no diseñar botones falsos que simulen controles de plataforma ni testimonios inexistentes.

### 12.7 Prompt — post Instagram o LinkedIn

```text
Create a single finished [Instagram / LinkedIn] graphic for valentin.dev.
Use DESIGN.md and the approved branding board. Canvas [1080x1350 or other specified size].
Post type: [statement / proof / founder / offer / process / launch / editorial].
Audience: [audience]. Objective: [one objective].
Exact headline: "[headline]".
Optional supporting copy: "[copy]".
CTA: "[CTA or none]".
Use only supplied real project images or portraits. If none, use a typography-led design.
Choose a dominant black layout, warm #FFE600 highlight and paper-white typography, or a controlled yellow-led variant if the campaign calls for it. Strong typographic hierarchy, editorial asymmetric grid, one graphic motif, substantial negative space. No fake microtext, gradients, generic mockups, excessive textures, or extra claims.
Output only the actual full-bleed post design, not a phone screen, collage, frame or mockup. Check spelling and readable crop at thumbnail size.
```

## 13. Otras aplicaciones de marca

### 13.1 Presentaciones comerciales y propuestas

Formato 16:9 para presentaciones, A4 o formato de lectura móvil para documentos según el pedido. Portada negra con wordmark y un título claro. Una idea por slide, titulares grandes, párrafos breves y cifras solo verificadas. Slides de lectura pueden ser papel blanco. Usar amarillo para resumen visual, precio o CTA, no para bloques largos de texto blanco. Las propuestas deben distinguir alcance, exclusiones, entregables, cronograma estimado y precio/condiciones si se han definido. No usar textura detrás de términos comerciales ni inventar garantías.

### 13.2 Miniaturas y video

Para miniaturas 16:9, un sujeto o titular dominante, contraste a escala pequeña, logo secundario. Motion en bloques sólidos, corte directo, tipografía cinética controlada. No usar transiciones glitch permanentes. Subtítulos de alto contraste, no tapar contenido relevante. Intro de marca breve cuando tenga sentido; no añadir cinco segundos de logo a todo video.

### 13.3 Tarjetas, stickers y aplicaciones físicas

Tarjeta propuesta de 85×55 mm (confirmar imprenta), cara negra con wordmark claro, reverso amarillo con contacto real y monograma opcional. Margen seguro inicial 4 mm y sangrado típico 3 mm sujeto a proveedor. Usar archivos vectoriales, fuentes trazadas cuando lo pida imprenta y pruebas de color. Sticker amarillo rectangular o paralelogramo con `v.d` negro; sin ®. No simular relieve o foil si no se pidió ese acabado. Tela negra con etiqueta amarilla es aplicación opcional, no pieza obligatoria.

### 13.4 Email y firma personal

Email legible, texto HTML real, fondo neutro, wordmark pequeño y un CTA si corresponde. No convertir el email entero en una imagen. Fallback para clientes sin imágenes, alt text, compatibilidad razonable con dark mode. Firma sencilla con nombre, rol y contacto confirmado. Evitar banners enormes, cinco iconos sociales y claims inventados.

### 13.5 Adaptación a productos de terceros

Si valentin.dev diseña una web para un cliente, **no imponer automáticamente su branding personal a la marca del cliente**. Usar este sistema para la presentación del caso, el portfolio, las propuestas y los creativos propios. Para el sitio del cliente, respetar su propia identidad salvo que el usuario solicite un diseño co-branded o una dirección específica. Distinguir marca del desarrollador de marca del producto.

## 14. Prompt maestro — diseño e implementación de una web

```text
Act as a senior independent digital art director and frontend engineer. Read the attached DESIGN.md and approved valentin.dev branding board before working.

TASK: [build / redesign / design a landing page / portfolio / product UI].
BUSINESS AND AUDIENCE: [details].
PRIMARY USER ACTION: [contact / request demo / buy / view work / other].
CONTENT AND REAL ASSETS: [provided].
STACK AND REPOSITORY: [provided or choose only if needed].

Follow the exact visual identity tokens: #0A0A0A black, #FFE600 warm signal yellow, #F5F5F0 paper white, roughly 60/30/10 visual weight. Neue Montreal where legitimately available, approved fallback otherwise. Bold editorial typography, asymmetric disciplined grid, restrained modular graphics, minimal decoration, crisp rectangular components, monochrome real photography only as needed.
Preserve the personal developer positioning: no generic agency claims, no fictitious team, no fabricated testimonials or metrics. Use first-person copy when appropriate.

Work from the content hierarchy first. Design a distinctive hero that clearly says what is offered. Use selected real work and conversion-oriented sections. Avoid repeated SaaS bento grids, generic template cards, decorative gradients, glassmorphism, stock illustrations, fake dashboards, gratuitous animations and random text.

If implementing, produce functioning responsive code with semantic HTML, keyboard navigation, visible focus, accessible contrast, working links and honest form states. Use the provided CSS tokens and component rules. Optimize assets and respect reduced motion. Inspect and preserve existing project functionality; do not invent endpoints, credentials or available fonts. Do not substitute a screenshot for working code.

If creating a visual design only, output the actual requested page composition with a coherent responsive plan, not a decorative laptop mockup. Do not invent project content.

Before delivering, run the DESIGN.md quality checklist and fix any identity, readability, accessibility or functionality issues you can verify. State only actual blockers or assumptions that matter.
```

## 15. Ejemplos de briefs listos para reutilizar

### A. Hero de portfolio personal

```text
Adjunto design.md y branding-reference.png. Diseñá el hero de valentin.dev para captar clientes que necesitan diseño y desarrollo web. En español rioplatense. Usá un H1 concreto, primera persona, CTA para conversar y link a trabajos. No inventes clientes ni resultados. Fondo negro, amarillo cálido y tipografía editorial grande. Si no adjunté foto personal, hacelo tipográfico. Entregá [imagen / código funcional, elegir].
```

### B. Post orgánico de LinkedIn

```text
Adjunto mi identidad. Creá una imagen 1080×1350 para LinkedIn, con el titular exacto: «Tu web no tiene que parecerse a todas las demás.» La marca es valentin.dev. Negro dominante, bloque amarillo en la frase clave, blanco roto, una escalera pixelada pequeña. Sin modelos, laptops genéricas ni textura exagerada. Quiero una sola imagen final lista para publicar.
```

### C. Caso de estudio

```text
Usá design.md, la referencia aprobada y estas capturas reales del proyecto. Diseñá un carrusel de cinco slides que muestre problema, decisión de diseño, implementación, resultado verificable y CTA. No inventes resultados. Cada slide debe ser una imagen separada de 1080×1350. Mantené la misma grilla y tipografía, con variación de composición. Capturas reales grandes, no mockups de IA.
```

### D. Creativo de venta

```text
Creá una pieza de adquisición para valentin.dev usando el sistema adjunto. Oferta real: [oferta]. Público: [público]. CTA: [acción]. Formato [placement]. Una sola promesa concreta respaldada por el brief. No agregar descuentos ni urgencia ficticia. Priorizar comprensión en miniatura y contraste de marca. Entregar una sola creatividad final.
```

### E. Edición de una pieza existente

```text
Adjunto design.md, branding-reference.png y la pieza a editar. Mantené exactamente su composición, logo, tipografía, texturas y proporciones. Cambiá únicamente [cambio]. No rediseñes el resto. Si falta espacio para el nuevo texto, ajustá el mínimo indispensable preservando la jerarquía.
```

## 16. Control de calidad anti-AI-slop

El aspecto humano no se consigue añadiendo ruido. Se consigue con decisiones específicas, consistencia y edición. Auditar cada entrega en tres escalas: miniatura, tamaño normal de uso y detalle ampliado.

| Problema detectable | Corrección |
|---|---|
| Parece una agencia de plantilla | Propuesta personal y concreta; composición asimétrica; eliminar cards repetidas y copy genérico |
| Parece motorsport o streetwear | Reducir diagonales, advertencias y texturas; recuperar tipografía editorial y evidencia digital |
| Amarillo verdoso | Volver a #FFE600, corregir perfil de color o regenerar el bloque |
| Logo cambia entre piezas | Insertar el activo maestro; no redibujarlo cada vez |
| Todo tiene borde o caja | Eliminar contenedores sin función; usar aire y alineación |
| Todo está destacado | Elegir una sola palabra, bloque o acción dominante |
| Tipografía deforme o con errores | Recomponer con texto real, ajustar kerning y ortografía |
| Exceso de papel rasgado o plástico | Conservar un único gesto material con función compositiva |
| Fotografía artificial | Usar foto real o eliminar figura; verificar luz, anatomía, perspectiva y escala |
| Web bonita pero inútil | Corregir navegación, jerarquía, copy, CTA, formularios y responsive |
| Falsa sofisticación | Eliminar pseudo-código, microtexto ilegible, coordenadas y números decorativos |
| Contenido ilegible en móvil | Editar copy, aumentar tamaño y ajustar grilla; no comprimir toda la composición |
| Repetición de la referencia | Conservar reglas, cambiar concepto y composición según contenido |
| Demasiado vacío sin intención | Ajustar escala, jerarquía y equilibrio; no llenar por llenar |
| Una pieza totalmente genérica | Incorporar un motivo propio, firma personal y contenido específico |

### Rúbrica de revisión interna (100 puntos)

| Criterio | Peso |
|---|---:|
| Fidelidad cromática y contraste | 15 |
| Consistencia de wordmark y tipografía | 15 |
| Jerarquía, grilla, aire y composición | 20 |
| Identidad distintiva y ausencia de adornos genéricos | 15 |
| Adecuación al objetivo y claridad comercial | 15 |
| Calidad técnica, legibilidad y accesibilidad aplicable | 15 |
| Veracidad de textos, fotos, claims y activos | 5 |

Objetivo interno: 90/100 o más después de revisión. No inventar una puntuación validada por terceros ni afirmar que un archivo fue comprobado si no se inspeccionó. Una falla crítica (logo incorrecto, contenido falso, texto ilegible, formato incorrecto, función rota o barrera de accesibilidad grave) obliga a corregir aunque la puntuación estimada sea alta.

### Checklist antes de entregar

- [ ] `valentin.dev` está escrito correctamente, en minúsculas, sin símbolos legales no autorizados.
- [ ] Se mantiene la proporción cromática global y el amarillo no es ácido.
- [ ] Hay una idea dominante y un orden de lectura claro.
- [ ] Tipografía, interlineado y espaciado están cuidados.
- [ ] No hay exceso de símbolos, ruido, mockups ni efectos.
- [ ] Se usa la marca personal y no una voz de agencia ficticia.
- [ ] El copy es concreto, correcto y verificable.
- [ ] El formato y las zonas seguras corresponden al canal.
- [ ] Las fotos y capturas no se presentan como reales si no lo son.
- [ ] El archivo cumple la tarea (imagen real, código funcional o editable según lo pedido).
- [ ] En web: verificar responsive, foco, contraste, teclado, CTA, estados y formularios.
- [ ] En gráfica: verificar a escala pequeña y ampliada, sin artefactos o texto ilegible.
- [ ] No se modificó innecesariamente ninguna regla de identidad aprobada.
- [ ] Se indicaron solo las limitaciones relevantes y los assets pendientes, si existen.

## 17. Uso con cualquier LLM y mantenimiento del sistema

### Método simple

1. Adjuntar `design.md` y `branding-reference.png` en la conversación.
2. Adjuntar además el logo vectorial, fotos personales o capturas reales cuando sean relevantes y estén disponibles.
3. Dar un brief específico: formato, objetivo, audiencia, texto exacto, assets y tipo de entrega.
4. Pedir explícitamente seguir los invariantes y adaptar únicamente la composición al contenido.
5. Revisar el output contra la referencia y checklist. Para cambios, indicar qué queda bloqueado y qué se modifica.

### Método para repositorios de código

Colocar `design.md` en la raíz del proyecto o en `docs/design.md`, y `branding-reference.png` en una carpeta de referencias. Pedir al agente que lea ambos archivos antes de modificar UI. Si existe una guía de repositorio como `AGENTS.md`, agregar allí una instrucción breve que remita a esta especificación, sin duplicar toda la guía ni reemplazar reglas de seguridad o arquitectura.

```text
Before changing visual UI, read /design.md and inspect the approved branding reference.
Use the existing implementation and approved assets. Preserve functionality.
Follow valentin.dev design tokens, typography, component contracts and quality checklist.
Do not redesign unrelated screens or introduce a generic UI theme.
```

### Versionado

- v1.0: base aprobada visualmente en la última carta; tokens y reglas de producción formalizados en este documento.
- Cambios de composición por campaña no requieren cambiar la versión.
- Cambio de color principal, logo, fuente o gramática gráfica sí requiere aprobación explícita y nueva versión.
- Registrar fecha, decisión, motivo y activos actualizados. No mezclar archivos de versiones diferentes sin aclaración.
- Conservar siempre la última referencia aprobada y versiones anteriores separadas.

### Límites técnicos y activos pendientes

Este documento convierte una referencia rasterizada en una especificación repetible. No equivale a archivos de fuente, SVG originales, un sistema Figma ya construido ni una licencia de uso. Los colores principales, la proporción 60/30/10, el nombre, el estilo de wordmark y Neue Montreal provienen de la referencia aceptada y de las decisiones del usuario. Las medidas exactas de grilla, breakpoints, espaciado, variantes UI, tamaños de producción, prompts y reglas de accesibilidad son decisiones de sistematización propuestas para convertir ese diseño en un estándar operativo. No son mediciones de un archivo fuente inexistente.

Un modelo generativo puede interpretar la misma referencia de manera diferente; ningún Markdown garantiza identidad exacta píxel por píxel, tipografía perfecta o consistencia entre herramientas. Para fidelidad de producción: fijar assets vectoriales, usar fuentes licenciadas, guardar plantillas editables, aplicar tokens en código y componer los elementos exactos de forma determinista. Usar generación de imágenes para fotografías, materiales y conceptos cuando sea apropiado, no para sustituir el logo maestro ni la tipografía de producción.

---

**Regla final:** cada pieza debe sentirse como valentin.dev incluso cuando no se ve el logo: negro dominante, amarillo cálido inequívoco, tipografía grotesca precisa, composición editorial intencional, un gesto gráfico propio, evidencia real y personalidad independiente. Si un recurso no aporta significado, claridad o identidad, eliminarlo.
