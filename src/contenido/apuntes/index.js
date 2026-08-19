/**
 * Los apuntes de Wax, cargados cuando hacen falta y no antes.
 *
 * Cada apunte es la lección de su reto y son, con diferencia, lo más largo del
 * juego: hoy pesan más de tres veces lo que todo lo demás de un reto junto. Si
 * viajaran en el paquete inicial, cada lección que se escribiera haría más
 * lento el arranque para todo el mundo, incluido quien solo viene a mirar la
 * portada.
 *
 * Así que van aparte y se piden de uno en uno al abrir su reto. El navegador
 * los guarda en su caché después de la primera vez, y quien nunca abra un reto
 * de Vue 3 no se descargará jamás la lección de `provide`/`inject`.
 */
const modulos = import.meta.glob('./*.js')

/** Cuántos apuntes hay, sin cargar ninguno: las rutas se saben al compilar. */
export const CUANTOS_APUNTES = Object.keys(modulos).filter((r) => r !== './index.js').length

const rutaDe = (retoId) => `./${retoId}.js`

/** ¿Existe el apunte de ese reto? Se responde sin descargar nada. */
export const hayApunte = (retoId) => rutaDe(retoId) in modulos

/**
 * El apunte de un reto.
 * @returns {Promise<string|null>} el texto, o null si ese reto no tiene.
 */
export async function cargarApunte(retoId) {
  const cargador = modulos[rutaDe(retoId)]
  if (!cargador) return null
  return (await cargador()).default
}

let todos = null

/**
 * Todos los apuntes de golpe, para lo que necesite mirarlos juntos: hoy, el
 * corpus de Armonía. Se piden una sola vez y se quedan guardados, porque
 * construir su índice de búsqueda es lo caro, no traerlos.
 */
export async function cargarTodosLosApuntes() {
  if (todos) return todos

  const entradas = await Promise.all(
    Object.entries(modulos)
      .filter(([ruta]) => ruta !== './index.js')
      .map(async ([ruta, cargador]) => {
        const retoId = ruta.replace(/^\.\//, '').replace(/\.js$/, '')
        return [retoId, (await cargador()).default]
      }),
  )

  todos = Object.fromEntries(entradas)
  return todos
}
