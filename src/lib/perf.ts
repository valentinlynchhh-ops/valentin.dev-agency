/* Nivel de rendimiento del dispositivo. «alto» = escritorio con mouse, 6+ núcleos, memoria suficiente y sin ahorro de datos:
   recién ahí se activan WebGL, scroll con inercia, cursor propio y efectos de mezcla. Todo lo demás (celulares, equipos viejos,
   ahorro de datos) recibe la versión liviana: mismas secciones y mismo contenido, con efectos que solo animan transform/opacity. */
type NavegadorExtra = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export function nivelAlto(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as NavegadorExtra;
  if (n.connection?.saveData) return false;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return false;
  if ((n.hardwareConcurrency ?? 4) < 6) return false;
  if (n.deviceMemory !== undefined && n.deviceMemory < 4) return false;
  return true;
}

/** Puntero compartido: lo escribe Experience, lo lee el shader. Evita reescribir variables CSS en <html> (invalida todo el estilo). */
export const puntero = { x: 0.5, y: 0.5 };
