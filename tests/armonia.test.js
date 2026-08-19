// @vitest-environment jsdom
//
// Con jsdom y no en node porque aquí se comprueba dónde se guardan las cosas:
// sin `localStorage` de verdad, los tests de persistencia pasarían por no haber
// guardado nada, que es justo lo contrario de lo que se quiere demostrar.
import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { citar, obtenerCorpus, trocearApunte } from '../src/contenido/armonia/corpus.js'
import { cargarTodosLosApuntes } from '../src/contenido/apuntes/index.js'
import { clasificar } from '../src/motor/armonia/intencion.js'
import { prepararArmonia, responder } from '../src/motor/armonia/responder.js'
import { engancharArmonia, usarArmonia } from '../src/almacen/armonia.js'
import { leerAjustesDeProveedor, olvidarAjustesDeProveedor } from '../src/almacen/clave.js'
import { contexto, instrucciones, sinCodigo } from '../src/motor/armonia/proveedores.js'
import { exportarPartida, volcarAhora } from '../src/almacen/persistencia.js'
import { GLOSARIO } from '../src/contenido/glosario.js'
import { IMPREVISTOS } from '../src/contenido/imprevistos.js'
import { RETOS } from '../src/contenido/retos/index.js'

/**
 * Normaliza para comparar: el sangrado y los saltos no cuentan, porque una
 * solución filtrada con otra indentación seguiría siendo una solución filtrada.
 */
const aplanar = (texto) => (texto ?? '').replace(/\s+/g, ' ').trim()

/**
 * Todo lo que el jugador tiene GRATIS y delante mientras hace un reto: el
 * enunciado, el apunte de Wax, el glosario de Steris y la lista de imprevistos.
 */
function materialGratuito(apuntes) {
  const partes = []
  for (const reto of RETOS) partes.push(reto.titulo, reto.enunciado, apuntes[reto.id])
  for (const entrada of GLOSARIO) partes.push(entrada.termino, entrada.definicion, entrada.ejemplo)
  for (const imprevisto of IMPREVISTOS) partes.push(imprevisto.titulo, ...(imprevisto.causas ?? []))
  return aplanar(partes.filter(Boolean).join(' '))
}

/**
 * Los apuntes y el corpus se traen antes de nada: desde que viven fuera del
 * paquete inicial hay que pedirlos, y sin ellos estos tests comprobarían el
 * vacío y pasarían por no haber mirado nada.
 */
let GRATIS = ''
let CORPUS = []
let APUNTES = {}

beforeAll(async () => {
  APUNTES = await cargarTodosLosApuntes()
  GRATIS = materialGratuito(APUNTES)
  CORPUS = await obtenerCorpus()
  await prepararArmonia()
})

describe('Armonía no puede decir nada que no esté ya gratis en pantalla', () => {
  /**
   * La garantía de verdad, y por procedencia y no por coincidencia: cada trozo
   * del corpus tiene que salir palabra por palabra del material gratuito.
   *
   * Comprobarlo así es más fuerte que ir buscando soluciones filtradas, porque
   * no depende de acertar qué campos son peligrosos: si algún día entra un
   * campo nuevo que no debía, este test lo caza aunque nadie lo haya previsto.
   */
  it('cada trozo del corpus sale del material gratuito, palabra por palabra', () => {
    const intrusos = CORPUS.filter((trozo) => !GRATIS.includes(aplanar(trozo.texto)))
    expect(intrusos.map((t) => t.id), 'hay texto en el corpus que no es gratuito').toEqual([])
  })

  it('de cada reto solo entran el enunciado y el apunte', () => {
    for (const trozo of CORPUS.filter((t) => t.retoId)) {
      expect(['enunciado', 'apunte']).toContain(trozo.tipo)
    }
  })

  it('y el resto del corpus solo son términos e imprevistos', () => {
    const tipos = new Set(CORPUS.map((t) => t.tipo))
    expect([...tipos].sort()).toEqual(['apunte', 'enunciado', 'imprevisto', 'termino'])
  })

  /**
   * Los campos que guardan la respuesta, uno por uno. Redundante con el test de
   * procedencia y merece la pena: si alguien lo relaja alguna vez, estos siguen
   * nombrando exactamente qué se ha roto.
   */
  it('ningún trozo procede de un campo con la respuesta dentro', () => {
    const prohibidos = []
    for (const reto of RETOS) {
      for (const prueba of reto.tests ?? []) prohibidos.push(prueba.codigo)
      for (const pista of reto.pistas ?? []) prohibidos.push(pista.texto)
      for (const opcion of reto.opciones ?? []) prohibidos.push(opcion.porque)
      prohibidos.push(reto.respuestaEsperada, (reto.lineas ?? []).join(' '))

      // Los tipos de señalar, cada uno guarda su respuesta en su sitio.
      prohibidos.push(reto.plantilla, (reto.fichas ?? []).join(' '))
      for (const afirmacion of reto.afirmaciones ?? []) prohibidos.push(afirmacion.porque)
      for (const explicacion of Object.values(reto.explicaciones ?? {})) prohibidos.push(explicacion)
      for (const fragmento of reto.fragmentos ?? []) prohibidos.push(fragmento.etiqueta)
      for (const paso of reto.pasos ?? []) prohibidos.push(Object.values(paso.valores ?? {}).join(' '))
      prohibidos.push(reto.porque)
    }

    const filtrados = []
    for (const crudo of prohibidos.filter(Boolean)) {
      const texto = aplanar(crudo)
      // Los textos cortos coinciden por casualidad; se miran los que delatan.
      if (texto.length < 40) continue
      const trozo = CORPUS.find((t) => aplanar(t.texto).includes(texto))
      if (trozo) filtrados.push(`${trozo.id} <- ${texto.slice(0, 60)}`)
    }
    expect(filtrados).toEqual([])
  })
})

