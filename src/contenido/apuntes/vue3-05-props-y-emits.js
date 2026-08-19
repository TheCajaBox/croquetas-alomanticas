/**
 * El apunte de Wax para «vue3-05-props-y-emits».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "La idea es la misma que en la mansión —datos abajo, avisos arriba— con otra forma.",
    "",
    "Las props se declaran igual, pero **dentro de `setup` no hay `this`**: llegan como",
    "primer argumento.",
    "",
    "```js",
    "props: { gato: { type: Object, required: true } },",
    "emits: ['adoptar'],",
    "setup(props, { emit }) {",
    "  const adoptar = () => emit('adoptar', props.gato)",
    "  return { adoptar }",
    "},",
    "```",
    "",
    "- `props.gato`, nunca `this.gato`.",
    "- `emit` viene en el **segundo argumento**, el contexto.",
    "- `emits` declara qué avisos salen de este componente. No es obligatorio, pero sin",
    "  ello Vue trata el evento como un atributo cualquiera, y además nadie que abra el",
    "  fichero sabe qué manda hacia arriba.",
    "",
    "Piensa en `emits` como el membrete de un impreso: dice de qué oficina sale y qué",
    "puede pedir. Sin membrete llega igual, pero nadie sabe de dónde ha venido.",
    "",
    "Y como en la casa vieja: **las props no se tocan desde el hijo**. Son de quien las",
    "manda.",
)
