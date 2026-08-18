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

/** Rutas de los sandboxes, siempre relativas a la base para que funcione en GitHub Pages. */
export function rutaDeSandbox(archivo) {
  return `${import.meta.env.BASE_URL}sandbox/${archivo}`
}

export const ENTORNOS = {
  worker: { etiqueta: 'JavaScript', archivo: 'entorno-es6.js' },
  vue2: { etiqueta: 'Vue 2', archivo: 'runner-vue2.html' },
  vue3: { etiqueta: 'Vue 3', archivo: 'runner-vue3.html' },
}
