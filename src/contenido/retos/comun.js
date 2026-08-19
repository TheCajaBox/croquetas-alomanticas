/**
 * Los fragmentos de código de los retos se escriben como listas de líneas y no
 * como plantillas de texto. Es a propósito: la mitad de los retos contienen
 * plantillas de Vue, que van entre comillas invertidas, y anidar comillas
 * invertidas dentro de comillas invertidas es una fuente inagotable de erratas.
 */
export const codigo = (...lineas) => lineas.join('\n')

/**
 * Lo que cuesta cada pista, como fracción de lo que paga el reto.
 *
 * Antes era una tabla fija -0, 3 y 8 croquetas- y la curva salía al revés de lo
 * que hacía falta: la tercera pista costaba el 133% de tu bolsa en el primer
 * mundo y el 9% en el último, porque los precios no se movían y tú ibas
 * acumulando. Cuanto más difícil el reto, más barata la ayuda. Y comprarlas
 * todas costaba 616 croquetas cuando el juego reparte 614: salía a cuenta.
 *
 * Con el precio atado a la recompensa la curva se sostiene sola y no habrá que
 * recalibrarla al añadir mundos. La tercera cuesta **el doble de lo que el reto
 * paga**: comprarla siempre te deja en números rojos respecto a lo que ganas,
 * que es exactamente lo que tiene que sentirse.
 */
export const PROPORCION_DE_PISTA = [0, 0.6, 2]

/**
 * El nivel se guarda en la pista; el precio se calcula al leerla, porque
 * depende del reto y aquí todavía no se sabe cuál es.
 */
export const pista = (texto, nivel) => ({ nivel, texto })

/** Lo que cuesta esa pista de ese reto, en croquetas. */
export function precioDePista(reto, nivel) {
  const proporcion = PROPORCION_DE_PISTA[nivel] ?? 0
  if (proporcion === 0) return 0
  return Math.max(1, Math.round((reto?.recompensa?.croquetas ?? 0) * proporcion))
}
