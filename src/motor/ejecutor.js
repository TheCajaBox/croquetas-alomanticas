import { analizar, ErrorDeSintaxis, inyectarGuardaDeBucles, MARCA_BUCLE_INFINITO } from './guardaBucles.js'
import { comprobarRequisitos } from './chequeosEstaticos.js'
import { crearPuenteIframe } from './puenteIframe.js'
import { crearPuenteWorker } from './puenteWorker.js'
import { TIEMPO_LIMITE_MS } from './protocolo.js'

/** Fases por las que pasa un envío. La primera que falla es la que se muestra. */
export const FASES = {
  SINTAXIS: 'sintaxis',
  REQUISITOS: 'requisitos',
  TIEMPO: 'tiempo',
  EJECUCION: 'ejecucion',
  TESTS: 'tests',
}

export function crearPuente(entorno) {
  return entorno === 'worker' ? crearPuenteWorker(entorno) : crearPuenteIframe(entorno)
}

function respuestaVacia(extra) {
  return { ok: false, requisitos: [], tests: [], consola: [], error: null, tiempoMs: 0, ...extra }
}

/**
 * Corrige un envío del jugador de principio a fin.
 *
 * El orden importa y es pedagógico: primero se mira si el código se entiende,
 * luego si respeta las reglas del reto, y solo entonces se ejecuta. Decirle
 * "has usado un `for` y aquí no se puede" antes de enseñarle diez tests en rojo
 * le ahorra el rato de arreglar lo que no era.
 *
 * @param {{reto: object, codigo: string, puente: object, tiempoLimiteMs?: number}} envio
 */
export async function evaluarEnvio({ reto, codigo, puente, tiempoLimiteMs = TIEMPO_LIMITE_MS }) {
  const arranque = performance.now()
  const cerrar = (extra) => respuestaVacia({ ...extra, tiempoMs: Math.round(performance.now() - arranque) })

  // 1. ¿Se entiende siquiera lo que has escrito?
  let ast
  try {
    ast = analizar(codigo)
  } catch (error) {
    if (!(error instanceof ErrorDeSintaxis)) throw error
    return cerrar({
      fase: FASES.SINTAXIS,
      error: { mensaje: error.message, linea: error.linea, columna: error.columna },
    })
  }

  // 2. ¿Respeta las reglas del reto?
  const requisitos = comprobarRequisitos(ast, reto.requisitos)
  if (requisitos.some((r) => !r.cumplido)) {
    return cerrar({ fase: FASES.REQUISITOS, requisitos })
  }

  // 3. A ejecutarlo, con contador de vueltas por si acaso.
  const respuesta = await puente.ejecutar(
    { codigo: inyectarGuardaDeBucles(codigo, ast), tests: reto.tests ?? [] },
    tiempoLimiteMs,
  )

  if (respuesta.agotado) {
    return cerrar({
      fase: FASES.TIEMPO,
      requisitos,
      error: { mensaje: `Tu código lleva más de ${tiempoLimiteMs / 1000} segundos sin contestar.`, agotado: true },
    })
  }

  if (respuesta.error) {
    const esBucle = respuesta.error.bucleInfinito || respuesta.error.mensaje?.includes(MARCA_BUCLE_INFINITO)
    return cerrar({
      fase: FASES.EJECUCION,
      requisitos,
      tests: respuesta.tests ?? [],
      consola: respuesta.consola ?? [],
      error: {
        mensaje: esBucle
          ? 'Uno de tus bucles no sabe cuándo parar: lleva cientos de miles de vueltas.'
          : respuesta.error.mensaje,
        bucleInfinito: !!esBucle,
      },
    })
  }

  const tests = respuesta.tests ?? []

  // Un bucle sin salida dentro de un test llega hasta aquí como un test rojo
  // más. No lo es: es un cuelgue, y merece su propio mensaje en vez de quedar
  // sepultado entre las demás comprobaciones.
  if (tests.some((test) => test.bucleInfinito)) {
    return cerrar({
      fase: FASES.EJECUCION,
      requisitos,
      tests,
      consola: respuesta.consola ?? [],
      error: {
        mensaje: 'Uno de tus bucles no sabe cuándo parar: lleva cientos de miles de vueltas.',
        bucleInfinito: true,
      },
    })
  }

  return cerrar({
    fase: FASES.TESTS,
    ok: tests.length > 0 && tests.every((t) => t.ok),
    requisitos,
    tests,
    consola: respuesta.consola ?? [],
  })
}
