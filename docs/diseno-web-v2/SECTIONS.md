# Reconstrucción por sección — especificación de arte y contenido

Usar `references/00-secuencia-completa.jpg` para ritmo y las seis referencias individuales para precisión. Las coordenadas siguientes son estimaciones normalizadas (porcentaje de ancho/alto de la imagen), no coordenadas de un archivo Figma. Adaptarlas al viewport y verificar con capturas. En desktop, mantener el mismo centro de gravedad visual incluso a 1920×1080. A 1536×864, las seis secciones juntas equivalen aproximadamente a seis pantallas de referencia, pero no fijar su altura si el contenido necesita crecer. No repetir nav en cada captura: una sola página continua.

## 01 — Hero `#inicio`

Referencia `01-hero.jpg` (1672×941). Header en x 7–93%, y 4–10%. Logo original amarillo y texto blanco `valentin.dev` a la izquierda. Nav centrada: Proyectos, Servicios, Sobre mí, Recursos. CTA `Hablemos ↗` a la derecha. Sin línea vertical entre logo y menú; sin sidebar abierto. En móvil sustituir los links por hamburguesa y mantener CTA cuando quepa. En desktop se conserva el header de la imagen, no agregar icono si altera la composición.

Fondo negro; una cresta grande ocupa cuadrante superior derecho desde aproximadamente x 43%, y 14% y cae hacia x 100%, y 38%. Abajo izquierda arco que empieza en y 62%, llega a y 58% y cae hacia y 99%; abajo derecha curva que entra desde y 57% y se cruza con la primera cerca del centro inferior. Son superficies de luz y sombra con contorno delgado, no cintas sólidas pegadas al texto. Dejar el centro oscuro para contraste.

Contenido centrado, sin eyebrow ni etiqueta. H1 ocupa ancho aproximado 72% (x 14–86%), y 28–51%, dos líneas a desktop:

```text
Diseño productos
que generan negocio.
```

`negocio.` en negro sobre highlight amarillo squircle inclinado. Tipografía display bold italic, blanco roto, ancho y tracking visuales como la captura. Highlight aparece en la segunda línea y no empuja el contenido. Debajo y 56–63%:

```text
Estrategia, diseño y desarrollo digital
para ideas que escalan.
```

Fila de acciones centrada en y 67–75%: CTA amarillo “Hablemos ↗” abre flujo de contacto; secundario outline “Ver proyectos” navega a `#proyectos`. En vez de icono play engañoso, usar flecha suave o mantener el triángulo solo si abre un showreel real; preferir la flecha cuando no exista video. Doble chevron inferior en y 92% navega al portfolio. No añadir personas, claims, edificio, dashboards, zConsultorio ni números en el hero.

Motion: header ligero y H1 entrada ascendente, highlight barre izquierda-derecha, horizontes con movimiento sutil; tras completar la entrada todos los textos quedan estáticos salvo repetición del highlight y ambiente. Ver MOTION.

## 02 — Proyectos `#proyectos`

Referencia `02-proyectos.jpg` (1536×864). La cresta del hero continúa arriba de la sección con luz fina y fondo negro. H2 centrado x 18–82%, y 14–24%: “De la idea a la realidad.” con `realidad.` resaltado. Subtítulo: “Algunos de los sitios y productos digitales que diseñé y desarrollé.” debajo, y 25–29%. Sin badge, sin título adicional.

Carrusel desktop x 3.6–96.4%, y 33–74%. Cinco previews simultáneas de tamaño equivalente, gap aproximadamente 16–20 px; a 1536 cada imagen ~272×354 px; ratio aproximado 0.77, radio 26–30. No tilt en cada tarjeta, no glow excesivo sobre las capturas. Cuerpo de tarjeta separado visualmente debajo de la preview: nombre en bold italic y flecha noreste; descripción en sans regular, hasta dos líneas. Controles centrados en y 91–95%: flecha izq, indicador segmentado amarillo/gris, flecha der; reflejar posiciones reales del carrusel.

Orden inicial:

| Nombre | Descripción | URL |
|---|---|---|
| R&D Abogados | Web institucional para estudio jurídico. | https://rydabogados.com.ar/ |
| Melisa Masegosa | Web profesional para servicios jurídicos. | https://abogadamasegosa.com/ |
| Rebloom Active | Sitio web de indumentaria deportiva. | https://rebloomactive.com/ |
| Get Z Leads | Plataforma de prospección B2B. | https://getzleads.com/ |
| Estudio Saucedo | Web de servicios legales. | https://estudiosaucedo.com.ar/ (validar) |

