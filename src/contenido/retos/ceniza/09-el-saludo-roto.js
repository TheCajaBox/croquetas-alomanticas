import { codigo, pista } from '../comun.js'

export default {
  id: "ceniza-09-el-saludo-roto",
  mundo: "ceniza",
  entorno: "php",
  tipo: "bug",
  titulo: "El saludo que sale literal",
  enunciado: codigo(
    "Este código no revienta. Ni avisa. Simplemente devuelve algo que no es lo que",
    "debería, y así llegó a producción.",
    "",
    "`saludo('Vin', 3)` tendría que devolver `Hola, Vin. Quedan 3 días.` y devuelve",
    "`Hola, $nombre. Quedan $dias días.`, con el dólar y todo.",
    "",
    "Y `enDosLineas('a', 'b')` tendría que devolver dos líneas y devuelve una sola con",
    "una barra y una ene en medio.",
    "",
    "Arregla las dos. La causa es la misma.",
  ),
  inicial: codigo(
    "<?php",
    "",
    "function saludo(string $nombre, int $dias): string",
    "{",
    "    return 'Hola, $nombre. Quedan $dias días.';",
    "}",
    "",
    "function enDosLineas(string $arriba, string $abajo): string",
    "{",
    "    return '$arriba\\n$abajo';",
    "}",
  ),
  solucion: codigo(
    "<?php",
    "",
    "function saludo(string $nombre, int $dias): string",
    "{",
    '    return "Hola, $nombre. Quedan $dias días.";',
    "}",
    "",
    "function enDosLineas(string $arriba, string $abajo): string",
    "{",
    '    return "$arriba\\n$abajo";',
    "}",
  ),
  tests: [
    {
      nombre: "el saludo sustituye las dos variables",
      codigo: "esperar(saludo('Vin', 3))->igualA('Hola, Vin. Quedan 3 días.');",
    },
    {
      nombre: "y con otros datos también",
      codigo: "esperar(saludo('Kelsier', 1))->igualA('Hola, Kelsier. Quedan 1 días.');",
    },
    {
      nombre: "el salto de línea es un salto de línea de verdad",
      codigo: "esperar(enDosLineas('a', 'b'))->igualA(\"a\\nb\");",
    },
    {
      nombre: "y son dos líneas, no una",
      codigo: "esperar(enDosLineas('arriba', 'abajo'))->tieneLongitud(12);",
    },
    {
      nombre: "no queda ningún dólar suelto por ahí",
      codigo: "esperar(saludo('Vin', 3))->noContiene('$');",
    },
  ],
  variantes: [
    {
      titulo: "El saludo que sale literal · otra tanda",
      tests: [
        { nombre: "saluda a otro", codigo: "esperar(saludo('Sazed', 40))->igualA('Hola, Sazed. Quedan 40 días.');" },
        { nombre: "aguanta el cero", codigo: "esperar(saludo('Brisa', 0))->igualA('Hola, Brisa. Quedan 0 días.');" },
        { nombre: "dos líneas con textos largos", codigo: "esperar(enDosLineas('Los Pozos', 'de Hathsin'))->igualA(\"Los Pozos\\nde Hathsin\");" },
        { nombre: "sigue sin dólares", codigo: "esperar(saludo('Ham', 7))->noContiene('$');" },
      ],
    },
  ],
  pistas: [
    pista("El error no está en las variables ni en la función: está en las comillas.", 0),
    pista("Con comillas simples PHP no mira dentro del texto. Ni variables, ni `\\n`.", 1),
    pista("Cambia las comillas simples por dobles en los dos `return`. Y ojo: si dentro hubiera una comilla doble habría que escaparla con `\\\"`; aquí no hay ninguna.", 2),
  ],
  recompensa: { croquetas: 6 },
}
