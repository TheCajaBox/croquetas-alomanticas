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

  if (reto.tipo === 'verdadero-o-falso') {
    const afirmaciones = reto.afirmaciones ?? []
    if (afirmaciones.length < 4) problemas.push('tiene menos de cuatro afirmaciones')
    if (afirmaciones.length > 8) problemas.push('tiene más de ocho afirmaciones')
    if (afirmaciones.some((a) => !a.texto)) problemas.push('hay afirmaciones sin texto')
    if (afirmaciones.some((a) => !a.porque)) problemas.push('hay afirmaciones sin explicación')
    // Todas verdaderas o todas falsas se acierta sin leer, marcando en bloque.
    const verdaderas = afirmaciones.filter((a) => a.verdadera).length
    if (verdaderas === 0) problemas.push('no tiene ninguna verdadera')
    if (verdaderas === afirmaciones.length) problemas.push('no tiene ninguna falsa')
  }

  if (reto.tipo === 'cazar-linea') {
    const lineas = (reto.codigoMostrado ?? '').split('\n')
    if (!reto.errorMostrado) problemas.push('no enseña el error')
    if (lineas.length < 4) problemas.push('tiene menos de cuatro líneas donde elegir')
    if (!Number.isInteger(reto.lineaCulpable)) problemas.push('no dice cuál es la línea culpable')
    else if (reto.lineaCulpable < 1 || reto.lineaCulpable > lineas.length) {
      problemas.push('la línea culpable se sale del código')
    }
    const explicaciones = reto.explicaciones ?? {}
    if (!explicaciones[reto.lineaCulpable]) problemas.push('la línea culpable no se explica')
    // Sin señuelos explicados, fallar no enseña nada: solo dice que fallaste.
    if (Object.keys(explicaciones).length < 3) problemas.push('tiene menos de dos señuelos explicados')
  }

  if (reto.tipo === 'etiquetar') {
    const fragmentos = reto.fragmentos ?? []
    const marcables = fragmentos.filter((f) => f.etiqueta)
    const etiquetas = reto.etiquetas ?? []
    if (marcables.length < 3) problemas.push('tiene menos de tres trozos que nombrar')
    if (fragmentos.some((f) => !f.texto)) problemas.push('hay fragmentos sin texto')
    const usadas = new Set(marcables.map((f) => f.etiqueta))
    for (const etiqueta of usadas) {
      if (!etiquetas.includes(etiqueta)) problemas.push(`la etiqueta «${etiqueta}» no está entre las que se ofrecen`)
    }
    // Sin señuelos se resuelve por descarte, que no es reconocer nada.
    if (etiquetas.length - usadas.size < 2) problemas.push('tiene menos de dos etiquetas señuelo')
    if (new Set(etiquetas).size !== etiquetas.length) problemas.push('hay etiquetas repetidas')
  }

  if (reto.tipo === 'trazar') {
    const pasos = reto.pasos ?? []
    const variables = reto.variables ?? []
    const posibles = reto.valoresPosibles ?? []
    if (variables.length === 0) problemas.push('no dice qué variables se siguen')
    if (pasos.length < 3) problemas.push('tiene menos de tres pasos')
    if (pasos.some((p) => !p.etiqueta)) problemas.push('hay pasos sin nombre')

    const usados = new Set()
    for (const paso of pasos) {
      for (const variable of variables) {
        const valor = paso.valores?.[variable]
        if (valor === undefined) problemas.push(`falta el valor de ${variable} en «${paso.etiqueta}»`)
        else usados.add(valor)
      }
    }
    for (const valor of usados) {
      if (!posibles.includes(valor)) problemas.push(`el valor «${valor}» no está entre los que se ofrecen`)
    }
    // Sin señuelos, la tabla se rellena colocando todo lo que hay y ya está.
    if (posibles.length - usados.size < 2) problemas.push('tiene menos de dos valores señuelo')
    if (new Set(posibles).size !== posibles.length) problemas.push('hay valores repetidos')
  }

  return problemas
}
