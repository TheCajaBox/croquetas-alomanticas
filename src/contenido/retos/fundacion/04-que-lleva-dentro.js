import { codigo, pista } from '../comun.js'

export default {
  id: "fundacion-04-que-lleva-dentro",
  mundo: "fundacion",
  entorno: "php",
  tipo: "prediccion",
  titulo: "Lo que lleva dentro",
  enunciado: codigo(
    "Un objeto no es un array: se parece cuando lo miras y se comporta distinto en la cosa",
    "que más importa. Este reto es sobre eso.",
    "",
    "Lee el código y escribe, línea por línea, lo que imprime. Cuatro líneas.",
  ),
  codigoMostrado: codigo(
    "<?php",
    "",
    "class Saco",
    "{",
    "    public function __construct(public int $cuantos) {}",
    "}",
    "",
    "$uno = new Saco(4);",
    "$otro = $uno;",
    "$otro->cuantos = 99;",
    "echo $uno->cuantos . PHP_EOL;",
    "",
    "$lista = [4];",
    "$copia = $lista;",
    "$copia[0] = 99;",
    "echo $lista[0] . PHP_EOL;",
    "",
    "echo get_debug_type($uno) . PHP_EOL;",
    "echo ($uno instanceof Saco ? 'sí' : 'no') . PHP_EOL;",
  ),
  respuestaEsperada: codigo(
    "99",
    "4",
    "Saco",
    "sí",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: "esperar($consola, 'la salida')->diceLoMismoQue('99 4 Saco sí');",
    },
  ],
  pistas: [
    pista("En La Ceniza aprendiste que los arrays se copian al asignarlos. Con los objetos, PHP hace otra cosa. Esa es la primera línea.", 0),
    pista("`$otro = $uno` con un objeto no copia el objeto: copia la manija que lleva a él. Los dos nombres apuntan al mismo sitio.", 1),
    pista("`get_debug_type` devuelve el nombre de la clase, e `instanceof` pregunta si un objeto es de una clase. Las dos últimas líneas son fáciles; las dos primeras son el reto.", 2),
  ],
  recompensa: { croquetas: 6 },
}
