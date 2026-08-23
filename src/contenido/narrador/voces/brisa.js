/**
 * Lo que dice Brisa cuando abre un repaso de la primera era.
 *
 * El mismo papel que Marasi en la segunda -repasar lo que ya se ha visto- y el
 * tono opuesto: ella lo pregunta por método, él porque le gusta oírse. Los
 * eventos se llaman igual porque los dispara la misma vista.
 */
const LINEAS_DE_BRISA = {
  presentacion: [
    'Brisa. Aplacador, orador y, cuando toca, examinador. No te pongas nervioso: eso lo llevo yo.',
  ],

  abreCaso: [
    'Unas preguntas, querido amigo. No para juzgarte -eso lo hace Kelsier- sino para ver qué se te ha quedado y qué se ha ido por el desagüe.',
    (contexto) =>
      `${contexto.cuantas} preguntas. Las he elegido donde la gente se equivoca, que es donde merece la pena preguntar.`,
  ],

  bordado: [
    'Todas. Reconozco que esperaba una menos, y reconocerlo me cuesta más que a ti acertarlas.',
    'Pleno. Voy a atribuirme parte del mérito, porque las preguntas eran mías.',
  ],

  bien: [
    'La mayoría. Lo que has fallado no lo has fallado por casualidad: vuelve a ese apunte, sin prisa.',
    'Bien, en general. Y ese fallo de ahí en concreto conviene mirarlo hoy y no dentro de un mes.',
  ],

  flojo: [
    'Menos de la mitad, y no pasa nada: significa que has encontrado exactamente lo que había que encontrar. Vuelve a los apuntes de esos retos.',
    'Flojito. Te lo digo con todo el cariño del que soy capaz, que no es mucho: relee y vuelve.',
  ],
}

/**
 * Lo que dice Brisa mientras juegas la primera era.
 *
 * Aplacador: su oficio es empujarte el ánimo hablando, y lo hace con el doble de
 * palabras de las necesarias porque le gusta oírse. Nunca insulta -eso es de
 * Kelsier- pero tampoco te ahorra la verdad; simplemente la envuelve.
 *
 * Los eventos se llaman igual que los de Wayne porque los dispara el mismo
 * juego. Lo que cambia es la boca.
 */
const LINEAS_DE_BRISA_NARRANDO = {
  bienvenida: [
    'Querido amigo, bienvenido. Voy a hablar bastante, no lo tomes como algo personal: es mi oficio y encima me gusta.',
    'Vas a aprender PHP, y yo voy a acompañarte diciéndote lo bien que lo llevas. A veces será verdad.',
    'Antes de empezar: aquí nadie te va a obligar a nada. Solo te lo vamos a poner muy, muy fácil de aceptar.',
  ],

  entrarAlMundo: [
    'Sitio nuevo. Respira, mira alrededor y no toques nada hasta que te lo explique alguien. Preferiblemente yo.',
    'Adelante. He estado en peores, y en casi todos hablando yo.',
    'Aquí es. Verás que da menos miedo cuando alguien te lo cuenta con calma.',
  ],

  primerIntento: [
    'Pruébalo, hombre. Lo peor que puede pasar es que no funcione, y eso lo arreglamos hablando.',
    'Dale. Nadie mira, y si mira, yo me encargo de que le parezca bien.',
  ],

  testFallado: [
    'No ha salido. Y fíjate qué suerte: ahora sabes exactamente qué no era.',
    'Ha fallado, sí. Léete el mensaje entero, que está siendo mucho más claro contigo que la mayoría de la gente.',
    'Casi. «Casi» no vale nada, pero suena bien y a veces con eso basta para seguir.',
    'Vaya. Bueno. Te lo digo con mi mejor voz: vuelve a intentarlo.',
  ],

  errorDeSintaxis: [
    'Eso todavía no es PHP. Le falta algo pequeño, y lo pequeño es lo que más rabia da.',
    'No ha podido ni leerlo. Y mira que yo he conseguido que me lean cosas peores.',
    'Un símbolo de más o de menos. Nunca los justos, ¿te has fijado?',
  ],

  requisitoIncumplido: [
    'Funciona, y aun así no vale. El reto pedía otra cosa, y por una vez las normas no las he puesto yo.',
    'Has llegado al mismo sitio por otro camino. Muy propio de esta casa, pero hoy no.',
  ],

  tiempoAgotado: [
    'Sigue pensándoselo. Y yo, que puedo hablar horas, empiezo a impacientarme.',
    'Demasiado rato. Algo se ha quedado dando vueltas sin saber cómo salir.',
  ],

  retoSuperado: [
    'Funciona. Permíteme atribuirme una pequeña parte del mérito.',
    'Ahí está. No ha sido tan terrible, ¿verdad? Nada lo es cuando lo cuenta la persona adecuada.',
    'Resuelto. Lo apunto, y de paso me apunto yo.',
    'Bien hecho, querido amigo. Y lo digo sin empujarte el ánimo, que conste.',
  ],

  superadoSinPistas: [
    'Sin pistas ni ayuda. Reconozco que esperaba tener que intervenir.',
    'Solo, a la primera y sin preguntar. Empiezo a sentirme innecesario, que es una sensación nueva.',
  ],

  jefeDerrotado: [
    'Eso era lo gordo y ha caído. Voy a contarlo esta noche con más adjetivos.',
    'Terminado. Y sin que nadie tuviera que apaciguar a nadie, lo cual en esta tripulación es raro.',
  ],

  sinCroquetas: [
    'No te queda nada. Podría prestarte, pero entonces me deberías algo y eso lo cambia todo.',
    'Cero croquetas. Resuelve algo, que es la única manera limpia de arreglarlo.',
  ],

  inactividad: [
    '¿Seguimos? Puedo esperar. Puedo esperar hablando, incluso.',
    'Sigo aquí. Si necesitas pensar, piensa; yo relleno el silencio.',
  ],

  charla: [
    'Aplacar es empujar un ánimo que ya estaba ahí. No pongo nada que no tengas: solo lo subo un poco.',
    'Kelsier reclutaba con discursos. Yo recluto explicando, que se olvida menos.',
    'Ham te preguntará por qué. Contéstale, aunque sea para ti: la mitad de lo que sé lo aprendí buscándole una respuesta.',
    'Un buen nombre de variable es como un buen argumento: si hay que explicarlo dos veces, no era bueno.',
    'La ceniza cae todos los días y todos los días alguien la barre. Programar se parece bastante a eso.',
    'Yo desconfío del código que funciona a la primera. Y de la gente que no habla.',
    'Sazed lo apuntaría en su mente de cobre. Yo te lo cuento y confío en que se te quede, que es más barato.',
    'Si llevas veinte minutos con lo mismo, levántate. Vuelves y está resuelto. No preguntes por qué, funciona.',
  ],

  mundoCompletado: [
    (contexto) => `${contexto.mundo}, terminado. Voy a decir que ayudé, porque es verdad.`,
    (contexto) => `Se acabó ${contexto.mundo}. Reconozco que ha ido mejor de lo que le dije a Kelsier que iría.`,
  ],
}

// Brisa hace dos papeles en la primera era: narra y abre los repasos. Los
// dos sacos se juntan aquí porque es la misma voz, no dos personas.
export default { ...LINEAS_DE_BRISA, ...LINEAS_DE_BRISA_NARRANDO }

// Los repasos piden el saco de los repasos a secas, sin el de narrar.
export { LINEAS_DE_BRISA, LINEAS_DE_BRISA_NARRANDO }
