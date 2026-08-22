import { comprobarRequisitos } from '../chequeosEstaticos.js'
import { ErrorDeSintaxis, analizar, inyectarGuardaDeBucles } from '../guardaBucles.js'

/**
 * El frente de JavaScript: lo que se hace con el código **antes** de ejecutarlo.
 *
 * Se puede hacer todo aquí porque hay un analizador de JavaScript en el propio
 * juego (acorn): se sabe si el código se entiende, si cumple las reglas del reto
 * y se le puede meter el contador de vueltas, todo sin ejecutar una línea.
 */
export default {
  id: 'js',

  /**
   * @returns {{error?: object, requisitos?: Array, codigo: string}} `requisitos`
   *   a `null` significa «esto lo mira el sandbox», no «no hay ninguno».
   */
  revisar(codigo, reto) {
    let ast
    try {
      ast = analizar(codigo)
    } catch (error) {
      if (!(error instanceof ErrorDeSintaxis)) throw error
      return {
        error: { mensaje: error.message, linea: error.linea, columna: error.columna },
        codigo,
      }
    }

    return {
      requisitos: comprobarRequisitos(ast, reto.requisitos),
      codigo: inyectarGuardaDeBucles(codigo, ast),
    }
  },
}
