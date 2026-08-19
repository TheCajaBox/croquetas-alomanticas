/**
 * Lo que contesta Armonía.
 *
 * Recupera y ordena; no redacta código. Toda la respuesta se arma con material
 * que el jugador ya tiene gratis delante -el apunte, el glosario, la lista de
 * imprevistos- más el diagnóstico que el propio juego ya calcula al ejecutar.
 *
 * ## Lo único que no puede hacer
 *
 * Escribir la solución. Y no porque se lo hayamos prohibido: porque no la
 * tiene. El corpus se construye sin ella (ver `contenido/armonia/corpus.js`).
 * Cuando se niega no está citando un reglamento, está siendo quien es —podría
 * intervenir, y intervenir de más estropea justo lo que intenta sostener.
 */
import { traducirImprevisto } from '../../contenido/imprevistos.js'
import { citar, corpusYaConstruido } from '../../contenido/armonia/corpus.js'
import { RETOS_POR_ID } from '../../contenido/retos/index.js'
import { comprobarRequisitos } from '../chequeosEstaticos.js'
import { analizar } from '../guardaBucles.js'
import { buscar, prepararBusqueda, retosQueEnsenan } from './buscar.js'
import { clasificar } from './intencion.js'

/** Cuántas veces hay que pedirle la solución para que te llame la atención. */
const PACIENCIA = 3

const primeraLinea = (texto) => texto.split('\n')[0]

/** Una cita por reto: repetir el mismo reto tres veces no informa de nada. */
function citasUnicas(trozos, cuantas = 3) {
  const vistos = new Set()
  const citas = []
  for (const trozo of trozos) {
    const clave = trozo.retoId ?? trozo.id
    if (vistos.has(clave)) continue
    vistos.add(clave)
    citas.push(citar(trozo))
    if (citas.length === cuantas) break
  }
  return citas
}

const respuesta = (tipo, texto, citas = []) => ({ tipo, texto, citas })

// ---------------------------------------------------------------------------
// Las respuestas, una por intención
// ---------------------------------------------------------------------------

function seNiega(veces) {
  if (veces >= PACIENCIA) {
    return respuesta(
      'peticion',
      [
        'Me lo has pedido tres veces, así que te contestaré como si me llamaras Sazed, que',
        'es lo que hace Wax cuando quiere recordarme que un día fui un hombre y no esto.',
        '',
        'La respuesta sigue siendo no, y por la misma razón: **lo que te daría no te serviría**.',
        'No es prudencia ni es una norma del juego. Es que he visto lo que pasa cuando doy',
        'de más, y no vuelvo a hacerlo.',
        '',
        'Wayne te vende pistas. Yo te ayudo a no necesitarlas. Pregúntame qué no entiendes.',
      ].join('\n'),
    )
  }

  return respuesta(
    'peticion',
    [
      'No.',
      '',
      'Podría. Lo sé todo de este ejercicio, igual que sé lo demás. Y si te lo diera, mañana',
      'estarías exactamente donde estás ahora, sólo que un día más tarde.',
      '',
      'Wayne te lo vendería sin pensarlo, y a un precio que le conviene a él. Yo no puedo',
      'permitirme ser tan generoso.',
      '',
      'Dime qué parte no entiendes y esa sí te la explico.',
    ].join('\n'),
  )
}

function porElError(imprevisto, reto) {
  const relacionados = buscar(`${imprevisto.titulo} ${imprevisto.causas?.[0] ?? ''}`, {
    retoId: reto?.id ?? null,
      mundoId: reto?.mundo ?? null,
    tipos: ['apunte', 'termino'],
    cuantos: 4,
  })

  const lineas = [
    `**${imprevisto.titulo}.**`,
    '',
    imprevisto.significa,
  ]

  if (imprevisto.causas?.length) {
    lineas.push('', 'Lo que suele haberlo causado:', '')
    for (const causa of imprevisto.causas) lineas.push(`- ${causa}`)
  }

  return respuesta('error', lineas.join('\n'), citasUnicas(relacionados))
}

