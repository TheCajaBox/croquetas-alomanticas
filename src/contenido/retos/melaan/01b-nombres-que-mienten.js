import { codigo, pista } from '../comun.js'

export default {
  id: "melaan-01b-nombres-que-mienten",
  mundo: "melaan",
  entorno: "worker",
  tipo: "refactor",
  titulo: "Los nombres que mienten",
  enunciado: codigo(
    "Estas cuatro cosas funcionan. Ejecútalo y compruébalo si quieres: hacen exactamente lo",
    "que tienen que hacer.",
    "",
    "El problema es que **ninguna se llama como lo que hace**. `getNombre` no devuelve un",
    "nombre; `comprobar` no comprueba nada, suma; `lista` no es una lista; y `borrar` no borra",
    "nada, devuelve una copia sin uno.",
    "",
    "Cambiar un nombre no cambia el comportamiento. Y es el refactor que más veces se hace en",
    "una vida de trabajo, porque un nombre que miente cuesta más caro que un bucle feo: el",
    "bucle feo se lee y se entiende, y el nombre que miente se cree.",
    "",
    "Reescríbelo con estos cuatro nombres, tal cual:",
    "",
    "- `etiquetaDeGato(gato)` — el texto con el nombre y la edad",
    "- `sumarRaciones(gatos)` — el total de raciones",
    "- `racionesPorNombre` — el diccionario de cuántas raciones lleva cada uno",
    "- `sinElGato(gatos, nombre)` — la misma colonia sin ese gato",
    "",
    "El cuerpo de cada una se queda como está. Solo cambian los nombres.",
  ),
  inicial: codigo(
    "function getNombre(gato) {",
    "  return `${gato.nombre} (${gato.edad} años)`",
    "}",
    "",
    "function comprobar(gatos) {",
    "  return gatos.reduce((total, gato) => total + gato.raciones, 0)",
    "}",
    "",
    "const lista = { acero: 3, bronce: 1 }",
    "",
    "function borrar(gatos, nombre) {",
    "  return gatos.filter((gato) => gato.nombre !== nombre)",
    "}",
  ),
  solucion: codigo(
    "function etiquetaDeGato(gato) {",
    "  return `${gato.nombre} (${gato.edad} años)`",
    "}",
    "",
    "function sumarRaciones(gatos) {",
    "  return gatos.reduce((total, gato) => total + gato.raciones, 0)",
    "}",
    "",
    "const racionesPorNombre = { acero: 3, bronce: 1 }",
    "",
    "function sinElGato(gatos, nombre) {",
    "  return gatos.filter((gato) => gato.nombre !== nombre)",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "etiquetaDeGato" },
    { tipo: "declaraVariable", valor: "sumarRaciones" },
    { tipo: "declaraVariable", valor: "racionesPorNombre" },
    { tipo: "declaraVariable", valor: "sinElGato" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "la etiqueta sigue diciendo lo mismo que decía",
      codigo: "esperar(etiquetaDeGato({ nombre: 'Acero', edad: 4 })).igualA('Acero (4 años)')",
    },
    {
      nombre: "las raciones se siguen sumando igual",
      codigo: codigo(
        "const colonia = [{ nombre: 'Acero', raciones: 3 }, { nombre: 'Bronce', raciones: 1 }]",
        "esperar(sumarRaciones(colonia)).igualA(4)",
        "esperar(sumarRaciones([])).igualA(0)",
      ),
    },
    {
      nombre: "el diccionario es el mismo diccionario",
      codigo: codigo(
        "esperar(racionesPorNombre).igualA({ acero: 3, bronce: 1 })",
        "esperar(racionesPorNombre, 'las raciones por nombre').esDeTipo('object')",
      ),
    },
    {
      nombre: "y quitar un gato devuelve una colonia nueva sin tocar la de antes",
      codigo: codigo(
        "const colonia = [{ nombre: 'Acero' }, { nombre: 'Bronce' }]",
        "esperar(sinElGato(colonia, 'Acero')).igualA([{ nombre: 'Bronce' }])",
        "esperar(colonia, 'la colonia original').tieneLongitud(2)",
      ),
    },
  ],
  // Un nombre bien puesto se nota cuando llega un caso que el nombre viejo no
  // sabía contar: la colonia vacía, el gato que no está, el diccionario que no
  // tiene esa clave. Las tandas van por ahí.
  variantes: [
    {
      titulo: "Los nombres que mienten · otra tanda",
      tests: [
        {
          nombre: "un gato de cero años se etiqueta igual, con su cero",
          codigo: "esperar(etiquetaDeGato({ nombre: 'Peltre', edad: 0 })).igualA('Peltre (0 años)')",
        },
        {
          nombre: "sumar las raciones de un solo gato da las de ese gato",
          codigo: "esperar(sumarRaciones([{ nombre: 'Estaño', raciones: 7 }])).igualA(7)",
        },
        {
          nombre: "quitar un gato que no está deja la colonia entera",
          codigo: codigo(
            "const colonia = [{ nombre: 'Acero' }, { nombre: 'Bronce' }]",
            "esperar(sinElGato(colonia, 'Zinc')).tieneLongitud(2)",
          ),
        },
        {
          nombre: "quitar al único gato deja una colonia vacía, no un nulo",
          codigo: codigo(
            "esperar(sinElGato([{ nombre: 'Acero' }], 'Acero')).igualA([])",
            "esperar(sinElGato([{ nombre: 'Acero' }], 'Acero'), 'lo que devuelve').esDeTipo('array')",
          ),
        },
      ],
    },
    {
      titulo: "Los nombres que mienten · y otra",
      tests: [
        {
          nombre: "el diccionario se pregunta por nombre, que es lo que ahora dice su nombre",
          codigo: codigo(
            "esperar(racionesPorNombre.acero).igualA(3)",
            "esperar(racionesPorNombre.bronce).igualA(1)",
            "esperar(racionesPorNombre.zinc, 'un gato que no está').igualA(undefined)",
          ),
        },
        {
          nombre: "las raciones en números rojos también entran, restando",
          codigo: "esperar(sumarRaciones([{ raciones: 9 }, { raciones: -4 }])).igualA(5)",
        },
        {
          nombre: "un nombre con tilde se etiqueta entero",
          codigo: "esperar(etiquetaDeGato({ nombre: 'Estaño', edad: 12 })).igualA('Estaño (12 años)')",
        },
        {
          nombre: "quitar de una colonia vacía sigue dando una colonia vacía",
          codigo: "esperar(sinElGato([], 'Acero')).igualA([])",
        },
        {
          nombre: "y las cuatro cosas existen con su nombre nuevo y del tipo que toca",
          codigo: codigo(
            "esperar(typeof etiquetaDeGato).igualA('function')",
            "esperar(typeof sumarRaciones).igualA('function')",
            "esperar(typeof sinElGato).igualA('function')",
            "esperar(racionesPorNombre, 'las raciones por nombre').esDeTipo('object')",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("No hay que pensar en el código: hay que leer cada cuerpo y preguntarse qué devuelve de verdad. El nombre bueno es la respuesta a esa pregunta.", 0),
    pista("Los dos que más engañan son el que empieza por `get` y el que empieza por `comprobar`. Un `get` promete devolver la cosa y devuelve una frase sobre la cosa; un `comprobar` promete un sí o un no y devuelve un número.", 1),
    pista("Cambia los cuatro nombres del enunciado y no toques nada más: el `return` de cada función se queda tal cual, con su plantilla de texto, su `reduce` y su `filter`. Y ojo con el tercero, que no es una función sino una constante.", 2),
  ],
  recompensa: { croquetas: 13 },
}
