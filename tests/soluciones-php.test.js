import { readFileSync } from 'node:fs'

import { PHP } from '@php-wasm/universal'
import { loadNodeRuntime } from '@php-wasm/node'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { RETOS } from '../src/contenido/retos/index.js'
import { codigoDeReferencia } from './revisarRetos.js'

/**
 * Las soluciones de referencia de los retos de PHP, **ejecutando PHP de verdad**.
 *
 * Con `@php-wasm/node`, que es el mismo motor que el navegador usa por
 * `@php-wasm/web`: mismo binario y misma versión, así que lo que pasa aquí pasa
 * allí. Y con los mismos dos ficheros que carga el sandbox del juego
 * -`aserciones.php` y `guion.php`- leídos de su sitio, sin copias que se
 * desincronicen.
 *
 * Sin esto, los tests de un reto de PHP serían texto que nadie ha ejecutado
 * nunca: pasarían por buenos hasta que alguien jugara.
 */
const ASERCIONES = readFileSync(new URL('../src/motor/sandbox-php/aserciones.php', import.meta.url), 'utf8')
const GUION = readFileSync(new URL('../src/motor/sandbox-php/guion.php', import.meta.url), 'utf8')
const MARCA = '__GATOS__'

const retosDePhp = RETOS.filter((reto) => reto.entorno === 'php')

let php = null

beforeAll(async () => {
  // El identificador de proceso lo inventa el paquete cuando corre dentro de
  // vitest; fuera hay que dárselo a mano para que dos workers no se pisen los
  // cerrojos de ficheros.
  php = new PHP(await loadNodeRuntime('8.5'))
}, 60_000)

afterAll(() => {
  php = null
})

/** Lo mismo que hace `sandbox-php/php.worker.js`, pero en node. */
async function correr(reto, fuente) {
  php.mkdir('/gatos')
  php.writeFile('/gatos/jugador.php', fuente)
  php.writeFile('/gatos/tests.json', JSON.stringify(reto.tests ?? []))
  php.writeFile('/gatos/requisitos.json', JSON.stringify(reto.requisitos ?? []))
  php.writeFile('/gatos/aserciones.php', ASERCIONES)
  php.writeFile('/gatos/guion.php', GUION)

  const salida = await php.runStream({ scriptPath: '/gatos/guion.php' })
  const texto = await salida.stdoutText
  const marca = texto.lastIndexOf(MARCA)
  if (marca === -1) throw new Error(`PHP no ha devuelto informe. Ha dicho: ${texto.slice(0, 300)}`)
  return JSON.parse(texto.slice(marca + MARCA.length))
}

describe('las soluciones de referencia de los retos de PHP resuelven sus retos', () => {
  it('hay retos de PHP', () => {
    expect(retosDePhp.length).toBeGreaterThan(0)
  })

  for (const reto of retosDePhp) {
    it(`${reto.id}: ${reto.titulo}`, async () => {
      const informe = await correr(reto, codigoDeReferencia(reto))

      expect(informe.error, 'la solución de referencia revienta').toBe(null)

      const incumplidos = informe.requisitos.filter((r) => !r.cumplido).map((r) => r.tipo)
      expect(incumplidos, 'la solución de referencia no cumple los requisitos del propio reto').toEqual([])

      const rojos = informe.tests.filter((t) => !t.ok)
      expect(rojos.map((t) => `${t.nombre}: ${t.mensaje}`), 'tests en rojo').toEqual([])
      expect(informe.tests.length, 'un reto de escribir sin tests no comprueba nada').toBeGreaterThan(0)
    }, 30_000)
  }
})

describe('el sandbox de PHP distingue lo que tiene que distinguir', () => {
  const reto = { tests: [{ nombre: 'suma', codigo: 'esperar(sumar([1, 2]))->igualA(3);' }] }

  it('un test que falla lo dice con las mismas palabras que en JavaScript', async () => {
    const informe = await correr(reto, '<?php function sumar($n) { return 99; }')
    expect(informe.tests[0].ok).toBe(false)
    expect(informe.tests[0].mensaje).toContain('Esperaba que el valor fuera 3, pero es 99.')
  })

  it('la sintaxis rota es sintaxis rota, no un test en rojo', async () => {
    const informe = await correr(reto, '<?php function mal( { }')
    expect(informe.error?.sintaxis).toBe(true)
    expect(informe.tests).toEqual([])
  })

  it('un requisito incumplido vuelve con su mensaje, que es lo que se pinta', async () => {
    // El panel de resultados pinta `mensaje`. Devolviendo `texto` la lista de
    // normas incumplidas salía con las viñetas vacías: estaba, sin una palabra.
    const informe = await correr(
      { tests: [], requisitos: [{ tipo: 'usaPalabra', valor: 'foreach', texto: 'Usa `foreach`' }] },
      '<?php $x = 1;',
    )
    expect(informe.requisitos[0].cumplido).toBe(false)
    expect(informe.requisitos[0].mensaje).toBe('Usa `foreach`')
  })

  it('y si el reto se olvida de explicar la norma, la explica el sandbox', async () => {
    const informe = await correr(
      { tests: [], requisitos: [{ tipo: 'prohibeLlamada', valor: 'array_sum' }] },
      '<?php echo array_sum([1]);',
    )
    expect(informe.requisitos[0].mensaje).toContain('array_sum')
  })

  it('los requisitos se miran por tokens, no por texto suelto', async () => {
    // «array_sum» dentro de un comentario o de una cadena no es una llamada, y
    // buscarlo con una expresión regular lo marcaría igual.
    const conRequisito = {
      tests: [],
      requisitos: [{ tipo: 'prohibeLlamada', valor: 'array_sum', texto: 'Sin array_sum' }],
    }

    const disimulando = await correr(
      conRequisito,
      "<?php\n// aquí no se usa array_sum\n$aviso = 'ni array_sum tampoco';\n",
    )
    expect(disimulando.requisitos[0].cumplido, 'lo ha marcado estando en un comentario').toBe(true)

    const usandola = await correr(conRequisito, '<?php function sumar($n) { return array_sum($n); }')
    expect(usandola.requisitos[0].cumplido).toBe(false)
  })
})
