/**
 * El apunte de Wax para «melaan-06-partir-en-dos».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Un componente debería poder explicarse en una frase. Cuando hacen falta tres «y",
    "además», es que son dos componentes.",
    "",
    "Partir uno tiene siempre los mismos pasos:",
    "",
    "1. Busca **el trozo que se repite** dentro de un `v-for`. Ese es el hijo.",
    "2. Mira **qué datos necesita** ese trozo. Esas son sus props.",
    "3. Mira **qué puede provocar** el usuario ahí dentro. Esos son sus eventos.",
    "4. El resto se queda en el padre.",
    "",
    "```js",
    "const tarjeta = {",
    "  props: { gato: { type: Object, required: true } },",
    "  emits: ['adoptar'],",
    "  setup(props, { emit }) {",
    "    return { adoptar: () => emit('adoptar', props.gato) }",
    "  },",
    "  template: `<li>{{ gato.nombre }} <button @click=\"adoptar\">Adoptar</button></li>`,",
    "}",
    "```",
    "",
    "Lo que se gana no es tener menos líneas: **son las mismas líneas repartidas**. Lo",
    "que se gana es que el hijo se puede leer, probar y cambiar sin saber nada del",
    "padre, y que el padre deja de tener que saber cómo se pinta un gato.",
    "",
    "Y la regla que no se salta: el hijo **no toca** lo que le pasan. Avisa y el padre",
    "decide. Si el hijo pudiera modificar la colonia, volverías a tener dos sitios donde",
    "cambian los datos, que es justo el problema del que venías huyendo.",
)
