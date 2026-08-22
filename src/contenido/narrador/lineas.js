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
 * personaje. **No hay una sola línea copiada de los libros**, y no la va a
 * haber: esto es un repositorio público y ese texto tiene dueño y traductor.
 * Lo que sí se imita, a propósito y por escrito para que no se pierda, son sus
 * manías:
 *
 * - **Le habla al sombrero** como si fuera alguien, y a veces le hace caso.
 * - **Corrige la gramática** en el peor momento posible.
 * - **Consuela fatal**: siempre hay alguien peor, y lo dice.
 * - **Infla las historias** hasta que no queda nada de verdad, y lo reconoce a
 *   mitad de frase.
 * - **Nunca dice que bebe**: investiga estados.
 * - **No roba**: intercambia, y te deja algo peor a cambio.
 */

/**
 * Los lemas del retrato de la portada.
 *
 * Cortos y de los suyos: la portada enseña uno distinto cada vez que se entra,
 * porque leer siempre la misma frase debajo de la misma cara acaba siendo parte
 * del mueble y deja de leerse.
 */
export const LEMAS_DE_WAYNE = [
  'Yo no robo. Intercambio.',
  'Un sombrero prestado también es un sombrero.',
  'Nunca llevo pistola. Llevo conversación.',
  'Si sale mal, lo contamos de otra manera.',
  'El acento se cambia; las manías no.',
  'Wax dice muchas cosas. Yo digo las buenas.',
  'Todo se arregla hablando. Casi todo. Bueno, algunas cosas.',
  'Aquí se paga en croquetas, que es la única moneda seria.',
  'Le hablo al sombrero. Él me contesta menos.',
  'Investigo estados alternativos a la sobriedad.',
  'Consuélate: podría ser peor. Casi siempre puede.',
]

/**
 * Los de Vin, para el retrato de la primera era.
 *
 * Ella no hace gracias: comprueba. Cuatro palabras y ya está dicho, que es
 * justo lo contrario de Wayne y por eso funciona tenerlos en el mismo juego.
 */
export const LEMAS_DE_VIN = [
  'No confíes en lo que no has probado.',
  'Si funciona a la primera, míralo otra vez.',
  'Nadie te va a dar nada. Cógelo.',
  'La ceniza cae igual para todos.',
  'Yo tampoco sabía. Aprendí.',
]

/**
 * Los de Brisa, que narra la primera era.
 *
 * Aplacador de oficio: habla mucho, se escucha con gusto y te está empujando el
 * ánimo mientras te lo cuenta. Nunca dice tres palabras si le caben nueve.
 */
export const LEMAS_DE_BRISA = [
  'Yo no te obligo a nada. Solo te lo pongo fácil.',
  'Hablar es gratis. Escuchar, no siempre.',
  'Todo el mundo quiere algo. Averigua qué, y ya está.',
  'Una buena explicación es media victoria. La otra media es tuya.',
  'Confía en mí, querido amigo. Es literalmente mi trabajo.',
]

/** Los de Galladon, que narra Elantris: escéptico y con paciencia corta. */
export const LEMAS_DE_GALLADON = [
  'Una línea de más y el aon no hace nada. Nada de nada.',
  'Aquí todo el mundo tiene un plan. Pregúntame qué tal salen.',
  'Trázalo bien o no lo traces.',
  'En mi tierra a esto lo llamaríamos optimismo.',
]

/** Los de Shai, que narra Sel: falsificadora, y buena. */
export const LEMAS_DE_SHAI = [
  'Todo lo que hay que verificar se puede falsificar.',
  'Nadie mira los sellos. Ese es el problema.',
  'No robo objetos. Robo el original.',
  'Si pasa la inspección, es verdad. Por ahora.',
]

/** Quién dice qué debajo de su retrato, por quien narre. */
export const LEMAS_POR_NARRADOR = {
  wayne: LEMAS_DE_WAYNE,
  vin: LEMAS_DE_VIN,
  brisa: LEMAS_DE_BRISA,
  galladon: LEMAS_DE_GALLADON,
  shai: LEMAS_DE_SHAI,
}

