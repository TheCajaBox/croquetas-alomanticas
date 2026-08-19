/**
 * El apunte de Wax para «com-02-si-y-si-no».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "`if` es la primera bifurcación del camino:",
    "",
    "```js",
    "if (recompensa >= 500) {",
    "  console.log('Este lo cogemos')",
    "}",
    "```",
    "",
    "Entre paréntesis va algo que da verdadero o falso. Si es verdadero, se ejecuta lo",
    "de las llaves; si no, se salta entero.",
    "",
    "Con `else` se dice qué hacer en el otro caso:",
    "",
    "```js",
    "if (recompensa >= 500) {",
    "  console.log('Este lo cogemos')",
    "} else {",
    "  console.log('Que lo coja otro')",
    "}",
    "```",
    "",
    "Y con `else if` se encadenan tantos casos como haga falta:",
    "",
    "```js",
    "if (recompensa >= 500) {",
    "  categoria = 'grande'",
    "} else if (recompensa >= 100) {",
    "  categoria = 'mediano'",
    "} else {",
    "  categoria = 'menudencia'",
    "}",
    "```",
    "",
    "## El orden importa, y mucho",
    "",
    "Se comprueban **de arriba abajo** y en cuanto uno acierta, se dejan de mirar los",
    "demás. Por eso la cadena va de más exigente a menos.",
    "",
    "Si la pusieras al revés —primero `>= 100`— una recompensa de 800 entraría por ahí",
    "y se quedaría en `'mediano'`, porque el `>= 500` de abajo ya no se llega a mirar",
    "nunca. El programa no da error: da un resultado mal, que es peor.",
    "",
    "## Un atajo que verás mucho",
    "",
    "Cuando lo único que haces es elegir entre dos valores, hay una forma corta:",
    "",
    "```js",
    "const trato = recompensa >= 500 ? 'lo cogemos' : 'que lo coja otro'",
    "```",
    "",
    "Se lee: condición, `?`, lo de si es verdad, `:`, lo de si no. Se llama **ternario**",
    "y está bien para casos cortos. Para tres o más casos, `if` y a otra cosa.",
)
