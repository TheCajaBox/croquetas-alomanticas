import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-06-el-orden-de-las-sustituciones",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "prediccion",
  titulo: "El orden de las sustituciones",
  enunciado: codigo(
    "Dos funciones que escapan los tres primeros caracteres. La única diferencia es **el",
    "orden** en que lo hacen.",
    "",
    "Di exactamente qué escribe. Son cuatro líneas.",
  ),
  codigoMostrado: codigo(
    "function bien(texto) {",
    "  return texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')",
    "}",
    "",
    "function mal(texto) {",
    "  return texto.replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('&', '&amp;')",
    "}",
    "",
    "console.log(bien('a < b'))",
    "console.log(mal('a < b'))",
    "console.log(bien('Muñoz & Cía'))",
    "console.log(mal('Muñoz & Cía'))",
  ),
  respuestaEsperada: codigo(
    "a &lt; b",
    "a &amp;lt; b",
    "Muñoz &amp; Cía",
    "Muñoz &amp; Cía",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('a &lt; b\\na &amp;lt; b\\nMuñoz &amp; Cía\\nMuñoz &amp; Cía')",
      ),
    },
  ],
  pistas: [
    pista("Dos de las cuatro líneas salen iguales. Las otras dos, no.", 0),
    pista(
      "En `mal`, cuando llega el turno del ampersand ya hay ampersands en el texto. Y no los puso el usuario: los puso la función.",
      1,
    ),
    pista(
      "Se llama doble escapado y en pantalla se ve tal cual: en vez de `a < b` el usuario lee `a &lt; b`. No es un agujero de seguridad, es un texto roto —y es la razón por la que el ampersand va primero—.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
