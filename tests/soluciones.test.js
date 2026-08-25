import { readFileSync } from 'node:fs'
import { createContext, runInContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

import { cargarApunte, hayApunte } from '../src/contenido/apuntes/index.js'
import { cargarTodosLosRetos, cuantasVariantes, enVariante } from '../src/contenido/retos/index.js'
import { SIN_CODIGO, codigoDeReferencia, revisarTactil } from './revisarRetos.js'
import { analizar, inyectarGuardaDeBucles } from '../src/motor/guardaBucles.js'
import { comprobarRequisitos } from '../src/motor/chequeosEstaticos.js'
import { normalizar } from '../src/almacen/juego.js'

/**
 * Los retos **enteros**: el catálogo solo trae la ficha de cada uno y el cuerpo
 * -enunciado, solución, tests, pistas- se pide aparte, que es lo que mantiene
 * el arranque del juego pequeño. Aquí hacen falta enteros, así que se piden
 * todos de golpe antes de empezar.
 */
const RETOS = await cargarTodosLosRetos()

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

  return { incumplidos, resultados: api.resultados, consola: api.consola }
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

describe('las tandas de práctica están bien montadas', () => {
  const conVariantes = RETOS.filter((reto) => cuantasVariantes(reto) > 0)

  it('hay retos con práctica extra', () => {
    expect(conVariantes.length).toBeGreaterThan(0)
  })

  for (const reto of conVariantes) {
    it(`${reto.id}: ${cuantasVariantes(reto)} tandas`, () => {
      // Practicar solo tiene sentido escribiendo: en un reto de señalar la
      // respuesta ya se sabe y repetirlo es pulsar el mismo sitio.
      expect(SIN_CODIGO, `«${reto.tipo}» no es de escribir`).not.toContain(reto.tipo)

      for (let i = 1; i <= cuantasVariantes(reto); i += 1) {
        const tanda = enVariante(reto, i)

        expect(tanda.variante, 'la tanda no se identifica').toBe(i)
        expect(tanda.id, 'una tanda con otro id cobraría otra vez').toBe(reto.id)
        expect(tanda.tests?.length, 'una tanda sin tests no comprueba nada').toBeGreaterThan(0)
        expect(
          JSON.stringify(tanda.tests),
          'la tanda repite los mismos tests: practicar con los mismos datos no practica nada',
        ).not.toBe(JSON.stringify(reto.tests))
        // El código de partida y las pistas son los del reto: lo que cambia
        // son los datos, no la lección.
        expect(tanda.pistas).toEqual(reto.pistas)
      }
    })
  }

  it('pedir una tanda que no existe devuelve el reto de siempre', () => {
    const reto = conVariantes[0]
    expect(enVariante(reto, 0)).toBe(reto)
    expect(enVariante(reto, 99)).toBe(reto)
    expect(enVariante(reto)).toBe(reto)
  })
})

describe('todos los retos traen apunte, y pistas los que deben', () => {
  for (const reto of RETOS) {
    it(reto.id, () => {
      expect(hayApunte(reto.id), `${reto.id} no tiene apunte`).toBe(true)

      // Los jefes no llevan pistas: cierran un mundo y todo lo que hace falta
      // ya se ha visto en los retos de antes. Ahí solo queda Armonía, y poco.
      //
      // Y tampoco los **actos** de un final. Los finales de itinerario vienen en
      // dos retos que van juntos -se monta el sistema y luego se le pide que
      // aguante- y los dos son el examen: si el primero tuviera pistas, la
      // mitad del final se podría comprar.
      if (reto.jefe || reto.acto) {
        expect(reto.pistas, `${reto.jefe ? 'un jefe' : 'un acto del final'} no puede tener pistas`).toBeUndefined()
        return
      }
      expect(reto.pistas?.length, 'sin las tres pistas').toBe(3)
      expect(reto.recompensa?.croquetas, 'sin recompensa').toBeGreaterThan(0)
    })
  }
})

/**
 * El apunte es gratis y se abre en la misma pantalla que el reto. Eso está muy
 * bien para enseñar y es un desastre si el ejemplo del apunte **es** la
 * solución: entonces el reto no se resuelve, se copia.
 *
 * Pasaba de verdad con el jefe del primer mundo, que pedía escribir `saludar` y
 * traía la función entera escrita justo encima. Wax tiene que enseñar el
 * concepto con otro ejemplo, para que haya que trasladarlo.
 */
describe('ningún apunte regala la solución de su propio reto', () => {
  const aplanar = (texto) => (texto ?? '').replace(/\s+/g, ' ').trim()

  for (const reto of RETOS) {
    it(reto.id, async () => {
      const solucion = aplanar(codigoDeReferencia(reto))
      // Los fragmentos cortos coinciden por casualidad y no revelan nada.
      if (!solucion || solucion.length < 40) return
      // En los de predecir y trazar el código mostrado ES el enunciado, y el
      // apunte puede explicarlo: ahí no hay nada que esconder.
      if (['prediccion', 'trazar'].includes(reto.tipo)) return

      const apunte = aplanar(await cargarApunte(reto.id))
      expect(apunte.includes(solucion), 'el apunte trae la solución escrita').toBe(false)
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

/**
 * Los retos de predecir: que lo esperado sea lo que de verdad sale.
 *
 * Un reto de predecir **no se corrige ejecutando**: se compara lo que has
 * escrito con `respuestaEsperada`, tal cual (ver `normalizar` en
 * `almacen/juego.js`). El código sí se ejecuta, pero solo para enseñarte la
 * salida real al lado.
 *
 * De ahí sale el peor fallo que puede tener un juego para aprender, y no falla
 * nada cuando pasa: si `respuestaEsperada` no es exactamente lo que el código
 * imprime, **quien acierta recibe un «no»**, y encima con la salida real delante
 * contradiciendo el veredicto. Sus propios `tests` no lo cazan, porque comparan
 * la consola con una cadena escrita en el propio test, que puede haberse
 * escrito bien mientras la otra se escribía mal.
 *
 * Así que aquí se ejecuta el código mostrado y se compara **con la misma
 * función con la que corrige el juego**.
 */
describe('lo que hay que predecir es lo que de verdad se imprime', () => {
  const aPredecir = RETOS.filter((reto) => reto.tipo === 'prediccion' && reto.entorno === 'worker')

  it('hay retos de predecir que comprobar', () => {
    expect(aPredecir.length).toBeGreaterThan(0)
  })

  for (const reto of aPredecir) {
    it(`${reto.id}: ${reto.titulo}`, async () => {
      const { consola } = await ejecutarSolucion(reto)
      const real = consola.map((linea) => linea.texto).join('\n')
      expect(
        normalizar(real),
        `la salida real no es la respuesta esperada:\n--- real ---\n${real}\n--- esperada ---\n${reto.respuestaEsperada}`,
      ).toBe(normalizar(reto.respuestaEsperada))
    })
  }
})
