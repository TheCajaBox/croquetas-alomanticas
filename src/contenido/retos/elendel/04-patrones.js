import { codigo, pista } from '../comun.js'

export default {
  id: "elendel-04-patrones",
  mundo: "elendel",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Buscar por la forma, no por el nombre",
  enunciado: codigo(
    "A veces no sabes qué buscas, solo **qué forma tiene**: tres dígitos, una palabra",
    "en mayúsculas, algo con arroba. Para eso están las expresiones regulares.",
    "",
    "Los carteles de busca y captura llegan con la recompensa metida en el texto, así:",
    "",
    "```",
    "SE BUSCA: Miles Dagouter (recompensa: 500 marcos)",
    "```",
    "",
    "Escribe `sacarRecompensa(cartel)` que devuelva **el número** —500, no `'500'`— o",
    "`null` si ese cartel no lleva recompensa.",
  ),
  inicial: codigo(
    "function sacarRecompensa(cartel) {",
    "  // Busca «recompensa: » seguido de dígitos, y quédate solo con los dígitos.",
    "}",
  ),
  solucion: codigo(
    "function sacarRecompensa(cartel) {",
    "  const encontrado = cartel.match(/recompensa: (\\d+)/)",
    "  if (!encontrado) return null",
    "  return Number(encontrado[1])",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "sacarRecompensa" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "saca la recompensa de un cartel normal",
      codigo: "esperar(sacarRecompensa('SE BUSCA: Miles Dagouter (recompensa: 500 marcos)')).igualA(500)",
    },
    {
      nombre: "devuelve un número, no un texto",
      codigo: "esperar(sacarRecompensa('SE BUSCA: X (recompensa: 42 marcos)')).esDeTipo('number')",
    },
    {
      nombre: "funciona con recompensas de un solo dígito",
      codigo: "esperar(sacarRecompensa('SE BUSCA: Y (recompensa: 7 marcos)')).igualA(7)",
    },
    {
      nombre: "devuelve null si el cartel no lleva recompensa",
      codigo: "esperar(sacarRecompensa('SE BUSCA: Alguien, y no pagan nada')).igualA(null)",
    },
  ],
  pistas: [
    pista("`texto.match(/patron/)` busca y devuelve lo encontrado, o `null` si no hay nada. Ese `null` es medio ejercicio.", 0),
    pista("`\\d` significa «un dígito» y `+` significa «uno o más». Así que `\\d+` es un número de las cifras que sea.", 1),
    pista("Los paréntesis dentro del patrón marcan **qué trozo te quieres quedar**. Lo que devuelve `match` es una lista: en la posición 0 va todo lo que encajó y en la 1 lo que había entre paréntesis.", 2),
  ],
  recompensa: { croquetas: 13 },
}
