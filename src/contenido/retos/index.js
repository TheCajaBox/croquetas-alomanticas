/**
 * Catálogo de retos.
 *
 * Se recogen por carpeta y se ordenan por nombre de fichero; por eso van
 * numerados. Añadir un reto es crear su fichero, sin tocar ningún índice.
 */
const modulos = import.meta.glob('./*/*.js', { eager: true })

export const RETOS = Object.keys(modulos)
  .sort((a, b) => a.localeCompare(b))
  .map((ruta) => modulos[ruta].default)

export const RETOS_POR_ID = Object.fromEntries(RETOS.map((reto) => [reto.id, reto]))

export const retosDelMundo = (mundoId) => RETOS.filter((reto) => reto.mundo === mundoId)

/** El siguiente reto del mismo mundo, o null si era el último. */
export function retoSiguiente(reto) {
  const hermanos = retosDelMundo(reto.mundo)
  return hermanos[hermanos.indexOf(reto) + 1] ?? null
}
