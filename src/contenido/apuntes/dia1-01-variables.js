/**
 * El apunte de Wax para «dia1-01-variables».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Yo llevo un cuaderno donde apunto lo que voy sabiendo de cada caso. Un nombre,",
    "una cifra, una dirección. Programar se parece bastante a eso: **guardar algo y",
    "ponerle un nombre** para poder volver a mirarlo luego.",
    "",
    "```js",
    "const sombrero = 'bombín'",
    "```",
    "",
    "Se lee de izquierda a derecha:",
    "",
    "- `const` — «voy a apuntar algo que no va a cambiar»",
    "- `sombrero` — el nombre con el que lo apunto",
    "- `=` — «guarda esto ahí» (y ojo: **no** significa «es igual a»)",
    "- `'bombín'` — el valor. Es texto, y por eso va entre comillas",
    "",
    "A partir de esa línea, donde escribas `sombrero` el ordenador entiende `'bombín'`.",
    "",
    "El nombre lo eliges tú, y elegirlo bien es media profesión. En mi cuaderno pone",
    "«sospechoso» y «recompensa», no «cosa» y «cosa 2». Cuando vuelva a abrirlo dentro",
    "de un mes lo agradeceré.",
)
