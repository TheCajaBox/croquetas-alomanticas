/**
 * Las preguntas del repaso de «inspeccion».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-inspeccion",
  mundo: "inspeccion",
  quien: "gaotona",
  titulo: "El caso de la inspección",
  preguntas: [
    {
      pregunta: "¿Por qué una lista de lo permitido protege y una de lo prohibido no?",
      opciones: [
        {
          texto: "Porque la de prohibidos tendría que enumerar todo lo malo que existe y todo lo que se inventará, y la de permitidos solo lo poco que tu programa necesita.",
          correcta: true,
          porque:
            "Y hay una segunda mitad igual de importante: cuando se quedan cortas, se equivocan hacia lados distintos. Una lista de permitidos incompleta rechaza algo válido y molesta a un usuario; una de prohibidos incompleta deja pasar un ataque.",
        },
        {
          texto: "Porque las expresiones regulares son más rápidas que recorrer una lista.",
          porque:
            "La velocidad no tiene nada que ver, y de hecho una expresión regular mal escrita puede ser muchísimo más lenta. Lo que decide es qué hay que enumerar en cada caso: una lista finita o una infinita.",
        },
        {
          texto: "Porque la lista de prohibidos se puede olvidar de actualizar.",
          porque:
            "Se queda corto: no es que se olvide de actualizarse, es que **nunca puede estar completa**, ni siquiera el día que se escribe. Y aunque lo estuviera, un filtro que borra lo prohibido puede construir el ataque él solo al juntar los trozos de los lados.",
        },
      ],
    },
    {
      pregunta: "El navegador comprueba la edad con `type=\"number\" min=\"18\"`. ¿Qué protege eso?",
      opciones: [
        {
          texto: "Nada: es una cortesía para el usuario. La comprobación que decide es la del servidor.",
          correcta: true,
          porque:
            "Y la cortesía tiene valor —avisa pronto y evita un viaje—, así que las dos cosas hacen falta. Lo que no puede pasar es confundir cuál manda: el cliente es del usuario, y quien lo controla puede cambiarlo o no usarlo.",
        },
        {
          texto: "Protege de los usuarios normales, y de los demás no se puede proteger nadie.",
          porque:
            "Sí se puede: comprobando en el servidor. La frase suena a resignación razonable y es exactamente la que deja el agujero abierto.",
        },
        {
          texto: "Protege mientras el navegador esté actualizado.",
          porque:
            "Aunque todos los navegadores del mundo obedecieran siempre, la petición no tiene que salir de un navegador: se escribe a mano con una línea de `curl`.",
        },
      ],
    },
    {
      pregunta: "¿Cuál es la diferencia entre validar y escapar?",
      opciones: [
        {
          texto: "Validar decide si un dato entra, una vez al recibirlo; escapar prepara un dato para un destino, cada vez que se escribe.",
          correcta: true,
          porque:
            "Y de ahí sale la consecuencia que más cuesta aceptar: **un dato válido hay que escaparlo igual**. `Muñoz & Cía` es un nombre correcto y en HTML se escribe de otra manera, no porque sea peligroso sino porque el ampersand ahí significa otra cosa.",
        },
        {
          texto: "Son la misma cosa; escapar es la manera de validar en HTML.",
          porque:
            "Confundirlas tiene una consecuencia concreta y muy vista: la gente intenta arreglar el problema de escapar escribiendo validaciones cada vez más paranoicas —«prohibido el signo menor»— y acaba con un sistema donde no se pueden escribir apellidos y que sigue siendo vulnerable donde faltaba escapar.",
        },
        {
          texto: "Validar es para el servidor y escapar para el cliente.",
          porque:
            "Escapar se hace donde se escribe el dato, que casi siempre es el servidor al generar la página. Y la división no es por máquina: es por momento —al recibir y al escribir— y por pregunta —¿entra? y ¿cómo se escribe aquí?—.",
        },
      ],
    },
    {
      pregunta: "El dato ya está en tu base de datos. ¿Hace falta escaparlo al pintarlo?",
      opciones: [
        {
          texto: "Sí: lo que hay ahí entró desde fuera algún día.",
          correcta: true,
          porque:
            "Es el XSS almacenado, y es el peor de los tres tipos: el ataque se guarda una vez y se sirve al navegador de cada visitante durante años, incluidos los administradores. El único sitio donde se decide si un texto es seguro es el momento de escribirlo.",
        },
        {
          texto: "No, si se validó al entrar.",
          porque:
            "Validar y escapar son operaciones distintas. Un texto puede ser perfectamente válido y aun así tener que escribirse de otra manera en HTML; y además, «se validó al entrar» es una afirmación sobre todo lo que alguna vez pasó por esa tabla.",
        },
        {
          texto: "Solo si el campo lo rellena el usuario; los que rellena el sistema, no.",
          porque:
            "Distinguir el origen del dato en el momento de pintarlo es justo lo que no se puede hacer con fiabilidad, y no hace falta: se escapa siempre y ya está. Un campo que hoy lo rellena el sistema mañana lo rellena un formulario de importación.",
        },
      ],
    },
    {
      pregunta: "¿Por qué el ampersand se sustituye antes que los demás caracteres?",
      opciones: [
        {
          texto: "Porque aparece en la salida de todas las demás sustituciones: si va al final, escapa su propio trabajo.",
          correcta: true,
          porque:
            "`'<'` pasa a `'&lt;'` y luego a `'&amp;lt;'`. No es un agujero —el resultado sigue siendo inofensivo— pero el texto sale roto: el usuario lee `a &lt; b` donde escribió `a < b`. Y es el bug más difícil de que alguien arregle, porque «funciona».",
        },
        {
          texto: "Porque es el carácter más peligroso de los cinco.",
          porque:
            "Es el menos peligroso: por sí solo no abre ninguna etiqueta ni cierra ningún atributo. Lo que lo hace especial es que forma parte de la solución, no del problema.",
        },
        {
          texto: "Porque es el primero de la tabla de entidades.",
          porque:
            "El orden de una tabla no obliga a nada. La razón es técnica y se ve haciendo las sustituciones a mano: cuando le toca el turno, ya hay ampersands en el texto y los ha puesto la propia función.",
        },
      ],
    },
    {
      pregunta: "Escapas los cinco caracteres y metes el texto en `<p title=x>`. ¿Está a salvo?",
      opciones: [
        {
          texto: "No: sin comillas, el atributo termina en el primer espacio, y el espacio no está entre los cinco.",
          correcta: true,
          porque:
            "`title=x onmouseover=robar()` son dos atributos para el navegador, y el segundo ejecuta código. Hacen falta las dos defensas: escapar impide cerrar el atributo con una comilla, y las comillas impiden que un espacio abra otro.",
        },
        {
          texto: "Sí: escapados los cinco, no queda nada que pueda significar algo.",
          porque:
            "Dentro de un párrafo, cierto. Dentro de un atributo sin comillas, no, y esa es la lección: escapar depende del destino, y el mismo texto escapado con la misma función es seguro en un sitio y un agujero en el otro.",
        },
        {
          texto: "Depende del navegador.",
          porque:
            "No depende: los atributos sin comillas terminan en el primer espacio en todos, porque es lo que dice la especificación de HTML. Lo que sí varía entre navegadores es cuántos caracteres cuentan como separador, y eso solo empeora las cosas.",
        },
      ],
    },
    {
      pregunta: "¿Qué se hace con un dato que va dentro de una consulta a la base de datos?",
      opciones: [
        {
          texto: "No se escapa: se manda aparte de la consulta, como parámetro.",
          correcta: true,
          porque:
            "Es el patrón de los tres destinos difíciles —base de datos, órdenes del sistema y código—: cuando el dato viaja por otro canal, **no existe la posibilidad** de que se lea como instrucción. El agujero no está tapado: no está.",
        },
        {
          texto: "Se escapan las comillas simples, doblándolas.",
          porque:
            "Se puede hacer y casi nunca sale bien: las reglas dependen del motor y de la codificación de la conexión, y hay codificaciones donde un carácter multibyte se come la barra de escape. Es el destino donde escapar a mano ha salido más caro de la historia.",
        },
        {
          texto: "Se valida con una lista de permitidos y ya no hace falta nada más.",
          porque:
            "Validar está bien y no es esto. Un nombre perfectamente válido —`O'Brien`— rompe una consulta pegada con cadenas, así que la validación no te libra: lo que te libra es no construir la orden con el dato dentro.",
        },
      ],
    },
    {
      pregunta: "Se valida `nombre.trim().toLowerCase()` y después se usa `nombre`. ¿Qué pasa?",
      opciones: [
        {
          texto: "Que la validación no protege nada: aprueba un texto y el sistema usa otro.",
          correcta: true,
          porque:
            "Se llama confusión de validación y sobrevive a las revisiones porque las dos variables se llaman parecido. La defensa que no se puede olvidar es que la validación **devuelva el valor bueno** en vez de un sí o un no: así el original no vuelve a estar disponible por accidente.",
        },
        {
          texto: "Nada grave: `trim` y `toLowerCase` son transformaciones inofensivas.",
          porque:
            "Hoy puede que sí. El problema es la forma, no esas dos funciones: en cuanto la normalización haga algo de verdad —decodificar, resolver `..`, quitar acentos— las dos variables dejan de ser equivalentes y el agujero se abre sin que nadie toque la validación.",
        },
        {
          texto: "Que hay que validar las dos, la original y la normalizada.",
          porque:
            "Eso es duplicar el trabajo para seguir teniendo dos valores y la posibilidad de usar el que no toca. La regla es más simple: se usa exactamente el valor que se validó, y solo hay uno.",
        },
      ],
    },
    {
      pregunta: "¿Qué tiene de malo `parseInt(peticion.pagina)`?",
      opciones: [
        {
          texto: "Que se queda con el trozo del principio y tira el resto sin avisar: para `parseInt`, `'12abc'` son doce.",
          correcta: true,
          porque:
            "Y `'1e3'` es uno. La costumbre buena es comprobar primero **la forma del texto** con una lista de permitidos y convertir después: así no hay que saberse las rarezas de ninguna función de conversión.",
        },
        {
          texto: "Que devuelve `NaN` con textos raros y hay que acordarse de comprobarlo.",
          porque:
            "Eso también, y es lo de menos: `NaN` al menos se puede detectar. Lo peligroso es lo que **no** devuelve `NaN` y debería, porque eso pasa las comprobaciones. Y ojo: con `NaN` todas las comparaciones son falsas, así que validar por lo que se rechaza deja pasar justo ese valor.",
        },
        {
          texto: "Que hay que pasarle la base como segundo argumento.",
          porque:
            "Es una buena costumbre y no arregla nada de esto: `parseInt('12abc', 10)` sigue siendo doce. El problema no es la base, es que la función está pensada para leer el principio de un texto y no para validar.",
        },
      ],
    },
  ],
}
