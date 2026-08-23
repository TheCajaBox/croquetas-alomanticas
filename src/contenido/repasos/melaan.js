/**
 * Las preguntas del repaso de «melaan».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-melaan",
    mundo: "melaan",
    titulo: "El caso del cambio de forma",
    preguntas: [
      {
        pregunta: "¿Qué hace que refactorizar sea seguro?",
        opciones: [
          {
            texto: "Tener tests: cambias la forma, los ejecutas y sabes si el comportamiento se ha movido.",
            correcta: true,
            porque: "Sin tests, reescribir es apostar. Con ellos, es una operación mecánica.",
          },
          {
            texto: "Hacer los cambios muy pequeños.",
            porque: "Ayuda, pero sin red sigues sin saber si has roto algo hasta que alguien se queja.",
          },
          {
            texto: "Guardar una copia del fichero antes.",
            porque: "Te deja volver atrás, pero no te dice si lo nuevo funciona.",
          },
        ],
      },
      {
        pregunta: "¿Cuándo NO conviene quitar código repetido?",
        opciones: [
          {
            texto: "Cuando los trozos se parecen hoy pero van a cambiar por motivos distintos.",
            correcta: true,
            porque: "Juntarlos crea una función que sirve para dos cosas que ya no son la misma, y esas son peores que la repetición.",
          },
          {
            texto: "Nunca: la repetición siempre se quita.",
            porque: "Es la regla que más daño hace aplicada a ciegas. Parecerse no es ser lo mismo.",
          },
          {
            texto: "Cuando solo se repite dos veces.",
            porque: "El número importa menos que si los trozos comparten un motivo para cambiar.",
          },
        ],
      },
      {
        pregunta: "Al pasar de Options API a `setup`, ¿qué se olvida más?",
        opciones: [
          {
            texto: "Devolver al final todo lo que la plantilla usa.",
            correcta: true,
            porque: "Se traduce cada dato y cada método, y el `return` se queda corto. La plantilla solo ve lo que se le entrega.",
          },
          {
            texto: "Poner `async` en `setup`.",
            porque: "`setup` no necesita ser asíncrono, y hacerlo tiene sus propias complicaciones.",
          },
          {
            texto: "Registrar el componente en `components`.",
            porque: "Eso no cambia al pasar a `setup`: sigue igual que estaba.",
          },
        ],
      },
      {
        pregunta: "Un temporizador que se guarda para poder pararlo, ¿va en un `ref`?",
        opciones: [
          {
            texto: "No: un `let` normal basta, porque no se pinta en ninguna parte.",
            correcta: true,
            porque: "Los `ref` son para lo que la pantalla mira. Envolver en `ref` lo que no se pinta es un vicio común al llegar a Vue 3.",
          },
          {
            texto: "Sí, todo lo que se guarda en `setup` va en un `ref`.",
            porque: "Solo lo que tenga que provocar un repintado cuando cambie.",
          },
          {
            texto: "Sí, o Vue no lo conservará entre repintados.",
            porque: "`setup` se ejecuta una sola vez por componente: las variables de dentro sobreviven perfectamente.",
          },
        ],
      },
      {
        pregunta: "En Vue 3, ¿dónde va lo que antes estaba en `created`?",
        opciones: [
          {
            texto: "Suelto en el cuerpo de `setup`, sin gancho ninguno.",
            correcta: true,
            porque: "`setup` se ejecuta en ese mismo momento, antes de que exista nada en pantalla.",
          },
          {
            texto: "En `onMounted`.",
            porque: "`onMounted` es más tarde: cuando ya está pintado. Si tocas el DOM, ahí; si no, en el cuerpo.",
          },
          {
            texto: "En `onBeforeMount`.",
            porque: "Existe, pero para lo que hacía `created` es dar un rodeo: el cuerpo de `setup` ya está en ese punto.",
          },
        ],
      },
      {
        pregunta: "Reescribir un bucle como `filter().map()`, ¿qué gana de verdad?",
        opciones: [
          {
            texto: "Que se lee qué hace sin tener que seguir el bucle entero.",
            correcta: true,
            porque: "Los nombres de los métodos son la explicación. El bucle hay que leerlo completo para deducirla.",
          },
          {
            texto: "Que va más rápido.",
            porque: "Normalmente va algo más lento. Se hace por lo que cuesta leerlo, no por lo que tarda.",
          },
          {
            texto: "Que ocupa menos líneas.",
            porque: "A veces sí y a veces no. Y en cualquier caso, el número de líneas nunca es el objetivo.",
          },
        ],
      },
    ],
  }
