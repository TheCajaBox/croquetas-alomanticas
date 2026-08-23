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
import { REPASOS_POR_MUNDO } from '../src/contenido/repasos/index.js'
import { usarNarrador } from '../src/almacen/narrador.js'
import {
  VOCES,
  cargarTodasLasVoces,
  cargarVoz,
  sacoDe,
  vozLista,
} from '../src/contenido/narrador/index.js'

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
  'VistaInicio.vue': 'steris',
  'PanelArmonia.vue': 'armonia',
  'PanelResultados.vue': 'armonia',
}

describe('quién habla lo dice el reparto', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await cargarTodasLasVoces()
  })

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

  it('ninguna ilustración es de alguien que no esté en el juego', () => {
    // Un avatar de alguien que no sale en ningún reparto son kilobytes que
    // viajan con la aplicación para no verse nunca. Vin todavía no aparece en
    // pantalla -firma los apuntes de la segunda parte de la primera era, que
    // aún no está escrita-, pero está en su reparto, así que cuenta.
    const fuente = readFileSync(
      fileURLToPath(new URL('../src/componentes/Avatar.vue', import.meta.url)),
      'utf8',
    )
    const linea = fuente.match(/const CARAS = \{([^}]*)\}/)
    expect(linea, 'no encuentro la lista de caras en Avatar.vue').toBeTruthy()
    const conCara = linea[1].split(',').map((n) => n.trim()).filter(Boolean)
    expect(conCara.length).toBeGreaterThan(8)

    const enAlgunReparto = new Set(
      ITINERARIOS.flatMap((cada) => Object.values(cada.reparto).flat()).filter(
        (quien) => typeof quien === 'string',
      ),
    )
    const huerfanas = conCara.filter((quien) => !existePersonaje(quien) || !enAlgunReparto.has(quien))
    expect(huerfanas, 'ilustraciones de gente que no está en ningún reparto').toEqual([])
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
    //
    // Y un mundo puede reclamar el suyo: el de refactor lo lleva TenSoon y el
    // final lo explica Vin. Cuando lo declara, gana el mundo; cuando no, la
    // parte. Lo que no puede pasar es que el panel anuncie a alguien distinto
    // de quien escribió el apunte, que es lo que pasaba con El kandra.
    for (const mundo of mundosDelItinerario('era1')) {
      const esperado = mundo.apunte ?? (mundo.parte === 'segunda' ? 'elend' : 'kelsier')
      expect(quienEscribeElApunte(mundo), mundo.id).toBe(esperado)
      if (mundo.apunte) expect(existePersonaje(mundo.apunte), mundo.id).toBe(true)
    }
    // Y en la segunda era es Wax en todos.
    for (const mundo of mundosDelItinerario('era2')) {
      expect(quienEscribeElApunte(mundo), mundo.id).toBe('wax')
    }
  })
})

/**
 * Las voces se piden cuando le toca hablar a alguien, no al arrancar.
 *
 * Vivían en un solo fichero de 57 kB que importaba el almacén del narrador, y
 * `main.js` monta ese almacén al arrancar: las quince voces viajaban en el
 * paquete inicial para que hablara una. Y el problema crecía con cada camino,
 * porque cada camino trae su reparto de cuatro o cinco.
 *
 * Los dos fallos de este reparto son silenciosos, como los del catálogo de
 * retos: que alguien se quede mudo porque su fichero no está donde el cargador
 * lo busca, y que alguien importe una voz de forma estática y la devuelva al
 * arranque sin que nada se queje.
 */
describe('el reparto de las voces del narrador', () => {
  const CARPETA_VOCES = fileURLToPath(new URL('../src/contenido/narrador/voces/', import.meta.url))

  it('el cargador encuentra a todos los que tienen fichero', () => {
    const enDisco = readdirSync(CARPETA_VOCES)
      .filter((f) => f.endsWith('.js'))
      .map((f) => f.replace(/\.js$/, ''))
      .sort()
    expect(VOCES).toEqual(enDisco)
  })

  it('cada voz trae su saco por defecto y con frases dentro', async () => {
    await cargarTodasLasVoces()
    for (const quien of VOCES) {
      const saco = sacoDe(quien)
      expect(saco, `${quien} no trae saco`).toBeTruthy()
      const eventos = Object.keys(saco)
      expect(eventos.length, `${quien} no dice nada`).toBeGreaterThan(0)
      for (const evento of eventos) {
        const frases = saco[evento]
        // Las pistas van por nivel -de menos a más- y son un objeto con una
        // lista por nivel; el resto de eventos, una lista de líneas.
        const listas = Array.isArray(frases) ? [frases] : Object.values(frases)
        for (const lista of listas) {
          expect(Array.isArray(lista), `${quien}.${evento} no es una lista`).toBe(true)
          expect(lista.length, `${quien}.${evento} está vacío`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('preguntar por alguien que no existe se contesta, y una sola vez', async () => {
    // Se apunta como «no hay nadie» y no se vuelve a pedir: quien pregunta tiene
    // que poder distinguir «todavía no ha llegado» de «no va a llegar», o se
    // queda reintentando para siempre.
    expect(vozLista('sellador')).toBe(false)
    expect(await cargarVoz('sellador')).toBeNull()
    expect(vozLista('sellador')).toBe(true)
    expect(sacoDe('sellador')).toBeNull()
  })

  it('el almacén del narrador no importa ninguna voz', () => {
    // Es el que arrastraba las quince: `main.js` lo monta al arrancar.
    const fuente = readFileSync(
      fileURLToPath(new URL('../src/almacen/narrador.js', import.meta.url)),
      'utf8',
    )
    const importa = fuente.split('\n').filter((linea) => /^\s*import\s/.test(linea))
    expect(importa.filter((linea) => /narrador\/voces\//.test(linea))).toEqual([])
  })

  it('nadie importa una voz de forma estática desde el arranque', () => {
    // Las dos excepciones son de Armonía: su panel y su cerebro se citan a sí
    // mismos y los dos son trozos aparte, así que su voz viaja con ellos y no
    // con el arranque. Cualquier otra devolvería su trozo al paquete principal
    // sin romper nada visible.
    const PERMITIDOS = new Set(['src/componentes/PanelArmonia.vue', 'src/motor/armonia/responder.js'])
    const raiz = fileURLToPath(new URL('../src/', import.meta.url))
    const sospechosos = []
    const recorrer = (carpeta) => {
      for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
        const ruta = join(carpeta, entrada.name)
        if (entrada.isDirectory()) {
          recorrer(ruta)
          continue
        }
        if (!/\.(js|vue)$/.test(entrada.name)) continue
        const relativa = `src/${ruta.slice(raiz.length)}`
        if (PERMITIDOS.has(relativa)) continue
        for (const linea of readFileSync(ruta, 'utf8').split('\n')) {
          if (!/^\s*import\s/.test(linea)) continue
          if (/narrador\/voces\//.test(linea)) sospechosos.push(`${relativa}: ${linea.trim()}`)
        }
      }
    }
    recorrer(raiz)
    expect(sospechosos).toEqual([])
  })
})
