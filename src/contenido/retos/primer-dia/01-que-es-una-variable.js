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
  apunte: codigo(
    "Yo llevo un cuaderno donde apunto lo que voy sabiendo de cada caso. Un nombre,",
    "una cifra, una dirección. Programar se parece bastante a eso: **guardar algo y",
    "ponerle un nombre** para poder volver a mirarlo luego.",
    "",
    "```js",
    "const sombrero = 'bombín'",
    "```",
    "",
    "Se lee de izquierda a derecha:",
    "",
    "- `const` — «voy a apuntar algo que no va a cambiar»",
    "- `sombrero` — el nombre con el que lo apunto",
    "- `=` — «guarda esto ahí» (y ojo: **no** significa «es igual a»)",
    "- `'bombín'` — el valor. Es texto, y por eso va entre comillas",
    "",
    "A partir de esa línea, donde escribas `sombrero` el ordenador entiende `'bombín'`.",
    "",
    "El nombre lo eliges tú, y elegirlo bien es media profesión. En mi cuaderno pone",
    "«sospechoso» y «recompensa», no «cosa» y «cosa 2». Cuando vuelva a abrirlo dentro",
    "de un mes lo agradeceré.",
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
