import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-06-la-sesion-que-se-queda-vieja",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "prediccion",
  titulo: "La sesión que se queda vieja",
  enunciado: codigo(
    "Dos maneras de preguntar si alguien puede borrar: leyendo los permisos **de la sesión** y",
    "leyéndolos de la fuente que manda. En medio, a Han ShuXen le quitan el permiso.",
    "",
    "Di exactamente qué escribe. Son cuatro líneas de `true` o `false`.",
  ),
  codigoMostrado: codigo(
    "const PERMISOS = { hanshuxen: ['ver', 'firmar', 'borrar'] }",
    "",
    "// Al entrar, se le copian los permisos a la sesión.",
    "const sesion = { usuario: 'hanshuxen', permisos: [...PERMISOS.hanshuxen] }",
    "",
    "const desdeLaSesion = (accion) => sesion.permisos.includes(accion)",
    "const desdeLaFuente = (accion) => (PERMISOS[sesion.usuario] ?? []).includes(accion)",
    "",
    "console.log(desdeLaSesion('borrar'))",
    "console.log(desdeLaFuente('borrar'))",
    "",
    "// Le quitan el permiso de borrar.",
    "PERMISOS.hanshuxen = PERMISOS.hanshuxen.filter((cada) => cada !== 'borrar')",
    "",
    "console.log(desdeLaSesion('borrar'))",
    "console.log(desdeLaFuente('borrar'))",
  ),
  respuestaEsperada: codigo("true", "true", "true", "false"),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('true\\ntrue\\ntrue\\nfalse')",
      ),
    },
  ],
  pistas: [
    pista("Las tres primeras salen iguales. La cuarta es la única distinta.", 0),
    pista(
      "Fíjate en los tres puntos del `[...PERMISOS.hanshuxen]`: eso hace una **copia**. La lista de la sesión y la de la fuente son dos listas distintas desde ese momento.",
      1,
    ),
    pista(
      "Quitar el permiso cambia una de las dos listas. La otra sigue como estaba, y quien la mire seguirá diciendo que sí durante todo lo que dure la sesión.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
