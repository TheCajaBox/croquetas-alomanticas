/**
 * El apunte de Wax para «vue2-01-instancia».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "La mansión Ladrian tiene sus costumbres: cada cosa en su cajón y cada cajón con su",
    "etiqueta. Un componente de Vue 2 es exactamente eso.",
    "",
    "```js",
    "const componente = {",
    "  data() {",
    "    return { senor: 'Waxillium' }",
    "  },",
    "  template: `<p>{{ senor }}</p>`,",
    "}",
    "```",
    "",
    "- `data` guarda el estado de la casa. Lo que devuelva se pinta con **dobles llaves**.",
    "- `template` es lo que se ve.",
    "",
    "Y aquí la primera manía: **`data` tiene que ser una función que devuelve un",
    "objeto**, no un objeto suelto.",
    "",
    "El motivo es muy concreto. Un componente se monta muchas veces —una tarjeta por",
    "gato, una fila por objeto del inventario— y si `data` fuera un objeto, todas las",
    "copias compartirían el mismo. Cambiarías el candelabro de una habitación y se",
    "cambiaría en las treinta y cuatro.",
    "",
    "Siendo función, Vue la llama una vez por copia y cada habitación recibe su propio",
    "inventario recién hecho.",
)
