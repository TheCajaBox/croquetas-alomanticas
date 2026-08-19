/**
 * El apunte de Wax para «es6-03-desestructurar».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "**Desestructurar** es sacar datos de una ficha dándoles nombre en el mismo gesto:",
    "",
    "```js",
    "const cartel = { nombre: 'Wayne', recompensa: 500 }",
    "",
    "const nombre = cartel.nombre             // a la antigua",
    "const { nombre, recompensa } = cartel    // desestructurando",
    "```",
    "",
    "Tres cosas más, que son las que se usan de verdad:",
    "",
    "```js",
    "const { recompensa = 0 } = {}             // valor por defecto si no viene",
    "const { senas: { sombrero } } = cartel    // anidado",
    "const { nombre, ...resto } = cartel       // resto: todo lo demás",
    "```",
    "",
    "Y se puede hacer **en el propio paréntesis de la función**, que es lo cómodo:",
    "",
    "```js",
    "function resumir({ nombre, recompensa = 0 }) {",
    "  return `${nombre}: ${recompensa} monedas`",
    "}",
    "```",
    "",
    "Cuidado con lo anidado. Los carteles llegan de la imprenta como llegan: a algunos",
    "les falta la descripción entera. Si `senas` puede no venir, dale también su valor",
    "por defecto (`senas: { sombrero } = {}`) o el programa se para intentando abrir una",
    "casilla que no existe.",
)
