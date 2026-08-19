/**
 * Prueba de fuego del contenido: cada reto tiene que ser resoluble.
 *
 * Qué se comprueba depende del tipo:
 *
 * - los que tienen código de referencia (`codigo`, `bug`, `refactor`,
 *   `prediccion`, `ordenar`, `completar`, `trazar`) se resuelven de verdad con
 *   él y tienen que pasar sus propios tests y requisitos;
 * - los que se resuelven señalando y no ejecutan nada (`eleccion`, `emparejar`,
 *   `cazar-linea`, `etiquetar`, `verdadero-o-falso`) se revisan por forma: que
 *   haya respuesta correcta, que ninguna opción se quede sin explicación, que
 *   no falten parejas y que haya señuelos suficientes.
 *
 * Un reto imposible, o uno de elegir sin respuesta correcta, es el peor fallo
 * que puede tener un juego para aprender.
 */

import { NOMBRES_DE_TIPO, sinCodigo } from '../src/contenido/retos/tipos.js'

/**
 * Qué código ejecuta cada tipo, y cuál no tiene ninguno, sale del registro de
 * tipos y no de una copia aquí. Una lista paralela se queda desfasada en cuanto
 * se añade un tipo, y el síntoma es silencioso: el tipo nuevo deja de
 * comprobarse y nadie se entera.
 */
export { codigoDeReferencia } from '../src/contenido/retos/tipos.js'

export const SIN_CODIGO = NOMBRES_DE_TIPO.filter(sinCodigo)

/** Revisa que un reto de los de señalar esté bien montado. */
export function revisarTactil(reto) {
  const problemas = []

  if (reto.tipo === 'eleccion') {
    if (!reto.pregunta) problemas.push('no tiene pregunta')
    const opciones = reto.opciones ?? []
    if (opciones.length < 3) problemas.push('tiene menos de tres opciones')
    if (!opciones.some((o) => o.correcta)) problemas.push('no tiene ninguna opción correcta')
    if (opciones.some((o) => !o.porque)) problemas.push('hay opciones sin explicación')
  }

  if (reto.tipo === 'emparejar') {
    const parejas = reto.parejas ?? []
    if (parejas.length < 3) problemas.push('tiene menos de tres parejas')
    if (parejas.some((p) => !p.izquierda || !p.derecha)) problemas.push('hay parejas a medias')
    const izquierdas = new Set(parejas.map((p) => p.izquierda))
    const derechas = new Set(parejas.map((p) => p.derecha))
    if (izquierdas.size !== parejas.length) problemas.push('hay valores repetidos a la izquierda')
    if (derechas.size !== parejas.length) problemas.push('hay valores repetidos a la derecha')
  }

  return problemas
}
