# Motion direction — una sola experiencia continua

La web tiene que verse como un sistema vivo, no un video y no seis banners animados. La complejidad está en la sincronización, la continuidad y la suavidad, no en multiplicar efectos. La versión estática debe ser fiel primero. Animar transform/opacity y SVG localizado; no animar layout/blur enorme cada frame. No bloquear scroll nativo ni hacer esperar por una intro.

## Capas

- Capa 0: fondo `#0A0A0A` permanente a nivel de página.
- Capa 1: `HorizonScene` con SVG/paths Bézier, masas carbón, amarillo cálido y bordes de luz. `pointer-events:none`, aria-hidden, fuera del árbol de interacción. Una capa de ambiente por sección o una escena compartida con segmentos coincidentes.
- Capa 2: halos localizados con filtros pequeños o gradientes radiales estáticos transformados. No aplicar blur dinámico a toda pantalla. Mantener el centro del hero oscuro.
- Capa 3: contenido semántico (headers, títulos, botones, tarjetas), no integrado en fondo.
- Capa 4: efectos localizados de highlight y borde, dentro de la geometría de cada componente.
- Capa 5: interacción real (diálogos, menú móvil, focus ring), sin ser tapada por el fondo.

## Timeline

| Efecto | Disparador | Duración propuesta | Comportamiento |
|---|---|---|---|
| Header | carga | 350–500 ms | opacidad y desplazamiento 6 px, una vez |
| Hero H1 | carga | 650–850 ms | leve y 16–24 px hacia arriba, sin fragmentar letras |
| Highlight inicial | H1 visible | 700–950 ms | barrido izquierda→derecha e inversión exacta |
| Highlight repetido | cada 5000 ms mientras visible | 650–900 ms | breve re-reveal, reposo resaltado, sin parpadeo |
| Subcopy y CTA | carga | 420–550 ms | stagger 80 ms, sin retraso artificial |
| Reveal sección | viewport | 450–650 ms | opacity + y 12–22 px, una vez |
| Horizon drift | visible | ciclos 16–26 s | desplazamiento lento 10–30 px, alternate/ease-in-out |
| Horizon light | visible | 8–14 s | halo viaja por cresta, sutil, fase distinta |
| Project cards | sección visible | 400–500 ms | stagger 45–75 ms, no ocultar fuera de JS |
| Carousel | usuario | 350–550 ms | snap, feedback y desplazamiento natural |
| Card rim sweep | hover/focus o entrada | 650–1000 ms | destello fino, no resplandor constante |
| CTA | hover/focus | 180–240 ms | elevación 1–2 px, flecha +3 px, contraste estable |
| CTA press | pointerdown | 90–130 ms | escala .98 y retorno |
| Modal / menú | apertura | 200–300 ms | fade y translate corto, foco inmediato |
| Scroll indicator | visible | 2.8 s opcional | 4–6 px de movimiento, pausa controlada |

Easing de entrada `cubic-bezier(.22,1,.36,1)`. No spring exagerado. No rotar contenido legible. Evitar flashes, zoom infinito y gradientes que cambian de color fuera de la paleta. Respetar estado de lectura, foco y puntero; no mover objetivos interactivos bajo el cursor.

## Highlight: inversión de letras real

Implementar `HighlightText` con texto HTML accesible una sola vez y dos capas visuales sincronizadas: texto base blanco, y una capa superpuesta amarilla que contiene una copia negra del mismo texto, misma tipografía, ancho, kerning y padding. La copia es `aria-hidden`, no seleccionable ni indexable como texto independiente. Aplicar el mismo `clip-path: inset(0 var(--reveal) 0 0)` o máscara compartida a fondo amarillo y texto negro. No animar `color` de toda la palabra a la vez. La máscara debe cortar las letras exactamente donde pasa la franja; la forma de highlight se mantiene fija y su contenido no cambia la métrica. El texto blanco sigue visible en el área no cubierta. En reposo, `--reveal:0%` y palabra negra sobre amarillo. Si no hay JS o soporte de máscara, mostrar versión final estática. No colocar contorno que interfiera con tildes o descendentes. Para esquinas y sesgo, preferir fondo pseudo-elemento ligeramente sesgado, no transformar dos veces las letras.

