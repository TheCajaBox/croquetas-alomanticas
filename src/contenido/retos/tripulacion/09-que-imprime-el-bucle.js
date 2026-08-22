import { codigo, pista } from '../comun.js'

export default {
  id: "tripulacion-09-que-imprime-el-bucle",
  mundo: "tripulacion",
  entorno: "php",
  tipo: "prediccion",
  titulo: "Lo que imprime el bucle",
  enunciado: codigo(
    "Aquí no se escribe: se piensa.",
    "",
    "Hay dos palabras nuevas en este código y las dos cortan un bucle: `continue` salta el",
    "resto de **esa vuelta** y sigue con la siguiente; `break` sale del bucle entero.",
    "",
    "Lee el código, decide exactamente qué se imprime y escríbelo abajo, una línea por línea.",
  ),
  codigoMostrado: codigo(
    "<?php",
    "",
    "$almacen = ['acero' => 4, 'peltre' => 0, 'oro' => 2, 'estaño' => 9];",
    "",
    "foreach ($almacen as $metal => $cuantos) {",
    "    if ($cuantos === 0) {",
    "        continue;",
    "    }",
    "    if ($metal === 'estaño') {",
    "        break;",
    "    }",
    "    echo $metal . ': ' . $cuantos . PHP_EOL;",
    "}",
    "",
    "echo 'Metales en el almacén: ' . count($almacen) . PHP_EOL;",
  ),
  respuestaEsperada: codigo(
    "acero: 4",
    "oro: 2",
    "Metales en el almacén: 4",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar($consola, 'la salida')->diceLoMismoQue(",
        '  "acero: 4\\noro: 2\\nMetales en el almacén: 4"',
        ");",
      ),
    },
  ],
  pistas: [
    pista("Ve metal por metal, en el orden en que están escritos, y decide para cada uno si llega al `echo`.", 0),
    pista("El peltre no llega: su `continue` salta el resto de la vuelta. El estaño tampoco, pero por otro motivo y con otra consecuencia.", 1),
    pista("La última línea es la trampa: `count` cuenta lo que hay en el array, y el bucle no ha quitado nada de él. Saltarse elementos al recorrer no los borra.", 2),
  ],
  recompensa: { croquetas: 6 },
}
