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
    'Brisa. Hoy no vengo a contarte nada, vengo a preguntar. Es la parte del oficio que menos me gusta, por razones que me parecen evidentes.',
    'Brisa, para servirte y para examinarte, en ese orden. Las preguntas son mías, o sea que están bien hechas; si te parecen difíciles, tómalo como un cumplido.',
    'Brisa. Un repaso corto, querido amigo, y nada de esto se apunta en tu contra. Es para saber qué se ha quedado; lo que no se haya quedado se relee y ya está.',
  ],

  abreCaso: [
    'Unas preguntas, querido amigo. No para juzgarte -eso lo hace Kelsier- sino para ver qué se te ha quedado y qué se ha ido por el desagüe.',
    (contexto) =>
      `${contexto.cuantas} preguntas. Las he elegido donde la gente se equivoca, que es donde merece la pena preguntar.`,
    'Unas preguntas, y te aviso de lo mejor que tienen: aquí fallar es gratis. Es el único sitio de este camino donde equivocarse no cuesta ni una croqueta.',
    (contexto) =>
      `${contexto.cuantas} preguntas, elegidas por mí, o sea que están bien elegidas. Si alguna se te atraviesa, es información y no un veredicto.`,
  ],

  bordado: [
    'Todas. Reconozco que esperaba una menos, y reconocerlo me cuesta más que a ti acertarlas.',
    'Pleno. Voy a atribuirme parte del mérito, porque las preguntas eran mías.',
    'Todas correctas. Pienso contar por ahí que las preparé especialmente difíciles, y tú no me contradigas.',
    'Pleno, querido amigo. Y ahora el aviso útil: lo que hoy te sale de corrido, dentro de tres semanas se habrá puesto blando. Vuelve a asomarte entonces.',
  ],

  bien: [
    'La mayoría. Lo que has fallado no lo has fallado por casualidad: vuelve a ese apunte, sin prisa.',
    'Bien, en general. Y ese fallo de ahí en concreto conviene mirarlo hoy y no dentro de un mes.',
    'Bien, con un par de tropiezos. Los tropiezos son la parte aprovechable de todo esto: te dicen qué apunte abrir, y son dos, no diez.',
    'Casi todo bien, y lo poco que no, lo has fallado con mucha convicción. Vuelve a esos dos apuntes; no hace falta más, y yo no suelo recomendar poco trabajo.',
  ],

  flojo: [
    'Menos de la mitad, y no pasa nada: significa que has encontrado exactamente lo que había que encontrar. Vuelve a los apuntes de esos retos.',
    'Flojito. Te lo digo con todo el cariño del que soy capaz, que no es mucho: relee y vuelve.',
    'Poco. Y escucha esta parte sin adornos, que es la que sirve: esto no mide lo que vales, mide qué hay que releer. Empieza por el primer reto fallado y sigue en orden.',
    'Ha ido flojo. Te lo cuento con la voz bonita porque para eso me pagan, pero el contenido es este: hay unos cuantos retos que tienes que releer y están todos señalados.',
  ],
}

/**
 * Lo que dice Brisa mientras juegas la primera era.
 *
 * Aplacador: su oficio es empujarte el ánimo hablando, y lo hace con el doble de
 * palabras de las necesarias porque le gusta oírse. Nunca insulta -eso es de
 * Kelsier- pero tampoco te ahorra la verdad; simplemente la envuelve.
 *
 * Su humor es **el del condescendiente encantador**: se queja de todo, presume
 * sin ningún disimulo, se atribuye la mitad de tus méritos con total descaro y
 * por debajo te está enseñando de verdad. La broma es siempre a costa de su
 * propia vanidad o del mundo, nunca a costa de quien está aprendiendo: a quien
 * aprende lo trata de «querido amigo» y lo dice en serio.
 *
 * Y como es aplacador de oficio, cuando dice algo útil lo dice envuelto: en la
 * mitad de sus frases hay una instrucción concreta -qué leer, qué cambiar, qué
 * mirar primero- debajo de un adorno. El adorno es el vehículo, no el mensaje.
 *
 * Los eventos se llaman igual que los de Wayne porque los dispara el mismo
 * juego. Lo que cambia es la boca.
 */
