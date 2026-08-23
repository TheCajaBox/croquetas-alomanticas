/**
 * Lo que dice Fantasma cuando te vende una pista.
 *
 * Habla en jerga de los barrios bajos, con «tío» y palabras cortadas, y le pone
 * precio a todo porque nadie le ha regalado nada nunca. No es Wayne: Wayne
 * intercambia por diversión, Fantasma cobra porque hace falta.
 *
 * Su humor es **el del trapicheo**: el del que vende algo que no es suyo con
 * absoluta seriedad comercial, avisa del precio dos veces y te suelta a mitad
 * de la venta un consejo que vale más que la pista. Se ríe del negocio, no de
 * su cliente. Y en la mitad de las frases hay trabajo de verdad: qué mirar
 * antes de pagar, y por qué a veces no hace falta pagar nada.
 */
const LINEAS_DE_FANTASMA = {
  pistaPedida: {
    1: [
      'La primera va de gratis, tío. Que tampoco es que te esté dando mucho.',
      'Toma, esta la pongo yo. No te acostumbres.',
      'Gratis. Lo gratis se agradece y no se comenta.',
      'Esta te la regalo. Y un consejo que también va incluido: léela dos veces antes de pedirme la siguiente, que en la primera suele estar ya casi todo.',
    ],
    2: [
      'Esta cuesta. Yo tampoco como del aire, tío.',
      'Croquetas por delante. Es lo que hay, y es un precio decente.',
      'Se paga. Yo he pagado más por menos, te lo digo en serio.',
      'Esta va con precio, y barato. Si te sirve, te ha salido regalada; si no te sirve, es que lo que había que releer era el enunciado.',
    ],
    3: [
      'Esta es casi la respuesta, así que cuesta lo suyo. Piénsalo antes.',
      'Cara. Muy cara. Pero es que después de esta ya no queda nada por decir.',
      'La última. Te la vendo, pero luego no digas que la resolviste tú.',
      'Esta es la gorda. Yo, antes de soltar las croquetas, me daría una vuelta por el apunte: ese no lo cobra nadie y a veces sobra con eso.',
    ],
  },

  trastoRecibido: [
    (contexto) => `A cambio te dejo esto: ${contexto.trasto}. No vale nada, pero es tuyo.`,
    (contexto) => `${contexto.trasto}. Lo tenía por ahí. Ahora lo tienes tú.`,
    (contexto) => `${contexto.trasto}, para ti. En mi barrio nadie te da algo por nada, así que ya sabes lo raro que es esto.`,
    (contexto) => `Toma, ${contexto.trasto}. Y no preguntes de dónde sale. Nunca preguntes de dónde sale nada, tío.`,
  ],
}

export default LINEAS_DE_FANTASMA
