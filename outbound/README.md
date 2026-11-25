# Outbound de valentin.dev

Cómo le escribo a negocios que no me conocen, sin quemar mi mail y sin sonar a folleto.

## Principios
1. **Corto y de persona a persona.** 60–90 palabras. Un solo pedido. Nada de "soluciones innovadoras".
2. **Personalizado de verdad.** Cada mensaje nombra algo concreto y verdadero del negocio (`{{detalle}}`): algo que vi en su web o su Instagram. Si no encuentro nada concreto, no le escribo.
3. **Nada inventado.** Ni clientes, ni resultados, ni cifras. Mis trabajos reales son rydabogados.com.ar, abogadamasegosa.com y rebloomactive.com.
4. **Los precios nunca se escriben a mano.** Se usan `{{precio:landing}}`, `{{precio:web}}`, `{{precio:sistema}}`; salen de `src/lib/catalogo.ts`.
5. **Todo mensaje a un tercero lo aprueba Valentín.** Los borradores se preparan; el envío es una decisión suya.

## Cómo se arma un mensaje
1. Elegí un rubro de [`rubros-objetivo.md`](rubros-objetivo.md) y un negocio.
2. Armá su muestra siguiendo [`muestra-por-negocio.md`](muestra-por-negocio.md) (queda en `/demo/<slug>`).
3. Elegí la plantilla de [`plantillas/`](plantillas/) y completala:

```bash
node scripts/outbound/render.mjs outbound/plantillas/mail-frio.md \
  --nombre Ana --negocio "Estudio Pérez" --detalle "vi que la web no se ve bien en el celular" \
  --link_muestra https://valentin.dev/demo/estudio-perez
```

Si falta una variable, el script avisa cuál y no imprime nada: no hay forma de mandar una plantilla a medio llenar.

## Frenos (están en el código, no dependen de la memoria de nadie)
Los aplica `src/lib/outbound.ts` (con tests) y los usa `POST /api/outbound/enviar`.

| Freno | Regla |
|---|---|
| **Tope diario** | `OUTBOUND_TOPE_DIA` (por defecto 15 mails por día entre todos los contactos). Nunca más de 40, aunque la variable diga otra cosa. |
| **Lista de bajas** | Tabla `bajas`. A quien está ahí no se le escribe nunca más, tampoco una respuesta. Todo mail lleva un link de baja firmado (`/api/outbound/baja`). Si alguien responde "baja", "no gracias" o parecido, se carga en `bajas` a mano o con el link. |
| **Horario** | Lunes a viernes de 9 a 18 h (Argentina). Las respuestas a quien escribió primero saltean este freno. |
| **Frecuencia** | Un solo mail en frío por contacto. Después, hasta 3 seguimientos, separados por al menos 3 días. Después se cierra. |
| **Plantilla completa** | Si quedó un `{{...}}` sin completar, no sale. |

## Envío: borrador por defecto
`POST /api/outbound/enviar` está **apagado**: responde `409 modo_borrador` mientras `ajustes.outbound_envio_automatico` no sea `true`. Mientras tanto, las rutinas dejan **borradores** (en Gmail) y los mandás vos.

Para prender el envío automático (solo cuando confíes en el flujo):
```sql
insert into public.ajustes (clave, valor) values ('outbound_envio_automatico', 'true'::jsonb)
on conflict (clave) do update set valor = excluded.valor, actualizado_at = now();
```
Para apagarlo de nuevo, el mismo comando con `'false'::jsonb`.

## Cuidado con el dominio
- Antes de mandar en frío desde un dominio nuevo, hay que **verificarlo en Resend** (SPF, DKIM) y **calentarlo**: empezá con pocos mails por día y subí de a poco. Por eso el tope por defecto es bajo.
- Si los rebotes o las quejas suben, se frena todo y se revisa la lista.
- WhatsApp: solo a números que el negocio publica como contacto comercial, un mensaje, sin insistir. Si dice que no, se anota y no se vuelve a escribir.
