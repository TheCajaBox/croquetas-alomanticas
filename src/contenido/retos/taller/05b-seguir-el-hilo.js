import { codigo, pista } from '../comun.js'

export default {
  id: "taller-05b-seguir-el-hilo",
  mundo: "taller",
  entorno: "worker",
  tipo: "trazar",
  titulo: "Dos contadores que no se hablan",
  enunciado: codigo(
    "Un cierre se entiende del todo el día que ves que **cada llamada a la fábrica crea",
    "su propia variable privada**. Hasta entonces suena a magia.",
    "",
    "Aquí se fabrican dos contadores y se usan alternados. Rellena la tabla y míralo.",
  ),
  codigoMostrado: codigo(
    "function crearContador() {",
    "  let cuenta = 0",
    "  return function () {",
    "    cuenta = cuenta + 1",
    "    return cuenta",
    "  }",
    "}",
    "",
    "const contarA = crearContador()",
    "const contarB = crearContador()",
    "",
    "console.log(contarA())",
    "console.log(contarA())",
    "console.log(contarB())",
  ),
  variables: ["cuenta de A", "cuenta de B", "escribe"],
  pasos: [
    {
      etiqueta: "Recién creados los dos",
      valores: { "cuenta de A": "0", "cuenta de B": "0", escribe: "(nada todavía)" },
    },
    {
      etiqueta: "Primer contarA()",
      valores: { "cuenta de A": "1", "cuenta de B": "0", escribe: "1" },
    },
    {
      etiqueta: "Segundo contarA()",
      valores: { "cuenta de A": "2", "cuenta de B": "0", escribe: "2" },
    },
    {
      etiqueta: "Primer contarB()",
      valores: { "cuenta de A": "2", "cuenta de B": "1", escribe: "1" },
    },
  ],
  valoresPosibles: ["(nada todavía)", "0", "1", "2", "3", "undefined", "(no existe)"],
  porque: codigo(
    "La fila que lo explica todo es la última: `contarB()` escribe **1**, no 3. Y la",
    "columna de A no se mueve cuando se llama a B.",
    "",
    "Cada vez que se ejecuta `crearContador()` se crea un `let cuenta` nuevo, y la función",
    "que sale se lleva **ese** y no otro. `contarA` y `contarB` tienen el mismo código y",
    "variables distintas. Por eso un cierre sirve para guardar datos privados: nadie de",
    "fuera puede tocar `cuenta`, ni siquiera el otro contador.",
  ),
  tests: [
    {
      nombre: "los dos contadores llevan cuentas separadas",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue(['1', '2', '1'].join(String.fromCharCode(10)))",
      ),
    },
  ],
  pistas: [
    pista("Fíjate en cuántas veces se ejecuta `crearContador()`. Cada ejecución entra en la línea del `let`.", 0),
    pista("La función devuelta suma uno y devuelve el resultado, así que lo que escribe es lo mismo que vale la cuenta después de sumar.", 1),
    pista("La pregunta del reto es si las dos comparten `cuenta` o si cada una tiene la suya. Mira la última fila: si la compartieran, ahí escribiría 3.", 2),
  ],
  recompensa: { croquetas: 12 },
}
