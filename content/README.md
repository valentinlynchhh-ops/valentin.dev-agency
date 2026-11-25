# Contenido de valentin.dev (Instagram y TikTok)

Todo lo que se publica sale de esta carpeta. Es contenido de **marca personal**: una persona que diseña y programa webs, mostrando trabajo real.

## Qué hay acá
| Archivo | Para qué |
|---|---|
| [`perfiles.md`](perfiles.md) | Nombre, bio, link y datos de los perfiles de Instagram y TikTok |
| [`instagram-primeros-9.md`](instagram-primeros-9.md) | Los primeros 9 posts del feed, cada uno con su guion |
| [`calendario/2026-12.md`](calendario/2026-12.md) | Calendario semanal del primer mes (30/11 al 27/12) |
| [`guiones/`](guiones/) | Guiones de TikTok y Reels, uno por archivo |
| [`ganchos.md`](ganchos.md) | Biblioteca de ganchos (primeros 3 segundos) |
| [`prompts.md`](prompts.md) | Prompts listos para ChatGPT o Claude: imágenes, video, carruseles, captions |
| [`creativos-ideas.md`](creativos-ideas.md) | Ideas de creativos para Instagram |

## Reglas que no se negocian
1. **Solo trabajo real.** Los trabajos que se pueden mostrar son rydabogados.com.ar, abogadamasegosa.com y rebloomactive.com (con capturas reales, no mockups de IA). Antes de publicar un trabajo de un cliente, confirmar que está de acuerdo en que se muestre.
2. **Nada inventado:** ni clientes, ni testimonios, ni cifras, ni "resultados" que no se puedan comprobar. Nada de "aumentamos X% las ventas".
3. **Sin urgencia falsa** (nada de "últimos lugares" ni cuentas regresivas) ni descuentos que no existan.
4. **Precios solo con tokens:** `{{precio:landing}}`, `{{precio:web}}`, `{{precio:sistema}}`, y `{{pago_web}}`, `{{plazo_web}}`. Se rellenan con `node scripts/outbound/render.mjs <archivo>` desde `src/lib/catalogo.ts`. Nunca el número escrito.
5. **Voz:** español rioplatense, primera persona singular, frases cortas, verbos concretos. Cero "soluciones innovadoras", "llevamos tu negocio al siguiente nivel".
6. **Identidad visual:** la de [`design.md`](../design.md): negro `#0A0A0A` dominante, amarillo `#FFE600`, blanco roto `#F5F5F0`, tipografía grotesca bold, un solo motivo gráfico por pieza. Sin gradientes, sin brillos, sin emojis decorativos.
7. **Cada pieza se entiende sin sonido** y con el texto en pantalla.
8. **Una sola acción al final** de cada pieza (comentar, mirar el perfil, escribirme).

## Flujo semanal (30 minutos de planificación)
1. Lunes: mirar el calendario de la semana y confirmar qué se graba.
2. Grabar los videos en una sola tanda (pantalla + voz; a cámara solo si hay ganas).
3. Armar los creativos con los prompts de `prompts.md` y revisar con el agente `director-de-arte`.
4. Programar o publicar. La publicación automática **todavía no está conectada** (ver `docs/rutinas.md`): por ahora la rutina deja cada pieza lista cada mañana y se publica a mano.
5. Viernes: anotar qué anduvo mejor (comentarios, guardados, mensajes) en el CRM o en `calendario/`.
