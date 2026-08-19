/**
 * El apunte de Wax para «melaan-02-codigo-viejo».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Modernizar código viejo no es cambiar cosas por gusto. Cada una de estas tres",
    "arregla un problema concreto.",
    "",
    "**`var` en vez de `const` y `let`.** `var` se escapa del bloque en el que está",
    "escrita, y eso produce fallos que cuesta muchísimo ver:",
    "",
    "```js",
    "if (true) { var suelta = 1 }",
    "console.log(suelta)   // 1, aunque parecía encerrada ahí dentro",
    "```",
    "",
    "**Pegar textos con `+`.** Funciona, pero en cuanto hay tres o cuatro trozos se",
    "convierte en un jeroglífico de comillas, y una coma mal puesta pega números en vez",
    "de sumarlos:",
    "",
    "```js",
    "'Se busca a ' + nombre + ', ' + recompensa + ' monedas'",
    "`Se busca a ${nombre}, ${recompensa} monedas`",
    "```",
    "",
    "**Funciones clásicas donde se pasan como valor.** Además de ser más largas, traen",
    "su propio `this`, que se pierde al pasarlas a otro sitio. La flecha no lo tiene y",
    "usa el de fuera, que casi siempre es el que quieres.",
    "",
    "Ninguna de las tres cambia lo que hace el programa. Las tres cambian cuánto cuesta",
    "leerlo y cuántas trampas esconde.",
)
