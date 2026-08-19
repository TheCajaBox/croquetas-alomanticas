import { readFileSync } from 'node:fs'
import { createContext, runInContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

import { RETOS } from '../src/contenido/retos/index.js'
import { SIN_CODIGO, codigoDeReferencia, revisarTactil } from './revisarRetos.js'
import { analizar, inyectarGuardaDeBucles } from '../src/motor/guardaBucles.js'
import { comprobarRequisitos } from '../src/motor/chequeosEstaticos.js'

/**
 * Comprobación de todo el contenido que no necesita navegador. Los criterios
 * por tipo de reto están en tests/revisarRetos.js; de los mundos de Vue se
 * encarga tests/soluciones-vue.test.js, que sí monta un DOM.
 */
function crearSandboxDeNodo() {
  const contexto = {
    console: { log() {}, warn() {}, error() {} },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  }
  contexto.self = contexto
  createContext(contexto)
  // Los mismos ficheros que carga el worker del juego, sin copias ni versiones aparte.
  for (const archivo of ['aserciones.js', 'runner-comun.js']) {
    runInContext(readFileSync(new URL(`../public/sandbox/${archivo}`, import.meta.url), 'utf8'), contexto)
  }
  return contexto
}

const sandbox = crearSandboxDeNodo()

async function ejecutarSolucion(reto) {
  const fuente = codigoDeReferencia(reto)
  const ast = analizar(fuente)

  const requisitos = comprobarRequisitos(ast, reto.requisitos)
  const incumplidos = requisitos.filter((r) => !r.cumplido).map((r) => r.tipo)

  const api = sandbox.crearAserciones({})
  const restaurar = api.interceptarConsola()
  try {
    await sandbox.construirEjecutable(inyectarGuardaDeBucles(fuente, ast), reto.tests ?? [])(api)
  } finally {
    restaurar()
  }

  return { incumplidos, resultados: api.resultados }
}

const retosSinNavegador = RETOS.filter(
  (reto) => reto.entorno === 'worker' && !SIN_CODIGO.includes(reto.tipo),
)
const retosTactiles = RETOS.filter((reto) => SIN_CODIGO.includes(reto.tipo))

describe('los retos de señalar están bien montados', () => {
  it('hay retos de señalar', () => {
    expect(retosTactiles.length).toBeGreaterThan(0)
  })

  for (const reto of retosTactiles) {
    it(`${reto.id}: ${reto.titulo}`, () => {
      expect(revisarTactil(reto)).toEqual([])
    })
  }
})

describe('todos los retos traen apunte, y pistas los que deben', () => {
  for (const reto of RETOS) {
    it(reto.id, () => {
      expect(reto.apunte, 'sin apunte de Wax').toBeTruthy()

      // Los jefes no llevan pistas: cierran un mundo y todo lo que hace falta
      // ya se ha visto en los retos de antes. Ahí solo queda Armonía, y poco.
      if (reto.jefe) {
        expect(reto.pistas, 'un jefe no puede tener pistas').toBeUndefined()
        return
      }
      expect(reto.pistas?.length, 'sin las tres pistas').toBe(3)
      expect(reto.recompensa?.croquetas, 'sin recompensa').toBeGreaterThan(0)
    })
  }
})

describe('las soluciones de referencia resuelven sus propios retos', () => {
  it('hay retos que comprobar', () => {
    expect(retosSinNavegador.length).toBeGreaterThan(0)
  })

  for (const reto of retosSinNavegador) {
    it(`${reto.id}: ${reto.titulo}`, async () => {
      const { incumplidos, resultados } = await ejecutarSolucion(reto)

      expect(incumplidos, `la solución incumple requisitos del propio reto`).toEqual([])
      expect(resultados.length, 'el reto no tiene ni un test').toBeGreaterThan(0)

      const fallados = resultados.filter((r) => !r.ok)
      expect(fallados.map((r) => `${r.nombre}: ${r.mensaje}`), 'tests en rojo').toEqual([])
    })
  }
})
