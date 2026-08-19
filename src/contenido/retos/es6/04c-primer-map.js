import { codigo, pista } from '../comun.js'

export default {
  id: "es6-04c-primer-map",
  mundo: "es6",
  entorno: "worker",
  tipo: "completar",
  titulo: "Tu primer map",
  enunciado: codigo(
    "Ahora uno de verdad, pero con las piezas puestas encima de la mesa.",
    "",
    "Hay que pasar la lista de metales a mayúsculas y escribirla separada por comas.",
    "Elige la ficha y pulsa el hueco donde va.",
  ),
  plantilla: codigo(
    "const metales = ['acero', 'peltre', 'oro']",
    "",
    "const gritados = metales.___((metal) => metal.___())",
    "",
    "console.log(gritados.___(', '))",
  ),
  fichas: ["map", "filter", "toUpperCase", "toLowerCase", "join", "push", "length"],
  solucion: codigo(
    "const metales = ['acero', 'peltre', 'oro']",
    "",
    "const gritados = metales.map((metal) => metal.toUpperCase())",
    "",
    "console.log(gritados.join(', '))",
  ),
  tests: [
    {
      nombre: "escribe los tres metales en mayúsculas",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('ACERO, PELTRE, ORO')",
      ),
    },
  ],
  pistas: [
    pista("El primer hueco transforma la lista entera. El segundo transforma un texto. El tercero junta una lista en un solo texto.", 0),
    pista("Hay que pasar a MAYÚSCULAS, así que de los dos parecidos, el que sube.", 1),
    pista("`metales.map(...)`, dentro `metal.toUpperCase()`, y al final `gritados.join(', ')`.", 2),
  ],
  recompensa: { croquetas: 8 },
}
