/**
 * Vocabulario compartido entre el juego y los sandboxes.
 *
 * Ojo: public/sandbox/runner-comun.js repite estas cadenas a mano. No puede
 * importarlas -es un script clásico servido tal cual desde public/-, así que
 * si se tocan aquí hay que tocarlas allí.
 */
export const MENSAJES = {
  LISTO: 'gatos:listo',
  EJECUTAR: 'gatos:ejecutar',
  RESULTADO: 'gatos:resultado',
}

/** Tiempo que le damos al código del jugador antes de dar por hecho que se ha colgado. */
export const TIEMPO_LIMITE_MS = 3000

/**
 * Y cuánto se le da en el primer envío de un entorno que tiene que arrancar un
 * motor entero. PHP son 20 MB de WebAssembly: con los 3 segundos de siempre, el
 * primer «Ejecutar» de cada sesión salía por «se ha colgado» aunque el código
 * estuviera perfecto. El worker se pone a descargar al nacer, así que este
 * margen solo se gasta de verdad la primera vez y con conexión mala.
 *
 * Cada entorno dice el suyo en `arranqueMs`, porque no cuestan lo mismo: SQLite
 * son 658 kB y con 60 segundos de margen un `WITH RECURSIVE` que no termina
 * tardaría un minuto en dar la cara justo en el primer intento, que es cuando
 * más falta hace que lo dé.
 */
export const TIEMPO_LIMITE_ARRANQUE_MS = 60_000

/** Rutas de los sandboxes, siempre relativas a la base para que funcione en GitHub Pages. */
export function rutaDeSandbox(archivo) {
  return `${import.meta.env.BASE_URL}sandbox/${archivo}`
}

/**
 * Los entornos: dónde se ejecuta el código de un reto y en qué lenguaje.
 *
 * `canal` dice por dónde se habla con él:
 *
 * - `worker` — un Web Worker clásico que carga un fichero de `public/sandbox/`
 *   con `importScripts`. No pinta nada y `terminate()` lo corta en seco.
 * - `iframe` — un documento con DOM, que es lo que Vue necesita para montar.
 * - `modulo` — un Web Worker **empaquetado por Vite**. Lo usa PHP y no por
 *   gusto: su cargador es un módulo ES que importa el `.wasm`, así que necesita
 *   un empaquetador que resuelva esa importación a una URL.
 *
 * `lenguaje` elige el frente que revisa el código antes de ejecutarlo (ver
 * `motor/lenguajes/`). Un entorno sin frente falla al arrancar en vez de caer
 * en el de JavaScript por descarte.
 */
export const ENTORNOS = {
  worker: { etiqueta: 'JavaScript', lenguaje: 'js', canal: 'worker', archivo: 'entorno-es6.js' },
  vue2: { etiqueta: 'Vue 2', lenguaje: 'js', canal: 'iframe', archivo: 'runner-vue2.html' },
  vue3: { etiqueta: 'Vue 3', lenguaje: 'js', canal: 'iframe', archivo: 'runner-vue3.html' },
  php: { etiqueta: 'PHP', lenguaje: 'php', canal: 'modulo', arranqueMs: TIEMPO_LIMITE_ARRANQUE_MS },
  // SQLite entero en un worker clásico. Su cargador es un script de los de
  // siempre, así que entra por `importScripts` como los de Vue: 658 kB de
  // WebAssembly frente a los 20 MB de PHP, y por eso no hace falta tratarlo
  // como un arranque lento.
  sql: { etiqueta: 'SQL', lenguaje: 'sql', canal: 'worker', archivo: 'entorno-sql.js', arranqueMs: 15_000 },
}
