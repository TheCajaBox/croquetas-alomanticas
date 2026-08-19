import { describe, expect, it } from 'vitest'

import {
  PASEO_PARA_PICAR,
  RADIO_ESCAPE,
  RADIO_ZARPAZO,
  ZARPAZOS,
  comoVa,
  nuevoJuego,
  perseguir,
} from '../src/motor/juguete.js'

/** Deja correr el tiempo con la pluma en un sitio. @returns zarpazos dados */
function jugarHacia(juego, pluma, segundos = 2) {
  let dados = 0
  for (let paso = 0; paso < segundos * 60; paso += 1) {
    if (perseguir(juego, pluma, 1 / 60).zarpazo) dados += 1
  }
  return dados
}

describe('perseguir la pluma', () => {
  it('el gato va hacia donde está la pluma', () => {
    const juego = nuevoJuego()
    const antes = Math.hypot(0.8 - juego.x, 0.8 - juego.y)
    perseguir(juego, { x: 0.8, y: 0.8 }, 0.2)
    expect(Math.hypot(0.8 - juego.x, 0.8 - juego.y)).toBeLessThan(antes)
  })

  it('mira hacia la pluma', () => {
    const juego = nuevoJuego()
    perseguir(juego, { x: 0.9, y: 0.5 }, 0.1)
    expect(juego.mirando).toBe(1)
    perseguir(juego, { x: 0.1, y: 0.5 }, 0.1)
    expect(juego.mirando).toBe(-1)
  })

  it('dejarla quieta encima solo cuenta una vez', () => {
    // Lo que impide ganar la partida plantando el dedo en el gato: hay que
    // alejársela para que vuelva a tener ganas.
    const juego = nuevoJuego()
    expect(jugarHacia(juego, { x: 0.5, y: 0.56 }, 5)).toBe(1)
    expect(juego.zarpazos).toBe(1)
  })

  it('alejarla y volver cuenta otra vez', () => {
    const juego = nuevoJuego()
    jugarHacia(juego, { x: 0.5, y: 0.56 })
    expect(juego.zarpazos).toBe(1)

    // Lejos: recarga. Y de vuelta: otro zarpazo.
    jugarHacia(juego, { x: 0.2, y: 0.2 })
    expect(juego.zarpazos).toBe(2)
  })

  it('pasearla despacio por delante también vale, aunque no se aleje', () => {
    // El gato la sigue pegado y la distancia no llega a abrirse nunca: si solo
    // valiera alejarla, arrastrarla poco a poco -que es como se juega de
    // verdad- no daba un solo zarpazo más después del primero.
    const juego = nuevoJuego()
    let zarpazos = 0
    for (let paso = 0; paso < 900; paso += 1) {
      const x = 0.25 + 0.55 * Math.abs(((paso / 260) % 2) - 1)
      if (perseguir(juego, { x, y: 0.5 }, 1 / 60).zarpazo) zarpazos += 1
    }
    expect(zarpazos).toBeGreaterThan(1)
  })

  it('una vuelta por las cuatro esquinas es una sesión entera', () => {
    const juego = nuevoJuego()
    for (const esquina of [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.8 }, { x: 0.2, y: 0.8 }, { x: 0.8, y: 0.2 }]) {
      jugarHacia(juego, esquina)
    }
    expect(juego.zarpazos).toBe(ZARPAZOS)
  })

  it('no pasa de la cuenta por mucho que sigas', () => {
    const juego = nuevoJuego()
    for (let vuelta = 0; vuelta < 12; vuelta += 1) {
      jugarHacia(juego, { x: vuelta % 2 ? 0.2 : 0.8, y: 0.5 })
    }
    expect(juego.zarpazos).toBe(ZARPAZOS)
  })

  it('nunca se sale de la caja, ni persiguiéndola fuera', () => {
    const juego = nuevoJuego()
    for (const fuera of [{ x: -3, y: -2 }, { x: 4, y: 5 }, { x: 0.5, y: -9 }]) {
      jugarHacia(juego, fuera)
      expect(juego.x).toBeGreaterThanOrEqual(0)
      expect(juego.x).toBeLessThanOrEqual(1)
      expect(juego.y).toBeGreaterThanOrEqual(0)
      expect(juego.y).toBeLessThanOrEqual(1)
    }
  })

  it('sin pluma se vuelve al centro', () => {
    const juego = nuevoJuego()
    jugarHacia(juego, { x: 0.8, y: 0.8 })
    jugarHacia(juego, null, 4)
    expect(juego.x).toBeCloseTo(0.5, 1)
    expect(juego.y).toBeCloseTo(0.56, 1)
  })

  it('los dos radios dejan sitio de sobra entre atrapar y recargar', () => {
    // Si estuvieran pegados, un temblor de la mano daría zarpazos en cadena.
    expect(RADIO_ESCAPE).toBeGreaterThan(RADIO_ZARPAZO * 2)
    // Y lo mismo con el paseo: tiene que ser bastante más que un tembleque.
    expect(PASEO_PARA_PICAR).toBeGreaterThan(RADIO_ZARPAZO * 2)
  })
})

describe('lo que se le dice a quien juega', () => {
  it('cuenta la regla sin escribirla en ninguna parte', () => {
    const juego = nuevoJuego()
    expect(comoVa(juego, false)).toBe('esperando')
    expect(comoVa(juego, true)).toBe('persiguiendo')

    // La tiene: hay que alejársela.
    jugarHacia(juego, { x: 0.5, y: 0.56 })
    expect(comoVa(juego, true)).toBe('aleja')

    // Persiguiendo un buen rato sin atrapar nada: es que no se mueve.
    const parado = { ...nuevoJuego(), persiguiendo: 4 }
    expect(comoVa(parado, true)).toBe('muevela')

    expect(comoVa({ ...nuevoJuego(), zarpazos: ZARPAZOS }, true)).toBe('listo')
  })
})
