import { afterEach, describe, expect, it } from 'vitest'

import { baseDelSitio } from '../scripts/base-del-sitio.mjs'

/**
 * La ruta base del sitio publicado.
 *
 * Esta función es la que decide si la web carga o si el HTML llega y todos sus
 * ficheros dan 404: en GitHub Pages un proyecto se sirve desde
 * `/nombre-del-repositorio/`, así que la ruta depende de cómo se llame el
 * repositorio ese día. Ya se rompió una vez al renombrarlo, cuando estaba
 * escrita a mano, y hasta ahora no tenía ninguna prueba —lo más importante del
 * despliegue, sin vigilar—.
 */
const GUARDADAS = { BASE_JUEGO: process.env.BASE_JUEGO, GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY }

afterEach(() => {
  for (const [clave, valor] of Object.entries(GUARDADAS)) {
    if (valor === undefined) delete process.env[clave]
    else process.env[clave] = valor
  }
})

describe('la ruta base del sitio', () => {
  it('sale del nombre del repositorio, que es lo que Actions define al desplegar', () => {
    delete process.env.BASE_JUEGO
    process.env.GITHUB_REPOSITORY = 'TheCajaBox/croquetas-alomanticas'
    expect(baseDelSitio()).toBe('/croquetas-alomanticas/')
  })

  it('y sigue al repositorio cuando lo renombran, sin tocar nada', () => {
    delete process.env.BASE_JUEGO
    process.env.GITHUB_REPOSITORY = 'TheCajaBox/otro-nombre-cualquiera'
    expect(baseDelSitio()).toBe('/otro-nombre-cualquiera/')
  })

  it('BASE_JUEGO manda por encima de todo, para poder forzarla a mano', () => {
    process.env.GITHUB_REPOSITORY = 'TheCajaBox/croquetas-alomanticas'
    process.env.BASE_JUEGO = 'pruebas'
    expect(baseDelSitio()).toBe('/pruebas/')
  })

  it('con una barra sola sale la raíz, que es lo correcto con dominio propio', () => {
    process.env.BASE_JUEGO = '/'
    expect(baseDelSitio()).toBe('/')
  })

  it('las barras de sobra no se cuelan en la ruta', () => {
    process.env.BASE_JUEGO = '///un-nombre//'
    expect(baseDelSitio()).toBe('/un-nombre/')
  })

  it('sin nada puesto se deduce del remoto de git, para que en local también salga bien', () => {
    delete process.env.BASE_JUEGO
    delete process.env.GITHUB_REPOSITORY
    // Aquí hay un .git con su remoto, así que tiene que salir una ruta con
    // forma de ruta. Sin remoto legible la función devuelve la raíz, y eso
    // también es una respuesta válida: lo que no puede es reventar.
    expect(baseDelSitio()).toMatch(/^\/([\w.-]+\/)?$/)
  })
})
