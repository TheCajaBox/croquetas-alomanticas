import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  CROQUETAS_POR_ACIERTO,
  REPASOS,
  REPASOS_POR_MUNDO,
  cargarTodosLosRepasos,
} from '../src/contenido/repasos/index.js'
import { MUNDOS, MUNDOS_POR_ID } from '../src/contenido/mundos.js'
import { cargarTodosLosRetos, retosDelMundo } from '../src/contenido/retos/index.js'
import { CROQUETAS_INICIALES, usarEconomia } from '../src/almacen/economia.js'
import { usarNarrador } from '../src/almacen/narrador.js'
import { usarRepasos } from '../src/almacen/repasos.js'

/**
 * Los retos **enteros**: el catálogo solo trae la ficha de cada uno y el cuerpo
 * -enunciado, solución, tests, pistas- se pide aparte, que es lo que mantiene
 * el arranque del juego pequeño. Aquí hacen falta enteros, así que se piden
 * todos de golpe antes de empezar.
 */
const RETOS = await cargarTodosLosRetos()

/**
 * Y los repasos enteros, por lo mismo: `REPASOS` son las fichas -quién
 * pregunta, cuántas son- y las preguntas se piden aparte para que no viajen en
 * el arranque. Aquí hay que mirarlas.
 */
const ENTEROS = await cargarTodosLosRepasos()

beforeEach(() => setActivePinia(createPinia()))

describe('los repasos de Marasi', () => {
  it('hay uno por cada mundo', () => {
    const conRepaso = new Set(REPASOS.map((r) => r.mundo))
    for (const mundo of MUNDOS) {
      expect(conRepaso.has(mundo.id), `el mundo ${mundo.id} se queda sin repaso`).toBe(true)
    }
  })

  it('cada pregunta tiene una sola respuesta correcta y todas explicadas', () => {
    for (const repaso of ENTEROS) {
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
    const repaso = ENTEROS[0]

    const { pagado, mejorado } = repasos.registrar(repaso, 4)

    expect(mejorado).toBe(true)
    expect(pagado).toBe(4 * CROQUETAS_POR_ACIERTO)
    expect(economia.croquetas).toBe(CROQUETAS_INICIALES + pagado)
    expect(repasos.mejor(repaso.id)).toBe(4)
  })

  it('repetirlo con la misma marca no paga nada', () => {
    const repasos = usarRepasos()
    const economia = usarEconomia()
    const repaso = ENTEROS[0]

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
    const repaso = ENTEROS[0]

    repasos.registrar(repaso, 4)
    const saldo = economia.croquetas

    const mejor = repasos.registrar(repaso, 6)
    expect(mejor.pagado).toBe(2 * CROQUETAS_POR_ACIERTO)
    expect(economia.croquetas).toBe(saldo + mejor.pagado)
    expect(repasos.mejor(repaso.id)).toBe(6)
  })

  it('empeorar no baja la mejor marca', () => {
    const repasos = usarRepasos()
    const repaso = ENTEROS[0]

    repasos.registrar(repaso, 6)
    repasos.registrar(repaso, 2)
    expect(repasos.mejor(repaso.id)).toBe(6)
  })

  it('cuenta los que se han bordado', () => {
    const repasos = usarRepasos()
    const repaso = ENTEROS[0]

    repasos.registrar(repaso, repaso.preguntas.length - 1)
    expect(repasos.perfectos).toBe(0)

    repasos.registrar(repaso, repaso.preguntas.length)
    expect(repasos.perfectos).toBe(1)
  })
})

describe('el mundo de MeLaan', () => {
  // Enteros y no fichas: aquí se mira el código de partida y la solución.
  const suyos = RETOS.filter((reto) => reto.mundo === 'melaan')

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

/**
 * Los repasos se reparten como los retos: la ficha en el arranque y las
 * preguntas al abrirlo.
 *
 * Los dos fallos que ese reparto puede tener son silenciosos, y son los mismos
 * que ya cazamos con los retos: que la ficha diga algo distinto de lo que dice
 * el fichero, y que alguien importe un repaso de forma estática y su trozo
 * vuelva al paquete principal sin que nada avise.
 */
describe('el reparto de los repasos', () => {
  it('la ficha dice exactamente lo que dice el fichero del repaso', () => {
    const desajustes = []
    for (const entero of ENTEROS) {
      const ficha = REPASOS_POR_MUNDO[entero.mundo]
      if (!ficha) {
        desajustes.push(`${entero.mundo}: no está en el índice`)
        continue
      }
      if (ficha.id !== entero.id) desajustes.push(`${entero.mundo}.id: ${ficha.id} ≠ ${entero.id}`)
      if (ficha.titulo !== entero.titulo) desajustes.push(`${entero.mundo}.titulo`)
      if ((ficha.quien ?? null) !== (entero.quien ?? null)) desajustes.push(`${entero.mundo}.quien`)
      if (ficha.cuantasPreguntas !== entero.preguntas.length) {
        desajustes.push(`${entero.mundo}.cuantasPreguntas: ${ficha.cuantasPreguntas} ≠ ${entero.preguntas.length}`)
      }
    }
    expect(desajustes).toEqual([])
  })

  it('no falta ni sobra ningún repaso', () => {
    expect(ENTEROS.length).toBe(REPASOS.length)
    expect(new Set(REPASOS.map((cada) => cada.mundo)).size).toBe(REPASOS.length)
  })

  it('la ficha lleva lo justo: las preguntas no viajan en ella', () => {
    for (const ficha of REPASOS) {
      expect(ficha.preguntas, `${ficha.mundo} trae las preguntas en la ficha`).toBeUndefined()
    }
  })

  it('nadie importa un repaso de forma estática', () => {
    // `repasos/<mundo>.js` es un cuerpo; `repasos/index.js` es el índice y sí se
    // importa. Un import directo de un cuerpo devolvería su trozo al paquete
    // principal sin romper nada.
    const sospechosos = []
    const recorrer = (carpeta) => {
      for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
        const ruta = join(carpeta, entrada.name)
        if (entrada.isDirectory()) {
          recorrer(ruta)
          continue
        }
        if (!/\.(js|vue)$/.test(entrada.name)) continue
        for (const linea of readFileSync(ruta, 'utf8').split('\n')) {
          if (!/^\s*import\s/.test(linea)) continue
          if (/repasos\/(?!index)[\w-]+(\.js)?['"]/.test(linea)) sospechosos.push(`${ruta}: ${linea.trim()}`)
        }
      }
    }
    recorrer(fileURLToPath(new URL('../src/', import.meta.url)))
    expect(sospechosos).toEqual([])
  })
})
