/**
 * El paseo de los gatos por la casa y el jardín.
 *
 * Toda la lógica del deambular vive aquí y no en el componente por dos razones:
 * se puede probar sin pintar nada, y el componente se queda siendo lo que debe
 * ser -pintar-. El azar entra siempre por parámetro (`aleatorio`), así que en
 * las pruebas el paseo es exactamente igual de aleatorio que se quiera.
 *
 * Las coordenadas son las del lienzo de `CasaYJardin.vue` (1000 × 560). No hay
 * física ni colisiones: un gato va en línea recta a un rincón, se queda un rato
 * haciendo algo y elige otro. Con eso ya parece que viven ahí.
 */

/** Suelo pisable de cada estancia. Fuera de aquí no se pone ningún gato. */
export const ZONAS = {
  casa: { x: 95, y: 352, ancho: 400, alto: 150 },
  jardin: { x: 640, y: 358, ancho: 310, alto: 142 },
}

/** El paso entre las dos: se cruza por la puerta, no por la pared. */
export const PUERTA = { x: 555, y: 448 }

/**
 * Sitios con nombre. Un gato que se para en el sofá duerme, y el que se para
 * al pie del árbol juega: la postura sale del sitio, que es lo que hace que la
 * escena se lea sin explicar nada.
 */
export const RINCONES = [
  { id: 'sofa', zona: 'casa', x: 168, y: 378, pose: 'durmiendo', peso: 3 },
  { id: 'alfombra', zona: 'casa', x: 305, y: 452, pose: 'sentado', peso: 2 },
  { id: 'ventana', zona: 'casa', x: 452, y: 372, pose: 'sentado', peso: 2 },
  { id: 'cuenco', zona: 'casa', x: 232, y: 458, pose: 'comiendo', peso: 2 },
  { id: 'estanteria', zona: 'casa', x: 390, y: 358, pose: 'sentado', peso: 1 },
  { id: 'hierba', zona: 'jardin', x: 700, y: 470, pose: 'sentado', peso: 2 },
  { id: 'arbol', zona: 'jardin', x: 890, y: 402, pose: 'jugando', peso: 2 },
  { id: 'macetas', zona: 'jardin', x: 645, y: 400, pose: 'jugando', peso: 1 },
  { id: 'charca', zona: 'jardin', x: 800, y: 480, pose: 'sentado', peso: 2 },
]

/** Píxeles del lienzo por segundo. Un gato no tiene ninguna prisa. */
const VELOCIDAD = 46
/** Cuánto se queda quieto en un rincón, en segundos. */
const DESCANSO = { min: 4, max: 11 }
/** El que está triste duerme, y cuando se mueve lo hace arrastrando la cola. */
const DESCANSO_TRISTE = { min: 14, max: 26 }

const entre = (aleatorio, min, max) => min + aleatorio() * (max - min)

/** La escala del gato según lo lejos que esté: cuanto más al fondo, más chico. */
export function escalaEn(y) {
  const cerca = 505
  const lejos = 340
  const t = Math.min(1, Math.max(0, (y - lejos) / (cerca - lejos)))
  return 0.5 + t * 0.24
}

export const zonaDe = (punto) =>
  punto.x <= (ZONAS.casa.x + ZONAS.casa.ancho + PUERTA.x) / 2 ? 'casa' : 'jardin'

function puntoSuelto(zona, aleatorio) {
  const area = ZONAS[zona]
  return {
    x: area.x + aleatorio() * area.ancho,
    y: area.y + aleatorio() * area.alto,
    pose: 'quieto',
  }
}

/**
 * Elige el próximo sitio. Casi siempre un rincón con nombre -que es donde pasan
 * cosas- y de vez en cuando un punto cualquiera, para que no parezca que se
 * mueven por raíles.
 *
 * Un gato triste no cruza el jardín: se queda en casa y busca dónde dormir.
 */
export function elegirDestino(paseante, aleatorio, { triste = false } = {}) {
  if (triste) {
    const camas = RINCONES.filter((r) => r.zona === 'casa' && r.pose === 'durmiendo')
    return camas[Math.floor(aleatorio() * camas.length)]
  }

  if (aleatorio() < 0.2) return puntoSuelto(zonaDe(paseante), aleatorio)

  // Sorteo con pesos: el sofá sale más que la estantería, como en cualquier casa.
  const posibles = RINCONES.filter((r) => r.id !== paseante.rincon)
  const total = posibles.reduce((suma, r) => suma + r.peso, 0)
  let tirada = aleatorio() * total
  for (const rincon of posibles) {
    tirada -= rincon.peso
    if (tirada <= 0) return rincon
  }
  return posibles[posibles.length - 1]
}

/** La ruta hasta un destino. Cambiar de estancia obliga a pasar por la puerta. */
export function rutaHasta(paseante, destino) {
  const cruza = zonaDe(paseante) !== zonaDe(destino)
  return cruza ? [PUERTA, destino] : [destino]
}

/**
 * Un gato recién puesto en la escena. Se reparten por los rincones en vez de
 * amontonarse en la puerta: al abrir la colonia ya están viviendo, no llegando.
 */
export function nuevoPaseante(gatoId, indice, aleatorio = Math.random) {
  const rincon = RINCONES[indice % RINCONES.length]
  const desvio = (indice % 3) * 16 - 16
  return {
    gatoId,
    x: rincon.x + desvio,
    y: rincon.y,
    rincon: rincon.id,
    pose: rincon.pose,
    mirando: indice % 2 === 0 ? 1 : -1,
    ruta: [],
    // Menos de lo que dura un descanso normal: al abrir la colonia la escena
    // tiene que estar viva enseguida, no arrancar diez segundos después.
    espera: entre(aleatorio, 0, 4),
  }
}

/**
 * Un instante de paseo. Devuelve el mismo objeto modificado: se llama sesenta
 * veces por segundo por gato y crear diez objetos nuevos en cada fotograma no
 * lo hace más legible, solo más lento.
 *
 * @param {number} segundos transcurridos desde el fotograma anterior
 */
export function avanzar(paseante, segundos, aleatorio = Math.random, { triste = false } = {}) {
  if (paseante.ruta.length === 0) {
    paseante.espera -= segundos
    if (paseante.espera > 0) return paseante

    const destino = elegirDestino(paseante, aleatorio, { triste })
    paseante.ruta = rutaHasta(paseante, destino)
    paseante.rincon = destino.id ?? null
    paseante.pose = 'andando'
    return paseante
  }

  const siguiente = paseante.ruta[0]
  const dx = siguiente.x - paseante.x
  const dy = siguiente.y - paseante.y
  const distancia = Math.hypot(dx, dy)
  const tramo = VELOCIDAD * segundos

  if (Math.abs(dx) > 1) paseante.mirando = dx > 0 ? 1 : -1

  if (distancia <= tramo) {
    paseante.x = siguiente.x
    paseante.y = siguiente.y
    paseante.ruta.shift()
    if (paseante.ruta.length === 0) {
      paseante.pose = siguiente.pose ?? 'quieto'
      const cuanto = triste ? DESCANSO_TRISTE : DESCANSO
      paseante.espera = entre(aleatorio, cuanto.min, cuanto.max)
    }
    return paseante
  }

  paseante.x += (dx / distancia) * tramo
  paseante.y += (dy / distancia) * tramo
  return paseante
}
