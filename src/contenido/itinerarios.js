/**
 * Los itinerarios: caminos de aprendizaje completos, cada uno con su lenguaje.
 *
 * Un itinerario es un juego entero dentro del juego: sus mundos, su temario, su
 * narrador y su lenguaje. Se eligen en la entrada y no compiten entre ellos —no
 * hay que terminar uno para empezar el otro— porque enseñan cosas distintas y a
 * nadie hay que obligarle a aprender JavaScript para poder aprender PHP.
 *
 * Lo que **sí** comparten, y a propósito: las croquetas, la colonia de gatos,
 * los sombreros, los recortes y las insignias. Es un solo juego con dos
 * temarios, no dos juegos que se instalan aparte.
 *
 * `lenguaje` es lo que decide con qué se ejecuta el código del jugador (ver
 * `motor/lenguajes/`). `narrador` es quien comenta lo que haces: Wayne no pinta
 * nada en la primera era, y Vin no habría hecho ni un chiste en la segunda.
 */
export const ITINERARIOS = [
  {
    id: 'era2',
    nombre: 'La segunda era',
    lenguaje: 'js',
    etiquetaLenguaje: 'JavaScript · Vue',
    // El de la etiqueta lleva un punto medio y no se puede meter en una frase.
    lenguajeEnFrase: 'JavaScript y Vue',
    narrador: 'wayne',
    retrato: 'wayne',
    color: '#c98b4b',
    resumen:
      'Del primer «qué es una variable» a montar una aplicación entera de Vue, pasando por lo que rodea al lenguaje.',
    promesa: 'Al salir sabrás escribir JavaScript moderno y montar interfaces con Vue 2 y Vue 3.',
    ambiente: 'Elendel, los Áridos y el ferrocarril. Narra Wayne, y cobra por las pistas.',
    presentacion:
      'Wayne lo cuenta todo, se ríe de lo que haces y te vende pistas a precio de amigo. Wax escribe los apuntes, Steris traduce los errores que asustan, Marasi te revisa el código y Armonía contesta dudas sin darte nunca la solución.',
  },
  {
    id: 'era1',
    nombre: 'La primera era',
    lenguaje: 'php',
    etiquetaLenguaje: 'PHP',
    lenguajeEnFrase: 'PHP',
    narrador: 'vin',
    retrato: null,
    color: '#a8a2bd',
    resumen:
      'PHP desde cero: lo que mueve media web y casi nadie enseña con orden. Del primer echo a las clases.',
    promesa: 'Al salir sabrás escribir PHP moderno y estructurar un programa en clases.',
    ambiente: 'Ceniza, bruma y una tripulación que no se fía de nadie. Narra Vin, y no hace chistes.',
    presentacion:
      'Vin comprueba lo que haces y no felicita casi nunca. Sazed escribe los apuntes y contesta dudas —todavía no lo sabe todo, y lo dice—, Kelsier te vende las pistas, Brisa te revisa el código y Dockson traduce los errores.',
  },
]

export const ITINERARIOS_POR_ID = Object.fromEntries(ITINERARIOS.map((cada) => [cada.id, cada]))

/** El itinerario por defecto: el que se ofrece primero y el de quien llega de nuevas. */
export const ITINERARIO_POR_DEFECTO = ITINERARIOS[0].id
