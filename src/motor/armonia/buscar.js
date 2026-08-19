/**
 * Cómo encuentra Armonía lo que recuerda.
 *
 * TF-IDF corto sobre el corpus. No hace falta más: son 390 trozos de texto
 * escrito a propósito para enseñar, no una web entera, y el vocabulario está
 * acotado. Una biblioteca de búsqueda aquí pesaría más que el juego.
 *
 * Todo el índice se calcula una vez al cargar el módulo.
 */
import { MUNDOS } from '../../contenido/mundos.js'
import { RETOS } from '../../contenido/retos/index.js'
import { TERMINOS_BUSCABLES } from '../../contenido/glosario.js'
import { obtenerCorpus } from '../../contenido/armonia/corpus.js'

/**
 * Palabras que salen en todas las frases y no distinguen nada. Sin quitarlas,
 * «qué es una variable» encuentra sobre todo trozos que dicen mucho «una».
 */
const VACIAS = new Set(`
a al algo algun alguna algunas alguno algunos ante antes aqui asi aun aunque
cada como con contra cual cuales cuando de del desde donde dos e el ella ellas
ello ellos en entre era eran es esa esas ese eso esos esta estan estas este
esto estos ha hace hacer hacia han hasta hay la las le les lo los mas me mi
mientras mucho muy nada ni no nos o os otra otras otro otros para pero poco por
porque pues que quien se ser si sin sobre solo son su sus tal tambien tan tanto
te tiene tienen todo todos tu tus un una uno unos ya yo
`.trim().split(/\s+/))

