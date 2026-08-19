import { readFileSync, readdirSync } from 'node:fs'

import { GATOS } from '../src/contenido/gatos.js'
import { MUNDOS } from '../src/contenido/mundos.js'
import { retosDelMundo } from '../src/contenido/retos/index.js'
import { SOMBREROS, SOMBREROS_POR_ID } from '../src/contenido/sombreros.js'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CUIDADOS, DESGASTE_MAXIMO, FELICIDAD_PARA_BONUS } from '../src/contenido/gatos.js'
import { RECORTES } from '../src/contenido/recortes.js'
import { CROQUETAS_POR_SOMBRERO, SOMBREROS } from '../src/contenido/sombreros.js'
import { TRASTOS } from '../src/contenido/trastos.js'
import { CROQUETAS_INICIALES, usarEconomia } from '../src/almacen/economia.js'
import { usarGatos } from '../src/almacen/gatos.js'
import { usarNarrador } from '../src/almacen/narrador.js'
import { usarProgreso } from '../src/almacen/progreso.js'
import { usarRecortes } from '../src/almacen/recortes.js'
import { usarSombreros } from '../src/almacen/sombreros.js'

beforeEach(() => setActivePinia(createPinia()))
afterEach(() => vi.useRealTimers())

describe('economía', () => {
  it('no deja el saldo en negativo', () => {
    const economia = usarEconomia()
    expect(economia.gastar(CROQUETAS_INICIALES + 1, 'una pista carísima')).toBe(false)
    expect(economia.croquetas).toBe(CROQUETAS_INICIALES)
    expect(economia.gastadasEnTotal).toBe(0)
  })

  it('cobra cuando sí llega', () => {
    const economia = usarEconomia()
    expect(economia.gastar(5, 'pista')).toBe(true)
    expect(economia.croquetas).toBe(CROQUETAS_INICIALES - 5)
    expect(economia.gastadasEnTotal).toBe(5)
  })

  it('ingresa y lleva la cuenta de lo ganado', () => {
    const economia = usarEconomia()
    economia.ingresar(12, 'reto')
    expect(economia.croquetas).toBe(CROQUETAS_INICIALES + 12)
    expect(economia.ganadasEnTotal).toBe(12)
  })

  it('no repite trasto mientras le queden sin colocar', () => {
    const economia = usarEconomia()
    for (let i = 0; i < TRASTOS.length; i += 1) economia.recibirTrasto()
    expect(new Set(economia.trastos).size).toBe(TRASTOS.length)
  })

  it('no guarda un histórico infinito de movimientos', () => {
    const economia = usarEconomia()
    for (let i = 0; i < 60; i += 1) economia.ingresar(1, 'algo')
    expect(economia.movimientos.length).toBeLessThanOrEqual(40)
  })
})

describe('desgaste de los gatos', () => {
  it('baja según el tiempo real que ha pasado', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'))

    const gatos = usarGatos()
    gatos.adoptar('acero')
    expect(gatos.estado('acero').comida).toBe(100)

    vi.setSystemTime(new Date('2026-01-01T15:00:00Z')) // cinco horas después
    gatos.aplicarDesgaste()

    expect(gatos.estado('acero').comida).toBe(80) // 5 h x 4 por hora
    expect(gatos.estado('acero').felicidad).toBe(85)
  })

  it('volver después de un mes deja a los gatos tristes, no destrozados', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'))

    const gatos = usarGatos()
    gatos.adoptar('acero')

    vi.setSystemTime(new Date('2026-02-01T10:00:00Z'))
    gatos.aplicarDesgaste()

    expect(gatos.estado('acero').comida).toBe(100 - DESGASTE_MAXIMO)
    expect(gatos.estado('acero').comida).toBeGreaterThan(0)
  })

  it('un gato triste no da su beneficio, y cuidarlo lo devuelve', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'))

    const gatos = usarGatos()
    gatos.adoptar('acero')
    expect(gatos.tieneBonus('croquetasExtra')).toBe(true)

    vi.setSystemTime(new Date('2026-01-02T10:00:00Z'))
    gatos.aplicarDesgaste()
    expect(gatos.estado('acero').felicidad).toBeLessThan(FELICIDAD_PARA_BONUS)
    expect(gatos.tieneBonus('croquetasExtra')).toBe(false)

    gatos.cuidar('acero', 'jugar')
    expect(gatos.tieneBonus('croquetasExtra')).toBe(true)
  })

  it('cuidar cuesta croquetas y respeta la espera', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'))

    const gatos = usarGatos()
    const economia = usarEconomia()
    gatos.adoptar('acero')
    gatos.estado('acero').comida = 10

    expect(gatos.cuidar('acero', 'alimentar').ok).toBe(true)
    expect(economia.croquetas).toBe(CROQUETAS_INICIALES - CUIDADOS.alimentar.coste)

    const segundoIntento = gatos.cuidar('acero', 'alimentar')
    expect(segundoIntento.ok).toBe(false)
    expect(segundoIntento.motivo).toMatch(/min/)
  })

  it('los indicadores no pasan de 100 por mucho que le des de comer', () => {
    const gatos = usarGatos()
    gatos.adoptar('acero')
    gatos.estado('acero').comida = 90
    gatos.cuidar('acero', 'alimentar')
    expect(gatos.estado('acero').comida).toBe(100)
  })
})

