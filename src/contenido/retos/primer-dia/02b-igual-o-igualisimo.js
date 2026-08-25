import { codigo, pista } from '../comun.js'

export default {
  id: "dia1-02b-igual-o-igualisimo",
  mundo: "primer-dia",
  entorno: "worker",
  tipo: "prediccion",
  titulo: "Uno, dos o tres iguales",
  enunciado: codigo(
    "El signo `=` ya lo has visto: guarda. Lo que casi nadie te dice el primer día es que",
    "hay **tres** signos parecidos y que hacen tres cosas distintas.",
    "",
    "Lee el código y escribe qué imprime, una línea por cada `console.log`. Son seis.",
    "",
    "No hace falta que aciertes: hace falta que lo pienses antes de mirar. Escribe lo que",
    "creas y envíalo, que la explicación viene igual.",
  ),
  codigoMostrado: codigo(
    "const sombreros = 3",
    "const dichos = '3'",
    "",
    "console.log(sombreros === dichos)",
    "console.log(sombreros == dichos)",
    "",
    "let balas = 6",
    "console.log(balas = 5)",
    "console.log(balas)",
    "",
    "console.log(0 == '')",
    "console.log(0 === '')",
  ),
  respuestaEsperada: codigo(
    "false",
    "true",
    "5",
    "5",
    "true",
    "false",
  ),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue(['false', 'true', '5', '5', 'true', 'false']",
        "    .join(String.fromCharCode(10)))",
      ),
    },
  ],
  pistas: [
    pista("Cuenta los iguales de cada línea antes de decidir nada. Hay una con uno, dos con dos y dos con tres, y cada cantidad hace una cosa distinta.", 0),
    pista("`3` es un número y `'3'` es un texto: eso ya lo viste emparejando. El de tres iguales exige que además del contenido coincida el tipo; el de dos se conforma con parecerse.", 1),
    pista("La línea del medio no compara nada: con un solo igual está guardando un 5 en `balas`, y de paso el `console.log` imprime lo que acaba de guardar. Por eso las dos líneas seguidas dicen lo mismo.", 2),
  ],
  recompensa: { croquetas: 5 },
}