**Cadencia de 5 s:** un temporizador por highlight visible, o scheduler común. Disparar al entrar (IntersectionObserver threshold ~0.45) y repetir cada 5000 ms mientras ese titular esté visible y documento activo. Al salir, detener timer y dejar estado final. Si vuelve, iniciar una nueva entrada sin acumular intervalos. Si reduced motion, preferencia de pausa, página oculta, focus dentro de un control de esa sección o interacción activa que pueda distraer, no repetir. La repetición hace un wipe suave, no apaga todo el titular abruptamente. Puede animar `clip-path` desde 0% a parcial y volver a 0% con transición; sin destellos bruscos. La palabra jamás desaparece. Evitar que 6 highlights se animen simultáneamente fuera de viewport.

## Horizontes que flotan y se conectan

Partir de `horizon-study.svg` como estudio editable, no como textura final única. Ajustar paths por referencia. Ejemplo conceptual: vista 1600×900, cresta superior derecha que asciende hacia y=130 y cae al borde y=340; inferiores que se cruzan debajo del CTA. Dibujar la misma curva dos o tres veces: relleno sombreado + stroke con gradiente de 1–2 px + halo de 8–20 px localizado. Las masas amarillas deben parecer iluminadas desde un borde, no una raya de marcador sobre el fondo. Mantener negro sólido detrás del texto.

Para unir secciones: continuidad de color de fondo; `SectionShell` puede solapar su decoración 60–120 px en desktop sin solapar contenido; usar las mismas coordenadas de cresta en la salida y entrada de secciones contiguas o dejar que una sola instancia abarque el límite. No dibujar dos crestas idénticas que se chocan en el seam. Controlar z-index e isolation; no clipping del glow en bordes horizontales. Cada sección conserva sus posiciones visuales, pero la curva cambia de amplitud y fase. No repetir el mismo SVG de hero sin adaptar.

Animar cada grupo de paths como unidad (transform translate/scale moderado), no mover cada punto en CPU a 60 fps. Para la luz viajera, animar un grupo con gradiente/stroke-dashoffset, o usar un halo en recorrido CSS/SVG; evitar luminancia excesiva y grandes filters. Usar velocidades distintas para primer plano y cresta lejana, pequeños offsets para profundidad. Parallax opcional máximo 12–25 px en desktop, calcular con rAF y cancelar al salir. No fijar fondos con attachment fixed en móvil. No usar WebGL salvo que el repo ya lo tenga y un perfil demuestre ventaja; fallback SVG/CSS obligatorio.

## Cards y microinteracciones

Portfolio: hover de 2–4 px o scale 1.01, borde suave y flecha que avanza; screenshot permanece legible y no cambia de color. Con teclado mismo feedback. La tarjeta de agenda y las dos comerciales pueden tener inclinación de 3–6°, en reposo y en una escena decorativa. No mover inputs reales constantemente. Efecto de borde: pseudo-elemento con máscara interior para que el gradiente recorra solo 1 px de stroke; una barrida puntual, no un spinner permanente. Sin arcoíris. El borde de foco es independiente del efecto. Foto: leve float solo si no altera encuadre, no animar cara ni aplicar filtros de belleza.

## Implementación y rendimiento

Usar CSS + IntersectionObserver donde baste. Si el repo ya tiene Motion/Framer Motion o GSAP con licencia y configuración válida, reutilizar uno, no instalar ambos por capricho. CSS starter del paquete ilustra la geometría y los keyframes; integrarlo a la arquitectura real, no copiar estilos globales encima sin revisar. El controlador de motion debe: detectar `prefers-reduced-motion`, escuchar cambios, usar IntersectionObserver, pausar con `visibilitychange`, cancelar timeouts/rAF al desmontar, y permitir un control “Pausar animaciones” discreto en footer o configuración accesible. Persistir preferencia local sin rastreo. En pausa, congelar ambiente en un estado estético, mostrar highlight final y mantener interacciones funcionales. No esconder texto inicial si JS falla.

Target: fluidez visual en 60 Hz cuando dispositivo lo permite, sin tareas largas causadas por animación; usar DevTools Performance en móvil emulado y hardware disponible. No afirmar 60 fps sin medición. Evitar `will-change` permanente sobre decenas de nodos. Limitar SVG blur/filters y número de capas grandes en móvil. Desactivar parallax, tilt y halos secundarios en dispositivos lentos/reduced motion. Imágenes AVIF/WebP con dimensions, lazy load por debajo del fold; no precargar todos los previews. Probar Safari iOS, Chromium y Firefox; usar fallback de esquinas, máscaras, gradients y reduced motion.