/**
 * El diagnóstico, que es lo que Armonía puede hacer y un chatbot cualquiera no:
 * mira tu código de verdad y mira qué test se ha puesto rojo.
 *
 * El mejor material está regalado: los tests de este juego tienen nombres
 * escritos como frases, así que **el nombre del test que falla ya es la
 * pregunta que había que hacerse**. Se devuelve tal cual, sin adornarlo.
 */
function diagnosticar(reto, codigo, resultado) {
  // 1. ¿Se entiende siquiera lo que has escrito?
  if (codigo?.trim()) {
    try {
      const ast = analizar(codigo)

      // 2. ¿Respeta las reglas del reto?
      const incumplidos = comprobarRequisitos(ast, reto?.requisitos ?? []).filter(
        (r) => !r.cumplido,
      )
      if (incumplidos.length > 0) {
        return respuesta(
          'diagnostico',
          [
            'Tu código se entiende: no es la sintaxis. Lo que pasa es que este reto pide algo',
            'concreto que todavía no está:',
            '',
            ...incumplidos.map((r) => `- ${r.mensaje}`),
            '',
            'Míralo antes de seguir. Mientras eso falte, no se llega a ejecutar nada.',
          ].join('\n'),
          citasUnicas(buscar(incumplidos.map((r) => r.mensaje).join(' '), {
            retoId: reto?.id ?? null,
      mundoId: reto?.mundo ?? null,
            tipos: ['apunte'],
            cuantos: 3,
          })),
        )
      }
    } catch (error) {
      const traducido = traducirImprevisto(error.message)
      const donde = error.linea ? ` Empieza por la línea ${error.linea}.` : ''
      return respuesta(
        'diagnostico',
        traducido
          ? `**${traducido.titulo}.**\n\n${traducido.significa}${donde}`
          : `Tu código todavía no se puede leer entero.${donde}\n\n${error.message}`,
      )
    }
  }

  // 3. ¿Qué dijo la última ejecución?
  const fallado = resultado?.tests?.find((test) => !test.ok)
  if (fallado) {
    const lineas = [
      'Tu código se entiende y cumple lo que el reto pide, así que no es ni la sintaxis ni',
      'las reglas. Lo que no cuadra es el comportamiento.',
      '',
      `El primero que se pone rojo se llama **«${fallado.nombre}»**.`,
      '',
      'Léelo otra vez despacio, porque ese nombre está escrito a propósito: dice el caso',
      'exacto en el que tu código se comporta de otra manera. Piensa qué hace el tuyo',
      'justo en ese caso, y no en los demás.',
    ]
    if (fallado.detalle) lineas.push('', `Lo que se esperaba frente a lo que salió: ${fallado.detalle}`)

    return respuesta(
      'diagnostico',
      lineas.join('\n'),
      citasUnicas(buscar(fallado.nombre, { retoId: reto?.id ?? null,
      mundoId: reto?.mundo ?? null, tipos: ['apunte'], cuantos: 3 })),
    )
  }

  if (resultado?.error) {
    const traducido = traducirImprevisto(resultado.error.mensaje)
    if (traducido) return porElError(traducido, reto)
    return respuesta('diagnostico', `Lo que devolvió tu última ejecución fue esto:\n\n${resultado.error.mensaje}`)
  }

  return respuesta(
    'diagnostico',
    [
      'Todavía no has ejecutado nada, o lo último que ejecutaste salió bien, así que no',
      'tengo nada concreto que mirar.',
      '',
      'Dale a ejecutar aunque creas que está mal: lo que salga en rojo dirá más que yo.',
      'Y si algo del enunciado no se entiende, pregúntamelo con sus palabras.',
    ].join('\n'),
  )
}

