import { codigo, pista } from '../comun.js'

export default {
  id: "taller-07-buscar-y-ordenar",
  mundo: "taller",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Buscar, comprobar y ordenar",
  enunciado: codigo(
    "`map`, `filter` y `reduce` ya los tienes. Faltan los otros cuatro que se usan a",
    "diario, y uno de ellos tiene una trampa doble.",
    "",
    "Sobre una lista de casos `{ titulo, recompensa, agente }`, escribe:",
    "",
    "- `elMasCaro(casos)` — el caso con la recompensa más alta, o `null` si no hay.",
    "- `buscarPorTitulo(casos, titulo)` — el caso con ese título, o `null`.",
    "- `todosAsignados(casos)` — `true` si todos tienen `agente`.",
    "- `hayAlguienSinAsignar(casos)` — `true` si al menos uno no lo tiene.",
    "- `porRecompensa(casos)` — una lista **nueva**, de mayor a menor recompensa, sin",
    "  tocar la que te pasaron.",
  ),
  inicial: codigo(
    "function elMasCaro(casos) {}",
    "function buscarPorTitulo(casos, titulo) {}",
    "function todosAsignados(casos) {}",
    "function hayAlguienSinAsignar(casos) {}",
    "function porRecompensa(casos) {}",
    "",
    "const casos = [",
    "  { titulo: 'Bleeder', recompensa: 1200, agente: 'Wax' },",
    "  { titulo: 'Suit', recompensa: 500, agente: 'Marasi' },",
    "  { titulo: 'el tranvía', recompensa: 80, agente: null },",
    "]",
    "",
    "console.log(elMasCaro(casos))",
  ),
  solucion: codigo(
    "function elMasCaro(casos) {",
    "  if (casos.length === 0) return null",
    "  return [...casos].sort((a, b) => b.recompensa - a.recompensa)[0]",
    "}",
    "",
    "function buscarPorTitulo(casos, titulo) {",
    "  return casos.find((caso) => caso.titulo === titulo) ?? null",
    "}",
    "",
    "function todosAsignados(casos) {",
    "  return casos.every((caso) => Boolean(caso.agente))",
    "}",
    "",
    "function hayAlguienSinAsignar(casos) {",
    "  return casos.some((caso) => !caso.agente)",
    "}",
    "",
    "function porRecompensa(casos) {",
    "  return [...casos].sort((a, b) => b.recompensa - a.recompensa)",
    "}",
    "",
    "const casos = [",
    "  { titulo: 'Bleeder', recompensa: 1200, agente: 'Wax' },",
    "  { titulo: 'Suit', recompensa: 500, agente: 'Marasi' },",
    "  { titulo: 'el tranvía', recompensa: 80, agente: null },",
    "]",
    "",
    "console.log(elMasCaro(casos))",
  ),
  requisitos: [
    { tipo: "usaLlamada", valor: "find" },
    { tipo: "usaLlamada", valor: "every" },
    { tipo: "usaLlamada", valor: "some" },
    { tipo: "usaLlamada", valor: "sort" },
    { tipo: "prohibeBucles" },
  ],
  tests: [
    {
      nombre: "encuentra el más caro",
      codigo: codigo(
        "const c = [",
        "  { titulo: 'a', recompensa: 100, agente: 'Wax' },",
        "  { titulo: 'b', recompensa: 900, agente: 'Wax' },",
        "]",
        "esperar(elMasCaro(c).titulo).igualA('b')",
      ),
    },
    {
      nombre: "sin casos no hay el más caro",
      codigo: "esperar(elMasCaro([])).igualA(null)",
    },
    {
      nombre: "busca por título",
      codigo: codigo(
        "const c = [{ titulo: 'Bleeder', recompensa: 1, agente: 'Wax' }]",
        "esperar(buscarPorTitulo(c, 'Bleeder').recompensa).igualA(1)",
      ),
    },
    {
      nombre: "y devuelve null cuando no está, no undefined",
      codigo: "esperar(buscarPorTitulo([], 'Nadie')).igualA(null)",
    },
    {
      nombre: "todosAsignados solo si lo están todos",
      codigo: codigo(
        "esperar(todosAsignados([{ titulo: 'a', recompensa: 1, agente: 'Wax' }])).esVerdadero()",
        "esperar(todosAsignados([{ titulo: 'a', recompensa: 1, agente: null }])).esFalso()",
      ),
    },
    {
      nombre: "hayAlguienSinAsignar con que sea uno",
      codigo: codigo(
        "const c = [",
        "  { titulo: 'a', recompensa: 1, agente: 'Wax' },",
        "  { titulo: 'b', recompensa: 1, agente: null },",
        "]",
        "esperar(hayAlguienSinAsignar(c)).esVerdadero()",
      ),
    },
    {
      nombre: "ordena de mayor a menor de verdad, no como texto",
      codigo: codigo(
        "const c = [",
        "  { titulo: 'a', recompensa: 9, agente: 'x' },",
        "  { titulo: 'b', recompensa: 100, agente: 'x' },",
        "  { titulo: 'c', recompensa: 80, agente: 'x' },",
        "]",
        "esperar(porRecompensa(c).map((caso) => caso.recompensa)).igualA([100, 80, 9])",
      ),
    },
    {
      nombre: "y no estropea la lista que le pasaron",
      codigo: codigo(
        "const c = [",
        "  { titulo: 'a', recompensa: 9, agente: 'x' },",
        "  { titulo: 'b', recompensa: 100, agente: 'x' },",
        "]",
        "porRecompensa(c)",
        "esperar(c.map((caso) => caso.recompensa)).igualA([9, 100])",
      ),
    },
    {
      nombre: "elMasCaro tampoco la estropea",
      codigo: codigo(
        "const c = [",
        "  { titulo: 'a', recompensa: 9, agente: 'x' },",
        "  { titulo: 'b', recompensa: 100, agente: 'x' },",
        "]",
        "elMasCaro(c)",
        "esperar(c[0].titulo).igualA('a')",
      ),
    },
  ],
  // Cinco funciones dan para mucha tanda. Estas van a por lo que la primera
  // vez se acierta por suerte: qué contestan `every` y `some` con la lista
  // vacía, y qué pasa cuando hay empate o el agente es un texto vacío.
  variantes: [
    {
      titulo: "Buscar, comprobar y ordenar · otra tanda",
      tests: [
        {
          nombre: "con un solo caso, el más caro es ese",
          codigo: "esperar(elMasCaro([{ titulo: 'solo', recompensa: 5, agente: 'x' }]).titulo).igualA('solo')",
        },
        {
          nombre: "con dos empatados arriba se queda con el que iba primero",
          codigo: codigo(
            "const c = [",
            "  { titulo: 'a', recompensa: 100, agente: 'x' },",
            "  { titulo: 'b', recompensa: 100, agente: 'x' },",
            "]",
            "esperar(elMasCaro(c).titulo).igualA('a')",
          ),
        },
        {
          nombre: "buscar un título que está en medio lo encuentra igual",
          codigo: codigo(
            "const c = [",
            "  { titulo: 'a', recompensa: 1, agente: 'x' },",
            "  { titulo: 'Suit', recompensa: 500, agente: 'x' },",
            "  { titulo: 'c', recompensa: 3, agente: 'x' },",
            "]",
            "esperar(buscarPorTitulo(c, 'Suit').recompensa).igualA(500)",
          ),
        },
        {
          nombre: "y distingue mayúsculas: «suit» no es «Suit»",
          codigo: codigo(
            "const c = [{ titulo: 'Suit', recompensa: 500, agente: 'x' }]",
            "esperar(buscarPorTitulo(c, 'suit')).igualA(null)",
          ),
        },
        {
          nombre: "con la lista vacía están todos asignados: no hay ninguno que no lo esté",
          codigo: codigo(
            "esperar(todosAsignados([])).esVerdadero()",
            "esperar(hayAlguienSinAsignar([])).esFalso()",
          ),
        },
        {
          nombre: "un agente que es texto vacío cuenta como sin asignar",
          codigo: codigo(
            "const c = [{ titulo: 'a', recompensa: 1, agente: '' }]",
            "esperar(todosAsignados(c)).esFalso()",
            "esperar(hayAlguienSinAsignar(c)).esVerdadero()",
          ),
        },
      ],
    },
    {
      titulo: "Buscar, comprobar y ordenar · y otra",
      tests: [
        {
          nombre: "mil va antes que setenta, y setenta antes que siete",
          codigo: codigo(
            "const c = [",
            "  { titulo: 'a', recompensa: 7, agente: 'x' },",
            "  { titulo: 'b', recompensa: 1000, agente: 'x' },",
            "  { titulo: 'c', recompensa: 70, agente: 'x' },",
            "]",
            "esperar(porRecompensa(c).map((caso) => caso.recompensa)).igualA([1000, 70, 7])",
          ),
        },
        {
          nombre: "ordenar uno solo devuelve una lista nueva con ese uno dentro",
          codigo: codigo(
            "const c = [{ titulo: 'a', recompensa: 1, agente: 'x' }]",
            "esperar(porRecompensa(c) === c).esFalso()",
            "esperar(porRecompensa(c)).tieneLongitud(1)",
          ),
        },
        { nombre: "ordenar la lista vacía tampoco revienta", codigo: "esperar(porRecompensa([])).igualA([])" },
        {
          nombre: "las recompensas a cero se ordenan como los demás números",
          codigo: codigo(
            "const c = [",
            "  { titulo: 'a', recompensa: 0, agente: 'x' },",
            "  { titulo: 'b', recompensa: 5, agente: 'x' },",
            "  { titulo: 'c', recompensa: 0, agente: 'x' },",
            "]",
            "esperar(porRecompensa(c).map((caso) => caso.recompensa)).igualA([5, 0, 0])",
          ),
        },
        {
          nombre: "con dos títulos iguales, buscar se trae el primero y se va",
          codigo: codigo(
            "const c = [",
            "  { titulo: 'x', recompensa: 1, agente: 'a' },",
            "  { titulo: 'x', recompensa: 2, agente: 'b' },",
            "]",
            "esperar(buscarPorTitulo(c, 'x').recompensa).igualA(1)",
          ),
        },
        {
          nombre: "y las dos comprobaciones son la una lo contrario de la otra",
          codigo: codigo(
            "const c = [",
            "  { titulo: 'a', recompensa: 1, agente: 'Wax' },",
            "  { titulo: 'b', recompensa: 1, agente: null },",
            "]",
            "esperar(todosAsignados(c)).igualA(!hayAlguienSinAsignar(c))",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Cuatro de las cinco son una línea. `elMasCaro` es la única que necesita mirar el caso de la lista vacía.", 0),
    pista("`find` devuelve `undefined` y aquí piden `null`: engánchale un `?? null` al final.", 1),
    pista("Hay dos tests que solo comprueban que no estropees la lista de fuera. Los pasan los corchetes: `[...casos].sort(...)`.", 2),
  ],
  recompensa: { croquetas: 12 },
}
