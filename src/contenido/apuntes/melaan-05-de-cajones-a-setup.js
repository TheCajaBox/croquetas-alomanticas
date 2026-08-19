/**
 * El apunte de Wax para «melaan-05-de-cajones-a-setup».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "La misma pieza, otra forma. Sin `data` ni `methods`: una sola función donde se",
    "declara todo y se devuelve lo que la plantilla necesita.",
    "",
    "```js",
    "// antes",
    "data() { return { balas: 6 } },",
    "computed: { vacia() { return this.balas === 0 } },",
    "methods: { disparar() { this.balas -= 1 } },",
    "",
    "// después",
    "setup() {",
    "  const balas = ref(6)",
    "  const vacia = computed(() => balas.value === 0)",
    "  const disparar = () => { balas.value -= 1 }",
    "  return { balas, vacia, disparar }",
    "}",
    "```",
    "",
    "La traducción es mecánica, y conviene hacerla en este orden:",
    "",
    "1. Cada dato de `data` pasa a ser un `ref`.",
    "2. Cada `computed` pasa a ser un `computed(() => ...)`.",
    "3. Cada método pasa a ser una función normal.",
    "4. **Todo lo que la plantilla use se devuelve al final.** Lo que no se devuelve, la",
    "   plantilla no lo ve, y ese es el fallo número uno al hacer esta conversión.",
    "",
    "Y en todo el camino, dos cambios que hay que ir haciendo sin pensar: **fuera todos",
    "los `this`**, y **dentro de `setup`, `.value`** en cada ref. En la plantilla, no.",
    "",
    "Merece la pena hacer esta conversión a mano unas cuantas veces. Es lo que te vas a",
    "encontrar en cualquier proyecto que esté modernizándose, y es de las pocas tareas",
    "en las que un fallo se ve al momento.",
)
