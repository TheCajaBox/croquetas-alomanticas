import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

/**
 * Cargar en node **los mismos ficheros del sandbox** que juega la gente.
 *
 * `public/sandbox/aserciones.js` y `public/sandbox/nucleo-sql.js` son scripts
 * clásicos: no se pueden importar, se ejecutan encima de un objeto global. Eso
 * es exactamente lo que hace `importScripts` en el worker, así que aquí se hace
 * lo mismo a mano con un `new Function`.
 *
 * Es un aro por el que pasar, y merece la pena: la alternativa era reescribir
 * en la prueba lo que hace el sandbox, y entonces las pruebas comprobarían su
 * propia copia en vez de lo que se ejecuta al jugar.
 */
const require = createRequire(import.meta.url)

function cargarClasico(ruta, global) {
  const fuente = readFileSync(new URL(ruta, import.meta.url), 'utf8')
  new Function('self', `${fuente}`)(global)
}

let cacheado = null

/** El sandbox de SQL, montado una vez y reutilizado: SQLite tarda en arrancar. */
export async function sandboxSql() {
  if (cacheado) return cacheado

  const iniciar = require('sql.js')
  const SQL = await iniciar({
    // El `.wasm` de al lado del cargador, que es de donde `sql.js` lo saca en
    // node cuando nadie le dice otra cosa.
    locateFile: (fichero) => require.resolve(`sql.js/dist/${fichero}`),
  })

  const global = {}
  cargarClasico('../public/sandbox/aserciones.js', global)
  cargarClasico('../public/sandbox/nucleo-sql.js', global)

  cacheado = {
    SQL,
    /**
     * Corrige un envío como lo haría el worker y devuelve el mismo informe que
     * el juego recibe: `{ ok, tests, consola, error }`.
     */
    async corregir({ codigo, esquema, datos, tests, entradas }) {
      const api = global.crearAserciones({})
      let error = null
      // Interceptar la consola es lo que hace el worker de verdad
      // (`entorno-sql.js`) **antes** de corregir, y aquí faltaba: el resultado de
      // la consulta lo escribe `comoTabla` por consola, así que sin esto el
      // informe salía con `consola` vacía y esta ayuda decía ser fiel al
      // sandbox sin serlo. Se notó al comparar la tabla real con la que hay que
      // predecir: las ocho comparaciones daban vacío contra algo.
      const restaurar = api.interceptarConsola()
      try {
        await global.nucleoSql.corregir(SQL, { codigo, esquema, datos, tests, entradas }, api)
      } catch (fallo) {
        error = { mensaje: fallo?.message ?? String(fallo), sintaxis: !!fallo?.sintaxis }
      } finally {
        restaurar()
      }
      return {
        ok: !error && api.resultados.every((r) => r.ok),
        tests: api.resultados,
        consola: api.consola,
        error,
      }
    },
  }
  return cacheado
}
