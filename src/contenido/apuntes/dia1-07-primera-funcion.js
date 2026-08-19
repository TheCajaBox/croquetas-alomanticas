/**
 * El apunte de Wax para «dia1-07-primera-funcion».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Una **función** es un procedimiento con nombre: lo escribes una vez y lo aplicas",
    "tantas veces como haga falta. En mi oficio hay uno para tomar declaración y otro",
    "para levantar acta; da igual quién esté delante, los pasos son los mismos.",
    "",
    "```js",
    "function saludar(nombre) {",
    "  return `Buenas, ${nombre}.`",
    "}",
    "",
    "saludar('Wayne')    // 'Buenas, Wayne.'",
    "saludar('Marasi')   // 'Buenas, Marasi.'",
    "```",
    "",
    "Las piezas:",
    "",
    "- `function` — «voy a declarar un procedimiento»",
    "- `saludar` — su nombre",
    "- `(nombre)` — el **parámetro**: el hueco que se rellena al usarlo",
    "- `{ ... }` — lo que hace",
    "- `return` — **lo que entrega** a quien lo ha llamado",
    "",
    "Lo de `return` es lo que más cuesta. `console.log` **enseña** algo y ahí se queda;",
    "`return` **entrega** un valor para que quien llamó pueda seguir trabajando con él.",
    "Una cosa es leer una declaración en voz alta y otra firmarla y darla.",
    "",
    "Una función sin `return` devuelve `undefined`, que es la forma que tiene",
    "JavaScript de encogerse de hombros.",
)
