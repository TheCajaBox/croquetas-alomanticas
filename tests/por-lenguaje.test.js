import { describe, expect, it } from 'vitest'

import {
  GLOSARIO,
  entradaDe,
  glosarioDe,
  terminosBuscablesDe,
} from '../src/contenido/glosario.js'
import { IMPREVISTOS, traducirImprevisto } from '../src/contenido/imprevistos.js'
import { ITINERARIOS } from '../src/contenido/itinerarios.js'
import { MUNDOS, mundosDelItinerario } from '../src/contenido/mundos.js'
import {
  itinerarioDeLaRuta,
  lenguajeDeLaRuta,
  lenguajeDelMundo,
  mundoDeLaRuta,
} from '../src/contenido/dondeEstas.js'
import { RETOS } from '../src/contenido/retos/index.js'
import { ENTORNOS } from '../src/motor/protocolo.js'

/**
 * El material compartido se lee distinto en cada camino.
 *
 * El glosario, los imprevistos y el marcado de los enunciados eran de
 * JavaScript porque era el único lenguaje que había. Con PHP delante, «lista»
 * explicada con `['Wax', 'Marasi']` es sintaxis de otro sitio, `ref` es un
 * término que allí no existe, y un `Undefined variable $total` no lo reconocía
 * nadie. Estas pruebas fijan que cada camino vea lo suyo, y -lo que de verdad
 * se escapa- que **no** vea lo del otro.
 */
const LENGUAJES = ['js', 'php']

