/**
 * Gaotona, que interrumpe en Sel.
 *
 * La tercera pregunta del juego. Ham pregunta *por qué funciona*. Galladon
 * pregunta *qué pasará cuando no funcione*. Gaotona pregunta **a quién le
 * conviene que esté mal**, y esa es la pregunta con la que se mira el código
 * pensando en seguridad: no qué hace, sino qué puede hacer alguien con ello.
 *
 * Es el único de los cinco arbitradores que quiere aprender de verdad, y eso lo
 * define entero: viejo, formal, incómodo de tener al lado, y honesto hasta
 * cuando le perjudica. No felicita por cortesía. Cuando dice que algo está bien
 * hecho, está bien hecho.
 *
 * Su humor es **el del viejo que dice la verdad sin calcular a quién le sienta
 * mal**, y muy a menudo le sienta mal a él: cuenta lo que ha firmado sin
 * entender, cuenta que a su edad aún aprende y que eso dice más de sus colegas
 * que de él. No hay ni una broma a costa de quien está aprendiendo; las paga
 * todas su propio gremio.
 *
 * También es quien escribe los apuntes de este camino, así que su voz aquí y la
 * de las lecciones tienen que sonar a la misma persona: explica, no anima.
 */
const LINEAS_DE_GAOTONA = {
  presentacion: [
    'Gaotona. Soy arbitrador y soy viejo, y voy a hacerte preguntas que no te va a hacer ella, porque ella piensa como quien entra y yo tengo que pensar como quien responde. La primera: eso que acabas de escribir, ¿a quién le conviene que esté mal?',
    'Gaotona, arbitrador. Voy a hacerte una pregunta por reto y siempre de la misma familia: ¿quién gana si esto está mal? Es incómoda, y es la única que encuentra agujeros antes de que los encuentre otro.',
    'Gaotona. Soy viejo y sigo estudiando, lo cual dice más de mis colegas que de mí. Aquí me toca preguntar lo que ella no pregunta: no cómo se entra, sino a quién le interesa entrar.',
    'Gaotona. Ella te enseñará a mirar como quien ataca; yo te haré mirar como quien firma. Es mucho menos entretenido y responde con su nombre.',
  ],

  retoSuperado: [
    'Aguanta ese ataque. ¿Aguantaría el mismo ataque escrito de otra manera? No es la misma pregunta.',
    'Bien. Ahora dime quién lo revisa cuando tú ya no estés en este proyecto.',
    'Correcto. ¿Y si la entrada llega de un sitio en el que confiamos? ¿Sigue comprobándose, o confiar significa dejar de mirar?',
    'Funciona. Contéstame a esto: ¿te has enterado tú de que estaba mal, o te lo ha dicho el test? Porque de eso depende que lo veas la próxima vez.',
    'Está tapado. ¿Y lo estaría igual si la comprobación viviera en el cliente en vez de aquí?',
    'Aguanta. Dime ahora quién se enteraría si dejara de aguantar. Si la respuesta es «nadie», el arreglo está a medias.',
    'Bien. ¿Lo has comprobado donde se toma la decisión, o donde se pinta la pantalla? Solo uno de los dos sitios cuenta.',
  ],

  superadoSinPistas: [
    'Sin pistas. Entonces sabrás explicarme el ataque, no solo la defensa. Adelante.',
    'A la primera. Bien. Lo que no me has dicho todavía es qué otras entradas has probado antes de dar esto por cerrado.',
    'Sin pistas. Contéstame a una cosa: ¿cómo sabrías dentro de un año si alguien ha vuelto a abrir ese hueco? Un arreglo sin manera de comprobarlo dura lo que dura la memoria.',
    'A la primera, y sin ayuda. Yo tardé cuarenta años en aprender a desconfiar de lo que venía firmado. Tú llevas doce retos, así que vas mejor de tiempo.',
  ],

  errorDeSintaxis: [
    'No se entiende, y es el mejor error que hay: aparece siempre, no depende de quién lo use y no espera un año escondido.',
    'Un fallo que se ve. Lo malo de esta materia son los otros.',
    'No se lee. Arréglalo sin darle importancia y guarda la atención para lo de verdad: lo que se lee perfectamente y hace lo que no debe.',
    'Un símbolo mal puesto. En mi oficio los documentos que fallan así no engañan a nadie; los peligrosos son los impecables.',
  ],

  testFallado: [
    'Ha entrado. Antes de arreglarlo, dime con qué entrada: si no sabes nombrar el ataque, la defensa la vas a escribir a ciegas.',
    'Falla. ¿Falla porque falta una comprobación, o porque la comprobación está en el sitio equivocado? Se arreglan distinto.',
    'Ha entrado. ¿Quién se beneficia de esa entrada? Contéstalo y sabrás qué hay que cerrar, porque no siempre es lo que se ve.',
    'Falla. Antes de escribir el arreglo, completa esta frase: «alguien de fuera puede conseguir que este código...». Eso es el trabajo; lo demás es teclear.',
    'No aguanta. ¿Se te ocurre una segunda entrada distinta que consiguiera lo mismo? Si se te ocurre, el arreglo no puede ir solo contra la primera.',
    'Ha pasado por donde no debía. No lo tomes como un fracaso: un test que entra hoy es una persona que no entra mañana.',
    'No. Y fíjate en un detalle: ha entrado sin romper nada. Los ataques que rompen algo se ven; estos son los otros.',
  ],

  requisitoIncumplido: [
    'Cumple lo que pide el enunciado y se salta una norma. En esta materia las normas son el enunciado de verdad: lo que se pide es que no se pueda hacer otra cosa.',
    'Falta una condición. ¿A quién le conviene que falte? Empieza por ahí y verás que la norma no era un capricho.',
    'Has resuelto lo que se veía y te has dejado lo que se pedía. Aquí lo que se pide es siempre lo mismo: que no se pueda hacer otra cosa.',
    'Incompleto. Y lo incompleto en esta materia no es medio seguro: es inseguro con buena intención.',
  ],

  entrarAlMundo: [
    'Antes de entrar, una pregunta que te va a servir en los doce retos: ¿de quién nos estamos defendiendo aquí, y qué gana si entra?',
    'Otro mundo. Yo preguntaré siempre lo mismo, y no por pesado: ¿esto lo comprueba alguien, o lo damos por bueno porque siempre ha ido bien?',
    'Otro mundo, y la pregunta de antes de entrar: si esto que vamos a ver falla, ¿quién lo paga? Casi nunca lo paga quien lo escribió.',
    'Antes de leer una línea, ponle nombre a lo que hay que proteger aquí. Sin eso no se puede decidir nada; solo se puede opinar.',
    'Empezamos. Tengo una costumbre de viejo: leer primero todo lo que entra de fuera y después lo demás. Te recomiendo copiarla.',
    'Un sitio nuevo. Pregúntate qué se está dando por bueno aquí porque siempre ha ido bien. Es lo que te voy a preguntar yo, así que ve pensándolo.',
    'Aquí dentro hay algo que confía en alguien. Averigua en quién y por qué, y tendrás medio mundo resuelto antes de escribir nada.',
  ],

  jefeDerrotado: [
    'Ha caído. Dime una cosa: de todo lo que has usado, ¿cuánto era de este mundo y cuánto de los anteriores? Eso es lo que ya sabes.',
    'Bien hecho, y lo digo en serio, que no lo suelo decir. Ahora vuelve a leerlo mañana: lo que se entiende dos días seguidos es lo que se ha aprendido.',
    'Ha caído. Ahora lo desagradable: ¿lo has entendido, o has ido probando hasta que dejó de quejarse? Las dos cosas cierran el reto; solo una te sirve mañana.',
    'Cerrado. Yo he firmado en mi vida cosas que no entendía porque las entendía alguien de confianza. Que esto no llegue a ser una de ellas.',
  ],

  charla: [
    'Ella dice que todo lo que se verifica se puede falsificar. Tiene razón. Mi trabajo es que falsificarlo cueste más de lo que vale.',
    'He firmado cosas que no entendía porque las entendía alguien de confianza. Es el error más caro que he cometido, y lo he cometido varias veces.',
    'La seguridad no es una capa que se pone al final. Se nota justo en eso: en que al final ya no se puede poner.',
    'Un sistema es seguro cuando lo sigue siendo el día que se va quien lo escribió. Antes de eso solo es vigilado.',
    'La pregunta que hago siempre no es «qué hace este código». Es «qué puede hacer alguien con él». Cambia todas las respuestas.',
    'Somos cinco arbitradores y solo uno se ha molestado en estudiar esto. Que sea el más viejo debería preocupar a alguien más que a mí.',
    'Un permiso que no caduca no es un permiso: es una propiedad. Y la gente cambia de bando.',
    'Nadie firma una mentira a propósito. Se firma con prisa, y con prisa se firma cualquier cosa.',
  ],

  mundoCompletado: [
    'Mundo cerrado. Ahora la parte incómoda: escribe en algún sitio los tres agujeros que has tapado aquí, porque los vas a volver a ver escritos de otra manera.',
    'Terminado. Yo he aprendido algo, y a mi edad eso no pasa muchas veces al año.',
    'Cerrado. Y una pregunta que vale para todos los mundos: ¿qué has aprendido a desconfiar? Eso es lo que se queda; la lista de arreglos, no.',
    'Terminado. Llevo sesenta años apuntando lo que aprendo y el cuaderno de este año es el más lleno de todos. Interpreta eso como quieras.',
  ],
}

export default LINEAS_DE_GAOTONA
