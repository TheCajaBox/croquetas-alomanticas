/**
 * Las preguntas del repaso de «ceniza».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-ceniza",
    mundo: "ceniza",
    quien: "brisa",
    titulo: "El caso de la ceniza",
    preguntas: [
      {
        pregunta: "¿Para qué sirve `<?php` al principio de un fichero?",
        opciones: [
          {
            texto: "Para decirle a PHP dónde empieza el código; lo de antes es texto normal.",
            correcta: true,
            porque: "Un fichero de PHP puede llevar texto suelto y código en medio. La etiqueta marca la frontera.",
          },
          {
            texto: "Para declarar la versión de PHP que se va a usar.",
            porque: "La versión la decide el servidor, no el fichero. La etiqueta solo abre el código.",
          },
          {
            texto: "Es opcional: PHP entiende el código igual sin ella.",
            porque: "Sin la etiqueta, PHP lo trata todo como texto y lo imprime tal cual, código incluido.",
          },
        ],
      },
      {
        pregunta: '¿Qué imprime `echo \'Van $cuantos\';` si `$cuantos` vale 3?',
        opciones: [
          {
            texto: "`Van $cuantos`, literal.",
            correcta: true,
            porque: "Con comillas simples PHP no mira dentro: sale tal cual, con el dólar y el nombre.",
          },
          {
            texto: "`Van 3`.",
            porque: "Eso sería con comillas dobles. Es la diferencia que más se confunde el primer día.",
          },
          {
            texto: "Da un error, porque las variables no van dentro de un texto.",
            porque: "Sí van, pero solo se sustituyen entre comillas dobles. Entre simples no hay error: hay literalidad.",
          },
        ],
      },
      {
        pregunta: "¿Cómo se pegan dos textos en PHP?",
        opciones: [
          {
            texto: "Con un punto: `'a' . 'b'`.",
            correcta: true,
            porque: "El punto concatena. Es una de las cosas que más despista viniendo de otros lenguajes.",
          },
          {
            texto: "Con un `+`, como en la mayoría de los lenguajes.",
            porque: "En PHP el `+` es aritmética. Con dos textos que no sean números, da error de tipos.",
          },
          {
            texto: "Con una coma: `'a', 'b'`.",
            porque: "La coma separa argumentos. En un `echo` funciona por casualidad, pero no está concatenando nada.",
          },
        ],
      },
      {
        pregunta: "¿Qué devuelve `count(['Kelsier', 'Brisa'])`?",
        opciones: [
          {
            texto: "2, que es cuántos elementos hay.",
            correcta: true,
            porque: "`count` cuenta elementos. No es la última posición: esa sería 1, porque se empieza en cero.",
          },
          {
            texto: "1, que es la última posición.",
            porque: "Ese es el índice del último, y son dos cosas distintas. Confundirlas es el error clásico del bucle.",
          },
          {
            texto: "El número de letras de todo junto.",
            porque: "Eso sería `strlen` sobre un texto. `count` es para listas.",
          },
        ],
      },
      {
        pregunta: "En un `foreach` que suma, ¿dónde va `$total = 0;`?",
        opciones: [
          {
            texto: "Antes del bucle, fuera.",
            correcta: true,
            porque: "El acumulador tiene que sobrevivir a las vueltas. Dentro, cada vuelta lo pone a cero otra vez.",
          },
          {
            texto: "Dentro del bucle, en la primera línea.",
            porque: "Entonces al final vale lo que valiera el último elemento, y encima parece que funciona con listas de uno.",
          },
          {
            texto: "Da igual: PHP lo entiende de las dos maneras.",
            porque: "Lo entiende de las dos, y hace dos cosas distintas. Que no dé error es justo lo que lo hace peligroso.",
          },
        ],
      },
      {
        pregunta: "Una función declarada `: string` hace `echo` en vez de `return`. ¿Qué pasa?",
        opciones: [
          {
            texto: "Imprime y devuelve null, así que revienta al llamarla esperando texto.",
            correcta: true,
            porque: "`echo` saca por pantalla; `return` entrega. Quien la llame no recibe nada, y el tipo declarado lo delata.",
          },
          {
            texto: "Funciona: imprimir y devolver son lo mismo.",
            porque: "Son cosas distintas. Es de los primeros errores de verdad que se cometen, y de los más útiles de entender.",
          },
          {
            texto: "Devuelve lo impreso, porque PHP lo recoge solo.",
            porque: "No lo recoge nadie salvo que se le pida expresamente, con búfer de salida. Por defecto se va a la pantalla.",
          },
        ],
      },
      {
        pregunta: "¿Qué diferencia hay entre `==` y `===`?",
        opciones: [
          {
            texto: "`==` compara el valor y convierte si hace falta; `===` exige además el mismo tipo.",
            correcta: true,
            porque: "Por eso `1 == '1'` es cierto y `1 === '1'` no. La costumbre buena es usar `===` por defecto.",
          },
          {
            texto: "`===` es más rápido, pero comparan lo mismo.",
            porque: "No comparan lo mismo: uno se permite convertir tipos y el otro no. La velocidad es lo de menos.",
          },
          {
            texto: "`==` es para números y `===` para textos.",
            porque: "Los dos valen para todo. Lo que cambia es si el tipo cuenta o no.",
          },
        ],
      },
      {
        pregunta: "Con `$m = ['a', 'b', 'c']`, ¿cuál es el último elemento?",
        opciones: [
          {
            texto: "`$m[count($m) - 1]`, porque las posiciones empiezan en cero.",
            correcta: true,
            porque: "Tres elementos, posiciones 0, 1 y 2. `count` dice 3 y hay que restar uno.",
          },
          {
            texto: "`$m[count($m)]`.",
            porque: "Esa posición no existe: es una más allá del final. PHP avisa y vale `null`.",
          },
          {
            texto: "`$m[3]`, que es el tercero.",
            porque: "El tercero es `$m[2]`. Contar desde uno y acceder desde cero es el despiste más repetido que hay.",
          },
        ],
      },
      {
        pregunta: "¿Qué contesta `empty($x)` si `$x` vale `0`?",
        opciones: [
          {
            texto: "`true`: para `empty`, el cero está vacío.",
            correcta: true,
            porque: "También lo están `''`, `'0'`, `false`, `null` y `[]`. Con precios y cantidades eso da fallos reales: si lo que quieres saber es si existe, `isset`.",
          },
          {
            texto: "`false`, porque el cero es un valor como cualquier otro.",
            porque: "Debería serlo, y para `empty` no lo es. Ahí está la trampa entera de esa función.",
          },
          {
            texto: "Da error, porque `empty` solo acepta textos y arrays.",
            porque: "Acepta cualquier cosa. El problema no es que falle: es que contesta algo que no esperabas.",
          },
        ],
      },
    ],
  }
