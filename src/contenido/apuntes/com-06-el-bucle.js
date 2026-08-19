/**
 * El apunte de Wax para «com-06-el-bucle».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Los dos son el mismo patrón —una variable fuera, un bucle que la va tocando— pero",
    "el segundo tiene una decisión que hay que tomar bien.",
    "",
    "## Sumar",
    "",
    "```js",
    "let total = 0",
    "for (const n of numeros) {",
    "  total += n",
    "}",
    "return total",
    "```",
    "",
    "Empezar en `0` no es arbitrario: sumarle cero a algo no lo cambia, así que es el",
    "punto de partida que no ensucia el resultado. Y de regalo, con la lista vacía",
    "devuelve `0`, que es exactamente lo que se pide.",
    "",
    "## El máximo, y el error clásico",
    "",
    "La tentación es empezar en `0`, igual que antes:",
    "",
    "```js",
    "let mayor = 0   // ¡cuidado!",
    "```",
    "",
    "Y funciona... hasta que la lista es `[-8, -3, -20]`. Entonces devuelve `0`, que no",
    "está en la lista. Ese cero no era el máximo: era una suposición.",
    "",
    "La forma correcta es no suponer nada. Empieza sin candidato:",
    "",
    "```js",
    "let mayor = null",
    "for (const n of numeros) {",
    "  if (mayor === null || n > mayor) mayor = n",
    "}",
    "return mayor",
    "```",
    "",
    "El primer número entra porque todavía no había ninguno; los demás, solo si superan",
    "al que había. Y con la lista vacía el bucle no da ni una vuelta, así que sale el",
    "`null` con el que empezó. Otra vez el caso raro sale gratis por haber elegido bien",
    "el punto de partida.",
    "",
    "Esa es la idea que vale más que las dos funciones: **el valor inicial de un",
    "acumulador es una decisión**, no un cero por costumbre.",
)
