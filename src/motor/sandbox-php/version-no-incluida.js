/**
 * El hueco de las versiones de PHP que el juego no lleva.
 *
 * Todas las que no son 8.5 se apuntan aquí con un alias, para que el
 * empaquetador no se lleve sus 20 MB de WebAssembly cada una. Si algún día un
 * reto pide otra versión, esto lo dice en voz alta en vez de fallar raro.
 */
const AVISO =
  'Este juego solo lleva PHP 8.5. Para usar otra versión hay que quitarle el alias en vite.config.js, ' +
  'y cada versión son unos 20 MB en el paquete publicado.'

export async function getPHPLoaderModule() {
  throw new Error(AVISO)
}

export async function getIntlExtensionPath() {
  throw new Error(AVISO)
}

export const jspi = async () => false
