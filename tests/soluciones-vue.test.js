// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { beforeAll, describe, expect, it } from 'vitest'

import { RETOS } from '../src/contenido/retos/index.js'
import { SIN_CODIGO, codigoDeReferencia } from './revisarRetos.js'
import { analizar, inyectarGuardaDeBucles } from '../src/motor/guardaBucles.js'
import { comprobarRequisitos } from '../src/motor/chequeosEstaticos.js'

/**
 * Lo mismo que tests/soluciones.test.js pero para los retos que necesitan DOM.
 *
 * Se cargan aquí los MISMOS ficheros de public/sandbox/ que usa el juego, y en
 * particular el mismo `crearMontaje`: si la forma de montar un componente
 * cambiara solo en el juego o solo aquí, estas pruebas dejarían de significar
 * nada.
 */
function cargarScriptClasico(ruta) {
  const fuente = readFileSync(new URL(ruta, import.meta.url), 'utf8')
  // eval indirecto: ejecuta en el ámbito global, como una etiqueta <script>.
  ;(0, eval)(fuente)
}

const entornos = {}

beforeAll(() => {
  globalThis.self = globalThis
  cargarScriptClasico('../public/sandbox/aserciones.js')
  cargarScriptClasico('../public/sandbox/runner-comun.js')

  // Cada runtime se carga y se guarda aparte. En el juego cada sandbox es una
  // página distinta con un único Vue global; aquí conviven los dos en el mismo
  // proceso, así que hay que reponer el que toca antes de cada ejecución.
  for (const [nombre, runtime, montaje] of [
    ['vue2', '../public/vendor/vue2.js', '../public/sandbox/montaje-vue2.js'],
    ['vue3', '../public/vendor/vue3.js', '../public/sandbox/montaje-vue3.js'],
  ]) {
    cargarScriptClasico(runtime)
    cargarScriptClasico(montaje)
    const escenario = document.createElement('div')
    document.body.appendChild(escenario)
    entornos[nombre] = { montaje: globalThis.crearMontaje(escenario), Vue: globalThis.Vue }
  }
})

async function ejecutarSolucion(reto) {
  const fuente = codigoDeReferencia(reto)
  const ast = analizar(fuente)
  const requisitos = comprobarRequisitos(ast, reto.requisitos)

  const { montaje, Vue } = entornos[reto.entorno]
  globalThis.Vue = Vue
  const entorno = montaje
  const api = globalThis.crearAserciones(entorno)
  const restaurar = api.interceptarConsola()
  entorno.limpiar()
  try {
    await globalThis.construirEjecutable(inyectarGuardaDeBucles(fuente, ast), reto.tests ?? [])(api)
  } finally {
    restaurar()
  }

  return {
    incumplidos: requisitos.filter((r) => !r.cumplido).map((r) => r.tipo),
    resultados: api.resultados,
  }
}

// Por los entornos de Vue y no por «todo lo que no sea worker»: en cuanto
// apareció un entorno nuevo -PHP-, este fichero se puso a ejecutar retos de PHP
// en un sandbox de JavaScript y a decir que su sintaxis estaba mal.
const retosDeVue = RETOS.filter(
  (reto) => ['vue2', 'vue3'].includes(reto.entorno) && !SIN_CODIGO.includes(reto.tipo),
)

describe('las soluciones de referencia de los mundos de Vue resuelven sus retos', () => {
  for (const reto of retosDeVue) {
    it(`${reto.id}: ${reto.titulo}`, async () => {
      const { incumplidos, resultados } = await ejecutarSolucion(reto)

      expect(incumplidos, 'la solución incumple requisitos del propio reto').toEqual([])
      expect(resultados.length, 'el reto no tiene ni un test').toBeGreaterThan(0)
      expect(resultados.filter((r) => !r.ok).map((r) => `${r.nombre}: ${r.mensaje}`), 'tests en rojo').toEqual([])
    })
  }
})