const LINEAS_DE_BRISA_NARRANDO = {
  bienvenida: [
    'Querido amigo, bienvenido. Voy a hablar bastante, no lo tomes como algo personal: es mi oficio y encima me gusta.',
    'Vas a aprender PHP, y yo voy a acompañarte diciéndote lo bien que lo llevas. A veces será verdad.',
    'Antes de empezar: aquí nadie te va a obligar a nada. Solo te lo vamos a poner muy, muy fácil de aceptar.',
    'Bienvenido. Vamos a aprender PHP, que es un lenguaje del que todo el mundo opina y que muy poca gente ha aprendido con orden. Nosotros lo haremos con orden y con buena compañía.',
    'Querido amigo, esto funciona así: tú escribes y yo comento. Parece un reparto injusto y lo es, pero el que va a salir sabiendo eres tú, así que no me lo tengas en cuenta.',
  ],

  entrarAlMundo: [
    'Sitio nuevo. Respira, mira alrededor y no toques nada hasta que te lo explique alguien. Preferiblemente yo.',
    'Adelante. He estado en peores, y en casi todos hablando yo.',
    'Aquí es. Verás que da menos miedo cuando alguien te lo cuenta con calma.',
    'Un sitio nuevo, y lo primero que hay que hacer aquí no es escribir: es leerse el enunciado dos veces. Fíjate en el esfuerzo que me cuesta recomendar leer más y hablar menos.',
    'Adelante. Aquí dentro hay una idea nueva y unas cuantas de las de siempre. La nueva da miedo cinco minutos; las de siempre son las que hacen el trabajo.',
    'Aquí estamos. Te lo voy a presentar despacio, porque una cosa explicada despacio parece la mitad de difícil. Es un truco viejo y sigue funcionando igual de bien.',
    'Otro mundo. No te dejes impresionar por el nombre: los nombres los pone alguien que quería sonar importante, y de eso yo sé bastante.',
  ],

  primerIntento: [
    'Pruébalo, hombre. Lo peor que puede pasar es que no funcione, y eso lo arreglamos hablando.',
    'Dale. Nadie mira, y si mira, yo me encargo de que le parezca bien.',
    'Pruébalo ya, querido amigo. Un código sin ejecutar es una opinión, y de opiniones voy yo sobrado.',
    'Adelante. Y mira lo que sale antes de arreglar nada: mucha gente cambia tres cosas sin haber leído lo que decía la primera.',
    'Envíalo. Si sale bien me atribuyo la mitad, y si sale mal hemos aprendido los dos y encima gratis.',
    'Venga. El primer intento no es para acertar: es para averiguar qué esperaba el reto. Eso te lo cuenta él mejor que yo, y mira que es decir.',
    'Adelante sin miedo. Yo he empezado conversaciones bastante peor preparadas que ese código y han salido razonablemente bien.',
  ],

  testFallado: [
    'No ha salido. Y fíjate qué suerte: ahora sabes exactamente qué no era.',
    'Ha fallado, sí. Léete el mensaje entero, que está siendo mucho más claro contigo que la mayoría de la gente.',
    'Casi. «Casi» no vale nada, pero suena bien y a veces con eso basta para seguir.',
    'Vaya. Bueno. Te lo digo con mi mejor voz: vuelve a intentarlo.',
    'No. Léete el mensaje hasta el final, sin saltártelo: al final suele estar lo que esperaba y lo que ha recibido, uno junto al otro y para que se comparen.',
    'Ha fallado, y con dignidad. Antes de cambiar nada, dime qué creías que iba a salir; si no coincide con lo que ha salido, ahí estaba el malentendido.',
    'Nada. Cambia una sola cosa y vuelve a probar. Una. Cambiar cuatro a la vez es lo que hace la gente con prisa, que luego acierta y no sabe a quién dar las gracias.',
  ],

  errorDeSintaxis: [
    'Eso todavía no es PHP. Le falta algo pequeño, y lo pequeño es lo que más rabia da.',
    'No ha podido ni leerlo. Y mira que yo he conseguido que me lean cosas peores.',
    'Un símbolo de más o de menos. Nunca los justos, ¿te has fijado?',
    'No ha llegado ni a ejecutarse, que es una suerte disfrazada de desgracia: los errores que se ven a la primera son los baratos. Cuenta las comillas y los paréntesis, que van por parejas.',
  ],

  requisitoIncumplido: [
    'Funciona, y aun así no vale. El reto pedía otra cosa, y por una vez las normas no las he puesto yo.',
    'Has llegado al mismo sitio por otro camino. Muy propio de esta casa, pero hoy no.',
    'Cumple el resultado y se salta la forma, querido amigo. Y aquí la forma es el temario: el reto no quiere que llegues, quiere que llegues por ahí.',
    'No, no. Te has escapado por la ventana estando la puerta abierta. Vuelve a la puerta, que la vas a necesitar en el mundo siguiente.',
  ],

  tiempoAgotado: [
    'Sigue pensándoselo. Y yo, que puedo hablar horas, empiezo a impacientarme.',
    'Demasiado rato. Algo se ha quedado dando vueltas sin saber cómo salir.',
    'No vuelve. Busca algo que se repite sin tener motivo para pararse; casi siempre es eso, y casi siempre cabe en una línea.',
    'Demasiado tiempo. Un programa que no contesta es como un orador sin final: técnicamente sigue trabajando y ya no le escucha nadie.',
  ],

  retoSuperado: [
    'Funciona. Permíteme atribuirme una pequeña parte del mérito.',
    'Ahí está. No ha sido tan terrible, ¿verdad? Nada lo es cuando lo cuenta la persona adecuada.',
    'Resuelto. Lo apunto, y de paso me apunto yo.',
    'Bien hecho, querido amigo. Y lo digo sin empujarte el ánimo, que conste.',
    'Funciona, y funciona por lo que tú creías que funcionaría. Lo segundo es lo que hay que celebrar; lo primero pasa a veces por accidente.',
    'Resuelto. Antes de seguir, dilo con tus palabras en una frase. Si te sale, es tuyo; si no te sale, lo tienes alquilado.',
    'Ahí está. Y me permito una observación profesional: has tardado menos que en el anterior. Yo esas cosas las noto, es mi oficio.',
  ],

  superadoSinPistas: [
    'Sin pistas ni ayuda. Reconozco que esperaba tener que intervenir.',
    'Solo, a la primera y sin preguntar. Empiezo a sentirme innecesario, que es una sensación nueva.',
    'Sin pistas y sin ayuda. Me quedo sin trabajo, aunque el ánimo te lo empujaré igual, por pura costumbre.',
    'Ni una pista. Apunta cómo has empezado, no cómo has acabado: empezar bien es la parte que se puede repetir.',
  ],

  jefeDerrotado: [
    'Eso era lo gordo y ha caído. Voy a contarlo esta noche con más adjetivos.',
    'Terminado. Y sin que nadie tuviera que apaciguar a nadie, lo cual en esta tripulación es raro.',
    'Ha caído el difícil. Y fíjate en que no has usado nada nuevo: has usado todo lo viejo a la vez, que es lo que se llama saber.',
    'Cerrado. He visto celebrar con mucho más ruido cosas bastante menores, así que permíteme hacer algo de ruido.',
  ],

  sinCroquetas: [
    'No te queda nada. Podría prestarte, pero entonces me deberías algo y eso lo cambia todo.',
    'Cero croquetas. Resuelve algo, que es la única manera limpia de arreglarlo.',
    'Sin fondos, querido amigo. Resuelve uno de los primeros, que ya te los sabes de memoria, y vuelves con el bolsillo lleno y el ánimo alto.',
    'Se han terminado. Y no me mires así: convencer a alguien de que te fíe es mi especialidad, y precisamente por eso sé que conmigo no funciona.',
  ],

  inactividad: [
    '¿Seguimos? Puedo esperar. Puedo esperar hablando, incluso.',
    'Sigo aquí. Si necesitas pensar, piensa; yo relleno el silencio.',
    'Aquí seguimos. Si llevas mucho rato en la misma línea, apártate de ella y lee otra vez el enunciado: casi nunca falla la línea, falla lo que creías que te pedían.',
    'Tómate tu tiempo. Yo lo relleno hablando, que es lo único que se me da mejor que esperar.',
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
    'A la gente le cuesta creer que hablar sea un oficio. Luego intenta explicar su propio código en voz alta y ya le cuesta menos.',
    'Un programa es como un argumento: si tiene demasiadas partes, nadie llega al final. Corta antes de que se pierdan.',
    'Yo no memorizo nada que pueda consultar. Memorizo dónde estaba consultado, que ocupa muchísimo menos.',
    'Lo más difícil de una explicación no es explicar. Es decidir qué se deja fuera, y ahí me equivoco yo constantemente.',
  ],

  mundoCompletado: [
    (contexto) => `${contexto.mundo}, terminado. Voy a decir que ayudé, porque es verdad.`,
    (contexto) => `Se acabó ${contexto.mundo}. Reconozco que ha ido mejor de lo que le dije a Kelsier que iría.`,
    (contexto) => `${contexto.mundo}, cerrado. Y lo bueno no es lo de hoy: es que lo de tres mundos atrás ya lo usas sin pararte a pensarlo.`,
    (contexto) => `Terminado ${contexto.mundo}. Lo celebraré con unas palabras breves. Breves para mí, quiero decir.`,
  ],
}

// Brisa hace dos papeles en la primera era: narra y abre los repasos. Los
// dos sacos se juntan aquí porque es la misma voz, no dos personas.
export default { ...LINEAS_DE_BRISA, ...LINEAS_DE_BRISA_NARRANDO }

// Los repasos piden el saco de los repasos a secas, sin el de narrar.
export { LINEAS_DE_BRISA, LINEAS_DE_BRISA_NARRANDO }
