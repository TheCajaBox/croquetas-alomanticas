/**
 * El apunte de Wax para «vue2-02-directivas».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Las **directivas** son atributos que empiezan por `v-` y le dicen a la plantilla",
    "qué hacer:",
    "",
    "```html",
    "<p v-if=\"hayObjetos\">El cajón tiene cosas</p>",
    "<p v-else>El cajón está vacío</p>",
    "",
    "<li v-for=\"objeto in inventario\" :key=\"objeto.id\">{{ objeto.nombre }}</li>",
    "```",
    "",
    "Los **dos puntos** delante de un atributo (`:key`, `:class`) son la forma corta de",
    "`v-bind` y significan «lo de dentro es JavaScript, no texto»:",
    "",
    "```html",
    "<li class=\"fila\">                               <!-- la clase es \"fila\" -->",
    "<li :class=\"caro ? 'valioso' : 'baratija'\">     <!-- la clase se calcula -->",
    "```",
    "",
    "Sobre `:key`, que no es decoración. Cuando la lista cambia, Vue reaprovecha las",
    "filas que ya tenía pintadas, y la `key` es lo único que le dice cuál era cuál. Sin",
    "ella, al reordenar el inventario, la etiqueta de la Vigilante puede acabar pegada",
    "al sombrero de Wayne y nadie sabrá por qué.",
    "",
    "Usa siempre un identificador estable, nunca la posición en la lista.",
)
