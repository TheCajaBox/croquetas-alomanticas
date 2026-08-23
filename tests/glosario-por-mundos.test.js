import { describe, expect, it } from 'vitest'

import {
  GLOSARIO,
  GLOSARIO_POR_ID,
  entradaDe,
  glosarioDe,
  glosarioHasta,
  glosarioPorMundos,
  terminosBuscablesHasta,
} from '../src/contenido/glosario.js'
import { ITINERARIOS, ITINERARIOS_POR_ID } from '../src/contenido/itinerarios.js'
import { MUNDOS, MUNDOS_POR_ID, mundosDelItinerario } from '../src/contenido/mundos.js'

/**
 * Cada término tiene su mundo, y antes de su mundo no existe.
 *
 * Separar el glosario por lenguaje arregló la mitad del problema: dejó de
 * explicar «lista» con sintaxis de JavaScript en un mundo de PHP. Pero seguía
 * ofreciéndolo **todo desde el primer reto**. Medido en La Ceniza, primer mundo
 * de PHP: 65 términos disponibles, de los que 27 solo se enseñan en la segunda
 * era. Alguien en su tercer reto de la vida podía pulsar «herencia».
 *
 * Ahora cada entrada declara en qué mundo se enseña, camino por camino, y estas
 * pruebas fijan las dos mitades: que no se adelante nada, y que no se pierda
 * nada por el camino.
 */
const CON_MUNDOS = ITINERARIOS.filter((cada) => mundosDelItinerario(cada.id).length > 0)

describe('el mundo de cada término', () => {
  it('todas las entradas dicen dónde se enseñan', () => {
    const mudas = GLOSARIO.filter((entrada) => Object.keys(entrada.desde ?? {}).length === 0)
    expect(mudas.map((cada) => cada.id), 'entradas sin `desde`: no saldrían en ningún camino').toEqual([])
  })

  it('cada `desde` nombra un itinerario y un mundo que existen, y que son el uno del otro', () => {
    const rotos = []
    for (const entrada of GLOSARIO) {
      for (const [itinerario, mundoId] of Object.entries(entrada.desde)) {
        if (!ITINERARIOS_POR_ID[itinerario]) rotos.push(`${entrada.id}: itinerario ${itinerario}`)
        else if (!MUNDOS_POR_ID[mundoId]) rotos.push(`${entrada.id}: mundo ${mundoId}`)
        else if (MUNDOS_POR_ID[mundoId].itinerario !== itinerario) {
          rotos.push(`${entrada.id}: ${mundoId} no es de ${itinerario}`)
        }
      }
    }
    expect(rotos).toEqual([])
  })

  it('ningún mundo ofrece un término que se enseñe más adelante', () => {
    // La prueba que sostiene todo esto. Un término de un mundo posterior en el
    // glosario de un mundo anterior es una definición que el jugador no puede
    // entender todavía, y no falla nada: solo desanima.
    const adelantados = []
    for (const itinerario of CON_MUNDOS) {
      const orden = mundosDelItinerario(itinerario.id).map((cada) => cada.id)
      orden.forEach((mundoId, cuando) => {
        for (const entrada of glosarioHasta(mundoId)) {
          const suyo = orden.indexOf(GLOSARIO_POR_ID[entrada.id].desde[itinerario.id])
          if (suyo > cuando) adelantados.push(`${mundoId} ofrece ${entrada.id} (de ${orden[suyo]})`)
        }
      })
    }
    expect(adelantados).toEqual([])
  })

  it('ningún mundo ofrece un término de otro camino', () => {
    const ajenos = []
    for (const mundo of MUNDOS) {
      for (const entrada of glosarioHasta(mundo.id)) {
        if (!GLOSARIO_POR_ID[entrada.id].desde[mundo.itinerario]) {
          ajenos.push(`${mundo.id} ofrece ${entrada.id}`)
        }
      }
    }
    expect(ajenos).toEqual([])
  })

  it('el glosario solo crece: lo aprendido no se pierde al avanzar', () => {
    for (const itinerario of CON_MUNDOS) {
      let antes = []
      for (const mundo of mundosDelItinerario(itinerario.id)) {
        const ahora = glosarioHasta(mundo.id).map((cada) => cada.id)
        const perdidos = antes.filter((id) => !ahora.includes(id))
        expect(perdidos, `${mundo.id} ha perdido términos`).toEqual([])
        expect(ahora.length, mundo.id).toBeGreaterThanOrEqual(antes.length)
        antes = ahora
      }
    }
  })

  it('el primer mundo de cada camino enseña de menos, y el último todo lo suyo', () => {
    for (const itinerario of CON_MUNDOS) {
      const mundos = mundosDelItinerario(itinerario.id)
      const primero = glosarioHasta(mundos[0].id)
      const ultimo = glosarioHasta(mundos.at(-1).id)
      const todo = GLOSARIO.filter((cada) => cada.desde[itinerario.id])
      expect(primero.length, itinerario.id).toBeGreaterThan(10)
      expect(primero.length, itinerario.id).toBeLessThan(todo.length)
      expect(ultimo.length, itinerario.id).toBe(todo.length)
    }
  })

  it('en La Ceniza ya no se puede pulsar «herencia», que era el síntoma', () => {
    const enLaCeniza = glosarioHasta('ceniza').map((cada) => cada.id)
    // `sandbox` no está en la lista a propósito: el código del jugador corre en
    // uno desde el primer reto de los dos caminos, y la antesala lo explica
    // antes de empezar, así que ahí sí toca.
    for (const ajeno of ['herencia', 'clase', 'map', 'reduce', 'cache', 'objeto', 'array-asociativo']) {
      expect(enLaCeniza, `«${ajeno}» no se enseña en La Ceniza`).not.toContain(ajeno)
    }
    // Y sí lo suyo. `foreach` está en la lista a propósito y contra lo que
    // decía el plan: el tercer apunte de La Ceniza tiene un titular que se
    // llama «Recorrer: `foreach`», y su jefe pide recorrer la cuadrilla. El
    // mapeo se escribe contra los apuntes, no contra el resumen del temario.
    for (const suyo of ['echo', 'interpolacion', 'var-dump', 'concatenar', 'tipo', 'foreach', 'acumulador']) {
      expect(enLaCeniza, `«${suyo}» sí es de La Ceniza`).toContain(suyo)
    }
    // Y lo que de verdad llega en el mundo siguiente: recorrer con clave.
    expect(glosarioHasta('tripulacion').map((cada) => cada.id)).toContain('array-asociativo')
  })

  it('lo que se marca en un texto es lo que ya se ha enseñado ahí', () => {
    for (const mundo of MUNDOS) {
      const permitidos = new Set(glosarioHasta(mundo.id).map((cada) => cada.id))
      const marcables = terminosBuscablesHasta(mundo.id)
      expect(marcables.every((cada) => permitidos.has(cada.id)), mundo.id).toBe(true)
      // Y del más largo al más corto, o «función flecha» nunca se detecta entera.
      const largos = marcables.map((cada) => cada.texto.length)
      expect(largos, mundo.id).toEqual([...largos].sort((a, b) => b - a))
    }
  })

  it('una ruta sin mundo no se queda sin glosario', () => {
    // Quedarse sin glosario por una ruta rara es peor que enseñar de más.
    expect(glosarioHasta('no-existe').length).toBe(glosarioDe('js').length)
    expect(glosarioHasta(undefined).length).toBeGreaterThan(0)
  })

  it('por su nombre se alcanza cualquier término, aunque no toque todavía', () => {
    // Una definición puede citar un término de más adelante, y dejar ese enlace
    // muerto sería peor que enseñarlo antes de tiempo.
    expect(entradaDe('herencia', 'js')).toBeTruthy()
    expect(entradaDe('foreach', 'php')).toBeTruthy()
    // Lo que no existe en ese camino sigue sin existir.
    expect(entradaDe('foreach', 'js')).toBeNull()
    expect(entradaDe('ref', 'php')).toBeNull()
  })
})

