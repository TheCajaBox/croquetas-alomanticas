import { codigo, pista } from '../comun.js'

export default {
  id: "dia1-03-const-o-let",
  mundo: "primer-dia",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "Lo que se mueve y lo que no",
  enunciado: codigo(
    "Hay dos formas de guardar algo, y la diferencia es si vas a poder cambiarlo después.",
    "",
    "Mira este programa y dime **qué líneas van a dar error**. Hay más de una.",
  ),
  pregunta: codigo(
    "```js",
    "const tarifa = 25",
    "let dias = 3",
    "const equipo = ['Wax']",
    "",
    "dias = 4              // línea A",
    "tarifa = 30           // línea B",
    "equipo.push('Wayne')  // línea C",
    "equipo = ['Marasi']   // línea D",
    "```",
    "",
    "¿Qué líneas dan error?",
  ),
  opciones: [
    {
      texto: "La línea B: `tarifa = 30`",
      correcta: true,
      porque: "`tarifa` es `const`. Asignarle otro valor la para en seco.",
    },
    {
      texto: "La línea D: `equipo = ['Marasi']`",
      correcta: true,
      porque: "Aquí no se cambia lo que hay dentro de la lista: se le da OTRA lista. Y eso a un `const` no se le hace.",
    },
    {
      texto: "La línea A: `dias = 4`",
      porque: "`dias` es `let`, y los `let` están precisamente para esto. Ninguna pega.",
    },
    {
      texto: "La línea C: `equipo.push('Wayne')`",
      porque: "Esta es la que engaña. `push` mete algo en la lista que ya había; la caja no cambia, así que `const` no protesta.",
    },
  ],
  pistas: [
    pista("Solo pueden fallar las que intentan asignar con `=` a algo declarado con `const`.", 0),
    pista("Repasa las cuatro y pregúntate en cada una: ¿estoy cambiando la caja, o lo que hay dentro?", 1),
    pista("Fallan la B y la D. La C engaña, pero `push` no cambia la caja: mete algo en la que ya había.", 2),
  ],
  recompensa: { croquetas: 5 },
}
