import { ENTORNOS } from '../motor/protocolo.js'
import { ITINERARIOS_POR_ID, ITINERARIO_POR_DEFECTO } from './itinerarios.js'
import { MUNDOS_POR_ID } from './mundos.js'
import { RETOS_POR_ID } from './retos/index.js'

/**
 * En qué parte del juego estás, deducido de la ruta.
 *
 * Hay cosas que dependen de dónde estés y no de quién las pinte: el glosario es
 * de Steris en la segunda era y de Sazed en la primera, sus ejemplos son de
 * JavaScript o de PHP, y hay términos —`ref`, `computed`, `foreach`— que en el
 * otro camino no existen.
 *
 * Esto vive aparte y como funciones puras, no como un composable, por dos
 * motivos: lo necesitan el panel del glosario y el marcado de cada enunciado, y
 * así la regla se escribe una vez; y sin depender de Vue se puede probar sin
 * montar nada.
 */

/**
 * Con qué lenguaje se ejecuta el código de un mundo.
 *
 * Es una línea, y por eso mismo estaba copiada en tres sitios: el panel de
 * resultados, el almacén del juego y Armonía. Copiada tres veces son tres
 * ocasiones de que una se quede sin el `?? 'js'` y reviente en un mundo que
 * todavía no tiene entorno.
 */
export function lenguajeDelMundo(mundoId) {
  return ENTORNOS[MUNDOS_POR_ID[mundoId]?.entorno]?.lenguaje ?? 'js'
}

/** El mundo donde estás, o null si la ruta no es de un mundo ni de un reto. */
export function mundoDeLaRuta(params = {}) {
  if (params.mundoId) return MUNDOS_POR_ID[params.mundoId] ?? null
  if (params.retoId) return MUNDOS_POR_ID[RETOS_POR_ID[params.retoId]?.mundo] ?? null
  return null
}

/**
 * El itinerario donde estás. Fuera de un camino, el de por defecto.
 *
 * El propio `itinerarioId` va primero y a propósito: la portada de un camino
 * -`/itinerario/era1`- no nombra ningún mundo, así que mirando solo el mundo se
 * respondía «el de por defecto» estando de pie en la primera era. Con eso, la
 * barra seguía ofreciendo la casa de los gatos justo en la portada donde se
 * anuncia que allí no la hay.
 */
export function itinerarioDeLaRuta(params = {}) {
  if (params.itinerarioId && ITINERARIOS_POR_ID[params.itinerarioId]) {
    return ITINERARIOS_POR_ID[params.itinerarioId]
  }
  const mundo = mundoDeLaRuta(params)
  return ITINERARIOS_POR_ID[mundo?.itinerario] ?? ITINERARIOS_POR_ID[ITINERARIO_POR_DEFECTO]
}

/**
 * Con qué lenguaje se ejecuta el código donde estás.
 *
 * Del entorno del mundo y no del itinerario, porque un itinerario puede tener
 * dos —seguridad usa JavaScript y SQL— y lo que decide es el mundo concreto.
 */
export function lenguajeDeLaRuta(params = {}) {
  const mundo = mundoDeLaRuta(params)
  return ENTORNOS[mundo?.entorno]?.lenguaje ?? 'js'
}
