import { codigo, pista } from '../comun.js'

export default {
  id: "ceniza-07-var-dump",
  mundo: "ceniza",
  entorno: "php",
  tipo: "prediccion",
  titulo: "Lo que dice var_dump",
  enunciado: codigo(
    "`var_dump` es la herramienta con la que se arregla la mitad de lo que se rompe: dice",
    "el tipo **y** el contenido de lo que le des. Aprender a leerlo ahorra horas.",
    "",
    "Su formato es siempre el mismo: `tipo(contenido)`. En los textos, además, el número",
    "de caracteres: `string(6) \"peltre\"`.",
    "",
    "Lee el código y escribe abajo, línea por línea, lo que sale. Seis líneas.",
  ),
  codigoMostrado: codigo(
    "<?php",
    "",
    "$cuantos = 3;",
    "$precio = 2.5;",
    "$nombre = '3';",
    "$vacio = '';",
    "",
    "var_dump($cuantos);",
    "var_dump($precio);",
    "var_dump($nombre);",
    "var_dump($vacio);",
    "var_dump($cuantos == $nombre);",
    "var_dump($cuantos === $nombre);",
  ),
  respuestaEsperada: codigo(
    "int(3)",
    "float(2.5)",
    'string(1) "3"',
    'string(0) ""',
    "bool(true)",
    "bool(false)",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar($consola, 'la salida')->diceLoMismoQue(",
        "  'int(3) float(2.5) string(1) \"3\" string(0) \"\" bool(true) bool(false)'",
        ");",
      ),
    },
  ],
  pistas: [
    pista("`2.5` no es un `int`. Y `'3'` con comillas tampoco: mira el tipo de cada variable antes de escribir nada.", 0),
    pista("En los textos, el número entre paréntesis es cuántos caracteres tiene. El texto vacío tiene cero.", 1),
    pista("Las dos últimas son la clave del reto: `==` compara el valor y se permite convertir de un tipo a otro; `===` exige que además el tipo sea el mismo. Uno de los dos dice que sí y el otro que no.", 2),
  ],
  recompensa: { croquetas: 6 },
}
