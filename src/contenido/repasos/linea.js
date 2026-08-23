/**
 * Las preguntas del repaso de «linea».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-linea",
  mundo: "linea",
  quien: "sarene",
  titulo: "El caso de la línea que falta",
  preguntas: [
    {
      pregunta: "Una consulta con `COUNT` y `SUM` y sin `GROUP BY`. ¿Qué devuelve?",
      opciones: [
        {
          texto: "Una sola fila con el resumen de la tabla entera.",
          correcta: true,
          porque: "El montón es todo. Y si además pides una columna normal -un nombre-, casi todas las bases dan error y **SQLite te devuelve el valor de una fila cualquiera** sin decir nada. Sale una fila con un nombre de verdad al lado de dos números de verdad que no significan lo mismo. Es el acto I de este mundo.",
        },
        {
          texto: "Un error, porque los agregados necesitan `GROUP BY`.",
          porque: "No lo necesitan: sin él resumen la tabla entera, y eso es útil y correcto. El error, cuando lo hay, es por pedir una columna que no es del `GROUP BY` ni un agregado.",
        },
        {
          texto: "Una fila por cada fila de la tabla, con el total repetido.",
          porque: "Eso es lo que hace una función de ventana -`SUM(...) OVER ()`- y es precisamente la diferencia entre agrupar y anotar.",
        },
      ],
    },
    {
      pregunta: "En una cadena de dos uniones, la primera es `LEFT JOIN` y la segunda `JOIN`. ¿Qué pasa?",
      opciones: [
        {
          texto: "Que la segunda tira las filas que la primera había salvado: basta con que una no sea `LEFT`.",
          correcta: true,
          porque: "El gremio sin puestos sobrevive a la primera unión con las columnas de puestos a nulo, y entonces la segunda intenta unir por un nulo, que no empareja con nada. Si es un `JOIN` normal, la fila se cae **después** de haber sido salvada.",
        },
        {
          texto: "Nada: el `LEFT` de la primera protege la fila el resto de la consulta.",
          porque: "No protege nada más allá de su propio paso. Es el mismo mecanismo que el `WHERE` que deshace un `LEFT JOIN`, una línea más abajo.",
        },
        {
          texto: "Que da error por mezclar dos clases de unión.",
          porque: "Se mezclan constantemente y es perfectamente válido. Que no dé error es lo que hace que este fallo se cuele.",
        },
      ],
    },
    {
      pregunta: "Los totales de tus montones suman más que el total de la tabla. ¿Qué es?",
      opciones: [
        {
          texto: "Una unión que duplica filas. Y es el único síntoma que el número de filas no delata.",
          correcta: true,
          porque: "Seis montones son seis montones aunque dentro haya el triple de filas. La causa más silenciosa es una tabla unida dos veces por descuido: los gremios de un solo puesto salen bien, así que medio informe está correcto. Y ojo: si una columna sale bien **solo porque lleva `DISTINCT`**, hay duplicación por debajo y las demás están mal.",
        },
        {
          texto: "Un `GROUP BY` por la columna equivocada.",
          porque: "Eso cambia cuántos montones hay y qué cae en cada uno, y la suma total sigue cuadrando: agrupar reparte, no inventa. Si la suma no cuadra, el problema es anterior.",
        },
        {
          texto: "Nada: es normal que los grupos sumen más porque los bordes se solapan.",
          porque: "Los montones de un `GROUP BY` no se solapan nunca: cada fila cae en uno y solo uno.",
        },
      ],
    },
    {
      pregunta: "Una consulta no devuelve **ninguna** fila y debería devolver una. ¿Cuál es el primer sospechoso?",
      opciones: [
        {
          texto: "Un `NOT IN` cuya subconsulta trae un nulo.",
          correcta: true,
          porque: "`x NOT IN (a, b, NULL)` se traduce a un `AND` con un trozo desconocido dentro, y eso no puede ser verdadero para nadie. La versión afirmativa con `IN` sí funcionaría -se traduce con `OR`- y por eso nadie sospecha de la palabra. La regla: con subconsulta, `NOT EXISTS`.",
        },
        {
          texto: "Un `LIMIT 0` olvidado.",
          porque: "Sería un fallo tonto y se ve leyendo. Los que importan son los que no se ven leyendo.",
        },
        {
          texto: "Una unión sin `ON`.",
          porque: "Eso devuelve muchísimas más filas, no ninguna. Es el síntoma contrario.",
        },
      ],
    },
    {
      pregunta: "En un `CASE WHEN`, ¿por qué el caso vacío se comprueba primero?",
      opciones: [
        {
          texto: "Porque las ramas se prueban en orden, y si no, el caso vacío cae en una rama que no le corresponde.",
          correcta: true,
          porque: "Un puesto sin ventas tiene el total a cero, que no es mayor que 200, así que caería en el `ELSE` y saldría como «flojo»: un puesto que no ha abierto contado como uno que ha vendido poco. Es la misma idea que una cláusula de guarda: el caso raro se atiende arriba.",
        },
        {
          texto: "Porque las condiciones con agregados tienen que ir primero.",
          porque: "No hay ninguna regla así. Lo que decide es el orden en que se prueban las ramas y qué caso quieres cazar antes.",
        },
        {
          texto: "Da igual el orden: gana la condición más específica.",
          porque: "Gana la **primera verdadera**, no la más específica. SQL no elige por especificidad, elige por orden.",
        },
      ],
    },
    {
      pregunta: "Quieres poner un `UNIQUE` en una tabla que ya tiene datos, y los datos ya lo incumplen. ¿Qué haces primero?",
      opciones: [
        {
          texto: "Buscar los duplicados con un `GROUP BY … HAVING COUNT(*) > 1` y decidir qué se hace con ellos.",
          correcta: true,
          porque: "Es una consulta de tres líneas y te ahorra descubrir el problema a mitad de la migración. Después se decide: juntarlos, quedarse con uno, o pararse y preguntar. Y la comprobación que separa una migración de una pérdida de datos: **los totales antes y después tienen que cuadrar**.",
        },
        {
          texto: "Añadir la restricción y ver qué falla.",
          porque: "En SQLite no se puede añadir un `UNIQUE` a una tabla que existe, y en las bases donde sí se puede, fallar a media tabla te deja a medias. Mirar antes es más barato.",
        },
        {
          texto: "Borrar los duplicados y seguir.",
          porque: "Puede ser la decisión correcta, y es una decisión: si esas dos ventas eran dos ventas de verdad, borrar una es perder dinero del informe. Juntarlas sumando conserva el total.",
        },
      ],
    },
    {
      pregunta: "¿Cuál de estas tres cuentas caza el fallo más difícil de ver del camino?",
      opciones: [
        {
          texto: "Contar las filas del resultado y compararlas con lo que esperabas.",
          correcta: true,
          porque: "Es la más tonta de las tres y caza la línea que falta: nueve puestos, una fila. Y tiene una versión de bolsillo para las consultas agrupadas: el número de filas es el número de valores distintos de la columna del `GROUP BY`; sin `GROUP BY`, uno.",
        },
        {
          texto: "Comprobar que los agregados de los montones suman el total de la tabla.",
          porque: "Es una comprobación excelente y caza otra cosa: las duplicaciones. Contra un `GROUP BY` que falta no sirve, porque con una sola fila los totales cuadran perfectamente.",
        },
        {
          texto: "Mirar la fila del grupo vacío y la del que solo tiene uno.",
          porque: "También es excelente y caza los ceros que salen como unos y los huecos. Pero si la consulta devuelve una sola fila, no hay grupo vacío que mirar.",
        },
      ],
    },
    {
      pregunta: "En el esquema del mercado, `puestos.gremio_id` admite nulos y `ventas.puesto_id` no. ¿Por qué?",
      opciones: [
        {
          texto: "Porque un puesto sin gremio es un dato legítimo y una venta sin puesto no significa nada.",
          correcta: true,
          porque: "Cada columna que admite nulos es una decisión, y cada una que no los admite es otra. Lo que no vale es no haberlo pensado: el valor por omisión de SQL es «admite nulos», y eso deja la puerta abierta a filas que no significan nada.",
        },
        {
          texto: "Porque las claves ajenas a una tabla con clave primaria entera no pueden ser nulas.",
          porque: "Sí pueden, y es útil: un nulo ahí significa «esta fila no pertenece a ninguna». Lo que no puede ser nula es la clave primaria.",
        },
        {
          texto: "Es un descuido: las dos deberían ser `NOT NULL`.",
          porque: "Con `gremio_id NOT NULL` no se podría guardar el tenderete, que existe y no está en ningún gremio. Habría que inventarle un gremio «ninguno», y eso es peor: un dato falso para no admitir que falta un dato.",
        },
      ],
    },
    {
      pregunta: "Después de todo el camino: ¿qué es lo que hace que una consulta mal escrita sea peligrosa?",
      opciones: [
        {
          texto: "Que casi nunca se rompe: devuelve otra cosa, y otra cosa se cuela.",
          correcta: true,
          porque: "Un aon mal trazado no explota: no hace nada, o hace otra cosa. De ahí que el oficio no sea arreglar errores -de esos hay pocos y son claros- sino **reconocer síntomas**: una fila que falta, un cero que sale como uno, unos totales que suman de más. Y por eso las tres cuentas valen más que releer la consulta.",
        },
        {
          texto: "Que los mensajes de error de las bases de datos son difíciles de entender.",
          porque: "Algunos lo son -«FOREIGN KEY constraint failed» no dice cuál- y esos al menos avisan. Los peligrosos son los que no dan ningún mensaje.",
        },
        {
          texto: "Que SQL es un lenguaje antiguo con una sintaxis poco estricta.",
          porque: "La sintaxis es de las más estrictas que hay: una cláusula fuera de sitio no compila. Lo que no comprueba es el **significado**, y eso no es cosa de la edad del lenguaje.",
        },
      ],
    },
  ],
}