describe('desbloqueo de gatos', () => {
  it('Acero aparece en el refugio al superar el primer reto', () => {
    const gatos = usarGatos()
    const progreso = usarProgreso()

    expect(gatos.enElRefugio.map((g) => g.id)).not.toContain('acero')
    progreso.registrarVictoria('es6-01-const-let')
    expect(gatos.enElRefugio.map((g) => g.id)).toContain('acero')
  })

  it('Aluminio solo se fía de quien ya se ha dejado 100 croquetas en pistas', () => {
    const gatos = usarGatos()
    const economia = usarEconomia()

    expect(gatos.porVenir.map((g) => g.id)).toContain('aluminio')
    economia.ingresar(200, 'trampa de prueba')
    economia.gastar(100, 'pistas')
    expect(gatos.enElRefugio.map((g) => g.id)).toContain('aluminio')
  })
})

describe('progreso', () => {
  it('la racha se rompe al pedir una pista', () => {
    const progreso = usarProgreso()

    progreso.registrarVictoria('es6-01-const-let')
    expect(progreso.rachaSinPistas).toBe(1)

    progreso.registrarPista('es6-02-flechas', 0)
    progreso.registrarVictoria('es6-02-flechas')
    expect(progreso.rachaSinPistas).toBe(0)
  })

  it('con el aguante de Peltre, una sola pista no la rompe', () => {
    const progreso = usarProgreso()

    progreso.registrarVictoria('es6-01-const-let')
    progreso.registrarPista('es6-02-flechas', 0)
    progreso.registrarVictoria('es6-02-flechas', { rachaResistente: true })
    expect(progreso.rachaSinPistas).toBe(2)

    // Dos pistas ya son dos pistas.
    progreso.registrarPista('es6-03-desestructurar', 0)
    progreso.registrarPista('es6-03-desestructurar', 1)
    progreso.registrarVictoria('es6-03-desestructurar', { rachaResistente: true })
    expect(progreso.rachaSinPistas).toBe(0)
  })

  it('rehacer un reto ya superado no vuelve a subir la racha', () => {
    const progreso = usarProgreso()
    progreso.registrarVictoria('es6-01-const-let')
    progreso.registrarVictoria('es6-01-const-let')
    expect(progreso.rachaSinPistas).toBe(1)
  })

  describe('qué retos están abiertos', () => {
    it('de cada mundo empieza abierto el primero y solo el primero', () => {
      const progreso = usarProgreso()

      for (const mundo of MUNDOS) {
        const retos = retosDelMundo(mundo.id)
        const abiertos = retos.filter((reto) => progreso.retoDisponible(reto.id))
        // Los mundos que aún piden otro mundo no tienen ninguno abierto.
        const esperados = progreso.mundoDisponible(mundo.id) ? [retos[0].id] : []
        expect(abiertos.map((r) => r.id), mundo.id).toEqual(esperados)
      }
    })

    it('superar uno abre el siguiente, y solo el siguiente', () => {
      const progreso = usarProgreso()
      const [primero, segundo, tercero] = retosDelMundo('primer-dia')

      progreso.registrarVictoria(primero.id)
      expect(progreso.retoDisponible(segundo.id)).toBe(true)
      expect(progreso.retoDisponible(tercero.id)).toBe(false)
    })

    it('el mundo cerrado no se abre por haber superado retos de otro', () => {
      // Aquí es donde se colaba: se llegaba a cualquier reto por su dirección
      // -y desde las citas de Armonía- sin haber hecho nada de lo anterior.
      const progreso = usarProgreso()
      const cerrado = MUNDOS.find((m) => m.requiere)
      const primero = retosDelMundo(cerrado.id)[0]

      expect(progreso.mundoDisponible(cerrado.id)).toBe(false)
      expect(progreso.retoDisponible(primero.id)).toBe(false)
    })

    it('un reto que no existe nunca está disponible', () => {
      expect(usarProgreso().retoDisponible('esto-no-existe')).toBe(false)
    })
  })
})

