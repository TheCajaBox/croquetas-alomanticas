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

/**
 * Cuántas tandas de práctica extra trae un reto, además de la original.
 *
 * Un reto de escribir se supera una vez y se queda ahí, y lo que hace falta
 * para que algo se te quede no es resolverlo una vez: es resolverlo tres con
 * otros datos. Las `variantes` son eso, y salen casi gratis porque los `tests`
 * de un reto ya son datos y no código: una variante es otra tanda de tests.
 */
export const cuantasVariantes = (reto) => reto?.variantes?.length ?? 0

/**
 * El reto tal y como se juega en una de sus variantes.
 *
 * La 0 es la de siempre. De la 1 en adelante se toma lo que la variante
 * cambie -normalmente los `tests`, y a veces el enunciado y el código de
 * partida- y el resto se queda igual: mismas pistas, mismo apunte, mismos
 * requisitos y **mismo `id`**, que es lo que hace que practicar no vuelva a
 * pagar croquetas ni cuente como un reto nuevo.
 */
export function enVariante(reto, indice = 0) {
  const variante = reto?.variantes?.[indice - 1]
  if (!variante) return reto
  return { ...reto, ...variante, variante: indice }
}