describe('el glosario partido por mundos, para la página', () => {
  it('cada camino con mundos trae sus grupos, en orden de juego', () => {
    for (const itinerario of CON_MUNDOS) {
      const grupos = glosarioPorMundos(itinerario.id)
      expect(grupos.length, itinerario.id).toBeGreaterThan(0)
      const orden = mundosDelItinerario(itinerario.id).map((cada) => cada.id)
      const salen = grupos.map((cada) => cada.mundo.id)
      expect(salen, itinerario.id).toEqual(orden.filter((id) => salen.includes(id)))
    }
  })

  it('los grupos suman exactamente el glosario del camino, sin repetir', () => {
    for (const itinerario of CON_MUNDOS) {
      const deLosGrupos = glosarioPorMundos(itinerario.id).flatMap((g) => g.entradas.map((e) => e.id))
      const delCamino = GLOSARIO.filter((cada) => cada.desde[itinerario.id]).map((cada) => cada.id)
      expect(new Set(deLosGrupos).size, itinerario.id).toBe(deLosGrupos.length)
      expect([...deLosGrupos].sort()).toEqual([...delCamino].sort())
    }
  })

  it('ningún mundo sale vacío: un grupo sin términos es un titular sin nada debajo', () => {
    for (const itinerario of CON_MUNDOS) {
      for (const grupo of glosarioPorMundos(itinerario.id)) {
        expect(grupo.entradas.length, `${itinerario.id}/${grupo.mundo.id}`).toBeGreaterThan(0)
      }
    }
  })

  it('y los ejemplos son del lenguaje del camino', () => {
    const dePhp = glosarioPorMundos('era1').flatMap((g) => g.entradas)
    expect(dePhp.find((cada) => cada.id === 'variable').ejemplo).toContain('$sombrero')
    const deJs = glosarioPorMundos('era2').flatMap((g) => g.entradas)
    expect(deJs.find((cada) => cada.id === 'variable').ejemplo).toContain('const')
  })
})
