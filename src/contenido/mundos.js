/**
 * Los mundos, en el orden en que se juegan.
 *
 * La cuesta va de menos a más y sin saltos: se lee un programa (El primer día),
 * se aprende a decidir y a repetir (La comisaría), se escribe JavaScript
 * moderno (Los Áridos), se sale de lo básico (El taller) y solo entonces
 * aparece Vue, primero la casa vieja y después la ciudad nueva. Cambio de forma
 * cierra reescribiendo todo lo anterior.
 *
 * Cada mundo declara de cuál depende en `requiere`, y de ahí sale el candado.
 * Ninguno se salta: quien llega a Vue sin saber qué es un objeto no aprende
 * Vue, sufre Vue.
 *
 * Y declara a qué **itinerario** pertenece (ver `contenido/itinerarios.js`). Los
 * de aquí son todos de la segunda era; los de la primera hablan otro lenguaje y
 * tienen su propia cuesta, que no se cruza con esta.
 */
export const MUNDOS = [
  {
    id: 'primer-dia',
    nombre: 'El primer día',
    subtitulo: 'Sin escribir una línea (casi)',
    itinerario: 'era2',
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
    id: 'comisaria',
    nombre: 'La comisaría',
    subtitulo: 'Decidir, repetir y guardar',
    itinerario: 'era2',
    entorno: 'worker',
    requiere: 'primer-dia',
    color: '#8ba3bd',
    anfitrion: 'steris',
    resumen:
      'Lo que hay debajo de todo lo demás: comparar, decidir, listas, bucles y objetos. Sin esto, el resto es magia.',
    presentacion:
      'Nadie sale a los Áridos sin saber leer un registro. Aquí se aprende a comparar dos cosas, a decidir con el resultado, a recorrer una lista sin saltarse a nadie y a guardar los datos de alguien en un solo sitio. No es lo llamativo. Es lo que sujeta lo llamativo.',
    despedida:
      'Ya sabes decidir, repetir y guardar. Con eso se escribe el noventa por ciento de todo lo que se escribe. Lo que viene ahora son formas más cómodas de hacer justo esto.',
  },
  {
    id: 'es6',
    nombre: 'Los Áridos',
    subtitulo: 'JavaScript ES6',
    itinerario: 'era2',
    entorno: 'worker',
    requiere: 'comisaria',
    color: '#c98b4b',
    resumen: 'Lo básico, sin ciudad y sin comodidades: variables, funciones, arrays y promesas.',
    presentacion:
      'Los Áridos. Aquí no hay ley, ni tranvías, ni nadie que te arregle el código por la noche. Se aprende a la primera o se aprende a base de disgustos.',
    despedida:
      'Se acabaron los Áridos. Ahora elige: la casa vieja o la ciudad nueva. Las dos enseñan lo mismo de dos maneras distintas, y conviene ver las dos.',
  },
  {
    id: 'taller',
    nombre: 'El taller',
    subtitulo: 'JavaScript de verdad',
    itinerario: 'era2',
    entorno: 'worker',
    requiere: 'es6',
    color: '#b06f6f',
    anfitrion: 'wax',
    resumen:
      'Lo que separa saber la sintaxis de saber programar: clases, errores, cierres, copias que no lo son y estructuras que no son listas.',
    presentacion:
      'Hasta aquí has aprendido a decir cosas en JavaScript. En el taller se aprende a construirlas: objetos que traen su propio comportamiento, errores que se recogen en vez de reventar, funciones que recuerdan, y las trampas de las copias, que es donde se pierden más tardes de las que nadie confiesa.',
    despedida:
      'Esto ya no es aprender un idioma, es tener oficio. Lo que viene ahora es Vue, y Vue no es más difícil que esto: es esto mismo, ordenado de otra manera.',
  },
  {
    id: 'elendel',
    nombre: 'Elendel',
    subtitulo: 'Fuera del archivo',
    itinerario: 'era2',
    entorno: 'worker',
    requiere: 'taller',
    color: '#a05a72',
    anfitrion: 'marasi',
    resumen:
      'Lo que rodea al lenguaje: módulos, JSON, expresiones regulares, fechas, números que engañan y el orden en que pasan las cosas.',
    presentacion:
      'Hasta ahora todo lo tuyo cabía en un archivo y hablaba solo consigo mismo. En la ciudad no funciona así: los datos llegan de fuera y en un formato que no elegiste, los expedientes se reparten entre despachos, y las cosas no ocurren en el orden en que las pediste. Nada de esto es JavaScript exactamente; es lo que hay alrededor. Y sin ello no se sale del ejercicio de clase.',
    despedida:
      'Ya sabes trabajar con lo que viene de fuera, que casi nunca viene como te gustaría. Eso es la mitad del oficio de verdad, y la mitad que no aparece en los tutoriales.',
  },
  {
    id: 'vue2',
    nombre: 'La mansión Ladrian',
    subtitulo: 'Vue 2 · Options API',
    itinerario: 'era2',
    entorno: 'vue2',
    requiere: 'taller',
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
    itinerario: 'era2',
    entorno: 'vue3',
    requiere: 'taller',
    color: '#4f9d8c',
    resumen: 'Otra forma de montar lo mismo: ref, reactive, setup y composables.',
    presentacion:
      'La Nueva Seran. Industria, raíles nuevos y gente convencida de que esta vez sí lo han hecho bien. Curiosamente, casi tienen razón.',
    despedida:
      'Ciudad nueva conquistada. Y ahora ya puedes discutir de las dos con conocimiento de causa, que es lo peligroso.',
  },
  {
    id: 'ferrocarril',
    nombre: 'El ferrocarril',
    subtitulo: 'Vue 3 · una aplicación entera',
    itinerario: 'era2',
    entorno: 'vue3',
    requiere: ['vue3', 'elendel'],
    color: '#3f7f96',
    anfitrion: 'steris',
    resumen:
      'Dejar de hacer componentes sueltos y montar algo con vías: huecos, referencias, estado compartido, rutas y composables de verdad.',
    presentacion:
      'Un componente suelto no es una aplicación, igual que un vagón no es una línea. Lo que falta es lo que los une: huecos para que otros metan lo suyo, un sitio donde guardar lo que necesitan todos, y un mapa que diga qué se enseña en cada momento. He preparado los horarios y las contingencias; lo que salga de aquí ya se parece a lo que se escribe en un trabajo.',
    despedida:
      'Ya sabes montar una aplicación, no solo componentes. A partir de aquí lo que queda no es aprender más piezas: es aprender a colocarlas, que es lo que hace MeLaan.',
  },
  {
    id: 'melaan',
    nombre: 'Cambio de forma',
    subtitulo: 'Reescribir lo que ya funciona',
    itinerario: 'era2',
    entorno: 'vue3',
    requiere: 'vue3',
    color: '#4fb89c',
    // Quien recibe al llegar. Los demás mundos los abre Wayne por defecto.
    anfitrion: 'melaan',
    resumen: 'El mismo comportamiento, otra forma. Bucles a métodos, promesas a async, Options API a Composition.',
    presentacion:
      'MeLaan puede ser cualquiera sin dejar de ser ella. Aquí se hace lo mismo con el código: nada de lo que escribas va a cambiar de comportamiento, solo de forma. Y eso, que suena a capricho, es la mitad del oficio.',
    despedida:
      'Ya sabes cambiar de forma sin cambiar de fondo. Es lo que más vas a hacer en un trabajo de verdad: casi nunca escribes algo desde cero, casi siempre reescribes algo que ya estaba.',
  },
]

export const MUNDOS_POR_ID = Object.fromEntries(MUNDOS.map((mundo) => [mundo.id, mundo]))

/** Los mundos de un itinerario, en el orden en que se juegan. */
export const mundosDelItinerario = (itinerarioId) =>
  MUNDOS.filter((mundo) => mundo.itinerario === itinerarioId)
