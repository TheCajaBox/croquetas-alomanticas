/**
 * Todo lo que dice Wayne.
 *
 * Cada evento del juego tiene su propio saco de frases; el almacén del
 * narrador elige una sin repetir las últimas, porque el mismo chiste dos veces
 * seguidas deja de tener gracia y empieza a tener otra cosa.
 *
 * Una línea es una cadena, o una función que recibe el contexto del momento
 * (el nombre del gato, el del reto, el error real) y devuelve la cadena.
 *
 * Todos los diálogos son originales, escritos imitando el registro del
 * personaje. No hay texto copiado de los libros.
 */

export const LINEAS = {
  bienvenida: [
    'Bueno, bueno. Otro que quiere aprender a programar. Yo de eso no sé nada, pero se me da de miedo opinar.',
    'Norma número uno: yo no robo, intercambio. Si al final te falta algo, es que te he dejao otra cosa mejor.',
    'Wax dice que no debería ser yo quien te enseñe esto. Wax dice muchas cosas.',
    'Te aviso ya: aquí se escribe código de verdad. Nada de mirar y asentir.',
  ],

  entrarAlMundo: [
    'Sitio nuevo. Mantén las manos donde yo pueda verlas.',
    'Muy bien, aquí es. Tú tranquilo, que si sale mal la culpa será tuya.',
    'Ya hemos llegao. Y sin perdernos, que es más de lo que suele pasar.',
  ],

  primerIntento: [
    'Venga, dale. Lo peor que puede pasar es que no funcione, y eso pasa siempre.',
    'Pruébalo. Total, aquí no explota nada. Casi nunca.',
    'Ejecuta ya, hombre, que no muerde.',
  ],

  testFallado: [
    'Vale, no ha funcionao. Pero míralo así: ahora sabes una forma más de no hacerlo. Yo me sé unas cuatrocientas.',
    'Casi. Y "casi", en esto, vale exactamente lo mismo que nada. Pero suena mejor.',
    'Nah. Tampoco te agobies: a Wax le costó tres meses aprender a recargar sin mirar.',
    'Ha fallao. No me mires a mí, yo solo leo lo que pone.',
    'Fallo. De los pequeñitos, que son los que dan rabia de verdad.',
    'No. Pero lo has dicho con mucha seguridad, eso hay que reconocerlo.',
    (contexto) =>
      contexto?.fallo
        ? `Dice que ${contexto.fallo.toLowerCase()} Y yo me fío, que es el que lo ha visto.`
        : 'Eso no es lo que había que hacer. Léete otra vez el enunciado, anda.',
  ],

  errorDeSintaxis: [
    'Eso todavía no es JavaScript. Es JavaScript en potencia. Le falta un símbolo por ahí.',
    'Te has dejao algo abierto. Un paréntesis, una llave, un cajón. Algo.',
    'Ni ejecutarlo he podido. Y mira que yo ejecuto cosas sin pensármelo.',
    'Hay un símbolo de más o uno de menos. Nunca los justos, ¿te has fijao?',
    (contexto) =>
      contexto?.linea
        ? `Línea ${contexto.linea}. Ahí. No, no busques en otro lao, que te lo estoy diciendo.`
        : 'Está mal escrito, y ni el ordenador ni yo sabemos qué querías decir.',
  ],

  bucleInfinito: [
    'Ese bucle da más vueltas que yo cuando finjo que sé dónde estoy. Ponle una salida.',
    'Enhorabuena, has inventao la máquina de no parar nunca. Ahora quítala.',
    'Tu bucle no sabe cuándo irse a casa. Como yo en las tabernas, pero con menos gracia.',
    'Cien mil vueltas y subiendo. Eso ya no es un bucle, es una condena.',
  ],

  tiempoAgotado: [
    'Se te ha acabao el tiempo. Y eso que aquí el tiempo lo manejo yo bastante bien.',
    'Tres segundos. Hasta dentro de una burbuja habría acabao ya.',
    'Sigue pensándoselo. Yo tengo cosas que hacer.',
  ],

  requisitoIncumplido: [
    'Funcionar a lo mejor funciona. Pero te has saltao las normas, y las normas las pongo yo.',
    'No, no y no. Que sí, que llegas al mismo sitio. Pero por el camino que yo digo.',
    'Muy listo. Demasiado. Vuelve a hacerlo como toca.',
    'Eso es hacer trampas, y las trampas son cosa mía.',
  ],

  pistaPedida: {
    1: [
      'Va, una gratis, que hoy me has caío bien. Y porque no me cuesta nada.',
      'Toma pista. Tampoco es gran cosa; es que no te has ganao gran cosa.',
      'La primera siempre sale de la casa. Las otras salen de tu bolsillo.',
    ],
    2: [
      'Esta te va a costar unas croquetas. Que los gatos comen, ¿eh?, del aire no viven.',
      'Vale, pero se paga. Yo no regalo dos veces seguidas, que tengo una reputación.',
      'Croquetas por delante. Y no te quejes, que te estoy haciendo un favor a precio de amigo.',
    ],
    3: [
      'Esto ya es prácticamente la respuesta, así que te va a costar. Y no me mires así: yo no robo, te dejo algo a cambio.',
      'La última. Después de esta ya no es tu solución, es la mía con tu nombre puesto.',
      'Cara. Muy cara. Pero es que te la estoy dando entera, mírala.',
    ],
  },

  retoSuperado: [
    'Funciona. No me preguntes por qué, pero funciona.',
    'Bien. Lo has hecho bien. Ya está, no pienso repetirlo.',
    'Mira tú por dónde. Toma tus croquetas antes de que me arrepienta.',
    'Superao, y solo has tardao lo que tarda Wax en explicar algo sencillo.',
    'Vale. Vale. Está bien. No pongas esa cara de listo.',
  ],

  superadoSinPistas: [
    '¿A la primera y sin pistas? O eres listo, o te lo he chivao yo sin darme cuenta. Me quedo con lo segundo.',
    'Sin pistas. Vale. Tampoco hace falta que te lo creas tanto.',
    'Ni una pista. Estás empezando a caerme regular.',
  ],

  rachaSube: [
    (contexto) => `${contexto.racha} seguidos sin pedirme nada. Empiezo a preocuparme por el negocio.`,
    (contexto) => `Van ${contexto.racha} sin pistas. Como sigas así tendré que buscarme otro oficio.`,
    (contexto) => `${contexto.racha} de seguido y sin abrir el puesto. Wax estaría insoportable ahora mismo.`,
  ],

  rachaRota: [
    (contexto) => `Ahí se fue la racha. Iban ${contexto.racha}. Tranquilo, que las croquetas no las devuelvo.`,
    (contexto) => `${contexto.racha} llevabas. Bueno. Yo también he perdido rachas, y sombreros, y una vez un caballo.`,
    'Y se acabó la racha. Pero mira, has aprendido algo y yo he cobrado. Ganamos los dos.',
  ],

  mundoCompletado: [
    (contexto) => `${contexto.mundo}, terminado. Uno menos y sigues de una pieza.`,
    (contexto) => `Se acabó ${contexto.mundo}. Voy a contarlo por ahí diciendo que ayudé.`,
    (contexto) => `Con ${contexto.mundo} ya no te queda nada por hacer aquí. Vámonos antes de que nos den algo que firmar.`,
  ],

  insigniaGanada: [
    (contexto) => `Te has ganado eso de «${contexto.insignia}». No vale croquetas, pero queda bien en la vitrina.`,
    (contexto) => `«${contexto.insignia}». Marasi lo apunta todo, ya lo sabes.`,
    (contexto) => `Anda, «${contexto.insignia}». Yo tengo una parecida, pero me la hice yo.`,
  ],

  jefeDerrotado: [
    'Se acabó este sitio. Coge tus cosas. Y las mías, si las ves por ahí.',
    'Eso era lo gordo y lo has tumbao. Hoy invito yo. A mirar.',
    'Fin del asunto. Voy a contarlo por ahí cambiando algún detalle.',
  ],

  gatoAdoptado: [
    (contexto) => `Te presento a ${contexto.gato}. Yo no me haría amigo suyo, pero tú mismo.`,
    (contexto) => `${contexto.gato} se viene contigo. Ya está, ya no hay marcha atrás.`,
    (contexto) => `Este es ${contexto.gato}. Le he dicho que eres de fiar. No me dejes mal.`,
  ],

  gatoDesatendido: [
    (contexto) => `Oye. ${contexto.gato} lleva un rato mirándote como me mira Wax cuando le escondo el sombrero.`,
    (contexto) => `${contexto.gato} tiene hambre. Y memoria. Sobre todo memoria.`,
    (contexto) => `Yo no me meto, pero ${contexto.gato} está la mar de triste y aquí solo estamos tú y yo.`,
  ],

  gatoCuidado: [
    (contexto) => `${contexto.gato} está contento. Disfrútalo, que dura poco.`,
    'Ya está, ya has cumplido. Qué buena persona eres, de repente.',
    (contexto) => `A ${contexto.gato} le has caído bien. A mí me costó más.`,
  ],

  sinCroquetas: [
    'No te queda ni una croqueta. Podrías resolver algo, que es la parte del trato que te toca a ti.',
    'Cero croquetas. Y las pistas, ya lo sabes, no se pagan con buenas intenciones.',
    'Estás sin blanca. Te prestaría, pero es que no.',
  ],

  vuelvesTrasUnaSemana: [
    '¡Anda! Has vuelto. Los gatos y yo ya nos habíamos repartido tus cosas.',
    'Cuánto tiempo. Tranquilo, no he tocao nada. Casi nada.',
    'Ya pensaba que te habías ido a Elendel a hacer algo de provecho.',
  ],

  inactividad: [
    '¿Seguimos? Te lo digo porque llevo un rato aquí de pie.',
    'Sigo aquí, ¿eh? Por si te lo estabas preguntando. Que no.',
    'Si necesitas pensar, piensa. Yo mientras miro el sombrero.',
  ],

  /**
   * Lo que suelta Wayne cuando no ha pasado absolutamente nada. No informa de
   * nada y no hay que hacerle caso: es que está ahí y se aburre.
   */
  charla: [
    'Una vez cambié un caballo por un sombrero. Salí ganando, y el del caballo también lo pensaba.',
    'Wax dice que los nombres de las variables tienen que explicarse solos. Yo a mi sombrero lo llamo «sombrero» y nos entendemos.',
    'Lo bueno de los ordenadores es que te dicen que te has equivocao sin ponerte esa cara. Wax pone la cara.',
    'Si algo funciona a la primera, desconfía. Yo desconfío hasta cuando funciona a la tercera.',
    'He conocido a gente que programa de pie. No les preguntes por qué, porque te lo cuentan.',
    'El truco de una buena coartada y el de un buen código es el mismo: que no haya que explicarlo dos veces.',
    'Ese gato lleva un rato mirando la pantalla. O sabe más que tú, o hay una mosca.',
    'A mí lo de las llaves y los paréntesis me recuerda a los abogados. Todo son parejas y si falta una, ya la has liao.',
    'Antes había un tipo en los Áridos que escribía sus planes en un papel. Le pillaron por eso. Comenta menos, escribe mejor.',
    'Deberías beber agua. Lo digo yo, que no bebo agua.',
    'Con el tiempo aprendes a mirar un código y saber si su autor dormía bien. Este tuyo tiene buena pinta. Más o menos.',
    'Yo no tengo un sombrero favorito. Tengo el que llevo puesto, que siempre es el mejor.',
    'Marasi lo apuntaría todo en una libreta. Yo me lo apunto en un sombrero, que se pierde menos.',
    'Un consejo gratis, y de los de verdad: si llevas veinte minutos con lo mismo, levántate. Vuelves y está resuelto. No sé por qué.',
    'Nunca he entendido lo de los números que empiezan en cero. Wax dice que es lógico. Wax dice eso de todo.',
  ],

  verborreaBaja: [
    '¿Que me calle? Muy bien. Perfecto. No diré ni una palabra más. ...¿Ves? Ni una.',
    'Callao. Como una tumba. Una tumba con muy buenas ideas que no comparte.',
  ],

  sombreroEncontrado: [
    (contexto) => contexto.dice,
    (contexto) => `${contexto.dice} Toma unas croquetas y no se lo cuentes a nadie.`,
    (contexto) => `¡Eh! Ese es mío. ${contexto.dice}`,
  ],

  todosLosSombreros: [
    'Los doce. Todos. No me queda ni uno escondido y me siento raro, la verdad. Quédatelos: se te da mejor que a mí guardarlos.',
  ],

  trastoRecibido: [
    (contexto) => `A cambio te dejo esto: ${contexto.trasto}. Es un intercambio justo, no me discutas.`,
    (contexto) => `Toma, ${contexto.trasto}. No vale nada, pero es tuyo y eso no te lo quita nadie.`,
    (contexto) => `${contexto.trasto}. De nada. Ya me lo agradecerás cuando te haga falta, que no te hará.`,
  ],
}

