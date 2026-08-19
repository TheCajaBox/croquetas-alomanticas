import { codigo, pista } from '../comun.js'

export default {
  id: "es6-01b-funciones-que-viajan",
  mundo: "es6",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "Funciones que viajan",
  enunciado: codigo(
    "Antes del siguiente reto hace falta una idea, y es la que más cuesta de todo lo básico.",
    "Aquí no se escribe: se mira y se entiende.",
    "",
    "Lee las tres líneas y dime qué tienen en común.",
  ),
  pregunta: codigo(
    "```js",
    "const nombres = ['Wax', 'Wayne']",
    "",
    "nombres.map(alMayusculas)",
    "nombres.filter(esCorto)",
    "setTimeout(avisar, 100)",
    "```",
    "",
    "¿Qué tienen en común las tres?",
  ),
  opciones: [
    {
      texto: "En las tres se le entrega una función a otra función, para que la use cuando le toque.",
      correcta: true,
      porque: "Eso es. `map`, `filter` y `setTimeout` no saben qué quieres hacer: tú les entregas el procedimiento y ellos deciden cuándo aplicarlo y sobre qué.",
    },
    {
      texto: "En las tres hay un error: a `alMayusculas`, `esCorto` y `avisar` les faltan los paréntesis.",
      porque: "Es el error más común al empezar, y aquí está justo al revés. Con paréntesis la usarías tú ahora; sin ellos la entregas para que la usen luego, que es lo que hace falta.",
    },
    {
      texto: "En las tres se declara una función nueva.",
      porque: "Para declarar una función hace falta `function` o una flecha `=>`. Aquí las tres ya existían: solo se están usando.",
    },
    {
      texto: "En las tres se recorre una lista de principio a fin.",
      porque: "Las dos primeras sí recorren `nombres`. `setTimeout` no recorre nada: espera cien milisegundos y llama a `avisar` una vez.",
    },
  ],
  pistas: [
    pista("Fíjate en lo que hay dentro de cada paréntesis. En los tres casos es un nombre a secas.", 0),
    pista("Ninguno de esos tres nombres lleva paréntesis propios. Pregúntate qué significa eso.", 1),
    pista("Se les está pasando la función, no su resultado. `map` la aplicará a cada elemento; `setTimeout`, dentro de cien milisegundos.", 2),
  ],
  recompensa: { croquetas: 6 },
}
