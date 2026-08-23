import { readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { describe, expect, it } from 'vitest'

import { antesalaDe } from '../src/contenido/antesala.js'
import { glosarioDe } from '../src/contenido/glosario.js'
import { IMPREVISTOS } from '../src/contenido/imprevistos.js'
import { INSIGNIAS, porqueDe } from '../src/contenido/insignias.js'
import { ITINERARIOS, ITINERARIOS_POR_ID } from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import { PERSONAJES } from '../src/contenido/personajes.js'
import { RECORTES } from '../src/contenido/recortes.js'
import { REPASOS } from '../src/contenido/repasos/index.js'
import { cargarTodosLosRetos, retosDelMundo } from '../src/contenido/retos/index.js'

/**
 * Nadie sale en un camino que no es el suyo.
 *
 * Es el fallo que más veces ha aparecido en este proyecto y siempre de la misma
 * manera: alguien escribe «Wax» porque en la segunda era es Wax, y el día que
 * hay otro camino el juego nombra a alguien que no está allí. No revienta nada.
 * Solo suena a otro juego.
 *
 * Ya hay una prueba que caza los `quien="..."` de las plantillas
 * (`quien-habla.test.js`). Esta caza la otra mitad, que es más difícil de ver:
 * los nombres escritos **dentro del texto** del material compartido -el
 * glosario, los recortes, las insignias, la antesala, los imprevistos-, que se
 * lee igual desde los cuatro caminos.
 *
 * Nueve estaban colados: el recorte que te mandaba «al apunte de Wax», la
 * insignia «Sin preguntarle a Wayne», la antesala entera -que además explicaba
 * Vue a quien había elegido PHP- y cinco ejemplos del glosario que enseñaban
 * `['Wax', 'Marasi']` en un mundo de Luthadel.
 */
const RETOS = await cargarTodosLosRetos()

const APUNTES = {}
{
  const carpeta = new URL('../src/contenido/apuntes/', import.meta.url)
  for (const fichero of readdirSync(carpeta)) {
    if (!fichero.endsWith('.js') || fichero === 'index.js') continue
    APUNTES[fichero.replace(/\.js$/, '')] = (await import(new URL(fichero, carpeta).href)).default
  }
}

/** Quién es de cada camino. Alguien puede estar en dos: Armonía contesta en dos. */
const CAMINOS_DE = new Map()
for (const itinerario of ITINERARIOS) {
  for (const quien of Object.values(itinerario.reparto).flat()) {
    if (typeof quien !== 'string') continue
    CAMINOS_DE.set(quien, [...(CAMINOS_DE.get(quien) ?? []), itinerario.id])
  }
}

/** Los nombres que NO pueden salir en ese camino. */
function ajenosA(itinerarioId) {
  return Object.entries(PERSONAJES)
    .filter(([id]) => !(CAMINOS_DE.get(id) ?? []).includes(itinerarioId))
    .map(([id, quien]) => ({ id, nombre: quien.nombre }))
}

const busca = (texto, nombre) => new RegExp(`\\b${nombre}\\b`).test(texto)

/**
 * Todo lo que un camino le muestra al jugador, resuelto **como él lo ve**.
 *
 * Esto es lo que hace la prueba honrada: el glosario tiene ejemplos distintos
 * para cada lenguaje, así que mirar la entrada en crudo dice que «lista» nombra
 * a Wax y a Kelsier. Lo que hay que mirar es el ejemplo que le toca a cada uno.
 */
function loQueVe(itinerarioId) {
  const itinerario = ITINERARIOS_POR_ID[itinerarioId]
  const lenguaje = itinerario.lenguajes[0]
  const trozos = []

  const antesala = antesalaDe(itinerarioId)
  trozos.push(['antesala', [antesala.entradilla, antesala.cierre].join(' ')])
  for (const seccion of antesala.secciones) {
    trozos.push([`antesala/${seccion.titulo}`, `${seccion.titulo} ${seccion.texto}`])
  }

  for (const entrada of glosarioDe(lenguaje)) {
    trozos.push([`glosario/${entrada.id}`, `${entrada.definicion} ${entrada.ejemplo ?? ''}`])
  }

  for (const imprevisto of IMPREVISTOS.filter((cada) => cada.lenguaje === lenguaje)) {
    trozos.push([`imprevisto/${imprevisto.id}`, [imprevisto.titulo, ...imprevisto.causas].join(' ')])
  }

  // Los recortes y las insignias se ganan en cualquier camino y se leen en el
  // cajón, que es una página global: no pueden nombrar a nadie.
  for (const recorte of RECORTES) {
    trozos.push([`recorte/${recorte.id}`, [recorte.titular, recorte.entradilla, recorte.consejo].join(' ')])
  }
  for (const insignia of INSIGNIAS) {
    // Resuelta como la ve este camino: los huecos los rellena su reparto.
    trozos.push([`insignia/${insignia.id}`, `${insignia.nombre} ${porqueDe(insignia, itinerarioId)}`])
  }

  for (const mundo of mundosDelItinerario(itinerarioId)) {
    trozos.push([
      `mundo/${mundo.id}`,
      [mundo.nombre, mundo.lema, mundo.intro, mundo.despedida, mundo.resumen].filter(Boolean).join(' '),
    ])
    for (const ficha of retosDelMundo(mundo.id)) {
      const reto = RETOS.find((cada) => cada.id === ficha.id)
      trozos.push([
        `reto/${ficha.id}`,
        [
          reto.titulo,
          reto.enunciado,
          reto.explicacion,
          ...(reto.pistas ?? []).map((p) => p.texto ?? p),
          ...(reto.opciones ?? []).map((o) => `${o.texto ?? ''} ${o.porque ?? ''}`),
        ]
          .filter(Boolean)
          .join(' '),
      ])
      if (APUNTES[ficha.id]) trozos.push([`apunte/${ficha.id}`, APUNTES[ficha.id]])
    }
    const repaso = REPASOS.find((cada) => cada.mundo === mundo.id)
    if (repaso) trozos.push([`repaso/${mundo.id}`, JSON.stringify(repaso)])
  }
  return trozos
}

describe('nadie sale en un camino que no es el suyo', () => {
  for (const itinerario of ITINERARIOS.filter((cada) => mundosDelItinerario(cada.id).length > 0)) {
    it(`${itinerario.id}: solo habla y se menciona a su gente`, () => {
      const ajenos = ajenosA(itinerario.id)
      const colados = []
      for (const [donde, texto] of loQueVe(itinerario.id)) {
        for (const { id, nombre } of ajenos) {
          if (busca(texto, nombre)) {
            const suyos = CAMINOS_DE.get(id) ?? []
            colados.push(`${donde} → ${nombre}${suyos.length ? ` (es de ${suyos.join('/')})` : ' (de ningún reparto)'}`)
          }
        }
      }
      expect([...new Set(colados)], 'gente de otro camino nombrada dentro del texto').toEqual([])
    })
  }

  it('el material que se lee desde cualquier camino no nombra a nadie', () => {
    // Los recortes, las insignias y los trastos se ganan jugando cualquier
    // itinerario y se leen en el cajón, que no pertenece a ninguno. Ahí un
    // nombre propio es siempre un error, sea de quien sea.
    const conNombre = []
    const todos = Object.entries(PERSONAJES)
    const material = [
      ...RECORTES.map((cada) => [`recorte/${cada.id}`, [cada.titular, cada.entradilla, cada.consejo].join(' ')]),
      // Sin resolver los huecos: en crudo no puede haber un nombre escrito.
      ...INSIGNIAS.map((cada) => [`insignia/${cada.id}`, [cada.nombre, cada.porque].filter(Boolean).join(' ')]),
    ]
    for (const [donde, texto] of material) {
      for (const [, quien] of todos) if (busca(texto, quien.nombre)) conNombre.push(`${donde} → ${quien.nombre}`)
    }
    expect([...new Set(conNombre)]).toEqual([])
  })

  it('cada mundo pertenece a un solo camino, que es lo que hace posible comprobar el resto', () => {
    for (const mundo of MUNDOS) {
      expect(ITINERARIOS_POR_ID[mundo.itinerario], mundo.id).toBeTruthy()
    }
    const suma = ITINERARIOS.reduce((total, cada) => total + mundosDelItinerario(cada.id).length, 0)
    expect(suma).toBe(MUNDOS.length)
  })
})
