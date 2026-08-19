/**
 * El apunte de Wax para «com-10-el-registro».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "No hay nada nuevo aquí. Lo único nuevo es que hay que **juntarlo**, y eso también",
    "se aprende.",
    "",
    "El consejo que sirve para este reto y para los próximos veinte años: **no intentes",
    "escribirlo entero de una vez**. Va por partes, y cada parte se comprueba antes de",
    "seguir.",
    "",
    "```js",
    "function parteDelMes(casos) {",
    "  let cerrados = 0",
    "  let cobrado = 0",
    "",
    "  for (const caso of casos) {",
    "    if (caso.cerrado) {",
    "      cerrados += 1",
    "      cobrado += caso.recompensa",
    "    }",
    "  }",
    "",
    "  // ...y aquí se arma el objeto que se devuelve",
    "}",
    "```",
    "",
    "Fíjate en dos cosas del bucle:",
    "",
    "- Las dos sumas van **dentro del mismo `if`**. Si sacas `cobrado += ...` fuera,",
    "  estarás cobrando también los casos abiertos.",
    "- `if (caso.cerrado)` sin comparar con nada. Como `cerrado` ya es `true` o `false`,",
    "  poner `=== true` no añade nada.",
    "",
    "Y el total no necesita bucle: la lista ya sabe cuántos elementos tiene.",
    "",
    "## Devolver varias cosas a la vez",
    "",
    "Una función solo puede devolver **un** valor. Cuando hacen falta cuatro, ese valor",
    "es un objeto:",
    "",
    "```js",
    "return { total, cerrados, cobrado, resumen }",
    "```",
    "",
    "Y quien la llama saca lo que necesite: `parte.cobrado`. Es el patrón que vas a ver",
    "en todas partes, y es la razón por la que los objetos importan tanto.",
)