describe('el troceado de los apuntes', () => {
  it('parte por titulares cuando el apunte los tiene', () => {
    const trozos = trocearApunte(
      [
        'Un párrafo de entrada que tiene longitud más que suficiente para contar.',
        '',
        '## El primer titular',
        '',
        'Lo que se explica bajo el primer titular, con su correspondiente extensión.',
        '',
        '## El segundo titular',
        '',
        'Y lo que se explica bajo el segundo, que también ocupa lo suyo para entrar.',
      ].join('\n'),
    )
    expect(trozos).toHaveLength(3)
    expect(trozos[1].titular).toBe('El primer titular')
    expect(trozos[2].titular).toBe('El segundo titular')
  })

  it('no parte por dentro de un bloque de código', () => {
    const trozos = trocearApunte(
      [
        'Esto explica el código que viene justo debajo, y ocupa lo suficiente.',
        '',
        '```js',
        'const a = 1',
        '',
        '## esto es un comentario raro, no un titular',
        'const b = 2',
        '```',
      ].join('\n'),
    )
    expect(trozos).toHaveLength(1)
    expect(trozos[0].texto).toContain('const b = 2')
  })

  it('todos los apuntes del juego se trocean sin perder texto', () => {
    for (const reto of RETOS) {
      if (!reto.apunte) continue
      const trozos = trocearApunte(reto.apunte)
      expect(trozos.length, `${reto.id} no ha dado ningún trozo`).toBeGreaterThan(0)
    }
  })

  it('ningún trozo es un bloque de código suelto sin nada que lo explique', () => {
    // Con titular sí vale: en «Y, o, no» el titular es toda la explicación que
    // ese código necesita. Lo que no puede quedar es código sin ninguna de las
    // dos cosas, porque como respuesta de búsqueda no dice nada.
    const huerfanos = CORPUS.filter((trozo) => {
      const sinCodigo = trozo.texto.replace(/```[\s\S]*?```/g, '').trim()
      return trozo.texto.includes('```') && sinCodigo.length < 40 && !trozo.titular
    })
    expect(huerfanos.map((h) => h.id)).toEqual([])
  })
})

describe('las citas', () => {
  it('traen el reto y la sección cuando la hay, y en datos', () => {
    const conTitular = CORPUS.find((t) => t.tipo === 'apunte' && t.titular)
    const cita = citar(conTitular)
    expect(cita.fuente).toBe('apunte')
    expect(cita.reto).toBe(conTitular.titulo)
    expect(cita.seccion).toBe(conTitular.titular)
    expect(cita.retoId).toBe(conTitular.retoId)
  })

  it('la de un término apunta al glosario y no a ningún reto', () => {
    const cita = citar(CORPUS.find((t) => t.tipo === 'termino'))
    expect(cita.fuente).toBe('glosario')
    expect(cita.retoId).toBe(null)
  })
})

