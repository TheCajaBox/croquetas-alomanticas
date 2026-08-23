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
 * También es quien escribe los apuntes de este camino, así que su voz aquí y la
 * de las lecciones tienen que sonar a la misma persona: explica, no anima.
 */
const LINEAS_DE_GAOTONA = {
  presentacion: [
    'Gaotona. Soy arbitrador y soy viejo, y voy a hacerte preguntas que no te va a hacer ella, porque ella piensa como quien entra y yo tengo que pensar como quien responde. La primera: eso que acabas de escribir, ¿a quién le conviene que esté mal?',
  ],

  retoSuperado: [
    'Aguanta ese ataque. ¿Aguantaría el mismo ataque escrito de otra manera? No es la misma pregunta.',
    'Bien. Ahora dime quién lo revisa cuando tú ya no estés en este proyecto.',
    'Correcto. ¿Y si la entrada llega de un sitio en el que confiamos? ¿Sigue comprobándose, o confiar significa dejar de mirar?',
    'Funciona. Contéstame a esto: ¿te has enterado tú de que estaba mal, o te lo ha dicho el test? Porque de eso depende que lo veas la próxima vez.',
    'Está tapado. ¿Y lo estaría igual si la comprobación viviera en el cliente en vez de aquí?',
  ],

  superadoSinPistas: [
    'Sin pistas. Entonces sabrás explicarme el ataque, no solo la defensa. Adelante.',
    'A la primera. Bien. Lo que no me has dicho todavía es qué otras entradas has probado antes de dar esto por cerrado.',
  ],

  errorDeSintaxis: [
    'No se entiende, y es el mejor error que hay: aparece siempre, no depende de quién lo use y no espera un año escondido.',
    'Un fallo que se ve. Lo malo de esta materia son los otros.',
  ],

  testFallado: [
    'Ha entrado. Antes de arreglarlo, dime con qué entrada: si no sabes nombrar el ataque, la defensa la vas a escribir a ciegas.',
    'Falla. ¿Falla porque falta una comprobación, o porque la comprobación está en el sitio equivocado? Se arreglan distinto.',
  ],

  requisitoIncumplido: [
    'Cumple lo que pide el enunciado y se salta una norma. En esta materia las normas son el enunciado de verdad: lo que se pide es que no se pueda hacer otra cosa.',
  ],

  entrarAlMundo: [
    'Antes de entrar, una pregunta que te va a servir en los doce retos: ¿de quién nos estamos defendiendo aquí, y qué gana si entra?',
    'Otro mundo. Yo preguntaré siempre lo mismo, y no por pesado: ¿esto lo comprueba alguien, o lo damos por bueno porque siempre ha ido bien?',
  ],

  jefeDerrotado: [
    'Ha caído. Dime una cosa: de todo lo que has usado, ¿cuánto era de este mundo y cuánto de los anteriores? Eso es lo que ya sabes.',
    'Bien hecho, y lo digo en serio, que no lo suelo decir. Ahora vuelve a leerlo mañana: lo que se entiende dos días seguidos es lo que se ha aprendido.',
  ],

  charla: [
    'Ella dice que todo lo que se verifica se puede falsificar. Tiene razón. Mi trabajo es que falsificarlo cueste más de lo que vale.',
    'He firmado cosas que no entendía porque las entendía alguien de confianza. Es el error más caro que he cometido, y lo he cometido varias veces.',
    'La seguridad no es una capa que se pone al final. Se nota justo en eso: en que al final ya no se puede poner.',
    'Un sistema es seguro cuando lo sigue siendo el día que se va quien lo escribió. Antes de eso solo es vigilado.',
  ],

  mundoCompletado: [
    'Mundo cerrado. Ahora la parte incómoda: escribe en algún sitio los tres agujeros que has tapado aquí, porque los vas a volver a ver escritos de otra manera.',
    'Terminado. Yo he aprendido algo, y a mi edad eso no pasa muchas veces al año.',
  ],
}

export default LINEAS_DE_GAOTONA
