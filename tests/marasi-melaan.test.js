import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { CROQUETAS_POR_ACIERTO, REPASOS } from '../src/contenido/repasos.js'
import { MUNDOS, MUNDOS_POR_ID } from '../src/contenido/mundos.js'
import { RETOS, retosDelMundo } from '../src/contenido/retos/index.js'
import { CROQUETAS_INICIALES, usarEconomia } from '../src/almacen/economia.js'
import { usarNarrador } from '../src/almacen/narrador.js'
import { usarRepasos } from '../src/almacen/repasos.js'

beforeEach(() => setActivePinia(createPinia()))

describe('los repasos de Marasi', () => {
  it('hay uno por cada mundo', () => {
    const conRepaso = new Set(REPASOS.map((r) => r.mundo))
    for (const mundo of MUNDOS) {
      expect(conRepaso.has(mundo.id), `el mundo ${mundo.id} se queda sin repaso`).toBe(true)
    }
  })

  it('cada pregunta tiene una sola respuesta correcta y todas explicadas', () => {
    for (const repaso of REPASOS) {
      expect(repaso.preguntas.length, repaso.id).toBeGreaterThanOrEqual(5)
      for (const pregunta of repaso.preguntas) {
        const correctas = pregunta.opciones.filter((o) => o.correcta)
        expect(correctas.length, `${repaso.id}: «${pregunta.pregunta}»`).toBe(1)
        expect(pregunta.opciones.length).toBeGreaterThanOrEqual(3)
        for (const opcion of pregunta.opciones) {
          expect(opcion.porque?.length, `${repaso.id}: opción sin porqué`).toBeGreaterThan(20)
        }
      }
    }
  })

  it('paga por acierto la primera vez', () => {
    const repasos = usarRepasos()
    const economia = usarEconomia()
    const repaso = REPASOS[0]

    const { pagado, mejorado } = repasos.registrar(repaso, 4)

    expect(mejorado).toBe(true)
    expect(pagado).toBe(4 * CROQUETAS_POR_ACIERTO)
    expect(economia.croquetas).toBe(CROQUETAS_INICIALES + pagado)
    expect(repasos.mejor(repaso.id)).toBe(4)
  })

  it('repetirlo con la misma marca no paga nada', () => {
    const repasos = usarRepasos()
    const economia = usarEconomia()
    const repaso = REPASOS[0]

    repasos.registrar(repaso, 4)
    const saldo = economia.croquetas

    const segunda = repasos.registrar(repaso, 4)
    expect(segunda.pagado).toBe(0)
    expect(segunda.mejorado).toBe(false)
    expect(economia.croquetas).toBe(saldo)
  })

  it('mejorar la marca paga solo la diferencia', () => {
    const repasos = usarRepasos()
    const economia = usarEconomia()
    const repaso = REPASOS[0]

    repasos.registrar(repaso, 4)
    const saldo = economia.croquetas

    const mejor = repasos.registrar(repaso, 6)
    expect(mejor.pagado).toBe(2 * CROQUETAS_POR_ACIERTO)
    expect(economia.croquetas).toBe(saldo + mejor.pagado)
    expect(repasos.mejor(repaso.id)).toBe(6)
  })

  it('empeorar no baja la mejor marca', () => {
    const repasos = usarRepasos()
    const repaso = REPASOS[0]

    repasos.registrar(repaso, 6)
    repasos.registrar(repaso, 2)
    expect(repasos.mejor(repaso.id)).toBe(6)
  })

  it('cuenta los que se han bordado', () => {
    const repasos = usarRepasos()
    const repaso = REPASOS[0]

    repasos.registrar(repaso, repaso.preguntas.length - 1)
    expect(repasos.perfectos).toBe(0)

    repasos.registrar(repaso, repaso.preguntas.length)
    expect(repasos.perfectos).toBe(1)
  })
})

describe('el mundo de MeLaan', () => {
  const suyos = retosDelMundo('melaan')

  it('existe y va después de las dos rutas de Vue', () => {
    const melaan = MUNDOS.find((m) => m.id === 'melaan')
    expect(melaan).toBeTruthy()
    expect(melaan.requiere).toBe('vue3')
    expect(suyos.length).toBeGreaterThanOrEqual(6)
  })

  it('todos son de reescribir y todos parten de código que ya funciona', () => {
    for (const reto of suyos) {
      expect(reto.tipo, reto.id).toBe('refactor')
      // Sin código de partida no hay nada que reescribir.
      expect(reto.inicial?.length, `${reto.id} no trae código de partida`).toBeGreaterThan(60)
      expect(reto.solucion?.length, reto.id).toBeGreaterThan(40)
    }
  })

  it('cada uno obliga a cambiar de forma, no solo a que pase', () => {
    // Sin requisitos, dejar el código tal cual pasaría los tests: los tests
    // comprueban el comportamiento, que precisamente no debe cambiar.
    for (const reto of suyos) {
      expect(reto.requisitos?.length, `${reto.id} no exige ninguna forma nueva`).toBeGreaterThan(0)
    }
  })

  it('el mundo cierra con un jefe', () => {
    expect(suyos.filter((reto) => reto.jefe).length).toBe(1)
  })
})

describe('el conjunto del contenido', () => {
  it('cada mundo tiene sus retos y ninguno se queda huérfano', () => {
    const mundosConocidos = new Set(MUNDOS.map((m) => m.id))
    for (const reto of RETOS) {
      expect(mundosConocidos.has(reto.mundo), `${reto.id} apunta a un mundo que no existe`).toBe(true)
    }
    for (const mundo of MUNDOS) {
      expect(retosDelMundo(mundo.id).length, `el mundo ${mundo.id} está vacío`).toBeGreaterThan(0)
    }
  })

  it('no hay identificadores de reto repetidos', () => {
    const ids = RETOS.map((reto) => reto.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('quién recibe al entrar en un mundo', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('MeLaan se presenta la primera vez que se pisa el suyo, y solo la primera', () => {
    const narrador = usarNarrador()
    const suyo = MUNDOS_POR_ID.melaan

    narrador.entrarAlMundo(suyo)
    expect(narrador.mensaje.personaje).toBe('melaan')

    narrador.entrarAlMundo(suyo)
    expect(narrador.mensaje.personaje).toBe('wayne')
  })

  it('los mundos sin dueño los abre Wayne', () => {
    const narrador = usarNarrador()
    narrador.entrarAlMundo(MUNDOS_POR_ID.es6)
    expect(narrador.mensaje.personaje).toBe('wayne')
    expect(narrador.mensaje.evento).toBe('entrarAlMundo')
  })
})
