/**
 * El apunte de Wax para «es6-01b-funciones-que-viajan».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "En JavaScript, **una función también es un valor**. Se puede guardar en una",
    "variable, meter en una lista y, sobre todo, **pasársela a otra función** para que",
    "la use cuando le convenga.",
    "",
    "```js",
    "const doblar = (n) => n * 2",
    "",
    "doblar        // la función en sí, sin usar",
    "doblar(4)     // usarla ahora mismo: da 8",
    "```",
    "",
    "Esa diferencia es la clave, y hay que verla bien:",
    "",
    "- **sin paréntesis** entregas la función, para que la use quien tú le digas;",
    "- **con paréntesis** la usas tú en ese momento y entregas su resultado.",
    "",
    "Por eso se escribe `numeros.map(doblar)` y no `numeros.map(doblar())`. A `map` le",
    "entregas la herramienta; ya la usará él con cada elemento. Si le pasas",
    "`doblar()`, la usas tú una vez, sin nada que doblar, y le entregas el resultado",
    "de eso, que no sirve para nada.",
    "",
    "Es la misma idea que hay detrás de un encargo: le dejas a alguien el",
    "procedimiento a seguir, no el resultado de haberlo seguido tú.",
)
