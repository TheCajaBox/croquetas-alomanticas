import { codigo } from '../comun.js'

export default {
  id: "ceniza-12-el-informe",
  mundo: "ceniza",
  entorno: "php",
  tipo: "codigo",
  jefe: true,
  titulo: "Jefe: el informe de la cuadrilla",
  enunciado: codigo(
    "Aquí no hay pistas. Todo lo que hace falta lo has visto en los tres retos de antes.",
    "",
    "Escribe `informe(array $cuadrilla): string`, que recibe una lista de nombres y devuelve",
    "**una sola cadena** con una línea por persona, en este formato:",
    "",
    "```",
    "1. Kelsier",
    "2. Brisa",
    "3. Ham",
    "```",
    "",
    "Cada línea acaba en `PHP_EOL`, incluida la última. Con la cuadrilla vacía devuelve la",
    "cadena vacía.",
  ),
  inicial: codigo(
    "<?php",
    "",
    "function informe(array $cuadrilla): string",
    "{",
    "    // Un acumulador, un foreach y un contador que empieza en 1.",
    "}",
  ),
  solucion: codigo(
    "<?php",
    "",
    "function informe(array $cuadrilla): string",
    "{",
    "    $texto = '';",
    "    $numero = 1;",
    "    foreach ($cuadrilla as $persona) {",
    "        $texto .= $numero . '. ' . $persona . PHP_EOL;",
    "        $numero += 1;",
    "    }",
    "    return $texto;",
    "}",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "foreach", texto: "Recorre la cuadrilla con `foreach`" },
    { tipo: "usaPalabra", valor: "return", texto: "Devuelve el informe con `return`, no lo imprimas" },
  ],
  tests: [
    {
      nombre: "numera a los tres, uno por línea",
      codigo: codigo(
        "esperar(informe(['Kelsier', 'Brisa', 'Ham']), 'el informe')",
        '  ->igualA("1. Kelsier" . PHP_EOL . "2. Brisa" . PHP_EOL . "3. Ham" . PHP_EOL);',
      ),
    },
    {
      nombre: "empieza a contar en uno, no en cero",
      codigo: "esperar(informe(['Vin']), 'el informe')->contiene('1. Vin');",
    },
    {
      nombre: "una cuadrilla vacía no da informe",
      codigo: "esperar(informe([]), 'el informe')->igualA('');",
    },
    {
      nombre: "la última línea también lleva su salto",
      codigo: "esperar(informe(['Vin']), 'el informe')->igualA('1. Vin' . PHP_EOL);",
    },
    {
      nombre: "pasa del nueve al diez sin descolocarse",
      codigo: codigo(
        "$diez = informe(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);",
        "esperar($diez, 'el informe de diez')->contiene('9. i' . PHP_EOL . '10. j');",
      ),
    },
    {
      nombre: "no se cuela un número de más al final",
      codigo: codigo(
        "esperar(informe(['Vin', 'Elend']), 'el informe')",
        "  ->noContiene('3.');",
      ),
    },
    {
      nombre: "los nombres salen tal cual, sin tocarlos",
      codigo: codigo(
        "esperar(informe(['Tindwyl', 'Sazed']), 'el informe')->contiene('1. Tindwyl');",
        "esperar(informe(['0']), 'el informe')->igualA('1. 0' . PHP_EOL);",
      ),
    },
    {
      nombre: "devuelve el informe, no lo imprime",
      codigo: codigo(
        "// Un `echo` dentro de la función deja la consola con texto y esto lo caza:",
        "// es la confusión de siempre entre devolver y imprimir.",
        "informe(['Vin']);",
        "esperar($consola, 'la consola')->igualA('');",
      ),
    },
  ],
  recompensa: { croquetas: 12 },
}