Melisa: la imagen menciona turnos online; solo usar esa descripción específica si el sitio real tiene esa funcionalidad. Las previews son composiciones generadas, no capturas comprobadas. Obtener screenshots de cada web real con Playwright o assets autorizados; capturar viewport móvil o retrato (ej. 432×560 CSS px a DPR 2), no imitar el sitio con HTML ficticio. Si falla una URL, conservar una tarjeta editorial con nombre y estado discreto en preview o esconder hasta disponer de asset real; no inventar fotos. Agregar otros sitios del repo o del usuario cuando se confirme URL y autoría, sin duplicados. No inventar Netlify.

Carrusel: con cinco ítems y cinco espacios visibles, no simular cuatro páginas ficticias. Para habilitar movimiento incluso con cinco, usar ciclo circular con reordenamiento accesible (sin duplicar elementos tabulables), o controles desactivados si no existe overflow y ocultar indicadores innecesarios. Si se agregan más proyectos, preferir scroll-snap nativo + controles. En móvil 1 tarjeta + peek; tablet 2–3; desktop amplio 5. Cada preview/título enlaza a proyecto real, nuevo tab con rel adecuado. No usar autoplay por defecto; pausa al hover si se habilita y control visible. Preservar foco durante navegación.

## 03 — CTA / Agenda `#contacto`

Referencia `03-agendar.jpg`. Layout dos columnas, izquierda x 7.5–55%, derecha x 58–91%. Bloque centrado verticalmente en la zona superior, y 9–68%; fondo negro y cresta diagonal detrás del panel derecho. Pequeño label outline con calendario “Hablemos”. H2 alineado izquierda:

```text
¿Tenés un proyecto
en mente?
```

Highlight `mente?`. Copy: “Contame tu idea, objetivo o problema. Vemos juntos la mejor solución y te propongo un plan a medida.” CTA “Agendemos una charla ↗”; secundario “Cómo trabajo” abre un panel real de proceso o ancla dentro de esta sección. No usar un botón play si no existe video.

Panel de agenda a la derecha: squircle oscuro ~420×420 px de referencia, ligeramente inclinado hacia arriba a la derecha, respaldo amarillo desplazado, rim light fino. Logo vd arriba, título “Agendá una reunión”, selector de día y horarios. Es una interfaz real si hay proveedor configurado. La captura muestra Lun 24–Vie 28 y 10:00 etc.; esos valores son ilustrativos, no disponibilidad real. Si hay integración, mostrar fechas y slots devueltos por backend, zona horaria y estados. Si no, el panel puede mantener la apariencia y ofrecer “Solicitar una reunión” mediante contacto confirmado o formulario existente; no mostrar slots inventados. En móvil dejar controles planos y sin inclinación para interacción.

Debajo del CTA, la referencia incluye avatares y +20. No replicarlos como prueba social falsa. Sustituir por una línea equivalente “Trato directo, de principio a fin.” y un pequeño icono/lockup, o testimonios reales con permiso. No inventar nombres ni usar caras de stock como clientes.

Fila inferior de cuatro beneficios (y 74–84%): Respuesta rápida / Sin vueltas.; Propuesta a medida / Adaptada a tu negocio.; Implementación ágil / De la idea al resultado.; Foco en resultados / Productos que generan valor. Sin prometer SLA, ganancias ni plazos que no estén acordados. Usar outline amarillo sobre icon tiles discretos y divisores finos. La cresta inferior conecta con Sobre mí.

## 04 — Sobre mí `#sobre-mi`

Referencia `04-sobre-mi.jpg` (la última adjuntada, con retrato sin barba en el auto). Foto izquierda x 2–40%, y 12–87%, panel inclinado con borde luminoso y esquina continua. Usar `assets/portrait/portrait-from-approved-section.jpg` para máxima aproximación a la composición o `portrait-reference.png` para recorte más limpio. Son derivados de una recreación aprobada de las fotos del usuario; no generar otra cara, no reintroducir barba, no retocar rasgos. Si el usuario aporta luego una foto real definitiva, sustituir por ella conservando encuadre. En móvil enderezar panel, no cortar cabeza. Alt: “Retrato de Valentín Lynch”.

