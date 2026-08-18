/**
 * Los tres mundos.
 *
 * Los Áridos son la base común. A partir de ahí la campaña se bifurca en dos
 * rutas independientes que se pueden jugar en el orden que se quiera: la casa
 * vieja (Vue 2, Options API) y la ciudad nueva (Vue 3, Composition API).
 */
export const MUNDOS = [
  {
    id: 'primer-dia',
    nombre: 'El primer día',
    subtitulo: 'Sin escribir una línea (casi)',
    entorno: 'worker',
    requiere: null,
    color: '#7fb2d8',
    resumen: 'Qué es una variable, qué tipos hay y cómo se lee un programa. Se señala y se coloca más que se escribe.',
    presentacion:
      'Antes de salir a los Áridos hay que aprender un par de cosas, y aquí casi no se escribe: se elige, se empareja y se colocan piezas. Wax ha dejado sus apuntes debajo de cada reto, y esos no se pagan.',
    despedida:
      'Ya sabes leer un programa. Ahora toca escribirlos, que es parecido pero con más disgustos.',
  },
  {
    id: 'es6',
    nombre: 'Los Áridos',
    subtitulo: 'JavaScript ES6',
    entorno: 'worker',
    requiere: 'primer-dia',
    color: '#c98b4b',
    resumen: 'Lo básico, sin ciudad y sin comodidades: variables, funciones, arrays y promesas.',
    presentacion:
      'Los Áridos. Aquí no hay ley, ni tranvías, ni nadie que te arregle el código por la noche. Se aprende a la primera o se aprende a base de disgustos.',
    despedida:
      'Se acabaron los Áridos. Ahora elige: la casa vieja o la ciudad nueva. Las dos enseñan lo mismo de dos maneras distintas, y conviene ver las dos.',
  },
  {
    id: 'vue2',
    nombre: 'La mansión Ladrian',
    subtitulo: 'Vue 2 · Options API',
    entorno: 'vue2',
    requiere: 'es6',
    color: '#8f6fb0',
    resumen: 'Todo va por su sitio y su nombre: data, methods, computed, watch. Y sus manías.',
    presentacion:
      'La mansión Ladrian. Todo tiene su cajón y su etiqueta, funciona desde hace años y tiene unas cuantas manías que más vale conocer antes de tocar nada.',
    despedida:
      'Casa vieja domada. Ahora ya sabes por qué la gente le tiene cariño y por qué otros querían cambiarla.',
  },
  {
    id: 'vue3',
    nombre: 'La Nueva Seran',
    subtitulo: 'Vue 3 · Composition API',
    entorno: 'vue3',
    requiere: 'es6',
    color: '#4f9d8c',
    resumen: 'Otra forma de montar lo mismo: ref, reactive, setup y composables.',
    presentacion:
      'La Nueva Seran. Industria, raíles nuevos y gente convencida de que esta vez sí lo han hecho bien. Curiosamente, casi tienen razón.',
    despedida:
      'Ciudad nueva conquistada. Y ahora ya puedes discutir de las dos con conocimiento de causa, que es lo peligroso.',
  },
]

export const MUNDOS_POR_ID = Object.fromEntries(MUNDOS.map((mundo) => [mundo.id, mundo]))
