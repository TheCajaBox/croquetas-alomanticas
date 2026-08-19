import { codigo, pista } from '../comun.js'

export default {
  id: "elendel-05-fechas",
  mundo: "elendel",
  entorno: "worker",
  tipo: "prediccion",
  titulo: "El día que no era",
  enunciado: codigo(
    "Las fechas de JavaScript tienen fama de traicioneras, y se la han ganado. Casi todo",
    "el mundo se lleva un disgusto con ellas al menos una vez.",
    "",
    "Lee el código y di qué imprime cada línea. Una línea por cada `console.log`.",
    "",
    "Piénsalo despacio: hay al menos dos cosas aquí que **no** son lo que parecen.",
  ),
  codigoMostrado: codigo(
    "const fecha = new Date('2015-03-14T09:26:00Z')",
    "",
    "console.log(fecha.getUTCFullYear())",
    "console.log(fecha.getUTCMonth())",
    "console.log(fecha.getUTCDate())",
    "",
    "const otra = new Date(Date.UTC(2015, 2, 14))",
    "console.log(otra.toISOString().slice(0, 10))",
    "",
    "const mala = new Date('catorce de marzo')",
    "console.log(String(mala))",
    "console.log(Number.isNaN(mala.getTime()))",
  ),
  respuestaEsperada: codigo(
    "2015",
    "2",
    "14",
    "2015-03-14",
    "Invalid Date",
    "true",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue(['2015', '2', '14', '2015-03-14', 'Invalid Date', 'true']",
        "    .join(String.fromCharCode(10)))",
      ),
    },
  ],
  pistas: [
    pista("El año y el día no tienen truco. El mes sí: es el único de los tres que no empieza a contar donde esperarías.", 0),
    pista("`Date.UTC(2015, 2, 14)` usa la misma numeración de meses que `getUTCMonth`. Si el mes 2 no es febrero al leerlo, tampoco lo es al escribirlo.", 1),
    pista("Una fecha que no se entiende no lanza ningún error: se crea igual, y queda inservible. Al convertirla a texto lo dice, y `getTime()` devuelve `NaN`.", 2),
  ],
  recompensa: { croquetas: 12 },
}
