/**
 * Han ShuXen, que vende las pistas en Sel.
 *
 * General. Ha visto caer murallas por menos de lo que tú tienes delante, y esa
 * es exactamente su manera de dar una pista: no te explica el código, te cuenta
 * por dónde entró el enemigo la última vez.
 *
 * No es Fantasma -que cobra porque lo necesita- ni Wayne -que cobra por
 * divertirse-. Cobra porque en su oficio lo que se da gratis no se aprovecha, y
 * lo dice tal cual. Habla corto, en órdenes, y sin adornos.
 */
const LINEAS_DE_HAN_SHUXEN = {
  // Recibe en Los cien días, que es el mundo de los permisos: el suyo, porque
  // las tres murallas que ha visto caer las tiró alguien que estaba dentro.
  presentacion: [
    'General Han ShuXen. Aquí no se entra: aquí se pide, y se lo dan. Voy a enseñarte la diferencia entre el guardia que comprueba quién eres y el guardia que comprueba qué puedes hacer, y por qué en casi todas las plazas solo hay el primero.',
  ],

  pistaPedida: {
    1: [
      'La primera es de balde. Reconocimiento del terreno: eso no se le cobra a nadie.',
      'Gratis. Un informe de situación no es una pista, es lo mínimo para no morir de tonto.',
      'Toma. Y mira el mapa antes de mover a nadie.',
    ],
    2: [
      'Esta cuesta. La información buena siempre ha costado, y siempre ha salido más barata que la derrota.',
      'Se paga. En mi oficio el que no paga por saber, paga por no saber, y paga más.',
      'Croquetas por delante. No es avaricia: es que lo regalado no se estudia.',
    ],
    3: [
      'Esta es casi la posición del enemigo. Cara, y con razón: después de esto ya no hay nada que averiguar.',
      'La última. Te la doy, pero cuando la leas ya no habrás encontrado tú el agujero, y eso también se paga en otra moneda.',
      'Muy cara. Piénsalo diez minutos más antes de comprarla; diez minutos son baratos.',
    ],
  },

  trastoRecibido: [
    (contexto) => `Del botín: ${contexto.trasto}. No cambia una batalla, pero es tuyo.`,
    (contexto) => `${contexto.trasto}. Llevaba años en un almacén. Ahora estorba en el tuyo.`,
  ],
}

export default LINEAS_DE_HAN_SHUXEN