/**
 * Lo que dice Wax.
 *
 * Wayne va de gracioso y cobra por las pistas; Wax aparece cuando la cosa se
 * pone seria y explica de verdad, gratis, porque para él eso no se cobra.
 * Sale solo, sin que se lo pidan, cuando lleva un rato sin salirte un reto.
 */
export const LINEAS_DE_WAX = {
  presentacion: [
    'Waxillium Ladrian. Wayne me ha dicho que te vendría bien alguien que se explicara sin cobrar por ello. Vamos a mirarlo con calma.',
  ],

  atascado: [
    'Tres intentos. Eso casi nunca es un descuido: suele ser que estás resolviendo un problema distinto del que hay. Ábrete mi apunte y léelo entero antes de tocar el código otra vez.',
    'Para un momento. Vuelve a leer el mensaje del test, entero y despacio: ahí está dicho exactamente qué esperaba y qué ha recibido.',
    'No es cabezonería tuya, es que falta un dato. Está en el apunte, justo debajo del enunciado.',
  ],

  insiste: [
    'Sigue sin salir, y ya van unas cuantas. Lee el apunte y, si después sigue igual, cómprale a Wayne la pista cara. Para eso está, aunque él lo cuente de otra manera.',
    'Cuando algo se resiste tanto, casi siempre es una idea equivocada de base y no una errata. Empieza otra vez desde el enunciado.',
  ],

  enhorabuena: [
    'Buen trabajo. Y lo digo yo, que no exagero nunca.',
    'Eso estaba bien resuelto. No te acostumbres a que te lo diga.',
  ],
}

