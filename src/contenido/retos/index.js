import { FICHAS } from 'virtual:fichas-de-retos'

import { MUNDOS } from '../mundos.js'

/**
 * Catálogo de retos: la ficha ahora, el cuerpo cuando se abre.
 *
 * Añadir un reto sigue siendo crear su fichero en `retos/<mundo>/`, sin tocar
 * ningún índice. Lo que ha cambiado es **cuánto de él viaja en el arranque**.
 *
 * ## Ficha y cuerpo
 *
 * - La **ficha** —id, mundo, entorno, tipo, título, si es jefe, la recompensa y
 *   los requisitos— la genera al compilar `scripts/plugin-fichas-de-retos.mjs`.
 *   Es lo justo para pintar la lista de un mundo, decidir qué está abierto,
 *   contar el avance y repartir insignias, y son unos 16 kB entre los 102.
 * - El **cuerpo** —enunciado, código de partida, solución, tests, pistas,
 *   opciones, explicaciones, variantes— son 234 kB y solo hacen falta con el
 *   reto abierto. Se piden de uno en uno con `cargarReto`.
 *
 * Antes iba todo junto y ansioso, así que quien entraba a mirar la portada se
 * descargaba las soluciones de los 102 retos. Medido: era casi un tercio del
 * paquete principal, y cada mundo nuevo lo empeoraba.
 *
 * ## La regla que no se puede romper
 *
 * Los `import()` de los cuerpos viven **solo en este fichero**. Si otro módulo
 * importara un reto de forma estática, Rollup dejaría de poder separarlo y su
 * trozo volvería al paquete principal sin que nada fallara ni avisara. Hay una
 * prueba que recorre `src/` para que eso no pueda pasar por descuido.
 */
const cuerpos = import.meta.glob('./*/*.js')

/**
 * El orden entre mundos lo manda MUNDOS y no el alfabeto de las carpetas: «El
 * primer día» va antes que «Los Áridos» aunque su carpeta diga lo contrario.
 * Dentro de un mundo, el nombre del fichero; por eso van numerados.
 */
const ordenDeMundos = Object.fromEntries(MUNDOS.map((mundo, indice) => [mundo.id, indice]))

const enOrdenDeJuego = [...FICHAS].sort(
  (a, b) =>
    (ordenDeMundos[a.mundo] ?? 99) - (ordenDeMundos[b.mundo] ?? 99) || a.ruta.localeCompare(b.ruta),
)

/** De qué fichero sale el cuerpo de cada reto. Fuera de la ficha: es fontanería. */
const RUTA_POR_ID = Object.fromEntries(enOrdenDeJuego.map(({ id, ruta }) => [id, ruta]))

/** Las fichas, en el orden en que se juegan. */
export const RETOS = enOrdenDeJuego.map(({ ruta, ...ficha }) => ficha)

export const RETOS_POR_ID = Object.fromEntries(RETOS.map((reto) => [reto.id, reto]))

export const retosDelMundo = (mundoId) => RETOS.filter((reto) => reto.mundo === mundoId)

/** El siguiente reto del mismo mundo, o null si era el último. */
export function retoSiguiente(reto) {
  const hermanos = retosDelMundo(reto.mundo)
  // Por id y no por identidad: quien llame a esto puede tener el reto completo
  // -recién cargado- en vez de la ficha del catálogo, y entonces `indexOf` no
  // lo encontraría y devolvería siempre el primero.
  return hermanos[hermanos.findIndex((cada) => cada.id === reto.id) + 1] ?? null
}

/**
 * El reto entero: ficha y cuerpo.
 *
 * El cuerpo es una carga local, así que se ve al momento; a cambio, un reto
 * puede tener todos los tests, pistas y explicaciones que haga falta sin
 * encarecer el arranque de nadie.
 *
 * @returns {Promise<object|null>} el reto, o null si ese id no existe.
 */
export async function cargarReto(retoId) {
  const cargador = cuerpos[RUTA_POR_ID[retoId]]
  if (!cargador) return null
  return (await cargador()).default
}

let todos = null

/**
 * Todos los retos enteros, para lo que necesite mirarlos juntos: el corpus de
 * Armonía y las pruebas del contenido. Se piden una sola vez y se quedan
 * guardados.
 */
export async function cargarTodosLosRetos() {
  if (todos) return todos
  todos = await Promise.all(RETOS.map((ficha) => cargarReto(ficha.id)))
  return todos
}

/** Los retos enteros de un mundo, en orden. */
export async function cargarRetosDelMundo(mundoId) {
  return Promise.all(retosDelMundo(mundoId).map((ficha) => cargarReto(ficha.id)))
}

/**
 * Cuántas tandas de práctica extra trae un reto, además de la original.
 *
 * Un reto de escribir se supera una vez y se queda ahí, y lo que hace falta
 * para que algo se te quede no es resolverlo una vez: es resolverlo tres con
 * otros datos. Las `variantes` son eso, y salen casi gratis porque los `tests`
 * de un reto ya son datos y no código: una variante es otra tanda de tests.
 *
 * Vive en el cuerpo, así que hay que tener el reto cargado para preguntarlo.
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
