/**
 * Prueba de fuego del contenido: cada reto tiene que ser resoluble.
 *
 * Qué se comprueba depende del tipo:
 *
 * - los que ejecutan código (`codigo`, `bug`, `prediccion`, `ordenar`,
 *   `completar`) se resuelven de verdad con su solución de referencia y tienen
 *   que pasar sus propios tests y requisitos;
 * - los que se resuelven señalando (`eleccion`, `emparejar`) no ejecutan nada,
 *   así que lo que se revisa es que estén bien formados: que haya respuesta
 *   correcta, que ninguna opción se quede sin explicación, y que no falten
 *   parejas.
 *
 * Un reto imposible, o uno de elegir sin respuesta correcta, es el peor fallo
 * que puede tener un juego para aprender.
 */

/** El código con el que un reto debería resolverse, según su tipo. */
export function codigoDeReferencia(reto) {
  if (reto.tipo === 'prediccion') return reto.codigoMostrado
  if (reto.tipo === 'ordenar') return reto.lineas.join('\n')
  return reto.solucion
}

export const SIN_CODIGO = ['eleccion', 'emparejar']

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
