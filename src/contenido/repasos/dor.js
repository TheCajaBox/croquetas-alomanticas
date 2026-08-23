/**
 * Las preguntas del repaso de «dor».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-dor",
  mundo: "dor",
  quien: "sarene",
  titulo: "El caso del Dor",
  preguntas: [
    {
      pregunta: "¿Cuánto vale `1 <> NULL`?",
      opciones: [
        {
          texto: "Desconocido, así que ninguna condición lo deja pasar.",
          correcta: true,
          porque: "Un nulo no es «vacío»: es «no lo sé». ¿Es uno distinto de algo que no sé cuál es? No se puede decir. Y las cláusulas que filtran solo dejan pasar lo verdadero, así que el desconocido se comporta como falso al filtrar. De ahí sale todo lo demás del nulo.",
        },
        {
          texto: "Verdadero: uno no es igual a nada, así que es distinto.",
          porque: "Es el razonamiento natural y no es el de SQL. Para poder decir que dos cosas son distintas hay que saber cuáles son las dos, y aquí no se sabe una.",
        },
        {
          texto: "Falso, porque comparar con nulo siempre da falso.",
          porque: "Casi, y la diferencia importa: da **desconocido**, no falso. Al filtrar se comporta igual, y al negar no: lo contrario de desconocido sigue siendo desconocido, mientras que lo contrario de falso es verdadero.",
        },
      ],
    },
    {
      pregunta: "`WHERE gremio_id <> 1` sobre nueve puestos, tres de ellos del gremio 1 y uno sin gremio. ¿Cuántas filas?",
      opciones: [
        {
          texto: "Cinco: el que no tiene gremio también se queda fuera.",
          correcta: true,
          porque: "Su comparación vale desconocido y no pasa. Es el fallo silencioso más común con nulos: la consulta parece decir «todos los que no son del gremio 1» y se deja uno. Para incluirlo hay que escribirlo: `WHERE gremio_id <> 1 OR gremio_id IS NULL`.",
        },
        {
          texto: "Seis: los cinco de otros gremios más el que no tiene ninguno.",
          porque: "Eso es lo que uno espera leyendo la condición en español, y es la razón de que este fallo se cuele. La fila del nulo no pasa ninguna comparación, ni afirmativa ni negada.",
        },
        {
          texto: "Cero, porque hay un nulo en la columna.",
          porque: "Un nulo en la columna solo afecta a **su** fila. Lo que tira todas las filas es un nulo dentro de la lista de un `NOT IN`, que es otra cosa y tiene su pregunta.",
        },
      ],
    },
    {
      pregunta: "¿Por qué `WHERE id NOT IN (SELECT gremio_id FROM puestos)` no devuelve nunca ninguna fila?",
      opciones: [
        {
          texto: "Porque la subconsulta devuelve un nulo, y `NOT IN` con un nulo en la lista no puede ser verdadero para nadie.",
          correcta: true,
          porque: "`x NOT IN (a, b, NULL)` es `x <> a AND x <> b AND x <> NULL`, y el último trozo vale desconocido siempre. Un `AND` con un desconocido dentro no llega a verdadero. Lo peor: la versión afirmativa con `IN` **sí** funciona, porque se traduce con `OR`. La regla: con subconsulta, `NOT EXISTS`.",
        },
        {
          texto: "Porque `NOT IN` no admite subconsultas, solo listas escritas a mano.",
          porque: "Las admite perfectamente. El problema no es la sintaxis, es lo que la subconsulta trae dentro.",
        },
        {
          texto: "Porque `gremio_id` es una clave ajena y no se puede comparar con una clave primaria.",
          porque: "Se compara todo el rato: es lo que hace un `JOIN`. Lo que pasa es que las claves ajenas **admiten nulos**, y ahí está el problema.",
        },
      ],
    },
    {
      pregunta: "Una subconsulta en un `WHERE` comparada con `>`. ¿Cuántas filas puede devolver?",
      opciones: [
        {
          texto: "Una sola, y una sola columna. Si devuelve más, la base da error.",
          correcta: true,
          porque: "Se llama subconsulta escalar y se usa donde iría un número. Que dé error si devuelve más es una suerte: el fallo aparece a la primera y con un mensaje claro. Con `IN` en cambio puede devolver muchas, porque ahí es una lista.",
        },
        {
          texto: "Cualquier número: la base compara con la primera.",
          porque: "Eso sería mucho peor que un error, porque no avisaría. Ninguna base hace eso con una comparación escalar.",
        },
        {
          texto: "Ninguna: en un `WHERE` las subconsultas solo valen con `IN` o `EXISTS`.",
          porque: "Valen también comparadas, y es la forma más usada de todas: `> (SELECT AVG(...))`.",
        },
      ],
    },
    {
      pregunta: "¿Qué gana un `WITH` respecto a escribir la misma subconsulta dentro del `FROM`?",
      opciones: [
        {
          texto: "Que se lee y se puede tocar: los pasos tienen nombre, se encadenan y se pueden ejecutar por separado.",
          correcta: true,
          porque: "No suele ganar velocidad -la base muchas veces lo trata igual-, y gana algo mejor: una consulta de cuatro pasos con nombre se corrige cambiando un paso. Y hay un efecto de fondo: **cambia la unidad de la fila**, así que en el paso siguiente los agregados dejan de necesitar `DISTINCT`.",
        },
        {
          texto: "Que se calcula una sola vez y se guarda, así que va más rápido.",
          porque: "Depende de la base y de la consulta: SQLite decide, y en algunas se puede pedir lo uno o lo otro. Dar por hecho que se materializa es una de esas cosas que se creen y no están escritas.",
        },
        {
          texto: "Que permite hacer cosas que una subconsulta no puede.",
          porque: "Salvo la recursividad -`WITH RECURSIVE`, que es otro asunto- hacen lo mismo. La diferencia está en quién lo lee.",
        },
      ],
    },
    {
      pregunta: "¿Qué distingue una función de ventana de un `GROUP BY`?",
      opciones: [
        {
          texto: "Que no reduce filas: salen todas, y cada una trae además el dato calculado sobre su grupo.",
          correcta: true,
          porque: "La pregunta que decide cuál usar es una sola: ¿quiero menos filas o las mismas con un dato más? Menos filas es `GROUP BY`; las mismas con un dato más es una ventana. Y a veces hacen falta las dos, en dos pasos.",
        },
        {
          texto: "Que es más rápida, porque no tiene que agrupar.",
          porque: "Tiene que ordenar y recorrer igual, y no es la razón para elegirla. Se elige por lo que devuelve.",
        },
        {
          texto: "Que puede usar columnas que no están en el `GROUP BY`.",
          porque: "Eso es un efecto de lo anterior: como no agrupa, no hay ninguna restricción de qué columnas se pueden pedir. Pero lo que la distingue es que no reduce filas.",
        },
      ],
    },
    {
      pregunta: "Quieres el puesto que más ha recaudado de cada gremio. ¿Cuál es la receta?",
      opciones: [
        {
          texto: "Numerar con `ROW_NUMBER() OVER (PARTITION BY gremio ORDER BY total DESC)` y filtrar el 1 desde fuera.",
          correcta: true,
          porque: "Y el «desde fuera» no es un detalle: una función de ventana se calcula después del `WHERE` de su propia consulta, así que hay que nombrar el paso con un `WITH` y filtrar en la consulta de arriba. La base lo dice con un error claro si lo intentas.",
        },
        {
          texto: "`SELECT gremio, nombre, MAX(total) ... GROUP BY gremio`.",
          porque: "Es la tentación, y `MAX` devuelve un **valor**, no una fila: el nombre que sale al lado puede ser de otro puesto. Casi todas las bases dan error; SQLite lo acepta y a veces acierta, que es peor.",
        },
        {
          texto: "Numerar y poner `WHERE sitio = 1` en la misma consulta.",
          porque: "Ahí está el detalle que hay que recordar: no se puede, porque cuando el `WHERE` trabaja la ventana no se ha calculado. Hace falta el paso intermedio.",
        },
      ],
    },
    {
      pregunta: "Dos ventas empatadas a 120 monedas. ¿Qué numeración les da `RANK` y qué le da a la siguiente?",
      opciones: [
        {
          texto: "A las dos el 2, y a la siguiente el 4: repite y salta.",
          correcta: true,
          porque: "Como en una carrera: si hay dos segundos, no hay tercero. `DENSE_RANK` repite y no salta -a la siguiente le da el 3-, y `ROW_NUMBER` no repite: 2 y 3, y cuál es cuál no está prometido si no desempatas a mano.",
        },
        {
          texto: "A las dos el 2, y a la siguiente el 3: no deja huecos.",
          porque: "Eso es `DENSE_RANK`. La diferencia entre las dos está exactamente en lo que viene después del empate.",
        },
        {
          texto: "El 2 y el 3, porque ninguna numeración repite.",
          porque: "Eso es `ROW_NUMBER`, que es la única que no repite. Las otras dos les dan el mismo número a los empatados.",
        },
      ],
    },
    {
      pregunta: "`SUM(monedas) OVER (ORDER BY id)`. ¿Qué devuelve en cada fila?",
      opciones: [
        {
          texto: "La suma desde la primera fila hasta esa: un acumulado.",
          correcta: true,
          porque: "El `ORDER BY` dentro del `OVER` hace que la ventana sea «desde el principio hasta esta fila» en vez de todo el montón. Con `OVER ()` a secas devolvería el total en todas las filas, que también sirve -para calcular porcentajes sobre el total sin una subconsulta-.",
        },
        {
          texto: "El total de la tabla, igual en todas las filas.",
          porque: "Eso es `OVER ()` sin orden. Añadir el `ORDER BY` es lo que convierte la suma en un acumulado, y es la única diferencia entre las dos.",
        },
        {
          texto: "La suma de su grupo, como un `GROUP BY`.",
          porque: "Para tener grupos hace falta un `PARTITION BY`, y aun así seguirían saliendo todas las filas. Una ventana no agrupa: anota.",
        },
      ],
    },
  ],
}
