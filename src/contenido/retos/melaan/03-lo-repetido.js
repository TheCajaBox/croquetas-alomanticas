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
  // Si el refactor se ha hecho a medias -una plantilla por oficio- estas tandas
  // no lo notan; lo que notan es que `describir` sirva para cualquier cosa, que
  // es para lo que se sacó.
  variantes: [
    {
      titulo: "Tres veces lo mismo · otra tanda",
      tests: [
        {
          nombre: "el mismo nombre con los tres oficios da tres frases distintas",
          codigo: codigo(
            "esperar(presentarAgente('MeLaan')).igualA('MeLaan, agente de Elendel')",
            "esperar(presentarLadron('MeLaan')).igualA('MeLaan, ladrón de Elendel')",
            "esperar(presentarSenador('MeLaan')).igualA('MeLaan, senador de Elendel')",
          ),
        },
        {
          nombre: "describir vale para oficios que no existían en la comisaría",
          codigo: "esperar(describir('Steris', 'contable', 'Bilming')).igualA('Steris, contable de Bilming')",
        },
        {
          nombre: "un nombre con espacios pasa entero",
          codigo: "esperar(presentarAgente('Waxillium Ladrian')).igualA('Waxillium Ladrian, agente de Elendel')",
        },
        {
          nombre: "y las tres siguen devolviendo textos, no objetos",
          codigo: codigo(
            "esperar(presentarAgente('a'), 'lo que devuelve presentarAgente').esDeTipo('string')",
            "esperar(presentarLadron('a'), 'lo que devuelve presentarLadron').esDeTipo('string')",
            "esperar(presentarSenador('a'), 'lo que devuelve presentarSenador').esDeTipo('string')",
          ),
        },
      ],
    },
    {
      titulo: "Tres veces lo mismo · y otra",
      tests: [
        {
          nombre: "un nombre vacío deja el hueco vacío y no se inventa nada",
          codigo: "esperar(presentarLadron('')).igualA(', ladrón de Elendel')",
        },
        {
          nombre: "describir con los tres huecos vacíos deja la puntuación en pie, y el hueco del oficio a la vista",
          codigo: "esperar(describir('', '', '')).igualA(',  de ')",
        },
        {
          nombre: "las tildes del oficio se conservan: ladrón se escribe con tilde",
          codigo: "esperar(presentarLadron('Wayne').includes('ladrón')).esVerdadero()",
        },
        {
          nombre: "describir acepta la ciudad que le pongas, aunque lleve artículo",
          codigo: "esperar(describir('MeLaan', 'kandra', 'la Cuenca Basin')).igualA('MeLaan, kandra de la Cuenca Basin')",
        },
        {
          nombre: "y las cuatro funciones existen y son funciones",
          codigo: codigo(
            "esperar(typeof describir).igualA('function')",
            "esperar(typeof presentarAgente).igualA('function')",
            "esperar(typeof presentarLadron).igualA('function')",
            "esperar(typeof presentarSenador).igualA('function')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Pon las tres una debajo de otra. Solo cambia una palabra en medio.", 0),
    pista("Esa palabra que cambia es un parámetro. Y ya que estás, saca también la ciudad.", 1),
    pista("Una sola función con tres parámetros: quién, qué oficio y de dónde. Las tres versiones de antes se quedan en tres llamadas a esa, cada una con sus tres datos. Si te sale una plantilla por cada oficio, todavía no has terminado.", 2),
  ],
  recompensa: { croquetas: 14 },
}
