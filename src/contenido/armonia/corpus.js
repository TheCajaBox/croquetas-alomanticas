/**
 * Lo que Armonía recuerda.
 *
 * No inventa nada: recupera. El corpus se arma al cargar con material que ya
 * existe en el juego —el glosario de Steris, los apuntes de Wax, la lista de
 * imprevistos y los enunciados— troceado para poder citarlo con precisión.
 *
 * ## La lista blanca
 *
 * De cada reto entran EXACTAMENTE tres campos: `titulo`, `enunciado` y
 * `apunte`. Nada más. Y es lista blanca y no lista negra a propósito: los
 * cuatro tipos táctiles guardan su respuesta en sitios distintos -`solucion`,
 * `respuestaEsperada`, `opciones[].correcta`, `lineas` en su orden bueno,
 * `fichas`- y una lista de campos prohibidos se quedaría desfasada el día que
 * se añada un tipo nuevo. Con lista blanca, un campo nuevo nace fuera.
 *
 * De ahí sale la única garantía que de verdad vale: Armonía no puede filtrar
 * una solución porque no la tiene. No es una promesa suya, es que no está.
 */
import { cargarTodosLosApuntes } from '../apuntes/index.js'
import { GLOSARIO } from '../glosario.js'
import { IMPREVISTOS } from '../imprevistos.js'
import { MUNDOS_POR_ID } from '../mundos.js'
import { RETOS } from '../retos/index.js'

/** Trozos más cortos que esto no se indexan: no dicen nada por sí solos. */
const MINIMO_UTIL = 40

/**
 * Parte un apunte en trozos citables.
 *
 * Los apuntes no están escritos todos igual. Los de La comisaría y El taller
 * llevan secciones `## Titular` y se parten por ahí, que además da un nombre
 * que citar. Los anteriores son prosa seguida y se parten por párrafos.
 *
 * En los dos casos, un bloque de código se queda pegado al párrafo que lo
 * introduce: un fragmento de código suelto como resultado de búsqueda no le
 * sirve a nadie, porque lo que explica qué hace está justo encima.
 */
export function trocearApunte(apunte) {
  if (!apunte) return []

  const lineas = apunte.split('\n')
  const trozos = []
  let titular = null
  let acumulado = []
  let dentroDeCodigo = false

  const cerrar = () => {
    const texto = acumulado.join('\n').trim()
    acumulado = []
    // Con titular entra aunque sea corto: sin él, el titular se perdería.
    if (texto.length >= MINIMO_UTIL || (titular && texto)) trozos.push({ titular, texto })
  }

  for (const linea of lineas) {
    if (linea.startsWith('```')) {
      dentroDeCodigo = !dentroDeCodigo
      acumulado.push(linea)
      continue
    }

    // Dentro de un bloque de código no hay ni titulares ni párrafos: hay código.
    if (dentroDeCodigo) {
      acumulado.push(linea)
      continue
    }

    if (linea.startsWith('## ')) {
      cerrar()
      titular = linea.slice(3).trim()
      continue
    }

    // Una línea en blanco solo corta si lo que sigue no es un bloque de código,
    // porque entonces el código se separaría de su explicación.
    if (linea.trim() === '') {
      acumulado.push('')
      continue
    }

    acumulado.push(linea)
  }
  cerrar()

  return pegarCodigoHuerfano(trozos)
}

/**
 * Junta con el trozo anterior cualquiera que sea solo código. Pasa en los
 * apuntes de prosa, donde el bloque va tras una línea en blanco y se quedaría
 * suelto, sin la frase que dice qué está mirando el que lee.
 *
 * Dos condiciones, y las dos importan:
 *
 * - No se cruza la frontera de una sección. Pegar el código de «Y, o, no» al
 *   final de «Verdadero-ish» lo dejaría citado bajo el titular equivocado, que
 *   para lo que sirve esto es peor que no citarlo.
 * - Un trozo que sea solo código pero tenga titular propio se queda como está:
 *   ahí el titular ES la explicación, y se cita igual de bien.
 */
function pegarCodigoHuerfano(trozos) {
  const juntados = []
  for (const trozo of trozos) {
    const sinCodigo = trozo.texto.replace(/```[\s\S]*?```/g, '').trim()
    const soloCodigo = sinCodigo.length < MINIMO_UTIL
    const anterior = juntados[juntados.length - 1]
    const mismaSeccion = anterior && anterior.titular === trozo.titular

    if (soloCodigo && !trozo.titular && mismaSeccion) {
      anterior.texto += `\n\n${trozo.texto}`
      continue
    }
    juntados.push(trozo)
  }
  return juntados
}

