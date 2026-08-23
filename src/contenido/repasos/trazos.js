/**
 * Las preguntas del repaso de «trazos».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-trazos",
  mundo: "trazos",
  quien: "sarene",
  titulo: "El caso de los trazos",
  preguntas: [
    {
      pregunta: "¿Qué hace `UPDATE puestos SET abierto = 0;` sin `WHERE`?",
      opciones: [
        {
          texto: "Cambia todas las filas, y no da ningún error.",
          correcta: true,
          porque: "Es una orden perfectamente válida -hay veces en que cambiar la tabla entera es lo que se quiere- y la base no puede saber que se te ha olvidado media línea. De aquí sale la costumbre del mundo: escribir la condición primero en un `SELECT`, contar las filas, y solo entonces cambiar el verbo.",
        },
        {
          texto: "Da error, porque el `WHERE` es obligatorio al escribir.",
          porque: "Ninguna base lo exige. Algunos programas de consola avisan; la base, no.",
        },
        {
          texto: "Cambia la primera fila.",
          porque: "No existe esa regla. Sin condición se aplica a todas, igual que un `SELECT` sin `WHERE` devuelve todas.",
        },
      ],
    },
    {
      pregunta: "¿Por qué conviene nombrar las columnas en un `INSERT`?",
      opciones: [
        {
          texto: "Porque sin nombres, el día que la tabla gane una columna el `INSERT` deja de cuadrar -o cuadra en la columna equivocada-.",
          correcta: true,
          porque: "Sin nombres los valores van en el orden de la tabla, y ese orden cambia. Nombrarlas cuesta cinco palabras y la orden sigue significando lo mismo dentro de tres años. Es el mismo argumento que el de no usar `SELECT *`, por el otro lado.",
        },
        {
          texto: "Porque sin nombres la orden da error.",
          porque: "Funciona: `INSERT INTO tabla VALUES (...)` es válido. Que funcione es justamente lo que lo hace peligroso.",
        },
        {
          texto: "Porque así se pueden dejar columnas sin rellenar.",
          porque: "Eso es un efecto útil -las que no nombras se quedan con su valor por omisión o a nulo- y no es la razón principal. La razón es que la orden no dependa del orden de las columnas.",
        },
      ],
    },
    {
      pregunta: "Un `INSERT` choca con una restricción `UNIQUE`. ¿Qué pasa?",
      opciones: [
        {
          texto: "La orden falla entera y la tabla se queda como estaba.",
          correcta: true,
          porque: "Y eso es exactamente lo que se quiere de una restricción: mejor un error que un dato duplicado. El error se ve hoy, en la línea que lo causó; un dato roto se ve dentro de dos años, en un informe, cuando ya nadie sabe de dónde salió.",
        },
        {
          texto: "Mete la fila y avisa con un aviso.",
          porque: "No mete nada. Una restricción que se pudiera saltar avisando no sería una restricción.",
        },
        {
          texto: "Mete la fila cambiándole el valor repetido.",
          porque: "La base no inventa datos. Existe una forma de pedirle que sustituya la fila que había -`INSERT OR REPLACE`- y hay que pedirla a mano, sabiendo que borra la anterior.",
        },
      ],
    },
    {
      pregunta: "¿Cuál es la diferencia entre poner una regla en el esquema y comprobarla en el programa?",
      opciones: [
        {
          texto: "Quién la cumple: la del esquema la cumplen todos los programas que escriban ahí, para siempre.",
          correcta: true,
          porque: "Una regla en el programa la cumple ese programa; el otro que escribe en la misma tabla, no. Ni el trabajo nocturno que importa datos, ni el arreglo a mano de un martes por la noche. Y hay un argumento de fondo: **los datos duran más que los programas**. Eso no quita las comprobaciones del programa, que hacen falta para dar un mensaje decente.",
        },
        {
          texto: "La velocidad: la base las comprueba más rápido.",
          porque: "Puede ser cierto y es lo de menos. Lo que decide es la garantía, no el rendimiento.",
        },
        {
          texto: "Ninguna, si el programa está bien escrito.",
          porque: "El programa siempre está bien escrito hasta que se cambia. Y el que escriba en esa tabla dentro de tres años no va a leer tus validaciones: va a leer el esquema, si acaso.",
        },
      ],
    },
    {
      pregunta: "¿Para qué sirve una transacción, de verdad?",
      opciones: [
        {
          texto: "Para que varias órdenes pasen todas o ninguna. Y da tiempo a mirar antes de confirmar.",
          correcta: true,
          porque: "Un traspaso quitado de una cuenta y no puesto en la otra no es medio traspaso: es dinero perdido. Y ojo a lo segundo, que es lo que se olvida: **la transacción no evita el fallo, da tiempo a verlo**. Con el `COMMIT` escrito de antemano, la red no existe.",
        },
        {
          texto: "Para que las órdenes vayan más rápido, porque se envían juntas.",
          porque: "A veces va más rápido -escribir en el disco una vez en vez de cien- y no es para lo que está. Está para que los datos no queden a medias.",
        },
        {
          texto: "Para poder deshacer cambios en cualquier momento, incluso días después.",
          porque: "Solo hasta el `COMMIT`. Después está escrito, y para volver atrás hace falta una copia de seguridad, que es otra cosa.",
        },
      ],
    },
    {
      pregunta: "`DELETE FROM gremios WHERE id = 1` y ese gremio tiene puestos. ¿Qué pasa?",
      opciones: [
        {
          texto: "La orden falla: la clave ajena no deja dejar los puestos apuntando a nada.",
          correcta: true,
          porque: "Y eso es lo bueno de declararla. Sin ella se podría, y la tabla se quedaría con filas apuntando al vacío: datos que no se pueden arreglar sin adivinar. Se puede pedir otro comportamiento -`ON DELETE CASCADE` borra los hijos- y hay que decidirlo, no heredarlo: el `CASCADE` borra filas que no has nombrado.",
        },
        {
          texto: "Borra el gremio y sus puestos se quedan con el gremio a nulo.",
          porque: "Eso es lo que hace `ON DELETE SET NULL`, y hay que pedirlo. Por omisión, la orden falla.",
        },
        {
          texto: "Borra el gremio y sus puestos también.",
          porque: "Eso es `ON DELETE CASCADE`, y también hay que pedirlo. Es el que más sorpresas da cuando alguien lo pone sin pensarlo.",
        },
      ],
    },
    {
      pregunta: "¿Cuándo conviene crear un índice?",
      opciones: [
        {
          texto: "Cuando una consulta tarda, mirando su plan antes y después. Y casi siempre en las claves ajenas, que no lo llevan solas.",
          correcta: true,
          porque: "Un índice acelera las lecturas que puedan usarlo y encarece **todas** las escrituras. Las claves primarias y los `UNIQUE` ya traen el suyo -así que un índice sobre una columna que ya está en un `UNIQUE` por delante es trabajo de más-, y las claves ajenas en SQLite no, lo que es la causa número uno de `JOIN` lentos.",
        },
        {
          texto: "En todas las columnas por las que se busque alguna vez: acelera y no estorba.",
          porque: "Estorba: cada índice hay que mantenerlo en cada escritura, y ocupa espacio. Una tabla con ocho índices que nadie usa es una tabla en la que escribir cuesta ocho veces más de lo necesario.",
        },
        {
          texto: "Nunca hace falta: la base los crea sola donde los necesita.",
          porque: "Los crea para las claves primarias y para los `UNIQUE`, porque los necesita para comprobarlos. Para lo demás, no.",
        },
      ],
    },
    {
      pregunta: "En un plan de consulta, ¿qué significa `SCAN ventas`?",
      opciones: [
        {
          texto: "Que va a recorrer la tabla entera, fila por fila.",
          correcta: true,
          porque: "Con seis filas es instantáneo; con seis millones son seis millones de filas leídas. Lo contrario es `SEARCH … USING INDEX`, que va directo. Con esas dos palabras se entiende el ochenta por ciento de los planes.",
        },
        {
          texto: "Que va a usar un índice para buscar.",
          porque: "Eso es `SEARCH`. `SCAN` es justamente lo contrario, y es lo que se busca al mirar un plan: un `SCAN` sobre una tabla grande.",
        },
        {
          texto: "Que la consulta tiene un error de sintaxis.",
          porque: "Un plan solo se puede pedir de una consulta que la base entiende. Si hubiera un error de sintaxis, el `EXPLAIN QUERY PLAN` fallaría igual.",
        },
      ],
    },
    {
      pregunta: "Tienes que cerrar los puestos que no han vendido nada y borrar los apuntes de los cerrados. ¿En qué orden?",
      opciones: [
        {
          texto: "Cerrar primero: lo que decide mirando los datos va antes de lo que cambia esos datos.",
          correcta: true,
          porque: "Si borras primero, cuando llegues a cerrar habrá puestos que **parecerán** no haber vendido nada porque acabas de borrar sus apuntes, y cerrarías puestos que sí vendieron. Es la regla que vale para cualquier trámite de varios pasos, y cuando dos pasos se necesitan mutuamente hay que guardar antes lo que haga falta.",
        },
        {
          texto: "Da igual: dentro de una transacción las órdenes se aplican todas juntas al final.",
          porque: "Se aplican todas o ninguna, y **dentro** de la transacción se ejecutan en orden y cada una ve lo que hizo la anterior. La atomicidad es hacia fuera, no hacia dentro.",
        },
        {
          texto: "Borrar primero, para que el `UPDATE` tenga menos filas que mirar.",
          porque: "Ahorra un trabajo insignificante a cambio de cerrar los puestos equivocados. Y con seis filas no ahorra nada de nada.",
        },
      ],
    },
  ],
}
