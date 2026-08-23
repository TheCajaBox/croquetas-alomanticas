import { MARCA_BUCLE_INFINITO } from './guardaBucles.js'
import { frenteDe } from './lenguajes/index.js'
import { crearPuenteIframe } from './puenteIframe.js'
import { crearPuenteWorker } from './puenteWorker.js'
import { ENTORNOS, TIEMPO_LIMITE_MS } from './protocolo.js'

/** Fases por las que pasa un envío. La primera que falla es la que se muestra. */
export const FASES = {
  SINTAXIS: 'sintaxis',
  REQUISITOS: 'requisitos',
  TIEMPO: 'tiempo',
  EJECUCION: 'ejecucion',
  TESTS: 'tests',
}

export function crearPuente(entorno) {
  // Por el canal declarado y no por el nombre: con dos entornos que hablan por
  // worker -JavaScript y PHP- comparar contra la cadena 'worker' mandaba PHP al
  // iframe, que no tiene dónde montar nada.
  const canal = ENTORNOS[entorno]?.canal
  if (!canal) throw new Error(`Entorno desconocido: "${entorno}".`)
  return canal === 'iframe' ? crearPuenteIframe(entorno) : crearPuenteWorker(entorno)
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

  // 1 y 2. ¿Se entiende, y respeta las reglas del reto? Cada lenguaje lo mira a
  // su manera: JavaScript aquí mismo con su analizador, PHP dentro del sandbox
  // porque quien sabe de PHP es PHP. Ver `motor/lenguajes/`.
  const frente = frenteDe(reto.entorno)
  const revision = frente.revisar(codigo, reto)

  if (revision.error) {
    return cerrar({ fase: FASES.SINTAXIS, error: revision.error })
  }

  if (revision.requisitos?.some((r) => !r.cumplido)) {
    return cerrar({ fase: FASES.REQUISITOS, requisitos: revision.requisitos })
  }

  // 3. A ejecutarlo. Los requisitos van también al sandbox: los lenguajes que no
  // se pueden revisar desde aquí los comprueban allí y los devuelven.
  const respuesta = await puente.ejecutar(
    {
      codigo: revision.codigo,
      tests: reto.tests ?? [],
      requisitos: revision.requisitos === null ? (reto.requisitos ?? []) : [],
      // Con qué tiene que hablar el código. Solo los retos de SQL traen esto:
      // las `CREATE TABLE` y las `INSERT` que montan la base antes de que la
      // consulta del jugador la toque. Viaja en la petición y no en el sandbox
      // porque **es del reto**: cada uno tiene sus tablas y sus filas.
      esquema: reto.esquema ?? null,
      datos: reto.datos ?? null,
      // Y lo que le entra a la consulta desde fuera, por nombre. Es del mundo
      // de la inyección: SQLite los ata como parámetros, así que el valor llega
      // como dato y no como trozo de la orden. Quien pegue el valor dentro de la
      // consulta en vez de usar `:nombre` verá el ataque funcionando.
      entradas: reto.entradas ?? null,
    },
    tiempoLimiteMs,
  )

  const requisitos = revision.requisitos ?? respuesta.requisitos ?? []

  if (respuesta.agotado) {
    return cerrar({
      fase: FASES.TIEMPO,
      requisitos,
      error: { mensaje: `Tu código lleva más de ${tiempoLimiteMs / 1000} segundos sin contestar.`, agotado: true },
    })
  }

  // Lo que el sandbox haya visto: la sintaxis y las reglas que aquí no se podían
  // mirar. El orden se mantiene -primero si se entiende, luego si vale- para que
  // el jugador lea siempre lo mismo, venga de donde venga.
  if (respuesta.error?.sintaxis) {
    return cerrar({ fase: FASES.SINTAXIS, requisitos: [], error: respuesta.error })
  }

  if (requisitos.some((r) => !r.cumplido)) {
    return cerrar({ fase: FASES.REQUISITOS, requisitos, consola: respuesta.consola ?? [] })
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
