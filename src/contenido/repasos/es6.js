/**
 * Las preguntas del repaso de «es6».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-es6",
    mundo: "es6",
    titulo: "El caso de los Áridos",
    preguntas: [
      {
        pregunta: "¿Por qué se usa una flecha dentro de `map` en lugar de `function`?",
        opciones: [
          {
            texto: "Porque la flecha no tiene `this` propio y usa el del sitio donde está escrita.",
            correcta: true,
            porque: "Una función clásica trae su propio `this`, que al pasarla a `map` se pierde y queda en `undefined`.",
          },
          {
            texto: "Porque las flechas son más rápidas.",
            porque: "La velocidad es irrelevante aquí. Lo que cambia es el `this`.",
          },
          {
            texto: "Porque `map` solo admite flechas.",
            porque: "`map` admite cualquier función. Lo que pasa es que con la clásica el `this` de dentro ya no es el que esperabas.",
          },
        ],
      },
      {
        pregunta: "`const nombre = ''`. ¿Qué da `nombre || 'anónimo'` y qué da `nombre ?? 'anónimo'`?",
        opciones: [
          {
            texto: "`'anónimo'` el primero, y el texto vacío el segundo.",
            correcta: true,
            porque: "`||` salta con cualquier valor flojo, el texto vacío incluido. `??` solo con `null` y `undefined`.",
          },
          {
            texto: "Los dos dan `'anónimo'`.",
            porque: "Esa es la trampa. `??` respeta el texto vacío, porque un nombre en blanco es un dato, no una ausencia.",
          },
          {
            texto: "Los dos dan el texto vacío.",
            porque: "`||` sí lo sustituye: para él, un texto vacío cuenta como falso.",
          },
        ],
      },
      {
        pregunta: "¿Qué le falta a `precios.reduce((suma, p) => suma + p)`?",
        opciones: [
          {
            texto: "El valor inicial: `, 0` al final.",
            correcta: true,
            porque: "Sin él, con la lista vacía da un error en vez de un cero.",
          },
          {
            texto: "Nada, está completo.",
            porque: "Funciona con listas que tengan elementos, y falla el día que le llegue una vacía. De los peores fallos: aparece tarde.",
          },
          {
            texto: "Le falta un `return` dentro.",
            porque: "Una flecha sin llaves ya devuelve lo que hay a la derecha.",
          },
        ],
      },
      {
        pregunta: "`Promise.all([lento, rapido])`. ¿En qué orden llega el resultado?",
        opciones: [
          {
            texto: "En el orden en que se las pasaste: primero `lento`, después `rapido`.",
            correcta: true,
            porque: "Que uno conteste antes no lo pone el primero en la lista. Se ejecutan a la vez, pero el resultado respeta tu orden.",
          },
          {
            texto: "En el orden en que terminan: primero `rapido`.",
            porque: "Eso sería `Promise.race`, que además solo devuelve el primero.",
          },
          {
            texto: "En orden aleatorio, depende de la red.",
            porque: "El orden está garantizado por el propio `Promise.all`.",
          },
        ],
      },
      {
        pregunta: "¿Qué hace `const { senas: { sombrero } = {} } = cartel`?",
        opciones: [
          {
            texto: "Saca `sombrero` de dentro de `senas`, y si `senas` no viene, no revienta.",
            correcta: true,
            porque: "El `= {}` es el valor por defecto de `senas`. Sin él, intentaría abrir un `undefined`.",
          },
          {
            texto: "Crea dos variables: `senas` y `sombrero`.",
            porque: "Solo crea `sombrero`. Al desestructurar en profundidad, el nivel intermedio no queda como variable.",
          },
          {
            texto: "Copia el objeto entero en `sombrero`.",
            porque: "Copia solo esa propiedad concreta.",
          },
        ],
      },
      {
        pregunta: "`map`, `filter` y `reduce`, ¿modifican la lista original?",
        opciones: [
          {
            texto: "No: las tres devuelven algo nuevo y dejan la original intacta.",
            correcta: true,
            porque: "Por eso se pueden encadenar sin miedo. El que sí la modifica es `push`, entre otros.",
          },
          {
            texto: "Sí, las tres la modifican en el sitio.",
            porque: "Ninguna la toca. Confundirlo lleva a hacer copias defensivas que no hacen falta.",
          },
          {
            texto: "Solo `reduce` la modifica.",
            porque: "`reduce` tampoco: recorre y acumula, pero no escribe en la lista.",
          },
        ],
      },
    ],
  }
