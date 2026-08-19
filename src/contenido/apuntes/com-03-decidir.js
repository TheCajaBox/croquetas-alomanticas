/**
 * El apunte de Wax para «com-03-decidir».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Aquí hay una distinción que confunde a todo el mundo al principio: **escribir** un",
    "valor y **devolver** un valor no son lo mismo.",
    "",
    "```js",
    "function malo(edad) {",
    "  console.log(edad >= 18)   // lo enseña y lo tira",
    "}",
    "",
    "function bueno(edad) {",
    "  return edad >= 18         // lo entrega",
    "}",
    "",
    "const pasa = bueno(20)      // pasa vale true",
    "const nada = malo(20)       // nada vale undefined",
    "```",
    "",
    "`console.log` es para que **tú** mires. `return` es para que **el programa** siga",
    "trabajando con el resultado. Casi siempre quieres `return`.",
    "",
    "## Devolver la comparación, sin adornos",
    "",
    "Al empezar, todo el mundo escribe esto:",
    "",
    "```js",
    "if (edad >= 18) {",
    "  return true",
    "} else {",
    "  return false",
    "}",
    "```",
    "",
    "Funciona. Pero fíjate en lo que hace: pregunta si algo es verdad, y si lo es",
    "devuelve verdad. Sobra la mitad:",
    "",
    "```js",
    "return edad >= 18",
    "```",
    "",
    "`edad >= 18` **ya es** `true` o `false`. Envolverlo en un `if` para devolver lo",
    "mismo que ya tenías es dar una vuelta de más.",
    "",
    "## Juntar dos condiciones",
    "",
    "«Con cita pasa siempre; sin cita, solo los mayores» son dos caminos que llevan al",
    "mismo sitio, y para eso está el `||`:",
    "",
    "```js",
    "return esSocio || compraMinima >= 50",
    "```",
    "",
    "Verdadero si se cumple **al menos uno** de los dos. Con `&&` harían falta los dos.",
)
