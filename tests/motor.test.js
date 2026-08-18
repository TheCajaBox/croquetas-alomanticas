import { describe, expect, it } from 'vitest'

import {
  ErrorDeSintaxis,
  MARCA_BUCLE_INFINITO,
  analizar,
  inyectarGuardaDeBucles,
} from '../src/motor/guardaBucles.js'
import { comprobarRequisitos, resumirCodigo } from '../src/motor/chequeosEstaticos.js'
import { migrar } from '../src/almacen/persistencia.js'

const ejecutar = (fuente) => new Function(`"use strict";\n${fuente}`)()

describe('guarda de bucles', () => {
  it('deja en paz el código que no tiene bucles', () => {
    const fuente = 'const a = 1'
    expect(inyectarGuardaDeBucles(fuente, analizar(fuente))).toBe(fuente)
  })

  it('corta un while sin salida en vez de colgarse', () => {
    const fuente = 'while (true) {}'
    expect(() => ejecutar(inyectarGuardaDeBucles(fuente, analizar(fuente)))).toThrow(
      MARCA_BUCLE_INFINITO,
    )
  })

  it('corta también los bucles sin llaves', () => {
    const fuente = 'let i = 0\nfor (;;) i += 1'
    expect(() => ejecutar(inyectarGuardaDeBucles(fuente, analizar(fuente)))).toThrow(
      MARCA_BUCLE_INFINITO,
    )
  })

  it('no estorba a un bucle normal', () => {
    const fuente = 'let suma = 0\nfor (const n of [1, 2, 3]) suma += n\nreturn suma'
    expect(ejecutar(inyectarGuardaDeBucles(fuente, analizar(fuente)))).toBe(6)
  })

  it('cuenta cada bucle por separado, no todos juntos', () => {
    // Dos bucles largos que por separado no llegan al tope no deben saltar por
    // el simple hecho de estar en el mismo código.
    const bucle = 'for (let i = 0; i < 150000; i += 1) {}'
    const fuente = `${bucle}\n${bucle}\nreturn 'bien'`
    expect(ejecutar(inyectarGuardaDeBucles(fuente, analizar(fuente)))).toBe('bien')
  })

  it('no mueve los números de línea del código del jugador', () => {
    const fuente = 'const a = 1\nwhile (a) { break }\nconst b = 2'
    const vigilado = inyectarGuardaDeBucles(fuente, analizar(fuente))
    // El contador se añade al final; las tres primeras líneas siguen donde estaban.
    expect(vigilado.split('\n').slice(0, 3).length).toBe(3)
    expect(vigilado.split('\n')[2]).toBe('const b = 2')
  })

  it('un error de sintaxis viene con su línea y su columna', () => {
    try {
      analizar('const a = {\n  falta: ,\n}')
      throw new Error('debería haber fallado')
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorDeSintaxis)
      expect(error.linea).toBe(2)
      expect(error.columna).toBeGreaterThan(0)
      // La posición se enseña aparte, no repetida dentro del mensaje.
      expect(error.message).not.toMatch(/\(\d+:\d+\)/)
    }
  })
})

describe('comprobaciones estáticas', () => {
  const comprobar = (fuente, requisitos) => comprobarRequisitos(analizar(fuente), requisitos)
  const cumple = (fuente, requisitos) => comprobar(fuente, requisitos).every((r) => r.cumplido)

  it('ve los tres puntitos dentro de un patrón de desestructuración', () => {
    // acorn-walk no visita este nodo; por eso el motor lleva su propio recorrido.
    expect(cumple('const { a, ...resto } = {}', [{ tipo: 'usaSpread' }])).toBe(true)
  })

  it('no se deja engañar por un bucle escrito en un comentario', () => {
    const fuente = '// aquí iría un for\nconst texto = "for (;;) {}"\nconst a = 1'
    expect(cumple(fuente, [{ tipo: 'prohibeBucles' }])).toBe(true)
  })

  it('caza el bucle de verdad', () => {
    expect(cumple('for (const x of []) {}', [{ tipo: 'prohibeBucles' }])).toBe(false)
  })

  it('distingue var de const', () => {
    expect(cumple('var a = 1', [{ tipo: 'prohibeVar' }])).toBe(false)
    expect(cumple('const a = 1', [{ tipo: 'prohibeVar' }])).toBe(true)
  })

  it('encuentra nombres declarados, también los desestructurados', () => {
    const resumen = resumirCodigo(analizar('const { gato } = {}\nfunction cuidar() {}'))
    expect(resumen.nombresDeclarados.has('gato')).toBe(true)
    expect(resumen.nombresDeclarados.has('cuidar')).toBe(true)
  })

  it('mira dentro de las plantillas de Vue, que el AST no abre', () => {
    const fuente = 'const c = { template: `<button @click="$emit(\'ir\')">x</button>` }'
    expect(cumple(fuente, [{ tipo: 'usaEnPlantilla', valor: '$emit' }])).toBe(true)
    expect(cumple(fuente, [{ tipo: 'usaEnPlantilla', valor: 'v-model' }])).toBe(false)
  })

  it('separa ?? de ||', () => {
    expect(cumple('const a = null ?? 1', [{ tipo: 'usaCoalescencia' }])).toBe(true)
    expect(cumple('const a = null || 1', [{ tipo: 'usaCoalescencia' }])).toBe(false)
  })

  it('devuelve el mensaje del reto cuando lo trae', () => {
    const [resultado] = comprobar('var a = 1', [{ tipo: 'prohibeVar', mensaje: 'Aquí no.' }])
    expect(resultado.mensaje).toBe('Aquí no.')
  })

  it('protesta si un reto pide un requisito que no existe', () => {
    expect(() => comprobar('const a = 1', [{ tipo: 'inventado' }])).toThrow(/inventado/)
  })
})

describe('partida guardada', () => {
  it('acepta una partida de la versión actual', () => {
    const partida = { version: 1, progreso: { rachaSinPistas: 2 } }
    expect(migrar(partida)).toEqual(partida)
  })

  it('empieza de cero ante cualquier cosa que no reconozca', () => {
    for (const basura of [null, 'texto', 42, [], { sinVersion: true }]) {
      expect(migrar(basura)).toEqual({ version: 1 })
    }
  })
})
