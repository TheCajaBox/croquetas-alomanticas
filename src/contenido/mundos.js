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

  // ------------------------------------------------------------------------
  // La primera era. Otro lenguaje, otra gente y su propia cuesta: no se cruza
  // con la de arriba, así que ningún `requiere` de aquí mira allí.
  // ------------------------------------------------------------------------
  {
    id: 'ceniza',
    // La primera mitad la explica Kelsier; ver `quienEscribeElApunte`.
    parte: 'primera',
    nombre: 'La Ceniza',
    subtitulo: 'PHP · lo primero',
    itinerario: 'era1',
    entorno: 'php',
    requiere: null,
    color: '#a8a2bd',
    anfitrion: 'kelsier',
    resumen:
      'Lo que hay que saber antes de saber nada: abrir PHP, imprimir, guardar valores, saber de qué tipo son, comparar sin que te engañen y entrar dentro de una lista.',
    presentacion:
      'Todo el mundo empieza igual: sin saber nada y con alguien delante diciéndole que es más fácil de lo que parece. Yo soy ese alguien y te estoy mintiendo un poco, pero solo un poco. PHP mueve media web y se aprende deprisa; lo que cuesta es aprenderlo bien, y para eso hace falta que lo escribas tú.',
    despedida:
      'Ya sabes decirle cosas a la máquina, guardarlas, mirar de qué son y sacarlas de una lista. Con eso no se hace nada todavía, y sin eso no se hace nada nunca.',
  },
  {
    id: 'tripulacion',
    // La primera mitad la explica Kelsier; ver `quienEscribeElApunte`.
    parte: 'primera',
    nombre: 'La tripulación',
    subtitulo: 'PHP · decidir y repetir',
    itinerario: 'era1',
    entorno: 'php',
    requiere: 'ceniza',
    color: '#9a8f6a',
    anfitrion: 'kelsier',
    resumen:
      'Que el programa decida y que repita: condiciones, bucles, funciones con sus parámetros, y listas con nombre en vez de con número.',
    presentacion:
      'Una cuadrilla no es gente junta: es gente con un cometido cada uno. Un programa igual. Hasta ahora le has dicho a la máquina qué hacer, en orden, sin más. Aquí empieza a decidir sola y a repetir sin que se lo pidas cada vez, y tú a repartir el trabajo en funciones que se llaman por su nombre. Es donde programar deja de parecerse a escribir una lista de la compra.',
    despedida:
      'Ya no escribes órdenes: escribes decisiones. Con condiciones, bucles, funciones y arrays con clave se puede hacer prácticamente cualquier cosa; lo que viene después es hacerla bien.',
  },
  {
    id: 'pozo',
    // Todavía la primera mitad: Kelsier explica hasta que deja de estar.
    parte: 'primera',
    nombre: 'El Pozo de la Ascensión',
    subtitulo: 'PHP · listas, nada y accidentes',
    itinerario: 'era1',
    entorno: 'php',
    requiere: 'tripulacion',
    color: '#7d8a9a',
    anfitrion: 'kelsier',
    resumen:
      'Trabajar una lista entera de una vez con `array_map`, `array_filter` y `array_reduce`; ordenar con tus propias reglas; y las dos cosas que rompen los programas de verdad: que falte un dato y que algo salga mal.',
    presentacion:
      'Hasta ahora recorrías las listas a mano, con un bucle y un acumulador, y eso funciona siempre. Aquí se aprende a decir lo que quieres en vez de cómo conseguirlo: «de cada uno, esto», «solo los que cumplan aquello», «todos juntos, en un número». Y se aprenden las dos cosas que más programas tiran abajo, que no son difíciles sino olvidadas: que un dato puede no estar, y que una operación puede salir mal y hay que decirlo en voz alta.',
    despedida:
      'Ya sabes trabajar una lista sin decirle a la máquina cómo dar cada paso, y ya sabes qué hacer cuando falta algo o algo se rompe. Con esto se escriben programas que aguantan lo que les echen; lo que viene ahora es ordenarlos.',
  },
  {
    id: 'fundacion',
    // Aquí Kelsier ya no está: la segunda parte la explican Elend y Vin.
    parte: 'segunda',
    nombre: 'La Fundación',
    subtitulo: 'PHP · clases y contratos',
    itinerario: 'era1',
    entorno: 'php',
    requiere: 'pozo',
    color: '#b8a06a',
    anfitrion: 'elend',
    resumen:
      'Juntar datos y comportamiento en una clase; decidir qué se ve desde fuera; heredar, prometer con una interfaz y compartir con un rasgo. Y por qué los nombres largos con barras invertidas existen.',
    presentacion:
      'Hasta ahora tenías funciones y datos por separado, y funcionaba mientras el programa fuera pequeño. Una clase es la idea de guardarlos juntos: los datos de una cosa y lo que esa cosa sabe hacer, en el mismo sitio y con una puerta que decides tú. No es una técnica avanzada; es la forma en que está escrito prácticamente todo el PHP que vas a leer en tu vida.',
    despedida:
      'Ya sabes leer y escribir el PHP con el que están hechos los programas de verdad. Lo que queda no es aprender más piezas: es aprender a colocar las que ya tienes.',
  },
  {
    id: 'kandra',
    parte: 'segunda',
    nombre: 'El kandra',
    subtitulo: 'PHP · la misma cosa, otra forma',
    itinerario: 'era1',
    entorno: 'php',
    requiere: 'fundacion',
    color: '#6fb08a',
    // Quien recibe al llegar. Este mundo lo lleva TenSoon, que de cambiar de
    // forma sin dejar de ser uno mismo sabe más que nadie. Y sus apuntes los
    // firma él: el temario de la segunda parte lo explica Elend menos aquí.
    anfitrion: 'tensoon',
    apunte: 'tensoon',
    resumen:
      'Doce trozos de código que funcionan y que no se pueden leer. No se añade nada: se cambia de forma. Es el mundo que lo lleva TenSoon, que de eso sabe.',
    presentacion:
      'Un kandra puede tomar la forma de cualquiera sin dejar de ser él. Este mundo va de eso: el mismo programa, con otra forma, haciendo exactamente lo mismo. No vas a aprender nada nuevo aquí -ya sabes todo lo que hace falta- y es el mundo que más te va a cambiar la manera de escribir. Cada reto trae código que funciona, pasa sus tests y no se puede leer. Tu trabajo es que se pueda leer, sin romper ni un test.',
    despedida:
      'Ahora ya sabes que un programa que funciona no está terminado. Lo que has hecho aquí es lo que se hace el ochenta por ciento del tiempo en un trabajo de verdad, y casi nadie lo enseña.',
  },
  {
    id: 'ruina',
    parte: 'segunda',
    nombre: 'Ruina',
    subtitulo: 'PHP · el final, en dos actos',
    itinerario: 'era1',
    entorno: 'php',
    requiere: 'kandra',
    color: '#8a2f3c',
    // El mundo lo abre Vin y sus apuntes los firma ella. Elend presenta el
    // primer acto; el segundo lo presenta ella en cuatro líneas.
    anfitrion: 'vin',
    apunte: 'vin',
    resumen:
      'Todo lo de la primera era junto, y al final dos actos: montar el sistema y hacer que aguante. El segundo es el reto más difícil del juego y no tiene pistas.',
    presentacion:
      'Aquí no hay nada nuevo. Están las seis cosas de los cinco mundos anteriores y hay que usarlas a la vez, que es lo único que no se ha practicado todavía. Los dos últimos retos van juntos: en el primero se monta el sistema y en el segundo se le pide que aguante lo que le echen. Ninguno de los dos tiene pistas. Si llegas al segundo y lo pasas, ya no te hace falta este juego para la parte de PHP.',
    despedida:
      'Ya está. Sabes escribir PHP moderno, estructurarlo en clases, decir lo que no puedes hacer en voz alta y dejarlo de manera que otro lo entienda. Lo que queda por aprender se aprende trabajando, y eso no lo puede dar ningún juego.',
  },
  {
    id: 'kae',
    nombre: 'Kae',
    subtitulo: 'SQL · leer',
    itinerario: 'elantris',
    entorno: 'sql',
    requiere: null,
    color: '#c9d8e4',
    anfitrion: 'raoden',
    resumen:
      'Preguntar y que conteste: elegir columnas, filtrar filas, ordenar, contar de arriba, y por qué pedir «todo» es la peor costumbre que se puede coger el primer día.',
    presentacion:
      'Kae es la ciudad de fuera, la que se construyó pegada a la muralla para mirar a Elantris por encima del hombro. Aquí están sus registros: quién vive dónde, quién le compra a quién y cuánto. Una consulta es como un aon: la figura entera está bien o no hace nada, y la diferencia entre las dos cosas es una línea. Vamos a empezar por preguntar bien, que es lo que casi nadie enseña.',
    despedida:
      'Ya sabes pedirle a una tabla exactamente las columnas que quieres, quedarte con las filas que te interesan, ponerlas en el orden que hace falta y quedarte con las primeras. Suena a poco y es la mitad de todo lo que se escribe.',
  },
  {
    id: 'muros',
    nombre: 'Dentro de los muros',
    subtitulo: 'SQL · unir',
    itinerario: 'elantris',
    entorno: 'sql',
    requiere: 'kae',
    color: '#8fa8b8',
    anfitrion: 'raoden',
    resumen:
      'Un dato en dos tablas: claves, uniones, y qué pasa de verdad cuando la unión no encuentra pareja. Aquí aparece el primer nulo.',
    presentacion:
      'Fuera de la muralla cada puesto llevaba escrito su gremio en su propia fila. Aquí dentro los datos están mejor puestos: el gremio es otra tabla y el puesto guarda su número. Se gana mucho -el nombre se escribe una vez, y se le pueden colgar más datos- y se paga una cosa: hay que unir. Unir es fácil cuando todo tiene pareja, y este mundo va de lo otro.',
    despedida:
      'Ya sabes juntar dos tablas y, lo que es más raro, sabes qué pasa con lo que se queda sin pareja. Eso último se lo salta casi todo el mundo, y es exactamente donde se pierden filas sin que nadie se entere.',
  },
  {
    id: 'mercado',
    nombre: 'El mercado',
    subtitulo: 'SQL · agrupar y contar',
    itinerario: 'elantris',
    entorno: 'sql',
    requiere: 'muros',
    color: '#b8a878',
    anfitrion: 'raoden',
    resumen:
      'Una fila por grupo en vez de una por cosa: contar, sumar, promediar, y la confusión de siempre entre filtrar filas y filtrar grupos.',
    presentacion:
      'Aquí el total de un puesto ya no es una columna: es la suma de sus ventas. Se gana que siempre cuadre y se paga que haya que calcularlo, y calcular sobre muchas filas para sacar una es lo que se llama agrupar. Es el salto que más cambia la manera de pensar en todo el camino: hasta ahora una fila del resultado era una cosa, y a partir de aquí una fila del resultado es **un montón de cosas resumido**.',
    despedida:
      'Ya sabes convertir muchas filas en una y decir qué quieres saber de ellas. Y sabes la diferencia entre quitar filas antes de agrupar y quitar grupos después, que es donde se equivoca casi todo el mundo la primera vez.',
  },
  {
    id: 'dor',
    nombre: 'El Dor',
    subtitulo: 'SQL · lo que da poder',
    itinerario: 'elantris',
    entorno: 'sql',
    requiere: 'mercado',
    color: '#9a86c4',
    anfitrion: 'raoden',
    resumen:
      'Consultas dentro de consultas, nombres para los pasos intermedios, ventanas que miran las filas de al lado, y el nulo a fondo: no es un valor, es una pregunta sin respuesta.',
    presentacion:
      'El Dor es lo que hay detrás de los aones: la fuerza que los hace funcionar, y que trazada mal no hace nada y trazada bien hace de todo. Aquí están las herramientas que separan una consulta que contesta de una consulta que resuelve: preguntar dentro de una pregunta, ponerle nombre a un paso intermedio, y mirar una fila sabiendo lo que hay en las de al lado. Y de paso se cierra la cuenta pendiente de los tres mundos anteriores: qué es exactamente un nulo, y por qué se lleva mal con todo.',
    despedida:
      'Ya sabes contestar preguntas que no caben en una consulta plana: el mejor de cada grupo, lo que va por encima de la media, un acumulado. Y sabes por qué una consulta con un `NOT IN` puede devolver cero filas teniendo razón.',
  },
  {
    id: 'trazos',
    nombre: 'Los trazos',
    subtitulo: 'SQL · escribir',
    itinerario: 'elantris',
    entorno: 'sql',
    requiere: 'dor',
    color: '#c9a05a',
    anfitrion: 'raoden',
    resumen:
      'Dejar de mirar y empezar a trazar: meter filas, cambiarlas, borrarlas, hacer varias cosas como si fueran una, y las reglas que la base hace cumplir por ti.',
    presentacion:
      'Hasta ahora has estado leyendo aones ajenos. Ahora se trazan, y trazar tiene una diferencia que se nota en el estómago: un `SELECT` mal escrito devuelve otra cosa, y un `DELETE` mal escrito **borra otra cosa**. Aquí se aprende a escribir en la base, a hacer varias cosas de manera que o pasan todas o no pasa ninguna, a poner reglas en el esquema para que la base te sujete cuando el programa se equivoque, y a preguntarle por qué una consulta tarda.',
    despedida:
      'Ya sabes trazar. Y sabes las dos cosas que hay que saber antes de tocar una base de verdad: que un `WHERE` se prueba con un `SELECT` antes de ponerle un `DELETE` delante, y que las reglas van en el esquema porque ahí las cumple todo el mundo.',
  },
  {
    id: 'linea',
    nombre: 'La línea que falta',
    subtitulo: 'SQL · el final, en dos actos',
    itinerario: 'elantris',
    entorno: 'sql',
    requiere: 'trazos',
    color: '#8a5fa8',
    anfitrion: 'raoden',
    resumen:
      'Todo lo de los cinco mundos anteriores junto, y al final dos actos: encontrar la línea que falta y trazarla. El segundo es el reto que más paga del camino y no tiene pistas.',
    presentacion:
      'Aquí no hay nada nuevo. Un aon al que le falta una línea no hace nada, y no avisa: no humea, no se rompe, no da error. Simplemente no hace nada, o hace otra cosa. Con las consultas pasa igual, y ese ha sido el hilo de los cinco mundos. Los dos últimos retos van juntos: en el primero hay que encontrar la línea que falta en un informe que casi funciona, y en el segundo trazarla y hacer que el informe entero salga bien. Ninguno tiene pistas. Si llegas al segundo y lo pasas, ya no te hace falta este juego para la parte de SQL.',
    despedida:
      'Ya está. Sabes preguntarle a una base de datos exactamente lo que necesitas, unir sin perder filas, resumir sin contar de más, escribir sin llevarte de paso lo que no era, y saber por qué tarda. Lo que queda por aprender se aprende trabajando, y eso no lo puede dar ningún juego.',
  },
  // ---------------------------------------------------------------------------
  // Sel · ciberseguridad. Seis mundos, y todos con la misma forma: se te da
  // código que **funciona** -pasa sus pruebas, hace lo que promete- y tiene un
  // agujero. Encontrarlo y taparlo sin romper lo que ya iba.
  //
  // Cinco corren en el worker de JavaScript que ya existe; La grieta corre en el
  // de SQL, porque una inyección no se entiende sin una base de datos
  // recibiéndola de verdad.
  // ---------------------------------------------------------------------------
  {
    id: 'sello',
    nombre: 'El sello',
    subtitulo: 'Seguridad · quién eres',
    itinerario: 'sel',
    entorno: 'worker',
    requiere: null,
    color: '#c46a5a',
    anfitrion: 'shai',
    resumen:
      'Autenticación: por qué una contraseña no se guarda, qué es un hash lento y para qué sirve la sal, cómo se compara sin chivarse por el tiempo, y qué caduca en una sesión.',
    presentacion:
      'Un sello es una firma: dice quién eres y cualquiera puede comprobarlo. Falsificar uno es mi oficio, así que sé exactamente qué lo hace fácil, y casi siempre es lo mismo: que quien lo comprueba se fía de algo que no ha mirado. Aquí empezamos por lo más falsificable que existe, que es una contraseña guardada tal cual. Cuando salgas de este mundo la guardarás de otra manera, y sabrás explicar por qué.',
    despedida:
      'Ya no guardas contraseñas: guardas la prueba de que alguien sabía una. Y sabes que la comparación también habla, que la sal no es un secreto sino un antídoto contra las tablas hechas, y que una sesión que no caduca es una llave que se queda en la cerradura.',
  },
  {
    id: 'inspeccion',
    nombre: 'La inspección',
    subtitulo: 'Seguridad · lo que llega de fuera',
    itinerario: 'sel',
    entorno: 'worker',
    requiere: 'sello',
    color: '#b98a4a',
    anfitrion: 'gaotona',
    resumen:
      'La entrada no se confía nunca: validar donde manda, permitir en vez de prohibir, escapar según a dónde vaya el texto, y XSS de verdad.',
    presentacion:
      'Soy arbitrador: mi oficio es inspeccionar, y llevo cuarenta años firmando que algo estaba en orden. He aprendido dos cosas. La primera es que el inspector comprueba lo que espera encontrar, no lo que le han traído, y ahí vive todo el oficio de ella. La segunda la vas a oír en los doce retos de este mundo hasta que te aburra: **una lista de lo que se permite, nunca una lista de lo que se prohíbe**. La lista de prohibiciones siempre está incompleta, y siempre le falta justo lo que va a usar quien venga a entrar.',
    despedida:
      'Ya no preguntas si una entrada es peligrosa: preguntas si está en la lista de las que valen. Y sabes que escapar no es una operación, son varias: lo que es seguro dentro de un texto es un agujero dentro de un atributo, y lo que vale para HTML no vale para una URL.',
  },
  {
    id: 'grieta',
    nombre: 'La grieta',
    subtitulo: 'Seguridad · inyección',
    itinerario: 'sel',
    entorno: 'sql',
    requiere: 'inspeccion',
    color: '#8f2f2f',
    anfitrion: 'shai',
    resumen:
      'Inyección con una base de datos delante: la consulta pegada con cadenas, la parametrizada, y los tests intentando colarse por la primera. También inyección de comandos y de plantillas.',
    presentacion:
      'Una grieta en la muralla no se abre: se encuentra. Ya estaba, y llevaba años ahí mientras todo el mundo pasaba por la puerta. Este mundo tiene una base de datos de verdad detrás, y los tests van a intentar entrar por donde tú dejes. Vas a ver la misma consulta escrita de dos maneras que hacen exactamente lo mismo con datos normales, y lo distinto que hacen cuando el dato no es normal. Esa diferencia es el mundo entero.',
    despedida:
      'Ya sabes lo único que hay que saber de la inyección, y es que no se arregla filtrando: se arregla no construyendo la orden con el dato dentro. El dato va por otro sitio y llega como dato, y entonces lo que escriba quien te ataque es texto y no una orden.',
  },
  {
    id: 'cien-dias',
    nombre: 'Los cien días',
    subtitulo: 'Seguridad · quién puede',
    itinerario: 'sel',
    entorno: 'worker',
    requiere: 'grieta',
    color: '#7f8a96',
    anfitrion: 'hanshuxen',
    resumen:
      'Autorización y lógica: pedir un identificador que no es tuyo, comprobar el permiso donde hay que comprobarlo, límites de intentos, y errores que cuentan más de lo que deben.',
    presentacion:
      'General Han ShuXen. He visto caer tres murallas y ninguna se rompió: en las tres había alguien dentro con permiso para estar dentro, haciendo lo que no le correspondía. Comprobar quién eres y comprobar qué puedes hacer son dos guardias distintos, y en casi todas las plazas solo hay el primero. Este mundo va del segundo. Ella tardó cien días en falsificar un alma y noventa se los pasó leyendo cosas que no eran suyas, porque se las dieron.',
    despedida:
      'Ya no confundes autenticar con autorizar. Sabes que el identificador que llega en la petición no prueba nada, que un permiso comprobado en la pantalla no está comprobado, y que un mensaje de error demasiado sincero es un mapa.',
  },
  {
    id: 'original',
    nombre: 'El original',
    subtitulo: 'Seguridad · que no lo toquen',
    itinerario: 'sel',
    entorno: 'worker',
    requiere: 'cien-dias',
    color: '#5f7f6a',
    anfitrion: 'gaotona',
    resumen:
      'Integridad: firmar y verificar, secretos que no van en el repositorio, azar de verdad y no el fácil, cabeceras que ayudan y dependencias en las que se confía a ciegas.',
    presentacion:
      'Ella dice que casi nadie compara con el original, y tiene razón: yo he firmado copias. Una copia buena pasa cualquier inspección; lo que no pasa nunca es la comparación. Así que lo que se aprende aquí es a poder comparar: firmar lo que sale para reconocerlo cuando vuelva, no dejar la llave dentro de la caja que cierra, y no pedirle secretos a algo que no sabe guardarlos. Y hay una parte incómoda que nadie quiere mirar: la mitad del código que ejecutas no lo has escrito tú.',
    despedida:
      'Ya sabes firmar lo que tiene que volver entero, y sabes que una firma sin verificar es un adorno. Sabes que un secreto en el repositorio es público el día que el repositorio lo sea, que hay dos clases de azar y solo una vale para esto, y que confiar en una dependencia es confiar en quien la escriba mañana.',
  },
  {
    id: 'alma',
    nombre: 'El alma del emperador',
    subtitulo: 'Seguridad · el final, en dos actos',
    itinerario: 'sel',
    entorno: 'worker',
    requiere: 'original',
    color: '#8f2f6a',
    anfitrion: 'shai',
    resumen:
      'Todo lo de los cinco mundos juntos, y al final dos actos: encontrar el agujero en un sistema entero y taparlo sin romper nada de lo que ya funcionaba. El segundo es el reto que más paga del camino y no tiene pistas.',
    presentacion:
      'Un alma entera. No un sello, no una pieza: el sistema completo, con su autenticación, su validación, sus permisos y sus firmas, escrito por alguien que sabía lo que hacía. Y con un agujero, porque siempre hay uno. Los dos últimos retos van juntos: en el primero hay que encontrarlo -y solo encontrarlo, que ya es bastante- y en el segundo taparlo sin romper una sola de las cosas que ya iban bien, que es la parte que de verdad cuesta. Ninguno tiene pistas.',
    despedida:
      'Ya está. Sabes mirar un sistema y preguntarte qué se está dando por bueno sin comprobarlo, encontrar quién lo comprueba y qué pasa si no lo hace. Eso no se olvida, y es incómodo: vas a ver estos agujeros en todas partes. Bienvenida al oficio.',
  },
]

export const MUNDOS_POR_ID = Object.fromEntries(MUNDOS.map((mundo) => [mundo.id, mundo]))

/** Los mundos de un itinerario, en el orden en que se juegan. */
export const mundosDelItinerario = (itinerarioId) =>
  MUNDOS.filter((mundo) => mundo.itinerario === itinerarioId)
