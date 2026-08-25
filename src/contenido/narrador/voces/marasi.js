/**
 * Lo que dice Marasi.
 *
 * Lleva los repasos: es la que se toma en serio lo que ya has visto y comprueba
 * si sigue ahí, porque resolver algo una vez y no volver a verlo nunca es la
 * forma más rápida de olvidarlo.
 *
 * Su registro es **el de la agente que se ha leído los libros**: precisa, con
 * datos, y con la costumbre de llamar «expediente» a lo que es un progreso. Su
 * humor no es un chiste, es un desajuste -habla de un cuestionario como de una
 * investigación- y ella no se entera de que lo ha hecho. Nunca se ríe de quien
 * contesta mal: eso es un dato, y a ella los datos le caen bien.
 */
const LINEAS_DE_MARASI = {
  presentacion: [
    'Marasi Colms. Me interesa menos lo que sabes resolver que lo que recuerdas una semana después, así que he preparado unas preguntas sobre lo que ya has visto.',
    'Marasi Colms. Voy a preguntarte por cosas de hace tres mundos, no por lo de esta mañana. Lo de esta mañana lo recuerda cualquiera; lo de hace tres mundos es lo que de verdad se ha quedado.',
    'Marasi Colms. En mi oficio se aprende una cosa muy pronto: la declaración que vale es la que se sostiene una semana más tarde. Con lo que estudias pasa exactamente igual.',
    'Marasi Colms. He revisado tu expediente -tu progreso, perdón- y he sacado las preguntas de donde se equivoca la gente. Es una estadística, no una acusación.',
  ],

  abreCaso: [
    'He revisado por dónde vas y he sacado las preguntas de lo que más se confunde. No es un examen: es para ver qué se ha quedado.',
    (contexto) =>
      `${contexto.cuantas} preguntas sobre lo que ya has hecho. Si fallas alguna, mejor: eso es exactamente lo que había que encontrar.`,
    'Unas preguntas de lo que ya has visto. Si te suena todo, será corto; y si no, habremos encontrado justo lo que hacía falta encontrar.',
    (contexto) =>
      `${contexto.cuantas} preguntas y ninguna con trampa. Las trampas no miden lo que sabes: miden si has dormido.`,
  ],

  bordado: [
    'Todas. Y sin dudar en ninguna, por lo que he visto. Eso se ha quedado.',
    'Pleno. Lo digo con conocimiento de causa: estas preguntas están puestas donde la gente falla.',
    'Todas correctas. Lo apunto, y lo apunto de verdad: conviene tener escrito el día en que se sabía algo, porque es el día al que se vuelve.',
    'Pleno, y rápido. Ahora el consejo aburrido de siempre: vuelve a mirarlo dentro de una semana, que es cuando se sabe si se ha quedado o solo estaba reciente.',
  ],

  bien: [
    'La mayoría. Lo que has fallado no es casualidad, así que vuelve al apunte de ese reto y léelo otra vez con calma.',
    'Bastante bien. Apunta lo que has fallado; son justo los sitios donde volverás a tropezar.',
    'Bien, con un par de huecos. Los huecos tienen una virtud enorme: son concretos. Lee el apunte de esos dos retos y ya está, no hace falta repasar el mundo entero.',
    'Casi todo. Y ahora mira si lo que has fallado es siempre la misma clase de cosa: cuando lo es, no son tres fallos, es uno repetido tres veces, y eso se arregla una sola vez.',
  ],

  flojo: [
    'Menos de la mitad. No es un problema: significa que ese mundo hay que volver a leerlo, no que no valgas para esto.',
    'Ha ido flojo. Es información útil: ya sabes exactamente qué repasar, y eso vale más que un aprobado.',
    'Poco, y no dice nada de ti: dice qué toca repasar. Empieza por el primer reto que has fallado y sigue en orden, que en orden se tarda menos.',
    'Ha salido flojo. Es la clase de resultado que a mí me sirve, aunque no sea el que te apetece: uno alto no señala dónde mirar y este señala cuatro sitios.',
  ],
}

export default LINEAS_DE_MARASI
