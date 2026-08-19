import { codigo, pista } from '../comun.js'

export default {
  id: "dia1-03b-verdadero-o-falso",
  mundo: "primer-dia",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Cinco cosas que se dicen por ahí",
  enunciado: codigo(
    "Cinco frases sobre lo que llevas visto. Unas son verdad y otras son de esas cosas",
    "que uno se cree al principio y luego cuesta quitarse.",
    "",
    "Marca cada una y dale a corregir. Se explican todas, aciertes o no.",
  ),
  afirmaciones: [
    {
      texto: "`const` significa que el valor no se puede cambiar nunca.",
      verdadera: true,
      porque: "Para lo que has visto hasta ahora, sí: si escribes `const dias = 3` y luego `dias = 4`, el programa se para con un error. (Con listas y objetos hay un matiz que verás más adelante, pero eso es más tarde.)",
    },
    {
      texto: "`'42'` y `42` son lo mismo, porque los dos son cuarenta y dos.",
      porque: "No lo son. `42` es un número y `'42'` es un texto que casualmente lleva dígitos dentro. Con el número puedes hacer cuentas; con el texto, no — o peor, puedes hacerlas y salir mal. Las comillas lo cambian todo.",
    },
    {
      texto: "Un programa se lee de arriba abajo, línea por línea.",
      verdadera: true,
      porque: "Esa es la idea de base y es la que hay que tener en la cabeza. Más adelante verás cosas que se salen del orden -bucles, funciones, esperas- pero todas son desvíos sobre esta regla, no excepciones a ella.",
    },
    {
      texto: "El nombre de una variable dice algo sobre lo que hay dentro.",
      porque: "Al ordenador no le dice nada: `const x = 25` y `const tarifaDiaria = 25` funcionan exactamente igual. El nombre es para las personas, y por eso importa tanto — pero no cambia lo que el programa hace.",
    },
    {
      texto: "Si escribes `console.log('hola')` dos veces, sale «hola» dos veces.",
      verdadera: true,
      porque: "Cada línea se ejecuta cuando le toca, y una línea repetida se ejecuta otra vez. Suena obvio y conviene fijarlo, porque es la base de entender los bucles: un bucle no es más que repetir líneas sin escribirlas dos veces.",
    },
  ],
  pistas: [
    pista("Dos de las cinco van de la diferencia entre un número y un texto que parece un número. Fíjate en las comillas.", 0),
    pista("Piensa en quién lee cada cosa: hay algo en un programa que solo sirve para las personas y al ordenador le da exactamente igual.", 1),
    pista("Las tres verdaderas son las que describen lo que hace el ordenador de forma literal. Las dos falsas son suposiciones nuestras que suenan razonables.", 2),
  ],
  recompensa: { croquetas: 5 },
}
