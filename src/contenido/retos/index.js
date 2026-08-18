import { MUNDOS } from '../mundos.js'

/**
 * Catálogo de retos.
 *
 * Se recogen por carpeta y se ordenan por nombre de fichero; por eso van
 * numerados. Añadir un reto es crear su fichero, sin tocar ningún índice.
 *
 * El orden entre mundos lo manda MUNDOS y no el alfabeto de las carpetas: «El
 * primer día» va antes que «Los Áridos» aunque su carpeta diga lo contrario.
 */
const modulos = import.meta.glob('./*/*.js', { eager: true })
const ordenDeMundos = Object.fromEntries(MUNDOS.map((mundo, indice) => [mundo.id, indice]))

export const RETOS = Object.keys(modulos)
  .map((ruta) => ({ ruta, reto: modulos[ruta].default }))
  .sort(
    (a, b) =>
      (ordenDeMundos[a.reto.mundo] ?? 99) - (ordenDeMundos[b.reto.mundo] ?? 99) ||
      a.ruta.localeCompare(b.ruta),
  )
  .map(({ reto }) => reto)

export const RETOS_POR_ID = Object.fromEntries(RETOS.map((reto) => [reto.id, reto]))

export const retosDelMundo = (mundoId) => RETOS.filter((reto) => reto.mundo === mundoId)

/** El siguiente reto del mismo mundo, o null si era el último. */
export function retoSiguiente(reto) {
  const hermanos = retosDelMundo(reto.mundo)
  return hermanos[hermanos.indexOf(reto) + 1] ?? null
}
