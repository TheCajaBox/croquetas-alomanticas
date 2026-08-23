/**
 * Las preguntas del repaso de «grieta».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-grieta",
  mundo: "grieta",
  quien: "gaotona",
  titulo: "El caso de la grieta",
  preguntas: [
    {
      pregunta: "¿Por qué un parámetro no se puede inyectar?",
      opciones: [
        {
          texto: "Porque la base entiende la consulta antes de recibir el valor: cuando llega, no hay nada que reinterpretar.",
          correcta: true,
          porque:
            "Y por eso no hay que adivinar qué textos son peligrosos. No es que la base «limpie» el valor: es que el valor llega por un canal donde no se leen órdenes, después de que la frase ya esté entendida.",
        },
        {
          texto: "Porque la base escapa las comillas del valor automáticamente.",
          porque:
            "Es la explicación que se da y no es lo que pasa. Si fuera escapado, seguiría dependiendo de la codificación y del motor, que es justo lo que hace inviable escapar a mano. Con un parámetro el valor no entra en el texto en ningún momento.",
        },
        {
          texto: "Porque los parámetros solo admiten letras y números.",
          porque:
            "Admiten cualquier cosa, y ahí está la gracia: `' OR 1=1 --` es un valor perfectamente aceptable. Lo que pasa es que es el nombre de nadie.",
        },
      ],
    },
    {
      pregunta: "¿Qué hace `' OR 1=1 --` en `WHERE nombre = '…'`?",
      opciones: [
        {
          texto: "La comilla cierra el texto, el `OR` hace la condición verdadera para todas las filas y el `--` comenta la comilla que sobraba.",
          correcta: true,
          porque:
            "Las tres partes están ahí por algo, y la tercera es la que sorprende: el ataque está escrito **para que la consulta siga siendo válida**. Un ataque que da error de sintaxis es un ataque a medio escribir.",
        },
        {
          texto: "Da un error de sintaxis por las comillas descolocadas.",
          porque:
            "Sería lo cómodo. El `--` está precisamente para que no pase: comenta el resto de la línea, incluida la comilla que el programa había puesto al final.",
        },
        {
          texto: "Borra la tabla.",
          porque:
            "Eso sería otra carga, y por cierto suele no funcionar: muchas bibliotecas no dejan ejecutar dos sentencias en una llamada. Esta no borra nada: se lleva las filas, que es peor porque no se nota.",
        },
      ],
    },
    {
      pregunta: "¿Qué se puede poner en un parámetro?",
      opciones: [
        {
          texto: "Un valor: un nombre, un número, un límite. No la columna por la que se ordena ni el nombre de la tabla.",
          correcta: true,
          porque:
            "Y `ORDER BY :columna` es el caso traicionero: no da error, ordena por una constante y el resultado sale sin ordenar. Otro fallo silencioso. Cuando lo que varía es la estructura, se elige de una lista cerrada escrita por ti.",
        },
        {
          texto: "Cualquier trozo de la consulta: para eso está.",
          porque:
            "No, y el motivo es de fondo: la base necesita entender la frase para planificarla, y sin saber de qué tabla lee no hay frase. Un hueco donde va un dato no le estorba; uno donde va una tabla, sí.",
        },
        {
          texto: "Solo textos; los números se pegan porque no llevan comillas.",
          porque:
            "Es exactamente el descuido que más se ve, y los números necesitan **menos** para inyectarse: `1 OR 1=1` no tiene que cerrar ninguna comilla. Los números se parametrizan igual.",
        },
      ],
    },
    {
      pregunta: "Un `UNION` inyectado en un `SELECT`. ¿Qué alcance tiene?",
      opciones: [
        {
          texto: "La base entera, con los permisos del usuario con el que se conecta el programa.",
          correcta: true,
          porque:
            "Y los nombres de las tablas no hay que adivinarlos: se le preguntan al catálogo del motor, que es una tabla más. De ahí la defensa de segunda línea: que el usuario de la base pueda hacer solo lo que el programa necesita. No evita la inyección; limita lo que se lleva.",
        },
        {
          texto: "Solo la tabla que la consulta ya miraba.",
          porque:
            "Ese es el alcance del `OR 1=1`. El `UNION` pega una segunda consulta, y esa segunda puede leer de donde quiera: es cuando la inyección deja de ser un problema de una consulta y pasa a ser una filtración.",
        },
        {
          texto: "Ninguno si no se ve el resultado en la página.",
          porque:
            "También se saca sin verlo: si la página contesta distinto —o tarda distinto— según si la condición es verdadera, se pregunta letra a letra. Se llama inyección a ciegas y está automatizada.",
        },
      ],
    },
    {
      pregunta: "`d'Alai` rompe la consulta. ¿Qué se hace?",
      opciones: [
        {
          texto: "Parametrizar. El apóstrofo es una letra más de un texto que se compara.",
          correcta: true,
          porque:
            "Y esto es lo importante de este caso: no hay ningún ataque. Es un escriba buscándose por su apellido, y demuestra que la inyección no es un problema de gente mala sino de mezclar datos con órdenes.",
        },
        {
          texto: "Prohibir el apóstrofo en los nombres.",
          porque:
            "Con eso los d'Alai, los O'Brien y los N'Diaye se quedan sin poder usar el sistema. Es el error del mundo anterior: intentar arreglar en la validación algo que se arregla donde el dato se usa. Un apellido con apóstrofo es un dato válido.",
        },
        {
          texto: "Doblar las comillas del valor antes de pegarlo.",
          porque:
            "Funciona a veces, y «a veces» en seguridad significa que no: depende del motor y de la codificación, y no protege lo que no va entre comillas. Además hay que acordarse en las veinte consultas del proyecto.",
        },
      ],
    },
    {
      pregunta: "El registro muestra un error de SQL cuando alguien escribe una comilla. ¿Importa?",
      opciones: [
        {
          texto: "Sí: dice que hay una base detrás, que el texto llega a la orden y con qué motor se está hablando.",
          correcta: true,
          porque:
            "Es la primera prueba de cualquiera que busque una inyección, y el mensaje de error se la contesta gratis. De ahí la regla: los errores internos se registran en el servidor y al usuario se le da un mensaje neutro.",
        },
        {
          texto: "No: un error no es un agujero.",
          porque:
            "No es un agujero y es un mapa. La diferencia entre un sistema que se puede atacar y uno que se puede atacar **rápido** está casi siempre en cuánto cuenta cuando algo va mal.",
        },
        {
          texto: "Solo si el error muestra la consulta completa.",
          porque:
            "La consulta completa es peor, sí. Pero con el mensaje a secas ya se sabe que la comilla llegó hasta el motor, y eso es la mitad de la información.",
        },
      ],
    },
    {
      pregunta: "¿Por qué las condiciones sobre la tabla de la derecha de un `LEFT JOIN` van en el `ON`?",
      opciones: [
        {
          texto: "Porque en el `WHERE` descartan las filas rellenadas con nulos, y con eso el `LEFT JOIN` deja de servir de nada.",
          correcta: true,
          porque:
            "La fila sin pareja llega con nulos, y un nulo no cumple `secreto = 0` —ni lo incumple: es una pregunta sin respuesta—. Así que se descarta, y el cero que queríamos ver desaparece. En el `ON`, la condición decide **con qué** empareja, no qué filas sobreviven.",
        },
        {
          texto: "Por costumbre: da lo mismo y se lee mejor.",
          porque:
            "No da lo mismo, y esa es la trampa: con datos donde todas las filas tienen pareja, las dos versiones dan el mismo resultado. La diferencia aparece justo en el caso que el `LEFT JOIN` estaba puesto para cubrir.",
        },
        {
          texto: "Porque en el `WHERE` no se pueden usar columnas de la tabla unida.",
          porque:
            "Sí se pueden, y de hecho a veces es lo que se quiere. Lo que hay que saber es qué significa cada sitio: el `ON` empareja, el `WHERE` filtra el resultado de emparejar.",
        },
      ],
    },
    {
      pregunta: "Estás montando una consulta por trozos según los filtros que pidan. ¿Qué regla la mantiene segura?",
      opciones: [
        {
          texto: "Cada trozo es texto fijo escrito por ti; lo que llega de fuera viaja siempre en los valores.",
          correcta: true,
          porque:
            "Con eso se puede concatenar tranquilamente: lo que se pega son constantes del código. La regla no es «nunca concatenes», es «nunca concatenes algo que venga de fuera». Y para revisar código, busca los `+` y los `${}` que tocan un SQL.",
        },
        {
          texto: "Escapar cada trozo antes de pegarlo.",
          porque:
            "Un trozo escrito por ti no necesita escaparse, y uno que venga de fuera no se arregla escapándolo. La separación correcta no es «escapado o no»: es «texto o valor».",
        },
        {
          texto: "Montar la consulta entera de golpe en vez de por trozos.",
          porque:
            "Montarla por trozos está bien y es lo normal cuando los filtros son opcionales. Lo que importa no es cómo se monta el texto, es qué acaba dentro de él.",
        },
      ],
    },
    {
      pregunta: "Escribes `'menor'` en vez de `:clase` y la consulta funciona. ¿Está bien?",
      opciones: [
        {
          texto: "Hoy sí, y es una bomba de relojería: el día que ese valor tenga que variar, se convierte en una concatenación.",
          correcta: true,
          porque:
            "Y ese día llega en el segundo mes de cualquier proyecto. Por eso la costumbre es escribir el parámetro desde el principio, incluso cuando el valor es constante: no cuesta nada y evita la conversión peligrosa.",
        },
        {
          texto: "Está bien: un valor escrito por ti no es una entrada.",
          porque:
            "Cierto, y por eso «hoy sí». Lo que hace que esto sea una mala costumbre no es el riesgo de ahora: es que la forma del código invita al cambio peligroso, y quien lo cambie no será quien lo escribió.",
        },
        {
          texto: "Está mal: la consulta no funciona.",
          porque:
            "Funciona perfectamente, y eso es lo que hace difícil este mundo. Casi todos los agujeros de seguridad están en código que funciona; si no funcionara, alguien lo habría arreglado.",
        },
      ],
    },
  ],
}
