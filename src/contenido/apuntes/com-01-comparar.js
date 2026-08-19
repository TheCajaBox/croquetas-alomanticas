/**
 * El apunte de Wax para «com-01-comparar».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Comparar dos cosas da siempre lo mismo: `true` o `false`. Nada más. A eso se le",
    "llama un **booleano**, y es el tipo más pequeño que existe: solo tiene dos valores.",
    "",
    "```js",
    "5 > 3        // true",
    "5 < 3        // false",
    "5 >= 5       // true",
    "```",
    "",
    "## Los dos iguales y los tres iguales",
    "",
    "Para preguntar «¿es lo mismo?» hay dos operadores, y aquí es donde se pierde la",
    "gente:",
    "",
    "```js",
    "5 === 5      // true",
    "5 === '5'    // false   el número cinco no es el texto cinco",
    "5 == '5'     // true    ...pero con dos iguales, sí",
    "```",
    "",
    "`==` **convierte antes de comparar**. Ve un número y un texto, convierte el texto",
    "a número y entonces compara. Suena cómodo y es una fuente inagotable de disgustos,",
    "porque las reglas de conversión son largas y nadie se las sabe enteras.",
    "",
    "La norma es corta: **usa siempre `===`**. Y `!==` para lo contrario. Los de dos",
    "iguales déjalos donde están.",
    "",
    "## Verdadero-ish",
    "",
    "Cuando JavaScript necesita un `true` o un `false` y le das otra cosa, se lo",
    "inventa. Estos valores cuentan como falsos:",
    "",
    "```js",
    "false   0   ''   null   undefined   NaN",
    "```",
    "",
    "Y **todo lo demás cuenta como verdadero**. Todo: el texto `'0'`, la lista vacía",
    "`[]`, el objeto vacío `{}`. Sí, la lista vacía es verdadera. Es una de esas cosas",
    "que hay que saberse y ya está.",
    "",
    "## Y, o, no",
    "",
    "```js",
    "a && b    // Y:  verdadero solo si los dos lo son",
    "a || b    // O:  verdadero si al menos uno lo es",
    "!a        // NO: le da la vuelta",
    "```",
)
