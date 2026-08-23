import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { GLOSARIO, TERMINOS_BUSCABLES } from '../src/contenido/glosario.js'
import { IMPREVISTOS, traducirImprevisto } from '../src/contenido/imprevistos.js'
import { ANTESALA, antesalaDe, primerMundoDe } from '../src/contenido/antesala.js'
import { mundosDelItinerario } from '../src/contenido/mundos.js'
import { retosDelMundo } from '../src/contenido/retos/index.js'
import { enlazarTerminos } from '../src/motor/enlazarTerminos.js'
import { usarGlosario } from '../src/almacen/glosario.js'

beforeEach(() => setActivePinia(createPinia()))

const enlazar = (html) => enlazarTerminos(html, TERMINOS_BUSCABLES)

describe('enlazado de términos del glosario', () => {
  it('marca un término suelto en el texto', () => {
    const salida = enlazar('<p>Una variable guarda algo.</p>')
    expect(salida).toContain('data-termino="variable"')
    expect(salida).toContain('>variable</button>')
  })

  it('no toca nada dentro de código', () => {
    // Ahí `map` es una llamada, no una palabra que explicar.
    const salida = enlazar('<pre><code>precios.map((p) => p)</code></pre>')
    expect(salida).not.toContain('termino')
    expect(salida).toBe('<pre><code>precios.map((p) => p)</code></pre>')
  })

  it('tampoco dentro de código en línea', () => {
    const salida = enlazar('<p>Se usa <code>map</code> para eso.</p>')
    expect(salida).not.toContain('termino')
  })

  it('marca cada término una sola vez por bloque', () => {
    const salida = enlazar('<p>Una variable es una variable, y otra variable también.</p>')
    expect(salida.match(/data-termino="variable"/g)).toHaveLength(1)
  })

  it('respeta los límites de palabra, también con tildes', () => {
    // "función" está dentro de "funcionamiento", pero no es la misma palabra.
    expect(enlazar('<p>El funcionamiento es raro.</p>')).not.toContain('termino')
    expect(enlazar('<p>Una función.</p>')).toContain('data-termino="funcion"')
  })

  it('prefiere el término más largo cuando uno contiene al otro', () => {
    const salida = enlazar('<p>Una función flecha es corta.</p>')
    expect(salida).toContain('data-termino="funcion-flecha"')
    expect(salida).not.toContain('data-termino="funcion"')
  })

  it('no se mete dentro de los atributos de una etiqueta', () => {
    const salida = enlazar('<p class="lista">Texto suelto.</p>')
    expect(salida).toContain('<p class="lista">')
  })

  it('encuentra el término en plural, por sus alias', () => {
    expect(enlazar('<p>Dos funciones.</p>')).toContain('data-termino="funcion"')
    expect(enlazar('<p>Varios arrays.</p>')).toContain('data-termino="lista"')
  })

  it('deja el texto tal cual si no hay nada que marcar', () => {
    expect(enlazar('<p>Hola, qué tal.</p>')).toBe('<p>Hola, qué tal.</p>')
  })
})

