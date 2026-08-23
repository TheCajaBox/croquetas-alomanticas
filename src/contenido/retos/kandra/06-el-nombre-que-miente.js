import { codigo, pista } from '../comun.js'

export default {
  id: "kandra-06-el-nombre-que-miente",
  mundo: "kandra",
  entorno: "php",
  tipo: "refactor",
  titulo: "Los nombres que no dicen nada",
  enunciado: codigo(
    "Este código funciona y no se puede leer, y no es por los `if` ni por los bucles: es por",
    "los nombres. `$d`, `$x`, `$tmp`, `proc()`. Para saber qué hace hay que ejecutarlo en la",
    "cabeza.",
    "",
    "Cámbiale los nombres. Nada más: ni una línea de lógica.",
    "",
    "- `proc` → `expedicionesBuenas`",
    "- y dentro, nombres que digan qué es cada cosa.",
    "",
    "Los tests llaman a `expedicionesBuenas`, así que el nombre de la función es obligatorio;",
    "los de dentro los eliges tú, y **no puede quedar ninguno de una sola letra**.",
  ),
  inicial: codigo(
    "<?php",
    "",
    "function proc(array $d, int $m): array",
    "{",
    "    $r = [];",
    "    foreach ($d as $x) {",
    "        $t = ($x['s'] ?? 0) - ($x['p'] ?? 0);",
    "        if ($t >= $m) {",
    "            $r[] = ['n' => $x['n'] ?? '?', 't' => $t];",
    "        }",
    "    }",
    "    return $r;",
    "}",
  ),
  solucion: codigo(
    "<?php",
    "",
    "function expedicionesBuenas(array $expediciones, int $minimoDeSacos): array",
    "{",
    "    $buenas = [];",
    "    foreach ($expediciones as $expedicion) {",
    "        $netos = ($expedicion['s'] ?? 0) - ($expedicion['p'] ?? 0);",
    "        if ($netos >= $minimoDeSacos) {",
    "            $buenas[] = ['n' => $expedicion['n'] ?? '?', 't' => $netos];",
    "        }",
    "    }",
    "    return $buenas;",
    "}",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "expedicionesBuenas", texto: "La función se llama por lo que hace" },
    { tipo: "prohibePalabra", valor: "$d", texto: "Ningún nombre de una sola letra" },
    { tipo: "prohibePalabra", valor: "$x", texto: "Ninguno" },
    { tipo: "prohibePalabra", valor: "$r", texto: "Ninguno" },
    { tipo: "prohibePalabra", valor: "$t", texto: "Ninguno" },
    { tipo: "prohibePalabra", valor: "$m", texto: "Ninguno" },
  ],
  tests: [
    {
      nombre: "hace exactamente lo que hacía",
      codigo: codigo(
        "$datos = [",
        "  ['n' => 'Fadrex', 's' => 12, 'p' => 2],",
        "  ['n' => 'Urteau', 's' => 3, 'p' => 0],",
        "];",
        "esperar(expedicionesBuenas($datos, 5), 'las buenas')->igualA([['n' => 'Fadrex', 't' => 10]]);",
      ),
    },
    {
      nombre: "las claves que faltan siguen contando como cero",
      codigo: codigo(
        "esperar(expedicionesBuenas([['n' => 'A']], 0), 'las buenas')->igualA([['n' => 'A', 't' => 0]]);",
      ),
    },
    {
      nombre: "y la que no trae nombre sigue saliendo con interrogación",
      codigo: "esperar(expedicionesBuenas([['s' => 9]], 1)[0]['n'], 'el nombre')->igualA('?');",
    },
    { nombre: "sin expediciones no hay buenas", codigo: "esperar(expedicionesBuenas([], 0), 'las buenas')->igualA([]);" },
    {
      nombre: "el mínimo se cumple justo en el borde",
      codigo: "esperar(expedicionesBuenas([['n' => 'A', 's' => 5]], 5), 'las buenas')->tieneLongitud(1);",
    },
    {
      nombre: "y una por debajo no entra",
      codigo: "esperar(expedicionesBuenas([['n' => 'A', 's' => 4]], 5), 'las buenas')->tieneLongitud(0);",
    },
  ],
  variantes: [
    {
      titulo: "Los nombres que no dicen nada · otra tanda",
      tests: [
        {
          nombre: "cuatro expediciones y dos buenas",
          codigo: codigo(
            "$datos = [['n' => 'A', 's' => 9], ['n' => 'B', 's' => 1], ['n' => 'C', 's' => 8], ['n' => 'D', 's' => 0]];",
            "esperar(expedicionesBuenas($datos, 5), 'las buenas')->tieneLongitud(2);",
          ),
        },
        {
          nombre: "los perdidos restan igual que antes",
          codigo: "esperar(expedicionesBuenas([['n' => 'A', 's' => 10, 'p' => 8]], 5), 'las buenas')->tieneLongitud(0);",
        },
      ],
    },
  ],
  pistas: [
    pista("Empieza por la firma: ¿qué es `$d`? Una lista de expediciones. ¿Y `$m`? El mínimo que hay que traer. Los nombres salen de leer el cuerpo una vez.", 0),
    pista("Las claves de los arrays -`'s'`, `'p'`, `'n'`- no se pueden cambiar: son los datos que llegan de fuera y los tests los usan. Lo que se cambia son las variables.", 1),
    pista("Un buen nombre para una variable que acumula resultados es lo que va a haber dentro: `$buenas`. Y para lo que se calcula en cada vuelta, lo que significa: `$netos`.", 2),
  ],
  recompensa: { croquetas: 8 },
}
