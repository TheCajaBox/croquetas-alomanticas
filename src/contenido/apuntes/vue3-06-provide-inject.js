/**
 * El apunte de Wax para «vue3-06-provide-inject».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Pasar una prop de padre a hijo está bien. Pasarla de padre a hijo a nieto a",
    "bisnieto, cuando los de en medio ni la usan, tiene nombre propio —*prop",
    "drilling*— y es un incordio: media plantilla haciendo de recadera.",
    "",
    "`provide` e `inject` saltan los pisos intermedios:",
    "",
    "```js",
    "// arriba",
    "setup() {",
    "  const colonia = ref(['Acero'])",
    "  provide('colonia', colonia)",
    "}",
    "",
    "// abajo, tan abajo como quieras",
    "setup() {",
    "  const colonia = inject('colonia')",
    "  return { colonia }",
    "}",
    "```",
    "",
    "Lo importante: **comparte el `ref` entero, no `colonia.value`**. Si compartes el",
    "valor, el de abajo se queda con una copia de ese momento y no se entera de nada",
    "más. Otra vez la copia en el bolsillo.",
    "",
    "Y un aviso de oficio: esto crea una dependencia que **no se ve leyendo la",
    "plantilla**. Está muy bien para lo que atraviesa el edificio entero —el tema, el",
    "idioma, quién eres— y bastante mal como sustituto general de las props. Un canal",
    "directo con el ático es útil; llevar toda la casa por canales directos es un",
    "sistema donde nadie sabe de dónde le llegan las órdenes.",
)
