import { codigo, pista } from '../comun.js'

export default {
  id: "taller-03-errores",
  mundo: "taller",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Cuando algo va mal a propósito",
  enunciado: codigo(
    "Hasta ahora, cuando algo iba mal, el programa reventaba. Un programa serio decide",
    "**qué falla, cómo se avisa y quién lo recoge**.",
    "",
    "Escribe dos cosas:",
    "",
    "- `retirar(saldo, cantidad)` — devuelve el saldo que queda. Si la cantidad no es",
    "  positiva, **lanza** un error con el mensaje `'La cantidad tiene que ser positiva'`.",
    "  Si no hay saldo suficiente, lanza `'Saldo insuficiente'`.",
    "- `retirarSinRiesgo(saldo, cantidad)` — llama a la anterior y **recoge** el error:",
    "  devuelve `{ ok: true, saldo }` si sale bien, y `{ ok: false, error }` con el",
    "  mensaje si no.",
  ),
  inicial: codigo(
    "function retirar(saldo, cantidad) {",
    "  // lanza si la cantidad no vale o si no llega el saldo",
    "}",
    "",
    "function retirarSinRiesgo(saldo, cantidad) {",
    "  // llama a retirar y recoge lo que pase",
    "}",
    "",
    "console.log(retirarSinRiesgo(100, 30))",
    "console.log(retirarSinRiesgo(100, 500))",
  ),
  solucion: codigo(
    "function retirar(saldo, cantidad) {",
    "  if (cantidad <= 0) {",
    "    throw new Error('La cantidad tiene que ser positiva')",
    "  }",
    "  if (cantidad > saldo) {",
    "    throw new Error('Saldo insuficiente')",
    "  }",
    "  return saldo - cantidad",
    "}",
    "",
    "function retirarSinRiesgo(saldo, cantidad) {",
    "  try {",
    "    return { ok: true, saldo: retirar(saldo, cantidad) }",
    "  } catch (error) {",
    "    return { ok: false, error: error.message }",
    "  }",
    "}",
    "",
    "console.log(retirarSinRiesgo(100, 30))",
    "console.log(retirarSinRiesgo(100, 500))",
  ),
  requisitos: [
    { tipo: "usaLlamada", valor: "Error" },
  ],
  tests: [
    {
      nombre: "una retirada normal descuenta del saldo",
      codigo: "esperar(retirar(100, 30)).igualA(70)",
    },
    {
      nombre: "retirar lo justo deja el saldo a cero",
      codigo: "esperar(retirar(100, 100)).igualA(0)",
    },
    {
      nombre: "una cantidad negativa lanza, no devuelve",
      codigo: "esperar(() => retirar(100, -5)).lanzaError('La cantidad tiene que ser positiva')",
    },
    {
      nombre: "el cero tampoco es una cantidad válida",
      codigo: "esperar(() => retirar(100, 0)).lanzaError('La cantidad tiene que ser positiva')",
    },
    {
      nombre: "sin saldo suficiente lanza el otro error",
      codigo: "esperar(() => retirar(100, 500)).lanzaError('Saldo insuficiente')",
    },
    {
      nombre: "la versión sin riesgo devuelve el saldo cuando todo va bien",
      codigo: codigo(
        "const r = retirarSinRiesgo(100, 30)",
        "esperar(r.ok).esVerdadero()",
        "esperar(r.saldo).igualA(70)",
      ),
    },
    {
      nombre: "y recoge el error en vez de reventar",
      codigo: codigo(
        "const r = retirarSinRiesgo(100, 500)",
        "esperar(r.ok).esFalso()",
        "esperar(r.error).igualA('Saldo insuficiente')",
      ),
    },
    {
      nombre: "recoge también el de la cantidad",
      codigo: "esperar(retirarSinRiesgo(100, -1).error).igualA('La cantidad tiene que ser positiva')",
    },
  ],
  // Otros saldos, y con los dos errores compitiendo: cuando la cantidad no vale
  // Y el saldo tampoco, el que se lanza es el primero que se comprueba.
  variantes: [
    {
      titulo: "Cuando algo va mal a propósito · otra tanda",
      tests: [
        {
          nombre: "de un saldo a cero no se puede sacar ni uno",
          codigo: "esperar(() => retirar(0, 1)).lanzaError()",
        },
        {
          nombre: "pedir cero de una cuenta vacía se queja de la cantidad, que se mira antes",
          codigo: "esperar(retirarSinRiesgo(0, 0).error).igualA('La cantidad tiene que ser positiva')",
        },
        {
          nombre: "una unidad de más ya es saldo insuficiente",
          codigo: "esperar(retirarSinRiesgo(100, 101).error).igualA('Saldo insuficiente')",
        },
        {
          nombre: "cuando sale bien no viene ningún error de propina",
          codigo: codigo(
            "const r = retirarSinRiesgo(50, 20)",
            "esperar(r.ok).esVerdadero()",
            "esperar(r.saldo).igualA(30)",
            "esperar(r.error, 'el error').igualA(undefined)",
          ),
        },
        {
          nombre: "y cuando sale mal no viene ningún saldo inventado",
          codigo: codigo(
            "const r = retirarSinRiesgo(50, 900)",
            "esperar(r.ok).esFalso()",
            "esperar(r.saldo, 'el saldo').igualA(undefined)",
          ),
        },
      ],
    },
    {
      titulo: "Cuando algo va mal a propósito · y otra",
      tests: [
        { nombre: "de mil, uno: quedan novecientos noventa y nueve", codigo: "esperar(retirar(1000, 1)).igualA(999)" },
        {
          nombre: "vaciar la cuenta al céntimo no es un error",
          codigo: codigo(
            "const r = retirarSinRiesgo(80, 80)",
            "esperar(r.ok).esVerdadero()",
            "esperar(r.saldo).igualA(0)",
          ),
        },
        {
          nombre: "un negativo enorme sigue siendo una cantidad que no es positiva",
          codigo: "esperar(() => retirar(1000, -1000)).lanzaError()",
        },
        {
          nombre: "la versión sin riesgo no revienta ni con los dos problemas juntos",
          codigo: codigo(
            "const r = retirarSinRiesgo(0, -5)",
            "esperar(r.ok).esFalso()",
            "esperar(r.error).igualA('La cantidad tiene que ser positiva')",
          ),
        },
        {
          nombre: "y lo que se recoge es el mensaje, no el objeto Error entero",
          codigo: "esperar(retirarSinRiesgo(10, 99).error, 'el error recogido').esDeTipo('string')",
        },
      ],
    },
  ],
  pistas: [
    pista("Las dos comprobaciones van al principio de `retirar`, antes de hacer ninguna cuenta. Es el patrón de «salir pronto».", 0),
    pista("`throw new Error('...')` no se devuelve con `return`: se lanza, y ya corta la función él solo.", 1),
    pista("En `retirarSinRiesgo` el `return` con el resultado va **dentro** del `try`. Si lo pones fuera, se ejecutará también cuando haya habido error.", 2),
  ],
  recompensa: { croquetas: 10 },
}
