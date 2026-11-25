# Programa de vendedores — borrador de condiciones

> Borrador para que Valentín lo revise y lo ajuste antes de usarlo con una persona real. **No es asesoramiento legal**: si el programa va a manejar pagos recurrentes, conviene que lo revise un abogado.

## Lo que ya está definido (por Valentín, 25/11/2026)
- **Comisión:** 15% sobre cada proyecto efectivamente cobrado.
- **Mínimo:** 2 proyectos cobrados por mes para seguir en el programa.

Estos dos valores viven en `src/lib/vendedores.ts` (`COMISION_PCT`, `MIN_PROYECTOS_MES`): se cambian ahí y se actualizan la landing, `/vendedores`, el CRM y `llms.txt`.

## Lo que falta decidir (no está publicado como hecho)
| Tema | Pregunta | Estado en la web |
|---|---|---|
| Cuándo se paga | ¿Cuando el cliente paga la seña, el saldo, o todo? ¿A los cuántos días? | Dice «se acuerda por escrito antes de empezar» |
| Cómo se paga | ¿Transferencia, otra forma? ¿En pesos o dólares? | No se menciona |
| Qué es «proyecto cobrado» | ¿Cuenta cuando se cobra la seña o cuando se cobra el 100%? | «Sobre lo que el cliente efectivamente paga» |
| Qué pasa si no llega al mínimo | ¿Se lo da de baja el mes siguiente? ¿Hay aviso previo? | «Lo hablamos y definimos si seguís» |
| Exclusividad de clientes | ¿Si dos vendedores llevan al mismo cliente? Regla: el primero con código registrado | No se menciona |
| Relación | ¿Es comisionista independiente? (no es empleo) | No se menciona |
| Soporte | ¿Material comercial, capacitación? | **No se promete** |

## Cómo se atribuye un cliente
1. Valentín aprueba la postulación en `/admin/vendedores` y se genera un **código de 6 letras**.
2. Le pasa al vendedor su link: `https://valentin.dev/?ref=CODIGO`.
3. Quien entra por ese link queda con una cookie de 30 días; si completa un formulario, la consulta y el contacto quedan asociados al código.
4. En `/admin/vendedores` se ve, por vendedor, cuántas consultas, contactos y entregas tiene y una **comisión estimada** sobre lo entregado. **Es una estimación**: antes de pagar se verifica el cobro real del cliente.

## Límites actuales
- El código se registra solo si el cliente entra por el link del vendedor (y no borra cookies). Un cliente que llega por otro medio no queda atribuido: si el vendedor lo trajo a mano, se carga el código a mano en el contacto (todavía no hay pantalla para eso).
- No hay cobro automático de comisiones ni facturación.
