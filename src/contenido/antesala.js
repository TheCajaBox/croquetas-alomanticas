import { codigo } from './retos/comun.js'
import { ITINERARIOS_POR_ID, ITINERARIO_POR_DEFECTO, quienEscribeElApunte } from './itinerarios.js'
import { mundosDelItinerario } from './mundos.js'
import { nombreDe } from './personajes.js'
import { retosDelMundo } from './retos/index.js'

/**
 * La antesala: la orientación antes del primer reto.
 *
 * Está pensada para quien no ha visto código en su vida y no sabe siquiera a
 * qué ha venido: qué es un programa, qué lenguaje va a escribir y cómo funciona
 * esto. Se lee en un par de minutos y se puede volver cuando sea.
 *
 * Se pinta con Marcado, así que los términos del glosario salen ya pulsables:
 * es justo la página donde más falta hacen.
 *
 * ## Compartida, pero no de un solo camino
 *
 * La escribe Steris en los cuatro caminos y eso es a propósito: es el mostrador
 * de entrada del juego, y se puede leer antes de elegir por dónde ir.
 *
 * Lo que **no** puede ser compartido es lo que cuenta. Esta página explicaba
 * «Qué es JavaScript» y «Qué es Vue», nombraba el apunte de Wax y las pistas de
 * Wayne, decía «siete mundos, cincuenta y seis retos» y acababa con un botón al
 * primer mundo de la segunda era. Todo eso es mentira desde la primera era:
 * allí se escribe PHP, el apunte lo firma Kelsier, las pistas las vende Fantasma
 * y el primer mundo es La Ceniza.
 *
 * Así que la antesala tiene dos mitades. Las secciones **compartidas** llevan
 * huecos -`{apunte}`, `{pistas}`, `{narra}`, `{cuantosMundos}`- que se rellenan
 * con el reparto y las cuentas del camino donde estés. Y las secciones **del
 * camino** -qué es este lenguaje y por qué- las trae cada itinerario en
 * `porCamino`. `antesalaDe` monta las dos y devuelve la página ya resuelta.
 */
