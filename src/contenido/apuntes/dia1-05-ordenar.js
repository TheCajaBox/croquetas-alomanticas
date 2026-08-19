/**
 * El apunte de Wax para «dia1-05-ordenar».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Un atestado se escribe en orden, y un programa se ejecuta igual: **línea a línea,",
    "de arriba abajo**. Cuando el ordenador llega a una línea, todo lo de arriba ya ha",
    "ocurrido y nada de lo de abajo ha ocurrido todavía.",
    "",
    "De ahí sale la regla más importante del orden:",
    "",
    "```js",
    "console.log(equipo)          // error: equipo todavía no existe",
    "const equipo = ['Wax']",
    "```",
    "",
    "Eso da un error de nombre feo, `Cannot access 'equipo' before initialization`,",
    "que en realidad dice algo muy sencillo: lo has usado antes de crearlo.",
    "",
    "Y lo mismo con los cambios. Si cuentas a la gente **antes** de que llegue el",
    "último, te sale el número de antes:",
    "",
    "```js",
    "const cuantos = equipo.length   // cuenta AHORA",
    "equipo.push('Wayne')            // y esto pasa después",
    "```",
    "",
    "Nadie firma un recuento y luego mete a otro en la lista. Programar es, en buena",
    "medida, tener cuidado con el orden.",
)
