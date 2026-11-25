# Rutinas en la nube

Tareas programadas de Claude Code que corren **en la nube** (no en tu compu ni en tu celular): cada una abre una sesión nueva a la hora indicada, hace su trabajo y termina. Se administran desde **claude.ai → Rutinas** (en el celular también) o pidiéndoselo a Claude.

## Estado actual: las cuatro están APAGADAS
Las dejé armadas y apagadas a propósito, por dos razones:
1. **Todavía no hay base de datos** (falta decidir el proyecto de Supabase, ver `docs/herramientas.md`). Sin base, el parte, las respuestas y los seguimientos no tienen sobre qué trabajar.
2. **Nada sale a terceros sin tu OK.** Todas están escritas para dejar **borradores** y notas internas; ninguna manda un mail a un negocio. Igual conviene que las prendas de a una, mirando el primer resultado.

> **Límite técnico importante.** Creadas desde esta sesión, las rutinas **no guardan conectores**: las sesiones que disparen no van a tener Gmail ni Supabase. Para que funcionen, **recreá cada una desde claude.ai → Rutinas** (copiando el nombre, el horario y la instrucción de abajo) y en esa pantalla adjuntá los conectores que usa (Gmail y/o Supabase). Después apagá la versión vieja. Una vez que las recrees, prendé una por vez.

| Rutina | Cuándo (hora de Argentina) | Qué hace | Conectores que necesita | ID |
|---|---|---|---|---|
| **Parte del día** | Lunes a viernes, 8:47 | Lee el CRM (solo lectura) y te manda a vos un mail con qué hacer hoy, consultas nuevas y seguimientos que tocan | Supabase, Gmail | `trig_01KjwHzqmBLinHCFAeSTXx1S` |
| **Revisar respuestas de clientes** | Lunes a viernes, 10:12, 13:12 y 17:12 | Busca respuestas en tu bandeja, las cruza con el CRM, las clasifica, carga bajas, anota y deja **borradores** de respuesta | Supabase, Gmail | `trig_01T1aYjnnvvmCYMF4Sd8HiLF` |
| **Seguimientos (borradores)** | Lunes a viernes, 10:37 | Elige a quién le toca seguimiento (con todos los frenos de `outbound/README.md`) y deja el **borrador** en Gmail | Supabase, Gmail | `trig_01YYaDJ27PAswK58gKmim1d1` |
| **Contenido del día** | Todos los días, 8:07 | Toma la pieza que toca del calendario (`content/calendario/`), arma el paquete listo y te lo manda a vos por mail | Gmail | `trig_014DLYF7pnyUmRZpLSxXDJG7` |

### Qué NO hace «Contenido del día»
**No publica en Instagram ni TikTok.** La publicación automática requiere conectar tus cuentas (Windsor.ai, ver `docs/herramientas.md`) y no está activa. La rutina te deja cada mañana la pieza lista (texto, pie, prompt del creativo) y se publica a mano. Cuando conectes las cuentas, se puede extender, con tu OK explícito.

## Qué no hace ninguna
- No manda mails ni mensajes a negocios ni a clientes: solo borradores y avisos **a vos mismo**.
- No borra datos ni gasta plata.
- No prende el envío automático de outbound (`ajustes.outbound_envio_automatico` sigue en falso).

## Cómo apagar o prender una rutina
- **Desde claude.ai:** *Rutinas* → la rutina → interruptor de encendido. (Funciona desde el celular.)
- **Pidiéndoselo a Claude:** «apagá la rutina de seguimientos» / «prendé el parte del día». Claude usa el ID de la tabla de arriba.
- **Para apagar todo de una vez:** «apagá todas las rutinas de valentin.dev».
- **Ante cualquier duda, apagala primero y preguntá después.** Una rutina apagada no hace nada y se puede prender cuando quieras.

## Cómo cambiar lo que hace una rutina
La instrucción completa de cada una está en la propia rutina (en claude.ai → Rutinas → editar). Las reglas de fondo que obedecen viven en el repo (`CLAUDE.md`, `outbound/README.md`, `content/README.md`): cambiá ahí la regla y todas la heredan.

## Orden sugerido para prenderlas
1. Cuando haya base: **Parte del día** (solo te escribe a vos).
2. **Contenido del día** (solo te escribe a vos).
3. **Revisar respuestas** (crea borradores y notas; mirá el primer día cómo clasifica).
4. **Seguimientos** (solo cuando ya hayas mandado los primeros mails en frío).
