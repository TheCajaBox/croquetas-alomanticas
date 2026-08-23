/**
 * Las preguntas del repaso de «primer-dia».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-primer-dia",
    mundo: "primer-dia",
    titulo: "El caso de los primeros pasos",
    preguntas: [
      {
        pregunta: "¿Cuándo se usa `let` en vez de `const`?",
        opciones: [
          {
            texto: "Solo cuando compruebes que a esa variable le vas a asignar otro valor.",
            correcta: true,
            porque: "Se empieza siempre por `const`. Así, al leer código ajeno, cada `let` avisa de que ese valor se mueve.",
          },
          {
            texto: "Siempre que la variable vaya a usarse en más de un sitio.",
            porque: "Usarla en muchos sitios no tiene nada que ver. Lo que decide es si se le va a **asignar** otro valor.",
          },
          {
            texto: "Cuando el valor es un número, porque los números cambian.",
            porque: "El tipo de dato no decide nada. Un número puede ser `const` perfectamente.",
          },
        ],
      },
      {
        pregunta: "`const gatos = ['Acero']` y luego `gatos.push('Bronce')`. ¿Qué pasa?",
        opciones: [
          {
            texto: "Funciona: `const` protege la caja, no lo que hay dentro.",
            correcta: true,
            porque: "Exacto. Lo que no se puede es darle OTRA lista con `gatos = [...]`.",
          },
          {
            texto: "Da error, porque `const` no deja cambiar nada.",
            porque: "Es la confusión más común. `const` impide reasignar la variable, no modificar el contenido de una lista o un objeto.",
          },
          {
            texto: "Funciona pero la lista deja de ser reactiva.",
            porque: "La reactividad es cosa de Vue y no tiene nada que ver con `const`.",
          },
        ],
      },
      {
        pregunta: "¿Qué escribe `console.log('Van ' + 2 + 1)`?",
        opciones: [
          {
            texto: "`Van 21`",
            correcta: true,
            porque: "De izquierda a derecha: `'Van ' + 2` da el texto `'Van 2'`, y a eso se le pega el `1`.",
          },
          {
            texto: "`Van 3`",
            porque: "Eso saldría con paréntesis: `'Van ' + (2 + 1)`. Sin ellos, al llegar al `1` ya se estaba trabajando con texto.",
          },
          {
            texto: "Da error por mezclar texto y números.",
            porque: "No avisa: convierte el número a texto y sigue. Ese es justamente el problema.",
          },
        ],
      },
      {
        pregunta: "¿Qué diferencia hay entre `return` y `console.log`?",
        opciones: [
          {
            texto: "`console.log` enseña algo por pantalla; `return` entrega un valor a quien llamó a la función.",
            correcta: true,
            porque: "Una función sin `return` devuelve `undefined`, por muchos `console.log` que tenga dentro.",
          },
          {
            texto: "Ninguna: las dos sacan el valor de la función.",
            porque: "Es el malentendido que más tests suspende. Solo `return` entrega algo utilizable.",
          },
          {
            texto: "`return` solo vale dentro de un bucle.",
            porque: "`return` vale en cualquier función, y de hecho la termina en ese punto.",
          },
        ],
      },
      {
        pregunta: "¿Por qué falla `console.log(equipo)` puesto encima de `const equipo = []`?",
        opciones: [
          {
            texto: "Porque el programa se lee de arriba abajo y ahí `equipo` todavía no existe.",
            correcta: true,
            porque: "El error es `Cannot access 'equipo' before initialization`, que dice justo eso con peores palabras.",
          },
          {
            texto: "Porque `console.log` no sabe pintar listas.",
            porque: "Pinta listas perfectamente. El problema es el orden, no el tipo.",
          },
          {
            texto: "Porque falta un punto y coma.",
            porque: "En JavaScript los puntos y coma casi nunca son el problema, y desde luego no aquí.",
          },
        ],
      },
      {
        pregunta: "¿Qué es `null`?",
        opciones: [
          {
            texto: "Un valor que dice «aquí no hay nada, y consta que no lo hay».",
            correcta: true,
            porque: "Distinto de `undefined`, que es «esto nunca se rellenó», y distinto de `0` o de un texto vacío.",
          },
          {
            texto: "Lo mismo que `0`.",
            porque: "`0` es un número con el que se puede operar. `null` es la ausencia deliberada de valor.",
          },
          {
            texto: "Un error que hay que evitar siempre.",
            porque: "Es un valor legítimo y muy útil: sirve para dejar constancia de un hueco a propósito.",
          },
        ],
      },
    ],
  }
