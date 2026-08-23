import { codigo, pista } from '../comun.js'

export default {
  id: "pozo-10-el-null-que-se-cuela",
  mundo: "pozo",
  entorno: "php",
  tipo: "bug",
  titulo: "El null que se cuela",
  enunciado: codigo(
    "Esto se probó con datos completos y pasó. Con datos reales —donde falta lo que siempre",
    "falta— devuelve cosas raras y no se queja.",
    "",
    "- `precioTotal(array $lineas)` tendría que sumar los importes y devuelve un número más",
    "  bajo del que toca cuando alguna línea viene sin importe.",
    "- `iniciales(array $gente)` tendría que devolver la primera letra de cada nombre y",
    "  devuelve una lista con huecos.",
    "",
    "Los dos fallos son el mismo: **un dato que puede no estar, leído como si estuviera**.",
    "Arréglalos sin cambiar lo que las funciones devuelven cuando los datos sí están.",
  ),
  inicial: codigo(
    "<?php",
    "",
    "function precioTotal(array $lineas): int",
    "{",
    "    return array_reduce(",
    "        $lineas,",
    "        fn($llevado, $linea) => $llevado + $linea['importe'],",
    "        0",
    "    );",
    "}",
    "",
    "function iniciales(array $gente): array",
    "{",
    "    return array_map(fn($uno) => substr($uno['nombre'], 0, 1), $gente);",
    "}",
  ),
  solucion: codigo(
    "<?php",
    "",
    "function precioTotal(array $lineas): int",
    "{",
    "    return array_reduce(",
    "        $lineas,",
    "        fn($llevado, $linea) => $llevado + ($linea['importe'] ?? 0),",
    "        0",
    "    );",
    "}",
    "",
    "function iniciales(array $gente): array",
    "{",
    "    return array_map(fn($uno) => substr($uno['nombre'] ?? '?', 0, 1), $gente);",
    "}",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "??", texto: "Lee lo que puede faltar con `??`" },
  ],
  tests: [
    {
      nombre: "con todos los importes, suma igual que antes",
      codigo: codigo(
        "$lineas = [['importe' => 10], ['importe' => 5]];",
        "esperar(precioTotal($lineas), 'el total')->igualA(15);",
      ),
    },
    {
      nombre: "una línea sin importe cuenta como cero, no rompe la suma",
      codigo: codigo(
        "$lineas = [['importe' => 10], ['concepto' => 'pistas'], ['importe' => 5]];",
        "esperar(precioTotal($lineas), 'el total')->igualA(15);",
      ),
    },
    {
      nombre: "todas sin importe suman cero",
      codigo: "esperar(precioTotal([['concepto' => 'a'], ['concepto' => 'b']]), 'el total')->igualA(0);",
    },
    {
      nombre: "sin líneas, cero",
      codigo: "esperar(precioTotal([]), 'el total')->igualA(0);",
    },
    {
      nombre: "las iniciales de siempre siguen saliendo",
      codigo: codigo(
        "$gente = [['nombre' => 'Vin'], ['nombre' => 'Elend']];",
        "esperar(iniciales($gente), 'las iniciales')->igualA(['V', 'E']);",
      ),
    },
    {
      nombre: "quien no trae nombre sale con interrogación, no con un hueco",
      codigo: codigo(
        "$gente = [['nombre' => 'Vin'], ['sacos' => 3]];",
        "esperar(iniciales($gente), 'las iniciales')->igualA(['V', '?']);",
      ),
    },
    {
      nombre: "y la lista sigue teniendo tantos elementos como gente",
      codigo: codigo(
        "$gente = [['sacos' => 1], ['sacos' => 2], ['nombre' => 'Ham']];",
        "esperar(iniciales($gente), 'las iniciales')->tieneLongitud(3);",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El null que se cuela · otra tanda",
      tests: [
        {
          nombre: "cuatro líneas, dos sin importe",
          codigo: codigo(
            "$lineas = [['importe' => 3], [], ['importe' => 4], ['concepto' => 'x']];",
            "esperar(precioTotal($lineas), 'el total')->igualA(7);",
          ),
        },
        {
          nombre: "un importe de cero no es un importe que falte",
          codigo: "esperar(precioTotal([['importe' => 0], ['importe' => 9]]), 'el total')->igualA(9);",
        },
        {
          nombre: "tres nombres y ninguno falta",
          codigo: codigo(
            "$gente = [['nombre' => 'Sazed'], ['nombre' => 'Brisa'], ['nombre' => 'Ham']];",
            "esperar(iniciales($gente), 'las iniciales')->igualA(['S', 'B', 'H']);",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Ejecuta el código tal cual con una línea que no traiga `importe`. Lee el aviso: dice exactamente qué clave falta.", 0),
    pista("`$linea['importe']` cuando la clave no está no revienta: avisa y vale `null`. Y `$llevado + null` suma cero, así que el total sale más bajo sin que nada falle.", 1),
    pista("Los paréntesis importan: `$llevado + ($linea['importe'] ?? 0)`. Sin ellos, `??` se lleva la suma entera por delante.", 2),
  ],
  recompensa: { croquetas: 9 },
}