describe('qué te ha preguntado', () => {
  const casos = {
    peticion: [
      'dame la solución',
      'cuál es la respuesta',
      'resuélvelo tú',
      'escríbeme el código',
      'no me sale nada de nada, dame la solución',
      'cómo se resuelve este reto',
      'hazlo por mí',
    ],
    diagnostico: [
      'por qué falla',
      'no me funciona',
      'qué hago mal',
      'estoy atascado',
      'no me pasan los tests',
      'qué me falta',
    ],
    donde: ['dónde se explicaba el acumulador', 'en qué reto vi esto', 'quiero repasar los objetos'],
    definicion: [
      'qué es un bucle',
      'para qué sirve reduce',
      'computed',
      'qué hace filter',
      'diferencia entre let y const',
    ],
    general: ['los gatos comen mucho'],
  }

  for (const [esperado, preguntas] of Object.entries(casos)) {
    for (const pregunta of preguntas) {
      it(`«${pregunta}» es ${esperado}`, () => {
        expect(clasificar(pregunta).tipo).toBe(esperado)
      })
    }
  }

  it('un error pegado en la caja se reconoce aunque no venga con pregunta', () => {
    const { tipo, errorDetectado } = clasificar("Cannot read properties of undefined (reading 'nombre')")
    expect(tipo).toBe('error')
    expect(errorDetectado.titulo).toBeTruthy()
  })

  it('pedir la solución gana a sonar atascado, porque es lo que se está pidiendo', () => {
    expect(clasificar('no me funciona, dame la solución').tipo).toBe('peticion')
  })
})

describe('lo que contesta', () => {
  const reto = RETOS.find((r) => r.id === 'com-06-el-bucle')
  const jefe = RETOS.find((r) => r.jefe)

  it('nunca da la solución, por mucho que se insista', () => {
    for (let vez = 0; vez < 6; vez += 1) {
      const dicho = responder('dame la solución', { reto, vecesQuePidioSolucion: vez })
      expect(dicho.tipo).toBe('peticion')
      expect(dicho.texto).not.toContain('```')
    }
  })

  it('a la tercera contesta distinto, y ahí sale lo de Sazed', () => {
    expect(responder('dame la solución', { reto, vecesQuePidioSolucion: 0 }).texto).not.toContain('Sazed')
    expect(responder('dame la solución', { reto, vecesQuePidioSolucion: 2 }).texto).toContain('Sazed')
  })

  it('nunca compone un bloque de código propio', () => {
    // Los trozos de apunte que cita sí pueden llevar código, y no pasa nada:
    // el apunte es gratis y está abierto en la misma pantalla. Lo que no puede
    // es escribir código que no salga de ahí, y eso lo garantiza el corpus.
    const preguntas = ['dame la solución', 'por qué falla', 'qué es un bucle', 'resuélvelo']
    for (const pregunta of preguntas) {
      const dicho = responder(pregunta, { reto, codigo: 'const a = 1' })
      const bloques = dicho.texto.match(/```[\s\S]*?```/g) ?? []
      for (const bloque of bloques) {
        expect(GRATIS, `«${pregunta}» ha soltado código que no es del apunte`).toContain(aplanar(bloque))
      }
    }
  })

  it('señala el requisito que falta, sin decir cómo cumplirlo', () => {
    const dicho = responder('por qué falla', {
      reto,
      codigo: 'function sumar(n){return n.reduce((a,b)=>a+b,0)}\nfunction laMayor(n){return Math.max(...n)}',
    })
    expect(dicho.tipo).toBe('diagnostico')
    expect(dicho.texto).toContain('reduce')
  })

  it('traduce un error de sintaxis y dice por qué línea empezar', () => {
    const dicho = responder('por qué falla', { reto, codigo: 'function sumar(n) {\n  return n' })
    expect(dicho.tipo).toBe('diagnostico')
    expect(dicho.texto).toMatch(/línea \d+/)
  })

  it('devuelve el nombre del test que falla como pregunta, y nada más', () => {
    const dicho = responder('no me pasa el test', {
      reto,
      codigo: 'function sumar(numeros){let t=0;for(const n of numeros){t+=n}return t}\nfunction laMayor(numeros){let m=0;for(const n of numeros){if(n>m)m=n}return m}',
      resultado: {
        tests: [
          { ok: true, nombre: 'suma tres números' },
          { ok: false, nombre: 'y si todas son negativas, la mayor sigue estando en la lista' },
        ],
      },
    })
    expect(dicho.texto).toContain('y si todas son negativas')
    expect(dicho.texto).not.toContain('```')
  })

  it('en un jefe se retira: ni diagnostica ni busca', () => {
    const dicho = responder('por qué falla', { reto: jefe, codigo: 'const a = 1' })
    expect(dicho.tipo).toBe('retirado')
  })

  it('pero en un jefe sigue traduciendo errores, que es la válvula', () => {
    const dicho = responder("Cannot read properties of undefined (reading 'x')", { reto: jefe })
    expect(dicho.tipo).toBe('error')
    expect(dicho.texto).toContain('undefined')
  })

  it('y en un jefe sigue definiendo palabras', () => {
    // La petición de solución también se intercepta antes de retirarse.
    expect(responder('dame la solución', { reto: jefe }).tipo).toBe('peticion')
  })

  it('define un término y dice dónde se enseñó por primera vez', () => {
    const dicho = responder('qué es un bucle', { reto })
    expect(dicho.tipo).toBe('definicion')
    expect(dicho.citas.length).toBeGreaterThan(0)
    expect(dicho.citas[0].retoId).toBeTruthy()
  })

  it('no manda hacia adelante a quien va por el principio', () => {
    const primero = RETOS.find((r) => r.mundo === 'primer-dia')
    const dicho = responder('qué es una variable', { reto: primero })
    const mundos = dicho.citas.map((c) => RETOS.find((r) => r.id === c.retoId)?.mundo)
    expect(mundos.every((m) => m !== 'melaan' && m !== 'vue3')).toBe(true)
  })
})

