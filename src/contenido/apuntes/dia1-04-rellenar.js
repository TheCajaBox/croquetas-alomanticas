/**
 * El apunte de Wax para «dia1-04-rellenar».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Aquí aparece `console.log`, que es la herramienta que más vas a usar en tu vida:",
    "",
    "```js",
    "console.log('lo que sea')",
    "```",
    "",
    "No cambia nada del programa; solo **anota** lo que le pases para que tú lo veas.",
    "Es la linterna: cuando algo no cuadra, la enciendes y miras dentro.",
    "",
    "Y aparecen las **plantillas de texto**, que van entre comillas invertidas —esas",
    "inclinadas hacia atrás— y dejan meter valores dentro con `${...}`:",
    "",
    "```js",
    "const sospechoso = 'Wayne'",
    "console.log(`Se busca a ${sospechoso}.`)   // Se busca a Wayne.",
    "```",
    "",
    "Con comillas normales no funciona: `'Se busca a ${sospechoso}'` sale tal cual,",
    "con llaves y todo. Tienen que ser las invertidas.",
    "",
    "Y dentro de `${...}` cabe una cuenta entera, no solo un nombre:",
    "",
    "```js",
    "console.log(`Quedan ${SOMBREROS - prestados}`)",
    "```",
)
