import { codigo, pista } from '../comun.js'

export default {
  id: "melaan-03-lo-repetido",
  mundo: "melaan",
  entorno: "worker",
  tipo: "refactor",
  titulo: "Tres veces lo mismo",
  enunciado: codigo(
    "Mira estas tres funciones. Léelas despacio y verás que son **la misma función** con",
    "tres palabras cambiadas.",
    "",
    "Escribe `describir(persona, oficio, ciudad)` que haga el trabajo, y deja que las tres",
    "la usen. Las tres tienen que seguir devolviendo exactamente lo que devolvían.",
  ),
  inicial: codigo(
    "function presentarAgente(nombre) {",
    "  return nombre + ', agente de Elendel'",
    "}",
    "",
    "function presentarLadron(nombre) {",
    "  return nombre + ', ladrón de Elendel'",
    "}",
    "",
    "function presentarSenador(nombre) {",
    "  return nombre + ', senador de Elendel'",
    "}",
  ),
  solucion: codigo(
    "const describir = (persona, oficio, ciudad) => `${persona}, ${oficio} de ${ciudad}`",
    "",
    "const presentarAgente = (nombre) => describir(nombre, 'agente', 'Elendel')",
    "const presentarLadron = (nombre) => describir(nombre, 'ladrón', 'Elendel')",
    "const presentarSenador = (nombre) => describir(nombre, 'senador', 'Elendel')",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "describir" },
    { tipo: "usaLlamada", valor: "describir" },
    { tipo: "usaPlantilla" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "las tres siguen diciendo lo mismo que antes",
      codigo: codigo(
        "esperar(presentarAgente('Marasi')).igualA('Marasi, agente de Elendel')",
        "esperar(presentarLadron('Wayne')).igualA('Wayne, ladrón de Elendel')",
        "esperar(presentarSenador('Wax')).igualA('Wax, senador de Elendel')",
      ),
    },
    { nombre: "la función común sirve para cualquier cosa", codigo: "esperar(describir('MeLaan', 'kandra', 'la Cuenca')).igualA('MeLaan, kandra de la Cuenca')" },
    {
      nombre: "las tres se apoyan en ella y no la repiten",
      codigo: codigo(
        "esperar(typeof describir).igualA('function')",
        "esperar(typeof presentarAgente).igualA('function')",
      ),
    },
  ],
  pistas: [
    pista("Pon las tres una debajo de otra. Solo cambia una palabra en medio.", 0),
    pista("Esa palabra que cambia es un parámetro. Y ya que estás, saca también la ciudad.", 1),
    pista("Una sola función con tres parámetros: quién, qué oficio y de dónde. Las tres versiones de antes se quedan en tres llamadas a esa, cada una con sus tres datos. Si te sale una plantilla por cada oficio, todavía no has terminado.", 2),
  ],
  recompensa: { croquetas: 14 },
}
