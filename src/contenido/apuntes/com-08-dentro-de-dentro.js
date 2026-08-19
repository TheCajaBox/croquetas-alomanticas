/**
 * El apunte de Wax para «com-08-dentro-de-dentro».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Se combinan sin misterio: donde cabe un valor, cabe un objeto o una lista.",
    "",
    "```js",
    "const agentes = [",
    "  { nombre: 'Wax', casos: ['Bleeder', 'Suit'], jefe: { nombre: 'Aradel' } },",
    "  { nombre: 'Marasi', casos: [], jefe: { nombre: 'Aradel' } },",
    "]",
    "```",
    "",
    "Y se leen **de izquierda a derecha**, un paso cada vez:",
    "",
    "```js",
    "agentes[0]                  // el objeto de Wax",
    "agentes[0].casos            // ['Bleeder', 'Suit']",
    "agentes[0].casos[1]         // 'Suit'",
    "agentes[0].jefe.nombre      // 'Aradel'",
    "```",
    "",
    "No hay que entenderlo entero de golpe: se lee por trozos, y cada trozo devuelve",
    "algo sobre lo que sigues.",
    "",
    "## Dónde revienta",
    "",
    "```js",
    "agentes[5]              // undefined: no da error",
    "agentes[5].nombre       // ERROR",
    "```",
    "",
    "Esta es **la** causa de «Cannot read properties of undefined». Fíjate en que el",
    "error no está donde parece: `agentes[5]` no protesta, se calla y devuelve",
    "`undefined`. El que revienta es el `.nombre` de después, porque `undefined` no",
    "tiene propiedades. Cuando veas ese error, mira lo que hay **a la izquierda** del",
    "punto que falla.",
    "",
    "## Contar dentro de cada uno",
    "",
    "```js",
    "for (const agente of agentes) {",
    "  console.log(`${agente.nombre}: ${agente.casos.length}`)",
    "}",
    "```",
    "",
    "El bucle recorre la lista de fuera; dentro, cada elemento es un objeto normal y",
    "corriente al que le puedes pedir lo que quieras.",
)
