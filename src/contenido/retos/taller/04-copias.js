import { codigo, pista } from '../comun.js'

export default {
  id: "taller-04-copias",
  mundo: "taller",
  entorno: "worker",
  tipo: "bug",
  titulo: "La copia que no era una copia",
  enunciado: codigo(
    "Este código guarda una plantilla de equipo y prepara una salida a partir de ella.",
    "Se supone que la plantilla no se toca nunca.",
    "",
    "Ejecútalo. Verás que la plantilla acaba con gente que nadie metió ahí.",
    "",
    "Arregla `prepararSalida` para que la plantilla original quede intacta.",
  ),
  inicial: codigo(
    "const PLANTILLA = ['Wax', 'Wayne']",
    "",
    "function prepararSalida(refuerzo) {",
    "  const equipo = PLANTILLA",
    "  equipo.push(refuerzo)",
    "  return equipo",
    "}",
    "",
    "console.log(prepararSalida('Marasi'))",
    "console.log(PLANTILLA)",
  ),
  solucion: codigo(
    "const PLANTILLA = ['Wax', 'Wayne']",
    "",
    "function prepararSalida(refuerzo) {",
    "  const equipo = [...PLANTILLA]",
    "  equipo.push(refuerzo)",
    "  return equipo",
    "}",
    "",
    "console.log(prepararSalida('Marasi'))",
    "console.log(PLANTILLA)",
  ),
  requisitos: [
    { tipo: "usaSpread" },
  ],
  tests: [
    {
      nombre: "la salida lleva a los tres",
      codigo: "esperar(prepararSalida('Marasi')).igualA(['Wax', 'Wayne', 'Marasi'])",
    },
    {
      nombre: "y la plantilla se queda como estaba",
      codigo: codigo(
        "prepararSalida('Marasi')",
        "esperar(PLANTILLA).igualA(['Wax', 'Wayne'])",
      ),
    },
    {
      nombre: "dos salidas seguidas no se contaminan entre ellas",
      codigo: codigo(
        "prepararSalida('Marasi')",
        "esperar(prepararSalida('Steris')).igualA(['Wax', 'Wayne', 'Steris'])",
      ),
    },
    {
      nombre: "cada salida es una lista distinta",
      codigo: codigo(
        "const una = prepararSalida('Marasi')",
        "const otra = prepararSalida('Marasi')",
        "una.push('MeLaan')",
        "esperar(otra).tieneLongitud(3)",
      ),
    },
  ],
  pistas: [
    pista("`const equipo = PLANTILLA` no crea ninguna lista nueva. Le pone un segundo nombre a la que ya había.", 0),
    pista("Hace falta una lista nueva con el mismo contenido, y a esa sí se le puede hacer `push` tranquilamente.", 1),
    pista("La línea que hay que cambiar es la primera de la función, y el cambio cabe en tres puntos y un par de corchetes. Está en el apunte, en «Copiar de verdad». El `push` de después se queda exactamente como está.", 2),
  ],
  recompensa: { croquetas: 9 },
}
