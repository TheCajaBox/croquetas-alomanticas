/**
 * El apunte de Wax para «com-04-listas».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Un **array** —una lista— es una caja con muchos huecos numerados:",
    "",
    "```js",
    "const buscados = ['Miles', 'Bleeder', 'Suit']",
    "```",
    "",
    "## Se cuenta desde cero",
    "",
    "Esto no es un capricho, es una convención de toda la profesión, y hasta que se te",
    "hace natural la pisas cien veces:",
    "",
    "```js",
    "buscados[0]    // 'Miles'    el primero",
    "buscados[1]    // 'Bleeder'",
    "buscados[2]    // 'Suit'     el último",
    "buscados[3]    // undefined  ahí no hay nadie",
    "```",
    "",
    "Pedir una posición que no existe **no da error**: da `undefined`. Es JavaScript",
    "encogiéndose de hombros, y suele ser el origen del famoso «cannot read properties",
    "of undefined» tres líneas más abajo.",
    "",
    "## Cuántos hay",
    "",
    "```js",
    "buscados.length      // 3",
    "```",
    "",
    "Y de ahí sale la fórmula que se usa a diario: si hay 3 y se empieza en 0, el",
    "último está en la posición 2. O sea, `length - 1`:",
    "",
    "```js",
    "buscados[buscados.length - 1]    // 'Suit', sea cual sea el tamaño",
    "```",
    "",
    "## Meter y sacar",
    "",
    "```js",
    "buscados.push('Paalm')    // lo añade al final; ahora length es 4",
    "buscados.pop()            // saca el último y te lo devuelve",
    "buscados.includes('Suit') // true: ¿está ahí dentro?",
    "buscados.indexOf('Suit')  // 2: ¿en qué posición? -1 si no está",
    "```",
    "",
    "Ojo con `indexOf`: cuando no encuentra nada devuelve `-1`, no `undefined`. Y `-1`",
    "es un número verdadero, así que un `if (lista.indexOf(x))` se cumple justo cuando",
    "**no** está. Para preguntar si está, usa `includes` y te ahorras el disgusto.",
)
