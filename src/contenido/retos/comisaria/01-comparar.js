import { codigo, pista } from '../comun.js'

export default {
  id: "com-01-comparar",
  mundo: "comisaria",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "Verdadero o falso",
  enunciado: codigo(
    "Antes de decidir nada hay que saber comparar. Y comparar en JavaScript tiene",
    "una trampa famosa.",
    "",
    "Marca **todas** las que valen `true`.",
  ),
  pregunta: codigo(
    "¿Cuáles de estas valen `true`?",
  ),
  opciones: [
    {
      texto: "`7 !== '7'`",
      correcta: true,
      porque: "`!==` compara sin convertir. Un número y un texto nunca son idénticos, así que «no son iguales» es verdad.",
    },
    {
      texto: "`Boolean([])`",
      correcta: true,
      porque: "La lista vacía es verdadera. Solo son falsos `false`, `0`, `''`, `null`, `undefined` y `NaN`; una lista no está en la lista, aunque no tenga nada dentro.",
    },
    {
      texto: "`3 > 1 && 1 > 0`",
      correcta: true,
      porque: "Las dos partes son verdaderas, y `&&` pide justo eso: que las dos lo sean.",
    },
    {
      texto: "`0 === ''`",
      porque: "Con tres iguales no hay conversión: un número no es un texto. Da `false`. Con `==` sí daría `true`, y por eso `==` da tantos disgustos.",
    },
    {
      texto: "`Boolean('0')`",
      porque: "Engaña, pero no. El texto `'0'` es un texto con un carácter dentro, y solo el texto **vacío** cuenta como falso.",
    },
  ],
  pistas: [
    pista("Repasa la lista de valores falsos del apunte. Son solo seis, y todo lo que no está en ella es verdadero.", 0),
    pista("Cuidado con las dos que mezclan tipos: con `===` y `!==` no hay conversión ninguna.", 1),
    pista("Son tres: `7 !== '7'`, `Boolean([])` y `3 > 1 && 1 > 0`.", 2),
  ],
  recompensa: { croquetas: 5 },
}
