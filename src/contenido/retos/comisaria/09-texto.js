import { codigo, pista } from '../comun.js'

export default {
  id: "com-09-texto",
  mundo: "comisaria",
  entorno: "worker",
  tipo: "bug",
  titulo: "El cartel que sale torcido",
  enunciado: codigo(
    "Este código imprime los carteles de busca y captura. Funciona... casi.",
    "",
    "Los nombres llegan del registro como vienen: con espacios de más y sin cuidar las",
    "mayúsculas. El cartel tiene que salir siempre igual: **nombre en mayúsculas, sin",
    "espacios sobrantes**, y con la recompensa.",
    "",
    "Arregla `hacerCartel` para que los cuatro tests pasen.",
  ),
  inicial: codigo(
    "function hacerCartel(nombre, recompensa) {",
    "  nombre.trim()",
    "  nombre.toUpperCase()",
    "  return `SE BUSCA: ${nombre} (${recompensa})`",
    "}",
    "",
    "console.log(hacerCartel('  miles Dagouter  ', 500))",
  ),
  solucion: codigo(
    "function hacerCartel(nombre, recompensa) {",
    "  const limpio = nombre.trim().toUpperCase()",
    "  return `SE BUSCA: ${limpio} (${recompensa})`",
    "}",
    "",
    "console.log(hacerCartel('  miles Dagouter  ', 500))",
  ),
  tests: [
    {
      nombre: "quita los espacios y pone mayúsculas",
      codigo: "esperar(hacerCartel('  miles Dagouter  ', 500)).igualA('SE BUSCA: MILES DAGOUTER (500)')",
    },
    {
      nombre: "también con un nombre que ya venía limpio",
      codigo: "esperar(hacerCartel('Paalm', 1200)).igualA('SE BUSCA: PAALM (1200)')",
    },
    {
      nombre: "los espacios de dentro no se tocan",
      codigo: "esperar(hacerCartel(' the suit ', 90)).igualA('SE BUSCA: THE SUIT (90)')",
    },
    {
      nombre: "no estropea el nombre que le pasaron",
      codigo: codigo(
        "const original = '  miles  '",
        "hacerCartel(original, 1)",
        "esperar(original).igualA('  miles  ')",
      ),
    },
  ],
  // El fallo original -no recoger lo que devuelve `trim`- se cuela en cuanto
  // el nombre viene limpio. Estas tandas traen suciedad de otras formas: el
  // nombre que ya estaba en mayúsculas, el que solo tiene espacios y las tildes.
  variantes: [
    {
      titulo: "El cartel que sale torcido · otra tanda",
      tests: [
        {
          nombre: "un nombre que ya venía gritado se queda igual, pero sin los espacios",
          codigo: "esperar(hacerCartel('   MELAAN   ', 900)).igualA('SE BUSCA: MELAAN (900)')",
        },
        {
          nombre: "una recompensa de cero sale escrita",
          codigo: "esperar(hacerCartel('wayne', 0)).igualA('SE BUSCA: WAYNE (0)')",
        },
        {
          nombre: "los espacios de dentro se respetan, aunque sean tres",
          codigo: "esperar(hacerCartel(' la   dama   de   hierro ', 400)).igualA('SE BUSCA: LA   DAMA   DE   HIERRO (400)')",
        },
        {
          nombre: "y una recompensa larga no se recorta",
          codigo: "esperar(hacerCartel('Paalm', 999999)).igualA('SE BUSCA: PAALM (999999)')",
        },
      ],
    },
    {
      titulo: "El cartel que sale torcido · y otra",
      tests: [
        {
          nombre: "las tildes también saben ponerse en mayúscula",
          codigo: "esperar(hacerCartel('  aradán  ', 12)).igualA('SE BUSCA: ARADÁN (12)')",
        },
        {
          nombre: "un nombre que solo son espacios deja el hueco vacío",
          codigo: "esperar(hacerCartel('    ', 5)).igualA('SE BUSCA:  (5)')",
        },
        {
          nombre: "una sola letra basta para un cartel",
          codigo: "esperar(hacerCartel(' v ', 1)).igualA('SE BUSCA: V (1)')",
        },
        {
          nombre: "el nombre que te dieron sigue como estaba: los textos no se cambian, se copian",
          codigo: codigo(
            "const original = ' Steris  '",
            "hacerCartel(original, 77)",
            "esperar(original).igualA(' Steris  ')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Las dos primeras líneas hacen el trabajo bien. El problema es lo que pasa con el resultado.", 0),
    pista("`nombre.trim()` no cambia `nombre`: devuelve un texto nuevo. Si nadie lo recoge, se pierde.", 1),
    pista("Los dos métodos están bien elegidos y bien encadenados. Lo que falta es que alguien recoja lo que devuelven: hace falta una variable nueva con ese resultado, y usarla en la plantilla en lugar de la que te llegó.", 2),
  ],
  recompensa: { croquetas: 7 },
}
