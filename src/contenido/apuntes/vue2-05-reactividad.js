/**
 * El apunte de Wax para «vue2-05-reactividad».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Y aquí está la manía famosa de la casa vieja. Conviene entenderla, no memorizarla.",
    "",
    "Cuando Vue 2 monta un componente, recorre el objeto de `data` y sustituye cada",
    "propiedad **que existe en ese momento** por accesores suyos, para enterarse de",
    "cuándo cambian. Es como pasar inventario el día que se abre la casa: lo que estaba",
    "ese día queda anotado, y lo que llegue después entra sin que nadie lo apunte.",
    "",
    "De ahí salen dos huecos:",
    "",
    "```js",
    "this.inventario.cuerda = 1   // clave NUEVA: no estaba en el inventario",
    "this.balas[0] = 0            // índice por corchetes: tampoco",
    "```",
    "",
    "En los dos casos **el dato cambia de verdad** —compruébalo— pero nadie avisa a",
    "Vue, así que no vuelve a pintar. El cargamento ha llegado y no consta.",
    "",
    "La solución es `$set`, que da de alta la propiedad **y** avisa:",
    "",
    "```js",
    "this.$set(this.inventario, 'cuerda', 1)",
    "this.$set(this.balas, 0, 0)",
    "```",
    "",
    "Para listas también sirven los métodos que Vue sí intercepta: `push`, `splice`,",
    "`pop`, `shift`, `sort`, `reverse`.",
    "",
    "Vue 3 no tiene este problema: usa `Proxy` y se entera de todo, incluso de lo que",
    "llega después. Es de las razones de peso por las que existe Vue 3.",
)
