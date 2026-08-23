/**
 * Las preguntas del repaso de «mercado».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-mercado",
  mundo: "mercado",
  quien: "sarene",
  titulo: "El caso del mercado",
  preguntas: [
    {
      pregunta: "¿Qué hace el `GROUP BY`?",
      opciones: [
        {
          texto: "Parte las filas en montones y aplica los agregados a cada montón: una fila por montón.",
          correcta: true,
          porque: "Y lo importante es lo que cambia: hasta ahora una fila del resultado era una cosa, y desde aquí es un montón de cosas resumido. Agrupar **quita** filas: dieciséis ventas entran y salen ocho puestos.",
        },
        {
          texto: "Añade a cada fila una columna con el resumen de su grupo.",
          porque: "Eso es más parecido a lo que hace una unión, o a lo que hacen las funciones de ventana que llegan en El Dor. Agrupar no añade columnas a las filas: reduce las filas.",
        },
        {
          texto: "Ordena las filas por esa columna.",
          porque: "Suele salir ordenado como efecto secundario, y no es lo que hace ni está garantizado. Para ordenar está el `ORDER BY`.",
        },
      ],
    },
    {
      pregunta: "Un puesto no tiene ni una venta. Agrupas la tabla `ventas` por puesto. ¿Sale con un cero?",
      opciones: [
        {
          texto: "No sale de ninguna manera: agrupar solo hace montones con las filas que hay.",
          correcta: true,
          porque: "Y no se arregla agrupando mejor. De ese puesto no hay ninguna fila en `ventas`, así que no tiene montón. Para que aparezca con su cero hay que empezar por `puestos` y unir con un `LEFT JOIN`: entonces el puesto está y su montón está vacío.",
        },
        {
          texto: "Sí, con cero: los agregados devuelven cero cuando no hay nada.",
          porque: "`COUNT` de un montón vacío daría cero, y el problema es anterior: no hay montón. Y ojo, que `SUM` de un montón donde todo es nulo devuelve **nulo**, no cero.",
        },
        {
          texto: "Sale con un nulo en la columna del total.",
          porque: "Eso es lo que pasa con un `LEFT JOIN` por medio. Sin él, esa fila no existe en absoluto.",
        },
      ],
    },
    {
      pregunta: "¿Cuál es la diferencia entre `WHERE` y `HAVING`?",
      opciones: [
        {
          texto: "El `WHERE` decide qué filas entran en los montones; el `HAVING` decide qué montones salen.",
          correcta: true,
          porque: "La regla práctica: si la condición se puede contestar mirando una sola fila, va en el `WHERE`; si hace falta el montón, en el `HAVING`. Y hay un efecto que se olvida: un `WHERE` cambia las cuentas, y puede hacer desaparecer un montón entero si le quita todas sus filas.",
        },
        {
          texto: "Ninguna: el `HAVING` es el nombre que tiene el `WHERE` cuando hay un `GROUP BY`.",
          porque: "Se pueden usar los dos en la misma consulta, y hacen cosas distintas. Un `WHERE` no puede hablar de una suma -cuando trabaja, no existe- y un `HAVING` sí.",
        },
        {
          texto: "El `HAVING` es más lento y por eso se usa menos.",
          porque: "Filtrar filas con `HAVING` sí obliga a agrupar filas que se van a tirar, y eso es lo de menos: lo malo es que se lee como si la condición hablara del montón cuando hablaba de una fila.",
        },
      ],
    },
    {
      pregunta: "Después de un `LEFT JOIN`, ¿por qué `COUNT(*)` cuenta mal?",
      opciones: [
        {
          texto: "Porque cuenta filas, y el montón de un grupo vacío tiene una fila: la que la unión fabricó con todo a nulo.",
          correcta: true,
          porque: "Una fila es una fila, así que `COUNT(*)` dice uno donde hay cero. La regla: después de un `LEFT JOIN`, cuenta una columna de la tabla de la derecha -normalmente su clave primaria-, porque `COUNT(columna)` cuenta valores no nulos.",
        },
        {
          texto: "Porque `COUNT(*)` no funciona con uniones.",
          porque: "Funciona perfectamente y cuenta exactamente lo que promete. El problema es que lo que promete no es lo que querías preguntar.",
        },
        {
          texto: "Porque `COUNT(*)` incluye los nulos y `COUNT(columna)` también.",
          porque: "`COUNT(columna)` cuenta solo valores **no** nulos, y ahí está la diferencia entera. `COUNT(*)` no mira ninguna columna, así que los nulos no le afectan.",
        },
      ],
    },
    {
      pregunta: "`SUM(monedas)` sobre un montón donde todas las monedas son nulas devuelve…",
      opciones: [
        {
          texto: "`NULL`, porque los agregados se saltan los nulos y no queda nada que sumar.",
          correcta: true,
          porque: "No es un fallo: es honrado. No hay ninguna venta, así que no hay suma. Si el informe necesita un cero se pide a mano con `COALESCE(SUM(...), 0)`, y eso es una decisión: un nulo dice «no hay datos» y un cero dice «el dato es cero», que no es lo mismo.",
        },
        {
          texto: "`0`, porque sumar nada da cero.",
          porque: "Matemáticamente sí, y SQL no hace eso. Es de las diferencias que más sorprenden y la que más huecos deja en los informes.",
        },
        {
          texto: "Un error, porque no se puede sumar nulos.",
          porque: "No da error: los ignora. Sumar una columna con tres números y dos nulos suma los tres números y se queda tan tranquilo, que es lo que suele quererse.",
        },
      ],
    },
    {
      pregunta: "En un `SELECT` con `GROUP BY`, ¿qué columnas se pueden pedir?",
      opciones: [
        {
          texto: "Las del `GROUP BY` y agregados. Cualquier otra no tiene una respuesta única dentro del montón.",
          correcta: true,
          porque: "Si agrupas por puesto y pides el día, ¿qué día? Casi todas las bases dan error; **SQLite te devuelve un valor cualquiera del montón** y no avisa, que es peor que un error porque el informe sale y parece bueno.",
        },
        {
          texto: "Cualquiera: la base devuelve el primer valor del grupo.",
          porque: "Eso es lo que hace SQLite, y no es una promesa: es una permisividad. La misma consulta en otra base no compila, y aquí el valor que sale no está garantizado.",
        },
        {
          texto: "Solo agregados: las columnas normales no se pueden mezclar con ellos.",
          porque: "La columna por la que agrupas sí se puede, y casi siempre hace falta: sin ella el resultado son números sin etiqueta y no hay manera de saber de quién es cada uno.",
        },
      ],
    },
    {
      pregunta: "Quieres contar cuántos puestos distintos hay en un informe donde cada puesto sale una vez por venta. ¿Qué usas?",
      opciones: [
        {
          texto: "`COUNT(DISTINCT p.id)`.",
          correcta: true,
          porque: "Es el agregado que más se olvida y el que más falta hace en cuanto hay uniones: contesta a «cuántos hay distintos», que no es «cuántas filas hay». Sin él, un gremio con tres puestos y cuatro ventas diría que tiene cuatro puestos.",
        },
        {
          texto: "`COUNT(p.id)`, que ya cuenta cada puesto una vez.",
          porque: "Cuenta valores no nulos, y el mismo `p.id` repetido cuatro veces son cuatro valores. Sin `DISTINCT` el número sale inflado por la unión.",
        },
        {
          texto: "`COUNT(*)`, y después dividir por las ventas de cada puesto.",
          porque: "Eso es hacer a mano, y mal, lo que `COUNT(DISTINCT ...)` hace en una palabra.",
        },
      ],
    },
    {
      pregunta: "`SELECT MAX(monedas), dia FROM ventas`. ¿Devuelve el día de la venta más alta?",
      opciones: [
        {
          texto: "No está garantizado: `MAX` devuelve un valor, no una fila. El día que sale puede ser de otra fila.",
          correcta: true,
          porque: "En SQLite esa consulta concreta suele acertar, y no es una promesa. «La fila del máximo» es una pregunta distinta y necesita otra herramienta: subconsultas o funciones de ventana, y las dos son de El Dor. Hoy la respuesta honrada es que `MAX` da el número y para la fila hay que volver a preguntar.",
        },
        {
          texto: "Sí: la base devuelve la fila entera donde está el máximo.",
          porque: "Eso es lo que uno espera y no es lo que hace ningún agregado. `MAX` recibe muchas filas y devuelve un valor; la fila de donde salió no viaja con él.",
        },
        {
          texto: "No: esa consulta da error porque mezcla un agregado con una columna normal.",
          porque: "En casi todas las bases sí, y SQLite lo acepta. Que no dé error es exactamente lo que hace peligrosa esta consulta.",
        },
      ],
    },
    {
      pregunta: "Los totales de tus montones suman más que el total de la tabla. ¿Qué ha pasado?",
      opciones: [
        {
          texto: "Una unión está duplicando filas: alguna se está contando en más de un montón, o dos veces en el mismo.",
          correcta: true,
          porque: "Es la comprobación que más vale de este mundo, porque el número de filas no lo delata: ocho montones son ocho montones aunque dentro haya el doble de filas de las que debería. Si los trozos no suman el total, hay filas duplicadas -o, si suman menos, filas que se han caído en un `WHERE` o en una unión-.",
        },
        {
          texto: "Nada: es normal que los grupos sumen más, porque los bordes se solapan.",
          porque: "Los montones de un `GROUP BY` no se solapan nunca: cada fila cae en uno y solo uno. Si la suma no cuadra, el problema está antes de agrupar.",
        },
        {
          texto: "Que falta un `DISTINCT` en el `SELECT`.",
          porque: "`DISTINCT` en el `SELECT` de una consulta agrupada no arreglaría las cuentas: los agregados ya se han calculado con las filas duplicadas dentro. Hay que arreglar la unión.",
        },
      ],
    },
  ],
}
