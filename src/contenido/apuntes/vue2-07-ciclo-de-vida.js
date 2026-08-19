/**
 * El apunte de Wax para «vue2-07-ciclo-de-vida».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Un componente tiene una vida, y Vue te deja engancharte en sus momentos:",
    "",
    "- **`created`**: ya hay datos, todavía no hay nada en pantalla.",
    "- **`mounted`**: ya está pintado. Aquí se toca el DOM, se arrancan relojes o se",
    "  piden cosas que necesitan la vista puesta.",
    "- **`beforeDestroy`**: está a punto de desaparecer. Aquí se recoge.",
    "",
    "```js",
    "mounted() {",
    "  this.temporizador = setInterval(() => { this.segundos += 1 }, 1000)",
    "},",
    "beforeDestroy() {",
    "  clearInterval(this.temporizador)",
    "},",
    "```",
    "",
    "Lo de recoger no es opcional. Un `setInterval` que no se para **sigue corriendo",
    "cuando el componente ya no existe**, apuntando a datos que ya no pinta nadie. Es",
    "una fuga: no se ve, no avisa, y va comiendo hasta que la casa entera va a",
    "trompicones.",
    "",
    "Es el reloj que alguien dio cuerda en una habitación que luego se cerró. Sigue",
    "sonando ahí dentro durante meses.",
    "",
    "Aparte están los **`watch`**, que reaccionan a que un dato cambie y reciben el",
    "valor nuevo y el viejo:",
    "",
    "```js",
    "watch: {",
    "  segundos(nuevo, viejo) { /* ... */ },",
    "},",
    "```",
)