describe('narrador', () => {
  it('no repite frase mientras le queden sin decir', () => {
    const narrador = usarNarrador()
    const dichas = new Set()

    for (let i = 0; i < 4; i += 1) {
      const texto = narrador.decir('testFallado')
      expect(dichas.has(texto)).toBe(false)
      dichas.add(texto)
    }
  })

  it('callado solo suelta lo que hace falta saber', () => {
    const narrador = usarNarrador()
    narrador.verborrea = 'callado'

    expect(narrador.decir('retoSuperado')).toBeNull()
    expect(narrador.decir('errorDeSintaxis', { linea: 3 })).not.toBeNull()
  })

  it('rellena las frases que llevan datos', () => {
    const narrador = usarNarrador()
    const texto = narrador.decir('gatoAdoptado', { gato: 'Bendaloy' }, { forzar: true })
    expect(texto).toContain('Bendaloy')
  })
})

describe('sombreros escondidos', () => {
  it('encontrar uno lo apunta y Wayne lo paga', () => {
    const sombreros = usarSombreros()
    const economia = usarEconomia()

    expect(sombreros.tiene('cabecera')).toBe(false)
    const hallado = sombreros.encontrar('cabecera')

    expect(hallado.nombre).toBeTruthy()
    expect(sombreros.tiene('cabecera')).toBe(true)
    expect(economia.croquetas).toBe(CROQUETAS_INICIALES + CROQUETAS_POR_SOMBRERO)
  })

  it('el mismo sombrero no se cobra dos veces', () => {
    const sombreros = usarSombreros()
    const economia = usarEconomia()

    sombreros.encontrar('cabecera')
    const saldo = economia.croquetas
    expect(sombreros.encontrar('cabecera')).toBeNull()
    expect(economia.croquetas).toBe(saldo)
    expect(sombreros.cuantos).toBe(1)
  })

  it('un sombrero que no existe no cuela', () => {
    const sombreros = usarSombreros()
    expect(sombreros.encontrar('inventado')).toBeNull()
    expect(sombreros.cuantos).toBe(0)
  })

  it('la lista enseña la pista de los que faltan y el sitio de los hallados', () => {
    const sombreros = usarSombreros()
    sombreros.encontrar('trastos')

    const hallado = sombreros.lista.find((s) => s.id === 'trastos')
    const pendiente = sombreros.lista.find((s) => s.id === 'colonia')

    expect(hallado.encontrado).toBe(true)
    expect(hallado.donde).toBeTruthy()
    expect(pendiente.encontrado).toBe(false)
    expect(pendiente.pista).toBeTruthy()
  })

  it('al juntarlos todos, Wayne se despide de ellos', () => {
    const sombreros = usarSombreros()
    const narrador = usarNarrador()

    for (const sombrero of SOMBREROS) sombreros.encontrar(sombrero.id)

    expect(sombreros.estanTodos).toBe(true)
    expect(narrador.mensaje.evento).toBe('todosLosSombreros')
  })

  it('cada sombrero tiene su sitio, su pista y su frase', () => {
    for (const sombrero of SOMBREROS) {
      expect(sombrero.nombre, sombrero.id).toBeTruthy()
      expect(sombrero.pista, sombrero.id).toBeTruthy()
      expect(sombrero.donde, sombrero.id).toBeTruthy()
      expect(sombrero.dice, sombrero.id).toBeTruthy()
    }
  })
})