describe('el glosario está bien montado', () => {
  it('no hay identificadores repetidos', () => {
    const ids = GLOSARIO.map((entrada) => entrada.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cada término tiene definición', () => {
    for (const entrada of GLOSARIO) {
      expect(entrada.termino, entrada.id).toBeTruthy()
      expect(entrada.definicion?.length, entrada.id).toBeGreaterThan(20)
    }
  })

  it('ninguna forma de escribir un término pisa la de otro', () => {
    const textos = TERMINOS_BUSCABLES.map((t) => t.texto.toLowerCase())
    expect(new Set(textos).size).toBe(textos.length)
  })

  it('los términos van del más largo al más corto', () => {
    const largos = TERMINOS_BUSCABLES.map((t) => t.texto.length)
    expect([...largos].sort((a, b) => b - a)).toEqual(largos)
  })

  it('consultar un término lo apunta como visto', () => {
    const glosario = usarGlosario()
    expect(glosario.consultado('variable')).toBe(false)

    glosario.abrir('variable')
    expect(glosario.entrada.termino).toBe('variable')
    expect(glosario.consultado('variable')).toBe(true)

    glosario.cerrar()
    expect(glosario.entrada).toBeNull()
    // Cerrarlo no lo borra de los consultados.
    expect(glosario.consultado('variable')).toBe(true)
  })

  it('un término inventado no abre nada', () => {
    const glosario = usarGlosario()
    glosario.abrir('metalurgia-alomantica')
    expect(glosario.abierto).toBeNull()
  })
})

describe('la lista de imprevistos traduce los errores', () => {
  const casos = [
    ['cobrar is not defined', 'no-definido', 'cobrar'],
    ["Cannot access 'gatos' before initialization", 'antes-de-existir', 'gatos'],
    ['Assignment to constant variable.', 'const-reasignada', null],
    ["Cannot read properties of undefined (reading 'nombre')", 'propiedad-de-nada', 'nombre'],
    ["Cannot read properties of null (reading 'ciudad')", 'propiedad-de-null', 'ciudad'],
    ['metales.mapa is not a function', 'no-es-funcion', 'metales.mapa'],
    ['Unexpected end of input', 'final-inesperado', null],
    ["Identifier 'tarifa' has already been declared", 'declarada-dos-veces', 'tarifa'],
    ['Maximum call stack size exceeded', 'pila-desbordada', null],
    ['Property or method "senor" is not defined on the instance', 'no-definido-en-plantilla', 'senor'],
  ]

  for (const [mensaje, id, nombre] of casos) {
    it(`reconoce «${mensaje.slice(0, 42)}…»`, () => {
      const traduccion = traducirImprevisto(mensaje)
      expect(traduccion, mensaje).not.toBeNull()
      expect(traduccion.id).toBe(id)
      expect(traduccion.titulo.length).toBeGreaterThan(10)
      expect(traduccion.causas.length).toBeGreaterThan(0)
      if (nombre) expect(traduccion.significa).toContain(nombre)
    })
  }

  it('no inventa una traducción para lo que no reconoce', () => {
    expect(traducirImprevisto('algo rarísimo que nadie ha visto')).toBeNull()
    expect(traducirImprevisto(null)).toBeNull()
    expect(traducirImprevisto('')).toBeNull()
  })

  it('todos los imprevistos saben explicarse', () => {
    for (const imprevisto of IMPREVISTOS) {
      expect(imprevisto.titulo, imprevisto.id).toBeTruthy()
      expect(typeof imprevisto.significa, imprevisto.id).toBe('function')
      expect(imprevisto.causas.length, imprevisto.id).toBeGreaterThan(0)
    }
  })
})

describe('la antesala', () => {
  it('cubre lo que hace falta antes de empezar, en los dos caminos', () => {
    for (const camino of ['era2', 'era1']) {
      const antesala = antesalaDe(camino)
      expect(antesala.secciones.length, camino).toBeGreaterThanOrEqual(5)
      for (const seccion of antesala.secciones) {
        expect(seccion.titulo, camino).toBeTruthy()
        expect(seccion.texto.length, `${camino}/${seccion.titulo}`).toBeGreaterThan(150)
      }
    }
  })

  it('cada camino explica su lenguaje y no el del otro', () => {
    // Esta página explicaba «Qué es JavaScript» y «Qué es Vue» a quien había
    // elegido PHP, y acababa con un botón al primer mundo de la segunda era.
    const deJs = antesalaDe('era2').secciones.map((s) => `${s.titulo} ${s.texto}`).join(' ')
    const dePhp = antesalaDe('era1').secciones.map((s) => `${s.titulo} ${s.texto}`).join(' ')

    for (const asunto of ['programa', 'JavaScript', 'Vue', 'croquetas']) {
      expect(deJs, `falta hablar de ${asunto}`).toContain(asunto)
    }
    for (const asunto of ['programa', 'PHP', 'servidor', 'croquetas']) {
      expect(dePhp, `falta hablar de ${asunto}`).toContain(asunto)
    }
    // Vue no pinta nada en la primera era. Con límite de palabra, que si no
    // «Vuelve luego» cuenta como Vue -me pasó-.
    expect(dePhp).not.toMatch(/\bVue\b/)
    expect(antesalaDe('era1').secciones.map((s) => s.titulo)).not.toContain('Qué es JavaScript')
  })

  it('los huecos se rellenan con el reparto de cada camino, y no queda ninguno', () => {
    const deJs = antesalaDe('era2')
    const dePhp = antesalaDe('era1')
    const todoJs = [deJs.entradilla, deJs.cierre, ...deJs.secciones.map((s) => s.texto)].join(' ')
    const todoPhp = [dePhp.entradilla, dePhp.cierre, ...dePhp.secciones.map((s) => s.texto)].join(' ')

    expect(todoJs).toContain('El apunte de Wax')
    expect(todoJs).toContain('Las pistas de Wayne')
    expect(todoPhp).toContain('El apunte de Kelsier')
    expect(todoPhp).toContain('Las pistas de Fantasma')
    // Y nadie de la segunda era anda por la primera.
    for (const ajeno of ['Wax', 'Wayne', 'Marasi', 'Steris']) {
      expect(todoPhp, `${ajeno} no está en la primera era`).not.toMatch(new RegExp(`\\b${ajeno}\\b`))
    }
    // Ni queda un hueco sin rellenar, que saldría en pantalla tal cual.
    for (const texto of [todoJs, todoPhp]) expect(texto).not.toMatch(/\{\w+\}/)
  })

  it('las cuentas que da son las de verdad', () => {
    // Decía «siete mundos, cincuenta y seis retos» cuando ya eran nueve y
    // noventa, y en la primera era decía eso mismo teniendo dos mundos.
    for (const camino of ['era2', 'era1']) {
      const mundos = mundosDelItinerario(camino)
      const retos = mundos.reduce((suma, mundo) => suma + retosDelMundo(mundo.id).length, 0)
      const todo = antesalaDe(camino).secciones.map((s) => s.texto).join(' ')
      expect(todo, camino).toContain(`${mundos.length} mundos`)
      expect(todo, camino).toContain(`${retos} retos`)
    }
  })

  it('el botón del final manda al primer mundo del camino donde estás', () => {
    expect(primerMundoDe('era2').id).toBe(mundosDelItinerario('era2')[0].id)
    expect(primerMundoDe('era1').id).toBe('ceniza')
    // Y un camino sin mundos no deja el botón muerto.
    expect(primerMundoDe('elantris')).toBeTruthy()
  })
})

describe('el marcado entiende listas numeradas', () => {
  // Se comprueba sobre el propio conversor, sin montar el componente.
  it('la antesala usa una lista numerada y hay que respetarla', () => {
    const conNumeros = ANTESALA.secciones.find((s) => /^\d+\.\s/m.test(s.texto))
    expect(conNumeros, 'ninguna sección numera nada').toBeTruthy()
  })
})
