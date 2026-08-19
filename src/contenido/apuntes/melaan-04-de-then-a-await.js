/**
 * El apunte de Wax para «melaan-04-de-then-a-await».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Una promesa se puede esperar de dos maneras.",
    "",
    "Con `.then`, encadenando: cada paso recibe el resultado del anterior y devuelve el",
    "siguiente. Cuando un paso necesita algo de **dos pasos atrás**, hay que ir",
    "arrastrando el valor hacia abajo, y ahí es donde se dispara la sangría.",
    "",
    "```js",
    "avisar('Wax').then((uno) =>",
    "  avisar('Wayne').then((dos) =>",
    "    avisar('Marasi').then((tres) => [uno, dos, tres])))",
    "```",
    "",
    "Con `async` y `await`, en línea recta:",
    "",
    "```js",
    "const uno = await avisar('Wax')",
    "const dos = await avisar('Wayne')",
    "const tres = await avisar('Marasi')",
    "return [uno, dos, tres]",
    "```",
    "",
    "Lo mismo, paso a paso, y cada valor se queda a mano en su variable.",
    "",
    "`await` solo puede usarse dentro de una función `async`. Y una función `async`",
    "siempre devuelve una promesa, así que quien la llame también tendrá que esperarla.",
    "",
    "Un detalle que importa: así escrito, cada aviso espera al anterior. Si los tres son",
    "independientes y pueden ir a la vez, lo correcto es `Promise.all`. Aquí van en",
    "orden a propósito.",
)
