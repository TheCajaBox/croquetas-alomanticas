/**
 * Shai, que narra Sel.
 *
 * Falsificadora de almas, y buena: la mejor. Su oficio es hacer una copia que
 * pase por el original ante quien la mire con atención, y por eso sabe una cosa
 * que en seguridad es la única que importa de verdad: **todo lo que hay que
 * verificar se puede falsificar si nadie lo mira bien**.
 *
 * Su registro es **el del artesano orgulloso**: precisa, un poco vanidosa, y
 * sin una gota de moralina. No dice «esto está mal»; dice «esto lo paso yo en
 * dos minutos, y te voy a explicar cómo». Habla del atacante en primera
 * persona, porque es ella.
 *
 * Y no da lecciones de ética: da lecciones de oficio. El único juicio que
 * emite es sobre el trabajo mal hecho.
 *
 * Su humor va por ahí: es el de la profesional a la que le pagan por entrar y
 * se encuentra la puerta abierta. Le divierte la pereza ajena, presume sin
 * disimulo y se ríe de la gente que se cree segura, nunca de quien está
 * aprendiendo a no serlo.
 */
const LINEAS_DE_SHAI = {
  // Como anfitriona de El sello, su mundo.
  presentacion: [
    'Shai. Falsifico almas, y no es un eufemismo. Empezamos por lo más fácil de falsificar que existe: una contraseña guardada como quien guarda la lista de la compra. Cuando acabes, la guardarás de otra manera.',
    'Shai. Me han encerrado por hacer demasiado bien mi trabajo, así que tengo tiempo libre y tú tienes código con agujeros. Se ha juntado el hambre con las ganas de comer.',
    'Soy Shai. Mi oficio es hacer copias que pasen por originales, y llevo años viviendo de que nadie compare. Vamos a ver quién compara aquí.',
    'Shai. No te voy a enseñar a defender nada todavía. Primero te voy a enseñar a mirar un sistema como lo miro yo, que es lo único que no se puede desaprender.',
  ],

  bienvenida: [
    'Shai. Esto va a ser distinto de lo que hayas hecho antes: aquí el código que te doy funciona. Pasa sus pruebas, hace lo que promete y lo firmaría cualquiera. Y tiene un agujero. Tu trabajo es encontrarlo y taparlo, y los tests van a intentar colarse por él.',
    'Cien días para falsificar un alma. A ti te va a costar menos aprender a defender una, pero el oficio es el mismo: mirar lo que todo el mundo da por bueno y preguntarse quién lo comprueba.',
    'Bienvenido al único camino de este juego donde el código que te doy no está roto. Está peor: está bien escrito y es mentira.',
    'Shai. Te aviso de la parte incómoda: cuando acabes esto vas a mirar cualquier programa y vas a ver por dónde se entra. No se quita. Lo siento a medias.',
    'Aquí no se aprende a programar mejor: se aprende a leer lo que ya está escrito con muy mala intención. Es una habilidad distinta y se paga aparte.',
  ],

  entrarAlMundo: [
    'Sitio nuevo. Lo primero, como siempre: qué se está dando por bueno aquí sin comprobarlo.',
    'Aquí dentro hay algo que funciona y no debería. Vamos a encontrarlo, y luego vamos a arreglarlo sin romper lo que sí funcionaba.',
    'Antes de escribir nada, lee el código que te doy. Está bien escrito a propósito: si el agujero se viera, no habría nada que aprender.',
    'Otro sitio. Yo entro en todos igual: buscando qué puerta han dejado abierta por comodidad. Siempre hay una, y casi siempre la abrió alguien con prisa un viernes.',
    'Empezamos. Y hazlo en este orden: primero entiende qué promete este código, después pregúntate quién comprueba que lo cumple.',
    'Aquí hay una costura. No la busques con los ojos: búscala pensando qué le pedirías tú a esto si quisieras hacerle daño.',
    'Sitio nuevo, mismo oficio. La materia cambia, la pregunta no: ¿esto se lo cree o lo verifica?',
  ],

  primerIntento: [
    'Primer intento. Aquí los tests no comprueban que funcione: comprueban que no se pueda romper. Es otra cosa y se nota.',
    'Adelante. Y si pasa a la primera, mira el código otra vez: los agujeros que pasan a la primera son los que siguen ahí.',
    'Prueba. En mi oficio el primer intento no es para entrar: es para ver cómo reacciona el que está al otro lado.',
    'Manda eso. Un ataque que no se prueba es una teoría, y las teorías no abren puertas.',
    'Dale. Vas a fallar, y bien: cada fallo tuyo aquí es un plano más del sitio.',
    'Venga. Lo peor que puede pasar es que el test te enseñe una entrada que no habías imaginado, y eso en realidad es lo mejor que puede pasar.',
    'Mándalo. Y antes de mirar el resultado, apuesta contigo misma si va a aguantar: acertar la apuesta vale más que acertar el arreglo.',
    'Prueba lo que tengas. Yo nunca he preparado un trabajo entero sin tantear la cerradura una vez, aunque solo sea para oírla.',
  ],

  testFallado: [
    (contexto) =>
      `El ataque ha entrado: ${contexto.fallo ?? 'un test ha pasado por donde no debía'}. Eso es una buena noticia, porque lo ha hecho un test y no otra persona.`,
    'No ha aguantado. Mira qué entrada usa el test que falla: te está diciendo exactamente por dónde se cuela.',
    'Falla. Y falla en lo interesante: no en lo que el código hace, en lo que el código **permite**.',
    'Ha entrado. Yo cobraría por esto y aquí lo tienes gratis y con el nombre del hueco escrito al lado.',
    'No pasa. Antes de arreglar nada, sabe decir en una frase qué le has dejado hacer al que llamaba a la puerta. Si no lo sabes decir, lo vas a tapar de oído.',
    'Sigue abierto. Tranquilo: cuatro de cada cinco sistemas que he visitado en mi vida estaban así, y ninguno lo sabía.',
    'El test ha entrado por donde entraría yo. Al menos estás fallando en lo importante.',
    'No aguanta. Esto no es que lo hayas hecho mal: es que taparlo del todo cuesta más que dejarlo casi tapado, y «casi» es la palabra con la que yo trabajo.',
  ],

  errorDeSintaxis: [
    (contexto) =>
      `No se entiende, línea ${contexto.linea ?? '?'}. Esto es lo de menos: un error que se ve es un error que se arregla.`,
    'No compila. Mejor así que un código que compila y deja entrar a cualquiera.',
    'Está mal escrito y no llega ni a ejecutarse. De todos los problemas que vas a tener hoy, este es el barato.',
    'No arranca. Un símbolo. Nadie ha perdido nunca una fortuna por un símbolo que falta; se pierden por los que están de más y nadie mira.',
    'Ni se lee. Arréglalo y volvemos a lo importante, que es lo que sí se lee y no debería.',
  ],

  requisitoIncumplido: [
    'Falta una norma del reto, y en este camino las normas no son estética: son la diferencia entre parecer seguro y serlo.',
    'Te falta algo que el reto te pedía. Lee la lista: cada línea de ahí tapa un agujero distinto.',
    'Funciona y no cumple. En mi oficio eso tiene nombre: una copia buena. Pasa la inspección de lejos y no aguanta la de cerca.',
    'Has tapado el agujero y te has dejado una de las condiciones. Yo entro por las condiciones que se deja la gente con prisa, que son casi todas.',
    'Cumple el resultado y se salta el cómo. Y aquí el cómo es el trabajo: cualquiera consigue que algo no se pueda romper apagándolo.',
  ],

  tiempoAgotado: [
    'Se ha quedado dando vueltas. Un sistema que no contesta también es un sistema caído, por cierto.',
    'Demasiado tiempo. Y ojo, que eso mismo es un ataque: hacer trabajar de más al que te atiende.',
    'No vuelve. Piensa en quién paga ese rato: lo paga el que estaba esperando detrás, y con eso se tira un servicio entero.',
    'Se ha atascado. Fíjate en si algo se está repitiendo sin motivo para pararse; los sitios se caen mucho más por eso que por un ladrón.',
    'Ni contesta ni falla, que es la peor de las tres respuestas posibles.',
  ],

  retoSuperado: [
    'Aguanta. Ese agujero ya no está.',
    'Hecho. Y fíjate en lo que ha cambiado: no hace nada nuevo, simplemente ya no se le puede pedir lo que no debe.',
    'Pasa. Buen trabajo, y lo digo yo, que vivo de que la gente lo haga mal.',
    'Cerrado. Si yo volviera mañana a por esto, tendría que buscarme otra puerta. Eso es exactamente lo que se pedía.',
    'Tapado. Y sin romper nada de lo que ya iba, que es la mitad del mérito y la mitad que nadie reconoce.',
    'Aguanta el ataque. Un trabajo limpio. No te acostumbres a que te lo diga: soy exigente con esto y no por educación.',
    'Ya no entra. Ahora quédate con la forma del fallo, no con el arreglo: el arreglo cambia con el lenguaje, la forma no.',
    'Correcto. Y lo importante: has arreglado la causa y no el ejemplo que traía el test. Es la diferencia entre tapar y parchear.',
  ],

  superadoSinPistas: [
    'Sin pistas. Has visto el agujero tú sola, y eso es lo que se paga en mi oficio.',
    'A la primera y sin ayuda. Ahora ya no puedes desaprenderlo: vas a ver ese fallo en todas partes.',
    'Sin ayuda. Enhorabuena: acabas de hacer gratis lo que a mí me contratan para hacer.',
    'Nadie te ha dicho nada y lo has encontrado. Eso no es suerte dos veces seguidas, así que a ver si repites.',
    'Sin pistas. Han ShuXen dirá que fue el terreno; yo digo que fuiste tú, y de esto sé más que él.',
  ],

  jefeDerrotado: [
    'El Sellador ha perdido. No le pasa a menudo.',
    'Cerrado. Ese sistema entero era una copia mala, y la has descubierto.',
    'Ha caído. Y lo ha hecho por donde caen todos: por la parte que alguien dio por buena sin comprobarla.',
    'Se acabó. Lo que has usado ahí no era nuevo: era todo lo de antes a la vez, que es como se hacen los trabajos grandes.',
    'Hecho. Yo he tardado meses en trabajos más pequeños que este, y no lo digo por hacerte la pelota: lo digo porque es verdad y me molesta un poco.',
  ],

  sinCroquetas: [
    'No te llega. Han ShuXen no fía: es militar, y los militares no fían.',
    'Sin croquetas no hay pista. Resuelve uno más fácil y vuelve, que las pistas no caducan.',
    'Estás sin nada. Yo he trabajado en peores condiciones y con menos tiempo, así que no me des pena: resuelve algo.',
    'Cero. Es un problema con solución conocida: uno de los primeros, sin pedir ayuda, y vuelves a estar en el negocio.',
  ],

  inactividad: [
    'Sigues ahí. Sin prisa: mi trabajo también es mirar una cosa durante horas hasta que enseña la costura.',
    'Cuando no encuentres el agujero, cambia la pregunta: no «qué hace esto», sino «qué le puedo pedir yo a esto».',
    'Sigo aquí. Si llevas mucho rato, deja de leer el código y escribe la lista de todo lo que entra de fuera. El agujero está en esa lista.',
    'Tómate el tiempo. En cien días se falsifica un alma; en veinte minutos no se encuentra nada que no se vea mirando.',
    'Nada, tú piensa. Yo he pasado tardes enteras esperando a que un funcionario se levantara de su silla, y aquello también era trabajo.',
  ],

  charla: [
    'Un sello mío pasa cualquier inspección menos una: la que compara con el original. Casi nadie compara con el original.',
    'La gente cree que forzamos las puertas. No: usamos las que están abiertas y nadie ha mirado.',
    'Nunca he necesitado romper un cifrado. He necesitado que alguien guarde la llave debajo del felpudo, y siempre la guarda.',
    'Lo más peligroso de un sistema no es lo que hace mal: es lo que hace bien y nadie sabe por qué.',
    'Falsificar es entender. No puedes copiar lo que no has entendido, y no puedes defender lo que no sabrías atacar.',
    'Mi trabajo más caro lo cobré por entrar en un archivo con tres cerraduras. Entré con la lista de la limpieza y un saludo. Las tres cerraduras seguían intactas al salir.',
    'Todos los sistemas tienen una puerta pequeña «solo para pruebas». Ninguna se ha cerrado nunca. Vivo de eso y pienso jubilarme de eso.',
    'Gaotona me pregunta a quién le conviene que algo esté mal. Es la única pregunta que me ha costado contestar, y en su boca además suena a que ya lo sabe.',
    'La comodidad es mi mejor herramienta. Nadie me ha abierto tantas puertas como la gente que tenía prisa.',
    'Un sistema seguro no es el que nadie ha roto: es el que alguien ha intentado romper y ha apuntado por dónde lo intentó.',
    'Cuando un cliente me dice que su sistema es imposible de falsificar, subo el precio. No por venganza: por trabajo, porque va a haber que documentarle el hueco.',
    'La firma más difícil de imitar que he visto la hacía un escriba con la mano mala y de mal humor. Nadie diseña así a propósito, y ahí está el chiste.',
  ],

  mundoCompletado: [
    'Mundo cerrado. Un agujero menos de los que yo usaría.',
    'Terminado. Y ahora sabes algo incómodo: que el código que parece bien escrito y el código que está bien hecho no son lo mismo.',
    'Hecho. Vas por delante de casi todo el mundo que cobra por esto, y eso dice más de casi todo el mundo que de ti.',
    'Cerrado. Guarda la lista de lo que has tapado aquí: vas a reconocer los mismos huecos con otros nombres el resto de tu vida.',
    'Ya está. Un sitio menos donde yo podría entrar tranquilamente, y no sabes cuánto me fastidia decirlo.',
  ],
}

export default LINEAS_DE_SHAI
