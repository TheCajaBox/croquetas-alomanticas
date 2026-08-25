import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { MUNDOS, MUNDOS_POR_ID } from '../src/contenido/mundos.js'
import { RETOS, cargarTodosLosRetos } from '../src/contenido/retos/index.js'

/**
 * Lo que el README dice del juego, comprobado contra el juego.
 *
 * El README es el documento que se queda viejo antes que ningún otro: nadie lo
 * ejecuta. Ya había pasado en cinco sitios a la vez -«los 114 retos», «los 103
 * retos con pistas», «los once jefes», «90 lecciones, 700.000 caracteres»- con
 * más de trescientos retos ya escritos, y es exactamente el mismo fallo que
 * tenían las insignias: el contenido creció y el texto se quedó donde estaba.
 *
 * Lo que se prueba aquí son **las frases concretas que afirman una cuenta**, y
 * la prueba exige que la frase siga existiendo: si alguien la reescribe, esto
 * falla y hay que venir a mirar. Es a propósito. Una prueba que se salta sola
 * cuando no encuentra el patrón no protege de nada, porque el día que importe no
 * lo encontrará.
 *
 * Los números **históricos** del README no se tocan ni se comprueban: «el
 * paquete pasó de 725 kB a 488» es lo que pasó entonces y sigue siendo verdad
 * aunque hoy pese otra cosa.
 */
const README = readFileSync(fileURLToPath(new URL('../README.md', import.meta.url)), 'utf8')

const APUNTES = readdirSync(fileURLToPath(new URL('../src/contenido/apuntes/', import.meta.url)))
  .filter((cada) => cada.endsWith('.js') && cada !== 'index.js')

/** Los apuntes de un camino, por el mundo del reto que llevan por nombre. */
function apuntesDe(itinerarioId) {
  return APUNTES.filter((fichero) => {
    const reto = RETOS.find((cada) => cada.id === fichero.replace(/\.js$/, ''))
    return MUNDOS_POR_ID[reto?.mundo]?.itinerario === itinerarioId
  }).length
}

/** Busca la frase y devuelve el número que afirma. */
function loQueDice(patron) {
  const encontrado = README.match(patron)
  expect(encontrado, `el README ya no dice ${patron}; si se reescribió, actualiza esta prueba`).toBeTruthy()
  return Number(encontrado[1].replace(/\./g, ''))
}

describe('el README no miente sobre las cuentas del juego', () => {
  it('los mundos y los retos del resumen de arriba', () => {
    expect(loQueDice(/Veintisiete mundos y ([\d.]+) retos/)).toBe(RETOS.length)
    expect(MUNDOS.length, 'ya no son veintisiete mundos: el README lo dice con letra').toBe(27)
  })

  it('los retos que recorre la prueba de procedencia de Armonía', () => {
    expect(loQueDice(/recorre los ([\d.]+) retos y comprueba/)).toBe(RETOS.length)
  })

  it('las soluciones que corre `npm test`', () => {
    expect(loQueDice(/las soluciones de los ([\d.]+) retos/)).toBe(RETOS.length)
  })

  it('los retos que tienen pistas, y los jefes que no', async () => {
    const cuerpos = await cargarTodosLosRetos()
    const conPistas = cuerpos.filter((reto) => (reto.pistas ?? []).length > 0).length
    expect(loQueDice(/recorre los ([\d.]+) retos con pistas/)).toBe(conPistas)

    // Un jefe por mundo, y ninguno con pistas: las dos mitades de la frase.
    const jefes = cuerpos.filter((reto) => reto.jefe)
    expect(jefes.length, 'un jefe por mundo').toBe(MUNDOS.length)
    for (const jefe of jefes) {
      expect((jefe.pistas ?? []).length, `${jefe.id} es un jefe y tiene pistas`).toBe(0)
    }
    expect(README).toContain('Los veintisiete jefes')
  })

  it('las lecciones de la segunda era y las de los otros tres caminos', () => {
    // Se comprueban las **cuentas** y no los caracteres. Un total de caracteres
    // cambia con cada apunte que se toca, así que fijarlo obliga a venir aquí
    // por cada coma añadida y no protege de nada: el número que dice algo es
    // cuántas lecciones hay y que haya una por reto. En el README los
    // caracteres van redondeados y dichos como lo que son, una aproximación.
    expect(loQueDice(/\*\*([\d.]+) lecciones\*\*,\n?cerca de/)).toBe(apuntesDe('era2'))

    const otros = ['era1', 'elantris', 'sel'].reduce((suma, cada) => suma + apuntesDe(cada), 0)
    expect(loQueDice(/tienen sus ([\d.]+) lecciones/)).toBe(otros)
    expect(loQueDice(/\*\*([\d.]+) lecciones\*\*, una por\n?reto/)).toBe(APUNTES.length)
  })

  it('y hay un apunte por reto, que es la promesa de todo lo anterior', () => {
    expect(APUNTES.length).toBe(RETOS.length)
  })
})