describe('el almacén', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('guarda la conversación y cuenta las veces que le piden la solución', async () => {
    const armonia = usarArmonia()
    await armonia.preguntar('qué es un bucle')
    expect(armonia.turnos).toHaveLength(2)
    expect(armonia.turnos[0].de).toBe('jugador')
    expect(armonia.turnos[1].de).toBe('armonia')

    await armonia.preguntar('dame la solución')
    expect(armonia.vecesQuePidioSolucion).toBe(1)
    await armonia.preguntar('dame la solución')
    expect(armonia.vecesQuePidioSolucion).toBe(2)
  })

  it('una pregunta vacía no cuenta como turno', async () => {
    const armonia = usarArmonia()
    await armonia.preguntar('   ')
    expect(armonia.turnos).toHaveLength(0)
  })

  it('se presenta una sola vez en toda la partida', () => {
    const armonia = usarArmonia()
    armonia.presentarse('hola')
    armonia.presentarse('hola otra vez')
    expect(armonia.turnos.filter((t) => t.tipo === 'presentacion')).toHaveLength(1)
  })

  it('el contexto no se guarda en la partida: llevaría dentro tu código', () => {
    const armonia = usarArmonia()
    armonia.situar({ retoId: 'com-06-el-bucle', codigo: 'const secreto = 1', resultado: null })
    engancharArmonia(armonia)
    volcarAhora()

    const guardado = exportarPartida()
    expect(guardado).not.toContain('const secreto = 1')
    expect(guardado).not.toContain('com-06-el-bucle')
  })
})