/**
 * Lo que dice Marasi.
 *
 * Lleva los repasos. Es la que se toma en serio lo que ya has visto y comprueba
 * si sigue ahí, porque resolver algo una vez y no volver a verlo nunca es la
 * forma más rápida de olvidarlo.
 */
export const LINEAS_DE_MARASI = {
  presentacion: [
    'Marasi Colms. Me interesa menos lo que sabes resolver que lo que recuerdas una semana después, así que he preparado unas preguntas sobre lo que ya has visto.',
  ],

  abreCaso: [
    'He revisado por dónde vas y he sacado las preguntas de lo que más se confunde. No es un examen: es para ver qué se ha quedado.',
    'Seis preguntas sobre lo que ya has hecho. Si fallas alguna, mejor: eso es exactamente lo que había que encontrar.',
  ],

  bordado: [
    'Todas. Y sin dudar en ninguna, por lo que he visto. Eso se ha quedado.',
    'Pleno. Lo digo con conocimiento de causa: estas preguntas están puestas donde la gente falla.',
  ],

  bien: [
    'La mayoría. Lo que has fallado no es casualidad, así que vuelve al apunte de ese reto y léelo otra vez con calma.',
    'Bastante bien. Apunta lo que has fallado; son justo los sitios donde volverás a tropezar.',
  ],

  flojo: [
    'Menos de la mitad. No es un problema: significa que ese mundo hay que volver a leerlo, no que no valgas para esto.',
    'Ha ido flojo. Es información útil: ya sabes exactamente qué repasar, y eso vale más que un aprobado.',
  ],
}

