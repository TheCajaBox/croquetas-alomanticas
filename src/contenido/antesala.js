import { codigo } from './retos/comun.js'

/**
 * La antesala: la orientación de Steris antes del primer reto.
 *
 * Está pensada para quien no ha visto código en su vida y no sabe siquiera a
 * qué ha venido: qué es un programa, qué es JavaScript, qué pinta Vue y cómo
 * funciona esto. Se lee en un par de minutos y se puede volver cuando sea.
 *
 * Se pinta con Marcado, así que los términos del glosario salen ya pulsables:
 * es justo la página donde más falta hacen.
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
    {
      titulo: "Cómo funciona esto",
      texto: codigo(
        "Siete mundos, cincuenta y seis retos. Se empieza señalando y colocando piezas, y se",
        "acaba montando componentes.",
        "",
        "El código que escribes **se ejecuta de verdad** y se comprueba con tests: pequeñas",
        "pruebas que llaman a tu código y miran si el resultado es el que debía ser. No hay",
        "respuestas de opción múltiple disfrazadas.",
        "",
        "En cada reto vas a encontrar tres cosas, y conviene usarlas en este orden:",
        "",
        "1. **El apunte de Wax**, arriba del todo. La explicación del concepto, con",
        "   ejemplos. Es gratis y está antes del ejercicio a propósito: primero se lee.",
        "2. **Los términos subrayados con puntitos**. Son míos: pulsa cualquiera y te digo",
        "   qué significa esa palabra, sin salir del reto.",
        "3. **Las pistas de Wayne**. La primera invita la casa; las otras cuestan",
        "   croquetas. Van de menos a más reveladora.",
        "",
        "Si un reto se te resiste tres veces, aparece Wax por su cuenta. Y si algo revienta,",
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
        "Con las croquetas se compran dos cosas: las pistas de Wayne y la comida de los",
        "gatos. Ahí está la única decisión económica del juego, y es deliberada: cada pista",
        "que le compras a Wayne es comida que no le das a la colonia.",
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
    "Eso es todo lo que considero imprescindible. Wayne dirá que sobra la mitad; Wayne no ha",
    "preparado una lista en su vida.",
  ),
}
