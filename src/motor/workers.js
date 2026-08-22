/**
 * Las fábricas de los workers empaquetados.
 *
 * Viven aquí y no en `ENTORNOS` porque `new URL(..., import.meta.url)` lo tiene
 * que ver Vite **escrito literalmente** para poder empaquetar el worker y sus
 * dependencias. Con la ruta guardada en un dato y montada al vuelo, Vite no la
 * reconoce, no empaqueta nada y en producción sale un 404.
 *
 * Los entornos de `public/sandbox/` no pasan por aquí: esos se sirven tal cual y
 * su ruta sí puede ser un dato.
 */
const FABRICAS = {
  php: () => new Worker(new URL('./sandbox-php/php.worker.js', import.meta.url), { type: 'module' }),
}

export function crearWorkerDeModulo(entornoId) {
  const fabrica = FABRICAS[entornoId]
  if (!fabrica) throw new Error(`No hay worker empaquetado para el entorno "${entornoId}".`)
  return fabrica()
}
