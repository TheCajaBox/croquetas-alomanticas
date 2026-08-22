import { codigo, pista } from '../comun.js'

export default {
  id: "ceniza-02-que-imprime",
  mundo: "ceniza",
  entorno: "php",
  tipo: "prediccion",
  titulo: "Lo que hay dentro de la variable",
  enunciado: codigo(
    "Aquí no se escribe: se piensa.",
    "",
    "En PHP las variables empiezan por `$`. Y hay una cosa que sorprende a todo el mundo el",
    "primer día: **las comillas no son todas iguales**. Con comillas dobles, PHP mira dentro",
    "del texto y sustituye las variables; con comillas simples, no mira nada.",
    "",
    "Lee el código, decide exactamente qué se imprime y escríbelo abajo, una línea por `echo`.",
  ),
  codigoMostrado: codigo(
    "<?php",
    "",
    "$metal = 'peltre';",
    "$cuantos = 3;",
    "",
    'echo "Llevo $cuantos de $metal" . PHP_EOL;',
    "echo 'Llevo $cuantos de $metal' . PHP_EOL;",
    'echo "Y " . ($cuantos + 1) . " mañana" . PHP_EOL;',
  ),
  respuestaEsperada: codigo(
    "Llevo 3 de peltre",
    "Llevo $cuantos de $metal",
    "Y 4 mañana",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      // Los dólares van escapados (`\\$`) a propósito, y aquí está la broma: la
      // cadena esperada va entre comillas dobles, así que sin escapar PHP
      // sustituiría `$cuantos` y `$metal` DENTRO DEL TEST y compararía contra
      // otra cosa. Pasó de verdad al escribir este reto, que es justo el que
      // enseña esto.
      codigo: codigo(
        "esperar($consola, 'la salida')->diceLoMismoQue(",
        '  "Llevo 3 de peltre\\nLlevo \\$cuantos de \\$metal\\nY 4 mañana"',
        ");",
      ),
    },
  ],
  pistas: [
    pista("Dos de los tres `echo` llevan comillas dobles. Uno no.", 0),
    pista("Con comillas simples PHP no toca nada de lo que hay dentro: sale tal cual, con el dólar y todo.", 1),
    pista("La primera línea sustituye las dos variables; la segunda sale literal; la tercera suma antes de imprimir.", 2),
  ],
  recompensa: { croquetas: 5 },
}
