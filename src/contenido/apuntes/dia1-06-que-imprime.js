/**
 * El apunte de Wax para «dia1-06-que-imprime».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "El signo `+` hace dos cosas distintas según lo que tenga a los lados:",
    "",
    "```js",
    "6 + 2            // 8              dos números: suma",
    "'Quedan ' + 6    // 'Quedan 6'     hay un texto: pega",
    "```",
    "",
    "Cuando uno de los dos lados es texto, JavaScript convierte el otro a texto y los",
    "**pega**. Y lo hace **de izquierda a derecha, por parejas**:",
    "",
    "```js",
    "'Quedan ' + 4 + 1",
    "// primero:  'Quedan ' + 4   →  'Quedan 4'",
    "// después:  'Quedan 4' + 1  →  'Quedan 41'",
    "```",
    "",
    "Para que sume antes de pegar, hay que decirlo con paréntesis:",
    "",
    "```js",
    "'Quedan ' + (4 + 1)   // 'Quedan 5'",
    "```",
    "",
    "He visto informes con cifras imposibles por esto exactamente. Una recompensa de",
    "quinientos que aparecía como cincuenta mil porque alguien pegó dos números en vez",
    "de sumarlos.",
)
