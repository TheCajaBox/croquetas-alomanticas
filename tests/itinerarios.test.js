import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { ITINERARIOS, ITINERARIOS_POR_ID, ITINERARIO_POR_DEFECTO } from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import { LEMAS_POR_NARRADOR } from '../src/contenido/narrador/lineas.js'
import { SOMBREROS_POR_ID } from '../src/contenido/sombreros.js'

describe('los itinerarios', () => {
  it('cada mundo pertenece a un itinerario declarado', () => {
    // Un mundo sin itinerario no saldría en ninguna portada y sería invisible
    // sin que nada fallara, que es la peor manera de perder contenido.
    const huérfanos = MUNDOS.filter((mundo) => !ITINERARIOS_POR_ID[mundo.itinerario])
    expect(huérfanos.map((m) => `${m.id} → ${m.itinerario}`)).toEqual([])
  })

  it('entre todos los itinerarios están todos los mundos, sin repetir', () => {
    const repartidos = ITINERARIOS.flatMap((cada) => mundosDelItinerario(cada.id))
    expect(repartidos.length).toBe(MUNDOS.length)
    expect(new Set(repartidos.map((m) => m.id)).size).toBe(MUNDOS.length)
  })

  it('el itinerario por defecto existe y tiene mundos', () => {
    expect(ITINERARIOS_POR_ID[ITINERARIO_POR_DEFECTO]).toBeTruthy()
    expect(mundosDelItinerario(ITINERARIO_POR_DEFECTO).length).toBeGreaterThan(0)
  })

  it('cada uno se presenta entero: materia, lenguajes y de qué va', () => {
    for (const cada of ITINERARIOS) {
      expect(cada.nombre, cada.id).toBeTruthy()
      expect(cada.materia, cada.id).toBeTruthy()
      expect(cada.etiquetaLenguaje, cada.id).toBeTruthy()
      expect(cada.lenguajeEnFrase, cada.id).toBeTruthy()
      expect(cada.lenguajes?.length, cada.id).toBeGreaterThan(0)
      expect(cada.resumen, cada.id).toBeTruthy()
      expect(cada.promesa, cada.id).toBeTruthy()
      expect(cada.presentacion, cada.id).toBeTruthy()
    }
  })

  it('el reparto de cada uno dice quién hace qué', () => {
    // Un itinerario sin reparto suena a otro: es de donde sale quién narra,
    // quién escribe el temario, quién vende las pistas y quién contesta dudas.
    for (const cada of ITINERARIOS) {
      const reparto = cada.reparto ?? {}
      expect(reparto.narra, `${cada.id} sin narrador`).toBeTruthy()
      expect(reparto.pistas, `${cada.id} sin quien venda pistas`).toBeTruthy()
      expect(reparto.apuntes?.length, `${cada.id} sin quien escriba el temario`).toBeGreaterThan(0)
      expect(reparto.glosario, `${cada.id} sin glosario`).toBeTruthy()
      expect(reparto.ayuda, `${cada.id} sin quien conteste dudas`).toBeTruthy()
    }
  })

  it('todo el reparto tiene cara, aunque sea la de respaldo', () => {
    // `Avatar` solo conoce a quien esté en su lista; el que no esté saldría con
    // la cara de otro, que es peor que no salir.
    const avatar = readFileSync(new URL('../src/componentes/Avatar.vue', import.meta.url), 'utf8')
    const quienes = new Set([...avatar.matchAll(/^\s{2}([a-z]+): \{ nombre:/gm)].map((c) => c[1]))

    for (const cada of ITINERARIOS) {
      for (const [papel, quien] of Object.entries(cada.reparto)) {
        for (const nombre of [quien].flat()) {
          if (typeof nombre !== 'string') continue
          expect(quienes.has(nombre), `${cada.id}.${papel} = ${nombre}`).toBe(true)
        }
      }
    }
  })

  it('quien narra tiene lemas para su retrato', () => {
    // Sin lemas, el retrato de la portada queda con el pie vacío.
    for (const cada of ITINERARIOS) {
      const quien = cada.reparto.narra
      expect(LEMAS_POR_NARRADOR[quien]?.length, quien).toBeGreaterThan(0)
    }
  })

  it('la entrada y la portada tienen su sombrero cada una', () => {
    // Al mudar la lista de mundos de «/» a su itinerario, la entrada se quedó
    // sin sombrero y el juego perdía un escondite sin avisar.
    expect(SOMBREROS_POR_ID.entrada).toBeTruthy()
    expect(SOMBREROS_POR_ID.mundos).toBeTruthy()
  })

  it('todo itinerario con mundos tiene un entorno donde ejecutar su lenguaje', async () => {
    // El motor tiene que saber con qué correr el código. Se exige solo a los
    // que ya tienen mundos: uno anunciado y sin contenido todavía no se puede
    // jugar, y en cuanto le entre el primer mundo esta prueba pide su entorno.
    const { ENTORNOS } = await import('../src/motor/protocolo.js')
    const entornos = new Set(Object.values(ENTORNOS).map((entorno) => entorno.lenguaje ?? 'js'))

    for (const cada of ITINERARIOS) {
      if (mundosDelItinerario(cada.id).length === 0) continue
      for (const lenguaje of cada.lenguajes) {
        expect(entornos.has(lenguaje), `${cada.id} habla ${lenguaje}`).toBe(true)
      }
    }
  })
})
