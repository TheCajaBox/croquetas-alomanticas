import { codigo, pista } from '../comun.js'

export default {
  id: "sello-08-pasar-con-la-huella",
  mundo: "sello",
  entorno: "worker",
  tipo: "bug",
  titulo: "Entrar con la huella puesta",
  enunciado: codigo(
    "`comprobar` decide si alguien entra. Funciona: con la contraseña buena dice `true` y con",
    "una mala dice `false`. Le han hecho pruebas y las pasa todas.",
    "",
    "Y tiene un agujero enorme. Quien haya robado la tabla de cuentas no necesita adivinar",
    "ninguna contraseña: **le basta con enviar la huella** que ya tiene en la mano.",
    "",
    "Arréglalo. `comprobar(ficha, loQueEscriben)` tiene que volver a hashear lo que le llegue",
    "—con la sal de la ficha— y comparar el resultado con la huella guardada.",
  ),
  inicial: codigo(
    "// Dado. No lo toques.",
    "function hashRapido(texto) {",
    "  const n = [...texto].reduce((cuenta, letra) => (cuenta * 31 + letra.codePointAt(0)) % 1000000007, 7)",
    "  return n.toString(16).padStart(8, '0')",
    "}",
    "",
    "function hashLento(texto, vueltas) {",
    "  let firma = texto",
    "  for (let i = 0; i < vueltas; i += 1) firma = hashRapido(firma + ':' + i)",
    "  return firma",
    "}",
    "",
    "function registrar(usuario, clave, sal) {",
    "  return { usuario, sal, huella: hashLento(sal + ':' + clave, 1000) }",
    "}",
    "",
    "// Tu parte.",
    "function comprobar(ficha, loQueEscriben) {",
    "  if (loQueEscriben === ficha.huella) return true",
    "  return hashLento(ficha.sal + ':' + loQueEscriben, 1000) === ficha.huella",
    "}",
  ),
  solucion: codigo(
    "// Dado. No lo toques.",
    "function hashRapido(texto) {",
    "  const n = [...texto].reduce((cuenta, letra) => (cuenta * 31 + letra.codePointAt(0)) % 1000000007, 7)",
    "  return n.toString(16).padStart(8, '0')",
    "}",
    "",
    "function hashLento(texto, vueltas) {",
    "  let firma = texto",
    "  for (let i = 0; i < vueltas; i += 1) firma = hashRapido(firma + ':' + i)",
    "  return firma",
    "}",
    "",
    "function registrar(usuario, clave, sal) {",
    "  return { usuario, sal, huella: hashLento(sal + ':' + clave, 1000) }",
    "}",
    "",
    "// Tu parte.",
    "function comprobar(ficha, loQueEscriben) {",
    "  return hashLento(ficha.sal + ':' + loQueEscriben, 1000) === ficha.huella",
    "}",
  ),
  requisitos: [
    { tipo: "usaLlamada", valor: "hashLento", texto: "Lo que llega se vuelve a hashear, siempre" },
  ],
  tests: [
    {
      nombre: "con la contraseña buena entra",
      codigo: codigo(
        "const ficha = registrar('shai', 'abeja14', 'salA')",
        "esperar(comprobar(ficha, 'abeja14'), 'entra con la buena').esVerdadero()",
      ),
    },
    {
      nombre: "con otra contraseña no entra",
      codigo: codigo(
        "const ficha = registrar('shai', 'abeja14', 'salA')",
        "esperar(comprobar(ficha, 'abeja15'), 'entra con una mala').esFalso()",
      ),
    },
    {
      nombre: "el ataque: enviando la huella robada no entra",
      codigo: codigo(
        "const ficha = registrar('shai', 'abeja14', 'salA')",
        "esperar(comprobar(ficha, ficha.huella), 'entra con la huella puesta').esFalso()",
      ),
    },
    {
      nombre: "ni enviando la sal",
      codigo: codigo(
        "const ficha = registrar('shai', 'abeja14', 'salA')",
        "esperar(comprobar(ficha, ficha.sal), 'entra con la sal').esFalso()",
      ),
    },
    {
      nombre: "ni con la huella de otra cuenta",
      codigo: codigo(
        "const una = registrar('shai', 'abeja14', 'salA')",
        "const otra = registrar('gaotona', 'trigo99', 'salB')",
        "esperar(comprobar(una, otra.huella), 'entra con la huella ajena').esFalso()",
      ),
    },
    {
      nombre: "con la contraseña vacía tampoco",
      codigo: codigo(
        "const ficha = registrar('shai', 'abeja14', 'salA')",
        "esperar(comprobar(ficha, ''), 'entra sin escribir nada').esFalso()",
      ),
    },
    {
      nombre: "y quien tiene la clave vacía de verdad entra con ella",
      codigo: codigo(
        "const ficha = registrar('nadie', '', 'salC')",
        "esperar(comprobar(ficha, ''), 'entra quien la tiene vacía').esVerdadero()",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Entrar con la huella puesta · otra tanda",
      tests: [
        {
          nombre: "la huella robada sigue sin servir con otra sal",
          codigo: codigo(
            "const ficha = registrar('hanshuxen', 'muralla', 'salZ')",
            "esperar(comprobar(ficha, ficha.huella), 'entra con la huella').esFalso()",
          ),
        },
        {
          nombre: "una clave que empieza igual no cuela",
          codigo: codigo(
            "const ficha = registrar('shai', 'abeja14', 'salA')",
            "esperar(comprobar(ficha, 'abeja'), 'entra con un trozo').esFalso()",
          ),
        },
        {
          nombre: "y la buena sigue entrando",
          codigo: codigo(
            "const ficha = registrar('shai', 'abeja14', 'salA')",
            "esperar(comprobar(ficha, 'abeja14'), 'entra con la buena').esVerdadero()",
          ),
        },
        {
          nombre: "la misma clave con la sal de otro no entra",
          codigo: codigo(
            "const ficha = registrar('shai', 'abeja14', 'salA')",
            "const impostor = { usuario: 'x', sal: 'salB', huella: ficha.huella }",
            "esperar(comprobar(impostor, 'abeja14'), 'entra con la sal cambiada').esFalso()",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Sobra una línea. Solo eso.", 0),
    pista(
      "La segunda línea ya hace bien todo el trabajo. Pregúntate qué añade la primera y a quién le sirve.",
      1,
    ),
    pista(
      "La huella guardada **no es una contraseña válida**: es lo que sale de una. Aceptarla directamente es dejar entrar a quien tenga la tabla, que es justo de quien te defiendes.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
