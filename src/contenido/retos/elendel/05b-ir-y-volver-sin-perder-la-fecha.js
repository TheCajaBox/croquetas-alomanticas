import { codigo, pista } from '../comun.js'

export default {
  id: "elendel-05b-ir-y-volver-sin-perder-la-fecha",
  mundo: "elendel",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Ir y volver sin perder la fecha",
  enunciado: codigo(
    "Los datos no solo llegan: también salen. Un expediente que se guarda en un archivo o",
    "se manda por la red tiene que convertirse en texto, y al volver hay que rearmarlo.",
    "",
    "El viaje de ida es fácil. El de vuelta tiene una trampa: **una fecha se convierte en",
    "texto sola, pero no vuelve a ser fecha sola.** Nadie apunta por el camino que aquello",
    "era una fecha, así que lo que recuperas es una cadena con pinta de fecha.",
    "",
    "Escribe dos funciones:",
    "",
    "- `guardar(expediente)`, que devuelva el expediente convertido en texto.",
    "- `recuperar(texto)`, que lo devuelva a objeto y que además **convierta en `Date` todo",
    "  valor de texto que tenga forma de fecha ISO completa** —`2015-03-14T09:26:00.000Z`—,",
    "  esté donde esté: dentro de una lista, dentro de otro objeto, da igual.",
    "",
    "Lo que no tenga esa forma se queda tal cual: un texto que dice `mañana por la tarde`",
    "sigue siendo texto.",
  ),
  inicial: codigo(
    "// El segundo argumento de JSON.parse es una función que se llama con cada",
    "// (clave, valor) del árbol, y lo que devuelve es lo que se queda.",
    "",
    "function guardar(expediente) {",
    "  //",
    "}",
    "",
    "function recuperar(texto) {",
    "  //",
    "}",
  ),
  solucion: codigo(
    "const ISO = /^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$/",
    "",
    "function guardar(expediente) {",
    "  return JSON.stringify(expediente)",
    "}",
    "",
    "function recuperar(texto) {",
    "  return JSON.parse(texto, (clave, valor) =>",
    "    typeof valor === 'string' && ISO.test(valor) ? new Date(valor) : valor,",
    "  )",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "guardar" },
    { tipo: "declaraVariable", valor: "recuperar" },
    { tipo: "usaLlamada", valor: "stringify" },
    { tipo: "usaLlamada", valor: "parse" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "la fecha sale como texto ISO y vuelve como Date",
      codigo: codigo(
        "const ida = guardar({ caso: 'Miles', abierto: new Date('2015-03-14T09:26:00Z') })",
        "esperar(ida).contiene('2015-03-14T09:26:00.000Z')",
        "const vuelta = recuperar(ida)",
        "esperar(vuelta.abierto instanceof Date, 'que la fecha vuelva siendo Date').esVerdadero()",
        "esperar(vuelta.abierto.toISOString()).igualA('2015-03-14T09:26:00.000Z')",
      ),
    },
    {
      nombre: "un texto que no es una fecha se queda texto",
      codigo: codigo(
        "const vuelta = recuperar(guardar({ nota: 'mañana por la tarde' }))",
        "esperar(vuelta.nota, 'la nota').esDeTipo('string')",
        "esperar(vuelta.nota).igualA('mañana por la tarde')",
      ),
    },
    {
      nombre: "una fecha metida dentro de una lista también vuelve",
      codigo: codigo(
        "const ida = guardar({ visitas: [{ cuando: new Date('2015-01-01T00:00:00Z') }] })",
        "const dentro = recuperar(ida).visitas[0].cuando",
        "esperar(dentro instanceof Date, 'la fecha de dentro de la lista').esVerdadero()",
        "esperar(dentro.getUTCFullYear()).igualA(2015)",
      ),
    },
    {
      nombre: "el resto del expediente llega intacto",
      codigo: codigo(
        "const vuelta = recuperar(guardar({ caso: 'Miles', abierta: true, agentes: 3 }))",
        "esperar(vuelta).igualA({ caso: 'Miles', abierta: true, agentes: 3 })",
      ),
    },
  ],
  // Practicar esto es practicar el viaje de vuelta: los datos cambian de forma
  // y de profundidad, y lo que no es fecha nunca puede acabar siéndolo.
  variantes: [
    {
      titulo: "Ir y volver · otra tanda",
      tests: [
        {
          nombre: "dos fechas en el mismo expediente vuelven las dos",
          codigo: codigo(
            "const ida = guardar({",
            "  abierto: new Date('2015-03-14T09:26:00Z'),",
            "  cerrado: new Date('2015-04-01T18:00:00Z'),",
            "})",
            "const vuelta = recuperar(ida)",
            "esperar(vuelta.abierto instanceof Date && vuelta.cerrado instanceof Date).esVerdadero()",
            "esperar(vuelta.cerrado.getUTCMonth()).igualA(3)",
          ),
        },
        {
          nombre: "una fecha a medias, sin hora, no se convierte",
          codigo: codigo(
            "const vuelta = recuperar(guardar({ dia: '2015-03-14' }))",
            "esperar(vuelta.dia, 'el día suelto').esDeTipo('string')",
          ),
        },
        {
          nombre: "los números no se tocan aunque parezcan un año",
          codigo: codigo(
            "const vuelta = recuperar(guardar({ anio: 2015 }))",
            "esperar(vuelta.anio, 'el año').esDeTipo('number')",
          ),
        },
        {
          nombre: "una lista de fechas sueltas vuelve entera",
          codigo: codigo(
            "const ida = guardar({ avisos: [new Date('2015-01-01T00:00:00Z'), new Date('2015-06-01T00:00:00Z')] })",
            "const avisos = recuperar(ida).avisos",
            "esperar(avisos).tieneLongitud(2)",
            "esperar(avisos.every((cada) => cada instanceof Date), 'que las dos sean Date').esVerdadero()",
          ),
        },
      ],
    },
    {
      titulo: "Ir y volver · y otra",
      tests: [
        {
          nombre: "tres niveles de profundidad no despistan al de vuelta",
          codigo: codigo(
            "const ida = guardar({ ciudad: { comisaria: { turno: { entra: new Date('2015-03-14T22:00:00Z') } } } })",
            "const entra = recuperar(ida).ciudad.comisaria.turno.entra",
            "esperar(entra instanceof Date, 'la fecha del fondo').esVerdadero()",
            "esperar(entra.getUTCHours()).igualA(22)",
          ),
        },
        {
          nombre: "guardar y recuperar dos veces seguidas da lo mismo",
          codigo: codigo(
            "const original = { caso: 'Suit', abierto: new Date('2015-03-14T09:26:00Z') }",
            "const una = recuperar(guardar(original))",
            "const otra = recuperar(guardar(una))",
            "esperar(otra.abierto.getTime()).igualA(una.abierto.getTime())",
          ),
        },
        {
          nombre: "un texto con la palabra fecha dentro sigue siendo texto",
          codigo: codigo(
            "const vuelta = recuperar(guardar({ nota: 'ver la fecha 2015-03-14T09:26:00.000Z del parte' }))",
            "esperar(vuelta.nota, 'la nota entera').esDeTipo('string')",
          ),
        },
        {
          nombre: "lo que se guarda es texto, no un objeto",
          codigo: codigo(
            "esperar(guardar({ caso: 'Miles' }), 'lo que devuelve guardar').esDeTipo('string')",
          ),
        },
        {
          nombre: "y una fecha inválida no llega nunca a viajar como fecha",
          codigo: codigo(
            "const ida = guardar({ cuando: new Date('catorce de marzo') })",
            "esperar(ida).contiene('null')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("La ida no tiene nada que inventar: hay una función que convierte cualquier dato en texto y ya sabe qué hacer con las fechas ella sola. Míralo imprimiéndolo antes de seguir.", 0),
    pista("La vuelta se resuelve con el **segundo argumento** de la conversión inversa: una función que recibe cada clave y cada valor del árbol, de dentro hacia fuera, y devuelve con qué se sustituye ese valor.", 1),
    pista("Necesitas dos condiciones a la vez: que el valor sea de tipo texto y que ese texto tenga forma de fecha completa. Para lo segundo te sirve un patrón anclado por los dos lados, con la `T` y la `Z` en su sitio y los milisegundos incluidos. Si no cumple las dos, devuelve el valor tal como llegó.", 2),
  ],
  recompensa: { croquetas: 13 },
}
