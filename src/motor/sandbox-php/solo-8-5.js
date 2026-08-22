/**
 * El cargador de PHP, recortado a una sola versión y una sola variante.
 *
 * `loadWebRuntime` de `@php-wasm/web` elige la versión con un `switch` de
 * importaciones dinámicas —5.2, 7.4, 8.0, 8.1, 8.2, 8.3, 8.4, 8.5— y el
 * empaquetador, que no sabe cuál se va a pedir, **mete las ocho**: unos 140 MB
 * de WebAssembly en `dist/`. Medido, no supuesto: el build se cayó arrastrando
 * `web-5-2`.
 *
 * Así que las otras siete se apuntan a este fichero con un alias (ver
 * `vite.config.js`) y aquí se carga solo lo que el juego usa: **PHP 8.5 en la
 * variante asyncify**. Asyncify y no jspi porque funciona en todos los
 * navegadores en vez de solo en los muy nuevos, y porque cargar las dos
 * variantes serían 40 MB en vez de 21.
 *
 * La ruta entra por `node_modules` a pelo a propósito: el paquete solo publica
 * su `index.js` en el mapa de exportaciones, y ese index es justamente el que
 * importa las dos variantes.
 */
export async function getPHPLoaderModule() {
  return import('../../../node_modules/@php-wasm/web-8-5/asyncify/php_8_5.js')
}

/** Lo pide `loadWebRuntime` para la extensión `intl`, que aquí no se usa. */
export async function getIntlExtensionPath() {
  throw new Error('El juego no carga la extensión intl de PHP.')
}

export const jspi = async () => false
