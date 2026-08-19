/**
 * El apunte de Wax para «dia1-02-tipos».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "En una ficha de busca y captura no todo es de la misma clase: el nombre es texto,",
    "la recompensa es una cifra, y «visto con vida» es un sí o un no. En JavaScript",
    "pasa igual, y con estos cinco te apañas casi siempre:",
    "",
    "```js",
    "'Wayne'              // texto: entre comillas",
    "500                  // número: sin comillas",
    "true                 // booleano: solo true o false",
    "['Wax', 'Marasi']    // lista: varios valores en orden",
    "{ nombre: 'Wayne' }  // objeto: valores con nombre",
    "```",
    "",
    "Y uno más, que confunde a todo el mundo al principio:",
    "",
    "```js",
    "null   // «aquí no hay nada, y consta que no lo hay»",
    "```",
    "",
    "`null` no es lo mismo que un cero ni que un texto vacío. Es la casilla de la ficha",
    "que se dejó en blanco **a propósito**.",
    "",
    "La diferencia entre `500` y `'500'` no es un capricho de la máquina: con el",
    "primero puedes sumar recompensas; con el segundo, si lo intentas, JavaScript pega",
    "los textos y te salen cifras que no existen. Ya te tocará ver una.",
)
