/**
 * El apunte de Wax para «es6-06-opcional-y-coalescencia».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Las fichas de los agentes las rellena gente con prisa, y llegan con huecos. Dos",
    "operadores para eso.",
    "",
    "**`?.`** corta por lo sano si lo de la izquierda no existe, en vez de reventar:",
    "",
    "```js",
    "agente.destino.ciudad    // error si no hay destino",
    "agente.destino?.ciudad   // undefined, y seguimos",
    "```",
    "",
    "**`??`** pone un valor de repuesto, pero **solo** cuando lo de la izquierda es",
    "`null` o `undefined`:",
    "",
    "```js",
    "nombre ?? 'desconocido'",
    "```",
    "",
    "Y aquí está la diferencia que importa. `||` salta con cualquier valor «flojo»: el",
    "`0`, el texto vacío, el `false`. `??` no:",
    "",
    "```js",
    "'' || 'desconocido'   // 'desconocido'  ← te has cargado un dato válido",
    "'' ?? 'desconocido'   // ''             ← respeta el texto vacío",
    "0 || 10               // 10",
    "0 ?? 10               // 0",
    "```",
    "",
    "Esto no es teoría. Un agente sin nombre registrado no es lo mismo que un agente",
    "cuyo nombre consta en blanco, y cero contactos no es lo mismo que «no sabemos",
    "cuántos contactos tiene». Confundirlos, en un informe, tiene consecuencias.",
)
