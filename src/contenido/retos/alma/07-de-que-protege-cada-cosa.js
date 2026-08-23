import { codigo, pista } from '../comun.js'

export default {
  id: "alma-07-de-que-protege-cada-cosa",
  mundo: "alma",
  entorno: "worker",
  tipo: "emparejar",
  titulo: "De qué protege cada cosa",
  enunciado: codigo(
    "Seis defensas de los cinco mundos y seis ataques. Une cada defensa con el ataque que",
    "**para**, no con el que se le parece.",
    "",
    "Es la pregunta más útil de todo el camino: antes de decidir si algo protege, pregúntate",
    "**de quién**.",
  ),
  parejas: [
    {
      izquierda: "El hash lento con sal",
      derecha: "Quien se lleva la tabla de cuentas y quiere las contraseñas. No para a quien las adivina en la pantalla de entrada.",
    },
    {
      izquierda: "El límite de intentos",
      derecha: "Quien prueba contraseñas en la pantalla de entrada. No sirve de nada si ya tiene la tabla.",
    },
    {
      izquierda: "La consulta parametrizada",
      derecha: "Quien mete SQL en un campo de texto. No impide que pida un identificador que no es suyo.",
    },
    {
      izquierda: "La comprobación de dueño",
      derecha: "Quien pide un identificador que no es suyo. No impide que le cuenten de más en el mensaje de error.",
    },
    {
      izquierda: "La misma respuesta para «no existe» y «no es tuyo»",
      derecha: "Quien recorre identificadores para dibujar el sistema sin entrar en nada.",
    },
    {
      izquierda: "La política de contenidos",
      derecha: "Un script que ya se ha colado en la página: impide que se ejecute. No impide que se cuele.",
    },
  ],
  pistas: [
    pista("Cada descripción dice de qué protege **y de qué no**. La segunda mitad es la que decide.", 0),
    pista(
      "El hash lento y el límite de intentos suenan a lo mismo y paran a dos personas distintas: una tiene la tabla y la otra está en la pantalla de entrada.",
      1,
    ),
    pista(
      "La política de contenidos es la única de las seis que actúa **después** de que el ataque haya funcionado. Es la red, no la puerta.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
