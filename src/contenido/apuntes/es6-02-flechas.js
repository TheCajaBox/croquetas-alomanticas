/**
 * El apunte de Wax para «es6-02-flechas».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Una función se puede escribir de dos maneras:",
    "",
    "```js",
    "const doble = function (n) { return n * 2 }   // clásica",
    "const doble = (n) => n * 2                    // flecha",
    "```",
    "",
    "La flecha no es solo más corta: cambia una cosa de fondo, y es **`this`**.",
    "",
    "`this` es «el objeto sobre el que se está trabajando». Una función clásica trae su",
    "propio `this`, que depende de cómo se la llame; si se la pasas a `map` o a",
    "`setTimeout`, ese `this` se pierde por el camino y queda en `undefined`.",
    "",
    "Una función flecha **no tiene `this` propio**: usa el del sitio donde está",
    "escrita. Dentro de un método, eso es justo lo que quieres:",
    "",
    "```js",
    "const guardia = {",
    "  turno: 'noche',",
    "  gente: ['Wayne', 'Marasi'],",
    "  pasarLista() {",
    "    return this.gente.map((n) => `${n} está en el turno de ${this.turno}`)",
    "  },",
    "}",
    "```",
    "",
    "Con la clásica, `this.turno` de dentro ya no es el del objeto: es otro `this` que",
    "no conoce ningún turno. Es como mandar a alguien a pasar lista y que se le olvide",
    "de qué guardia venía.",
)
