/**
 * El apunte de Wax para «com-09-texto».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Un texto también tiene sus métodos, y son de los que más se usan:",
    "",
    "```js",
    "const nombre = '  miles Dagouter  '",
    "",
    "nombre.trim()          // 'miles Dagouter'   quita espacios de los dos lados",
    "nombre.toUpperCase()   // '  MILES DAGOUTER  '",
    "nombre.toLowerCase()   // '  miles dagouter  '",
    "nombre.length          // 19, espacios incluidos",
    "nombre.includes('Dag') // true",
    "nombre.replace('miles', 'Miles')",
    "nombre.split(' ')      // lo parte por los espacios y devuelve una lista",
    "```",
    "",
    "## Lo que casi nadie ve la primera vez",
    "",
    "**Ninguno de estos cambia el texto original.** Todos devuelven uno nuevo:",
    "",
    "```js",
    "let nombre = '  miles  '",
    "nombre.trim()          // devuelve 'miles'...",
    "console.log(nombre)    // ...pero nombre sigue siendo '  miles  '",
    "",
    "nombre = nombre.trim() // así sí",
    "```",
    "",
    "En JavaScript los textos son **inmutables**: no se pueden modificar, solo se pueden",
    "fabricar otros. Llamar a `.trim()` y no recoger el resultado es tirar el trabajo a",
    "la basura, y es un fallo que se comete constantemente.",
    "",
    "## Se encadenan",
    "",
    "Como cada uno devuelve un texto nuevo, se pueden enganchar uno detrás de otro:",
    "",
    "```js",
    "nombre.trim().toUpperCase()   // 'MILES'",
    "```",
    "",
    "Se leen de izquierda a derecha: primero quita los espacios, y a lo que salga de",
    "ahí le pone las mayúsculas. El orden importa menos aquí, pero en general importa.",
)
