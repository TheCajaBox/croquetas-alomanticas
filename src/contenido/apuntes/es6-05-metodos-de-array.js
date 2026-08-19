/**
 * El apunte de Wax para «es6-05-metodos-de-array».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Tres métodos resuelven casi todo lo que se hace con listas, y ninguno toca la",
    "original: **devuelven una nueva**.",
    "",
    "```js",
    "const precios = [30, 12, 90]",
    "",
    "precios.filter((p) => p >= 30)            // [30, 90]        los que cumplen",
    "precios.map((p) => p * 2)                 // [60, 24, 180]   uno a uno",
    "precios.reduce((suma, p) => suma + p, 0)  // 132             todos en un valor",
    "```",
    "",
    "Se encadenan, y así el código se lee como una frase:",
    "",
    "```js",
    "metales",
    "  .filter((m) => m.precio >= 30)",
    "  .map((m) => m.nombre.toUpperCase())",
    "```",
    "",
    "«De todo el almacén, quédate con los caros y dame sus nombres». Un `for` haría lo",
    "mismo, pero hay que leerlo entero para saber qué pretendía.",
    "",
    "Un aviso sobre `reduce`: ese `0` del final es el **valor inicial**. Sin él, con el",
    "almacén vacío te da un error en vez de un cero. Pónselo siempre.",
)