describe('recortes secretos', () => {
  it('se desbloquean una sola vez', () => {
    const recortes = usarRecortes()

    expect(recortes.desbloquear('primer-fallo')).toBeTruthy()
    expect(recortes.desbloquear('primer-fallo')).toBeNull()
    expect(recortes.cuantos).toBe(1)
  })

  it('uno inventado no cuela', () => {
    const recortes = usarRecortes()
    expect(recortes.desbloquear('exclusiva-falsa')).toBeNull()
    expect(recortes.cuantos).toBe(0)
  })

  it('dar de comer a un gato al límite desbloquea el suyo', () => {
    const gatos = usarGatos()
    const recortes = usarRecortes()
    usarEconomia().ingresar(50, 'para la prueba')

    gatos.adoptar('acero')
    gatos.estado('acero').comida = 10
    gatos.cuidar('acero', 'alimentar')

    expect(recortes.tiene('gato-al-limite')).toBe(true)
  })

  it('un gato bien alimentado no lo desbloquea', () => {
    const gatos = usarGatos()
    const recortes = usarRecortes()

    gatos.adoptar('acero')
    gatos.estado('acero').comida = 80
    gatos.cuidar('acero', 'alimentar')

    expect(recortes.tiene('gato-al-limite')).toBe(false)
  })

  it('el sexto sombrero trae portada', () => {
    const sombreros = usarSombreros()
    const recortes = usarRecortes()

    for (const sombrero of SOMBREROS.slice(0, 5)) sombreros.encontrar(sombrero.id)
    expect(recortes.tiene('seis-sombreros')).toBe(false)

    sombreros.encontrar(SOMBREROS[5].id)
    expect(recortes.tiene('seis-sombreros')).toBe(true)
  })

  it('cada recorte trae titular, entradilla y consejo', () => {
    for (const recorte of RECORTES) {
      expect(recorte.titular, recorte.id).toBeTruthy()
      expect(recorte.entradilla, recorte.id).toBeTruthy()
      expect(recorte.consejo, recorte.id).toBeTruthy()
    }
  })
})

/**
 * Los sombreros colocados en la interfaz y los declarados tienen que ser los
 * mismos. Había dos -el del glosario y el de la antesala- puestos en su vista y
 * sin declarar: `encontrar` salía por su guarda de tipo desconocido, así que se
 * podían pulsar para siempre, no pagaban nada y no contaban para el total.
 */
describe('los sombreros escondidos existen todos', () => {
  const colocados = new Set()
  for (const carpeta of ['', 'vistas/', 'componentes/']) {
    const dir = new URL(`../src/${carpeta}`, import.meta.url)
    for (const archivo of readdirSync(dir).filter((f) => f.endsWith('.vue'))) {
      const fuente = readFileSync(new URL(archivo, dir), 'utf8')
      for (const [, id] of fuente.matchAll(/<SombreroEscondido\s+id="([\w-]+)"/g)) colocados.add(id)
    }
  }

  it('hay sombreros colocados que comprobar', () => {
    expect(colocados.size).toBeGreaterThan(5)
  })

  it('cada sombrero colocado está declarado', () => {
    const sinDeclarar = [...colocados].filter((id) => !SOMBREROS_POR_ID[id])
    expect(sinDeclarar).toEqual([])
  })

  it('cada sombrero declarado está colocado en algún sitio', () => {
    const sinColocar = SOMBREROS.map((s) => s.id).filter((id) => !colocados.has(id))
    expect(sinColocar).toEqual([])
  })
})

/**
 * Los gatos son la recompensa de largo recorrido, y estaban todos ganados al
 * acabar el tercer mundo: los 29 retos siguientes -más de la mitad del juego-
 * repartían dos, y El taller y Cambio de forma, ninguno. La curva de premio iba
 * justo al revés que la de dificultad.
 */
describe('los gatos se reparten por toda la cuesta', () => {
  const porMundo = GATOS.filter((g) => g.desbloqueo.tipo === 'mundoCompletado')

  it('ningún mundo abre más de un gato', () => {
    const cuenta = {}
    for (const gato of porMundo) cuenta[gato.desbloqueo.valor] = (cuenta[gato.desbloqueo.valor] ?? 0) + 1
    const repetidos = Object.entries(cuenta).filter(([, n]) => n > 1)
    expect(repetidos).toEqual([])
  })

  it('cada desbloqueo por mundo apunta a un mundo que existe', () => {
    const ids = new Set(MUNDOS.map((m) => m.id))
    const fantasmas = porMundo.map((g) => g.desbloqueo.valor).filter((id) => !ids.has(id))
    expect(fantasmas).toEqual([])
  })

  it('al acabar el tercer mundo todavía quedan gatos por ganar', () => {
    // Esta es la prueba de verdad, y la que estaba en rojo antes del cambio:
    // con los tres primeros mundos hechos se tenían 8 de 10, y los 29 retos
    // siguientes -más de la mitad del juego- repartían dos.
    const progreso = usarProgreso()
    const gatos = usarGatos()

    for (const mundo of ['primer-dia', 'comisaria', 'es6']) {
      for (const reto of retosDelMundo(mundo)) progreso.registrarVictoria(reto.id)
    }

    const ganados = gatos.enElRefugio.length + gatos.adoptados.length
    expect(ganados, 'quedan demasiados pocos gatos para la segunda mitad').toBeLessThanOrEqual(6)
    expect(gatos.porVenir.length, 'no queda ningún gato esperando').toBeGreaterThanOrEqual(4)
  })
})