/** Parte la prosa en párrafos, respetando los bloques de código. */
function porParrafos(texto) {
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function trozosDeApunte(apunte) {
  const porTitulares = trocearApunte(apunte)
  // Si no había titulares, `trocearApunte` devuelve un bloque enorme: se
  // reparte por párrafos, que en la prosa es la unidad que toca.
  if (porTitulares.length > 1 || porTitulares.some((t) => t.titular)) return porTitulares

  const entero = porTitulares[0]?.texto ?? ''
  return pegarCodigoHuerfano(porParrafos(entero).map((texto) => ({ titular: null, texto })))
}

async function construir() {
  const apuntes = await cargarTodosLosApuntes()
  const trozos = []

  for (const entrada of GLOSARIO) {
    trozos.push({
      tipo: 'termino',
      id: `termino:${entrada.id}`,
      titulo: entrada.termino,
      texto: [entrada.definicion, entrada.ejemplo].filter(Boolean).join('\n'),
      alias: [entrada.termino, ...(entrada.alias ?? [])],
      terminoId: entrada.id,
    })
  }

  for (const imprevisto of IMPREVISTOS) {
    trozos.push({
      tipo: 'imprevisto',
      id: `imprevisto:${imprevisto.id}`,
      titulo: imprevisto.titulo,
      // `significa` es una función que necesita las capturas del patrón: aquí
      // solo se indexa el titular y las causas, que es texto fijo.
      texto: [imprevisto.titulo, ...(imprevisto.causas ?? [])].join('\n'),
      imprevistoId: imprevisto.id,
    })
  }

  for (const reto of RETOS) {
    // ---- Lista blanca. Todo lo que se lee del reto sale de estas dos líneas
    // ---- y del apunte, que ahora vive aparte y se ha traído arriba.
    const { id, mundo, titulo, enunciado } = reto
    const apunte = apuntes[id]
    // -------------------------------------------------------------------------

    trozos.push({
      tipo: 'enunciado',
      id: `enunciado:${id}`,
      titulo,
      texto: `${titulo}\n${enunciado ?? ''}`,
      retoId: id,
      mundoId: mundo,
    })

    trozosDeApunte(apunte).forEach((trozo, indice) => {
      trozos.push({
        tipo: 'apunte',
        id: `apunte:${id}:${indice}`,
        titulo,
        titular: trozo.titular,
        texto: trozo.texto,
        retoId: id,
        mundoId: mundo,
      })
    })
  }

  return trozos
}

let corpus = null
let construyendo = null

/**
 * El corpus, construido la primera vez que se pide y guardado desde entonces.
 *
 * Antes se armaba al cargar el módulo, lo que obligaba a traer los 56 apuntes
 * en el arranque aunque nadie fuera a preguntarle nada a Armonía. Ahora se
 * construye cuando se abre su panel: se nota una vez, y solo si lo abres.
 *
 * Si dos sitios lo piden a la vez comparten la misma promesa, que si no se
 * construiría dos veces por nada.
 */
export async function obtenerCorpus() {
  if (corpus) return corpus
  if (!construyendo) construyendo = construir().then((hecho) => (corpus = hecho))
  return construyendo
}

/** Para los tests y para quien ya sepa que está construido. */
export const corpusYaConstruido = () => corpus

/**
 * De dónde salía un trozo, en datos y no en texto.
 *
 * Devolver una frase ya montada obligaría a que el panel la pintase como
 * markdown, y una cita no es prosa: es un enlace con un nombre y, si la hay,
 * una sección. En datos, el panel decide cómo se ve y se puede pulsar.
 */
export function citar(trozo) {
  if (trozo.tipo === 'termino') {
    return { fuente: 'glosario', reto: trozo.titulo, seccion: null, retoId: null }
  }
  if (trozo.tipo === 'imprevisto') {
    return { fuente: 'imprevisto', reto: trozo.titulo, seccion: null, retoId: null }
  }
  return {
    fuente: trozo.tipo === 'apunte' ? 'apunte' : 'reto',
    reto: trozo.titulo,
    seccion: trozo.titular ?? null,
    retoId: trozo.retoId ?? null,
    mundo: MUNDOS_POR_ID[trozo.mundoId]?.nombre ?? null,
  }
}