function definir(terminos, pregunta, reto) {
  const fichas = terminos
    .map((t) => (corpusYaConstruido() ?? []).find((trozo) => trozo.terminoId === t.id))
    .filter(Boolean)

  if (fichas.length === 0) return general(pregunta, reto)

  const lineas = []
  for (const ficha of fichas.slice(0, 3)) {
    lineas.push(`**${ficha.titulo}.** ${ficha.texto.split('\n')[0]}`)
    const ejemplo = ficha.texto.split('\n').slice(1).join('\n').trim()
    if (ejemplo) lineas.push('', `\`${ejemplo}\``)
    lineas.push('')
  }

  // Para «dónde se explica» no se busca por texto: se mira dónde aparece el
  // término por primera vez jugando, que es donde de verdad te lo enseñaron.
  const donde = []
  for (const termino of terminos) {
    for (const reto of retosQueEnsenan(termino.id).slice(0, 2)) {
      if (donde.some((c) => c.retoId === reto.id)) continue
      donde.push({ fuente: 'apunte', reto: reto.titulo, seccion: null, retoId: reto.id })
    }
  }

  if (donde.length > 0) lineas.push('Donde se explica con calma:')

  return respuesta('definicion', lineas.join('\n').trim(), donde.slice(0, 3))
}

function donde(pregunta, reto) {
  const encontrados = buscar(pregunta, { retoId: reto?.id ?? null,
      mundoId: reto?.mundo ?? null, tipos: ['apunte', 'enunciado'], cuantos: 6 })
  if (encontrados.length === 0) {
    return respuesta('donde', 'No encuentro dónde se explicó eso. Prueba a decírmelo con otras palabras.')
  }
  return respuesta('donde', 'Eso está aquí:', citasUnicas(encontrados))
}

function general(pregunta, reto) {
  const encontrados = buscar(pregunta, { retoId: reto?.id ?? null,
      mundoId: reto?.mundo ?? null, cuantos: 5 })
  if (encontrados.length === 0) {
    return respuesta(
      'general',
      [
        'No tengo nada guardado sobre eso.',
        '',
        'Lo que recuerdo son los apuntes de Wax, el glosario de Steris y los errores que da',
        'este juego. Si me lo preguntas con las palabras que salen en el reto, lo encontraré.',
      ].join('\n'),
    )
  }

  const mejor = encontrados[0]
  return respuesta('general', mejor.texto.trim(), citasUnicas(encontrados))
}

/** Se retira: en un jefe no diagnostica, solo define y traduce. */
function seRetira() {
  return respuesta(
    'retirado',
    [
      'Aquí no.',
      '',
      'Esto es el final de un mundo, y en los finales me aparto. Wayne ni siquiera te vende',
      'pistas para esto, y con razón: todo lo que hace falta ya lo has visto en los retos de',
      'antes, y sabrás que lo sabes precisamente por resolverlo sin nadie detrás.',
      '',
      'Lo que sí sigo haciendo: dime una palabra que no entiendas y te la explico, y pégame',
      'un error si te sale uno y te digo qué significa. Lo demás es tuyo.',
    ].join('\n'),
  )
}

// ---------------------------------------------------------------------------

/**
 * Trae los apuntes y monta el índice de búsqueda.
 *
 * Hay que llamarlo una vez antes de la primera pregunta. Se separa de
 * `responder` para que responder pueda seguir siendo síncrono: es lo que se
 * llama en cada turno, y a partir de la segunda pregunta no hay nada que
 * esperar.
 */
export async function prepararArmonia() {
  await prepararBusqueda()
}

/**
 * @param {string} pregunta
 * @param {{reto?: object, retoId?: string, codigo?: string, resultado?: object,
 *          vecesQuePidioSolucion?: number}} contexto
 */
export function responder(pregunta, contexto = {}) {
  const reto = contexto.reto ?? (contexto.retoId ? RETOS_POR_ID[contexto.retoId] : null)
  const { codigo = '', resultado = null, vecesQuePidioSolucion = 0 } = contexto

  const intencion = clasificar(pregunta, { resultado })

  if (intencion.tipo === 'peticion') return seNiega(vecesQuePidioSolucion + 1)
  if (intencion.tipo === 'error') return porElError(intencion.errorDetectado, reto)

  // En un jefe solo quedan las dos cosas que no acercan la respuesta: qué
  // significa una palabra y qué significa un error.
  if (reto?.jefe) return seRetira()

  if (intencion.tipo === 'diagnostico') return diagnosticar(reto, codigo, resultado)
  if (intencion.tipo === 'donde') return donde(pregunta, reto)
  if (intencion.tipo === 'definicion') return definir(intencion.terminos, pregunta, reto)
  return general(pregunta, reto)
}

export { primeraLinea }