export const ANTESALA = {
  entradilla: codigo(
    "He preparado una lista. No hace falta que la leas entera antes de empezar, pero está entera",
    "por si acaso, y estará aquí cuando la necesites.",
  ),
  secciones: [
    {
      titulo: "Qué es un programa",
      texto: codigo(
        "Un programa es **una lista de órdenes** que el ordenador ejecuta una detrás de otra,",
        "de arriba abajo, sin saltarse ninguna y sin adivinar nada.",
        "",
        "Eso último es lo importante y es lo que más cuesta al principio: el ordenador no",
        "interpreta lo que querías decir. Hace exactamente lo que pone. Si pone algo",
        "imposible, se para y avisa; si pone algo posible pero equivocado, lo hace tan",
        "tranquilo.",
        "",
        "Programar no consiste en saberse los símbolos de memoria. Consiste en **ordenar",
        "los pasos** de algo que ya sabías hacer, con la precisión suficiente para que",
        "alguien que no entiende de nada pueda seguirlos.",
      ),
    },
    {
      titulo: "Cómo funciona esto",
      texto: codigo(
        "{cuantosMundos} mundos, {cuantosRetos} retos. Se empieza señalando y colocando piezas,",
        "y se acaba escribiendo código que hace algo de verdad.",
        "",
        "El código que escribes **se ejecuta de verdad** y se comprueba con tests: pequeñas",
        "pruebas que llaman a tu código y miran si el resultado es el que debía ser. No hay",
        "respuestas de opción múltiple disfrazadas.",
        "",
        "En cada reto vas a encontrar tres cosas, y conviene usarlas en este orden:",
        "",
        "1. **El apunte de {apunte}**, arriba del todo. La explicación del concepto, con",
        "   ejemplos. Es gratis y está antes del ejercicio a propósito: primero se lee.",
        "2. **Los términos subrayados con puntitos**. Son míos: pulsa cualquiera y te digo",
        "   qué significa esa palabra, sin salir del reto.",
        "3. **Las pistas de {pistas}**. La primera invita la casa; las otras cuestan",
        "   croquetas. Van de menos a más reveladora.",
        "",
        "Si un reto se te resiste tres veces, aparece {apunte} por su cuenta. Y si algo revienta,",
        "yo traduzco el error: salen en inglés y no dicen nada útil hasta que alguien te",
        "explica qué significan.",
      ),
    },
    {
      titulo: "Las croquetas y los gatos",
      texto: codigo(
        "Cada reto superado paga en **croquetas**. Se gana más resolviéndolo sin pistas y a",
        "la primera.",
        "",
        "Con las croquetas se compran dos cosas: las pistas de {pistas} y la comida de los",
        "gatos. Ahí está la única decisión económica del juego, y es deliberada: cada pista",
        "que le compras es comida que no le das a la colonia.",
        "",
        "Los gatos no son un adorno. Cada uno lleva el nombre de un metal y da un beneficio",
        "real mientras está contento: más croquetas, pistas más baratas, más tiempo de",
        "ejecución, un fallo perdonado. Un gato desatendido deja de dárselo hasta que le",
        "hagas caso.",
        "",
        "Advertencia que me parece necesaria: **ningún gato se muere ni se va nunca**. Esto",
        "es un juego para aprender, no para castigar.",
      ),
    },
    {
      titulo: "Contingencias previstas",
      texto: codigo(
        "He anotado las que ocurren con más frecuencia.",
        "",
        "- **Rompes algo.** No puedes. Tu código se ejecuta aparte del juego, en un sitio",
        "  aislado; ni siquiera puede leer tu partida. Prueba lo que quieras.",
        "- **Se queda colgado.** Si escribes un bucle sin salida, se corta solo a las cien",
        "  mil vueltas y te lo digo. La página no se congela.",
        "- **Sale un error largo en inglés.** Léelo hasta el final y luego mira mi",
        "  traducción, que sale justo debajo. Casi siempre es un símbolo sin cerrar o un",
        "  nombre mal escrito.",
        "- **No entiendes una palabra del enunciado.** Si está subrayada con puntitos,",
        "  púlsala. Si no lo está y crees que debería, es un fallo mío.",
        "- **Llevas veinte minutos con lo mismo.** Levántate. Vuelve luego. Está estudiado y",
        "  funciona, aunque nadie sepa explicar del todo por qué.",
        "- **Pierdes el progreso.** Se guarda en este navegador. Si vas a cambiar de",
        "  dispositivo, en Ajustes puedes exportar la partida y traerla.",
      ),
    },
  ],
  cierre: codigo(
    "Eso es todo lo que considero imprescindible. {narra} dirá que sobra la mitad; {narra} no ha",
    "preparado una lista en su vida.",
  ),
}

/**
 * Lo que cada camino explica de su propio lenguaje.
 *
 * Va aparte y no dentro de `ANTESALA` porque es lo único que no se puede
 * compartir: aquí se cuenta qué se va a escribir y por qué merece la pena, y eso
 * no se parece en nada de un camino a otro.
 */
