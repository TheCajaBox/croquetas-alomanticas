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
 * Tiene humor, pero es el suyo: seco, corto y casi siempre a su propia costa.
 * Un príncipe que ha acabado organizando cuadrillas de gente hambrienta en una
 * ciudad en ruinas no se toma a sí mismo demasiado en serio, y esa es la única
 * broma que se permite. Nunca se ríe de quien está aprendiendo.
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
    'Raoden. Los escribas de Kae llevan trescientos años apuntando todo lo que pasa en esta ciudad y ni uno ha aprendido a leer lo que apuntaba. Ahí entras tú.',
    'Soy Raoden. Antes tenía un palacio y ahora tengo unas cuadrillas, un almacén y estos registros. De las tres cosas, los registros son la que más manda.',
    'Raoden. Te recibo yo porque este sitio es mío, y digo «mío» como se dice de una habitación que has barrido tú: nadie me la ha dado.',
  ],

  bienvenida: [
    'Bienvenido a Elantris. Aquí dentro nada funciona por si mismo y todo funciona si alguien se pone. Vamos a preguntarle cosas a una base de datos, que es más parecido a trazar un aon de lo que parece: la figura entera está bien o no hace nada.',
    'Raoden. Antes de que te lo preguntes: sí, esto se aprende, y no, no hace falta talento. Hace falta trazar la línea, mirar lo que sale, y corregir. Ese es el oficio entero.',
    'Bienvenido. Te aviso de lo único que asusta de verdad: nada de lo que escribas aquí va a explotar. Va a devolverte una tabla vacía y quedarse tan tranquilo, y eso es peor, porque tienes que ir tú a preguntarle por qué.',
    'Raoden. Vas a aprender a hablar con una base de datos, que es la conversación más honrada que vas a tener nunca: contesta exactamente lo que le has preguntado y jamás lo que querías preguntar.',
    'Bienvenido a Kae, o a lo que queda de ella. Aquí se aprende igual que se limpia una calle: un tramo cada vez, sin mirar todavía los otros nueve.',
  ],

  entrarAlMundo: [
    'Un sitio nuevo. Lo primero es mirar qué hay: las tablas, sus columnas y qué guarda cada una. Nadie pregunta bien sin saber a qué está preguntando.',
    'Aquí se aprende una cosa cada vez y ninguna se olvida por el camino. Lo que veas hoy lo vas a usar mañana y pasado.',
    'Vamos a ello. Y si algo no sale, no es que no valgas: es que falta una línea, y las líneas se encuentran.',
    'Otro sitio. Yo hago siempre lo mismo al llegar a uno: doy una vuelta entera sin tocar nada y cuento lo que hay. Casi nunca es lo que me habían dicho.',
    'Empezamos. Y sí, va a haber un momento en el que esto parezca demasiado. Suele durar un reto y medio.',
    'Sitio nuevo, herramienta nueva. Guárdate la de antes de todos modos: aquí nunca se sustituye nada, se va acumulando.',
    'Aquí dentro no hay maestros, hay gente que llegó tres semanas antes. Yo soy uno de esos, para que estemos en paz desde el principio.',
  ],

  primerIntento: [
    'Primera consulta. Aunque salga vacía, ya sabes algo que no sabías: que la base te ha entendido.',
    'Adelante. Lo peor que puede pasar es que te diga que no, y eso también es información.',
    'Escríbela y mándala. Una consulta a medio pensar y ejecutada enseña más que una consulta perfecta dentro de tu cabeza.',
    'Prueba. Aquí no se rompe nada: estos registros los hemos copiado precisamente para que puedas equivocarte encima de ellos.',
    'Dale. La primera vez que tracé un aon salió una línea torcida y no pasó absolutamente nada, y aun así aprendí más que en un año de que me lo contaran.',
    'Venga. Y no busques la consulta buena a la primera: busca una que devuelva algo, aunque sea lo que no era.',
    'Mándala tal como está. Una consulta que no se ejecuta no está a medias: no existe, y de lo que no existe no se aprende nada.',
    'Empieza por lo corto: pide una columna de una tabla y mira lo que sale. Lo demás se le va colgando encima.',
  ],

  testFallado: [
    'Ha devuelto algo, pero no lo que se pedía. Eso es buena señal: el problema está en lo que pides, no en cómo lo escribes.',
    'Mira las filas que han salido y las que tenían que salir, y busca la diferencia. Casi siempre es una condición de más o de menos.',
    'Casi. Cuando una consulta devuelve **demasiado**, sospecha del `WHERE`; cuando devuelve **de menos**, sospecha de la misma línea por el otro lado.',
    (contexto) =>
      contexto?.fallo
        ? `Dice esto: ${contexto.fallo} No lo leas como un reproche, léelo como lo que es: alguien diciéndote exactamente qué esperaba.`
        : 'No es eso. Vuelve al enunciado y subraya qué te ha pedido en realidad; la mitad de las consultas fallan porque contestan a otra pregunta.',
    'No ha salido. Bien: ahora hay una diferencia concreta entre lo que hay y lo que quieres, y una diferencia concreta se puede arreglar. Un «no me sale» no.',
    'Falla. Y fíjate en que la base no se ha quejado: ha hecho lo que le has dicho con toda la buena voluntad del mundo. El desacuerdo es entre lo que has dicho y lo que querías decir.',
    'Todavía no. Aquí nadie se ha muerto de un fallo de este tamaño, y créeme que aquí hemos tenido problemas más serios.',
    'No es. Descansa la vista dos líneas más arriba de donde estás mirando: es donde suele estar.',
  ],

  errorDeSintaxis: [
    'La base no te entiende. Fíjate en lo que hay justo antes de donde se ha parado: casi nunca el fallo está donde te lo señala, está una palabra antes.',
    'Una coma, una comilla o una palabra donde no toca. Es el aon con una línea de más: no hace nada malo, simplemente no hace nada.',
    'No ha podido ni leerlo. Es el mejor error que hay, por cierto: aparece siempre, no se esconde y no depende de los datos.',
    'Se ha atrancado en una palabra. Léela en voz alta, la palabra y las dos de al lado. Con los aones funciona y aquí también.',
    'Ni ha empezado. Antes de buscar el error grande, cuenta los paréntesis y las comillas: van por parejas y una pareja rota se ve contando.',
  ],

  requisitoIncumplido: [
    'Devuelve lo correcto y no es la consulta que te pido. Aquí importa cómo: la consulta que sale por el camino corto hoy es la que mañana no se puede tocar.',
    'Funciona, y no vale. Este reto no busca el resultado, busca la forma de llegar a él.',
    'Has llegado, sí, pero por encima del muro. Vuelve a la puerta: la puerta es la que se puede usar cuando no estés tú.',
    'El resultado está bien y falta una norma del enunciado. Las normas de aquí no son capricho mío: son las que hacen que la consulta siga sirviendo dentro de un año.',
    'Eso resuelve el caso y no el reto. Lo digo sin regañarte: he organizado media ciudad a base de gente que hacía las cosas a su manera, y sé lo que cuesta luego.',
  ],

  tiempoAgotado: [
    'Eso no termina. Una consulta puede pedirle a la base más trabajo del que hay tiempo en el mundo: mira si has cruzado dos tablas sin decirle por dónde.',
    'Sigue pensando y no vuelve. Si hay un `WITH RECURSIVE` ahí dentro, comprueba que tenga un final.',
    'No contesta. No está atascada: está trabajando muchísimo, obediente y sin queja, en algo que no le has acotado.',
    'Se ha ido a dar una vuelta muy larga. Cuando eso pasa, casi siempre le hemos pedido que mire cada fila contra todas las demás.',
    'Nada. Y ojo, que una consulta que tarda tres días es lo mismo que una consulta que no funciona, solo que con más esperanza.',
  ],

  retoSuperado: [
    'Hecho. La consulta está trazada y hace lo que tenía que hacer.',
    'Ahí está. Y lo importante no es que haya salido: es que sabes por qué ha salido.',
    'Bien. Guarda esa forma en la cabeza, que la vas a volver a usar dentro de dos retos.',
    'Trazada y funcionando. Esto es lo que aquí llamamos un buen día, y no lo digo con ironía: aquí un buen día es exactamente esto.',
    'Correcto. Ahora dilo con tus palabras y en una frase, como si se lo explicaras a alguien que acaba de llegar. Si te sale, es tuyo.',
    'Resuelto. Voy a apuntarte en la cuadrilla de los que saben hacer esto, que es como se reparte el trabajo por aquí.',
    'Funciona. Y ha funcionado a la vez la consulta y la idea que tenías de ella, que no siempre pasan las dos cosas juntas.',
    'Ya está. Fíjate en que no has pedido más datos, has pedido mejor: es toda la diferencia del oficio.',
  ],

  superadoSinPistas: [
    'Sin ayuda. Eso significa que la idea ya estaba, solo había que ponerla en orden.',
    'A la primera y sin preguntar. Apunta lo que has hecho: es tuyo.',
    'Sin pistas. No te lo digo para que te lo creas: te lo digo para que la próxima vez tardes menos en empezar.',
    'Solo. Y sin que nadie te dijera por dónde, que es como se aprende a trazar de verdad.',
    'Ni una pista. Karata se va a quedar sin negocio si sigues así, y le hará más ilusión de la que va a demostrar.',
  ],

  jefeDerrotado: [
    'Eso era el difícil, y ha caído. Lo que has usado ahí no era una cosa nueva: era todo lo anterior a la vez.',
    'Ya está. Este es el momento en que se nota que un mundo se ha quedado: no por lo que has aprendido hoy, por lo que has usado de antes sin pensarlo.',
    'Hecho. Y sin que nadie te trajera una herramienta nueva en el último momento: lo has cerrado con lo que ya tenías encima.',
    'Ha caído. Cuando puedas, vuelve a leer tu propia consulta: no para corregirla, para verte pensar.',
    'Cerrado. Esto es lo que yo llamo un aon entero: cada línea sola no valía nada y juntas hacen algo.',
  ],

  sinCroquetas: [
    'Sin croquetas. Resuelve uno sin pistas y vuelves a tener; los hay más fáciles de lo que recuerdas.',
    'No te queda nada. Aquí dentro eso es lo normal, y aquí dentro lo arreglamos igual: trabajando un rato.',
    'Cero. Ve a por uno de los primeros, que ya sabes hacerlos, y vuelve con el bolsillo lleno.',
    'Se han acabado. Karata no fía, y hace bien: lo que fía luego lo tiene que cobrar, y cobrar aquí es feo.',
  ],

  inactividad: [
    'Sigo aquí. Cuando una consulta no sale, lo que suele faltar no es una idea: es mirar qué hay de verdad en las tablas.',
    'Si te has atascado, prueba a preguntar menos: quita condiciones hasta que salga algo y luego ponlas de una en una.',
    'Sin prisa. Yo he pasado tardes enteras mirando una pared y de dos de ellas salió algo útil.',
    'Aquí estoy. Si llevas mucho rato en la misma línea, levántate y da una vuelta: es trabajo, no es descanso.',
    'Tómate tu tiempo. Lo único que no funciona nunca es mirar lo mismo con más intensidad.',
  ],

  charla: [
    'Un aon mal trazado no explota. Simplemente no pasa nada, y eso es más difícil de arreglar que un error.',
    'La base de datos nunca discute: contesta exactamente lo que le preguntas. El arte está en preguntar lo que querías preguntar.',
    'Aquí dentro todo el mundo servía para algo, y lo difícil era averiguar para qué. Con las columnas de una tabla pasa igual.',
    'Pedir «todo» es pedir lo que todavía no existe: el día que la tabla gane una columna, tu informe cambiará sin que lo hayas tocado.',
    'Galladon dice que soy un optimista. Lo dice cada vez que algo me sale bien, así que no lo dice mucho.',
    'Lo primero que organicé aquí fue quién barría. No la comida, no la defensa: quién barría. Con los datos es igual: el orden aburrido es el que sostiene todo lo demás.',
    'Adien se acuerda de cada número que ha visto en su vida. Yo tengo que apuntarlo, y por eso entiendo mejor para qué sirve una tabla.',
    'Sarene revisa lo que escribo y siempre encuentra algo. Al principio me molestaba; ahora me molesta que no encuentre nada, porque significa que no ha mirado.',
    'Una consulta larga no es una consulta difícil. Es una consulta a la que nadie le ha quitado nada todavía.',
    'Aquí abajo aprendí que el trabajo se reparte diciendo exactamente qué tiene que hacer cada uno. Una consulta es lo mismo con menos gente y más comas.',
    'La gente cree que lo difícil es sacar los datos. Lo difícil es saber qué has sacado.',
    'Nadie ha trazado un aon bien a la primera. Lo que pasa es que los que trazan bien no van contando las cuarenta veces de antes.',
  ],

  mundoCompletado: [
    'Mundo cerrado. Ahora sabes preguntar cosas que hace una hora no sabías ni nombrar.',
    'Terminado. Y fíjate en una cosa: no has aprendido consultas, has aprendido a mirar los datos y ver qué hay dentro.',
    'Hecho. Cuenta cuántas veces has vuelto a lo del mundo anterior sin darte cuenta: eso es lo que se te ha quedado.',
    'Cerrado. Aquí las cosas terminadas se celebran poco y se apuntan siempre, así que queda apuntado.',
    'Ya está. Y lo mejor no es lo que sabes hacer: es que la próxima tabla desconocida te va a dar bastante menos miedo.',
  ],
}

export default LINEAS_DE_RAODEN
