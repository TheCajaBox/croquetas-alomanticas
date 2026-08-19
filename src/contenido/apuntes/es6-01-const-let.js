/**
 * El apunte de Wax para «es6-01-const-let».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Dos formas de declarar, y una regla para elegir:",
    "",
    "```js",
    "const TARIFA_DIARIA = 25   // fijada por la casa",
    "let dias = 3               // sube cada jornada",
    "dias = 4                   // bien",
    "TARIFA_DIARIA = 30         // error: Assignment to constant variable",
    "```",
    "",
    "**Empieza siempre por `const`**, y pásalo a `let` solo cuando compruebes que ese",
    "valor tiene que cambiar. Leyendo código ajeno, cada `let` es un aviso de «esto se",
    "mueve», y saber qué se mueve y qué no es la mitad de entender un programa.",
    "",
    "Verás por ahí una tercera, `var`. Es la vieja, con reglas de alcance distintas que",
    "dan sorpresas de las que no avisan. En los Áridos está prohibida.",
    "",
    "Sobre los nombres: `TARIFA_DIARIA` en mayúsculas es una costumbre, no una regla.",
    "Significa «esto es una constante del sistema, no la toques». Nadie te obliga, pero",
    "todo el mundo lo entiende.",
)
