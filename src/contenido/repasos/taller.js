/**
 * Las preguntas del repaso de «taller».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-taller",
    mundo: "taller",
    titulo: "El caso del oficio",
    preguntas: [
      {
        pregunta: "En un método de una clase, ¿qué es `this`?",
        opciones: [
          {
            texto: "El objeto concreto sobre el que se llamó al método.",
            correcta: true,
            porque: "En `arma.disparar()`, `this` es `arma`. Por eso un solo método escrito una vez sirve para todos los objetos de esa clase.",
          },
          {
            texto: "La clase.",
            porque: "La clase es el molde. `this` es la pieza concreta que salió del molde, y cada una tiene sus propios datos.",
          },
          {
            texto: "Siempre el mismo objeto durante todo el programa.",
            porque: "Cambia en cada llamada. Ese es justamente el mecanismo que hace que las clases sirvan para algo.",
          },
        ],
      },
      {
        pregunta: "¿Por qué `super(...)` tiene que ir antes de tocar `this` en el constructor de una clase hija?",
        opciones: [
          {
            texto: "Porque hasta que el constructor del padre no termina, el objeto no está construido y `this` no existe todavía.",
            correcta: true,
            porque: "JavaScript no lo deja pasar: da un error directamente. No es una convención de estilo, es una regla del lenguaje.",
          },
          {
            texto: "Por legibilidad: queda más ordenado poner primero lo heredado.",
            porque: "Queda más ordenado, sí, pero no es opcional. Ponerlo después no es feo: es un error de ejecución.",
          },
          {
            texto: "No hace falta: `super` puede ir en cualquier sitio del constructor.",
            porque: "Pruébalo y verás el error. Tiene que ir antes de la primera vez que aparezca `this`.",
          },
        ],
      },
      {
        pregunta: "¿Cuándo conviene lanzar un error en vez de devolver `null`?",
        opciones: [
          {
            texto: "Cuando quien llama no puede seguir razonablemente sin ese valor.",
            correcta: true,
            porque: "Un `null` que nadie mira viaja hacia dentro y revienta lejos del origen. El error para en el sitio exacto y con el motivo puesto.",
          },
          {
            texto: "Siempre: devolver `null` es una mala práctica.",
            porque: "`null` está bien cuando «no hay nada» es un resultado normal y esperado, como una búsqueda que no encuentra.",
          },
          {
            texto: "Nunca, porque los errores paran el programa.",
            porque: "Solo lo paran si nadie los recoge, y para eso está `try/catch`. Un error recogido es más información, no menos.",
          },
        ],
      },
      {
        pregunta: "`const b = a` donde `a` es una lista. ¿Qué pasa si haces `b.push(1)`?",
        opciones: [
          {
            texto: "`a` también cambia: los dos nombres apuntan a la misma lista.",
            correcta: true,
            porque: "De las listas y los objetos se copia la dirección, no el contenido. Para una copia de verdad hay que pedirla: `[...a]`.",
          },
          {
            texto: "Solo cambia `b`, porque la asignación hizo una copia.",
            porque: "Eso pasa con números y textos. Con listas y objetos no, y esta diferencia es la causa de una cantidad enorme de tardes perdidas.",
          },
          {
            texto: "Da error, porque `b` es `const`.",
            porque: "`const` protege el nombre, no el contenido. `b = otraLista` daría error; `b.push(1)` no.",
          },
        ],
      },
      {
        pregunta: "¿Qué devuelve `[...lista].sort((a, b) => b - a)` y qué le pasa a `lista`?",
        opciones: [
          {
            texto: "Una lista nueva de mayor a menor, y `lista` se queda como estaba.",
            correcta: true,
            porque: "`sort` ordena la lista que le des, pero le estamos dando la copia. Y `b - a` da positivo cuando `b` es mayor, o sea, orden descendente.",
          },
          {
            texto: "Una lista nueva de menor a mayor, y `lista` se queda como estaba.",
            porque: "La copia sí protege el original, pero el orden está al revés: `b - a` es descendente. `a - b` sería de menor a mayor.",
          },
          {
            texto: "Una lista nueva de mayor a menor, y `lista` también queda ordenada.",
            porque: "`lista` no se toca precisamente por los tres puntos. Sin ellos sí quedaría ordenada, y ese es el fallo que los corchetes evitan.",
          },
        ],
      },
      {
        pregunta: "¿Para qué sirve de verdad un cierre?",
        opciones: [
          {
            texto: "Para que unos datos sobrevivan a la función que los creó y solo se puedan tocar por las funciones que tú decidas.",
            correcta: true,
            porque: "Es la base de los datos privados en JavaScript, y también de lo que hacen los composables de Vue: estado que vive dentro y solo sale por donde tú abres.",
          },
          {
            texto: "Para escribir funciones más cortas.",
            porque: "No tiene nada que ver con la longitud. Tiene que ver con qué recuerda una función y quién puede tocarlo.",
          },
          {
            texto: "Para que una función pueda llamarse a sí misma.",
            porque: "Eso es la recursión, que es otra cosa. Un cierre no se llama a sí mismo: recuerda variables de fuera.",
          },
        ],
      },
    ],
  }
