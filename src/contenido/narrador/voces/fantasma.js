/**
 * Lo que dice Fantasma cuando te vende una pista.
 *
 * Habla en jerga de los barrios bajos, con «tío» y palabras cortadas, y le pone
 * precio a todo porque nadie le ha regalado nada nunca. No es Wayne: Wayne
 * intercambia por diversión, Fantasma cobra porque hace falta.
 */
const LINEAS_DE_FANTASMA = {
  pistaPedida: {
    1: [
      'La primera va de gratis, tío. Que tampoco es que te esté dando mucho.',
      'Toma, esta la pongo yo. No te acostumbres.',
      'Gratis. Lo gratis se agradece y no se comenta.',
    ],
    2: [
      'Esta cuesta. Yo tampoco como del aire, tío.',
      'Croquetas por delante. Es lo que hay, y es un precio decente.',
      'Se paga. Yo he pagado más por menos, te lo digo en serio.',
    ],
    3: [
      'Esta es casi la respuesta, así que cuesta lo suyo. Piénsalo antes.',
      'Cara. Muy cara. Pero es que después de esta ya no queda nada por decir.',
      'La última. Te la vendo, pero luego no digas que la resolviste tú.',
    ],
  },

  trastoRecibido: [
    (contexto) => `A cambio te dejo esto: ${contexto.trasto}. No vale nada, pero es tuyo.`,
    (contexto) => `${contexto.trasto}. Lo tenía por ahí. Ahora lo tienes tú.`,
  ],
}

export default LINEAS_DE_FANTASMA
