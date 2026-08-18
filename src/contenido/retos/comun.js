/**
 * Los fragmentos de código de los retos se escriben como listas de líneas y no
 * como plantillas de texto. Es a propósito: la mitad de los retos contienen
 * plantillas de Vue, que van entre comillas invertidas, y anidar comillas
 * invertidas dentro de comillas invertidas es una fuente inagotable de erratas.
 */
export const codigo = (...lineas) => lineas.join('\n')

/**
 * Precios de las tres pistas. La primera siempre sale de la casa.
 *
 * Están calibrados contra las recompensas de los retos, que son deliberadamente
 * pequeñas: la idea es que pedir las tres pistas de un reto cueste más o menos
 * lo que ese reto da, para que elegir entre ayuda y croquetas signifique algo.
 */
export const PRECIOS_DE_PISTA = [0, 3, 8]

export const pista = (texto, nivel) => ({ coste: PRECIOS_DE_PISTA[nivel] ?? 0, texto })
