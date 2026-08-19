/**
 * El apunte de Wax para «vue2-04-computed-vs-methods».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Los dos devuelven un valor calculado. La diferencia está en **cuándo trabajan**.",
    "",
    "Un **`method`** es una llamada normal: se ejecuta cada vez que lo llamas. Si la",
    "plantilla lo usa tres veces, se ejecuta tres veces por pintado.",
    "",
    "Un **`computed`** guarda su resultado. Se calcula una vez, y en las siguientes",
    "lecturas entrega lo que ya tenía. Solo vuelve a calcular cuando cambia alguno de",
    "los datos que usa por dentro.",
    "",
    "```js",
    "computed: {",
    "  valiosos() { return this.inventario.filter((o) => o.valor > 100) },",
    "},",
    "methods: {",
    "  contarValiosos() { return this.inventario.filter((o) => o.valor > 100).length },",
    "},",
    "```",
    "",
    "La norma: si el valor **sale solo de los datos**, `computed`. Si además hace algo",
    "—guardar, avisar, pedir algo fuera—, `method`.",
    "",
    "Es la diferencia entre tener el inventario tasado y encargar una tasación cada vez",
    "que alguien pregunta por él. Con treinta objetos da igual; con tres mil, no.",
)
