import { describe, expect, it } from 'vitest'

import {
  ITINERARIOS,
  ITINERARIOS_POR_ID,
  ITINERARIO_POR_DEFECTO,
  quienRepasa,
} from '../src/contenido/itinerarios.js'
import { existePersonaje, nombreDe } from '../src/contenido/personajes.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import { cargarApunte } from '../src/contenido/apuntes/index.js'
import { retosDelMundo } from '../src/contenido/retos/index.js'
import { seEscribe } from '../src/contenido/retos/tipos.js'
import { LEMAS_POR_NARRADOR } from '../src/contenido/narrador/lemas.js'
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

  it('todo el reparto está en el elenco', () => {
    // El elenco dice quién existe, cómo se llama y de qué color es. Quien no
    // esté saldría con la cara y el nombre de otro, que es peor que no salir.
    for (const cada of ITINERARIOS) {
      for (const [papel, quien] of Object.entries(cada.reparto)) {
        for (const nombre of [quien].flat()) {
          if (typeof nombre !== 'string') continue
          expect(existePersonaje(nombre), `${cada.id}.${papel} = ${nombre}`).toBe(true)
        }
      }
    }
  })

  it('cada papel del reparto lo hace alguien con nombre escribible', () => {
    // El nombre se pinta en pantalla -«Pistas de Fantasma»-, así que no puede
    // salir vacío ni caer en el de Wayne por descarte.
    for (const cada of ITINERARIOS) {
      const quien = cada.reparto.pistas
      expect(nombreDe(quien), `${cada.id} vende pistas`).toBeTruthy()
      if (quien !== 'wayne') expect(nombreDe(quien)).not.toBe(nombreDe('wayne'))
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

/**
 * El equilibrio de los itinerarios nuevos: más práctica y menos texto.
 *
 * Es una decisión de diseño, no una casualidad, y por eso se vigila: **doce
 * retos por mundo, la mitad como mucho de escribir código, y apuntes de la
 * mitad de largo** que los de la segunda era. Sin esta prueba, el siguiente
 * mundo se escribe con la costumbre antigua y nadie se entera hasta que alguien
 * se aburre jugando.
 *
 * ## El monotipo, que es la única excepción
 *
 * Un mundo de refactor es refactor de principio a fin: eso es lo que enseña. En
 * la segunda era ese mundo es «Cambio de forma» y en la primera es «El kandra»,
 * y los dos son doce retos de escribir sin remedio, porque cambiar de forma sin
 * escribir no se puede.
 *
 * La excepción va nombrada uno a uno y con su motivo, no como un porcentaje
 * relajado para todos: un mundo normal que llegue al 100% de escribir es un
 * error, y este es el único sitio donde se distingue.
 */
const ITINERARIOS_NUEVOS = ['era1', 'elantris', 'sel']
const RETOS_POR_MUNDO = 12
const TOPE_DE_APUNTE = 4500
const MONOTIPOS = { kandra: 'refactor de principio a fin: es lo que enseña' }

describe('quien recibe en un mundo tiene algo que decir', () => {
  it('todo anfitrión sabe presentarse', async () => {
    // Un mundo con anfitrión sin frases se abre en silencio: `decir` no
    // encuentra su saco y devuelve null. No falla nada, simplemente no habla
    // nadie, y eso es lo más difícil de notar. Le pasaba a Kelsier, que recibe
    // en el primer mundo de la primera era.
    const { createPinia, setActivePinia } = await import('pinia')
    const { usarNarrador } = await import('../src/almacen/narrador.js')
    const { cargarTodasLasVoces } = await import('../src/contenido/narrador/index.js')
    setActivePinia(createPinia())
    await cargarTodasLasVoces()
    const narrador = usarNarrador()

    const mudos = MUNDOS.filter(
      (mundo) => mundo.anfitrion && !narrador.frase(mundo.anfitrion, 'presentacion'),
    )
    expect(mudos.map((mundo) => `${mundo.id} → ${mundo.anfitrion}`)).toEqual([])
  })

  it('y quien interrumpe también, o su primera aparición sería un desconocido', async () => {
    const { createPinia, setActivePinia } = await import('pinia')
    const { usarNarrador } = await import('../src/almacen/narrador.js')
    const { cargarTodasLasVoces } = await import('../src/contenido/narrador/index.js')
    setActivePinia(createPinia())
    await cargarTodasLasVoces()
    const narrador = usarNarrador()

    for (const cada of ITINERARIOS) {
      if (!cada.reparto.interrumpe) continue
      expect(
        narrador.frase(cada.reparto.interrumpe, 'presentacion'),
        `${cada.reparto.interrumpe} interrumpe en ${cada.id} y no sabe presentarse`,
      ).toBeTruthy()
    }
  })
})

describe('quién pregunta en el repaso de cada mundo', () => {
  it('sale del repaso si lo dice, y del reparto si no', async () => {
    // Estaba resuelto en tres sitios y de dos maneras, así que la tarjeta del
    // mundo anunciaba a Marasi también donde pregunta otro. Ahora hay una regla.
    const { REPASOS_POR_MUNDO } = await import('../src/contenido/repasos/index.js')

    const mal = []
    for (const mundo of MUNDOS) {
      const repaso = REPASOS_POR_MUNDO[mundo.id]
      if (!repaso) continue
      const quien = quienRepasa(repaso, mundo)
      const esperado = repaso.quien ?? ITINERARIOS_POR_ID[mundo.itinerario].reparto.revisa
      if (quien !== esperado) mal.push(`${mundo.id}: ${quien} ≠ ${esperado}`)
      if (!existePersonaje(quien)) mal.push(`${mundo.id}: «${quien}» no está en el elenco`)
    }
    expect(mal).toEqual([])
  })

  it('en la primera era pregunta Brisa y en la segunda Marasi', async () => {
    const { REPASOS_POR_MUNDO } = await import('../src/contenido/repasos/index.js')
    const de = (mundoId) => quienRepasa(REPASOS_POR_MUNDO[mundoId], MUNDOS.find((m) => m.id === mundoId))

    expect(de('ceniza')).toBe('brisa')
    expect(de('tripulacion')).toBe('brisa')
    // Y los de la segunda era, que no lo declaran, salen del reparto.
    expect(de('primer-dia')).toBe('marasi')
    expect(de('es6')).toBe('marasi')
  })
})

describe('los itinerarios nuevos tienen más práctica y menos texto', () => {
  const mundosNuevos = ITINERARIOS_NUEVOS.flatMap((id) => mundosDelItinerario(id))

  it('hay mundos nuevos que vigilar', () => {
    expect(mundosNuevos.length).toBeGreaterThan(0)
  })

  for (const mundo of mundosNuevos) {
    it(`${mundo.id}: doce retos y como mucho la mitad de escribir`, () => {
      const retos = retosDelMundo(mundo.id)
      expect(retos.length, 'menos de doce retos: falta práctica').toBeGreaterThanOrEqual(RETOS_POR_MUNDO)

      if (MONOTIPOS[mundo.id]) return

      const deEscribir = retos.filter((reto) => seEscribe(reto.tipo))
      expect(
        deEscribir.length * 2,
        `${deEscribir.length} de ${retos.length} son de escribir: pasa de la mitad`,
      ).toBeLessThanOrEqual(retos.length)

      // Y que la variedad sea variedad de verdad: cuatro tipos distintos como
      // mínimo, o son doce retos iguales con otros datos.
      expect(new Set(retos.map((reto) => reto.tipo)).size, 'poca variedad de tipos').toBeGreaterThanOrEqual(4)
    })

    for (const reto of retosDelMundo(mundo.id)) {
      it(`${reto.id}: el apunte no pasa de ${TOPE_DE_APUNTE} caracteres`, async () => {
        const apunte = await cargarApunte(reto.id)
        expect(apunte, 'sin apunte').toBeTruthy()
        expect(apunte.length).toBeLessThanOrEqual(TOPE_DE_APUNTE)
      })
    }
  }
})

/**
 * Los cuatro caminos son independientes. Y no como intención: como invariante.
 *
 * Nadie tiene que terminar JavaScript para empezar SQL, ni al revés. Es lo que
 * hace que esto sean cuatro temarios y no un temario largo, y es exactamente el
 * tipo de cosa que se rompe sin querer: basta un `requiere` copiado de la
 * sección de al lado -están todos en el mismo fichero, uno debajo de otro- para
 * que un mundo de Elantris pida uno de la primera era y el camino entero se
 * quede cerrado sin que nada falle.
 */
describe('los cuatro caminos no se bloquean entre sí', () => {
  it('ningún `requiere` cruza de camino', () => {
    const suCamino = Object.fromEntries(MUNDOS.map((mundo) => [mundo.id, mundo.itinerario]))
    const cruces = []
    for (const mundo of MUNDOS) {
      const pide = Array.isArray(mundo.requiere) ? mundo.requiere : [mundo.requiere].filter(Boolean)
      for (const cual of pide) {
        if (suCamino[cual] !== mundo.itinerario) {
          cruces.push(`${mundo.itinerario}/${mundo.id} pide ${suCamino[cual] ?? '???'}/${cual}`)
        }
      }
    }
    expect(cruces).toEqual([])
  })

  it('cada camino tiene su puerta abierta desde una partida en blanco', () => {
    // Un camino cuyo primer mundo pida algo no se puede empezar nunca, y eso no
    // se ve mirando el mundo: se ve mirando el camino entero.
    for (const itinerario of ITINERARIOS) {
      const mundos = mundosDelItinerario(itinerario.id)
      if (mundos.length === 0) continue
      const abiertos = mundos.filter((mundo) => !mundo.requiere)
      expect(
        abiertos.length,
        `${itinerario.id} no tiene ni un mundo por el que empezar`,
      ).toBeGreaterThan(0)
    }
  })

  it('el candado de un camino se puede abrir entero sin salir de él', () => {
    // Se recorre el grafo desde los mundos sin `requiere` y se comprueba que se
    // llega a todos. Un mundo al que no se llega es contenido escrito y pagado
    // que nadie va a ver.
    for (const itinerario of ITINERARIOS) {
      const mundos = mundosDelItinerario(itinerario.id)
      if (mundos.length === 0) continue
      const alcanzados = new Set(mundos.filter((mundo) => !mundo.requiere).map((mundo) => mundo.id))
      let crecio = true
      while (crecio) {
        crecio = false
        for (const mundo of mundos) {
          if (alcanzados.has(mundo.id)) continue
          const pide = Array.isArray(mundo.requiere) ? mundo.requiere : [mundo.requiere]
          if (pide.every((cual) => alcanzados.has(cual))) {
            alcanzados.add(mundo.id)
            crecio = true
          }
        }
      }
      const sueltos = mundos.filter((mundo) => !alcanzados.has(mundo.id)).map((mundo) => mundo.id)
      expect(sueltos, `${itinerario.id}: mundos a los que no se llega`).toEqual([])
    }
  })

  it('el orden de los caminos es el del discurso, y el primero es el de siempre', () => {
    // La entrada los pinta en el orden de este array, así que el orden es una
    // decisión y conviene que esté escrita: primero los dos que más se usan,
    // después el de mirar el código como quien quiere entrar, y al final el de
    // entender lo que pasa por debajo.
    expect(ITINERARIOS.map((cada) => cada.id)).toEqual(['era2', 'elantris', 'sel', 'era1'])
    expect(ITINERARIO_POR_DEFECTO).toBe('era2')
  })

  it('cada camino dice para qué es, en una línea', () => {
    // `paraQue` lo pinta la entrada debajo del nombre. Sin él, cuatro tarjetas
    // con cuatro materias no dicen por dónde empezar.
    for (const cada of ITINERARIOS) {
      expect(cada.paraQue?.length, `${cada.id} no dice para qué es`).toBeGreaterThan(40)
      expect(cada.paraQue, `${cada.id}: paraQue con hueco sin rellenar`).not.toMatch(/\{\w+\}/)
    }
    const todos = ITINERARIOS.map((cada) => cada.paraQue)
    expect(new Set(todos).size, 'dos caminos dicen lo mismo').toBe(todos.length)
  })
})
