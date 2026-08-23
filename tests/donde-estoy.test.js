import { describe, expect, it } from 'vitest'

import { ITINERARIOS } from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import { RETOS, retosDelMundo } from '../src/contenido/retos/index.js'
import { itinerarioDeLaRuta, mundoDeLaRuta } from '../src/contenido/dondeEstas.js'
import { INSIGNIAS, porqueDe } from '../src/contenido/insignias.js'
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
 *
 * Y de paso lo que va con eso: **las cuentas que el juego dice de sí mismo**.
 * Decir «estás en el mundo 3 de 6» solo sirve si el 6 es verdad, y aquí ya se
 * había torcido en tres sitios a la vez.
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

/**
 * Los números escritos a mano se quedan viejos, y aquí ya pasó.
 *
 * Las insignias decían «los noventa retos» cuando había más de trescientos,
 * «los nueve finales» con veintisiete mundos y «los catorce sombreros» con
 * quince escondidos. Nadie mintió a propósito: el contenido creció y el texto
 * se quedó donde estaba. Pero la insignia que se gana por terminarlo todo
 * anunciaba una décima parte del juego, y eso es peor que no decir nada.
 *
 * Los números van ahora en huecos que rellenan los corpus. Lo que se prueba es
 * que **no vuelva a haber una cifra a mano**, que es la única forma de que esto
 * no se repita dentro de tres mundos.
 */
describe('las insignias no llevan números escritos a mano', () => {
  // Los números que son del propio umbral y no de ningún corpus: «diez retos
  // seguidos» es diez porque la insignia es de diez, y eso no caduca nunca.
  const DEL_UMBRAL = /^(uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte|treinta|cuarenta y cinco)$/i

  // Las formas compuestas van delante: una alternativa se prueba en orden, y
  // con «cuarenta» primero, «cuarenta y cinco» salía partido en dos y el
  // «cuarenta» suelto no estaba en la lista del umbral.
  const NUMEROS_EN_LETRA =
    /\b((?:veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa) y (?:uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)|uno|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|once|doce|trece|catorce|quince|dieciséis|diecisiete|dieciocho|diecinueve|veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien|ciento|doscientos|trescientos)\b/gi

  it('ni en el nombre ni en el porqué queda una cifra que no sea del umbral', () => {
    for (const insignia of INSIGNIAS) {
      // El `porque` **sin rellenar**: lo que se busca es la cifra escrita a
      // mano, y los huecos ya rellenos traen cifras legítimas.
      const crudo = `${insignia.nombre} · ${insignia.porque}`
      for (const palabra of crudo.match(NUMEROS_EN_LETRA) ?? []) {
        expect(
          DEL_UMBRAL.test(palabra),
          `${insignia.id} dice «${palabra}» a mano: si es una cuenta del juego, va en un hueco`,
        ).toBe(true)
      }
      expect(crudo, `${insignia.id} lleva dígitos a mano`).not.toMatch(/\d/)
    }
  })

  it('y los huecos de cuenta traen el número de verdad', () => {
    const cuentas = {
      retos: RETOS.length,
      mundos: MUNDOS.length,
    }
    for (const insignia of INSIGNIAS) {
      for (const [hueco, cuantos] of Object.entries(cuentas)) {
        if (!insignia.porque.includes(`{${hueco}}`)) continue
        for (const itinerario of ITINERARIOS) {
          expect(porqueDe(insignia, itinerario.id)).toContain(String(cuantos))
        }
      }
    }
  })

  it('no queda ningún hueco sin rellenar en ningún camino', () => {
    for (const insignia of INSIGNIAS) {
      for (const itinerario of ITINERARIOS) {
        expect(porqueDe(insignia, itinerario.id), `${insignia.id} en ${itinerario.id}`).not.toMatch(
          /[{}]/,
        )
      }
    }
  })
})

/**
 * Cuando un mundo dice cuántos retos tiene, tiene que ser verdad.
 *
 * Es la misma clase de errata que tenían las insignias, y en la presentación de
 * un mundo se lee **antes** de empezarlo: prometer doce y servir nueve es lo
 * primero que hace desconfiar de todo lo demás.
 */
describe('lo que un mundo cuenta de sí mismo cuadra', () => {
  const EN_LETRA = {
    siete: 7, ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, trece: 13,
    catorce: 14, quince: 15, dieciséis: 16, diecisiete: 17, dieciocho: 18,
    diecinueve: 19, veinte: 20, veintiuno: 21, veintidós: 22, veintitrés: 23,
    veinticuatro: 24,
  }

  it('cada «N retos» de una presentación es el número de retos que hay', () => {
    for (const mundo of MUNDOS) {
      const prosa = [mundo.resumen, mundo.presentacion, mundo.despedida].filter(Boolean).join(' ')
      const cuantos = retosDelMundo(mundo.id).length
      const patron = new RegExp(`(\\d+|${Object.keys(EN_LETRA).join('|')}) retos`, 'gi')
      for (const [, dicho] of prosa.matchAll(patron)) {
        const numero = EN_LETRA[dicho.toLowerCase()] ?? Number(dicho)
        expect(numero, `${mundo.id} promete ${dicho} retos y tiene ${cuantos}`).toBe(cuantos)
      }
    }
  })
})
