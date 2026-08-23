import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  ITINERARIOS,
  ITINERARIO_POR_DEFECTO,
  SITIOS,
  itinerarioDelSitio,
  itinerarioTieneSitio,
} from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import { RETOS } from '../src/contenido/retos/index.js'
import { usarRumbo } from '../src/almacen/rumbo.js'

/**
 * Los sitios que no son mundos: la casa de los gatos, el refugio y la
 * sombrerera.
 *
 * Son de Elendel, y estaban en la barra de todas las pantallas de los cuatro
 * caminos. Jugando la primera era, con la ceniza cayendo sobre Luthadel, la
 * barra ofrecía ir a una casa con jardín a mil años de allí.
 *
 * Lo que **no** se separa, y es la mitad del asunto: las croquetas, los gatos
 * que tengas y sus bonos. Eso lo ganaste tú, no lo ganó un camino, y sigue
 * funcionando donde juegues. Lo que se queda en su sitio son los sitios.
 */
beforeEach(() => setActivePinia(createPinia()))

describe('los sitios de cada camino', () => {
  it('la segunda era tiene sus tres sitios y los demás caminos ninguno', () => {
    for (const sitio of ['colonia', 'refugio', 'sombrerera']) {
      expect(itinerarioTieneSitio('era2', sitio), sitio).toBe(true)
    }
    for (const itinerario of ITINERARIOS.filter((cada) => cada.id !== 'era2')) {
      expect(itinerario.sitios ?? [], itinerario.id).toEqual([])
    }
  })

  it('un camino que no existe no hereda los sitios de nadie', () => {
    // Caerse al itinerario por defecto es justo lo que hacía que la casa
    // apareciera en la primera era: preguntando por algo que no se sabe, la
    // respuesta era «los de la segunda era».
    expect(itinerarioTieneSitio('no-existe', 'colonia')).toBe(false)
    expect(itinerarioTieneSitio(undefined, 'colonia')).toBe(false)
    expect(itinerarioTieneSitio('era1', 'colonia')).toBe(false)
  })

  it('cada sitio vive en un solo camino y se sabe en cuál', () => {
    for (const sitio of SITIOS) {
      const cuantos = ITINERARIOS.filter((cada) => (cada.sitios ?? []).includes(sitio))
      expect(cuantos.length, sitio).toBe(1)
      expect(itinerarioDelSitio(sitio).id, sitio).toBe(cuantos[0].id)
    }
    expect(itinerarioDelSitio('no-existe')).toBeNull()
  })

  it('los tres sitios son los que hay, y todos tienen su pantalla', () => {
    expect([...SITIOS].sort()).toEqual(['colonia', 'refugio', 'sombrerera'])
    const vistas = readdirSync(fileURLToPath(new URL('../src/vistas/', import.meta.url)))
    for (const sitio of SITIOS) {
      const nombre = sitio === 'sombrerera' ? 'VistaSombrerera.vue' : `Vista${sitio[0].toUpperCase()}${sitio.slice(1)}.vue`
      expect(vistas, sitio).toContain(nombre)
    }
  })
})

