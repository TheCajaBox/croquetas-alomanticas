import { describe, expect, it } from 'vitest'

import { PROPORCION_DE_PISTA, precioDePista } from '../src/contenido/retos/comun.js'
import { MUNDOS } from '../src/contenido/mundos.js'
import { RETOS, retosDelMundo } from '../src/contenido/retos/index.js'

const aplanar = (texto) => (texto ?? '').replace(/\s+/g, ' ').trim()

const conPistas = RETOS.filter((reto) => reto.pistas?.length)

/**
 * Líneas de la solución que, sueltas en una pista, serían la respuesta.
 *
 * Se descartan las cortas, las que son solo puntuación y las que ya están en el
 * código de partida: esas el jugador las tiene delante desde el principio.
 */
function lineasQueSonLaRespuesta(reto) {
  const inicial = aplanar(reto.inicial ?? '')
  return (reto.solucion ?? '')
    .split('\n')
    .map(aplanar)
    // Con menos de 14 caracteres, una línea suele ser un cierre de llaves o un
    // `return total`, que no delata nada por sí solo.
    .filter((linea) => linea.length >= 14)
    .filter((linea) => /[a-zA-Z_$][\w$]{2,}/.test(linea))
    .filter((linea) => !inicial.includes(linea))
}

describe('los jefes no se venden', () => {
  it('ningún jefe tiene pistas', () => {
    const conPistasYJefes = RETOS.filter((reto) => reto.jefe && reto.pistas?.length)
    expect(conPistasYJefes.map((r) => r.id)).toEqual([])
  })

  it('hay uno por mundo, ni más ni menos', () => {
    // Contado sobre MUNDOS y no con un número escrito: cada mundo nuevo traía
    // una prueba en rojo que no decía nada del mundo nuevo.
    for (const mundo of MUNDOS) {
      const jefes = retosDelMundo(mundo.id).filter((reto) => reto.jefe)
      expect(jefes.map((r) => r.id), `${mundo.id} no tiene exactamente un jefe`).toHaveLength(1)
    }
    expect(RETOS.filter((r) => r.jefe)).toHaveLength(MUNDOS.length)
  })

  it('el jefe es el último reto de su mundo', () => {
    for (const mundo of MUNDOS) {
      const retos = retosDelMundo(mundo.id)
      expect(retos.at(-1).jefe, `el último de ${mundo.id} no es el jefe`).toBe(true)
    }
  })
})

describe('lo que cuesta que te ayuden', () => {
  it('la primera pista siempre es gratis', () => {
    for (const reto of conPistas) expect(precioDePista(reto, 0)).toBe(0)
  })

  it('la tercera cuesta el doble de lo que paga el reto', () => {
    for (const reto of conPistas) {
      const paga = reto.recompensa.croquetas
      expect(precioDePista(reto, 2), reto.id).toBe(Math.round(paga * PROPORCION_DE_PISTA[2]))
      expect(precioDePista(reto, 2)).toBeGreaterThan(paga)
    }
  })

  it('la segunda cuesta menos que la tercera y menos que la recompensa', () => {
    for (const reto of conPistas) {
      expect(precioDePista(reto, 1), reto.id).toBeLessThan(precioDePista(reto, 2))
      expect(precioDePista(reto, 1), reto.id).toBeLessThan(reto.recompensa.croquetas)
    }
  })

  it('comprar las tres cuesta más de lo que el reto paga, siempre', () => {
    for (const reto of conPistas) {
      const todas = [0, 1, 2].reduce((suma, nivel) => suma + precioDePista(reto, nivel), 0)
      expect(todas, reto.id).toBeGreaterThan(reto.recompensa.croquetas)
    }
  })

  it('comprarlas todas cuesta más de lo que el juego entero reparte', () => {
    const reparte = RETOS.reduce((suma, reto) => suma + (reto.recompensa?.croquetas ?? 0), 0)
    const cuestan = conPistas.reduce(
      (suma, reto) => suma + [0, 1, 2].reduce((s, n) => s + precioDePista(reto, n), 0),
      0,
    )
    // Antes eran 616 contra 614: salía a cuenta comprarlas todas.
    expect(cuestan).toBeGreaterThan(reparte * 1.5)
  })
})

/**
 * Solo se mira la tercera, y a propósito.
 *
 * La segunda cuesta el 60% de la recompensa y su trabajo es enseñar el concepto
 * que falta, así que puede mostrar la forma de una directiva o de una llamada:
 * de ahí a tener el reto resuelto queda trabajo. La tercera cuesta el doble de
 * lo que el reto paga, y a ese precio lo que se compra es el último empujón,
 * no el resultado.
 */
describe('ni la última pista da la solución', () => {
  for (const reto of conPistas) {
    it(reto.id, () => {
      const ultima = aplanar(reto.pistas[2].texto)
      const filtradas = lineasQueSonLaRespuesta(reto).filter((linea) => ultima.includes(linea))
      expect(
        filtradas,
        'la tercera pista trae líneas de la solución tal cual; tiene que llevar al borde, no cruzarlo',
      ).toEqual([])
    })
  }
})
