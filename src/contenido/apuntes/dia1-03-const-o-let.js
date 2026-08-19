/**
 * El apunte de Wax para «dia1-03-const-o-let».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "En la constabilaría hay datos que no se tocan y datos que cambian cada día. La",
    "tarifa de un rastreador está fijada; los días que lleva persiguiendo a alguien, no.",
    "",
    "```js",
    "const tarifa = 25    // esto está fijado",
    "let dias = 3         // esto sube",
    "```",
    "",
    "A un `const` **no se le puede asignar otro valor**: el programa se para con un",
    "error. A un `let` sí.",
    "",
    "La norma: **empieza siempre por `const`**. Si luego hace falta que cambie, lo",
    "pasas a `let`. Así cada `let` es un aviso de «ojo, esto se mueve», y eso al leer",
    "código ajeno vale su peso en oro.",
    "",
    "Ahora, el matiz que despista. Con una lista o un objeto, `const` protege **la",
    "caja**, no lo que hay dentro:",
    "",
    "```js",
    "const equipo = ['Wax']",
    "equipo.push('Wayne')     // bien: es el mismo equipo, con uno más",
    "equipo = ['Marasi']      // error: le estás dando OTRO equipo",
    "```",
    "",
    "Sumar un hombre a la partida no es lo mismo que cambiar la partida entera.",
)
