import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { baseDelSitio } from './scripts/base-del-sitio.mjs'

// La ruta base sale del nombre del repositorio y no está escrita a mano: ver
// scripts/base-del-sitio.mjs. Todo lo que apunte a public/ debe construir su
// ruta con import.meta.env.BASE_URL, nunca con una ruta absoluta a pelo.
/**
 * Deja fuera `icu.dat`, los 29 MB de datos de internacionalización de PHP.
 *
 * php-wasm los importa en su grafo aunque la extensión `intl` no se cargue
 * nunca -y aquí no se carga-, así que acababan en `dist/` pesando más que el
 * propio PHP. Se sustituyen por un fichero vacío: si algún día hace falta
 * `intl`, se quita este plugin y vuelven.
 */
function sinIcu() {
  const vacio = fileURLToPath(new URL('./src/motor/sandbox-php/icu-vacio.dat', import.meta.url))
  return {
    name: 'gatos-sin-icu',
    enforce: 'pre',
    resolveId(fuente, quienImporta) {
      if (!fuente.endsWith('icu.dat')) return null
      return this.resolve(vacio, quienImporta, { skipSelf: true })
    },
  }
}

export default defineConfig({
  base: baseDelSitio(),
  plugins: [vue(), sinIcu()],
  // El cargador de PHP hace `import ruta from './php_8_5.wasm'` y espera una
  // **URL**, no un módulo instanciado. Vite, por defecto, intenta lo segundo -la
  // propuesta de integración de wasm en ESM- y se cae buscando los imports del
  // binario. Declarándolo recurso, un import normal devuelve su URL, que es lo
  // que hace falta. Sin plugins: es lo que Vite ya sabe hacer.
  // Lo mismo vale para los otros ficheros que php-wasm importa como si fueran
  // módulos: `icu.dat` -30 MB de datos de internacionalización- y los `.so` de
  // sus extensiones. Declarados recurso, son URLs y no explotan el build.
  assetsInclude: ['**/*.wasm', '**/*.dat', '**/*.so'],
  // El worker de PHP se empaqueta como módulo y **en una pasada aparte, con sus
  // propios plugins**: los de arriba no llegan aquí, así que el que quita el
  // icu hay que dárselo también. Medido: sin esto, los 29 MB seguían saliendo.
  worker: { format: 'es', plugins: () => [sinIcu()] },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // PHP: el cargador de php-wasm importa las ocho versiones con un switch
      // dinámico, así que el empaquetador se lleva las ocho -unos 140 MB de
      // wasm-. Se recorta a la 8.5 y las demás van a un módulo que avisa.
      '@php-wasm/web-8-5': fileURLToPath(new URL('./src/motor/sandbox-php/solo-8-5.js', import.meta.url)),
      ...Object.fromEntries(
        ['5-2', '7-4', '8-0', '8-1', '8-2', '8-3', '8-4'].map((version) => [
          `@php-wasm/web-${version}`,
          fileURLToPath(new URL('./src/motor/sandbox-php/version-no-incluida.js', import.meta.url)),
        ]),
      ),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    // Los retos de Vue necesitan DOM; cada fichero elige su entorno con un
    // comentario @vitest-environment en la primera línea.
  },
})
