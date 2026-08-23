import { codigo, pista } from '../comun.js'

export default {
  id: "original-06-la-misma-semilla",
  mundo: "original",
  entorno: "worker",
  tipo: "prediccion",
  titulo: "La misma semilla",
  enunciado: codigo(
    "Un generador de los rápidos: parte de un número —la **semilla**— y calcula el siguiente a",
    "partir del anterior. Es lo que hay dentro de casi todos los generadores de propósito",
    "general.",
    "",
    "Di exactamente qué escribe. Son cuatro líneas.",
  ),
  codigoMostrado: codigo(
    "function generador(semilla) {",
    "  let estado = semilla",
    "  return () => {",
    "    estado = (estado * 1103515245 + 12345) % 2147483648",
    "    return estado % 100",
    "  }",
    "}",
    "",
    "const uno = generador(42)",
    "const otro = generador(42)",
    "const tercero = generador(43)",
    "",
    "console.log(uno() === otro())",
    "console.log(uno() === otro())",
    "console.log(uno() === tercero())",
    "",
    "// Y con tres valores vistos, el cuarto:",
    "const visto = [uno(), uno(), uno()]",
    "const reconstruido = generador(42)",
    "for (let i = 0; i < 6; i += 1) reconstruido()",
    "console.log(reconstruido() === uno())",
  ),
  respuestaEsperada: codigo("true", "true", "false", "true"),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('true\\ntrue\\nfalse\\ntrue')",
      ),
    },
  ],
  pistas: [
    pista("Tres de las cuatro son `true`. La distinta es la que compara dos generadores con semillas distintas.", 0),
    pista(
      "Cada llamada calcula el siguiente valor **a partir del anterior**. Dos generadores que empiezan igual van a dar exactamente la misma serie, para siempre.",
      1,
    ),
    pista(
      "La última línea es la lección: se puede **reconstruir** la serie desde el principio y adelantarla hasta el punto que quieras. Si el identificador de tu sesión sale de aquí, quien sepa la semilla sabe todos los identificadores que has repartido y los que vas a repartir.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
