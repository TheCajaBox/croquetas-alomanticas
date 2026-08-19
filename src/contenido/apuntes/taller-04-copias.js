/**
 * El apunte de Wax para «taller-04-copias».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Este es **el** fallo que más horas cuesta de toda la lista, y no es difícil: es",
    "invisible.",
    "",
    "```js",
    "let a = 5",
    "let b = a",
    "b = 9",
    "console.log(a)      // 5. Todo normal.",
    "",
    "const lista = ['Wax']",
    "const otra = lista",
    "otra.push('Wayne')",
    "console.log(lista)  // ['Wax', 'Wayne'] ¿¿cómo??",
    "```",
    "",
    "Los números, los textos y los booleanos se copian **enteros**. Las listas y los",
    "objetos, no: lo que se copia es **la dirección**. `otra` y `lista` no son dos",
    "listas parecidas; son dos nombres del mismo sitio.",
    "",
    "Y `const` no protege de esto: `const` impide que le des otra lista a ese nombre,",
    "no impide que le metan cosas a la que ya hay.",
    "",
    "## Copiar de verdad",
    "",
    "```js",
    "const copia = [...lista]              // lista nueva con lo mismo dentro",
    "const copia = { ...objeto }           // objeto nuevo con lo mismo dentro",
    "```",
    "",
    "Los tres puntos van desparramando el contenido dentro de unos corchetes o unas",
    "llaves nuevas. A partir de ahí son cosas distintas y tocar una no toca la otra.",
    "",
    "Y sin copiar nada, muchos métodos ya devuelven una lista nueva en vez de tocar la",
    "tuya: `map`, `filter`, `slice`, `concat`. Los que sí modifican la original son",
    "`push`, `pop`, `splice`, `sort` y `reverse`. Merece la pena saberse esa segunda",
    "lista, que es más corta.",
    "",
    "## La copia es de un solo piso",
    "",
    "```js",
    "const original = { nombre: 'Wax', armas: ['Vindicación'] }",
    "const copia = { ...original }",
    "copia.armas.push('escopeta')",
    "console.log(original.armas)    // ['Vindicación', 'escopeta'] otra vez",
    "```",
    "",
    "El `...` copia el primer nivel. La lista de dentro sigue siendo **la misma lista**,",
    "porque lo que se copió fue su dirección. Con datos anidados hay que copiar también",
    "lo de dentro, a mano o con `structuredClone(original)`.",
)
