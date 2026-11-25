---
description: Revisa el diseño de una web (la propia o la de un cliente) contra design.md y devuelve fallas concretas con su arreglo
argument-hint: <URL o ruta, ej. http://localhost:3000/precios>
---

Revisá el diseño de: $ARGUMENTS

1. Leé `design.md` completo (sobre todo §7 layout, §9 componentes, §16 control de calidad) y mirá `references/branding-reference.webp`.
2. Abrí la página con Playwright y sacá capturas a **375 px** y a **1440 px** (página completa). Mirá las imágenes; no juzgues solo por el código.
3. Medí lo que se puede medir: desborde horizontal, tamaño mínimo de texto (≥ 16 px en cuerpo), áreas táctiles (≥ 44 px), contraste de los pares de color usados, un solo `h1`, foco visible con teclado.
4. Aplicá la rúbrica de 100 puntos de `design.md` §16 y la tabla "Problema detectable → Corrección".
5. Si la web es de **un cliente**, no la juzgues contra la identidad de valentin.dev (design.md §13.5): juzgala contra su propia marca, su claridad y su conversión.

Entregá, en español rioplatense:
- Puntaje estimado y las 3 fallas más graves, cada una con captura o selector, por qué molesta y el arreglo exacto.
- Lo que está bien (breve).
- Qué no pudiste verificar.

No inventes métricas. Si algo no se pudo medir, decilo.
