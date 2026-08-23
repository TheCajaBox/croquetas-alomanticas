/**
 * Raoden, que narra Elantris.
 *
 * El que llega al peor sitio imaginable y a la semana siguiente ya tiene a
 * treinta personas con un oficio cada una. No consuela: reparte trabajo, que es
 * su manera de consolar. Ve el patrón antes que nadie y lo dice en voz alta para
 * que los demás lo vean también, nunca para demostrar que él lo vio primero.
 *
 * Su registro es **cálido y concreto**: donde Wayne haría una broma y Brisa
 * daría tres vueltas, Raoden dice qué hay que hacer ahora. Y no miente sobre lo
 * difícil que es: dice que es difícil y a continuación por dónde se empieza.
 *
 * El hilo de su itinerario es el aon: una figura que, trazada bien, hace algo, y
 * trazada mal no hace nada. Una consulta es exactamente eso, y Raoden lo repite
 * porque es verdad.
 */
const LINEAS_DE_RAODEN = {
  // Como **anfitrión** de Kae: lo que dice al recibirte en su mundo. Está
  // aparte de `bienvenida` -que es lo que dice al abrir el camino- porque son
  // dos momentos distintos y hay una prueba que exige los dos.
  presentacion: [
    'Raoden. Esto son los registros de Kae: quién vive dónde, quién le vende a quién y por cuánto. Vamos a aprender a preguntarles cosas, y vamos a empezar por lo que casi nadie enseña, que es preguntar bien.',
  ],

  bienvenida: [
    'Bienvenido a Elantris. Aquí dentro nada funciona por si mismo y todo funciona si alguien se pone. Vamos a preguntarle cosas a una base de datos, que es más parecido a trazar un aon de lo que parece: la figura entera está bien o no hace nada.',
    'Raoden. Antes de que te lo preguntes: sí, esto se aprende, y no, no hace falta talento. Hace falta trazar la línea, mirar lo que sale, y corregir. Ese es el oficio entero.',
  ],

  entrarAlMundo: [
    'Un sitio nuevo. Lo primero es mirar qué hay: las tablas, sus columnas y qué guarda cada una. Nadie pregunta bien sin saber a qué está preguntando.',
    'Aquí se aprende una cosa cada vez y ninguna se olvida por el camino. Lo que veas hoy lo vas a usar mañana y pasado.',
    'Vamos a ello. Y si algo no sale, no es que no valgas: es que falta una línea, y las líneas se encuentran.',
  ],

  primerIntento: [
    'Primera consulta. Aunque salga vacía, ya sabes algo que no sabías: que la base te ha entendido.',
    'Adelante. Lo peor que puede pasar es que te diga que no, y eso también es información.',
  ],

  testFallado: [
    'Ha devuelto algo, pero no lo que se pedía. Eso es buena señal: el problema está en lo que pides, no en cómo lo escribes.',
    'Mira las filas que han salido y las que tenían que salir, y busca la diferencia. Casi siempre es una condición de más o de menos.',
    'Casi. Cuando una consulta devuelve **demasiado**, sospecha del `WHERE`; cuando devuelve **de menos**, sospecha de la misma línea por el otro lado.',
  ],

  errorDeSintaxis: [
    'La base no te entiende. Fíjate en lo que hay justo antes de donde se ha parado: casi nunca el fallo está donde te lo señala, está una palabra antes.',
    'Una coma, una comilla o una palabra donde no toca. Es el aon con una línea de más: no hace nada malo, simplemente no hace nada.',
  ],

  requisitoIncumplido: [
    'Devuelve lo correcto y no es la consulta que te pido. Aquí importa cómo: la consulta que sale por el camino corto hoy es la que mañana no se puede tocar.',
    'Funciona, y no vale. Este reto no busca el resultado, busca la forma de llegar a él.',
  ],

  tiempoAgotado: [
    'Eso no termina. Una consulta puede pedirle a la base más trabajo del que hay tiempo en el mundo: mira si has cruzado dos tablas sin decirle por dónde.',
    'Sigue pensando y no vuelve. Si hay un `WITH RECURSIVE` ahí dentro, comprueba que tenga un final.',
  ],

  retoSuperado: [
    'Hecho. La consulta está trazada y hace lo que tenía que hacer.',
    'Ahí está. Y lo importante no es que haya salido: es que sabes por qué ha salido.',
    'Bien. Guarda esa forma en la cabeza, que la vas a volver a usar dentro de dos retos.',
  ],

  superadoSinPistas: [
    'Sin ayuda. Eso significa que la idea ya estaba, solo había que ponerla en orden.',
    'A la primera y sin preguntar. Apunta lo que has hecho: es tuyo.',
  ],

  jefeDerrotado: [
    'Eso era el difícil, y ha caído. Lo que has usado ahí no era una cosa nueva: era todo lo anterior a la vez.',
    'Ya está. Este es el momento en que se nota que un mundo se ha quedado: no por lo que has aprendido hoy, por lo que has usado de antes sin pensarlo.',
  ],

  sinCroquetas: [
    'Sin croquetas. Resuelve uno sin pistas y vuelves a tener; los hay más fáciles de lo que recuerdas.',
  ],

  inactividad: [
    'Sigo aquí. Cuando una consulta no sale, lo que suele faltar no es una idea: es mirar qué hay de verdad en las tablas.',
    'Si te has atascado, prueba a preguntar menos: quita condiciones hasta que salga algo y luego ponlas de una en una.',
  ],

  charla: [
    'Un aon mal trazado no explota. Simplemente no pasa nada, y eso es más difícil de arreglar que un error.',
    'La base de datos nunca discute: contesta exactamente lo que le preguntas. El arte está en preguntar lo que querías preguntar.',
    'Aquí dentro todo el mundo servía para algo, y lo difícil era averiguar para qué. Con las columnas de una tabla pasa igual.',
    'Pedir «todo» es pedir lo que todavía no existe: el día que la tabla gane una columna, tu informe cambiará sin que lo hayas tocado.',
  ],

  mundoCompletado: [
    'Mundo cerrado. Ahora sabes preguntar cosas que hace una hora no sabías ni nombrar.',
    'Terminado. Y fíjate en una cosa: no has aprendido consultas, has aprendido a mirar los datos y ver qué hay dentro.',
  ],
}

export default LINEAS_DE_RAODEN
