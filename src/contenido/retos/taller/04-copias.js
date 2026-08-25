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
  // Cada tanda vuelve a mirar lo mismo desde otro ángulo: que la lista que sale
  // no ES la plantilla, y que tocar la que sale no la toque a ella.
  variantes: [
    {
      titulo: "La copia que no era una copia · otra tanda",
      tests: [
        { nombre: "el refuerzo entra al final de la fila", codigo: "esperar(prepararSalida('MeLaan')[2]).igualA('MeLaan')" },
        {
          nombre: "tres salidas seguidas y la plantilla sigue teniendo dos nombres",
          codigo: codigo(
            "prepararSalida('a')",
            "prepararSalida('b')",
            "prepararSalida('c')",
            "esperar(PLANTILLA).tieneLongitud(2)",
          ),
        },
        { nombre: "cada salida son tres, ni cuatro ni cinco", codigo: "esperar(prepararSalida('Steris')).tieneLongitud(3)" },
        {
          nombre: "la salida no es la plantilla: son dos listas distintas de verdad",
          codigo: "esperar(prepararSalida('x') === PLANTILLA).esFalso()",
        },
        {
          nombre: "y tocar la salida -hasta cambiarle el primero- no toca la plantilla",
          codigo: codigo(
            "const salida = prepararSalida('x')",
            "salida.push('y')",
            "salida[0] = 'nadie'",
            "esperar(PLANTILLA).igualA(['Wax', 'Wayne'])",
          ),
        },
      ],
    },
    {
      titulo: "La copia que no era una copia · y otra",
      tests: [
        { nombre: "un refuerzo sin nombre también ocupa su plaza", codigo: "esperar(prepararSalida('')).igualA(['Wax', 'Wayne', ''])" },
        { nombre: "y la plantilla sigue siendo la de siempre después", codigo: "esperar(PLANTILLA).igualA(['Wax', 'Wayne'])" },
        {
          nombre: "las dos primeras plazas son Wax y Wayne, salida tras salida",
          codigo: codigo(
            "const salida = prepararSalida('MeLaan')",
            "esperar(salida[0]).igualA('Wax')",
            "esperar(salida[1]).igualA('Wayne')",
          ),
        },
        {
          nombre: "pedir la misma salida dos veces da dos listas, no la misma dos veces",
          codigo: "esperar(prepararSalida('a') === prepararSalida('a')).esFalso()",
        },
        {
          nombre: "y cinco salidas después la plantilla no ha engordado ni un nombre",
          codigo: codigo(
            "prepararSalida('1')",
            "prepararSalida('2')",
            "prepararSalida('3')",
            "prepararSalida('4')",
            "prepararSalida('5')",
            "esperar(PLANTILLA).igualA(['Wax', 'Wayne'])",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("`const equipo = PLANTILLA` no crea ninguna lista nueva. Le pone un segundo nombre a la que ya había.", 0),
    pista("Hace falta una lista nueva con el mismo contenido, y a esa sí se le puede hacer `push` tranquilamente.", 1),
    pista("La línea que hay que cambiar es la primera de la función, y el cambio cabe en tres puntos y un par de corchetes. Está en el apunte, en «Copiar de verdad». El `push` de después se queda exactamente como está.", 2),
  ],
  recompensa: { croquetas: 9 },
}
