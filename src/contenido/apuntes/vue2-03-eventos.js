/**
 * El apunte de Wax para «vue2-03-eventos».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Para que la casa responda hacen falta dos cosas.",
    "",
    "**Escuchar** con `@`, que es la forma corta de `v-on`:",
    "",
    "```html",
    "<button @click=\"guardar\">Guardar</button>",
    "```",
    "",
    "**Atar un campo a un dato** con `v-model`, que va en los dos sentidos: escribes en",
    "el campo y cambia el dato; cambia el dato y se actualiza el campo.",
    "",
    "```html",
    "<input v-model=\"nuevo\" />",
    "```",
    "",
    "Los métodos van en su cajón, y ahí dentro los datos se leen y se escriben por",
    "`this`:",
    "",
    "```js",
    "methods: {",
    "  guardar() {",
    "    this.botin.push(this.nuevo)",
    "    this.nuevo = ''       // vaciar el dato vacía el campo solo",
    "  },",
    "}",
    "```",
    "",
    "Fíjate en la última línea: **no se toca el campo, se toca el dato**. El campo es",
    "un reflejo. Cuando alguien intenta manipular la vista por su cuenta en vez de",
    "cambiar lo que la vista refleja es cuando empiezan los problemas raros.",
    "",
    "Y `.trim()` quita los espacios de los extremos: sirve para no dar por bueno un",
    "apunte en el que solo hay aire.",
)
