/**
 * Karata, que vende las pistas en Elantris.
 *
 * Llevaba la banda más peligrosa de la ciudad y ahora cuida de una niña, y las
 * dos cosas explican cómo da una pista: mide primero si la necesitas y luego te
 * la da entera, sin regatear y sin humillarte.
 *
 * Este saco faltaba: el reparto de Elantris la nombraba desde el primer día y
 * nadie había escrito una línea suya, así que el aviso de la pista salía en
 * silencio -no fallaba nada, simplemente no hablaba nadie, que es el fallo más
 * difícil de ver-. Ahora hay una prueba que lo caza.
 */
const LINEAS_DE_KARATA = {
  pistaPedida: {
    1: [
      'La primera va gratis. Aquí dentro nadie tiene nada, así que lo que se puede regalar se regala.',
      'Toma, sin cobrar. Guarda las croquetas para cuando de verdad no sepas por dónde tirar.',
      'Esta la pago yo. Y no me lo agradezcas: agradécemelo resolviéndolo.',
    ],
    2: [
      'Esta cuesta. No por mí: es que lo que no cuesta no se mira dos veces, y esta hay que mirarla dos veces.',
      'Croquetas. Antes robaba lo que hacía falta; ahora lo pido, que sale más barato para todos.',
      'Se paga. Sigue siendo mejor negocio que pasarte la tarde mirando la misma consulta.',
    ],
    3: [
      'Esta es casi la respuesta. Cara, y te la doy porque has llegado hasta aquí y no porque te haga falta.',
      'La última. Después de esta ya no queda nada por descubrir, así que asegúrate de que la quieres.',
      'Muy cara. Levántate, da una vuelta y vuelve: si entonces todavía la quieres, es tuya.',
    ],
  },

  trastoRecibido: [
    (contexto) => `A cambio te queda esto: ${contexto.trasto}. Lo encontramos en los escombros.`,
    (contexto) => `${contexto.trasto}. Aquí dentro todo ha sido de alguien antes. Ahora es tuyo.`,
  ],
}

export default LINEAS_DE_KARATA