/** Sin acentos y sin signos: «qué» y «que» son la misma palabra al buscar. */
export function normalizar(texto) {
  return (texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function palabras(texto) {
  return normalizar(texto)
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(' ')
    .filter((palabra) => palabra.length > 1 && !VACIAS.has(palabra))
}

/**
 * Los símbolos por los que se pregunta de verdad, con las palabras que
 * significan.
 *
 * Al trocear en palabras, `===` y `=>` desaparecen: no tienen ni letras ni
 * números. Y son justo por lo que más pregunta quien empieza, porque son lo
 * único del lenguaje que no se puede buscar diciéndolo en voz alta: nadie sabe
 * todavía que `=>` se llama «función flecha».
 *
 * Por eso cada símbolo trae su vocabulario, y preguntar «¿qué es =>?» busca
 * también por «función flecha». Sin esto, una pregunta que sea solo símbolos
 * se queda sin ninguna palabra que buscar y no encuentra nada.
 *
 * Van de más largos a más cortos para que `===` no se detecte como `==`.
 */
const SIMBOLOS = [
  { simbolo: '===', palabras: 'igualdad estricta identicos comparar' },
  { simbolo: '!==', palabras: 'distinto desigualdad estricta comparar' },
  { simbolo: '=>', palabras: 'funcion flecha' },
  { simbolo: '??', palabras: 'coalescencia nulo defecto' },
  { simbolo: '?.', palabras: 'encadenamiento opcional undefined' },
  { simbolo: '...', palabras: 'spread rest desestructurar copia' },
  { simbolo: '&&', palabras: 'operador logico verdadero' },
  { simbolo: '||', palabras: 'operador logico verdadero' },
  { simbolo: '==', palabras: 'igualdad convierte comparar' },
  { simbolo: '!=', palabras: 'distinto convierte comparar' },
  { simbolo: '+=', palabras: 'acumulador sumar' },
]

/** Los símbolos de JavaScript que aparecen en un texto. */
export function simbolosMencionados(texto) {
  const encontrados = []
  let resto = texto ?? ''
  for (const entrada of SIMBOLOS) {
    if (!resto.includes(entrada.simbolo)) continue
    encontrados.push(entrada)
    // Se tapa para que `===` no cuente además como `==`.
    resto = resto.split(entrada.simbolo).join(' ')
  }
  return encontrados
}

function construirIndice(corpus) {
  const documentos = corpus.map((trozo) => {
    const cuenta = new Map()
    // El titular pesa como si estuviera tres veces: es el resumen de la sección.
    const texto = [trozo.texto, trozo.titulo, trozo.titular, trozo.titular, trozo.titular]
      .filter(Boolean)
      .join(' ')
    for (const palabra of palabras(texto)) {
      cuenta.set(palabra, (cuenta.get(palabra) ?? 0) + 1)
    }
    return { trozo, cuenta, largo: [...cuenta.values()].reduce((s, n) => s + n, 0) || 1 }
  })

  const largoMedio =
    documentos.reduce((suma, doc) => suma + doc.largo, 0) / (documentos.length || 1)

  const enCuantos = new Map()
  for (const doc of documentos) {
    for (const palabra of doc.cuenta.keys()) {
      enCuantos.set(palabra, (enCuantos.get(palabra) ?? 0) + 1)
    }
  }

  const idf = new Map()
  for (const [palabra, cuantos] of enCuantos) {
    idf.set(palabra, Math.log(1 + documentos.length / cuantos))
  }

  return { documentos, idf, largoMedio, ordenDeMundo: ordenDeMundos() }
}

/** Qué mundo va antes que cuál, para no mandar a nadie hacia adelante. */
function ordenDeMundos() {
  return Object.fromEntries(MUNDOS.map((mundo, indice) => [mundo.id, indice]))
}

/**
 * BM25, y no la frecuencia partida por la longitud.
 *
 * Con la división cruda, un trozo de tres líneas que menciona «variable» una
 * vez le ganaba al apunte entero que la explica: cuanto más corto el trozo,
 * más pesaba cada palabra. BM25 satura la frecuencia y normaliza la longitud
 * contra la media, que es justo lo que hacía falta.
 */
const K1 = 1.2
// `b` bajo a propósito. Cuanto más alto, más ventaja tienen los trozos cortos,
// y aquí eso es justo lo contrario de lo que se busca: entre un párrafo que
// menciona «variable» de pasada y el apunte que la explica, queremos el apunte.
const B = 0.25

let INDICE = null

/**
 * Trae los apuntes y monta el índice. Se llama una vez, al abrir a Armonía.
 *
 * Se separa de `buscar` a propósito: si buscar fuera asíncrono, lo serían
 * también responder y todo lo que cuelga, y eso son cinco funciones esperando
 * a algo que en realidad ya está listo desde la primera pregunta.
 */
export async function prepararBusqueda() {
  if (INDICE) return
  const { cargarTodosLosApuntes } = await import('../../contenido/apuntes/index.js')
  INDICE = construirIndice(await obtenerCorpus())
  quienEnsena = construirQuienEnsena(await cargarTodosLosApuntes())
}

/** Si alguien busca antes de tiempo, mejor saberlo que devolver nada en silencio. */
function exigirIndice() {
  if (!INDICE) throw new Error('Hay que llamar a prepararBusqueda() antes de buscar.')
  return INDICE
}

/**
 * Los términos del glosario que aparecen literalmente en un texto.
 *
 * `TERMINOS_BUSCABLES` ya viene ordenado de más largo a más corto, así que
 * «función flecha» gana a «función» y no se detecta la corta dentro de la
 * larga. Se comprueban los bordes a mano porque una expresión regular con la
 * lista entera sería más lenta y menos legible.
 */
export function terminosMencionados(texto) {
  const plano = normalizar(texto)
  const encontrados = []
  const tapado = new Array(plano.length).fill(false)

  for (const { texto: termino, id } of TERMINOS_BUSCABLES) {
    const aguja = normalizar(termino)
    // Sin esto, una aguja vacía haría que `indexOf` devolviera siempre la
    // misma posición y el bucle no terminase nunca.
    if (!aguja) continue
    let desde = 0
    for (;;) {
      const donde = plano.indexOf(aguja, desde)
      if (donde === -1) break
      desde = donde + aguja.length

      const antes = plano[donde - 1]
      const despues = plano[donde + aguja.length]
      const esPalabra = (c) => c !== undefined && /[\p{L}\p{N}_]/u.test(c)
      if (esPalabra(antes) || esPalabra(despues)) continue
      if (tapado.slice(donde, donde + aguja.length).some(Boolean)) continue

      for (let i = donde; i < donde + aguja.length; i += 1) tapado[i] = true
      if (!encontrados.some((e) => e.id === id)) encontrados.push({ id, termino })
    }
  }

  return encontrados
}

/**
 * Dónde se enseña cada término, en orden de juego.
 *
 * Buscar por texto no sirve para esto: el apunte que mejor explica qué es una
 * variable puede no usar nunca esa palabra, y en cambio un apunte de Vue 3 la
 * suelta de pasada y gana la búsqueda. Para «dónde se explica esto» la señal
 * buena es otra y es exacta: **el primer reto, por orden de juego, donde el
 * término aparece**. Ahí es donde te lo encontraste por primera vez.
 *
 * `RETOS` ya viene ordenado por mundo y por número, así que el orden del array
 * es el orden en que se juega.
 */
function construirQuienEnsena(apuntes) {
  const porTermino = new Map()
  for (const reto of RETOS) {
    const texto = [reto.titulo, reto.enunciado, apuntes[reto.id]].filter(Boolean).join('\n')
    for (const { id } of terminosMencionados(texto)) {
      if (!porTermino.has(id)) porTermino.set(id, [])
      porTermino.get(id).push(reto)
    }
  }
  return porTermino
}

let quienEnsena = null

/** Los retos donde sale ese término, del primero al último. */
export function retosQueEnsenan(terminoId) {
  return quienEnsena?.get(terminoId) ?? []
}

/**
 * Busca en lo que Armonía recuerda.
 *
 * @param {string} consulta lo que ha escrito el jugador
 * @param {{retoId?: string, cuantos?: number, tipos?: string[]}} opciones
 */
export function buscar(consulta, { retoId = null, cuantos = 4, tipos = null, mundoId = null } = {}) {
  const mundoActual = mundoId != null ? exigirIndice().ordenDeMundo[mundoId] ?? null : null
  const simbolos = simbolosMencionados(consulta)

  // Las palabras de los símbolos se suman a las de la pregunta: así «¿qué es
  // =>?», que no tiene ni una palabra buscable, encuentra la función flecha.
  const consultadas = [
    ...palabras(consulta),
    ...simbolos.flatMap((s) => palabras(s.palabras)),
  ]
  if (consultadas.length === 0) return []

  const mencionados = new Set(terminosMencionados(consulta).map((t) => t.id))

  const puntuados = []
  for (const doc of exigirIndice().documentos) {
    if (tipos && !tipos.includes(doc.trozo.tipo)) continue

    let punto = 0
    for (const palabra of consultadas) {
      const veces = doc.cuenta.get(palabra)
      if (!veces) continue
      const normalizado = 1 - B + B * (doc.largo / exigirIndice().largoMedio)
      punto += (exigirIndice().idf.get(palabra) ?? 0) * ((veces * (K1 + 1)) / (veces + K1 * normalizado))
    }
    // Los símbolos también se buscan sobre el texto crudo, que es donde siguen
    // vivos, pero pesan poco: casi cualquier apunte tiene un `=>` por ahí.
    for (const { simbolo } of simbolos) {
      if (doc.trozo.texto.includes(simbolo)) punto += 0.15
    }

    if (punto === 0 && !mencionados.has(doc.trozo.terminoId)) continue

    // Si preguntas por un término que existe en el glosario, su ficha va
    // primero: es la respuesta corta, y lo demás es contexto.
    if (mencionados.has(doc.trozo.terminoId)) punto += 1

    // Preguntando dentro de un reto, casi siempre se pregunta por ese reto.
    if (retoId && doc.trozo.retoId === retoId) punto *= 2.5

    // Y nunca hacia adelante: a quien pregunta qué es una variable en el primer
    // día no se le manda a un apunte de Vue 3 que da por sabido todo lo de en
    // medio. Que exista la respuesta no la hace útil si llega antes de tiempo.
    if (mundoActual != null && doc.trozo.mundoId != null) {
      const suyo = exigirIndice().ordenDeMundo[doc.trozo.mundoId] ?? 0
      if (suyo > mundoActual) punto *= 0.35
    }

    puntuados.push({ trozo: doc.trozo, punto })
  }

  return puntuados
    .sort((a, b) => b.punto - a.punto)
    .slice(0, cuantos)
    .map(({ trozo, punto }) => ({ ...trozo, punto }))
}
