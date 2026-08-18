import { readFileSync } from 'node:fs'
import { createContext, runInContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

import { RETOS } from '../src/contenido/retos/index.js'
import { analizar, inyectarGuardaDeBucles } from '../src/motor/guardaBucles.js'
import { comprobarRequisitos } from '../src/motor/chequeosEstaticos.js'

/**
 * Prueba de fuego del contenido: cada solución de referencia tiene que pasar
 * sus propios tests y cumplir sus propios requisitos.
 *
 * Un reto cuya solución no pasa es un reto imposible, y eso en un juego de
 * aprender no es un fallo cualquiera: es el peor de todos.
 *
 * Aquí solo se pueden comprobar los retos de ES6, que no necesitan navegador.
 * De los de Vue se encarga la prueba de extremo a extremo con Playwright.
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
  const fuente = reto.tipo === 'prediccion' ? reto.codigoMostrado : reto.solucion
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

const retosSinNavegador = RETOS.filter((reto) => reto.entorno === 'worker')

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
