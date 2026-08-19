import { describe, expect, it } from 'vitest'

import {
  PUERTA,
  RINCONES,
  ZONAS,
  avanzar,
  elegirDestino,
  escalaEn,
  nuevoPaseante,
  rutaHasta,
  zonaDe,
} from '../src/motor/paseo.js'

/** Un azar que no lo es: devuelve siempre lo mismo, para poder afirmar cosas. */
const fijo = (valor) => () => valor

const dentroDe = (zona, punto) =>
  punto.x >= ZONAS[zona].x - 1 &&
  punto.x <= ZONAS[zona].x + ZONAS[zona].ancho + 1 &&
  punto.y >= ZONAS[zona].y - 1 &&
  punto.y <= ZONAS[zona].y + ZONAS[zona].alto + 1

describe('los rincones', () => {
  it('están todos dentro de la estancia que dicen', () => {
    const fuera = RINCONES.filter((rincon) => !dentroDe(rincon.zona, rincon))
    expect(fuera.map((r) => r.id)).toEqual([])
  })

  it('cada uno cae en la zona que le corresponde por su sitio', () => {
    // Si un rincón se mueve de sitio y se olvida cambiarle la zona, el gato
    // cruzaría media escena para llegar a un sitio que ya tenía al lado.
    const descolocados = RINCONES.filter((rincon) => zonaDe(rincon) !== rincon.zona)
    expect(descolocados.map((r) => r.id)).toEqual([])
  })

  it('hay dónde dormir en casa, que es donde se va el que está triste', () => {
    expect(RINCONES.some((r) => r.zona === 'casa' && r.pose === 'durmiendo')).toBe(true)
  })
})

describe('el paseo', () => {
  it('empieza cada gato en un rincón distinto', () => {
    const sitios = [0, 1, 2, 3].map((i) => nuevoPaseante(`gato-${i}`, i, fijo(0.5)).rincon)
    expect(new Set(sitios).size).toBe(4)
  })

  it('esperando no se mueve', () => {
    const paseante = nuevoPaseante('acero', 0, fijo(0.9))
    const { x, y } = paseante
    avanzar(paseante, 0.5, fijo(0.5))
    expect(paseante.x).toBe(x)
    expect(paseante.y).toBe(y)
  })

  it('al terminar la espera se pone a andar hacia algún sitio', () => {
    const paseante = nuevoPaseante('acero', 0, fijo(0))
    avanzar(paseante, 1, fijo(0.5))
    expect(paseante.pose).toBe('andando')
    expect(paseante.ruta.length).toBeGreaterThan(0)
  })

  it('mira hacia donde va', () => {
    const paseante = { ...nuevoPaseante('acero', 0, fijo(0)), ruta: [{ x: 900, y: 400 }], mirando: -1 }
    avanzar(paseante, 0.2, fijo(0.5))
    expect(paseante.mirando).toBe(1)

    paseante.ruta = [{ x: 100, y: 400 }]
    avanzar(paseante, 0.2, fijo(0.5))
    expect(paseante.mirando).toBe(-1)
  })

  it('al llegar se queda haciendo lo que se hace en ese sitio', () => {
    const sofa = RINCONES.find((r) => r.id === 'sofa')
    const paseante = { ...nuevoPaseante('acero', 0, fijo(0)), ruta: [sofa], pose: 'andando' }
    avanzar(paseante, 10, fijo(0.5))
    expect(paseante.pose).toBe('durmiendo')
    expect(paseante.espera).toBeGreaterThan(0)
    expect(paseante.ruta).toEqual([])
  })

  it('para cambiar de estancia pasa por la puerta', () => {
    const enCasa = nuevoPaseante('acero', 0, fijo(0))
    const alJardin = RINCONES.find((r) => r.zona === 'jardin')
    expect(rutaHasta({ ...enCasa, x: 200, y: 400 }, alJardin)[0]).toBe(PUERTA)
    // Y dentro de la misma estancia va derecho, sin rodeos.
    const enCasaTambien = RINCONES.find((r) => r.zona === 'casa' && r.id !== 'sofa')
    expect(rutaHasta({ x: 200, y: 400 }, enCasaTambien)).toEqual([enCasaTambien])
  })

  it('el que está triste no se va al jardín: se queda durmiendo en casa', () => {
    for (const tirada of [0, 0.33, 0.66, 0.99]) {
      const destino = elegirDestino({ x: 700, y: 400 }, fijo(tirada), { triste: true })
      expect(destino.zona).toBe('casa')
      expect(destino.pose).toBe('durmiendo')
    }
  })

  it('nadie se sale de la casa ni del jardín por mucho que pasee', () => {
    // La prueba de verdad: media hora de paseo con azar de verdad y ni un gato
    // andando por el tejado.
    const paseantes = [0, 1, 2, 3, 4].map((i) => nuevoPaseante(`gato-${i}`, i))
    for (let paso = 0; paso < 18_000; paso += 1) {
      for (const paseante of paseantes) {
        avanzar(paseante, 0.1)
        const suelo = dentroDe('casa', paseante) || dentroDe('jardin', paseante)
        const enLaPuerta =
          paseante.x >= ZONAS.casa.x + ZONAS.casa.ancho - 1 && paseante.x <= ZONAS.jardin.x + 1
        expect(suelo || enLaPuerta, `${paseante.gatoId} en ${paseante.x}, ${paseante.y}`).toBe(true)
      }
    }
  })
})

describe('la perspectiva', () => {
  it('el de delante se ve más grande que el del fondo', () => {
    expect(escalaEn(480)).toBeGreaterThan(escalaEn(360))
  })

  it('no se dispara ni se encoge fuera del suelo pisable', () => {
    for (const y of [0, 200, 360, 500, 900]) {
      expect(escalaEn(y)).toBeGreaterThanOrEqual(0.5)
      expect(escalaEn(y)).toBeLessThanOrEqual(0.74)
    }
  })
})