/**
 * Lo que dice MeLaan.
 *
 * Se dedica a las reescrituras, que es lo suyo: cambiar de forma sin dejar de
 * ser lo mismo.
 */
export const LINEAS_DE_MELAAN = {
  presentacion: [
    'MeLaan. Cambiar de forma se me da bien, así que me han puesto con esto. Tranquilo, que aquí nada de lo que escribas va a cambiar de comportamiento: solo de aspecto.',
  ],

  funcionaYaLoSe: [
    'Ya sé que funciona. Ese es el asunto: reescribir algo que está roto es arreglarlo, y no tiene ningún mérito. Reescribir algo que funciona es lo difícil.',
    'Sí, los tests pasan. Ejecútalo antes de tocar nada y compruébalo, que luego querrás saber que estaban verdes al empezar.',
  ],

  mismaCosa: [
    'Misma cosa, otra cara. Es exactamente lo que hago yo, y te aseguro que tiene más trabajo del que parece.',
    'Lo has cambiado entero y hace lo mismo que antes. Eso, hecho bien, es medio oficio.',
  ],
}

/**
 * Steris. No hace bromas, no las intenta y no le hacen falta: dice lo que hay
 * que saber, en el orden en que hace falta saberlo, y se calla. Su gracia está
 * justo en que es la única que no está haciendo gracia.
 */
