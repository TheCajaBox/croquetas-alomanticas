/**
 * Las insignias y los demás premios que no pagan croquetas.
 *
 * La regla que estas pruebas protegen es la de siempre: **nada de esto toca la
 * economía**. Las croquetas por reto se calibraron a propósito y la motivación
 * nueva tenía que salir de otro sitio.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { INSIGNIAS } from '../src/contenido/insignias.js'
import { LINEAS, LINEAS_DE_MELAAN, LINEAS_DE_STERIS } from '../src/contenido/narrador/lineas.js'
import { MUNDOS } from '../src/contenido/mundos.js'
import { RETOS, retosDelMundo } from '../src/contenido/retos/index.js'
import { usarEconomia } from '../src/almacen/economia.js'
import { usarInsignias } from '../src/almacen/insignias.js'
import { usarProgreso } from '../src/almacen/progreso.js'

beforeEach(() => setActivePinia(createPinia()))

describe('las insignias', () => {
  it('están todas bien formadas', () => {
    for (const insignia of INSIGNIAS) {
      expect(insignia.id, 'sin id').toBeTruthy()
      expect(insignia.nombre, `${insignia.id} sin nombre`).toBeTruthy()
      expect(insignia.porque, `${insignia.id} sin porqué`).toBeTruthy()
      expect(typeof insignia.cumple, `${insignia.id} sin condición`).toBe('function')
    }
    const ids = INSIGNIAS.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('no hay ninguna al empezar', () => {
    expect(usarInsignias().cuantas).toBe(0)
  })

  it('no pagan ni una croqueta', () => {
    const economia = usarEconomia()
    const progreso = usarProgreso()
    const antes = economia.croquetas

    for (const reto of retosDelMundo('primer-dia')) progreso.registrarVictoria(reto.id)
    const nuevas = usarInsignias().revisar()

    expect(nuevas.length, 'terminar un mundo no ha dado ninguna insignia').toBeGreaterThan(0)
    expect(economia.croquetas, 'una insignia ha tocado el saldo').toBe(antes)
    expect(economia.ganadasEnTotal).toBe(0)
  })

  it('se gana una sola vez', () => {
    const progreso = usarProgreso()
    const insignias = usarInsignias()

    for (const reto of retosDelMundo('primer-dia')) progreso.registrarVictoria(reto.id)
    insignias.revisar()
    const cuantas = insignias.cuantas

    expect(insignias.revisar()).toEqual([])
    expect(insignias.cuantas).toBe(cuantas)
  })

  it('la de terminarlo todo pide de verdad los noventa retos', () => {
    const progreso = usarProgreso()
    const insignias = usarInsignias()

    for (const reto of RETOS.slice(0, RETOS.length - 1)) progreso.registrarVictoria(reto.id)
    insignias.revisar()
    expect(insignias.tiene('todo-el-camino')).toBe(false)

    progreso.registrarVictoria(RETOS.at(-1).id)
    insignias.revisar()
    expect(insignias.tiene('todo-el-camino')).toBe(true)
  })

  it('una condición que reviente no tumba el reto que acabas de pasar', () => {
    const insignias = usarInsignias()
    const rota = { id: 'rota', nombre: 'x', porque: 'x', cumple: () => { throw new Error('ay') } }
    INSIGNIAS.push(rota)
    try {
      expect(() => insignias.revisar()).not.toThrow()
      expect(insignias.tiene('rota')).toBe(false)
    } finally {
      INSIGNIAS.pop()
    }
  })
})

describe('la racha, que ya se calculaba y no se veía', () => {
  it('sube al encadenar retos sin pistas y se rompe al pedir una', () => {
    const progreso = usarProgreso()

    expect(progreso.registrarVictoria('dia1-01-variables').racha).toBe(1)
    expect(progreso.registrarVictoria('dia1-02-tipos').racha).toBe(2)

    progreso.registrarPista('dia1-03-const-o-let', 1)
    const tras = progreso.registrarVictoria('dia1-03-const-o-let')

    expect(tras.racha).toBe(0)
    expect(tras.rachaRota, 'no ha avisado de que la racha se rompía').toBe(true)
    expect(tras.rachaAntes).toBe(2)
  })

  it('no avisa de una racha rota que no valía la pena', () => {
    const progreso = usarProgreso()
    progreso.registrarPista('dia1-01-variables', 1)
    expect(progreso.registrarVictoria('dia1-01-variables').rachaRota).toBe(false)
  })

  it('sale en la cabecera a partir de dos', () => {
    const app = readFileSync(new URL('../src/App.vue', import.meta.url), 'utf8')
    expect(app).toContain('progreso.rachaSinPistas >= 2')
  })
})

describe('las frases escritas y sin usar', () => {
  /**
   * Nueve eventos del narrador estaban escritos, revisados y sin que ningún
   * sitio los disparara. Esta prueba impide que vuelva a pasar.
   */
  const fuentes = ['almacen', 'vistas', 'componentes', 'motor/armonia']
    .flatMap((carpeta) => {
      const dir = new URL(`../src/${carpeta}/`, import.meta.url)
      return readdirSync(dir).map((f) => readFileSync(new URL(f, dir), 'utf8'))
    })
    .join('\n')

  const disparados = (sacos) =>
    Object.keys(sacos).filter((evento) => !fuentes.includes(`'${evento}'`))

  it('Wayne no tiene frases huérfanas', () => {
    expect(disparados(LINEAS)).toEqual([])
  })

  it('ni Steris ni MeLaan tampoco', () => {
    expect(disparados(LINEAS_DE_STERIS)).toEqual([])
    expect(disparados(LINEAS_DE_MELAAN)).toEqual([])
  })

  it('cada mundo con anfitrión tiene quien lo presente', () => {
    for (const mundo of MUNDOS.filter((m) => m.anfitrion)) {
      expect(['steris', 'wax', 'marasi', 'melaan'], `${mundo.id}`).toContain(mundo.anfitrion)
    }
  })
})
