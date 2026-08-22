import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { CAMPOS_DE_LA_FICHA } from '../scripts/plugin-fichas-de-retos.mjs'
import { RETOS, RETOS_POR_ID, cargarReto, cargarTodosLosRetos } from '../src/contenido/retos/index.js'

/**
 * El catálogo: la ficha de cada reto viaja en el arranque y el cuerpo se pide
 * al abrirlo.
 *
 * Las dos pruebas de aquí vigilan los dos fallos que ese reparto puede tener, y
 * los dos son **silenciosos**: nada se rompe, nada avisa, y el síntoma solo se
 * ve midiendo o jugando.
 */
const CARPETA = new URL('../src/contenido/retos/', import.meta.url)

describe('el catálogo de retos', () => {
  it('no se deja ningún reto por el camino', () => {
    // El plugin recorre la carpeta y el glob perezoso también. Si alguno de los
    // dos se quedara corto, faltarían retos sin que nada fallara: un mundo con
    // once retos en vez de doce se ve, pero solo si te fijas.
    const ficheros = []
    for (const mundo of readdirSync(CARPETA, { withFileTypes: true })) {
      if (!mundo.isDirectory()) continue
      for (const fichero of readdirSync(new URL(`${mundo.name}/`, CARPETA))) {
        if (fichero.endsWith('.js')) ficheros.push(`${mundo.name}/${fichero}`)
      }
    }

    expect(RETOS.length).toBe(ficheros.length)
    expect(new Set(RETOS.map((reto) => reto.id)).size).toBe(RETOS.length)
  })

  it('la ficha dice exactamente lo que dice el fichero del reto', async () => {
    // La ficha la genera un plugin importando los retos al compilar. Si emitiera
    // un valor viejo o se olvidara un campo, el juego se comportaría según la
    // ficha -candados, recompensas, requisitos- y no según el reto escrito.
    const enteros = await cargarTodosLosRetos()

    const desajustes = []
    for (const entero of enteros) {
      const ficha = RETOS_POR_ID[entero.id]
      if (!ficha) {
        desajustes.push(`${entero.id}: no está en el índice`)
        continue
      }
      for (const campo of CAMPOS_DE_LA_FICHA) {
        const enLaFicha = JSON.stringify(ficha[campo] ?? null)
        const enElReto = JSON.stringify(entero[campo] ?? null)
        if (enLaFicha !== enElReto) desajustes.push(`${entero.id}.${campo}: ${enLaFicha} ≠ ${enElReto}`)
      }
    }
    expect(desajustes).toEqual([])
  })

  it('la ficha lleva lo justo, y el cuerpo no viaja en ella', () => {
    // Si un campo gordo se colara en la ficha volvería al paquete principal, que
    // es justo lo que se ha quitado de ahí. Los más grandes, por nombre.
    for (const reto of RETOS) {
      for (const campo of ['enunciado', 'solucion', 'tests', 'pistas', 'inicial', 'opciones']) {
        expect(reto[campo], `${reto.id} trae «${campo}» en la ficha`).toBeUndefined()
      }
      expect(Object.keys(reto).every((campo) => CAMPOS_DE_LA_FICHA.includes(campo))).toBe(true)
    }
  })

  it('el cuerpo de cada reto se puede pedir y trae lo que falta', async () => {
    const uno = await cargarReto(RETOS[0].id)
    expect(uno.id).toBe(RETOS[0].id)
    expect(uno.enunciado?.length ?? 0).toBeGreaterThan(20)
    expect(await cargarReto('esto-no-existe')).toBeNull()
  })

  /**
   * La regla que sostiene todo el reparto.
   *
   * Los `import()` de los cuerpos viven solo en `retos/index.js`. Si otro módulo
   * importara un reto de forma estática, Rollup dejaría de poder separarlo y su
   * trozo volvería al paquete principal: no fallaría nada, no avisaría nadie, y
   * el arranque engordaría en silencio. Ya pasa con `apuntes/index.js` y sale
   * como un aviso al construir que es fácil no leer.
   */
  it('nadie importa un reto de forma estática', () => {
    const sospechosos = []
    const recorrer = (carpeta) => {
      for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
        const ruta = join(carpeta, entrada.name)
        if (entrada.isDirectory()) {
          recorrer(ruta)
          continue
        }
        if (!/\.(js|vue)$/.test(entrada.name)) continue
        const fuente = readFileSync(ruta, 'utf8')
        // Un reto es `retos/<mundo>/<fichero>.js`: dos tramos después de «retos».
        // `retos/comun.js`, `retos/tipos.js` y `retos/index.js` son otra cosa.
        for (const linea of fuente.split('\n')) {
          if (!/^\s*import\s/.test(linea)) continue
          if (/retos\/[\w-]+\/[\w-]+(\.js)?['"]/.test(linea)) sospechosos.push(`${ruta}: ${linea.trim()}`)
        }
      }
    }
    recorrer(fileURLToPath(new URL('../src/', import.meta.url)))
    expect(sospechosos).toEqual([])
  })
})