export const LINEAS_DE_STERIS = {
  presentacion: [
    'Steris Harms. He preparado esto por orden: primero comparar, después decidir, después repetir y al final guardar. En ese orden y no en otro, porque cada cosa se apoya en la anterior. Si algo no se entiende, no es que no valgas: es que falta un paso antes, y lo habré puesto mal yo.',
  ],

  loBasico: [
    'Esto no es lo emocionante. Es lo que sujeta lo emocionante. Nadie presume de cimientos y todo el mundo se muda cuando fallan.',
    'Sé que parece poca cosa comparado con lo que viene después. También lo parecen los cimientos comparados con la casa.',
  ],

  previsto: [
    'Ese fallo estaba previsto. Lo he visto tantas veces que le he reservado un sitio en la lista.',
    'Lo tenía apuntado. No es consuelo, pero al menos no es una sorpresa para nadie.',
  ],
}

/**
 * Armonía.
 *
 * Dos sacos y nada más, a propósito: no usa el bocadillo del narrador ni suelta
 * ocurrencias en una esquina. Habla en su panel, cuando se le pregunta. Un dios
 * que va comentando la jugada deja de ser un dios.
 *
 * El registro es el de la era 2, no el del Sazed servicial de antes: formal,
 * sereno, con peso. Cálido y nunca colega. Y cuando se contiene no se escuda en
 * ninguna norma, porque no la hay: es que sabe lo que pasa cuando da de más.
 */
export const LINEAS_DE_ARMONIA = {
  presentacion: [
    'Sé quién eres, y sé exactamente en qué reto te has quedado parado. No deberías extrañarte: lo sé casi todo, y por eso mismo tengo mucho cuidado con lo que digo.\n\nPregúntame qué significa una palabra, qué significa un error, o dónde se explicaba algo que ya viste. Eso te lo doy entero.\n\nLa solución de un reto, no. Nunca. Y no por prudencia: porque dártela sería quitarte lo único que has venido a buscar.',
  ],

  senegativa: [
    'No. Y la respuesta no va a cambiar por insistir.',
    'Podría. Por eso mismo no lo hago.',
  ],
}

/**
 * Eventos que Wayne suelta incluso con la verborrea al mínimo: son los que
 * llevan información útil, no los que solo llevan a Wayne.
 */
export const EVENTOS_IMPORTANTES = new Set([
  'sombreroEncontrado',
  'mundoCompletado',
  'insigniaGanada',
  'todosLosSombreros',
  'errorDeSintaxis',
  'bucleInfinito',
  'tiempoAgotado',
  'requisitoIncumplido',
  'jefeDerrotado',
  'gatoAdoptado',
  'sinCroquetas',
  'verborreaBaja',
])
