import { readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join } from 'node:path'

/**
 * El índice de retos, generado al compilar.
 *
 * ## El problema que resuelve
 *
 * El catálogo se montaba con `import.meta.glob(..., { eager: true })`, así que
 * los retos viajaban **enteros** en el paquete principal: enunciado, código de
 * partida, solución, tests, pistas y explicaciones incluidos. Medido sobre los
 * 102 retos de entonces: **9,2 kB era lo que el índice necesitaba de verdad y
 * 233,8 kB el cuerpo**, que solo hace falta al abrir el reto. Una proporción de
 * 25 a 1, y empeorando con cada mundo nuevo.
 *
 * Así que el índice lleva solo la **ficha** —lo justo para pintar listas,
 * candados, insignias y el contador de avance— y el cuerpo se pide al abrir el
 * reto, igual que los apuntes.
 *
 * ## Por qué un plugin y no otra cosa
 *
 * La forma evidente sería que cada reto exportara dos cosas: `ficha` ansiosa y
 * el resto en diferido. No funciona: el módulo tendría un import estático y
 * otro dinámico a la vez, y entonces Rollup **no lo separa** y vuelve al
 * paquete principal. Es el aviso que ya sale con `apuntes/index.js`.
 *
 * La otra forma sería un índice generado y versionado, y habría que acordarse
 * de regenerarlo con cada reto. Quedan unos 170 por escribir y el README
 * promete que añadir un reto es crear su fichero y nada más.
 *
 * Así que se genera aquí: se importan los retos en Node al compilar y se emite
 * un módulo virtual con las fichas. El cuerpo no se toca; lo carga
 * `retos/index.js` con un glob perezoso.
 */
const ID = 'virtual:fichas-de-retos'
const RESUELTO = `\0${ID}`

/**
 * Lo que se queda en el paquete principal, y nada más.
 *
 * `requisitos` está aquí a propósito, aunque abulte: los lee el oído fino de
 * Estaño mientras escribes y los lee Armonía para decirte qué norma te falta.
 * Son reglas que el reto ya te enseña, y dejarlas en el cuerpo obligaría a
 * esperar una descarga para las dos cosas.
 */
export const CAMPOS_DE_LA_FICHA = [
  'id',
  'mundo',
  'entorno',
  'tipo',
  'titulo',
  'jefe',
  // Un acto de un final de itinerario. Lo necesita la lista del mundo para
  // etiquetarlo, y las pruebas para saber que no lleva pistas.
  'acto',
  'recompensa',
  'requisitos',
]

/** Las rutas de los retos, relativas a la carpeta de retos, en orden estable. */
function rutasDeRetos(carpeta) {
  const rutas = []
  for (const mundo of readdirSync(carpeta, { withFileTypes: true })) {
    if (!mundo.isDirectory()) continue
    for (const fichero of readdirSync(join(carpeta, mundo.name)).sort()) {
      if (fichero.endsWith('.js')) rutas.push(`./${mundo.name}/${fichero}`)
    }
  }
  return rutas.sort()
}

export function fichasDeRetos() {
  const carpeta = fileURLToPath(new URL('../src/contenido/retos/', import.meta.url))

  /** La ficha de cada reto, importándolos de verdad: nada de leer el fichero a ojo. */
  async function generar() {
    const fichas = []
    for (const ruta of rutasDeRetos(carpeta)) {
      const modulo = await import(`${pathToFileURL(join(carpeta, ruta)).href}?t=${Date.now()}`)
      const reto = modulo.default
      if (!reto?.id) throw new Error(`El reto ${ruta} no exporta un reto con id`)

      const ficha = { ruta }
      for (const campo of CAMPOS_DE_LA_FICHA) {
        if (reto[campo] !== undefined) ficha[campo] = reto[campo]
      }
      fichas.push(ficha)
    }
    return `export const FICHAS = ${JSON.stringify(fichas)}\n`
  }

  return {
    name: 'gatos-fichas-de-retos',
    resolveId(fuente) {
      return fuente === ID ? RESUELTO : null
    },
    load(id) {
      return id === RESUELTO ? generar() : null
    },
    // En desarrollo, añadir o tocar un reto tiene que rehacer el índice. Sin
    // esto habría que reiniciar el servidor cada vez que se escribe un reto,
    // que es justo lo que va a pasar unas 170 veces.
    configureServer(servidor) {
      const rehacer = (fichero) => {
        if (!fichero.includes('/contenido/retos/')) return
        const modulo = servidor.moduleGraph.getModuleById(RESUELTO)
        if (!modulo) return
        servidor.moduleGraph.invalidateModule(modulo)
        servidor.ws.send({ type: 'full-reload' })
      }
      servidor.watcher.on('add', rehacer)
      servidor.watcher.on('unlink', rehacer)
      servidor.watcher.on('change', rehacer)
    },
  }
}
