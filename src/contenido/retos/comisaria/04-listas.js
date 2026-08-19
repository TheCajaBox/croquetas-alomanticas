import { codigo, pista } from '../comun.js'

export default {
  id: "com-04-listas",
  mundo: "comisaria",
  entorno: "worker",
  tipo: "emparejar",
  titulo: "El tablón de buscados",
  enunciado: codigo(
    "Una lista guarda muchas cosas bajo un solo nombre. Es la estructura que más vas a",
    "usar, con diferencia.",
    "",
    "Empareja cada trozo de código con lo que vale, sobre esta lista:",
    "",
    "```js",
    "const buscados = ['Miles', 'Bleeder', 'Suit']",
    "```",
  ),
  parejas: [
    { izquierda: "buscados[0]", derecha: "'Miles'" },
    { izquierda: "buscados[2]", derecha: "'Suit'" },
    { izquierda: "buscados[3]", derecha: "undefined" },
    { izquierda: "buscados.length", derecha: "3" },
    { izquierda: "buscados[buscados.length - 1]", derecha: "el último, sea cual sea el tamaño" },
    { izquierda: "buscados.includes('Suit')", derecha: "true" },
    { izquierda: "buscados.indexOf('Nadie')", derecha: "-1" },
  ],
  pistas: [
    pista("Se cuenta desde cero: el primero es el 0, no el 1.", 0),
    pista("Hay tres nombres, así que `length` vale 3 y la última posición ocupada es la 2.", 1),
    pista("Pedir una posición vacía da `undefined`; buscar algo que no está con `indexOf` da `-1`.", 2),
  ],
  recompensa: { croquetas: 5 },
}
