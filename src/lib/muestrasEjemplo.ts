import juridico from "../../scripts/muestras/ejemplos/estudio-juridico.json";
import contable from "../../scripts/muestras/ejemplos/estudio-contable.json";
import inmobiliaria from "../../scripts/muestras/ejemplos/inmobiliaria.json";

/* Muestras de ejemplo con datos ficticios (llevan `ficticio: true`, que pone el aviso en la página).
   Sirven para probar el sistema y para mostrar cómo queda una muestra, aunque no haya base conectada. */
export const MUESTRAS_EJEMPLO: Record<string, unknown> = {
  "ejemplo-estudio-juridico": juridico,
  "ejemplo-estudio-contable": contable,
  "ejemplo-inmobiliaria": inmobiliaria,
};
