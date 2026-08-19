import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * De qué ruta cuelga el juego cuando está publicado.
 *
 * En GitHub Pages, un proyecto se sirve desde /nombre-del-repositorio/, así que
 * la ruta base depende de cómo se llame el repositorio. Estaba escrita a mano y
 * al renombrarlo se rompió la web entera: el HTML cargaba y todos sus ficheros
 * daban 404.
 *
 * Ahora se deduce, y por este orden:
 *
 *   1. BASE_JUEGO, por si hace falta forzarla a mano.
 *   2. GITHUB_REPOSITORY, que Actions define siempre al desplegar.
 *   3. El remoto de git, para que en local también salga bien.
 *   4. La raíz, que es lo correcto para un dominio propio.
 *
 * Con esto, renombrar el repositorio deja de romper nada.
 */
export function baseDelSitio() {
  if (process.env.BASE_JUEGO) return normalizar(process.env.BASE_JUEGO)

  if (process.env.GITHUB_REPOSITORY) {
    return normalizar(process.env.GITHUB_REPOSITORY.split('/').pop())
  }

  const desdeGit = nombreSegunElRemoto()
  return desdeGit ? normalizar(desdeGit) : '/'
}

function normalizar(nombre) {
  const limpio = String(nombre).replace(/^\/+|\/+$/g, '')
  return limpio ? `/${limpio}/` : '/'
}

function nombreSegunElRemoto() {
  try {
    const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
    const configuracion = readFileSync(join(raiz, '.git', 'config'), 'utf8')
    const url = configuracion.match(/url\s*=\s*(\S+)/)?.[1]
    return url?.replace(/\.git$/, '').split('/').pop() || null
  } catch {
    return null
  }
}
