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
  pistas: [
    pista("`crearFicha` tiene que **devolver** el objeto. Si empiezas la línea con `return {`, ya lo tienes casi.", 0),
    pista("En `describir` no puedes escribir 'Miles' a mano: el segundo test le pasa otra ficha distinta. Saca los datos de `ficha.nombre`, `ficha.alias` y `ficha.recompensa`.", 1),
    pista("Las dos son un `return` de una línea. En la primera, las tres propiedades se llaman igual que los parámetros, así que te vale la forma corta del apunte, y la cuarta la añades aparte con su valor. En la segunda, una plantilla que saque los tres datos del objeto que te pasan.", 2),
  ],
  recompensa: { croquetas: 8 },
}
