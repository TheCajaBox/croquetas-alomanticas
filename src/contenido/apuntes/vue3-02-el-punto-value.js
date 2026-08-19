/**
 * El apunte de Wax para «vue3-02-el-punto-value».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "`ref` y `reactive` hacen lo mismo por caminos distintos.",
    "",
    "- `ref(valor)` mete **cualquier cosa** en una caja con `.value`.",
    "- `reactive(objeto)` te devuelve una **versión vigilada del objeto**, sin `.value`.",
    "",
    "```js",
    "const contador = ref(10)",
    "contador.value += 5           // con .value",
    "",
    "const estado = reactive({ balas: 6 })",
    "estado.balas = 1              // sin .value",
    "```",
    "",
    "Y ahora el problema de verdad. Esto **rompe la reactividad**:",
    "",
    "```js",
    "const { balas } = estado      // parece cómodo",
    "estado.balas = 1",
    "console.log(balas)            // 6, el valor de cuando lo sacaste",
    "```",
    "",
    "Al desestructurar te llevas **el valor**, no el vínculo con el objeto. La",
    "vigilancia está sobre el objeto, no sobre la copia que sacaste de él.",
    "",
    "Es la diferencia entre consultar el registro y llevarte una copia del registro en",
    "el bolsillo. La copia no se entera de nada de lo que pase después.",
    "",
    "Si quieres desestructurar sin perder el vínculo, existe `toRefs`, que convierte",
    "cada propiedad en su propio `ref`:",
    "",
    "```js",
    "const { balas } = toRefs(estado)",
    "balas.value    // sigue vivo",
    "```",
)
