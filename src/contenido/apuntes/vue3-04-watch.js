/**
 * El apunte de Wax para «vue3-04-watch».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Dos centinelas que se parecen y no son lo mismo.",
    "",
    "**`watch`** espera. No hace nada hasta que cambia lo que vigila, y entonces te da",
    "el valor nuevo y el viejo:",
    "",
    "```js",
    "watch(balas, (nuevo, viejo) => {",
    "  console.log(`de ${viejo} a ${nuevo}`)",
    "})",
    "```",
    "",
    "**`watchEffect`** se lanza enseguida, una vez, y averigua solo de qué depende",
    "mirando lo que lee por dentro. A partir de ahí se vuelve a lanzar cuando cambie",
    "cualquiera de esas cosas:",
    "",
    "```js",
    "watchEffect(() => {",
    "  console.log(`ahora quedan ${balas.value}`)   // se ejecuta ya",
    "})",
    "```",
    "",
    "Cuál usar:",
    "",
    "- Necesitas el **valor anterior**, o vigilar algo muy concreto → `watch`.",
    "- Quieres mantener algo al día y el valor viejo te da igual → `watchEffect`.",
    "",
    "`watch` es el que apunta en el parte «tenía seis, ahora tiene cuatro».",
    "`watchEffect` es el que va diciendo en voz alta cuántas quedan, empezando ahora",
    "mismo.",
    "",
    "Y si lo único que quieres es **calcular** un valor a partir de otros, no uses",
    "ninguno de los dos: eso es `computed`.",
)
