/**
 * El cargador de voces: quién puede hablar y de dónde sale lo que dice.
 *
 * Antes todas las frases del juego vivían en un solo fichero y ese fichero lo
 * importaba el almacén del narrador, que `main.js` monta al arrancar. Resultado:
 * las quince voces -57 kB de diálogo- viajaban en el paquete inicial para que
 * hablara una. Y crecen con cada camino, porque cada camino trae su reparto.
 *
 * Aquí cada voz es un fichero de `voces/` que se pide con `import()` la primera
 * vez que a esa persona le toca hablar. Lo que queda en el arranque es este
 * módulo: un glob perezoso, una caché y la lista de eventos importantes.
 *
 * **La regla que hay que conservar**: los `import()` de las voces viven **solo
 * aquí**. Si otro módulo importara `voces/wayne.js` de forma estática desde algo
 * que se carga al arrancar, su trozo volvería al paquete inicial sin que nada
 * fallara. Una prueba lo vigila.
 */

/** `{ './voces/wayne.js': () => import(…), … }`, sin ejecutar ninguno. */
const MODULOS = import.meta.glob('./voces/*.js')

/**
 * Las voces ya traídas. Un objeto normal y no estado reactivo a propósito: nadie
 * pinta esto, se lee para sacar una frase y devolver una cadena.
 *
 * Una voz que no existe se apunta como `null`, que también es haber contestado:
 * así no se pide dos veces y quien pregunta sabe que ya no va a venir nada.
 */
const TRAIDAS = new Map()

/** Las peticiones en vuelo, para no pedir la misma voz cinco veces seguidas. */
const EN_VUELO = new Map()

/** Quiénes tienen algo que decir, sin traer nada. */
export const VOCES = Object.keys(MODULOS)
  .map((ruta) => ruta.slice('./voces/'.length, -'.js'.length))
  .sort()

/** `true` si esa voz ya está aquí y se le puede preguntar sin esperar. */
export function vozLista(quien) {
  return TRAIDAS.has(quien)
}

/** El saco de esa voz, o `null` si no está traída todavía o no existe. */
export function sacoDe(quien) {
  return TRAIDAS.get(quien) ?? null
}

/**
 * Trae una voz. Devuelve su saco, o `null` si no hay nadie con ese nombre -que
 * es lo que pasa con un personaje que aún no tiene frases escritas-.
 */
export function cargarVoz(quien) {
  if (TRAIDAS.has(quien)) return Promise.resolve(TRAIDAS.get(quien))
  if (EN_VUELO.has(quien)) return EN_VUELO.get(quien)

  const pedir = MODULOS[`./voces/${quien}.js`]
  if (!pedir) {
    TRAIDAS.set(quien, null)
    return Promise.resolve(null)
  }

  const promesa = pedir()
    .then((modulo) => {
      const saco = modulo.default ?? null
      TRAIDAS.set(quien, saco)
      return saco
    })
    .finally(() => EN_VUELO.delete(quien))

  EN_VUELO.set(quien, promesa)
  return promesa
}

/** Varias de golpe: el reparto de un mundo entero se pide en una tacada. */
export function cargarVoces(...quienes) {
  return Promise.all([...new Set(quienes.filter(Boolean))].map(cargarVoz))
}

/**
 * Todas. No lo usa el juego -sería volver a lo de antes-, lo usan las pruebas,
 * que comprueban a la vez lo que dicen los quince y no van a esperar quince
 * veces por el camino.
 */
export function cargarTodasLasVoces() {
  return cargarVoces(...VOCES)
}

/**
 * Eventos que Wayne suelta incluso con la verborrea al mínimo: son los que
 * llevan información útil, no los que solo llevan a Wayne.
 */
export const EVENTOS_IMPORTANTES = new Set([
  'sombreroEncontrado',
  'mundoCompletado',
  'insigniaGanada',
  'todosLosSombreros',
  'errorDeSintaxis',
  'bucleInfinito',
  'tiempoAgotado',
  'requisitoIncumplido',
  'jefeDerrotado',
  'gatoAdoptado',
  'sinCroquetas',
  'verborreaBaja',
])
