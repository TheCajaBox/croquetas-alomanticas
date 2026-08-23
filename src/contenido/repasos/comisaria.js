/**
 * Las preguntas del repaso de «comisaria».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-comisaria",
    mundo: "comisaria",
    titulo: "El caso de los cimientos",
    preguntas: [
      {
        pregunta: "¿Por qué se recomienda `===` y no `==`?",
        opciones: [
          {
            texto: "Porque `==` convierte los valores antes de comparar, y las reglas de conversión son largas y sorprendentes.",
            correcta: true,
            porque: "`0 == ''` da `true`, y `'0' == false` también. Nadie se sabe la tabla entera, así que lo práctico es no depender de ella.",
          },
          {
            texto: "Porque `==` es más lento.",
            porque: "La diferencia de velocidad es irrelevante. El problema no es el tiempo, es que da resultados que no esperabas.",
          },
          {
            texto: "Porque `==` está obsoleto y da error en el JavaScript moderno.",
            porque: "Sigue siendo válido y funciona. No es que no se pueda: es que casi nunca conviene.",
          },
        ],
      },
      {
        pregunta: "¿Cuál de estos vale `true`: `Boolean([])`, `Boolean('')` o `Boolean(0)`?",
        opciones: [
          {
            texto: "`Boolean([])`, porque una lista vacía sigue siendo un objeto.",
            correcta: true,
            porque: "Los falsos son solo seis: `false`, `0`, `''`, `null`, `undefined` y `NaN`. La lista vacía no está en esa lista, aunque no tenga nada dentro.",
          },
          {
            texto: "Ninguno: los tres están vacíos, así que los tres son falsos.",
            porque: "«Vacío» no es un concepto que JavaScript aplique a los objetos. `[]` y `{}` son verdaderos, y es de las cosas que más despistan al principio.",
          },
          {
            texto: "`Boolean('')`, porque un texto siempre es verdadero.",
            porque: "Al revés: el texto **vacío** es de los seis falsos. Cualquier otro texto, incluido `'0'` y `'false'`, es verdadero.",
          },
        ],
      },
      {
        pregunta: "En una lista de 4 elementos, ¿qué devuelve `lista[4]`?",
        opciones: [
          {
            texto: "`undefined`, sin dar ningún error.",
            correcta: true,
            porque: "Se cuenta desde 0, así que las posiciones son 0, 1, 2 y 3. La 4 está vacía, y pedirla no protesta: devuelve `undefined` y sigue.",
          },
          {
            texto: "El último elemento.",
            porque: "El último está en `lista[3]`, o en general en `lista[lista.length - 1]`. Ese uno de diferencia es el error más repetido de la profesión.",
          },
          {
            texto: "Un error de índice fuera de rango.",
            porque: "Eso hacen otros lenguajes. JavaScript se encoge de hombros y devuelve `undefined`, que es más traicionero: el fallo aparece más tarde y en otro sitio.",
          },
        ],
      },
      {
        pregunta: "¿Por qué el acumulador de un bucle se declara **fuera** del bucle?",
        opciones: [
          {
            texto: "Porque si se declara dentro se crea nuevo en cada vuelta y se pierde lo acumulado.",
            correcta: true,
            porque: "Cada vuelta abriría una variable nueva a cero. Al acabar tendrías solo el último valor, no la suma.",
          },
          {
            texto: "Porque dentro del bucle no se pueden declarar variables.",
            porque: "Sí se pueden, y se hace constantemente. El problema no es que no se pueda, es que no sobrevive a la vuelta.",
          },
          {
            texto: "Por costumbre: da lo mismo dónde se ponga.",
            porque: "No da lo mismo. Cámbialo de sitio y el resultado cambia, que es la definición de que importa.",
          },
        ],
      },
      {
        pregunta: "Tienes que guardar el nombre, el alias y la recompensa de un sospechoso. ¿Lista u objeto?",
        opciones: [
          {
            texto: "Un objeto, porque cada dato significa una cosa distinta.",
            correcta: true,
            porque: "Con un objeto cada dato lleva su etiqueta: `sospechoso.alias`. En una lista tendrías que acordarte de que el alias era la posición 1.",
          },
          {
            texto: "Una lista, porque son tres datos del mismo sospechoso.",
            porque: "Ser del mismo sospechoso no los hace del mismo tipo. La lista es para muchos elementos equivalentes; aquí cada hueco significa otra cosa.",
          },
          {
            texto: "Da igual: las dos guardan tres valores.",
            porque: "Guardar, guardan las dos. Pero dentro de seis meses `sospechoso[1]` no te va a decir nada y `sospechoso.alias` sí, y eso es la mitad del oficio.",
          },
        ],
      },
      {
        pregunta: "`const nombre = '  wax  '` y luego `nombre.trim()`. ¿Qué vale `nombre`?",
        opciones: [
          {
            texto: "Sigue valiendo `'  wax  '`: `trim` devuelve un texto nuevo y no cambia el original.",
            correcta: true,
            porque: "Los textos son inmutables. Todos sus métodos fabrican uno nuevo, y si no recoges el resultado se pierde.",
          },
          {
            texto: "`'wax'`, porque `trim` le quita los espacios.",
            porque: "Se los quita al texto que devuelve, no al que le pasaste. Llamar a `.trim()` y no guardar el resultado es un fallo clásico.",
          },
          {
            texto: "Da error, porque `nombre` es `const`.",
            porque: "`const` impediría `nombre = otra cosa`, pero aquí nadie asigna nada. `trim` solo lee.",
          },
        ],
      },
    ],
  }
