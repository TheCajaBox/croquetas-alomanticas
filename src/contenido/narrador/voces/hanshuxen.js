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
 *
 * Su humor es **el del trapicheo hecho con papeleo militar**: llama informe a
 * una pista, botín a un trasto y baja a un despiste, y lo dice todo con la misma
 * cara. La gracia está en el vocabulario, no en el chiste, y por debajo siempre
 * hay una instrucción que sirve: mira el mapa, cuenta lo que ya sabes, espera
 * diez minutos antes de gastar.
 */
const LINEAS_DE_HAN_SHUXEN = {
  // Recibe en Los cien días, que es el mundo de los permisos: el suyo, porque
  // las tres murallas que ha visto caer las tiró alguien que estaba dentro.
  presentacion: [
    'General Han ShuXen. Aquí no se entra: aquí se pide, y se lo dan. Voy a enseñarte la diferencia entre el guardia que comprueba quién eres y el guardia que comprueba qué puedes hacer, y por qué en casi todas las plazas solo hay el primero.',
    'Han ShuXen, general. He visto caer tres murallas y ninguna la tiró un ejército: las tres las abrió alguien que ya estaba dentro y tenía permiso para más de lo que necesitaba. Ese es el temario.',
    'General Han ShuXen. No traigo discursos. Traigo un mapa de por dónde entra la gente y la costumbre de contar dos veces a los que tienen llave.',
    'Han ShuXen. Ella te enseñará a falsificar; yo te enseño a repartir permisos, que es lo que hace falta cuando el falsificador ya está dentro y con uniforme.',
  ],

  pistaPedida: {
    1: [
      'La primera es de balde. Reconocimiento del terreno: eso no se le cobra a nadie.',
      'Gratis. Un informe de situación no es una pista, es lo mínimo para no morir de tonto.',
      'Toma. Y mira el mapa antes de mover a nadie.',
      'Sin coste. Empieza por lo que te dice esta y por lo único que hay que mirar siempre: qué entra de fuera y quién lo revisa al entrar.',
    ],
    2: [
      'Esta cuesta. La información buena siempre ha costado, y siempre ha salido más barata que la derrota.',
      'Se paga. En mi oficio el que no paga por saber, paga por no saber, y paga más.',
      'Croquetas por delante. No es avaricia: es que lo regalado no se estudia.',
      'Tiene precio. Y como lo tiene, aprovéchala: léela, aplícala entera y no vuelvas hasta haber probado. Media maniobra no es media victoria, es una baja.',
    ],
    3: [
      'Esta es casi la posición del enemigo. Cara, y con razón: después de esto ya no hay nada que averiguar.',
      'La última. Te la doy, pero cuando la leas ya no habrás encontrado tú el agujero, y eso también se paga en otra moneda.',
      'Muy cara. Piénsalo diez minutos más antes de comprarla; diez minutos son baratos.',
      'La más cara del inventario. Antes de gastarla, haz recuento: escribe lo que ya sabes seguro del reto. Si sabes tres cosas de cuatro, no necesitas esto, necesitas un rato.',
    ],
  },

  trastoRecibido: [
    (contexto) => `Del botín: ${contexto.trasto}. No cambia una batalla, pero es tuyo.`,
    (contexto) => `${contexto.trasto}. Llevaba años en un almacén. Ahora estorba en el tuyo.`,
    (contexto) => `Queda registrado: ${contexto.trasto}, entregado. En mi oficio todo se apunta, incluso lo que no vale nada.`,
    (contexto) => `Toma ${contexto.trasto}. Requisado hace mucho a alguien que ya no lo echa de menos.`,
  ],
}

export default LINEAS_DE_HAN_SHUXEN
