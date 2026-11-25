# Definition of done — visual y funcional

El usuario espera máxima fidelidad. No aceptar un resultado solo porque “se parece” o porque compila. Las seis imágenes son el benchmark; las medidas inferidas y los efectos deben revisarse con capturas reales. No declarar exactitud píxel a píxel sin archivos de origen. Los cambios por veracidad, accesibilidad y responsive se documentan y no se penalizan como desviaciones arbitrarias.

## 1. Visual QA

Capturar a 1536×864 y 1920×1080, DPR 1, fuente cargada, sin dev overlay, motion pausado y highlight en estado final; para cada sección guardar captura de bounding box y screenshot full-page. Comparar `01` a `06` a escala equivalente. A 1536×864 normalizar la referencia hero de 1672×941 sin recortar. Usar overlay con 50% de opacidad y alternancia referencia/resultado; no exigir igualdad de píxeles JPEG por diferente tipografía, color de previews reales o fondos animados. Comparar geometría y contraste; registrar qué elementos no coinciden y por qué.

Criterios orientativos de revisión (no afirmar mediciones que no se hicieron): centro del hero alineado ±2% del ancho, ancho/alto de bloque del H1 ±5% salvo font fallback documentado, header y CTAs posiciones ±3% viewport, proporción de tarjeta y separación ±5%, color UI sólido exactamente según tokens, tamaños de display por comparación óptica, continuidad sin líneas duras entre secciones. Validar cada titular a escala móvil y desktop, sin viudas accidentales.

- [ ] 01: monograma correcto, lockup blanco, nav sin divisor vertical, título centrado y highlight de negocio, sin imágenes irrelevantes, sin eyebrow, 2 CTAs.
- [ ] 02: 5 tarjetas visibles en desktop amplio, screenshots reales y descripciones debajo, links correctos, carrusel funciona cuando hay overflow/rotación real.
- [ ] 03: composición izquierda/derecha, agenda funcional o fallback explícito, beneficios, ninguna prueba social inventada.
- [ ] 04: retrato correcto de la versión aprobada, layout 2 columnas, especialidades, cifras solo verificadas.
- [ ] 05: CTA y paneles comerciales, ningún ranking falso, sin montos/porcentajes no confirmados, postulación real.
- [ ] 06: headline centrado, CTA, 4 columnas desktop, redes y contacto confirmados, año y volver arriba.
- [ ] Todos: negro #0A0A0A, amarillo #FFE600, blanco #F5F5F0, familia y pesos coherentes, iconos homogéneos, radios squircle, fondo conectado sin costuras, sin capturas completas como UI.

## 2. Motion QA

Capturar video corto o estados en t=0, t=.4, t=.85, t=5 y t=5.4 s después de entrada. Confirmar wipe localizado y alineación de las dos copias, sin parpadeo, sin texto duplicado en accesibilidad ni cambio de layout. Verificar que el ciclo se repite cada 5 s solo mientras visible y se cancela al salir o al ocultar la pestaña. Confirmar que un highlight fuera de viewport no consume temporizadores inútiles. Revisar continuidad al pasar entre secciones (scroll lento y rápido). Hover/focus de CTA y tarjetas, bordes sin halos que tapen el texto, no objetos que se desplacen bajo puntero. Control de pausa, reduced motion, navegación y formulario siguen funcionando. Probar mobile sin parallax pesado. Revisar Performance con hardware disponible; no prometer FPS sin medición.

## 3. Responsive y a11y

Viewports: 320×568, 360×800, 390×844, 768×1024, 1024×768, 1280×800, 1536×864, 1920×1080. Test en Chromium y, cuando disponible, Safari/WebKit y Firefox. Sin overflow horizontal de body, exceptuando carrusel interno controlado; ni texto truncado, botones debajo del fold inaccesibles o scroll bloqueado. Probar zoom 200%, teclado Tab/Shift+Tab, Escape, enter, foco visible, skip link, diálogo con retorno de foco, labels, estados de error, contraste y reduced motion. Iconos decorativos no leídos, H1 único y orden lógico. No esconder CTA con menú abierto. No usar nombres genéricos de enlaces sin contexto.

## 4. Flujos funcionales

- [ ] Hablemos hero/header/footer y Agendemos una charla llegan al mismo flujo real.
- [ ] Ver proyectos y chevron inferior navegan a la sección correcta; links de proyectos abren destino verificado.
- [ ] Carrusel se desplaza con touch, teclado y flechas; indicadores reflejan estado real; sin autoplay invasivo.
- [ ] Cómo trabajo abre contenido útil, no botón de video falso.
- [ ] Agenda: selección, validación, conflicto de slot, error servidor, éxito confirmado. Sin proveedor, fallback claro y canal real; sin canal, bloqueo documentado.
- [ ] Vendedores: postulación, validación, manejo de error, éxito real, sin dobles submits. Cómo funciona informa condiciones sin promesas falsas.
- [ ] Servicios y Recursos tienen destino real o no aparecen en producción; ningún `href="#"` vacío.
- [ ] Redes y contacto apuntan a perfiles y canales confirmados; volver arriba funciona.
- [ ] No se envían pruebas a clientes reales ni se crea reserva real sin autorización; usar mocks de test locales claramente separados de producción.

## 5. Ingeniería / publicación

Ejecutar los comandos del repositorio: instalación reproducible si necesaria, build, lint, typecheck y tests existentes. Verificar cero errores de consola relevantes, requests, imágenes, metadata y responsive. Documentar comandos ejecutados y exit codes. Si faltan scripts o navegadores, reportar exactamente qué no pudo verificarse. No inventar un resultado de Lighthouse. Probar producción local y preview cuando autorizado. Verificar `site-content.json` y datos privados antes de publicación. No subir credenciales ni este paquete de mockups a `public/`: copiar exclusivamente activos autorizados. Mantener referencias/QA fuera del bundle público.

## 6. Reporte final requerido

Completar con evidencia real:

| Campo | Resultado |
|---|---|
| Framework y stack preservado | |
| Archivos modificados | |
| Referencias comparadas / capturas | |
| Diferencias intencionales y pendientes | |
| Tipografía usada y licencia | |
| Proyectos verificados y assets reales | |
| Agenda/contacto/postulación | |
| Datos no confirmados omitidos | |
| Build/lint/test (comando y exit code) | |
| Viewports y navegadores probados | |
| Motion/pausa/reduced motion | |
| Performance medida (si disponible) | |
| URL local / preview si realmente existe | |
| Deployment de producción autorizado y ejecutado | |

Rúbrica interna orientativa: fidelidad visual 40, consistencia de marca 15, motion 15, funcionalidad 15, responsive/accesibilidad 10, rendimiento 5. Puntuar solo con evidencia. Objetivo ≥90/100 tras corregir diferencias, pero cualquier bloqueo de contacto, información falsa, foco roto, desbordamiento significativo o fallo de build es crítico aunque la nota sea alta. No prometer “100% idéntico”; entregar comparación y explicar los límites.
