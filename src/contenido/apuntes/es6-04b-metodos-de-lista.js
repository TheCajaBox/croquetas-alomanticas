/**
 * El apunte de Wax para «es6-04b-metodos-de-lista».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Una lista trae de fábrica un montón de métodos. Estos seis salen constantemente:",
    "",
    "```js",
    "const precios = [30, 12, 90]",
    "",
    "precios.length                          // 3       cuántos hay",
    "precios.includes(12)                    // true    ¿está?",
    "precios.map((p) => p * 2)               // [60, 24, 180]",
    "precios.filter((p) => p > 20)           // [30, 90]",
    "precios.reduce((s, p) => s + p, 0)      // 132",
    "precios.push(45)                        // añade al final",
    "```",
    "",
    "Hay una división que importa más que los nombres:",
    "",
    "- `map`, `filter` y `reduce` **no tocan la lista original**: devuelven algo nuevo.",
    "  Son seguros: puedes encadenarlos sin miedo a estropear nada.",
    "- `push` **sí la cambia**. Después de un `push`, la lista de partida ya no es la",
    "  que era.",
    "",
    "`length` no lleva paréntesis, porque no es un método: es una propiedad. Es un dato",
    "que la lista tiene, no algo que la lista haga.",
)