export const POR_CAMINO = {
  era2: [
    {
      titulo: "Qué es JavaScript",
      texto: codigo(
        "JavaScript es el idioma en el que se le dan esas órdenes. Es uno de los pocos que",
        "**los navegadores entienden directamente**, y por eso está en prácticamente todas",
        "las páginas web que has usado hoy.",
        "",
        "Vale para todo lo que se mueve en una página: que un botón haga algo al pulsarlo,",
        "que una lista se ordene, que un formulario avise de que falta un campo.",
        "",
        "Se escribe en texto normal y corriente, con unas reglas estrictas de puntuación.",
        "La mayoría de los errores de quien empieza son de puntuación, no de ideas. Es",
        "buena noticia: los de puntuación se arreglan solos con el tiempo.",
      ),
    },
    {
      titulo: "Qué es Vue, y por qué aquí hay dos",
      texto: codigo(
        "Escribir una página entera con JavaScript a pelo es posible y es agotador: hay que",
        "ir diciéndole al navegador, a mano, qué trozo repintar cada vez que cambia un dato.",
        "",
        "**Vue** es una herramienta que hace justo eso por ti. Le describes qué aspecto",
        "tiene que tener la pantalla según los datos, y cuando los datos cambian, Vue",
        "repinta lo que haga falta. A eso se le llama reactividad, y es la idea central.",
        "",
        "En este juego hay dos versiones, y no es un capricho:",
        "",
        "- **Vue 2** reparte cada componente en cajones con su nombre: los datos aquí, los",
        "  métodos allá. Es lo que hay en la mayoría de proyectos que ya llevan años en",
        "  marcha, y por eso conviene saber leerlo.",
        "- **Vue 3** pone todo junto en una sola función. Es lo que se usa hoy para empezar",
        "  algo nuevo.",
        "",
        "Se aprenden las dos porque en el mundo real te vas a encontrar las dos, y porque",
        "ver el mismo problema resuelto de dos maneras enseña más que cualquiera de las",
        "dos por separado.",
      ),
    },
  ],
  era1: [
    {
      titulo: "Qué es PHP",
      texto: codigo(
        "PHP es el idioma en el que se le dan esas órdenes, y se ejecuta **en el servidor**:",
        "no en el ordenador de quien mira la página, sino en la máquina que la prepara y la",
        "manda. Eso es toda la diferencia, y explica el resto.",
        "",
        "Cuando pides una página, en el servidor se ejecuta un programa que consulta lo que",
        "haga falta, monta la respuesta y la envía. Ese programa está escrito en PHP en una",
        "parte enorme de la web: Wikipedia, casi todas las tiendas pequeñas y unas cuatro de",
        "cada diez páginas que has abierto hoy.",
        "",
        "Tiene mala fama y la tuvo merecida durante quince años. La cuestión es que el PHP",
        "de entonces y el de ahora se parecen poco: hoy tiene tipos declarados, clases,",
        "excepciones y herramientas serias. Lo que se aprende aquí es el de ahora.",
        "",
        "Se escribe en texto normal y corriente, con unas reglas estrictas de puntuación. La",
        "mayoría de los errores de quien empieza son de puntuación, no de ideas. Es buena",
        "noticia: los de puntuación se arreglan solos con el tiempo.",
      ),
    },
    {
      titulo: "Por qué empezar por aquí, y qué se lleva puesto",
      texto: codigo(
        "PHP es un buen primer lenguaje por un motivo poco romántico: **el circuito completo",
        "es corto**. Escribes, se ejecuta, sale algo. No hay que montar nada alrededor para",
        "ver el resultado, y ver el resultado es lo que sostiene las primeras semanas.",
        "",
        "Y casi todo lo que vas a aprender aquí no es de PHP, es **de programar**: una",
        "variable, una condición, un bucle, una función, una lista. Eso está igual en",
        "JavaScript, en Python y en cualquier otro, con la puntuación cambiada. Cuando",
        "cambies de idioma no empiezas de cero: empiezas con acento.",
        "",
        "Lo que sí es de PHP -el `$` delante de cada variable, `echo`, los arrays que hacen",
        "de lista y de diccionario a la vez- se aprende deprisa y se avisa cuando toca.",
      ),
    },
  ],
  elantris: [
    {
      titulo: "Qué es SQL, y por qué no se parece a nada",
      texto: codigo(
        "Casi todos los lenguajes de programación sirven para decirle a la máquina **cómo**",
        "hacer algo: abre el fichero, recorre las líneas, ve sumando. SQL sirve para decirle",
        "**qué** quieres, y que ella decida cómo conseguirlo.",
        "",
        "Se le habla a una **base de datos**: un sitio donde los datos viven en tablas -una",
        "rejilla con nombre, con sus columnas y sus filas- y al que se le pueden hacer",
        "preguntas. La pregunta se escribe entera, se manda entera y contesta con filas.",
        "",
        "Eso cambia la manera de pensar, y es lo que cuesta al principio. No vas a escribir",
        "«recorre los habitantes y quédate con los de Kae»: vas a escribir «los habitantes",
        "de Kae», y quién recorre qué es asunto de la base. Lo raro es que funcione, y",
        "funciona.",
        "",
        "La puntuación es estricta, como en todos. La diferencia es que aquí un error casi",
        "nunca hace ruido: una consulta mal escrita no revienta, devuelve **otra cosa**. Por",
        "eso este camino empieza por aprender a mirar lo que ha salido.",
      ),
    },
    {
      titulo: "Por qué empezar por aquí, y qué se lleva puesto",
      texto: codigo(
        "SQL es un buen primer lenguaje por tres motivos concretos:",
        "",
        "- **Se ve al momento.** Escribes una línea y salen filas. No hay que montar nada",
        "  alrededor para ver el resultado, y ver el resultado es lo que sostiene las",
        "  primeras semanas.",
        "- **Es pequeño.** Con seis palabras -`SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`",
        "  y `JOIN`- se hace el ochenta por ciento de todo lo que se escribe en la vida real.",
        "- **No caduca.** Lleva cincuenta años y sigue siendo el mismo. Lo que aprendas aquí",
        "  te va a valer dentro de veinte, cosa que no se puede decir de casi nada.",
        "",
        "Y hay una cuarta razón, menos evidente: **te la vas a encontrar de todas formas**.",
        "Quien programa acaba preguntándole cosas a una base de datos, venga del lenguaje",
        "que venga. Aprenderlo aparte y con orden es mucho mejor que aprenderlo a trompicones",
        "el día que hace falta.",
        "",
        "Lo que aquí se llama trazar un aon es exactamente esto: una figura que, hecha bien,",
        "hace algo, y hecha mal no hace nada. Con una consulta pasa igual, y la diferencia",
        "entre las dos cosas suele ser una línea.",
      ),
    },
  ],
}

