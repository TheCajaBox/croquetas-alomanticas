/**
 * El apunte de Wax para «es6-04c-primer-map».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "`map` recorre una lista y devuelve **otra lista nueva** con cada elemento pasado",
    "por la función que le des:",
    "",
    "```js",
    "const metales = ['acero', 'peltre']",
    "const gritados = metales.map((metal) => metal.toUpperCase())",
    "// ['ACERO', 'PELTRE']",
    "```",
    "",
    "Léelo así: «por cada `metal` de la lista, dame `metal.toUpperCase()`».",
    "",
    "Lo de dentro es una función flecha: a la izquierda de la `=>` va el nombre que le",
    "pones a cada elemento —lo eliges tú— y a la derecha, lo que quieres obtener de él.",
    "",
    "`toUpperCase()` es un método de los textos y devuelve el texto en mayúsculas, sin",
    "cambiar el original. Y `join(', ')` hace lo contrario que una lista: junta todos",
    "sus elementos en un solo texto, pegando entre medias lo que le digas.",
    "",
    "```js",
    "['ACERO', 'PELTRE'].join(', ')   // 'ACERO, PELTRE'",
    "```",
)