export const LINEAS = {
  bienvenida: [
    'Bueno, bueno. Otro que quiere aprender a programar. Yo de eso no sé nada, pero se me da de miedo opinar.',
    'Norma número uno: yo no robo, intercambio. Si al final te falta algo, es que te he dejao otra cosa mejor.',
    'Wax dice que no debería ser yo quien te enseñe esto. Wax dice muchas cosas.',
    'Te aviso ya: aquí se escribe código de verdad. Nada de mirar y asentir.',
    'Yo he sido muchas cosas: vaquero, abogado, viuda una vez. Profesor todavía no, así que tú tranquilo, que estrenamos los dos.',
    'Lo primero, las presentaciones. Yo soy Wayne. Lo segundo, cuenta los sombreros que llevas puestos, y luego los cuentas otra vez al salir.',
    'Aquí se paga en croquetas y se cobra en gatos. Es un sistema mejor que el de los bancos de Elendel, y más honrao.',
    'Antes de nada: si le hablo al sombrero, tú disimula. Lleva conmigo más años que cualquiera y se ofende si lo ignoran.',
  ],

  entrarAlMundo: [
    'Sitio nuevo. Mantén las manos donde yo pueda verlas.',
    'Muy bien, aquí es. Tú tranquilo, que si sale mal la culpa será tuya.',
    'Ya hemos llegao. Y sin perdernos, que es más de lo que suele pasar.',
    'Espera, que me pongo el acento de por aquí. Es de mala educación entrar en un sitio hablando como el de al lado.',
    'Sitio nuevo, reglas nuevas. Las reglas nuevas también las pongo yo, por cierto.',
    'A ver qué se nos ha perdido aquí. Algo se nos habrá perdido, siempre pasa.',
    'Quédate cerca y no toques nada. Se lo digo al sombrero, pero tú aplícatelo también.',
  ],

  primerIntento: [
    'Venga, dale. Lo peor que puede pasar es que no funcione, y eso pasa siempre.',
    'Pruébalo. Total, aquí no explota nada. Casi nunca.',
    'Ejecuta ya, hombre, que no muerde.',
    'Dale al botón. Peor lo tuvo Wax la primera vez que le tiré una moneda.',
    'Venga, que el primer intento es como el primer trago: está para saber lo que hay.',
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
    'Ha fallao, sí. Pero con estilo. Eso en los Áridos cuenta.',
    'No ha colao. Y mira que yo he colao cosas peores con menos.',
    'Eso no es. Respira, que no te persigue nadie. Que yo sepa.',
    'Nada. Si esto fuera una coartada, ya estarías detenío.',
    'Consuélate: podría haber fallado delante de más gente.',
    'Ha fallao, pero mírale el lado bueno: te está diciendo exactamente qué esperaba. Poca gente es así de clara contigo.',
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
    'Esto es como cuando finjo un acento que no me sé: se nota enseguida y encima queda raro.',
    'Ni empieza. Y para no empezar ya estoy yo, que llevo así toda la vida.',
    '«Esperaba una coma», dice. Fíjate: hasta la máquina conjuga mejor que la mitad de la gente que conozco.',
    'Esto no está mal escrito. Está CASI escrito, que es otra cosa y encima peor.',
  ],

  bucleInfinito: [
    'Ese bucle da más vueltas que yo cuando finjo que sé dónde estoy. Ponle una salida.',
    'Enhorabuena, has inventao la máquina de no parar nunca. Ahora quítala.',
    'Tu bucle no sabe cuándo irse a casa. Como yo en las tabernas, pero con menos gracia.',
    'Cien mil vueltas y subiendo. Eso ya no es un bucle, es una condena.',
    'Le has quitao la puerta a la habitación. Ahora está dentro y no sabe salir, pobre.',
    'Yo he estado en una burbuja de esas donde el tiempo va raro. Se sale. Tu bucle no.',
    'Al último que dejó uno así abierto se lo tragó la máquina. Bueno, eso no es verdad. Se quedó sin tarde, que es peor y además pasa.',
  ],

  tiempoAgotado: [
    'Se te ha acabao el tiempo. Y eso que aquí el tiempo lo manejo yo bastante bien.',
    'Tres segundos. Hasta dentro de una burbuja habría acabao ya.',
    'Sigue pensándoselo. Yo tengo cosas que hacer.',
    'Ni metiéndolo en una burbuja de bendalloy te da tiempo, y mira que ahí cunde.',
    'Demasiado lento. Y te lo dice uno que se pasa el día esperando a Wax.',
    'Demasiado rato pensando. Yo también hago eso, pero investigando otros estados.',
  ],

  requisitoIncumplido: [
    'Funcionar a lo mejor funciona. Pero te has saltao las normas, y las normas las pongo yo.',
    'No, no y no. Que sí, que llegas al mismo sitio. Pero por el camino que yo digo.',
    'Muy listo. Demasiado. Vuelve a hacerlo como toca.',
    'Eso es hacer trampas, y las trampas son cosa mía.',
    'Funciona, pero por el camino de al lado. Y hoy el camino de al lado está cortao.',
    'Eso es como pagar con un botón que parece una moneda. A mí no me lo cuelas, que lo inventé yo.',
  ],

  pistaPedida: {
    1: [
      'Va, una gratis, que hoy me has caío bien. Y porque no me cuesta nada.',
      'Toma pista. Tampoco es gran cosa; es que no te has ganao gran cosa.',
      'La primera siempre sale de la casa. Las otras salen de tu bolsillo.',
      'Una gratis, como el primer trago en una taberna decente. Después ya se paga todo.',
    ],
    2: [
      'Esta te va a costar unas croquetas. Que los gatos comen, ¿eh?, del aire no viven.',
      'Vale, pero se paga. Yo no regalo dos veces seguidas, que tengo una reputación.',
      'Croquetas por delante. Y no te quejes, que te estoy haciendo un favor a precio de amigo.',
      'Esta se paga. Y no es robar: te llevas la pista y me dejas las croquetas. Intercambio de manual.',
      'Te la vendo, aunque el sombrero opina que podrías sacarlo tú solo. El sombrero es muy optimista.',
    ],
    3: [
      'Esto ya es prácticamente la respuesta, así que te va a costar. Y no me mires así: yo no robo, te dejo algo a cambio.',
      'La última. Después de esta ya no es tu solución, es la mía con tu nombre puesto.',
      'Cara. Muy cara. Pero es que te la estoy dando entera, mírala.',
      'A este precio ya casi es más barato aprender. Tú mismo, que yo cobro igual.',
    ],
  },

  retoSuperado: [
    'Funciona. No me preguntes por qué, pero funciona.',
    'Bien. Lo has hecho bien. Ya está, no pienso repetirlo.',
    'Mira tú por dónde. Toma tus croquetas antes de que me arrepienta.',
    'Superao, y solo has tardao lo que tarda Wax en explicar algo sencillo.',
    'Vale. Vale. Está bien. No pongas esa cara de listo.',
    'Ha salío. Voy a apuntármelo como mérito mío, que para eso estaba yo delante.',
    'Bien hecho. Y lo digo sin acento raro ni nada, que eso conmigo es una medalla.',
    'Funciona a la primera y todo. A ver si va a resultar que se te da.',
    'Toma. Y no te lo gastes todo en pistas, que luego venís llorando.',
    'Bien. Se lo cuento al sombrero, que se alegra por ti más que yo.',
  ],

  superadoSinPistas: [
    '¿A la primera y sin pistas? O eres listo, o te lo he chivao yo sin darme cuenta. Me quedo con lo segundo.',
    'Sin pistas. Vale. Tampoco hace falta que te lo creas tanto.',
    'Ni una pista. Estás empezando a caerme regular.',
    'Sin pistas. Con esa cabeza podrías dedicarte a algo peor pagao, como la ley.',
    'Cero pistas. Como sigas así me tendré que buscar un sombrero más barato.',
    'Sin pistas. Al sombrero le ha impresionado, y él no se impresiona con nada.',
  ],

  rachaSube: [
    (contexto) => `${contexto.racha} seguidos sin pedirme nada. Empiezo a preocuparme por el negocio.`,
    (contexto) => `Van ${contexto.racha} sin pistas. Como sigas así tendré que buscarme otro oficio.`,
    (contexto) => `${contexto.racha} de seguido y sin abrir el puesto. Wax estaría insoportable ahora mismo.`,
    (contexto) => `${contexto.racha} seguidos. Ranette me dispara menos veces por semana que eso.`,
  ],

  rachaRota: [
    (contexto) => `Ahí se fue la racha. Iban ${contexto.racha}. Tranquilo, que las croquetas no las devuelvo.`,
    (contexto) => `${contexto.racha} llevabas. Bueno. Yo también he perdido rachas, y sombreros, y una vez un caballo.`,
    'Y se acabó la racha. Pero mira, has aprendido algo y yo he cobrado. Ganamos los dos.',
    'Rota. Bueno. Las rachas son como los sombreros: acaban cambiando de cabeza.',
  ],

  mundoCompletado: [
    (contexto) => `${contexto.mundo}, terminado. Uno menos y sigues de una pieza.`,
    (contexto) => `Se acabó ${contexto.mundo}. Voy a contarlo por ahí diciendo que ayudé.`,
    (contexto) => `Con ${contexto.mundo} ya no te queda nada por hacer aquí. Vámonos antes de que nos den algo que firmar.`,
    (contexto) => `${contexto.mundo} despachao. Steris ya lo tenía previsto, y eso me da un poco de rabia.`,
  ],

  insigniaGanada: [
    (contexto) => `Te has ganado eso de «${contexto.insignia}». No vale croquetas, pero queda bien en la vitrina.`,
    (contexto) => `«${contexto.insignia}». Marasi lo apunta todo, ya lo sabes.`,
    (contexto) => `Anda, «${contexto.insignia}». Yo tengo una parecida, pero me la hice yo.`,
    (contexto) => `«${contexto.insignia}». Póntela en el sombrero, que es donde se ven.`,
  ],

  jefeDerrotado: [
    'Se acabó este sitio. Coge tus cosas. Y las mías, si las ves por ahí.',
    'Eso era lo gordo y lo has tumbao. Hoy invito yo. A mirar.',
    'Fin del asunto. Voy a contarlo por ahí cambiando algún detalle.',
    'Eso ya está. Y sin sacar un arma, que es como más me gusta terminar las cosas.',
    'Se acabó. Yo lo habría resuelto hablando, pero cada uno tiene lo suyo.',
    'Hecho. Esta noche lo cuento con el doble de sangre y un caballo, que es como se cuentan estas cosas.',
  ],

  gatoAdoptado: [
    (contexto) => `Te presento a ${contexto.gato}. Yo no me haría amigo suyo, pero tú mismo.`,
    (contexto) => `${contexto.gato} se viene contigo. Ya está, ya no hay marcha atrás.`,
    (contexto) => `Este es ${contexto.gato}. Le he dicho que eres de fiar. No me dejes mal.`,
    (contexto) => `${contexto.gato} ya es tuyo. Que conste que yo lo vi primero.`,
    (contexto) => `Ahí tienes a ${contexto.gato}. No le he cambiao el nombre por nada, aunque me lo pensé.`,
  ],

  gatoDesatendido: [
    (contexto) => `Oye. ${contexto.gato} lleva un rato mirándote como me mira Wax cuando le escondo el sombrero.`,
    (contexto) => `${contexto.gato} tiene hambre. Y memoria. Sobre todo memoria.`,
    (contexto) => `Yo no me meto, pero ${contexto.gato} está la mar de triste y aquí solo estamos tú y yo.`,
    (contexto) => `${contexto.gato} te mira como Marasi cuando llegas tarde y encima traes excusas malas.`,
    (contexto) => `Hazle caso a ${contexto.gato}, anda. Un gato aburrido acaba tomando decisiones.`,
    (contexto) => `Le he preguntado al sombrero qué hacemos con ${contexto.gato} y me ha mirado a mí. O sea que muy mal.`,
  ],

  gatoCuidado: [
    (contexto) => `${contexto.gato} está contento. Disfrútalo, que dura poco.`,
    'Ya está, ya has cumplido. Qué buena persona eres, de repente.',
    (contexto) => `A ${contexto.gato} le has caído bien. A mí me costó más.`,
    (contexto) => `${contexto.gato} está como nuevo. Y sin curarse con oro ni nada.`,
    'Bien hecho. Los gatos se acuerdan de estas cosas, y yo también.',
  ],

  sinCroquetas: [
    'No te queda ni una croqueta. Podrías resolver algo, que es la parte del trato que te toca a ti.',
    'Cero croquetas. Y las pistas, ya lo sabes, no se pagan con buenas intenciones.',
    'Estás sin blanca. Te prestaría, pero es que no.',
    'Ni una croqueta. Y yo fío a mucha gente, pero justo hoy no.',
    'Sin fondos. Resuelve algo, que es la única manera honrada de arreglarlo. La otra la conozco yo y no te la voy a contar.',
    'Consuélate: hay gente con menos croquetas que tú. Poca. Pero haberla, hayla.',
  ],

  vuelvesTrasUnaSemana: [
    '¡Anda! Has vuelto. Los gatos y yo ya nos habíamos repartido tus cosas.',
    'Cuánto tiempo. Tranquilo, no he tocao nada. Casi nada.',
    'Ya pensaba que te habías ido a Elendel a hacer algo de provecho.',
    'Mira quién vuelve. He tenido tu sitio guardao y todo. Bueno, lo he usao, pero guardao.',
    'Cuánto sin verte. Los gatos preguntaban por ti; yo les decía que estabas trabajando.',
    'Le dije al sombrero que volverías. Él decía que no. Ahora me debe una ronda.',
  ],

  inactividad: [
    '¿Seguimos? Te lo digo porque llevo un rato aquí de pie.',
    'Sigo aquí, ¿eh? Por si te lo estabas preguntando. Que no.',
    'Si necesitas pensar, piensa. Yo mientras miro el sombrero.',
    'Aquí seguimos. Yo ya me he cambiado de acento dos veces y tú sin escribir una línea.',
    'Oye, ¿te lo estás pensando o te has ido a por algo de beber? Porque si es lo segundo, tráeme.',
    'Nada, tú a tu ritmo. Yo tengo un bastón, un sombrero y toda la tarde.',
    'Ya le he contado al sombrero cómo va tu código. Se ha quedao callado, que en él es mucho decir.',
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
    'Yo no robo sombreros: los cambio por otro sombrero. Que el otro sombrero sea imaginario es un detalle entre el sombrero y yo.',
    'Nunca llevo pistola. Un bastón te saca de casi todo, y de lo que no te saca, tampoco te sacaba la pistola.',
    'El acento lo es todo. Si entras en un barrio hablando como el de al lado, te miran. Con el código igual: escribe como escriben los de la casa.',
    'Una vez me pasé una tarde entera dentro de una burbuja de tiempo. Salí con las mismas ideas malas, pero antes.',
    'Ranette me ha disparado tres veces. Dos me las merecía. La tercera fue por la puerta, que eso ya es manía.',
    'MeLaan cambia de cara cuando le apetece. Yo cambio de acento, que es lo mismo pero más barato.',
    'Steris lo tiene todo previsto. Yo antes me reía. Luego pasó lo previsto y dejé de reírme.',
    'Marasi se lee las leyes enteras. Léete tú los mensajes de error enteros y estáis en paz.',
    'A Wax le da por tirar una moneda y salir volando. Cada uno resuelve sus problemas con lo que tiene a mano.',
    'En los Áridos aprendes que lo que no llevas encima no existe. En el código igual: lo que no has escrito no lo va a hacer nadie por ti.',
    'Si te sale a la primera, o eres bueno o el problema era malo. Yo, por costumbre, culpo al problema.',
    'Cuando algo se pone feo, yo hablo. Hablo mucho. Y mientras hablo, pienso. Prueba a explicarle el código en voz alta al gato, verás.',
    'Un buen sombrero, un buen bastón y saber cuándo callarse. Dos de tres no está mal.',
    'Yo el dinero lo entiendo mejor en croquetas. Los números grandes son cosa de Elendel y de la gente que lleva chaleco.',
    'Le he explicado al sombrero que hoy no salimos, que ahí fuera hay corriente. Ha protestado, pero se ha quedao.',
    'Mi sombrero dice que esa variable no se llama así. Y mira, el sombrero suele acertar.',
    'No estoy bebiendo: estoy investigando cómo se programa desde otros estados. Es prácticamente ciencia.',
    'Hay cosas que cuanto más las haces, peor se te dan. Copiar y pegar es una. Las otras no vienen al caso.',
    'Consuélate: por lo menos tú puedes borrar y escribirlo otra vez. Yo, de lo que digo, no borro nada.',
    'A mí me gustan los tests que te devuelven el golpe. Los que pasan a la primera no tienen carácter ninguno.',
    'Con el sombrero tengo dos normas: no se presta y no se moja. Ponte tú dos con el código, las que quieras, pero cúmplelas.',
    'Eso que has escrito ahí no es un error todavía. Lo será. Pretérito imperfecto, creo que se llama. O el otro.',
  ],

  verborreaBaja: [
    '¿Que me calle? Muy bien. Perfecto. No diré ni una palabra más. ...¿Ves? Ni una.',
    'Callao. Como una tumba. Una tumba con muy buenas ideas que no comparte.',
    'Silencio absoluto. Como en una burbuja, pero sin lo bonito.',
    'Ni una palabra. Se lo cuento todo al sombrero, que no se chiva.',
  ],

  sombreroEncontrado: [
    (contexto) => contexto.dice,
    (contexto) => `${contexto.dice} Toma unas croquetas y no se lo cuentes a nadie.`,
    (contexto) => `¡Eh! Ese es mío. ${contexto.dice}`,
  ],

  todosLosSombreros: [
    // El número va por contexto: escrito a mano se quedó viejo el día que
    // aparecieron dos sombreros nuevos, y Wayne se puso a contar mal.
    (contexto) =>
      `Los ${contexto.cuantos}. Todos. No me queda ni uno escondido y me siento raro, la verdad. ` +
      'Quédatelos: se te da mejor que a mí guardarlos.',
    (contexto) =>
      `${contexto.cuantos} sombreros y ni uno en mi cabeza. Esto no había pasado nunca. ` +
      'Voy a sentarme un rato.',
  ],

  trastoRecibido: [
    (contexto) => `A cambio te dejo esto: ${contexto.trasto}. Es un intercambio justo, no me discutas.`,
    (contexto) => `Toma, ${contexto.trasto}. No vale nada, pero es tuyo y eso no te lo quita nadie.`,
    (contexto) => `${contexto.trasto}. De nada. Ya me lo agradecerás cuando te haga falta, que no te hará.`,
    (contexto) => `Te dejo ${contexto.trasto} en su sitio. Así no es robar: es que ahora tienes otra cosa.`,
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
/**
 * Lo que dice Brisa cuando abre un repaso de la primera era.
 *
 * El mismo papel que Marasi en la segunda -repasar lo que ya se ha visto- y el
 * tono opuesto: ella lo pregunta por método, él porque le gusta oírse. Los
 * eventos se llaman igual porque los dispara la misma vista.
 */
export const LINEAS_DE_BRISA = {
  presentacion: [
    'Brisa. Aplacador, orador y, cuando toca, examinador. No te pongas nervioso: eso lo llevo yo.',
  ],

  abreCaso: [
    'Unas preguntas, querido amigo. No para juzgarte -eso lo hace Kelsier- sino para ver qué se te ha quedado y qué se ha ido por el desagüe.',
    'Seis preguntas. Las he elegido donde la gente se equivoca, que es donde merece la pena preguntar.',
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
export const LINEAS_DE_BRISA_NARRANDO = {
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

/**
 * Lo que dice Fantasma cuando te vende una pista.
 *
 * Habla en jerga de los barrios bajos, con «tío» y palabras cortadas, y le pone
 * precio a todo porque nadie le ha regalado nada nunca. No es Wayne: Wayne
 * intercambia por diversión, Fantasma cobra porque hace falta.
 */
export const LINEAS_DE_FANTASMA = {
  pistaPedida: {
    1: [
      'La primera va de gratis, tío. Que tampoco es que te esté dando mucho.',
      'Toma, esta la pongo yo. No te acostumbres.',
      'Gratis. Lo gratis se agradece y no se comenta.',
    ],
    2: [
      'Esta cuesta. Yo tampoco como del aire, tío.',
      'Croquetas por delante. Es lo que hay, y es un precio decente.',
      'Se paga. Yo he pagado más por menos, te lo digo en serio.',
    ],
    3: [
      'Esta es casi la respuesta, así que cuesta lo suyo. Piénsalo antes.',
      'Cara. Muy cara. Pero es que después de esta ya no queda nada por decir.',
      'La última. Te la vendo, pero luego no digas que la resolviste tú.',
    ],
  },

  trastoRecibido: [
    (contexto) => `A cambio te dejo esto: ${contexto.trasto}. No vale nada, pero es tuyo.`,
    (contexto) => `${contexto.trasto}. Lo tenía por ahí. Ahora lo tienes tú.`,
  ],
}

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
