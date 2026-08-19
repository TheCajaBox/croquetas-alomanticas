import { codigo, pista } from '../comun.js'

export default {
  id: "melaan-04-de-then-a-await",
  mundo: "melaan",
  entorno: "worker",
  tipo: "refactor",
  titulo: "Salir de la escalera",
  enunciado: codigo(
    "Esto pide un aviso, espera la respuesta, pide otro y espera otra vez. Funciona, pero",
    "cada paso mete el siguiente un poco más adentro. Con tres pasos ya cuesta seguirlo;",
    "con seis es ilegible, y tiene nombre: la escalera.",
    "",
    "Reescribe `reunirEquipo` con `async` y `await`, sin un solo `.then`. Mismo resultado.",
  ),
  inicial: codigo(
    "const avisar = (nombre) =>",
    "  new Promise((llega) => setTimeout(() => llega(`${nombre} llega`), 10))",
    "",
    "function reunirEquipo() {",
    "  return avisar('Wax').then(function (uno) {",
    "    return avisar('Wayne').then(function (dos) {",
    "      return avisar('Marasi').then(function (tres) {",
    "        return [uno, dos, tres]",
    "      })",
    "    })",
    "  })",
    "}",
  ),
  solucion: codigo(
    "const avisar = (nombre) =>",
    "  new Promise((llega) => setTimeout(() => llega(`${nombre} llega`), 10))",
    "",
    "async function reunirEquipo() {",
    "  const uno = await avisar('Wax')",
    "  const dos = await avisar('Wayne')",
    "  const tres = await avisar('Marasi')",
    "  return [uno, dos, tres]",
    "}",
  ),
  requisitos: [
    { tipo: "usaAsync" },
    { tipo: "prohibeLlamada", valor: "then" },
    { tipo: "declaraVariable", valor: "reunirEquipo" },
  ],
  tests: [
    { nombre: "reúne a los tres en orden", codigo: "esperar(await reunirEquipo()).igualA(['Wax llega', 'Wayne llega', 'Marasi llega'])" },
    { nombre: "sigue devolviendo una promesa", codigo: "esperar(reunirEquipo() instanceof Promise).esVerdadero()" },
    {
      nombre: "se puede llamar dos veces seguidas",
      codigo: codigo(
        "const primera = await reunirEquipo()",
        "const segunda = await reunirEquipo()",
        "esperar(primera).igualA(segunda)",
      ),
    },
  ],
  pistas: [
    pista("Marca la función con `async` y cada `.then(...)` se convierte en un `await` con su variable.", 0),
    pista("Los tres valores que la escalera arrastraba hacia abajo pasan a ser tres `const` normales, uno por línea.", 1),
    pista("La función pasa a ser `async`. Dentro, cada peldaño de la escalera se convierte en una línea que declara una constante esperando su aviso, una debajo de otra. Al final devuelves los tres juntos, y no queda ni un `.then` en pie.", 2),
  ],
  recompensa: { croquetas: 16 },
}
