import { readFileSync } from 'node:fs'
import { createContext, runInContext } from 'node:vm'
import { describe, expect, it } from 'vitest'

import { mundosDelItinerario } from '../src/contenido/mundos.js'
import { cargarTodosLosRetos, cuantasVariantes, enVariante, retosDelMundo } from '../src/contenido/retos/index.js'
import { analizar, inyectarGuardaDeBucles } from '../src/motor/guardaBucles.js'

/**
 * La invariante propia del camino de seguridad, y no se parece a ninguna otra
 * del juego.
 *
 * En los demás caminos el código de partida está **incompleto**: falta una
 * función, hay un hueco, no compila. Aquí está **completo y funciona**: hace lo
 * que promete, se puede ejecutar y pasaría cualquier revisión que solo mirase si
 * hace su trabajo. Lo que tiene es un agujero.
 *
 * De ahí sale una prueba que en los otros caminos no tendría sentido: **los
 * tests hostiles tienen que distinguir**. La solución de referencia los pasa y
 * el código de partida **no**. Si el código vulnerable pasara los tests, el reto
 * no enseñaría nada: el jugador podría enviarlo tal cual, cobrar, y llevarse la
 * lección contraria a la que se pretendía.
 *
 * Es un fallo silencioso de los caros: no rompe nada, no avisa nadie, y solo se
 * nota si a alguien se le ocurre enviar el código de partida sin tocarlo.
 */
const RETOS = await cargarTodosLosRetos()
const MUNDOS_DE_SEL = mundosDelItinerario('sel').map((mundo) => mundo.id)
const enteros = (mundoId) => retosDelMundo(mundoId).map((ficha) => RETOS.find((cada) => cada.id === ficha.id))

/** Los que se resuelven escribiendo y traen código de partida que ya funciona. */
const CON_AGUJERO = MUNDOS_DE_SEL.flatMap(enteros).filter(
  (reto) => reto?.entorno === 'worker' && reto.inicial && reto.tests?.length,
)

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
  for (const archivo of ['aserciones.js', 'runner-comun.js']) {
    runInContext(readFileSync(new URL(`../public/sandbox/${archivo}`, import.meta.url), 'utf8'), contexto)
  }
  return contexto
}

const sandbox = crearSandboxDeNodo()

/** Ejecuta un código cualquiera contra los tests de un reto. */
async function ejecutar(fuente, tests) {
  const ast = analizar(fuente)
  const api = sandbox.crearAserciones({})
  const restaurar = api.interceptarConsola()
  try {
    await sandbox.construirEjecutable(inyectarGuardaDeBucles(fuente, ast), tests)(api)
  } finally {
    restaurar()
  }
  return api.resultados
}

const fallan = (resultados) => resultados.filter((cada) => !cada.ok)

describe('el camino de seguridad enseña lo que dice enseñar', () => {
  it('hay retos con agujero', () => {
    expect(CON_AGUJERO.length).toBeGreaterThan(0)
  })

  for (const reto of CON_AGUJERO) {
    it(`${reto.id}: la solución aguanta y el código de partida no`, async () => {
      // El código de partida **se ejecuta**: aquí no está incompleto, funciona.
      // Si esto lanzara, el reto sería de los normales y no de los de este
      // camino, y habría que sacarlo de esta prueba en vez de aflojarla.
      const conElAgujero = await ejecutar(reto.inicial, reto.tests)
      const rotos = fallan(conElAgujero)
      expect(
        rotos.length,
        `el código vulnerable de partida pasa todos los tests: el reto se puede superar enviándolo tal cual`,
      ).toBeGreaterThan(0)

      const arreglado = await ejecutar(reto.solucion, reto.tests)
      expect(
        fallan(arreglado).map((cada) => cada.nombre),
        'la solución de referencia no aguanta sus propios tests',
      ).toEqual([])

      // Y lo mismo en cada tanda de práctica: unos datos nuevos que el código
      // vulnerable pasara serían una tanda que no practica el ataque.
      for (let i = 1; i <= cuantasVariantes(reto); i += 1) {
        const tanda = enVariante(reto, i)
        expect(
          fallan(await ejecutar(reto.inicial, tanda.tests)).length,
          `la tanda ${i} no distingue: el código vulnerable la pasa`,
        ).toBeGreaterThan(0)
        expect(
          fallan(await ejecutar(reto.solucion, tanda.tests)).map((cada) => cada.nombre),
          `la solución de referencia falla la tanda ${i}`,
        ).toEqual([])
      }
    })
  }

  it('cada reto de escribir de Sel tiene al menos un test que es un ataque', () => {
    // Un reto de este camino cuyos tests solo comprueben que la función hace su
    // trabajo es un reto de otro camino con la ropa de este. El nombre del test
    // es lo que ve el jugador cuando falla, así que decir «el ataque» ahí es
    // media lección.
    const sinAtaque = CON_AGUJERO.filter(
      (reto) => !reto.tests.some((test) => /ataque|robad|no entra|tampoco|sigue sin/i.test(test.nombre)),
    )
    expect(sinAtaque.map((reto) => reto.id)).toEqual([])
  })
})
