import { readdirSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { GLOSARIO } from '../src/contenido/glosario.js'
import { ITINERARIOS } from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import { cargarTodosLosRetos, retosDelMundo } from '../src/contenido/retos/index.js'

/**
 * La curva de aprendizaje de cada mundo.
 *
 * Un mundo puede estar entero y bien escrito y **enseñar mal**: pedir en el reto
 * tres algo que se explica en el diez, tener un jefe más fácil que el reto
 * anterior, o ser doce veces el mismo ejercicio. Nada de eso falla, nada avisa,
 * y solo se nota jugándolo con cuidado y desde cero.
 *
 * Los umbrales de aquí están **medidos sobre los once mundos que existen**, no
 * inventados: son el mínimo que hoy cumplen todos, así que lo que cazan es que
 * un mundo nuevo entre por debajo del listón que ya está puesto.
 */
const RETOS = await cargarTodosLosRetos()
const enteros = (mundoId) => retosDelMundo(mundoId).map((ficha) => RETOS.find((cada) => cada.id === ficha.id))
const DE_ESCRIBIR = ['codigo', 'refactor']
const mediana = (numeros) => {
  const ordenados = [...numeros].sort((a, b) => a - b)
  return ordenados.length ? ordenados[Math.floor(ordenados.length / 2)] : 0
}

const APUNTES = {}
{
  const carpeta = new URL('../src/contenido/apuntes/', import.meta.url)
  for (const fichero of readdirSync(carpeta)) {
    if (!fichero.endsWith('.js') || fichero === 'index.js') continue
    APUNTES[fichero.replace(/\.js$/, '')] = (await import(new URL(fichero, carpeta).href)).default
  }
}

/**
 * Los dos monotipos, que son a propósito y no descuidos.
 *
 * «El primer día» no se escribe una sola línea: se señala y se coloca, porque el
 * primer día de alguien que no ha programado nunca no es para escribir. Y
 * «Cambio de forma» es todo refactor, que es su asunto entero: el mismo problema
 * resuelto de otra manera.
 */
const MONOTIPOS = { 'primer-dia': 'nadie escribe el primer día', melaan: 'un mundo de puro refactor' }

describe('la forma de cada mundo', () => {
  it('ninguno se queda corto de retos', () => {
    for (const mundo of MUNDOS) {
      expect(enteros(mundo.id).length, mundo.id).toBeGreaterThanOrEqual(7)
    }
  })

  it('escribir código no pasa de la mitad, salvo en los dos monotipos', () => {
    // Es la regla que hace que un mundo enseñe en vez de examinar: lo que en
    // otro juego sería un párrafo del apunte, aquí es un `prediccion` o un
    // `trazar`, que enseñan haciéndolo.
    for (const mundo of MUNDOS) {
      if (MONOTIPOS[mundo.id]) continue
      const retos = enteros(mundo.id)
      const escribir = retos.filter((cada) => DE_ESCRIBIR.includes(cada.tipo)).length
      expect(escribir / retos.length, `${mundo.id}: ${escribir} de ${retos.length}`).toBeLessThanOrEqual(0.6)
    }
  })

  it('cada mundo mezcla maneras de preguntar', () => {
    for (const mundo of MUNDOS) {
      if (MONOTIPOS[mundo.id]) continue
      const tipos = new Set(enteros(mundo.id).map((cada) => cada.tipo))
      expect(tipos.size, `${mundo.id} usa solo ${[...tipos].join(', ')}`).toBeGreaterThanOrEqual(5)
    }
  })

  it('cada mundo tiene su jefe, y va al final', () => {
    for (const mundo of MUNDOS) {
      const retos = enteros(mundo.id)
      const jefes = retos.filter((cada) => cada.jefe)
      expect(jefes.length, mundo.id).toBe(1)
      expect(retos.at(-1).jefe, `${mundo.id}: el jefe no es el último`).toBe(true)
    }
  })

  it('el jefe es el pico del mundo, no un reto más', () => {
    // Pasó en La Ceniza: el jefe tenía cuatro tests y el reto anterior ocho, así
    // que el mundo bajaba justo al final. Se mide por tests y por requisitos y
    // no por longitud de la solución, porque en un mundo de refactor la solución
    // más larga es la del ejercicio con más código malo que arreglar.
    for (const mundo of MUNDOS) {
      const retos = enteros(mundo.id)
      const jefe = retos.find((cada) => cada.jefe)
      const otros = retos.filter((cada) => !cada.jefe && DE_ESCRIBIR.includes(cada.tipo))
      if (!otros.length) continue
      const medianaDeTests = mediana(otros.map((cada) => (cada.tests ?? []).length))
      expect(
        (jefe.tests ?? []).length,
        `${mundo.id}: el jefe comprueba menos que la mitad de sus retos`,
      ).toBeGreaterThanOrEqual(medianaDeTests)
    }
  })

  it('los jefes no tienen pistas: son el examen', () => {
    for (const mundo of MUNDOS) {
      const jefe = enteros(mundo.id).find((cada) => cada.jefe)
      expect((jefe.pistas ?? []).length, mundo.id).toBe(0)
    }
  })

  it('todo reto trae su apunte, y ninguno se queda en un párrafo', () => {
    const flojos = []
    for (const mundo of MUNDOS) {
      for (const reto of enteros(mundo.id)) {
        const apunte = APUNTES[reto.id]
        if (!apunte) flojos.push(`${reto.id}: sin apunte`)
        else if (apunte.length < 1500) flojos.push(`${reto.id}: ${apunte.length} caracteres`)
      }
    }
    expect(flojos).toEqual([])
  })

  it('los apuntes de la primera era son más cortos que los de la segunda, a propósito', () => {
    // El equilibrio cambia entre eras y es una decisión: en la primera hay más
    // retos y más pequeños, así que la mitad de lo que se aprende está en ellos
    // y el apunte es más corto. Si un día se igualan, es que se ha perdido.
    const largoDe = (itinerario) => {
      const todos = mundosDelItinerario(itinerario).flatMap((mundo) =>
        enteros(mundo.id).map((reto) => (APUNTES[reto.id] ?? '').length),
      )
      return todos.reduce((suma, cada) => suma + cada, 0) / todos.length
    }
    expect(largoDe('era1')).toBeLessThan(largoDe('era2'))
    // Pero cortos no es escuetos: por debajo de esto no se explica un concepto.
    expect(largoDe('era1')).toBeGreaterThan(1800)
  })
})

describe('el orden en que se enseña', () => {
  it('cada mundo enseña algo que no estaba', () => {
    // Un mundo que no introduce un solo término nuevo es un mundo que repite:
    // puede ser a propósito -un mundo de práctica- pero conviene enterarse.
    for (const itinerario of ITINERARIOS) {
      for (const mundo of mundosDelItinerario(itinerario.id)) {
        const nuevos = GLOSARIO.filter((cada) => cada.desde[itinerario.id] === mundo.id)
        expect(nuevos.length, `${mundo.id} no enseña ni un término nuevo`).toBeGreaterThan(0)
      }
    }
  })

  it('el primer mundo de cada camino es el que más cosas nombra', () => {
    // Tiene que serlo: es donde hay que poner nombre a todo lo que después se
    // da por sabido. Si otro mundo le adelanta, es que el primero da por
    // supuesto algo que no ha explicado.
    for (const itinerario of ITINERARIOS) {
      const mundos = mundosDelItinerario(itinerario.id)
      if (mundos.length < 2) continue
      const cuantos = (mundoId) => GLOSARIO.filter((cada) => cada.desde[itinerario.id] === mundoId).length
      const delPrimero = cuantos(mundos[0].id)
      for (const otro of mundos.slice(1)) {
        expect(cuantos(otro.id), `${otro.id} nombra más que ${mundos[0].id}`).toBeLessThanOrEqual(delPrimero)
      }
    }
  })

  it('ningún reto exige por requisito algo que su mundo no haya enseñado', () => {
    // El jefe de La Ceniza exigía `foreach` cuando el glosario decía que
    // `foreach` era del mundo siguiente. Una de las dos cosas estaba mal -era el
    // glosario- y este es el aviso que lo habría dicho.
    const PALABRA_A_TERMINO = {
      foreach: 'foreach',
      return: 'devolver',
      function: 'funcion',
      class: 'clase',
      while: 'bucle',
      for: 'bucle',
      map: 'map',
      filter: 'filter',
      reduce: 'reduce',
    }
    const fuera = []
    for (const mundo of MUNDOS) {
      const sabidos = new Set(
        GLOSARIO.filter((cada) => {
          const suyo = cada.desde[mundo.itinerario]
          if (!suyo) return false
          const orden = mundosDelItinerario(mundo.itinerario).map((m) => m.id)
          return orden.indexOf(suyo) <= orden.indexOf(mundo.id)
        }).map((cada) => cada.id),
      )
      for (const reto of enteros(mundo.id)) {
        for (const requisito of reto.requisitos ?? []) {
          // Solo los que EXIGEN. `prohibeLlamada` es lo contrario y prohibir
          // algo que no se ha enseñado está bien: corta el atajo a quien ya lo
          // sabe de antes y se saltaría la lección.
          if (!/^usa/.test(requisito.tipo)) continue
          const termino = PALABRA_A_TERMINO[requisito.valor]
          if (termino && !sabidos.has(termino)) {
            fuera.push(`${reto.id} exige «${requisito.valor}» y «${termino}» no se ha enseñado aún`)
          }
        }
      }
    }
    expect(fuera).toEqual([])
  })
})
