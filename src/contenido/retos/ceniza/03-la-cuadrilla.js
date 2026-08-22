import { codigo, pista } from '../comun.js'

export default {
  id: "ceniza-03-la-cuadrilla",
  mundo: "ceniza",
  entorno: "php",
  tipo: "codigo",
  titulo: "Contar la cuadrilla",
  enunciado: codigo(
    "Una lista en PHP es un **array**, y se escribe entre corchetes.",
    "",
    "Escribe dos funciones:",
    "",
    "- `cuantos(array $gente)` — devuelve cuántos hay.",
    "- `sumar(array $numeros)` — devuelve la suma de todos. Con la lista vacía, `0`.",
    "",
    "La suma la recorres tú con `foreach`. Nada de `array_sum`: aquí se practica el bucle.",
  ),
  inicial: codigo(
    "<?php",
    "",
    "function cuantos(array $gente): int",
    "{",
    "    // Hay una función de PHP que cuenta cosas.",
    "}",
    "",
    "function sumar(array $numeros): int",
    "{",
    "    // Un acumulador fuera, un foreach que lo alimenta.",
    "}",
  ),
  solucion: codigo(
    "<?php",
    "",
    "function cuantos(array $gente): int",
    "{",
    "    return count($gente);",
    "}",
    "",
    "function sumar(array $numeros): int",
    "{",
    "    $total = 0;",
    "    foreach ($numeros as $numero) {",
    "        $total += $numero;",
    "    }",
    "    return $total;",
    "}",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "foreach", texto: "Recorre la lista con `foreach`" },
    { tipo: "prohibeLlamada", valor: "array_sum", texto: "Sin `array_sum`: la suma la haces tú" },
  ],
  tests: [
    {
      nombre: "cuenta a los tres de la cuadrilla",
      codigo: "esperar(cuantos(['Kelsier', 'Brisa', 'Ham']))->igualA(3);",
    },
    { nombre: "una cuadrilla vacía son cero", codigo: "esperar(cuantos([]))->igualA(0);" },
    { nombre: "suma tres cantidades", codigo: "esperar(sumar([120, 340, 55]))->igualA(515);" },
    { nombre: "la lista vacía suma cero", codigo: "esperar(sumar([]))->igualA(0);" },
    { nombre: "suma también con negativos", codigo: "esperar(sumar([10, -4]))->igualA(6);" },
  ],
  pistas: [
    pista("`count($lista)` te dice cuántos elementos tiene.", 0),
    pista("`foreach ($numeros as $numero) { ... }` te da uno cada vuelta. Lo que sumes tiene que vivir fuera del bucle.", 1),
    pista("Tres piezas y en este orden: el acumulador a cero **antes** del bucle, la suma **dentro**, y devolverlo **después**. Si lo pones a cero dentro, cada vuelta lo borra.", 2),
  ],
  // Practicar el mismo bucle con otros datos, tantas veces como haga falta y
  // sin volver a cobrar. Los tests son datos, así que una tanda nueva cuesta
  // cinco líneas.
  variantes: [
    {
      titulo: "Contar la cuadrilla · otra tanda",
      tests: [
        { nombre: "cuenta a los cinco de la banda", codigo: "esperar(cuantos(['Vin', 'Marsh', 'Dockson', 'Clubs', 'Renoux']))->igualA(5);" },
        { nombre: "una cuadrilla vacía son cero", codigo: "esperar(cuantos([]))->igualA(0);" },
        { nombre: "suma cuatro cantidades", codigo: "esperar(sumar([7, 7, 7, 7]))->igualA(28);" },
        { nombre: "un solo número se suma a sí mismo", codigo: "esperar(sumar([42]))->igualA(42);" },
        { nombre: "y se cancelan al sumarse", codigo: "esperar(sumar([-8, 8]))->igualA(0);" },
      ],
    },
    {
      titulo: "Contar la cuadrilla · y otra",
      tests: [
        { nombre: "cuenta a uno solo", codigo: "esperar(cuantos(['Kelsier']))->igualA(1);" },
        { nombre: "cuenta lo que le echen", codigo: "esperar(cuantos([1, 2, 3, 4, 5, 6, 7]))->igualA(7);" },
        { nombre: "suma cantidades grandes", codigo: "esperar(sumar([1000, 2500, 750]))->igualA(4250);" },
        { nombre: "la lista vacía suma cero", codigo: "esperar(sumar([]))->igualA(0);" },
        { nombre: "todo negativo suma negativo", codigo: "esperar(sumar([-3, -4, -5]))->igualA(-12);" },
      ],
    },
  ],
  recompensa: { croquetas: 6 },
}
