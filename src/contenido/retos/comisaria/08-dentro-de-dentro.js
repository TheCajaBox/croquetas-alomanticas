import { codigo, pista } from '../comun.js'

export default {
  id: "com-08-dentro-de-dentro",
  mundo: "comisaria",
  entorno: "worker",
  tipo: "prediccion",
  titulo: "Listas de objetos con objetos dentro",
  enunciado: codigo(
    "Los datos de verdad no son planos: son listas de objetos, y dentro de esos objetos",
    "hay más listas y más objetos. Saber leerlos es media profesión.",
    "",
    "Lee el código y escribe **exactamente** lo que va a imprimir, una línea por cada",
    "`console.log`. Después se ejecuta de verdad delante de ti.",
  ),
  codigoMostrado: codigo(
    "const agentes = [",
    "  { nombre: 'Wax', casos: ['Bleeder', 'Suit'] },",
    "  { nombre: 'Wayne', casos: ['un sombrero'] },",
    "  { nombre: 'Marasi', casos: [] },",
    "]",
    "",
    "console.log(agentes.length)",
    "console.log(agentes[1].nombre)",
    "console.log(agentes[0].casos[1])",
    "console.log(agentes[2].casos.length)",
    "console.log(agentes[9])",
    "",
    "let total = 0",
    "for (const agente of agentes) {",
    "  total += agente.casos.length",
    "}",
    "console.log(total)",
  ),
  respuestaEsperada: codigo(
    "3",
    "Wayne",
    "Suit",
    "0",
    "undefined",
    "3",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue(\"3\\nWayne\\nSuit\\n0\\nundefined\\n3\")",
      ),
    },
  ],
  pistas: [
    pista("Ve una línea cada vez y de izquierda a derecha. `agentes[1]` es un objeto; a ese objeto le pides `.nombre`.", 0),
    pista("`agentes.length` cuenta los agentes, que son 3. `agentes[2].casos.length` cuenta los casos de Marasi, que no tiene ninguno.", 1),
    pista("Pedir la posición 9 de una lista de 3 no da error: da `undefined`. Y el total suma 2 + 1 + 0.", 2),
  ],
  recompensa: { croquetas: 7 },
}