describe('el glosario, según el camino', () => {
  it('cada camino ve menos entradas que la lista entera', () => {
    for (const lenguaje of LENGUAJES) {
      const suyas = glosarioDe(lenguaje)
      expect(suyas.length, lenguaje).toBeGreaterThan(50)
      expect(suyas.length, lenguaje).toBeLessThan(GLOSARIO.length)
    }
  })

  it('los términos de un lenguaje no salen en el otro', () => {
    // `ref` y `computed` son de Vue; `foreach` y la interpolación, de PHP.
    const deJs = new Set(glosarioDe('js').map((cada) => cada.id))
    const dePhp = new Set(glosarioDe('php').map((cada) => cada.id))
    expect(deJs.has('ref')).toBe(true)
    expect(dePhp.has('ref')).toBe(false)
    expect(dePhp.has('foreach')).toBe(true)
    expect(deJs.has('foreach')).toBe(false)
  })

  it('cada entrada declarada de un lenguaje sale solo ahí', () => {
    const colados = []
    for (const entrada of GLOSARIO) {
      if (!entrada.lenguajes) continue
      for (const lenguaje of LENGUAJES) {
        const esta = glosarioDe(lenguaje).some((cada) => cada.id === entrada.id)
        if (esta !== entrada.lenguajes.includes(lenguaje)) {
          colados.push(`${entrada.id} en ${lenguaje}: ${esta}`)
        }
      }
    }
    expect(colados).toEqual([])
  })

  it('el ejemplo es el del lenguaje, ya resuelto a texto', () => {
    // Nunca el objeto `{ js, php }`: la plantilla lo pinta tal cual y saldría
    // «[object Object]» en la tarjeta.
    for (const lenguaje of LENGUAJES) {
      for (const entrada of glosarioDe(lenguaje)) {
        expect(typeof (entrada.ejemplo ?? ''), `${entrada.id} en ${lenguaje}`).toBe('string')
      }
    }
    expect(entradaDe('variable', 'js').ejemplo).toContain('const')
    expect(entradaDe('variable', 'php').ejemplo).toContain('$sombrero')
  })

  it('una entrada de un lenguaje no se puede pedir desde el otro', () => {
    expect(entradaDe('ref', 'js')).toBeTruthy()
    expect(entradaDe('ref', 'php')).toBeNull()
    expect(entradaDe('esto-no-existe', 'js')).toBeNull()
  })

  it('ningún ejemplo de PHP se quedó escrito en JavaScript', () => {
    // Los dos lenguajes se parecen lo suficiente para que un ejemplo sin
    // traducir no llame la atención: `=>` es de los dos -`fn($p) =>` y
    // `'clave' => 4`- y `const` también. Lo que PHP no tiene en ninguna
    // circunstancia es `let`, `console.log` y los métodos de lista encadenados
    // con un punto.
    const DE_JS = /console\.log|\blet\s|\bvar\s|\w\.(map|filter|reduce|forEach|includes|join|push|split|trim)\(/
    const sinTraducir = []
    for (const entrada of glosarioDe('php')) {
      if (entrada.ejemplo && DE_JS.test(entrada.ejemplo)) sinTraducir.push(entrada.id)
    }
    expect(sinTraducir).toEqual([])
  })

  it('ni al revés: ningún ejemplo de JavaScript está escrito en PHP', () => {
    const DE_PHP = /<\?php|\becho\s|\$\w+\s*=|->|::|\bfn\(/
    const trasplantados = []
    for (const entrada of glosarioDe('js')) {
      if (entrada.ejemplo && DE_PHP.test(entrada.ejemplo)) trasplantados.push(entrada.id)
    }
    expect(trasplantados).toEqual([])
  })

  it('los términos buscables van del más largo al más corto en los dos caminos', () => {
    for (const lenguaje of LENGUAJES) {
      const buscables = terminosBuscablesDe(lenguaje)
      const largos = buscables.map((cada) => cada.texto.length)
      expect(largos, lenguaje).toEqual([...largos].sort((a, b) => b - a))
      // Y solo apuntan a entradas que en ese camino existen.
      const suyas = new Set(glosarioDe(lenguaje).map((cada) => cada.id))
      expect(buscables.every((cada) => suyas.has(cada.id)), lenguaje).toBe(true)
    }
  })

  it('lo calculado se guarda: pedirlo dos veces da la misma lista', () => {
    expect(glosarioDe('php')).toBe(glosarioDe('php'))
    expect(terminosBuscablesDe('php')).toBe(terminosBuscablesDe('php'))
  })

  it('un lenguaje que aún no tiene glosario propio no revienta', () => {
    // SQL y seguridad llegan después. Hasta entonces, lo compartido y ya.
    const deSql = glosarioDe('sql')
    expect(Array.isArray(deSql)).toBe(true)
    expect(deSql.length).toBeGreaterThan(30)
    expect(deSql.some((cada) => cada.id === 'ref')).toBe(false)
  })
})

describe('los imprevistos, según el camino', () => {
  it('cada imprevisto declara de qué lenguaje es', () => {
    for (const imprevisto of IMPREVISTOS) {
      expect(LENGUAJES, imprevisto.id).toContain(imprevisto.lenguaje)
    }
  })

  const DE_PHP = [
    ['Call to undefined function conatr()', 'php-funcion-no-existe'],
    ['Call to a member function nombre() on null', 'php-metodo-en-null'],
    ['Undefined variable $total', 'php-variable-no-definida'],
    ['Undefined array key "acero"', 'php-clave-no-definida'],
    ['Division by zero', 'php-division-por-cero'],
    ['Class "Sombrero" not found', 'php-clase-no-existe'],
  ]

  for (const [mensaje, esperado] of DE_PHP) {
    it(`en PHP reconoce «${mensaje}»`, () => {
      expect(traducirImprevisto(mensaje, 'php')?.id).toBe(esperado)
    })

    it(`y ese mismo mensaje en JavaScript no lo reconoce nadie`, () => {
      // Lo que se quiere evitar es lo contrario de un fallo ruidoso: que el
      // patrón de un lenguaje explique el error del otro y la explicación no
      // tenga nada que ver con lo que pasó.
      expect(traducirImprevisto(mensaje, 'js')).toBeNull()
    })
  }

  it('un error de JavaScript no se traduce en el camino de PHP', () => {
    expect(traducirImprevisto('sombrero is not defined', 'js')).toBeTruthy()
    expect(traducirImprevisto('sombrero is not defined', 'php')).toBeNull()
  })

  it('sin lenguaje, se supone JavaScript', () => {
    expect(traducirImprevisto('sombrero is not defined')?.id).toBe(
      traducirImprevisto('sombrero is not defined', 'js')?.id,
    )
  })

  it('todos los imprevistos de PHP saben explicarse', () => {
    for (const imprevisto of IMPREVISTOS.filter((cada) => cada.lenguaje === 'php')) {
      expect(typeof imprevisto.significa, imprevisto.id).toBe('function')
      expect(imprevisto.significa(['', 'algo', 'otro']).length, imprevisto.id).toBeGreaterThan(20)
      expect(imprevisto.causas.length, imprevisto.id).toBeGreaterThan(0)
    }
  })

  it('cada lenguaje tiene con qué explicarse', () => {
    for (const lenguaje of LENGUAJES) {
      const suyos = IMPREVISTOS.filter((cada) => cada.lenguaje === lenguaje)
      expect(suyos.length, lenguaje).toBeGreaterThan(10)
    }
  })
})

describe('dónde estás, deducido de la ruta', () => {
  it('el lenguaje de un mundo sale de su entorno', () => {
    for (const mundo of MUNDOS) {
      expect(lenguajeDelMundo(mundo.id), mundo.id).toBe(ENTORNOS[mundo.entorno].lenguaje)
    }
  })

  it('un mundo que no existe no rompe: se supone JavaScript', () => {
    expect(lenguajeDelMundo('no-existe')).toBe('js')
    expect(lenguajeDelMundo(undefined)).toBe('js')
  })

  it('con el id de un mundo en la ruta, el mundo es ese', () => {
    const mundo = MUNDOS[0]
    expect(mundoDeLaRuta({ mundoId: mundo.id })?.id).toBe(mundo.id)
    expect(lenguajeDeLaRuta({ mundoId: mundo.id })).toBe(lenguajeDelMundo(mundo.id))
  })

  it('con el id de un reto, el mundo es el del reto', () => {
    for (const reto of [RETOS[0], RETOS[RETOS.length - 1]]) {
      expect(mundoDeLaRuta({ retoId: reto.id })?.id).toBe(reto.mundo)
      expect(lenguajeDeLaRuta({ retoId: reto.id })).toBe(ENTORNOS[reto.entorno].lenguaje)
    }
  })

  it('un reto de PHP resuelve a PHP y uno de la segunda era a JavaScript', () => {
    // Esto es lo que decide qué glosario se ve dentro del reto, así que
    // conviene comprobarlo con los dos caminos de verdad y no en abstracto.
    for (const itinerario of ITINERARIOS) {
      const mundos = mundosDelItinerario(itinerario.id)
      if (!mundos.length) continue
      const primero = RETOS.find((reto) => reto.mundo === mundos[0].id)
      expect(lenguajeDeLaRuta({ retoId: primero.id }), itinerario.id).toBe(
        ENTORNOS[mundos[0].entorno].lenguaje,
      )
    }
  })

  it('fuera de un mundo no hay mundo, y el itinerario es el de por defecto', () => {
    expect(mundoDeLaRuta({})).toBeNull()
    expect(mundoDeLaRuta({ retoId: 'no-existe' })).toBeNull()
    expect(itinerarioDeLaRuta({})?.id).toBe('era2')
    expect(lenguajeDeLaRuta({})).toBe('js')
  })

  it('dentro de un mundo, el itinerario es el suyo', () => {
    for (const itinerario of ITINERARIOS) {
      for (const mundo of mundosDelItinerario(itinerario.id)) {
        expect(itinerarioDeLaRuta({ mundoId: mundo.id })?.id, mundo.id).toBe(itinerario.id)
      }
    }
  })
})
