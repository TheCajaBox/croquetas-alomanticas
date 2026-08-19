import { codigo, pista } from '../comun.js'

export default {
  id: "ferro-08-lo-que-envuelve",
  mundo: "ferrocarril",
  entorno: "vue3",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre lo que envuelve",
  enunciado: codigo(
    "`<Transition>`, `<Teleport>` y `<KeepAlive>` son componentes que no pintan nada",
    "propio: envuelven a otro y cambian cómo aparece, dónde aparece o si desaparece.",
    "",
    "Son de lo último que se aprende y de lo primero que hace falta en una pantalla de",
    "verdad. Seis frases.",
  ),
  afirmaciones: [
    {
      texto: "`<Transition>` solo puede envolver a un elemento a la vez.",
      verdadera: true,
      porque: "Sí: uno, o un componente que tenga una sola raíz. Para varios a la vez está `<TransitionGroup>`, que además necesita una `key` en cada hijo para saber cuál es cuál.",
    },
    {
      texto: "`<Transition>` anima el elemento con las animaciones que trae puestas.",
      porque: "No trae ninguna. Lo único que hace es **poner y quitar clases** —`v-enter-from`, `v-enter-active`, `v-leave-to`…— en los momentos adecuados. La animación la escribes tú en CSS, o no la escribes y entonces no se ve nada.",
    },
    {
      texto: "`<Teleport>` mueve el elemento en el DOM, pero sigue siendo hijo del componente para todo lo demás.",
      verdadera: true,
      porque: "Esa es toda la gracia. Se pinta en otro sitio del documento —normalmente al final del `body`, para que ningún `overflow: hidden` lo recorte— y sigue recibiendo las props, emitiendo sus eventos y viviendo dentro de su padre. Es la solución de los diálogos y los avisos flotantes.",
    },
    {
      texto: "Un componente dentro de un `v-if` conserva su estado cuando el `v-if` vuelve a ser verdadero.",
      porque: "Lo pierde entero: un `v-if` falso **destruye** el componente, con sus refs y todo. Para conservarlo hay que envolverlo en `<KeepAlive>`, que lo aparta en vez de destruirlo. Y entonces `onUnmounted` deja de dispararse, y los ganchos que valen son `onActivated` y `onDeactivated`.",
    },
    {
      texto: "El destino de un `<Teleport>` tiene que existir antes de que el componente se monte.",
      verdadera: true,
      porque: "Si el selector no encuentra nada, Vue avisa por consola y no pinta el contenido. Por eso el destino suele ser algo del `index.html`, que existe desde el principio, y no un elemento creado por otro componente.",
    },
    {
      texto: "`<Transition>` funciona igual con `v-if` que con `v-show`.",
      verdadera: true,
      porque: "Las dos disparan la transición, y la diferencia sigue siendo la de siempre: `v-if` crea y destruye el elemento, `v-show` solo lo esconde con CSS. Para algo que se enseña y se oculta muchas veces, `v-show` es más barato.",
    },
  ],
  pistas: [
    pista("Dos de las seis van de qué pasa cuando algo desaparece: si el estado sobrevive o no, y qué lo conserva.", 0),
    pista("Una de las falsas atribuye a Vue un trabajo que en realidad haces tú en otro sitio. Piensa qué es exactamente lo que Vue puede hacer sin saber cómo quieres que se vea.", 1),
    pista("Las de `<Teleport>` van las dos de lo mismo: el elemento se pinta en otro sitio del documento, pero eso no cambia de quién es hijo ni de qué depende para existir.", 2),
  ],
  recompensa: { croquetas: 13 },
}
