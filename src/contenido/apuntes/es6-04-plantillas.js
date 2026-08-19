/**
 * El apunte de Wax para «es6-04-plantillas».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Las **plantillas de texto** van entre comillas invertidas y admiten meter valores",
    "con `${...}`:",
    "",
    "```js",
    "const nombre = 'Wayne'",
    "console.log(`Se busca a ${nombre}.`)   // Se busca a Wayne.",
    "```",
    "",
    "Pero lo que hay que tener claro en este reto es otra cosa: **el `+` no siempre",
    "suma**.",
    "",
    "Si uno de los dos lados es texto, JavaScript convierte el otro y los **pega**:",
    "",
    "```js",
    "'500' + 25          // '50025'  (pega)",
    "500 + 25            // 525      (suma)",
    "Number('500') + 25  // 525      (convierte y luego suma)",
    "```",
    "",
    "Todo lo que llega escrito a mano —un campo de un formulario, una cifra copiada de",
    "un cartel— llega como texto, aunque parezca un número. Si vas a operar con ello,",
    "conviértelo antes. He visto cuentas de recompensas cuadrar mal por esto y a nadie",
    "encontrar el fallo en dos días.",
)
