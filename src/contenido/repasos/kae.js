/**
 * Las preguntas del repaso de «kae».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-kae",
  mundo: "kae",
  quien: "sarene",
  titulo: "El caso de Kae",
  preguntas: [
    {
      pregunta: "¿Qué recorta `SELECT` y qué recorta `WHERE`?",
      opciones: [
        {
          texto: "`SELECT` elige columnas y `WHERE` elige filas.",
          correcta: true,
          porque: "Eso es, y es la frase que hay que llevarse de este mundo. Recortan la respuesta por lados distintos: uno estrecha cada fila y el otro tira filas enteras. Se pueden usar los dos, uno solo o ninguno.",
        },
        {
          texto: "Los dos eligen filas; `SELECT` las primeras y `WHERE` las que cumplen la condición.",
          porque: "`SELECT` no sabe nada de filas. Quedarse con las primeras es cosa de `LIMIT`, y para que eso signifique algo hace falta un `ORDER BY` delante.",
        },
        {
          texto: "`SELECT` elige filas y `WHERE` elige columnas.",
          porque: "Al revés. Es la confusión más común al empezar y merece la pena fijarla: detrás de `SELECT` van nombres de columna, detrás de `WHERE` va una condición.",
        },
      ],
    },
    {
      pregunta: "Una consulta con `WHERE` devuelve cinco de las diez filas. ¿Qué le ha pasado a la tabla?",
      opciones: [
        {
          texto: "Nada: sigue teniendo diez filas. Una consulta mira, no toca.",
          correcta: true,
          porque: "Lo que devuelve una consulta es una respuesta, no un trozo de la tabla. Puedes ejecutar `SELECT` mil veces, equivocándote todo lo que quieras, y no cambia nada. Las palabras que sí cambian las tablas son otras y llegan mucho más adelante.",
        },
        {
          texto: "Se ha quedado con cinco: las que no cumplían la condición se han descartado.",
          porque: "Eso sería una catástrofe, y por suerte no es así. Confundir «lo que sale» con «lo que hay» es lo que hace que la gente tenga miedo de probar consultas, y aquí probar es gratis.",
        },
        {
          texto: "Depende de si la consulta lleva `LIMIT`.",
          porque: "El `LIMIT` corta la respuesta, no la tabla. Ninguna cláusula de las cinco de este mundo toca los datos guardados.",
        },
      ],
    },
    {
      pregunta: "¿Por qué `SELECT *` es una mala costumbre para dejarla escrita?",
      opciones: [
        {
          texto: "Porque no pides unas columnas: pides las que haya, así que la consulta cambia sola cuando la tabla cambie.",
          correcta: true,
          porque: "Ese es el motivo de fondo. Trae datos de más y no se lee, que ya son dos razones, pero la grave es la tercera: el día que alguien añada una columna, tu consulta empieza a devolver algo distinto sin que nadie la haya tocado. Una consulta que cambia por su cuenta es una consulta en la que no se puede confiar.",
        },
        {
          texto: "Porque el asterisco es más lento de escribir que los nombres de las columnas.",
          porque: "Es justo lo contrario: es más rápido de escribir, y por eso hay que quitárselo de encima a propósito. La comodidad es exactamente el problema.",
        },
        {
          texto: "Porque no funciona si la tabla tiene más de cinco columnas.",
          porque: "Funciona siempre. Ojalá diera error: sería mucho más fácil de detectar.",
        },
      ],
    },
    {
      pregunta: "Sin `ORDER BY`, ¿en qué orden salen las filas?",
      opciones: [
        {
          texto: "En ninguno prometido. Hoy pueden salir en el orden en que se metieron, y mañana no.",
          correcta: true,
          porque: "Y es la que más cuesta creerse, porque durante meses las vas a ver salir en el orden de la tabla. La base no lo promete: puede devolverlas como le convenga, y lo que le convenga cambia cuando la tabla crece, cuando aparece un índice o cuando se actualiza de versión. Si el orden importa, se pide.",
        },
        {
          texto: "Siempre por la clave primaria, de menor a mayor.",
          porque: "Suele coincidir, y de ahí sale la confusión. Coincidir no es lo mismo que estar garantizado, y el día que deje de coincidir tu informe sale desordenado sin que nadie haya tocado nada.",
        },
        {
          texto: "Por la primera columna del `SELECT`.",
          porque: "No. El `SELECT` decide qué columnas salen y en qué orden salen las columnas; del orden de las filas no dice nada.",
        },
      ],
    },
    {
      pregunta: "`LIMIT 3` sin `ORDER BY` delante devuelve…",
      opciones: [
        {
          texto: "Tres filas cualesquiera.",
          correcta: true,
          porque: "Porque cuando el `LIMIT` trabaja, lo que tiene delante no está ordenado por nada en concreto. «Los tres primeros» solo significa algo si antes has dicho primeros según qué. Por eso `LIMIT` y `ORDER BY` van casi siempre juntos.",
        },
        {
          texto: "Las tres primeras de la tabla.",
          porque: "«Las tres primeras de la tabla» no es una cosa que exista: una tabla no tiene un orden propio. Es la misma trampa de la pregunta anterior, vista desde el otro lado.",
        },
        {
          texto: "Un error, porque `LIMIT` necesita un `ORDER BY`.",
          porque: "Ojalá. Funciona perfectamente y devuelve tres filas, y esa es la razón de que el fallo se cuele: no hay ninguna señal de que algo vaya mal.",
        },
      ],
    },
    {
      pregunta: "¿Qué hace `WHERE barrio = \"Kae\"`, con comillas dobles?",
      opciones: [
        {
          texto: "Compara la columna `barrio` con una columna llamada `Kae`, que no existe, así que da error.",
          correcta: true,
          porque: "En SQL las comillas simples son para los textos y las dobles para nombrar columnas. Lo peor no es el error: es que el error habla de una columna que no encuentra, así que quien lo lee se pone a revisar el `barrio` cuando el problema estaba dos caracteres más allá.",
        },
        {
          texto: "Lo mismo que con comillas simples: en SQL las dos clases valen para textos.",
          porque: "Eso es cierto en otros lenguajes y aquí no. Es de las diferencias que hay que pagar una vez y aprender para siempre.",
        },
        {
          texto: "Compara sin distinguir mayúsculas, porque las dobles son más flexibles.",
          porque: "Las comillas no tienen nada que ver con las mayúsculas. Lo que sí distingue mayúsculas es el `=` sobre textos; el que no las distingue, en SQLite, es el `LIKE`.",
        },
      ],
    },
    {
      pregunta: "`WHERE a = 1 OR b = 2 AND c = 3`. ¿Cómo lo entiende la base?",
      opciones: [
        {
          texto: "Como `a = 1 OR (b = 2 AND c = 3)`: el `AND` aprieta más.",
          correcta: true,
          porque: "Igual que el por antes que el más en las cuentas. Y es un fallo que no da ningún error: devuelve filas, las filas son creíbles y son las equivocadas. La regla práctica: en cuanto haya un `AND` y un `OR` en el mismo `WHERE`, se ponen paréntesis. No son para la base, que ya lo sabe: son para quien lea la consulta después.",
        },
        {
          texto: "Como `(a = 1 OR b = 2) AND c = 3`: se resuelve de izquierda a derecha.",
          porque: "Es lo que casi todo el mundo lee, y de ahí sale el fallo. No se resuelve por orden de aparición: hay una precedencia, y el `AND` va primero.",
        },
        {
          texto: "Da error: hay que poner paréntesis obligatoriamente.",
          porque: "Ojalá fuera obligatorio. Funciona sin ellos, y ese es el problema.",
        },
      ],
    },
    {
      pregunta: "En `SELECT edad AS anos FROM habitantes WHERE anos > 30`, ¿por qué falla el `WHERE`?",
      opciones: [
        {
          texto: "Porque el `WHERE` trabaja antes que el `SELECT`, y cuando le toca ese nombre todavía no existe.",
          correcta: true,
          porque: "El orden en que se escriben las cláusulas y el orden en que la base trabaja no son el mismo: `FROM`, `WHERE`, `SELECT`, `ORDER BY`, `LIMIT`. Con esa lista en la cabeza se entiende también por qué el `ORDER BY` sí puede usar el alias: él va después del `SELECT`.",
        },
        {
          texto: "Porque los alias solo valen para columnas calculadas, no para columnas de la tabla.",
          porque: "Valen para las dos. Lo que decide si se pueden usar no es qué columna sea, es en qué cláusula estés.",
        },
        {
          texto: "Porque falta repetir el `AS` en el `WHERE`.",
          porque: "El `AS` se pone una vez, en el `SELECT`. El problema no es cómo está escrito el alias: es cuándo existe.",
        },
      ],
    },
    {
      pregunta: "¿Qué encuentra `WHERE nombre LIKE '%'`?",
      opciones: [
        {
          texto: "Todas las filas: `%` vale por cualquier trozo de texto, incluso por ninguno.",
          correcta: true,
          porque: "Que el comodín acepte «nada» es lo que se olvida, y tiene consecuencias útiles: `'Aon%'` encuentra también algo que se llamara exactamente «Aon». Y una trampa: un patrón demasiado abierto encuentra de más, y las filas de más también son creíbles.",
        },
        {
          texto: "Solo las filas cuyo nombre sea exactamente el carácter `%`.",
          porque: "Eso es lo que haría un `=`. Sin `LIKE` los comodines no son comodines, son símbolos normales: `WHERE nombre = '%'` sí busca ese carácter literal.",
        },
        {
          texto: "Ninguna, porque `%` necesita algún carácter alrededor.",
          porque: "No necesita nada alrededor. El que cuenta caracteres es el otro comodín, `_`, y ese exige uno exacto por cada guion bajo que pongas.",
        },
      ],
    },
  ],
}
