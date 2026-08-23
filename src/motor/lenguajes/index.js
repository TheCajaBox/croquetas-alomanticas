import { ENTORNOS } from '../protocolo.js'
import js from './js.js'
import php from './php.js'
import sql from './sql.js'

/**
 * Qué se hace con el código de cada lenguaje antes de ejecutarlo.
 *
 * Antes esto no existía y `evaluarEnvio` daba por hecho que todo era
 * JavaScript: pasaba el código por acorn, le buscaba los requisitos en el árbol
 * y le inyectaba el contador de bucles. Con un reto de PHP delante, el primer
 * paso decía «tu código no se puede ni leer» señalando la línea 1.
 */
const FRENTES = { js, php, sql }

export function frenteDe(entornoId) {
  const lenguaje = ENTORNOS[entornoId]?.lenguaje
  const frente = FRENTES[lenguaje]
  // Falla aquí y en voz alta: si esto devolviera el de JavaScript por descarte,
  // un entorno nuevo mal declarado se pasaría el código por un analizador que
  // no es el suyo y el error saldría por donde no toca.
  if (!frente) {
    throw new Error(`El entorno "${entornoId}" no declara un lenguaje con frente conocido.`)
  }
  return frente
}
