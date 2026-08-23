import { codigo, pista } from '../comun.js'

export default {
  id: "com-07-objetos",
  mundo: "comisaria",
  entorno: "worker",
  tipo: "codigo",
  titulo: "La ficha de un sospechoso",
  enunciado: codigo(
    "Una lista guarda cosas **numeradas**. Un objeto las guarda **con nombre**, que es",
    "lo que hace falta cuando cada dato significa algo distinto.",
    "",
    "Escribe dos funciones:",
    "",
    "- `crearFicha(nombre, alias, recompensa)` — devuelve un objeto con esas tres",
    "  propiedades, más una cuarta, `capturado`, que empieza en `false`.",
    "- `describir(ficha)` — devuelve el texto ``'Miles, alias Dientes de Sangre: 500'``,",
    "  con los datos de la ficha que le pasen.",
  ),
  inicial: codigo(
    "function crearFicha(nombre, alias, recompensa) {",
    "  // Un objeto con cuatro propiedades.",
    "}",
    "",
    "function describir(ficha) {",
    "  // 'Miles, alias Dientes de Sangre: 500'",
    "}",
    "",
    "const miles = crearFicha('Miles', 'Dientes de Sangre', 500)",
    "console.log(describir(miles))",
  ),
  solucion: codigo(
    "function crearFicha(nombre, alias, recompensa) {",
    "  return { nombre, alias, recompensa, capturado: false }",
    "}",
    "",
    "function describir(ficha) {",
    "  return `${ficha.nombre}, alias ${ficha.alias}: ${ficha.recompensa}`",
    "}",
    "",
    "const miles = crearFicha('Miles', 'Dientes de Sangre', 500)",
    "console.log(describir(miles))",
  ),
  requisitos: [
    { tipo: "usaPlantilla" },
  ],
  tests: [
    {
      nombre: "la ficha guarda los tres datos",
      codigo: codigo(
        "const f = crearFicha('Miles', 'Dientes de Sangre', 500)",
        "esperar(f.nombre).igualA('Miles')",
        "esperar(f.alias).igualA('Dientes de Sangre')",
        "esperar(f.recompensa).igualA(500)",
      ),
    },
    {
      nombre: "y nace sin capturar",
      codigo: "esperar(crearFicha('Miles', 'x', 1).capturado).esFalso()",
    },
    {
      nombre: "describir arma el texto con los datos de la ficha",
      codigo: codigo(
        "const f = crearFicha('Miles', 'Dientes de Sangre', 500)",
        "esperar(describir(f)).igualA('Miles, alias Dientes de Sangre: 500')",
      ),
    },
    {
      nombre: "describir sirve para cualquier ficha, no solo para Miles",
      codigo: codigo(
        "const f = crearFicha('Paalm', 'Bleeder', 1200)",
        "esperar(describir(f)).igualA('Paalm, alias Bleeder: 1200')",
      ),
    },
  ],
  // La trampa de este reto es escribir los datos a mano dentro de `describir`.
  // Las dos tandas le pasan fichas que Miles no ha visto en su vida, y la
  // segunda le pasa además un objeto que no salió de `crearFicha`.
  variantes: [
    {
      titulo: "La ficha de un sospechoso · otra tanda",
      tests: [
        {
          nombre: "la ficha de Ranette guarda sus tres datos",
          codigo: codigo(
            "const f = crearFicha('Ranette', 'La Armera', 300)",
            "esperar(f.nombre).igualA('Ranette')",
            "esperar(f.alias).igualA('La Armera')",
            "esperar(f.recompensa).igualA(300)",
          ),
        },
        {
          nombre: "y describir la cuenta igual de bien",
          codigo: "esperar(describir(crearFicha('Ranette', 'La Armera', 300))).igualA('Ranette, alias La Armera: 300')",
        },
        {
          nombre: "una recompensa de cero se escribe, no se esconde",
          codigo: "esperar(describir(crearFicha('Wayne', 'El del sombrero', 0))).igualA('Wayne, alias El del sombrero: 0')",
        },
        {
          nombre: "la ficha trae cuatro propiedades y ni una de propina",
          codigo: "esperar(Object.keys(crearFicha('a', 'b', 1)), 'las propiedades').tieneLongitud(4)",
        },
      ],
    },
    {
      titulo: "La ficha de un sospechoso · y otra",
      tests: [
        {
          nombre: "describir sirve con un objeto escrito a mano: solo mira las propiedades",
          codigo: codigo(
            "const suelta = { nombre: 'MeLaan', alias: 'la kandra', recompensa: 9000, capturado: true }",
            "esperar(describir(suelta)).igualA('MeLaan, alias la kandra: 9000')",
          ),
        },
        {
          nombre: "un alias vacío deja el hueco vacío, sin inventarse nada",
          codigo: "esperar(describir(crearFicha('Suit', '', 500))).igualA('Suit, alias : 500')",
        },
        {
          nombre: "dos fichas son dos objetos distintos y no comparten nada",
          codigo: codigo(
            "const a = crearFicha('a', 'x', 1)",
            "const b = crearFicha('b', 'y', 2)",
            "a.capturado = true",
            "esperar(b.capturado).esFalso()",
          ),
        },
        {
          nombre: "capturado nace en false y no en undefined: son cosas distintas",
          codigo: "esperar(crearFicha('a', 'b', 3).capturado, 'capturado').esDeTipo('boolean')",
        },
      ],
    },
  ],
  pistas: [
    pista("`crearFicha` tiene que **devolver** el objeto. Si empiezas la línea con `return {`, ya lo tienes casi.", 0),
    pista("En `describir` no puedes escribir 'Miles' a mano: el segundo test le pasa otra ficha distinta. Saca los datos de `ficha.nombre`, `ficha.alias` y `ficha.recompensa`.", 1),
    pista("Las dos son un `return` de una línea. En la primera, las tres propiedades se llaman igual que los parámetros, así que te vale la forma corta del apunte, y la cuarta la añades aparte con su valor. En la segunda, una plantilla que saque los tres datos del objeto que te pasan.", 2),
  ],
  recompensa: { croquetas: 8 },
}
