import { codigo, pista } from '../comun.js'

export default {
  id: "dia1-01-variables",
  mundo: "primer-dia",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "Un nombre para las cosas",
  enunciado: codigo(
    "Primer día. Aquí no vas a escribir nada todavía: solo mirar y decidir.",
    "",
    "Lee el apunte de Wax, mira el código de abajo y elige qué está pasando.",
  ),
  pregunta: codigo(
    "```js",
    "const sombrero = 'bombín'",
    "```",
    "",
    "¿Qué hace esa línea?",
  ),
  opciones: [
    {
      texto: "Guarda el texto `bombín` y le pone el nombre `sombrero`.",
      correcta: true,
      porque: "Eso es. `const` guarda, `sombrero` es el nombre y lo de la derecha del `=` es lo que se guarda.",
    },
    {
      texto: "Comprueba si `sombrero` vale `bombín` y dice si es verdad o no.",
      porque: "Eso sería comparar, y se escribe con `===`, con tres iguales. Un solo `=` no pregunta: guarda.",
    },
    {
      texto: "Crea una función llamada `sombrero`.",
      porque: "Las funciones se declaran con `function` o con una flecha `=>`. Aquí no hay ninguna de las dos.",
    },
    {
      texto: "Dibuja un sombrero en la pantalla.",
      porque: "Ojalá fuera tan fácil. Guardar un valor y pintar algo son cosas muy distintas: aquí solo se guarda.",
    },
  ],
  pistas: [
    pista("Fíjate solo en el signo `=`. En programación no significa «es igual a».", 0),
    pista("De derecha a izquierda: coge lo de la derecha y guárdalo en el nombre de la izquierda.", 1),
    pista("Es la primera: guarda el texto y le pone nombre. Wayne dice que si te has equivocado no se lo cuenta a nadie.", 2),
  ],
  recompensa: { croquetas: 4 },
}
