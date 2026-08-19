/**
 * El apunte de Wax para «vue2-06-props-y-emit».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "La regla de la casa: **los datos bajan, los avisos suben**. Como una cadena de",
    "mando que funciona.",
    "",
    "El padre pasa datos al hijo con **props**, y el hijo las declara:",
    "",
    "```js",
    "props: {",
    "  gato: { type: Object, required: true },",
    "},",
    "```",
    "",
    "A partir de ahí `gato` se usa en su plantilla como cualquier dato.",
    "",
    "El hijo **no toca** lo que le han dado. Si quiere que algo cambie, avisa:",
    "",
    "```html",
    "<button @click=\"$emit('adoptar', gato)\">Adoptar</button>",
    "```",
    "",
    "Y el padre escucha y decide:",
    "",
    "```html",
    "<tarjeta :gato=\"gato\" @adoptar=\"adoptar\" />",
    "```",
    "",
    "Da más vueltas que cambiar el dato directamente, sí. A cambio, cuando algo",
    "aparezca mal en pantalla habrá **un solo sitio** donde puede haberse cambiado. En",
    "una casa con treinta habitaciones, saber quién movió cada cosa deja de ser una",
    "formalidad muy pronto.",
)
