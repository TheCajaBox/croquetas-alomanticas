import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  ITINERARIOS,
  quienEscribeElApunte,
  quienRepasa,
  repartoDelMundo,
} from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import { existePersonaje } from '../src/contenido/personajes.js'
import { REPASOS_POR_MUNDO } from '../src/contenido/repasos.js'
import { usarNarrador } from '../src/almacen/narrador.js'

/**
 * Quién habla en cada sitio sale del **reparto del itinerario**, no de la
 * plantilla.
 *
 * Este fallo ha aparecido cinco veces y siempre igual: alguien escribe
 * `quien="marasi"` porque en la segunda era es Marasi, y el día que hay otro
 * camino el panel sigue anunciando a alguien que no está allí. No falla nada, no
 * avisa nadie, y solo se ve jugando el itinerario nuevo y fijándose.
 *
 * Van cazados: la tarjeta del repaso, la vista del repaso, el retrato de la
 * portada, el lema de la cabecera, el rótulo del bocadillo, el apunte, el
 * glosario, los imprevistos, el informe de código y la celebración de cerrar un
 * mundo.
 */
const CARPETAS = ['componentes', 'vistas'].map((c) =>
  fileURLToPath(new URL(`../src/${c}/`, import.meta.url)),
)

/**
 * Los sitios donde un personaje **sí** va escrito a mano, y por qué.
 *
 * No son descuidos: son partes del juego que no pertenecen a ningún camino, así
 * que no hay reparto al que preguntar. Si añades uno, justifícalo aquí.
 */
const A_PROPOSITO = {
  'VistaAntesala.vue': 'steris',
  'VistaEntrada.vue': 'steris',
  'VistaGlosario.vue': 'steris',
  'VistaInicio.vue': 'steris',
  'PanelArmonia.vue': 'armonia',
  'PanelResultados.vue': 'armonia',
}

describe('quién habla lo dice el reparto', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('ninguna plantilla nombra a un personaje que debería salir del reparto', () => {
    const colados = []
    for (const carpeta of CARPETAS) {
      for (const fichero of readdirSync(carpeta)) {
        if (!fichero.endsWith('.vue')) continue
        const fuente = readFileSync(join(carpeta, fichero), 'utf8')
        for (const [, quien] of fuente.matchAll(/\squien="([a-z]+)"/g)) {
          if (A_PROPOSITO[fichero] === quien) continue
          colados.push(`${fichero}: quien="${quien}"`)
        }
      }
    }
    expect(
      colados,
      'un personaje escrito a mano donde tendría que preguntarlo al reparto; si es a propósito, apúntalo en A_PROPOSITO con su motivo',
    ).toEqual([])
  })

  it('cada papel del reparto lo hace alguien del elenco, en los cuatro caminos', () => {
    const fantasmas = []
    for (const cada of ITINERARIOS) {
      for (const [papel, quien] of Object.entries(cada.reparto)) {
        for (const uno of [quien].flat()) {
          if (typeof uno !== 'string') continue
          if (!existePersonaje(uno)) fantasmas.push(`${cada.id}.${papel} → ${uno}`)
        }
      }
    }
    expect(fantasmas).toEqual([])
  })

  it('en cada mundo, los cinco papeles que se pintan resuelven a alguien', () => {
    const narrador = usarNarrador()
    const sinResolver = []

    for (const mundo of MUNDOS) {
      const reparto = repartoDelMundo(mundo)
      const papeles = {
        narra: reparto.narra,
        glosario: reparto.glosario,
        revisa: reparto.revisa,
        pistas: reparto.pistas,
        apunte: quienEscribeElApunte(mundo),
        repasa: REPASOS_POR_MUNDO[mundo.id] ? quienRepasa(REPASOS_POR_MUNDO[mundo.id], mundo) : 'wayne',
      }
      for (const [papel, quien] of Object.entries(papeles)) {
        if (!quien || !existePersonaje(quien)) sinResolver.push(`${mundo.id}.${papel} → ${quien}`)
      }
      // Y quien narra tiene que tener algo que decir, o el mundo se abre callado.
      if (!narrador.frase(papeles.narra, 'entrarAlMundo')) {
        sinResolver.push(`${mundo.id}: ${papeles.narra} narra y no tiene frases`)
      }
    }
    expect(sinResolver).toEqual([])
  })

  it('los apuntes de la primera era los firma quien le toca a su parte', () => {
    // Kelsier explica la primera mitad y no llega al final; la segunda la
    // explican Elend y Vin. Que el temario cambie de manos es la historia que
    // se cuenta por debajo, así que conviene que no se pierda por un descuido.
    for (const mundo of mundosDelItinerario('era1')) {
      const esperado = mundo.parte === 'segunda' ? 'elend' : 'kelsier'
      expect(quienEscribeElApunte(mundo), mundo.id).toBe(esperado)
    }
    // Y en la segunda era es Wax en todos.
    for (const mundo of mundosDelItinerario('era2')) {
      expect(quienEscribeElApunte(mundo), mundo.id).toBe('wax')
    }
  })
})
