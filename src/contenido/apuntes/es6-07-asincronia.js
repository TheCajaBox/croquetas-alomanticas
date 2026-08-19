/**
 * El apunte de Wax para «es6-07-asincronia».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Una **promesa** es un valor que todavía no ha llegado: llegará, o fallará. Es el",
    "telegrama que has mandado y cuya respuesta esperas.",
    "",
    "`async` y `await` sirven para escribir esa espera como si fuera código normal:",
    "",
    "```js",
    "async function avisar() {",
    "  const respuesta = await mandarAviso()   // espera aquí sin bloquear nada",
    "  return respuesta",
    "}",
    "```",
    "",
    "Una función `async` **siempre devuelve una promesa**, aunque dentro devuelvas un",
    "número suelto.",
    "",
    "Para varias a la vez:",
    "",
    "```js",
    "await Promise.all([a, b, c])    // espera a todos; falla si falla uno",
    "await Promise.race([a, b, c])   // el primero que conteste",
    "```",
    "",
    "Y el detalle del reto: **`Promise.all` respeta el orden en que le pasaste las",
    "promesas**, no el orden en que llegaron. Si avisas a Marasi y a Wax, y Wax",
    "responde antes, la lista sigue siendo `[Marasi, Wax]`. Que uno conteste antes no",
    "lo pone el primero en el parte.",
    "",
    "Una lista de nombres no es una lista de promesas: hay que mandar los avisos",
    "primero, y eso se hace con `map`.",
)