describe('el rumbo: en qué camino estás', () => {
  it('sin haber pasado por ninguno, el de por defecto', () => {
    const rumbo = usarRumbo()
    expect(rumbo.itinerarioId).toBeNull()
    expect(rumbo.dondeEstoy).toBe(ITINERARIO_POR_DEFECTO)
    // Quien llega de nuevas y se va derecho al glosario tiene que ver la barra
    // entera, no una barra a medias.
    expect(rumbo.hay('colonia')).toBe(true)
  })

  it('la ruta de un mundo, de un reto y de un itinerario lo sitúan', () => {
    const rumbo = usarRumbo()
    const deEra1 = mundosDelItinerario('era1')[0]

    rumbo.situar({ mundoId: deEra1.id })
    expect(rumbo.dondeEstoy).toBe('era1')

    // Con era2 -que es el de por defecto- esta comprobación no comprueba nada:
    // pasaba igual cuando `itinerarioDeLaRuta` ni miraba el `itinerarioId` y
    // respondía siempre el de por defecto. Así que se sitúa en era2 desde su
    // portada partiendo de era1, y luego se vuelve.
    rumbo.situar({ itinerarioId: 'era2' })
    expect(rumbo.dondeEstoy).toBe('era2')
    rumbo.situar({ itinerarioId: 'era1' })
    expect(rumbo.dondeEstoy).toBe('era1')

    const retoDeEra1 = RETOS.find((reto) => reto.mundo === deEra1.id)
    rumbo.situar({ itinerarioId: 'era2' })
    rumbo.situar({ retoId: retoDeEra1.id })
    expect(rumbo.dondeEstoy).toBe('era1')
  })

  it('la portada de cada camino sitúa en él, que es donde se vio fallar', () => {
    const rumbo = usarRumbo()
    for (const itinerario of ITINERARIOS) {
      rumbo.situar({ itinerarioId: itinerario.id })
      expect(rumbo.dondeEstoy, itinerario.id).toBe(itinerario.id)
    }
  })

  it('las pantallas de en medio heredan el camino y no lo borran', () => {
    // Sin esto la casa desaparecía de la barra justo al entrar en ella: la ruta
    // `/colonia` no nombra ningún camino, así que el rumbo se habría quedado sin
    // saber dónde estaba.
    const rumbo = usarRumbo()
    rumbo.situar({ mundoId: mundosDelItinerario('era1')[0].id })
    for (const params of [{}, undefined, { mundoId: '' }]) {
      rumbo.situar(params)
      expect(rumbo.dondeEstoy).toBe('era1')
    }
  })

  it('en la primera era no hay ninguno de los tres sitios; en la segunda, los tres', () => {
    const rumbo = usarRumbo()

    rumbo.situar({ mundoId: mundosDelItinerario('era1')[0].id })
    for (const sitio of SITIOS) expect(rumbo.hay(sitio), sitio).toBe(false)

    rumbo.situar({ mundoId: mundosDelItinerario('era2')[0].id })
    for (const sitio of SITIOS) expect(rumbo.hay(sitio), sitio).toBe(true)
  })

  it('un mundo de cualquier camino sitúa en el suyo', () => {
    const rumbo = usarRumbo()
    for (const mundo of MUNDOS) {
      rumbo.situar({ mundoId: mundo.id })
      expect(rumbo.dondeEstoy, mundo.id).toBe(mundo.itinerario)
    }
  })
})

describe('ninguna pantalla ofrece un sitio sin preguntar si existe', () => {
  /**
   * El fallo que esto vigila no rompe nada: un enlace a `/colonia` desde una
   * pantalla de la primera era compila, se pinta, se pulsa, y el guardián del
   * enrutador te devuelve. Solo se ve jugando el otro camino y fijándose.
   *
   * Los sitios se enlazan entre ellos -de la casa al refugio y al revés-, y eso
   * está bien: si estás dentro, es que tu camino los tiene.
   */
  const DENTRO_DE_UN_SITIO = ['VistaColonia.vue', 'VistaRefugio.vue', 'VistaSombrerera.vue']

  it('toda pantalla que enlace a un sitio pregunta antes si existe', () => {
    // La regla es por fichero y no por línea a propósito: la portada enlaza a la
    // casa desde dentro de una sección ya condicionada, y exigir el `v-if`
    // también en cada enlace de dentro sería pedir ruido. Lo que se vigila es
    // que la pantalla **pregunte en algún momento**; una que enlace sin
    // preguntar nunca es la que vuelve a ofrecer la casa en la primera era.
    const sinPreguntar = []
    const carpetas = ['componentes', 'vistas'].map((c) =>
      fileURLToPath(new URL(`../src/${c}/`, import.meta.url)),
    )
    for (const carpeta of carpetas) {
      for (const fichero of readdirSync(carpeta)) {
        if (!fichero.endsWith('.vue') || DENTRO_DE_UN_SITIO.includes(fichero)) continue
        const fuente = readFileSync(join(carpeta, fichero), 'utf8')
        for (const sitio of SITIOS) {
          if (!fuente.includes(`to="/${sitio}"`) && !fuente.includes(`'/${sitio}'`)) continue
          const pregunta =
            fuente.includes(`hay('${sitio}')`) ||
            fuente.includes(`itinerarioTieneSitio`) ||
            fuente.includes(`dondeVivenLosGatos`)
          if (!pregunta) sinPreguntar.push(`${fichero} → /${sitio}`)
        }
      }
    }
    expect(
      sinPreguntar,
      'una pantalla que enlaza a un sitio de Elendel sin comprobar si el camino donde estás lo tiene',
    ).toEqual([])
  })

  it('el enrutador marca los tres sitios para que el guardián los reconozca', () => {
    // El guardián mira `meta.sitio`. Una ruta nueva sin marcar entraría desde
    // cualquier camino sin que nada fallara.
    const fuente = readFileSync(fileURLToPath(new URL('../src/router/index.js', import.meta.url)), 'utf8')
    for (const sitio of SITIOS) {
      expect(fuente, sitio).toContain(`meta: { sitio: '${sitio}' }`)
    }
    expect(fuente).toContain('enrutador.beforeEach')
  })
})
