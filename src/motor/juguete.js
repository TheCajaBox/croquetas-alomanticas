/**
 * La persecución de la pluma.
 *
 * Jugar no es arrastrar una barra hasta el final: es que el gato te siga. Por
 * eso el progreso no lo marcan los píxeles recorridos sino los **zarpazos**, y
 * un zarpazo solo cuenta si antes le has dejado la pluma lejos. Quien la deja
 * quieta encima del morro no está jugando con nadie.
 *
 * Va aparte del componente por lo mismo que el paseo: así se puede probar sin
 * pintar nada. Las coordenadas son en tanto por uno de la caja -0 a 1-, para
 * que dé igual el tamaño que tenga en pantalla.
 */

/** Lo cerca que tiene que estar la pluma para que la atrape. */
export const RADIO_ZARPAZO = 0.15
/** Y lo lejos que hay que llevársela para que vuelva a tener ganas. */
export const RADIO_ESCAPE = 0.34
/**
 * O lo que hay que pasearla, si en vez de retirarla de golpe se la llevas
 * despacio por delante. Sin esto, arrastrarla poco a poco no valía: el gato se
 * le quedaba pegado, nunca se alejaba de él y no volvía a picar nunca.
 */
export const PASEO_PARA_PICAR = 0.55
/** Cuántos zarpazos son una sesión de juego. */
export const ZARPAZOS = 4

/** Fracción de la caja por segundo. Corre, pero se le puede ganar. */
const VELOCIDAD = 1.15
/** Sin pluma a la vista vuelve al centro, y sin prisa. */
const VELOCIDAD_VUELTA = 0.35
/** No se sale de la caja: el gato es más ancho que un punto. */
const MARGEN = 0.2

const CENTRO = { x: 0.5, y: 0.56 }

const acotar = (valor) => Math.min(1 - MARGEN, Math.max(MARGEN, valor))

export const nuevoJuego = () => ({
  x: CENTRO.x,
  y: CENTRO.y,
  zarpazos: 0,
  /** Si tiene ganas ya, o si todavía está de vuelta del último zarpazo. */
  cargado: true,
  mirando: 1,
  /** Cuánto lleva persiguiendo sin atrapar nada, en segundos. */
  persiguiendo: 0,
  /** Cuánto se ha movido la pluma desde el último zarpazo. */
  paseada: 0,
  ultimaPluma: null,
})

/**
 * Un instante de persecución.
 *
 * @param {object} estado el gato, que se modifica
 * @param {{x: number, y: number}|null} pluma dónde está la pluma, o nada
 * @param {number} segundos desde el fotograma anterior
 * @returns {{zarpazo: boolean, distancia: number}}
 */
export function perseguir(estado, pluma, segundos) {
  const objetivo = pluma ?? CENTRO
  const velocidad = pluma ? VELOCIDAD : VELOCIDAD_VUELTA

  const dx = objetivo.x - estado.x
  const dy = objetivo.y - estado.y
  const distancia = Math.hypot(dx, dy)

  if (pluma && estado.ultimaPluma) {
    estado.paseada += Math.hypot(pluma.x - estado.ultimaPluma.x, pluma.y - estado.ultimaPluma.y)
  }
  estado.ultimaPluma = pluma ? { x: pluma.x, y: pluma.y } : null

  if (Math.abs(dx) > 0.01) estado.mirando = dx > 0 ? 1 : -1
  estado.persiguiendo = pluma ? estado.persiguiendo + segundos : 0

  const tramo = Math.min(distancia, velocidad * segundos)
  if (distancia > 0.001) {
    estado.x = acotar(estado.x + (dx / distancia) * tramo)
    estado.y = acotar(estado.y + (dy / distancia) * tramo)
  }

  // Lejos otra vez, o paseada un buen rato: vuelve a tener ganas.
  if (distancia > RADIO_ESCAPE || estado.paseada > PASEO_PARA_PICAR) estado.cargado = true

  if (pluma && estado.cargado && distancia <= RADIO_ZARPAZO && estado.zarpazos < ZARPAZOS) {
    estado.cargado = false
    estado.zarpazos += 1
    estado.persiguiendo = 0
    estado.paseada = 0
    return { zarpazo: true, distancia }
  }

  return { zarpazo: false, distancia }
}

/**
 * Qué decirle a quien está jugando.
 *
 * Es lo único que avisa de la regla del juego -hay que moverla, y hay que
 * alejarla- sin ponerla por escrito en ningún sitio.
 */
export function comoVa(estado, hayPluma) {
  if (estado.zarpazos >= ZARPAZOS) return 'listo'
  if (!hayPluma) return 'esperando'
  if (!estado.cargado) return 'aleja'
  if (estado.persiguiendo > 3) return 'muevela'
  return 'persiguiendo'
}
