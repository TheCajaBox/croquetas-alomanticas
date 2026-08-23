import { codigo, pista } from '../comun.js'

export default {
  id: "pozo-02-que-devuelve-el-map",
  mundo: "pozo",
  entorno: "php",
  tipo: "prediccion",
  titulo: "Lo que devuelve y lo que no",
  enunciado: codigo(
    "`array_map` devuelve una lista nueva. Eso significa dos cosas que se olvidan a la vez:",
    "que hay que **quedarse** con lo que devuelve, y que la lista de partida sigue como",
    "estaba.",
    "",
    "Lee el código y escribe, línea por línea, lo que imprime. Cuatro líneas.",
  ),
  codigoMostrado: codigo(
    "<?php",
    "",
    "$metales = ['acero', 'peltre'];",
    "",
    "array_map(fn($metal) => strtoupper($metal), $metales);",
    "echo implode(',', $metales) . PHP_EOL;",
    "",
    "$gritados = array_map(fn($metal) => strtoupper($metal), $metales);",
    "echo implode(',', $gritados) . PHP_EOL;",
    "echo implode(',', $metales) . PHP_EOL;",
    "echo count($gritados) . PHP_EOL;",
  ),
  respuestaEsperada: codigo(
    "acero,peltre",
    "ACERO,PELTRE",
    "acero,peltre",
    "2",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar($consola, 'la salida')->diceLoMismoQue(",
        "  'acero,peltre ACERO,PELTRE acero,peltre 2'",
        ");",
      ),
    },
  ],
  pistas: [
    pista("La primera llamada a `array_map` no se guarda en ninguna variable. Piensa qué pasa con lo que devuelve: nadie lo recoge.", 0),
    pista("`implode(',', $lista)` pega los elementos con comas en medio. Sirve para ver una lista de un vistazo.", 1),
    pista("Las líneas primera y tercera son idénticas, y esa es la lección: `array_map` **no cambia** la lista que le das. Devuelve otra.", 2),
  ],
  recompensa: { croquetas: 5 },
}
