/**
 * El apunte de Wax para «melaan-01-de-bucle-a-metodo».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Reescribir código que ya funciona tiene nombre: **refactorizar**. Y no es",
    "perfeccionismo.",
    "",
    "```js",
    "// antes",
    "const caros = []",
    "for (let i = 0; i < metales.length; i += 1) {",
    "  if (metales[i].precio >= 30) caros.push(metales[i].nombre)",
    "}",
    "",
    "// después",
    "const caros = metales",
    "  .filter((metal) => metal.precio >= 30)",
    "  .map((metal) => metal.nombre)",
    "```",
    "",
    "Las dos hacen exactamente lo mismo. La diferencia está en **cuánto hay que leer para",
    "saber qué hacen**.",
    "",
    "En la primera versión tienes que seguir el bucle entero: mirar dónde empieza `i`,",
    "dónde acaba, qué se mete en `caros` y bajo qué condición. Solo al final entiendes",
    "que estaba filtrando y transformando.",
    "",
    "En la segunda lo pone: filtra y transforma. Los nombres de los métodos **son la",
    "explicación**.",
    "",
    "Un aviso, porque «reescribir» asusta: si hay tests, no es peligroso. Los tests son",
    "la red. Cambias la forma, los ejecutas y si siguen verdes es que el comportamiento",
    "no se ha movido. Sin tests, refactorizar sí es apostar.",
)