/** Los huecos que se rellenan con el camino donde estés. */
function huecosDe(itinerarioId) {
  const itinerario = ITINERARIOS_POR_ID[itinerarioId] ?? ITINERARIOS_POR_ID[ITINERARIO_POR_DEFECTO]
  const mundos = mundosDelItinerario(itinerario.id)
  return {
    apunte: nombreDe(quienEscribeElApunte(mundos[0])),
    pistas: nombreDe(itinerario.reparto.pistas),
    glosario: nombreDe(itinerario.reparto.glosario),
    narra: nombreDe(itinerario.reparto.narra),
    lenguaje: itinerario.lenguajeEnFrase,
    cuantosMundos: mundos.length,
    cuantosRetos: mundos.reduce((suma, mundo) => suma + retosDelMundo(mundo.id).length, 0),
  }
}

const rellenar = (texto, huecos) =>
  texto.replace(/\{(\w+)\}/g, (entero, hueco) => (hueco in huecos ? String(huecos[hueco]) : entero))

/**
 * La antesala de un camino: sus secciones y las compartidas, ya resueltas.
 *
 * La sección del lenguaje va **después** de «Qué es un programa» y antes de
 * «Cómo funciona esto», que es el orden en que hacen falta: primero qué es
 * programar, luego en qué se va a programar, y al final cómo va este juego.
 */
export function antesalaDe(itinerarioId) {
  const huecos = huecosDe(itinerarioId)
  const suyas = POR_CAMINO[itinerarioId] ?? POR_CAMINO[ITINERARIO_POR_DEFECTO] ?? []
  const secciones = [ANTESALA.secciones[0], ...suyas, ...ANTESALA.secciones.slice(1)]
  return {
    entradilla: rellenar(ANTESALA.entradilla, huecos),
    cierre: rellenar(ANTESALA.cierre, huecos),
    secciones: secciones.map((seccion) => ({
      titulo: rellenar(seccion.titulo, huecos),
      texto: rellenar(seccion.texto, huecos),
    })),
  }
}

/** El primer mundo del camino, que es a donde manda el botón del final. */
export function primerMundoDe(itinerarioId) {
  return mundosDelItinerario(itinerarioId)[0] ?? mundosDelItinerario(ITINERARIO_POR_DEFECTO)[0]
}
