/**
 * Las preguntas del repaso de «elendel».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-elendel",
    mundo: "elendel",
    titulo: "El caso de la ciudad",
    preguntas: [
      {
        pregunta: "Llega un texto de un servidor y haces `JSON.parse(texto)`. ¿Qué pasa si el texto está roto?",
        opciones: [
          {
            texto: "Lanza un error, así que hay que envolverlo en un `try`.",
            correcta: true,
            porque: "`JSON.parse` no avisa devolviendo nada: rompe el programa. Y los datos de fuera vienen rotos más de lo que nadie confiesa, así que todo `parse` de algo que no controlas va dentro de un `try`.",
          },
          {
            texto: "Devuelve `null`, y basta con comprobarlo.",
            porque: "Eso sería cómodo y no es lo que hace. Ojo además con que `JSON.parse('null')` sí devuelve `null` sin error, así que comprobar por `null` mezcla dos casos distintos.",
          },
          {
            texto: "Devuelve un objeto vacío con lo que haya podido leer.",
            porque: "No hay lectura parcial: o el texto entero es JSON válido o no lo es.",
          },
          {
            texto: "Depende del navegador.",
            porque: "Está en el estándar y todos hacen lo mismo. Lo que sí cambia entre navegadores es el texto exacto del mensaje de error.",
          },
        ],
      },
      {
        pregunta: "¿Qué diferencia hay entre `export default` y una exportación con nombre?",
        opciones: [
          {
            texto: "Lo que va por defecto se importa sin llaves y se le puede poner el nombre que quieras.",
            correcta: true,
            porque: "Y por eso conviene no abusar de ella: si cada archivo la llama de una forma, buscar dónde se usa algo se vuelve difícil. Lo que va con nombre se importa entre llaves y con su nombre exacto.",
          },
          {
            texto: "La de por defecto es más rápida de cargar.",
            porque: "No hay ninguna diferencia de velocidad. La elección es de legibilidad, no de rendimiento.",
          },
          {
            texto: "Solo se puede usar una de las dos formas por archivo.",
            porque: "Se pueden mezclar sin problema: un `default` y todas las exportaciones con nombre que quieras, y se importan juntas en la misma línea.",
          },
          {
            texto: "La de por defecto no se puede renombrar al importarla.",
            porque: "Es justo al revés: la de por defecto se llama como quien la importa decida, y la que tiene nombre necesita un `as` para cambiárselo.",
          },
        ],
      },
      {
        pregunta: "Quieres subir un 50% todos los valores de `{ acero: 12, peltre: 30 }` y que siga siendo un objeto. ¿Cómo?",
        opciones: [
          {
            texto: "`Object.fromEntries(Object.entries(precios).map(([k, v]) => [k, v * 1.5]))`",
            correcta: true,
            porque: "Ese es el patrón: convertir a lista de pares, transformar cada par en otro par, y reconstruir. La clave está en que el `map` tiene que devolver **un par**, no solo el valor.",
          },
          {
            texto: "`precios.map((v) => v * 1.5)`",
            porque: "Un objeto no tiene `map`: eso es de las listas. Da `TypeError: precios.map is not a function`.",
          },
          {
            texto: "`Object.values(precios).map((v) => v * 1.5)`",
            porque: "Eso da `[18, 45]`, una lista sin las claves. Ha perdido qué metal era cada precio, que es justo lo que había que conservar.",
          },
          {
            texto: "`Object.entries(precios).map(([k, v]) => [k, v * 1.5])`",
            porque: "Casi: eso deja una lista de pares. Falta el `Object.fromEntries` que la vuelve a convertir en objeto.",
          },
        ],
      },
      {
        pregunta: "`cartel.match(/recompensa: (\\d+)/)` sobre un cartel que no lleva recompensa. ¿Qué devuelve?",
        opciones: [
          {
            texto: "`null`, y leerle `[1]` a eso revienta.",
            correcta: true,
            porque: "Ese `null` es medio ejercicio de cualquier búsqueda con expresiones regulares. Hay que comprobarlo antes de sacar el grupo, siempre.",
          },
          {
            texto: "Una lista vacía.",
            porque: "Sería más cómodo, porque `[]` no revienta al pedirle `[1]` —da `undefined`—. Pero devuelve `null`.",
          },
          {
            texto: "El texto entero sin cambios.",
            porque: "Eso es lo que hace `replace` cuando no encuentra nada. `match` devuelve lo encontrado, o `null`.",
          },
          {
            texto: "`undefined`.",
            porque: "Se parece y no es lo mismo. Los dos revientan al pedirles una propiedad, pero conviene distinguirlos al leer un error.",
          },
        ],
      },
      {
        pregunta: "¿Por qué `0.1 + 0.2 === 0.3` es falso?",
        opciones: [
          {
            texto: "Porque los decimales se guardan en binario y 0,1 no cabe exacto.",
            correcta: true,
            porque: "Igual que un tercio no cabe exacto en decimal. Pasa en casi todos los lenguajes, y por eso el dinero se guarda en céntimos enteros y no en euros con decimales.",
          },
          {
            texto: "Porque es un fallo conocido de JavaScript.",
            porque: "No es de JavaScript: es del estándar de coma flotante que usan casi todos los lenguajes. Lo que sí es de JavaScript es que no puedas escaparte eligiendo otro tipo de número.",
          },
          {
            texto: "Porque `===` compara también el tipo, y uno es entero y otro decimal.",
            porque: "En JavaScript solo hay un tipo de número: no existen «entero» y «decimal» por separado. Y `0.1 + 0.2` da `0.30000000000000004`, que es otro número.",
          },
          {
            texto: "Porque hay que usar `==` para comparar decimales.",
            porque: "`==` daría exactamente lo mismo, y de paso traería sus propios problemas de conversión. La forma de comparar decimales es con un margen.",
          },
        ],
      },
      {
        pregunta: "¿Cuál se escribe antes, `setTimeout(f, 0)` o `Promise.resolve().then(g)`, si están seguidos?",
        opciones: [
          {
            texto: "Primero `g`: las promesas tienen su propia cola y es prioritaria.",
            correcta: true,
            porque: "Al acabar el cuerpo se vacía **entera** la cola de microtareas —donde van las promesas y lo que sigue a un `await`— y solo después se coge una tarea de la otra cola, donde están los temporizadores.",
          },
          {
            texto: "Primero `f`, porque su línea está escrita antes.",
            porque: "El orden del código no manda aquí: ninguna de las dos ejecuta nada en su línea. Las dos apuntan algo para después, en colas distintas.",
          },
          {
            texto: "A la vez, porque los dos están pendientes.",
            porque: "JavaScript hace una cosa a la vez, siempre. Nunca hay dos trozos de tu código corriendo en paralelo.",
          },
          {
            texto: "Depende de cuánto tarde el cuerpo del programa.",
            porque: "El cuerpo retrasa a las dos por igual, pero no cambia el orden entre ellas: las microtareas van antes pase lo que pase.",
          },
        ],
      },
    ],
  }
