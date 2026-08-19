/**
 * El registro de tipos tiene que estar al día, y hay que poder confiar en él.
 *
 * El fallo que estas pruebas persiguen es el silencioso: la plantilla de
 * `VistaReto` termina en un `v-else` que pinta el editor de código, así que un
 * tipo táctil sin su rama no daba error — salía como un reto de escribir, con
 * su editor y su botón de ejecutar, y eso solo se descubre jugando.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { RETOS } from '../src/contenido/retos/index.js'
import {
  NOMBRES_DE_TIPO,
  TIPOS_DE_RETO,
  codigoDeReferencia,
  datosDelTipo,
  esTactil,
  seEscribe,
  sinCodigo,
} from '../src/contenido/retos/tipos.js'

const vistaReto = readFileSync(new URL('../src/vistas/VistaReto.vue', import.meta.url), 'utf8')

describe('el registro de tipos de reto', () => {
  it('declara todos los tipos que usan los retos', () => {
    const usados = [...new Set(RETOS.map((reto) => reto.tipo))]
    for (const tipo of usados) {
      expect(() => datosDelTipo(tipo), `el tipo "${tipo}" no está declarado`).not.toThrow()
    }
  })

  it('no declara tipos que no use nadie', () => {
    const usados = new Set(RETOS.map((reto) => reto.tipo))
    const huerfanos = NOMBRES_DE_TIPO.filter((tipo) => !usados.has(tipo))
    expect(huerfanos, `tipos declarados y sin usar: ${huerfanos.join(', ')}`).toEqual([])
  })

  it('se queja de un tipo desconocido en vez de dejarlo pasar', () => {
    expect(() => datosDelTipo('inventado')).toThrow(/desconocido/i)
  })

  it('da a cada tipo una etiqueta propia para la lista del mundo', () => {
    const etiquetas = NOMBRES_DE_TIPO.map((tipo) => TIPOS_DE_RETO[tipo].etiqueta)
    expect(etiquetas.every(Boolean)).toBe(true)
    expect(new Set(etiquetas).size).toBe(etiquetas.length)
  })

  it('no marca ningún tipo a la vez como de escribir y de señalar', () => {
    const ambos = NOMBRES_DE_TIPO.filter((tipo) => seEscribe(tipo) && esTactil(tipo))
    expect(ambos).toEqual([])
  })

  it('dice de cada tipo si tiene código de referencia, sin dejarlo a medias', () => {
    for (const tipo of NOMBRES_DE_TIPO) {
      const { referencia } = TIPOS_DE_RETO[tipo]
      expect(
        referencia === null || typeof referencia === 'function',
        `"${tipo}" no dice de dónde sale su código de referencia`,
      ).toBe(true)
    }
  })

  it('saca código de referencia de todos los retos que deberían tenerlo', () => {
    for (const reto of RETOS) {
      const referencia = codigoDeReferencia(reto)
      if (sinCodigo(reto.tipo)) {
        expect(referencia, `${reto.id} no debería tener código`).toBeNull()
      } else {
        expect(referencia?.trim(), `${reto.id} se ha quedado sin código de referencia`).toBeTruthy()
      }
    }
  })

  // ---- La rama en la plantilla, que es la que fallaba en silencio -----------

  it('da a cada tipo táctil su propia rama en VistaReto', () => {
    for (const tipo of NOMBRES_DE_TIPO.filter(esTactil)) {
      expect(
        vistaReto.includes(`reto.tipo === '${tipo}'`),
        `el tipo táctil "${tipo}" no tiene rama en VistaReto: saldría como un reto de escribir`,
      ).toBe(true)
    }
  })

  it('deja las cuatro listas escritas a mano fuera de VistaReto', () => {
    // Si vuelven, vuelve el problema: dos sitios que hay que acordarse de tocar.
    expect(vistaReto).not.toMatch(/\['codigo', 'bug', 'refactor'\]/)
    expect(vistaReto).not.toMatch(/reto\.tipo !== 'eleccion'/)
  })
})
