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
 * Eventos que Wayne suelta incluso con la verborrea al mínimo: son los que
 * llevan información útil, no los que solo llevan a Wayne.
 */
export const EVENTOS_IMPORTANTES = new Set([
  'sombreroEncontrado',
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
