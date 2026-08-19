/**
 * El apunte de Wax para «vue3-03-computed».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "`computed` es lo mismo que en la casa vieja —un valor calculado que se guarda y",
    "solo se rehace cuando cambia algo de lo que usa— pero aquí se declara como una",
    "función más dentro de `setup`:",
    "",
    "```js",
    "const colonia = ref([...])",
    "const soloHambrientos = ref(false)",
    "",
    "const visibles = computed(() =>",
    "  soloHambrientos.value ? colonia.value.filter((g) => g.hambre > 50) : colonia.value,",
    ")",
    "```",
    "",
    "Dos cosas que se olvidan siempre:",
    "",
    "1. Dentro del `computed` hay que usar `.value` en los refs, como en todo `setup`.",
    "2. Lo que devuelve `computed` **es también un ref**: fuera se lee con",
    "   `visibles.value`; en la plantilla, sin `.value`.",
    "",
    "Y un computed puede apoyarse en otro sin repetir el trabajo:",
    "",
    "```js",
    "const resumen = computed(() => `${visibles.value.length} de ${colonia.value.length}`)",
    "```",
    "",
    "Un censo se hace una vez y de ahí salen todos los informes. No se cuenta a la",
    "gente otra vez para cada papel.",
)