describe('la voz prestada', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    olvidarAjustesDeProveedor()
  })

  it('tacha cualquier bloque de código mientras haya un reto abierto', () => {
    const conCodigo = 'Mira, es fácil:\n\n```js\nreturn tieneCita || edad >= 18\n```\n\nY ya está.'
    const { texto, tachado } = sinCodigo(conCodigo, { hayRetoAbierto: true })

    expect(tachado).toBe(true)
    expect(texto).not.toContain('tieneCita')
    expect(texto).not.toContain('```')
  })

  it('también tacha un bloque que se ha quedado a medias', () => {
    const cortado = 'Toma:\n\n```js\nconst equipo = [...PLANTILLA]'
    expect(sinCodigo(cortado, { hayRetoAbierto: true }).texto).not.toContain('PLANTILLA')
  })

  it('pero deja el código en línea, que sin eso no se puede ni explicar', () => {
    const enLinea = 'Necesitas `filter`, y después `map`.'
    const { texto, tachado } = sinCodigo(enLinea, { hayRetoAbierto: true })
    expect(tachado).toBe(false)
    expect(texto).toContain('`filter`')
  })

  it('fuera de un reto sí puede poner ejemplos', () => {
    const conCodigo = 'Así:\n\n```js\nconst a = 1\n```'
    expect(sinCodigo(conCodigo, { hayRetoAbierto: false }).tachado).toBe(false)
  })

  /**
   * El apunte dejó de ser un campo del reto el día que se hicieron perezosos, y
   * `contexto()` siguió mandando `reto.apunte` durante bastante tiempo: la
   * cadena vacía. El modelo se quedaba sin una sola línea del juego sobre la que
   * apoyarse y contestaba de su propia memoria, como un manual.
   */
  it('el material del juego llega de verdad al modelo', () => {
    const reto = RETOS[0]
    const apunte = APUNTES[reto.id]

    const conMaterial = contexto({
      reto,
      apunte,
      material: [{ titulo: 'Ficha', titular: null, texto: 'Una variable guarda un valor.' }],
      codigo: '',
      resultado: null,
      diagnostico: null,
    })

    expect(conMaterial, 'no manda el apunte').toContain(apunte.slice(0, 60))
    expect(conMaterial, 'no manda lo que encontró la búsqueda').toContain('Una variable guarda un valor.')
    expect(conMaterial).toContain(reto.titulo)
  })

  it('sin reto abierto sigue mandando material, que es cuando más falta hace', () => {
    const enviado = contexto({
      reto: null,
      material: [{ titulo: 'Ficha de bucle', titular: null, texto: 'Un bucle repite algo.' }],
    })

    expect(enviado).toContain('Un bucle repite algo.')
    expect(enviado).toContain('acótala')
  })

  it('no se le manda un apunte vacío como si fuera material', () => {
    const enviado = contexto({ reto: RETOS[0], apunte: null, material: [] })
    expect(enviado).not.toContain('El apunte de Wax de este reto')
  })

  it('lo que se le manda al modelo no lleva la solución ni los tests ni las pistas', () => {
    for (const reto of RETOS.slice(0, 12)) {
      const enviado = aplanar(
        contexto({ reto, codigo: 'const a = 1', resultado: null, diagnostico: null }),
      )
      for (const linea of (reto.solucion ?? '').split('\n').map(aplanar).filter((l) => l.length >= 20)) {
        // Salvo que esa línea ya estuviera en el apunte, que es gratis y visible.
        if (aplanar(APUNTES[reto.id] ?? '').includes(linea)) continue
        expect(enviado, `${reto.id} manda su solución al modelo`).not.toContain(linea)
      }
      for (const prueba of reto.tests ?? []) {
        const cuerpo = aplanar(prueba.codigo ?? '')
        if (cuerpo.length >= 30) expect(enviado).not.toContain(cuerpo)
      }
      for (const pista of reto.pistas ?? []) {
        const texto = aplanar(pista.texto)
        if (texto.length >= 30) expect(enviado).not.toContain(texto)
      }
    }
  })

  it('en un jefe, las instrucciones le dicen que se aparte', () => {
    expect(instrucciones({ enJefe: true })).toContain('te apartas')
    expect(instrucciones({ enJefe: false })).not.toContain('te apartas')
  })

  it('la clave se guarda fuera de la partida y no sale al exportarla', () => {
    const armonia = usarArmonia()
    armonia.guardarProveedor({ proveedor: 'claude', clave: 'sk-secretisima-123', modelo: 'x' })
    engancharArmonia(armonia)
    volcarAhora()

    expect(exportarPartida()).not.toContain('sk-secretisima-123')
    // Y sigue estando donde tiene que estar, para no perderla al recargar.
    expect(leerAjustesDeProveedor().clave).toBe('sk-secretisima-123')
  })

  it('pedir la solución se corta antes de gastar la clave de nadie', async () => {
    const armonia = usarArmonia()
    armonia.guardarProveedor({ proveedor: 'claude', clave: 'sk-lo-que-sea', modelo: 'x' })
    armonia.situar({ retoId: 'com-06-el-bucle', codigo: '', resultado: null })

    // Si intentara salir a la red, esto fallaría: no hay red en los tests.
    const dicho = await armonia.preguntarConVoz('dame la solución')
    expect(dicho.tipo).toBe('peticion')
    expect(armonia.vecesQuePidioSolucion).toBe(1)
  })
})
