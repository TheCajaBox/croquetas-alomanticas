/**
 * El apunte de Wax para «melaan-07-la-migracion».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "La traducción de los ganchos de ciclo de vida es casi una tabla:",
    "",
    "| Casa vieja | Ciudad nueva |",
    "|---|---|",
    "| `created` | el cuerpo de `setup` |",
    "| `mounted` | `onMounted(() => ...)` |",
    "| `beforeDestroy` | `onBeforeUnmount(() => ...)` |",
    "| `watch: { x(nuevo, viejo) }` | `watch(x, (nuevo, viejo) => ...)` |",
    "",
    "`created` no tiene gancho porque no le hace falta: `setup` **se ejecuta en ese",
    "mismo momento**, antes de que exista nada en pantalla. Lo que ponías en `created`",
    "va suelto en el cuerpo.",
    "",
    "```js",
    "setup() {",
    "  const segundos = ref(0)",
    "  registro.value.push('setup')          // esto era created",
    "",
    "  let temporizador",
    "  onMounted(() => {",
    "    temporizador = setInterval(() => { segundos.value += 1 }, 20)",
    "  })",
    "  onBeforeUnmount(() => clearInterval(temporizador))",
    "",
    "  watch(segundos, (nuevo, viejo) => { /* ... */ })",
    "",
    "  return { segundos }",
    "}",
    "```",
    "",
    "Fíjate en `temporizador`: es un `let` normal, no un `ref`. No se pinta en ninguna",
    "parte, así que no hay nada que vigilar; solo hace falta poder apagarlo luego.",
    "Envolver en `ref` cosas que no se pintan es un vicio muy común al llegar aquí.",
    "",
    "Y lo de recoger sigue siendo igual de obligatorio que en la casa vieja: un",
    "intervalo que no se para **sigue corriendo cuando el componente ya no existe**. Que",
    "el edificio sea nuevo no lo arregla.",
)
