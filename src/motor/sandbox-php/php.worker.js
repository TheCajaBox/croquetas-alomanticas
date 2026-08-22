/**
 * El sandbox de PHP: un Web Worker con PHP 8.5 compilado a WebAssembly.
 *
 * Va empaquetado por Vite y no en `public/sandbox/` como los runners de Vue, y
 * no por gusto: el cargador de `@php-wasm/web` es un módulo ES que hace
 * `import … from './php_8_5.wasm'`, así que **necesita un empaquetador** que
 * resuelva eso a una URL. La contrapartida es buena: al estar empaquetado puede
 * importar el protocolo de verdad en vez de repetir sus cadenas a mano.
 *
 * El binario son 20 MB. Se pide en diferido, dentro del primer mensaje, así que
 * quien no entre en el itinerario de PHP no lo descarga nunca.
 */
import { MENSAJES } from '../protocolo.js'
// Los dos guiones de PHP viven en ficheros aparte y entran aquí como texto, para
// poder escribirlos como PHP de verdad -con resaltado y sin escapar nada- en vez
// de como una cadena gigante dentro de JavaScript.
import ASERCIONES from './aserciones.php?raw'
import GUION from './guion.php?raw'

/** Dónde vive todo dentro del sistema de ficheros del sandbox. */
const CASA = '/gatos'

let php = null
let arrancando = null

/**
 * Avisa de que el worker ya escucha, **antes** de tener PHP cargado.
 *
 * El puente espera este mensaje para poder mandar el primer trabajo, y espera
 * sin límite: si no llega, se queda ahí para siempre y la pantalla se queda en
 * «Ejecutando…». Pasó, y el síntoma no decía nada.
 */
self.postMessage({ tipo: MENSAJES.LISTO })

/**
 * Y se pone a descargar PHP en cuanto nace, sin esperar a que nadie ejecute
 * nada: son 20 MB, y el worker se crea al abrir el reto, así que la descarga
 * ocurre mientras se lee el enunciado.
 */
arrancarPhp().catch(() => {})

async function arrancarPhp() {
  if (php) return php
  if (arrancando) return arrancando
  arrancando = (async () => {
    const [{ PHP }, { loadWebRuntime }] = await Promise.all([
      import('@php-wasm/universal'),
      import('@php-wasm/web'),
    ])
    php = new PHP(await loadWebRuntime('8.5'))
    return php
  })()

  return arrancando
}

self.addEventListener('message', async (evento) => {
  const { tipo, id, codigo, tests = [], requisitos = [] } = evento.data ?? {}
  if (tipo !== MENSAJES.EJECUTAR) return

  try {
    const motor = await arrancarPhp()
    const respuesta = await ejecutar(motor, { codigo, tests, requisitos })
    self.postMessage({ tipo: MENSAJES.RESULTADO, id, ...respuesta })
  } catch (error) {
    self.postMessage({
      tipo: MENSAJES.RESULTADO,
      id,
      ok: false,
      tests: [],
      consola: [],
      requisitos: [],
      error: { mensaje: error?.message ?? String(error) },
    })
  }
})

/** Marca por la que el guion de PHP devuelve su informe, para no confundirlo con la salida. */
const MARCA = '__GATOS__'

async function ejecutar(motor, { codigo, tests, requisitos }) {
  motor.mkdir(CASA)
  motor.writeFile(`${CASA}/jugador.php`, codigo)
  motor.writeFile(`${CASA}/tests.json`, JSON.stringify(tests))
  motor.writeFile(`${CASA}/requisitos.json`, JSON.stringify(requisitos))
  motor.writeFile(`${CASA}/aserciones.php`, ASERCIONES)
  motor.writeFile(`${CASA}/guion.php`, GUION)

  const salida = await motor.runStream({ scriptPath: `${CASA}/guion.php` })
  const texto = await salida.stdoutText

  const marca = texto.lastIndexOf(MARCA)
  if (marca === -1) {
    return {
      ok: false,
      tests: [],
      consola: texto ? texto.split('\n') : [],
      requisitos: [],
      error: { mensaje: texto.trim() || 'PHP no ha contestado nada.' },
    }
  }

  const informe = JSON.parse(texto.slice(marca + MARCA.length))
  return {
    ok: informe.tests.length > 0 && informe.tests.every((t) => t.ok),
    tests: informe.tests,
    consola: informe.consola ? informe.consola.split('\n').filter(Boolean) : [],
    requisitos: informe.requisitos ?? [],
    error: informe.error ?? null,
  }
}
