/**
 * Las preguntas del repaso de «ferrocarril».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-ferrocarril",
    mundo: "ferrocarril",
    titulo: "El caso de la línea",
    preguntas: [
      {
        pregunta: "¿Qué desaparece al pasar de `setup()` a `<script setup>`?",
        opciones: [
          {
            texto: "El `return`: todo lo declarado arriba queda visible para la plantilla.",
            correcta: true,
            porque: "Y con él se va el olvido más común de la Composition API, que era declarar algo y no devolverlo. El síntoma era un hueco vacío sin ningún error.",
          },
          {
            texto: "Las props, que ya no se pueden declarar.",
            porque: "Se declaran con `defineProps`, que hace lo mismo que la opción `props`. Lo que no se puede es importarla: no es una función de verdad, es una instrucción para el compilador.",
          },
          {
            texto: "La reactividad, que pasa a ser automática.",
            porque: "Sigue habiendo `ref` y `computed`, y sigue haciendo falta `.value` en el JavaScript. `<script setup>` es azúcar de sintaxis, no un modelo distinto.",
          },
          {
            texto: "El `.value`, que ya no hace falta.",
            porque: "En la plantilla nunca hizo falta y en el JavaScript sigue haciéndolo. Esa asimetría no cambia.",
          },
        ],
      },
      {
        pregunta: "Un componente `Ficha` con `<slot name=\"pie\" :casos=\"casos\" />`. ¿Para qué sirve ese `:casos`?",
        opciones: [
          {
            texto: "Para que quien rellene el hueco pueda usar un dato que solo tiene el hijo.",
            correcta: true,
            porque: "Es lo que hace potentes a los huecos: el hijo tiene el dato y no sabe cómo enseñarlo; el padre sabe cómo enseñarlo y no tiene el dato. Se recoge con `<template #pie=\"{ casos }\">`.",
          },
          {
            texto: "Para pasarle una prop al componente `Ficha`.",
            porque: "Las props van en la etiqueta del componente, no en el `<slot>`. Esto va en dirección contraria: del hijo hacia el contenido que le metieron.",
          },
          {
            texto: "Para que el hueco solo se pinte si `casos` tiene valor.",
            porque: "Eso sería un `v-if`. Un `<slot>` sin contenido y sin respaldo no pinta nada, pero no es por esto.",
          },
          {
            texto: "Para nombrar el hueco.",
            porque: "El nombre lo pone `name=\"pie\"`. Lo de los dos puntos son datos que viajan con él.",
          },
        ],
      },
      {
        pregunta: "`const caja = ref(null)` con `<input ref=\"caja\" />`. ¿Dónde se puede usar `caja.value`?",
        opciones: [
          {
            texto: "En `onMounted` o después, nunca en el cuerpo de `setup`.",
            correcta: true,
            porque: "`setup` corre antes de que se pinte nada, así que ahí la referencia vale `null`. Vue la rellena justo después de montar. Es la misma regla de siempre: lo que toca el DOM va después del primer pintado.",
          },
          {
            texto: "En cualquier sitio: Vue la rellena en cuanto se declara.",
            porque: "En cuanto se declara vale `null`, y usarla ahí da `Cannot read properties of null`. El elemento todavía no existe.",
          },
          {
            texto: "Solo dentro de la plantilla.",
            porque: "En la plantilla no se usa la referencia: la plantilla es quien la **rellena**, con el atributo `ref`.",
          },
          {
            texto: "En `setup`, pero envuelta en `nextTick`.",
            porque: "Funcionaría, y `onMounted` dice mucho mejor lo que quieres. `nextTick` se reserva para cuando cambias un dato y necesitas leer el DOM ya repintado.",
          },
        ],
      },
      {
        pregunta: "¿Cuál es la diferencia entre un composable y un almacén compartido?",
        opciones: [
          {
            texto: "Dónde se declara el estado: dentro de la función o fuera.",
            correcta: true,
            porque: "Dentro, cada llamada crea el suyo; fuera, todas comparten uno, porque un módulo se ejecuta una sola vez. Son dos líneas de sitio y el comportamiento opuesto — y no da ningún error, así que hay que saber mirarlo.",
          },
          {
            texto: "Que el almacén necesita Pinia y el composable no.",
            porque: "Un almacén compartido cabe en diez líneas con un `reactive` fuera de la función. Pinia añade herramientas de desarrollo, una forma única de escribirlo y el renderizado en servidor, no la idea.",
          },
          {
            texto: "Que el composable no puede tener funciones, solo datos.",
            porque: "Puede tener las dos cosas, y lo normal es que devuelva estado y las funciones que lo cambian.",
          },
          {
            texto: "Que el almacén es reactivo y el composable no.",
            porque: "Los dos lo son. La reactividad la da `ref` o `reactive`, y eso se usa igual en ambos.",
          },
        ],
      },
      {
        pregunta: "¿Por qué `usarDescuento` tiene que llamar a `unref` **dentro** de la `computed`?",
        opciones: [
          {
            texto: "Porque un computed depende de lo que lee mientras se ejecuta.",
            correcta: true,
            porque: "Leer el `.value` fuera coge un valor y se acabó: Vue nunca ve esa lectura y no se entera de que hay que recalcular. Dentro, la lectura establece la dependencia. Cuando algo no se actualiza en Vue, la primera pregunta es dónde se está leyendo el `.value`.",
          },
          {
            texto: "Porque `unref` solo funciona dentro de un computed.",
            porque: "Funciona en cualquier sitio: es `isRef(x) ? x.value : x`. Lo que cambia según dónde lo pongas es si establece una dependencia o solo coge un valor.",
          },
          {
            texto: "Por rendimiento: fuera se ejecutaría más veces.",
            porque: "Al revés: fuera se ejecuta una sola vez. El problema no es cuántas, es que el resultado se queda congelado.",
          },
          {
            texto: "Porque fuera daría un error.",
            porque: "No da ninguno, y eso es lo malo. Devuelve un número perfectamente válido que ya no cambia nunca.",
          },
        ],
      },
      {
        pregunta: "¿Qué hace exactamente `<Transition>`?",
        opciones: [
          {
            texto: "Poner y quitar clases CSS en los momentos justos, y esperar a que la salida termine.",
            correcta: true,
            porque: "La animación la escribes tú en CSS. Sin reglas que usen esas clases no se ve nada, y el componente parece roto. Lo que sí resuelve Vue —y a mano es incómodo— es no quitar el elemento del DOM hasta que la animación de salida acabe.",
          },
          {
            texto: "Animar el elemento con una animación por defecto.",
            porque: "No trae ninguna. Vue no puede saber cómo quieres que se vea.",
          },
          {
            texto: "Evitar que el componente se destruya al ocultarse.",
            porque: "Eso es `<KeepAlive>`. `<Transition>` no cambia si el elemento existe o no, solo cómo entra y sale.",
          },
          {
            texto: "Pintarlo en otro sitio del documento.",
            porque: "Eso es `<Teleport>`, que sirve para que un diálogo no lo recorte un `overflow: hidden`.",
          },
        ],
      },
    ],
  }
