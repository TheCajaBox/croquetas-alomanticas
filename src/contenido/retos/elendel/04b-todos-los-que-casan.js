import { codigo, pista } from '../comun.js'

export default {
  id: "elendel-04b-todos-los-que-casan",
  mundo: "elendel",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Todos los que casan, no el primero",
  enunciado: codigo(
    "`match` sin la `g` te da **una** coincidencia con sus grupos. Con la `g` te da todas,",
    "pero pierde los grupos. Durante años eso obligaba a hacer malabares con bucles.",
    "",
    "Desde hace poco existe `matchAll`, que da todas **y** los grupos de cada una. Y los",
    "grupos se pueden poner con nombre, que se lee muchísimo mejor que `[1]` y `[2]`.",
    "",
    "El parte de la noche llega así, una línea por agente:",
    "",
    "```",
    "AGENTE: Marasi (casos: 12)",
    "AGENTE: Wayne (casos: 3)",
    "```",
    "",
    "Escribe `fichar(parte)`, que devuelva una lista de objetos `{ agente, casos }` con",
    "**todos** los agentes que aparezcan, en el orden en que aparecen. `agente` es texto sin",
    "espacios de sobra a los lados y `casos` es un **número**.",
    "",
    "Si no hay ninguno, devuelve una lista vacía. Y usa `matchAll`: con un bucle también",
    "sale, pero hoy toca esto.",
  ),
  inicial: codigo(
    "function fichar(parte) {",
    "  // El patrón lleva `g` y dos grupos con nombre: (?<comoSeLlame>...)",
    "  // `matchAll` devuelve un iterador, no una lista.",
    "}",
  ),
  solucion: codigo(
    "function fichar(parte) {",
    "  const patron = /AGENTE: (?<agente>[^(]+) \\(casos: (?<casos>\\d+)\\)/g",
    "",
    "  return [...parte.matchAll(patron)].map((cada) => ({",
    "    agente: cada.groups.agente.trim(),",
    "    casos: Number(cada.groups.casos),",
    "  }))",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "fichar" },
    { tipo: "usaLlamada", valor: "matchAll" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "saca los tres agentes del parte, en orden",
      codigo: codigo(
        "const parte = ['AGENTE: Marasi (casos: 12)', 'AGENTE: Wayne (casos: 3)', 'AGENTE: Wax (casos: 7)']",
        "  .join(String.fromCharCode(10))",
        "esperar(fichar(parte)).igualA([",
        "  { agente: 'Marasi', casos: 12 },",
        "  { agente: 'Wayne', casos: 3 },",
        "  { agente: 'Wax', casos: 7 },",
        "])",
      ),
    },
    {
      nombre: "los casos son números, no textos",
      codigo: codigo(
        "const uno = fichar('AGENTE: Steris (casos: 40)')[0]",
        "esperar(uno.casos, 'los casos').esDeTipo('number')",
      ),
    },
    {
      nombre: "un parte sin nadie devuelve una lista vacía, no null",
      codigo: codigo(
        "esperar(fichar('Esta noche no ha pasado nada de nada.')).igualA([])",
      ),
    },
    {
      nombre: "dos en la misma línea también cuentan los dos",
      codigo: codigo(
        "esperar(fichar('AGENTE: MeLaan (casos: 40) y AGENTE: Wayne (casos: 1)')).igualA([",
        "  { agente: 'MeLaan', casos: 40 },",
        "  { agente: 'Wayne', casos: 1 },",
        "])",
      ),
    },
  ],
  // Practicar esto es practicar el patrón: los datos cambian de forma y el
  // patrón tiene que seguir cazándolos todos, no solo el primero.
  variantes: [
    {
      titulo: "Todos los que casan · otra tanda",
      tests: [
        {
          nombre: "un agente con cero casos entra igual que los demás",
          codigo: "esperar(fichar('AGENTE: Steris (casos: 0)')).igualA([{ agente: 'Steris', casos: 0 }])",
        },
        {
          nombre: "un nombre con dos palabras se queda entero",
          codigo: codigo(
            "esperar(fichar('AGENTE: Lord Waxillium (casos: 5)')).igualA([",
            "  { agente: 'Lord Waxillium', casos: 5 },",
            "])",
          ),
        },
        {
          nombre: "las líneas que no son de agentes se ignoran sin estorbar",
          codigo: codigo(
            "const parte = ['Parte de la noche del 14', 'AGENTE: Wayne (casos: 2)', 'Fin del parte']",
            "  .join(String.fromCharCode(10))",
            "esperar(fichar(parte)).igualA([{ agente: 'Wayne', casos: 2 }])",
          ),
        },
        {
          nombre: "y una cifra larga sigue siendo un número",
          codigo: codigo(
            "const uno = fichar('AGENTE: Marasi (casos: 1204)')[0]",
            "esperar(uno.casos).igualA(1204)",
          ),
        },
      ],
    },
    {
      titulo: "Todos los que casan · y otra",
      tests: [
        {
          nombre: "seis agentes salen seis, sin repetir ni saltarse a nadie",
          codigo: codigo(
            "const nombres = ['Wax', 'Wayne', 'Marasi', 'Steris', 'MeLaan', 'Ranette']",
            "const parte = nombres.map((cada, i) => 'AGENTE: ' + cada + ' (casos: ' + i + ')')",
            "  .join(String.fromCharCode(10))",
            "esperar(fichar(parte).map((cada) => cada.agente)).igualA(nombres)",
          ),
        },
        {
          nombre: "el mismo agente dos veces sale dos veces: no se agrupa nada",
          codigo: codigo(
            "const parte = ['AGENTE: Wayne (casos: 1)', 'AGENTE: Wayne (casos: 4)']",
            "  .join(String.fromCharCode(10))",
            "esperar(fichar(parte)).tieneLongitud(2)",
          ),
        },
        {
          nombre: "un texto vacío no revienta: da lista vacía",
          codigo: "esperar(fichar('')).igualA([])",
        },
        {
          nombre: "los casos se pueden sumar tal cual, porque son números",
          codigo: codigo(
            "const parte = ['AGENTE: Wax (casos: 10)', 'AGENTE: Marasi (casos: 32)']",
            "  .join(String.fromCharCode(10))",
            "const total = fichar(parte).reduce((suma, cada) => suma + cada.casos, 0)",
            "esperar(total).igualA(42)",
          ),
        },
        {
          nombre: "y devuelve una lista de verdad, no el iterador de matchAll",
          codigo: "esperar(fichar('AGENTE: Wayne (casos: 1)')).esDeTipo('array')",
        },
      ],
    },
  ],
  pistas: [
    pista("Empieza por el patrón de una sola línea del parte, sin pensar todavía en las demás. Cuando cace una, la `g` se encarga del resto.", 0),
    pista("Un grupo con nombre se escribe `(?<comoSeLlame>...)` y luego se lee en `coincidencia.groups.comoSeLlame`. El del nombre del agente tiene que parar antes del paréntesis que abre.", 1),
    pista("`matchAll` no devuelve una lista: devuelve algo que se puede recorrer. Los tres puntitos lo convierten en lista, y a partir de ahí es un recorrido normal transformando cada coincidencia en un objeto. Acuérdate de que el texto del grupo viene con el espacio de antes del paréntesis pegado.", 2),
  ],
  recompensa: { croquetas: 13 },
}
