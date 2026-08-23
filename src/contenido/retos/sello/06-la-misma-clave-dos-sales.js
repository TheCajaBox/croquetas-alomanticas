import { codigo, pista } from '../comun.js'

export default {
  id: "sello-06-la-misma-clave-dos-sales",
  mundo: "sello",
  entorno: "worker",
  tipo: "prediccion",
  titulo: "La misma clave, dos sales",
  enunciado: codigo(
    "Lee el código y di **exactamente** qué escribe. Son cuatro líneas de salida, y las cuatro",
    "dicen algo distinto sobre para qué sirve la sal.",
  ),
  codigoMostrado: codigo(
    "function hashRapido(texto) {",
    "  const n = [...texto].reduce((cuenta, letra) => (cuenta * 31 + letra.codePointAt(0)) % 1000000007, 7)",
    "  return n.toString(16).padStart(8, '0')",
    "}",
    "",
    "const conSalA = hashRapido('salA:abeja14')",
    "const conSalB = hashRapido('salB:abeja14')",
    "const otraVezConSalA = hashRapido('salA:abeja14')",
    "",
    "console.log(conSalA === conSalB)",
    "console.log(conSalA === otraVezConSalA)",
    "console.log(conSalA.length === conSalB.length)",
    "console.log(hashRapido('salA:abeja14') === hashRapido('salA:abeja15'))",
  ),
  respuestaEsperada: codigo("false", "true", "true", "false"),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('false\\ntrue\\ntrue\\nfalse')",
      ),
    },
  ],
  pistas: [
    pista("Dos de las cuatro son `true`. Las otras dos, `false`.", 0),
    pista(
      "La primera pregunta si la misma contraseña con dos sales da lo mismo. Para eso está la sal.",
      1,
    ),
    pista(
      "La tercera no compara las firmas: compara **cuánto miden**. Un hash mide siempre lo mismo, entre otras cosas para no chivar la longitud de la contraseña.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
