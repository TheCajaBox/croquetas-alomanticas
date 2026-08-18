import { parse } from 'acorn'

import { recorrerAst } from './recorrerAst.js'

/**
 * Un bucle que dé más vueltas que esto no está resolviendo ningún reto del
 * juego: se le ha olvidado la condición de salida.
 */
export const VUELTAS_MAXIMAS = 200000

/** Marca que el sandbox reconoce para distinguir un cuelgue de un error normal. */
export const MARCA_BUCLE_INFINITO = '__BUCLE_INFINITO__'

const TIPOS_DE_BUCLE = [
  'ForStatement',
  'WhileStatement',
  'DoWhileStatement',
  'ForOfStatement',
  'ForInStatement',
]

/**
 * El contador va al FINAL del código, no al principio, y es una declaración de
 * función para que el hoisting lo suba solo. Así el código del jugador
 * conserva sus números de línea y los errores señalan donde debe.
 */
const CONTADOR = `
function __guardaBucles(id){var c=__guardaBucles.cuentas||(__guardaBucles.cuentas=Object.create(null));if((c[id]=(c[id]||0)+1)>${VUELTAS_MAXIMAS}){throw new Error(${JSON.stringify(MARCA_BUCLE_INFINITO)})}}`

export class ErrorDeSintaxis extends Error {
  constructor(mensaje, linea, columna) {
    super(mensaje)
    this.name = 'ErrorDeSintaxis'
    this.linea = linea
    this.columna = columna
  }
}

/**
 * Parsea el código del jugador tal y como se va a ejecutar: dentro de una
 * función asíncrona, de ahí que se permitan `await` y `return` sueltos.
 * @throws {ErrorDeSintaxis} con línea y columna aprovechables por el editor
 */
export function analizar(codigo) {
  try {
    return parse(codigo, {
      ecmaVersion: 2022,
      sourceType: 'script',
      locations: true,
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true,
    })
  } catch (error) {
    const linea = error.loc?.line ?? null
    const columna = error.loc?.column != null ? error.loc.column + 1 : null
    // El mensaje de acorn ya trae "(3:12)" al final; en el juego la posición se
    // muestra aparte, así que sobra.
    const mensaje = String(error.message).replace(/\s*\(\d+:\d+\)\s*$/, '')
    throw new ErrorDeSintaxis(mensaje, linea, columna)
  }
}

/**
 * Mete un contador en el cuerpo de cada bucle para que un `while (true)` acabe
 * lanzando un error en vez de congelar la pestaña.
 */
export function inyectarGuardaDeBucles(codigo, ast) {
  const inserciones = []
  let siguienteId = 0

  recorrerAst(ast, (nodo) => {
    if (!TIPOS_DE_BUCLE.includes(nodo.type)) return
    const guarda = `__guardaBucles(${++siguienteId});`
    if (nodo.body.type === 'BlockStatement') {
      inserciones.push({ posicion: nodo.body.start + 1, texto: guarda })
    } else {
      // Bucle sin llaves (`while (x) hazAlgo()`): hay que ponérselas.
      inserciones.push({ posicion: nodo.body.start, texto: `{${guarda}` })
      inserciones.push({ posicion: nodo.body.end, texto: '}' })
    }
  })

  if (inserciones.length === 0) return codigo

  // De atrás hacia delante, para que cada inserción no desplace a las anteriores.
  inserciones.sort((a, b) => b.posicion - a.posicion)
  let resultado = codigo
  for (const { posicion, texto } of inserciones) {
    resultado = resultado.slice(0, posicion) + texto + resultado.slice(posicion)
  }
  return resultado + CONTADOR
}
