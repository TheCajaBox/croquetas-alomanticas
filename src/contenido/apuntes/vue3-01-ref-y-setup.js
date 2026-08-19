/**
 * El apunte de Wax para «vue3-01-ref-y-setup».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "En La Nueva Seran hacen lo mismo de otra manera. En vez de repartir el componente",
    "en cajones —`data` por aquí, `methods` por allá—, hay **una sola función**,",
    "`setup()`, donde se declara todo junto y se devuelve lo que la vista necesite.",
    "",
    "```js",
    "const componente = {",
    "  setup() {",
    "    const balas = ref(6)",
    "    const disparar = () => { balas.value -= 1 }",
    "    return { balas, disparar }",
    "  },",
    "  template: `<p @click=\"disparar\">{{ balas }}</p>`,",
    "}",
    "```",
    "",
    "`ref(6)` no guarda un seis: guarda una **caja** con un seis dentro. Vue necesita",
    "esa caja para poder vigilarla, porque a un número suelto no hay manera de ponerle",
    "un centinela.",
    "",
    "De ahí la regla que hay que meterse en la cabeza cuanto antes:",
    "",
    "- **dentro de `setup`**, se abre la caja con `.value`",
    "- **en la plantilla**, no: Vue la abre por ti",
    "",
    "Olvidarse del `.value` dentro de `setup` es *el* error de principiante en Vue 3, y",
    "lo peor es que no protesta: simplemente no pasa nada. Como recargar el tambor sin",
    "abrirlo.",
)
