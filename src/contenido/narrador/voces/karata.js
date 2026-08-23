/**
 * Karata, que vende las pistas en Elantris.
 *
 * Llevaba la banda más peligrosa de la ciudad y ahora cuida de una niña, y las
 * dos cosas explican cómo da una pista: mide primero si la necesitas y luego te
 * la da entera, sin regatear y sin humillarte.
 *
 * Su humor es **el del trapicheo de quien ya no necesita trapichear**: cobra
 * con toda formalidad por algo que aquí dentro no vale nada, y lo sabe. La
 * gracia está en la seriedad del trámite y en que cada venta lleva dentro un
 * consejo para no tener que comprar la siguiente. Nunca se ríe del que pregunta:
 * preguntar, para ella, es de los que van a salir de aquí.
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
      'Gratis, y con el consejo de encima: antes de pedirme la segunda, mira qué columnas tienes delante. Media ciudad se ha quedado atascada por preguntar a una tabla que no era.',
    ],
    2: [
      'Esta cuesta. No por mí: es que lo que no cuesta no se mira dos veces, y esta hay que mirarla dos veces.',
      'Croquetas. Antes robaba lo que hacía falta; ahora lo pido, que sale más barato para todos.',
      'Se paga. Sigue siendo mejor negocio que pasarte la tarde mirando la misma consulta.',
      'Esta tiene precio, y es justo. Llévala y pruébala entera antes de volver: media pista aplicada a medias no enseña nada y me haces perder el género.',
    ],
    3: [
      'Esta es casi la respuesta. Cara, y te la doy porque has llegado hasta aquí y no porque te haga falta.',
      'La última. Después de esta ya no queda nada por descubrir, así que asegúrate de que la quieres.',
      'Muy cara. Levántate, da una vuelta y vuelve: si entonces todavía la quieres, es tuya.',
      'La más cara de las tres, y la que menos recomiendo. Cuenta primero lo que ya sabes seguro del reto: si son tres cosas de cuatro, esta pista te sale carísima.',
    ],
  },

  trastoRecibido: [
    (contexto) => `A cambio te queda esto: ${contexto.trasto}. Lo encontramos en los escombros.`,
    (contexto) => `${contexto.trasto}. Aquí dentro todo ha sido de alguien antes. Ahora es tuyo.`,
    (contexto) => `Llévate ${contexto.trasto}. No sirve para nada y aun así alguien lo guardó diez años, fíjate.`,
    (contexto) => `${contexto.trasto}, del montón de la entrada. Lo cojo yo, lo coges tú: aquí eso es todo el comercio que hay.`,
  ],
}

export default LINEAS_DE_KARATA
