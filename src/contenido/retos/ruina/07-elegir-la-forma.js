import { codigo, pista } from '../comun.js'

export default {
  id: "ruina-07-elegir-la-forma",
  mundo: "ruina",
  entorno: "php",
  tipo: "eleccion",
  titulo: "Elegir la forma",
  enunciado: codigo(
    "La última decisión de la primera era, y la única que no se puede comprobar con un test:",
    "**qué forma le das a algo**. Aquí no se escribe: se decide.",
  ),
  pregunta: codigo(
    "Tienes tres clases que no tienen ningún parentesco -`Carro`, `Almacen` y `Barco`- y las",
    "tres necesitan poder decir cuánto pesa lo que llevan dentro. El cálculo es el mismo en las",
    "tres; lo que cambia es dónde guarda cada una su lista.",
    "",
    "¿Qué forma le das?",
  ),
  opciones: [
    {
      texto:
        "Una interfaz `Pesable` para poder pedirlas en un parámetro, y un rasgo con el cálculo que exija `abstract protected function cosas(): array`.",
      correcta: true,
      porque:
        "Las dos cosas y cada una a lo suyo: la interfaz es la promesa pública -lo que permite escribir `function total(Pesable ...$cosas)` sin saber de qué clase es nada- y el rasgo es la manera de cumplirla sin copiar el cálculo tres veces. El `abstract` de dentro es lo que hace que el rasgo funcione sin saber en qué propiedad guarda cada una su lista.",
    },
    {
      texto: "Una clase madre `Contenedor` de la que hereden las tres.",
      porque:
        "Es lo primero que apetece y es un parentesco inventado: un barco no es un tipo de almacén. El precio se paga el día que el barco necesite algo que los otros dos no, y hay que decidir si va en la madre -y los otros cargan con ello- o en el hijo -y la madre deja de significar nada-.",
    },
    {
      texto: "Una función suelta `pesoDe(array $cosas): int` a la que llamen las tres.",
      porque:
        "Funciona, y es mejor de lo que parece: es la respuesta correcta si lo único que se comparte es un cálculo sin estado. Lo que pierdes es la interfaz: sin ella no puedes escribir una función que reciba «cualquier cosa que sepa pesarse», y las tres clases tienen que acordarse de llamarla.",
    },
    {
      texto: "Copiar el cálculo en las tres: son tres líneas y así cada clase es independiente.",
      porque:
        "Tres sitios donde arreglar el mismo fallo, y la independencia que se gana es falsa: las tres dicen la misma regla, así que van a cambiar juntas. Eso es duplicación de conocimiento, que sí es un problema, y no duplicación de código, que a veces no lo es.",
    },
  ],
  explicacion: codigo(
    "La pregunta que ordena todas estas decisiones es siempre la misma: **¿esto es lo que la cosa",
    "es, o lo que la cosa sabe hacer?**",
    "",
    "- Lo que **es** → heredar. Y con cuidado, porque solo se puede ser una cosa.",
    "- Lo que **sabe hacer** → una interfaz.",
    "- **Cómo lo hace**, compartido → un rasgo, o mejor, un objeto aparte.",
    "- **Un cálculo sin estado** → una función.",
    "",
    "Y la regla de cuándo: la tercera vez. La primera se escribe, la segunda se copia y se",
    "anota, y la tercera se abstrae. Abstraer con dos casos es adivinar; con tres, ya se ve la",
    "forma.",
  ),
  pistas: [
    pista("Empieza por lo que hay que poder hacer desde fuera: ¿hace falta escribir una función que reciba cualquiera de las tres? Eso ya decide una de las dos piezas.", 0),
    pista("Ninguna de las tres es un tipo de las otras. Eso descarta una opción entera.", 1),
    pista("Dos de las cuatro opciones no están mal del todo: una es la respuesta y otra es lo que harías si no hiciera falta pedirlas en un parámetro.", 2),
  ],
  recompensa: { croquetas: 7 },
}
