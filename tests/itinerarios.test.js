import { readdirSync } from 'node:fs'

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

  it('cada uno se presenta entero: lenguaje, narrador y de qué va', () => {
    for (const cada of ITINERARIOS) {
      expect(cada.nombre, cada.id).toBeTruthy()
      expect(cada.lenguaje, cada.id).toBeTruthy()
      expect(cada.etiquetaLenguaje, cada.id).toBeTruthy()
      expect(cada.lenguajeEnFrase, cada.id).toBeTruthy()
      expect(cada.narrador, cada.id).toBeTruthy()
      expect(cada.resumen, cada.id).toBeTruthy()
      expect(cada.promesa, cada.id).toBeTruthy()
      expect(cada.presentacion, cada.id).toBeTruthy()
    }
  })

  it('quien narra tiene cara y tiene lemas para su retrato', () => {
    // Sin cara, `Avatar` caía en la de Wayne por descarte y Vin salía con
    // sombrero. Sin lemas, el retrato queda con un pie vacío.
    const avatar = readdirSync(new URL('../src/componentes/', import.meta.url))
    expect(avatar).toContain('Avatar.vue')
    for (const cada of ITINERARIOS) {
      expect(LEMAS_POR_NARRADOR[cada.narrador]?.length, cada.narrador).toBeGreaterThan(0)
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
      expect(entornos.has(cada.lenguaje), `${cada.id} habla ${cada.lenguaje}`).toBe(true)
    }
  })
})
