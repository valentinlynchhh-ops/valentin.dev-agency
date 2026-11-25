---
description: Redacta un mail en frío personalizado para un negocio (borrador, no se envía)
argument-hint: <nombre del negocio> <rubro> <ciudad> [algo concreto que viste en su web o Instagram]
---

Redactá un mail en frío para: $ARGUMENTS

Leé primero `outbound/README.md` (reglas, tope diario y lista de bajas) y `outbound/plantillas/mail-frio.md`.

Reglas:
- **Corto** (60–90 palabras), de persona a persona, sin tono de folleto ni de IA.
- **Personalizado**: nombrá algo concreto y verdadero del negocio (algo que viste en su web o su Instagram). Si no tenés nada concreto, pedíselo a Valentín en vez de inventarlo.
- Un solo pedido, simple (ej. "¿te mando una muestra de cómo quedaría tu web?").
- Cada mail incluye una forma clara de no recibir más mensajes.
- Precios solo con tokens `{{precio:...}}`.
- Verificá contra `bajas` que el destinatario no esté en la lista de bajas, y contra el tope diario, antes de proponer el envío.

Salida: asunto + cuerpo, y el comando exacto para ponerlo en borrador. **No envíes nada**: el envío lo aprueba Valentín.
