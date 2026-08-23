import { describe, expect, it } from 'vitest'

import { ITINERARIOS } from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import { RETOS, retosDelMundo } from '../src/contenido/retos/index.js'
import { itinerarioDeLaRuta, mundoDeLaRuta } from '../src/contenido/dondeEstas.js'
import { tituloDe } from '../src/router/index.js'

/**
 * «Que se vea claro en cada parte en qué mundo estás.»
 *
 * El juego tiene cuatro caminos, veinte mundos y doscientos cincuenta retos, y
 * desde dentro de un reto no había forma de saber en cuál estabas: el título
 * del reto, el editor, y nada más. Con cuatro lenguajes distintos eso no es un
 * adorno -que lo que escribas tenga sentido depende de dónde estés-, así que
 * las dos piezas que lo contestan se fijan aquí.
 *
 * La tira de arriba se comprueba de extremo a extremo, que es donde vive. Lo
 * que se prueba aquí es lo que se puede probar sin navegador: **el título de la
 * pestaña**, que es además la única parte del «dónde estoy» que sobrevive a
 * cerrar el navegador -queda en el marcador y en el historial-.
 */
describe('el título de la pestaña dice dónde estás', () => {
  it('en la entrada, solo el nombre del juego', () => {
    expect(tituloDe({ name: 'entrada', params: {} })).toBe('Gatos y Código')
  })

  it('en la portada de un camino, el camino', () => {
    for (const itinerario of ITINERARIOS) {
      const titulo = tituloDe({ name: 'itinerario', params: { itinerarioId: itinerario.id } })
      expect(titulo).toBe(`${itinerario.nombre} — Gatos y Código`)
    }
  })

  it('en un mundo, el mundo y su camino, y en ese orden', () => {
    for (const mundo of MUNDOS) {
      const titulo = tituloDe({ name: 'mundo', params: { mundoId: mundo.id } })
      const camino = itinerarioDeLaRuta({ mundoId: mundo.id })
      expect(titulo).toBe(`${mundo.nombre} · ${camino.nombre} — Gatos y Código`)
      // Lo concreto primero: es lo que queda cuando el navegador recorta la
      // pestaña. Se comprueba por delante y no comparando posiciones, porque
      // hay un mundo que se llama igual que su camino -«El alma del emperador»,
      // el final de Sel- y ahí las dos posiciones coinciden.
      expect(titulo.startsWith(mundo.nombre), mundo.id).toBe(true)
    }
  })

  it('en un reto, el reto y su mundo', () => {
    for (const reto of RETOS) {
      const titulo = tituloDe({ name: 'reto', params: { retoId: reto.id } })
      const mundo = mundoDeLaRuta({ retoId: reto.id })
      expect(titulo, reto.id).toBe(`${reto.titulo} · ${mundo.nombre} — Gatos y Código`)
    }
  })

  it('en un repaso se dice que es un repaso, y de qué mundo', () => {
    expect(tituloDe({ name: 'repaso', params: { mundoId: MUNDOS[0].id } })).toBe(
      `Repaso de ${MUNDOS[0].nombre} — Gatos y Código`,
    )
  })

  it('en las pantallas que no son de ningún mundo, su propio nombre', () => {
    // Y no el del último mundo por el que pasaste: en el glosario la respuesta
    // honrada es que no estás en ninguno.
    expect(tituloDe({ name: 'glosario', params: {} })).toBe('Glosario — Gatos y Código')
    expect(tituloDe({ name: 'ajustes', params: {} })).toBe('Ajustes — Gatos y Código')
    expect(tituloDe({ name: 'trastos', params: {} })).toBe('El cajón — Gatos y Código')
  })

  it('nunca se queda a medias ni deja un hueco sin rellenar', () => {
    const todas = [
      { name: 'entrada', params: {} },
      ...ITINERARIOS.map((cada) => ({ name: 'itinerario', params: { itinerarioId: cada.id } })),
      ...MUNDOS.map((cada) => ({ name: 'mundo', params: { mundoId: cada.id } })),
      ...RETOS.map((cada) => ({ name: 'reto', params: { retoId: cada.id } })),
    ]
    for (const ruta of todas) {
      const titulo = tituloDe(ruta)
      expect(titulo, JSON.stringify(ruta.params)).toContain('Gatos y Código')
      // `null` no entra en la lista: hay un reto que se llama «El null que se
      // cuela», y ese nombre es exactamente el acierto del reto.
      expect(titulo, 'un hueco sin rellenar').not.toMatch(/[{}]|undefined/)
    }
  })
})

/**
 * Lo que la tira necesita para poder contestar «mundo 3 de 6». Si algún mundo
 * se quedara fuera de su propio itinerario -un `itinerario` mal escrito-, la
 * tira diría «mundo 0 de 6» y nadie se enteraría hasta verlo en pantalla.
 */
describe('todo mundo sabe cuál es de cuántos', () => {
  it('cada mundo se encuentra dentro de su camino', () => {
    for (const mundo of MUNDOS) {
      const hermanos = mundosDelItinerario(mundo.itinerario)
      const cual = hermanos.findIndex((cada) => cada.id === mundo.id) + 1
      expect(cual, `${mundo.id} no está en su propio camino`).toBeGreaterThan(0)
      expect(cual).toBeLessThanOrEqual(hermanos.length)
    }
  })

  it('y cada reto se encuentra dentro de su mundo', () => {
    for (const reto of RETOS) {
      const hermanos = retosDelMundo(reto.mundo)
      const cual = hermanos.findIndex((cada) => cada.id === reto.id) + 1
      expect(cual, `${reto.id} no está en su propio mundo`).toBeGreaterThan(0)
    }
  })
})
