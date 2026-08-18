/**
 * Los fragmentos de código de los retos se escriben como listas de líneas y no
 * como plantillas de texto. Es a propósito: la mitad de los retos contienen
 * plantillas de Vue, que van entre comillas invertidas, y anidar comillas
 * invertidas dentro de comillas invertidas es una fuente inagotable de erratas.
 */
export const codigo = (...lineas) => lineas.join('\n')

/** Precios de las tres pistas. La primera siempre sale de la casa. */
export const PRECIOS_DE_PISTA = [0, 5, 15]

export const pista = (texto, nivel) => ({ coste: PRECIOS_DE_PISTA[nivel] ?? 0, texto })
