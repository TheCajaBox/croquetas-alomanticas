/**
 * La revisión de Marasi sobre el código que acabas de escribir.
 *
 * Se ejecuta cuando el reto ya está superado, así que no puede bloquear ni
 * frustrar: lo peor que puede pasar es que te dé una idea. Ese orden -primero
 * que funcione, después que esté bien- es el que se sigue en el oficio, y el
 * único que no desanima a quien está aprendiendo.
 */
import { PRACTICAS } from '../../contenido/marasi/practicas.js'
import { recorrerAst } from '../recorrerAst.js'
import { analizar } from '../guardaBucles.js'

/** Cuántos avisos se enseñan de una vez. Una lista de doce no la lee nadie. */
const MAXIMO = 3

/**
 * @param {string} codigo lo que ha escrito el jugador
 * @returns {Array<{id, titulo, porque, ejemplos}>} lo que se podría dejar mejor
 */
export function revisar(codigo) {
  if (!codigo?.trim()) return []

  let ast
  try {
    ast = analizar(codigo)
  } catch {
    // Si no se puede leer, no se revisa. No debería pasar -esto se llama con
    // un reto ya superado- pero un informe no puede reventar nada.
    return []
  }

  const nodos = []
  recorrerAst(ast, (nodo) => nodos.push(nodo))

  const avisos = []
  for (const practica of PRACTICAS) {
    let encontrados
    try {
      encontrados = practica.encontrar({ nodos, ast }) ?? []
    } catch {
      continue
    }
    if (encontrados.length === 0) continue

    avisos.push({
      id: practica.id,
      titulo: practica.titulo,
      porque: practica.porque,
      // Se nombra lo concreto que se ha visto: «el let `total`» dice más que
      // «hay un let que no cambia», y se puede ir a buscar.
      ejemplos: [...new Set(encontrados.map((e) => e.que).filter(Boolean))].slice(0, 3),
    })
  }

  return avisos.slice(0, MAXIMO)
}

/** Cuántas cosas ha mirado, para poder decirlo cuando no hay nada que decir. */
export const CUANTAS_PRACTICAS = PRACTICAS.length
