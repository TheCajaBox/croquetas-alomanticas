/**
 * Copia a public/vendor/ los motores que se cargan con `<script src>`: los
 * runtimes UMD de Vue 2 y Vue 3, y SQLite compilado a WebAssembly.
 *
 * Los sandboxes que ejecutan el código del jugador son HTML estático servido
 * desde nuestro propio dominio: no pueden importar del bundle ni tirar de una
 * CDN (el juego tiene que funcionar sin red). Así que copiamos aquí las builds
 * completas -con compilador de plantillas, que los retos usan `template`- y
 * los runners las cargan con un <script src>.
 *
 * Usamos las builds de DESARROLLO a propósito: sus avisos ("evita usar un valor
 * no primitivo como key", "posible bucle de actualización infinito") son parte
 * del material didáctico, y la build de producción los elimina.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const destino = join(raiz, 'public', 'vendor')

const runtimes = [
  { desde: 'node_modules/vue2/dist/vue.js', hasta: 'vue2.js', etiqueta: 'Vue 2.7' },
  { desde: 'node_modules/vue/dist/vue.global.js', hasta: 'vue3.js', etiqueta: 'Vue 3' },
  // SQLite entero, 658 kB de WebAssembly y un cargador de 46. Va aquí y no por
  // el empaquetador porque su cargador es un script clásico -de los que
  // `importScripts` entiende-, igual que los de Vue: PHP es el único que
  // necesitó un *module worker*, y fue por su `import` del `.wasm`.
  { desde: 'node_modules/sql.js/dist/sql-wasm.js', hasta: 'sql-wasm.js', etiqueta: 'SQLite (cargador)' },
  { desde: 'node_modules/sql.js/dist/sql-wasm.wasm', hasta: 'sql-wasm.wasm', etiqueta: 'SQLite (wasm)' },
]

mkdirSync(destino, { recursive: true })

for (const { desde, hasta, etiqueta } of runtimes) {
  const origen = join(raiz, desde)
  if (!existsSync(origen)) {
    console.error(`\n  No encuentro el runtime de ${etiqueta} en ${desde}.`)
    console.error('  Ejecuta `npm install` antes de compilar o arrancar el juego.\n')
    process.exit(1)
  }
  copyFileSync(origen, join(destino, hasta))
  console.log(`  runtime de ${etiqueta} -> public/vendor/${hasta}`)
}
