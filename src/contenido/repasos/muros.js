/**
 * Las preguntas del repaso de «muros».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-muros",
  mundo: "muros",
  quien: "sarene",
  titulo: "El caso de los muros",
  preguntas: [
    {
      pregunta: "¿Qué hace un `JOIN` sin `ON`?",
      opciones: [
        {
          texto: "Multiplica: cada fila de una tabla contra cada fila de la otra.",
          correcta: true,
          porque: "Nueve puestos y seis gremios dan cincuenta y cuatro filas, cada una con un puesto y un gremio que no tienen nada que ver. Se llama producto cartesiano, no da ningún error y el resultado no parece roto: parece grande. La comprobación es contar las filas.",
        },
        {
          texto: "Da un error de sintaxis: el `ON` es obligatorio.",
          porque: "Ojalá. SQL lo acepta -hay casos raros donde unir todo contra todo es lo que se quiere- y por eso el fallo se cuela.",
        },
        {
          texto: "Une por las columnas que se llaman igual en las dos tablas.",
          porque: "Eso lo hace otra forma de unión que existe y casi nadie usa (`NATURAL JOIN`), precisamente porque adivinar por dónde unir es una idea peligrosa: el día que alguien añada una columna con el mismo nombre en las dos tablas, la unión cambia sola.",
        },
      ],
    },
    {
      pregunta: "Nueve puestos, uno sin gremio. ¿Cuántas filas devuelve `puestos JOIN gremios ON …`?",
      opciones: [
        {
          texto: "Ocho: el que no tiene gremio no encuentra pareja y desaparece.",
          correcta: true,
          porque: "Y sin avisar de nada, que es lo importante. Ocho filas donde había nueve no llama la atención de nadie, y ahí es donde se pierden datos en informes de verdad. Cuando unas, cuenta.",
        },
        {
          texto: "Nueve: un `JOIN` nunca pierde filas de la tabla de la izquierda.",
          porque: "Eso es lo que hace un `LEFT JOIN`, y de ahí sale la confusión. Un `JOIN` normal solo devuelve parejas.",
        },
        {
          texto: "Nueve, y el que no tiene gremio sale con las columnas del gremio a nulo.",
          porque: "También es el `LEFT JOIN`. Con un `JOIN` normal esa fila no llega al resultado.",
        },
      ],
    },
    {
      pregunta: "¿Por qué una fila con `gremio_id` a nulo no encuentra pareja?",
      opciones: [
        {
          texto: "Porque un nulo no es igual a nada, ni siquiera a otro nulo: la comparación no da verdadero.",
          correcta: true,
          porque: "Comparar con nulo no da verdadero ni falso: da «no se sabe». Y el `ON` solo empareja cuando la condición es verdadera. De esa misma regla sale que `WHERE columna = NULL` no encuentre los nulos, y por eso existe `IS NULL`.",
        },
        {
          texto: "Porque no hay ningún gremio con el `id` a nulo.",
          porque: "Es verdad -una clave primaria no puede estar vacía- y no es la razón. Aunque lo hubiera, tampoco emparejaría: el nulo no es igual al nulo.",
        },
        {
          texto: "Porque las claves ajenas no admiten nulos.",
          porque: "Sí los admiten, y es útil: significa «esta fila no pertenece a ninguna». Lo que no admite nulos es la clave primaria.",
        },
      ],
    },
    {
      pregunta: "¿Cuál es la diferencia entre poner una condición en el `ON` y ponerla en el `WHERE`?",
      opciones: [
        {
          texto: "El `ON` decide con quién se empareja cada fila; el `WHERE` filtra después de unir.",
          correcta: true,
          porque: "Con un `JOIN` normal casi da igual, y de ahí sale la confusión. Con un `LEFT JOIN` la diferencia es total: el `WHERE` sobre la tabla de la derecha tira justo las filas que el `LEFT` había salvado, porque llegan con nulos y comparar con nulo no da verdadero.",
        },
        {
          texto: "Ninguna: son dos sitios donde escribir lo mismo.",
          porque: "En un `JOIN` normal el resultado coincide, y por eso mucha gente lo cree. En cuanto hay un `LEFT` delante, dejan de ser lo mismo.",
        },
        {
          texto: "El `ON` solo admite igualdades y el `WHERE` cualquier condición.",
          porque: "El `ON` admite cualquier condición, y varias unidas con `AND`. Lo que cambia no es qué se puede escribir: es cuándo se aplica.",
        },
      ],
    },
    {
      pregunta: "`FROM puestos LEFT JOIN gremios ON … WHERE gremios.nombre <> 'aones'`. ¿Qué pasa con el puesto sin gremio?",
      opciones: [
        {
          texto: "Que no sale: el `LEFT` lo salva y el `WHERE` lo tira a continuación.",
          correcta: true,
          porque: "Su `gremios.nombre` llega a nulo, y `NULL <> 'aones'` vale «no se sabe», que el `WHERE` no deja pasar. Es el fallo que se escribe solo: alguien pone el `LEFT` a propósito, añade un filtro razonable y el `LEFT` deja de servir para nada. Se arregla subiendo la condición al `ON`.",
        },
        {
          texto: "Que sale: su gremio no es 'aones', así que cumple la condición.",
          porque: "Lo lógico sería eso, y con nulos la lógica normal no se aplica. Su gremio no es nada, y «nada» no es distinto de 'aones': es desconocido.",
        },
        {
          texto: "Que sale, porque el `LEFT JOIN` protege esa fila de cualquier filtro posterior.",
          porque: "El `LEFT JOIN` la protege de no tener pareja, no de un `WHERE`. Nada protege una fila de un filtro que va después.",
        },
      ],
    },
    {
      pregunta: "¿Por qué `gremios LEFT JOIN puestos` y `puestos LEFT JOIN gremios` no son la misma consulta?",
      opciones: [
        {
          texto: "Porque el `LEFT` conserva la tabla de la izquierda, y la de la izquierda es la que va en el `FROM`.",
          correcta: true,
          porque: "Un `JOIN` normal es simétrico y un `LEFT JOIN` no. Con estos datos las dos devuelven nueve filas y no son las mismas nueve: una conserva el puesto sin gremio y la otra el gremio sin puestos. La pregunta que decide cuál escribir es «¿de qué quiero una fila?».",
        },
        {
          texto: "Porque la condición del `ON` hay que escribirla al revés en cada caso.",
          porque: "La condición es idéntica y el orden dentro del `ON` da igual: `a = b` y `b = a` son la misma comparación. Lo que cambia es quién está protegido.",
        },
        {
          texto: "Porque la segunda devuelve más filas: puestos tiene más que gremios.",
          porque: "Con estos datos devuelven las mismas nueve, y es una casualidad de estos datos. El número no es lo que hay que mirar.",
        },
      ],
    },
    {
      pregunta: "Uniendo desde los gremios, el de los escribas sale tres veces. ¿Qué significa eso?",
      opciones: [
        {
          texto: "Que tiene tres puestos: cada fila del resultado es una pareja, no una cosa.",
          correcta: true,
          porque: "Y no es un fallo: es lo que significa unir. Si lo que querías era la lista de gremios, esta consulta devuelve la lista de parejas gremio-puesto, que es otra cosa. Para una fila por gremio con sus puestos contados hay que agrupar, y eso es el mundo siguiente.",
        },
        {
          texto: "Que hay tres gremios llamados «escribas» en la tabla.",
          porque: "No: el gremio está una sola vez en su tabla, que es justamente lo que se ganó al sacarlo de los puestos. La repetición está en el resultado, no en los datos.",
        },
        {
          texto: "Que falta un `DISTINCT`, y la consulta está mal.",
          porque: "Depende de lo que quieras. Si querías la lista de gremios, `DISTINCT` es la respuesta; si querías las parejas, la consulta está bien. La pregunta que hay que hacerse antes de escribir `DISTINCT` es por qué se repite.",
        },
      ],
    },
    {
      pregunta: "Ves un `DISTINCT` en una consulta que no has escrito tú. ¿Qué es lo primero que conviene mirar?",
      opciones: [
        {
          texto: "Por qué se repite: si por parejas de verdad o porque el `ON` no cose bien.",
          correcta: true,
          porque: "Hay dos casos y se arreglan al revés. Si tres filas iguales son tres parejas reales, `DISTINCT` es correcto. Si son la misma pareja tres veces, `DISTINCT` está tapando un fallo: la consulta devuelve lo correcto por casualidad y dejará de hacerlo cuando los datos cambien.",
        },
        {
          texto: "Cuánto tarda: `DISTINCT` obliga a ordenar o comparar todo con todo.",
          porque: "Es cierto que cuesta, y es un asunto menor comparado con la posibilidad de que esté escondiendo filas basura.",
        },
        {
          texto: "Nada: `DISTINCT` es gratis y siempre correcto.",
          porque: "Ni gratis ni siempre correcto. Es la tirita que se pone sobre las uniones mal cosidas, y como funciona, nadie vuelve a mirar la herida.",
        },
      ],
    },
    {
      pregunta: "¿Qué se gana sacando el gremio de la tabla de puestos y poniéndolo en su propia tabla?",
      opciones: [
        {
          texto: "Que el gremio pasa a ser una cosa: se escribe una vez, no puede contradecirse y puede tener datos propios.",
          correcta: true,
          porque: "El ahorro de letras es lo de menos. Lo que se gana es que el gremio existe por sí mismo -puede tener un maestro, y puede existir sin ningún puesto- y que su nombre no puede estar escrito de tres maneras distintas. El precio es que hay que unir, y se paga una vez.",
        },
        {
          texto: "Que las consultas van más rápido, porque comparar números es más rápido que comparar textos.",
          porque: "Comparar números es algo más rápido, sí, y ahora hay que unir dos tablas, así que en velocidad no está claro que se gane nada. El motivo es de orden, no de velocidad.",
        },
        {
          texto: "Que ya no puede haber puestos sin gremio.",
          porque: "Al contrario: la clave ajena admite nulos, y eso significa «este puesto no es de ninguno». Todo este mundo va de qué hacer con esa fila.",
        },
      ],
    },
  ],
}
