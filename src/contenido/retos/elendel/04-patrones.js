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
  // Carteles impresos por gente distinta: con la palabra en mayúscula, sin el
  // espacio detrás de los dos puntos, con dos recompensas. El patrón es exigente
  // a propósito y estas tandas enseñan exactamente cuánto.
  variantes: [
    {
      titulo: "Buscar por la forma, no por el nombre · otra tanda",
      tests: [
        {
          nombre: "una recompensa de cuatro cifras entra entera",
          codigo: "esperar(sacarRecompensa('SE BUSCA: Paalm (recompensa: 1200 marcos)')).igualA(1200)",
        },
        {
          nombre: "un cero es una recompensa como otra cualquiera, y no es «no hay»",
          codigo: "esperar(sacarRecompensa('SE BUSCA: Nadie (recompensa: 0 marcos)')).igualA(0)",
        },
        {
          nombre: "el patrón busca dentro del texto, esté al principio o al final",
          codigo: "esperar(sacarRecompensa('(recompensa: 90 marcos) SE BUSCA: alguien')).igualA(90)",
        },
        {
          nombre: "si la palabra está pero detrás no hay cifras, no hay recompensa",
          codigo: "esperar(sacarRecompensa('SE BUSCA: X (recompensa: muchas gracias)')).igualA(null)",
        },
        {
          nombre: "y un cartel en blanco tampoco paga nada",
          codigo: "esperar(sacarRecompensa('')).igualA(null)",
        },
      ],
    },
    {
      titulo: "Buscar por la forma, no por el nombre · y otra",
      tests: [
        {
          nombre: "«Recompensa» con mayúscula no encaja: el patrón distingue",
          codigo: "esperar(sacarRecompensa('SE BUSCA: X (Recompensa: 500 marcos)')).igualA(null)",
        },
        {
          nombre: "y hace falta el espacio detrás de los dos puntos",
          codigo: "esperar(sacarRecompensa('SE BUSCA: X (recompensa:500 marcos)')).igualA(null)",
        },
        {
          nombre: "con dos recompensas en el mismo cartel se queda con la primera",
          codigo: "esperar(sacarRecompensa('a (recompensa: 10 marcos) y b (recompensa: 20 marcos)')).igualA(10)",
        },
        {
          nombre: "las cifras se paran donde se paran: no se traga los años que vienen detrás",
          codigo: "esperar(sacarRecompensa('SE BUSCA: X (recompensa: 500 marcos del 1868)')).igualA(500)",
        },
        {
          nombre: "y un millón sigue saliendo como número, no como texto",
          codigo: codigo(
            "esperar(sacarRecompensa('SE BUSCA: Y (recompensa: 1000000 marcos)')).igualA(1000000)",
            "esperar(sacarRecompensa('SE BUSCA: Y (recompensa: 1000000 marcos)'), 'la recompensa').esDeTipo('number')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("`texto.match(/patron/)` busca y devuelve lo encontrado, o `null` si no hay nada. Ese `null` es medio ejercicio.", 0),
    pista("`\\d` significa «un dígito» y `+` significa «uno o más». Así que `\\d+` es un número de las cifras que sea.", 1),
    pista("Los paréntesis dentro del patrón marcan **qué trozo te quieres quedar**. Lo que devuelve `match` es una lista: en la posición 0 va todo lo que encajó y en la 1 lo que había entre paréntesis.", 2),
  ],
  recompensa: { croquetas: 13 },
}