Derecha x 43–95%: etiqueta outline “Sobre mí”, H2 `Ideas, tecnología` / `y ejecución real.` con highlight `real.`. Copy en primera persona, 2–4 líneas desktop:

“Soy Valentín Lynch, founder y desarrollador. Diseño, construyo y escalo productos digitales que resuelven problemas reales y generan negocio, combinando estrategia, diseño y tecnología.”

La referencia contiene tres cards de métricas (10+, 15+, 3+). No están confirmadas como cifras actuales. Mantener estructura de 3 tarjetas con contenido sin números hasta verificarlas: “Proyectos / Webs y productos digitales”, “Trato directo / De principio a fin”, “Producto / Diseño y desarrollo”. Se pueden restaurar cantidades únicamente con dato validado. Mantener los cinco chips de Especialidades: Desarrollo, Diseño, Automatizaciones, Producto, Estrategia. Son etiquetas informativas, no botones vacíos. Rim light y cresta inferior sobrios. No agregar una biografía genérica larga.

## 05 — Vendedores `#vendedores`

Referencia `05-vendedores.jpg`. Sección secundaria comercial, después de Sobre mí. Izquierda x 5.5–49%, y 9–65%; label “Vendedores”, H2 “Sumate al equipo de ventas” con highlight `ventas`. Copy propuesto seguro y directo: “Si te gusta vender y querés trabajar con productos digitales, sumate. Conectá negocios con soluciones a medida y cobrá comisiones por las ventas que concretes, según las condiciones acordadas.” CTA `Quiero sumarme ↗` abre postulación; secundario `Cómo funciona` abre explicación real.

Derecha dos paneles superpuestos inclinados, rim light en esquinas. La referencia trae ranking y comisiones con datos personales y montos ilustrativos. No exponerlos ni reemplazarlos por cifras ficticias. Conservar la composición con un panel principal “Tu proceso comercial” y tres filas “Encontrá una oportunidad”, “Presentá la propuesta”, “Cerrá la venta”; panel detrás “Comisiones por ventas” con gráfico abstracto sin ejes ni valores, rotulado “Esquema ilustrativo” si puede confundirse con resultados. Si existe dashboard real, solo usar datos propios autorizados y agregados, nunca información de otros vendedores sin permiso. Nada de “triplicá ingresos”, “alta demanda” no comprobada, o 15% sin acuerdo actual. La comisión se define y comunica antes de iniciar colaboración.

Fila inferior 4 beneficios: Comisiones por ventas / Condiciones claras.; Productos digitales / Webs y soluciones.; Material comercial / Para presentar propuestas.; Trabajo por objetivos / Seguimiento de oportunidades. Solo ofrecer soporte/capacitación si se confirma. Preservar iconos outline y spacing; ningún beneficio se convierte en garantía de ingresos. Cierre visual con onda hacia el footer.

## 06 — Cierre y footer `#footer`

Referencia `06-footer.jpg`. Bloque superior central y 10–50%, H2 en dos líneas:

```text
Hagamos algo que
valga la pena.
```

Highlight de segunda línea. Subcopy “Contame qué tenés en mente. Yo me encargo de hacerlo realidad.” CTA amarillo `Hablemos de tu proyecto ↗` dirige al mismo flujo de contacto, no inventar otro. Curva luminosa cruza entre CTA y footer sin superponer textos; transición hacia negro.

Footer dentro de x 6.7–93.3% con divisor superior fino en y 61%; grilla cuatro columnas en y 67–85%: (1) monograma original y `valentin.dev`, tagline “Diseño y desarrollo digital independiente.”; (2) Proyectos, Servicios, Sobre mí, Vendedores; (3) Email, WhatsApp, Buenos Aires, Argentina (confirmar ubicación pública si se quiere); (4) LinkedIn, Instagram, GitHub, X, TikTok; Reddit si se proporciona URL. Datos de contacto y redes: usar configuración verificada; no asumir que el mockup tiene datos reales. No usar href `#` ni cuentas genéricas de las plataformas. Ocultar canales sin configurar en producción, registrar pendientes. Si solo existe un contacto real, mostrarlo sin inventar otros. Fila legal con año dinámico o 2026 como referencia; enlace `Volver arriba ↑` funciona incluso sin JS.

En móvil pasar a 2 columnas y luego una, CTA full width si mejora legibilidad. No volver a poner el navbar completo ni agregar un tercer CTA. El final debe respirar y terminar con fondo negro, sin barra de scroll decorativa ni contenido cortado.
