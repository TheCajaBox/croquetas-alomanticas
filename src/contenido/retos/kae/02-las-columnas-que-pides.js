import { codigo, pista } from '../comun.js'
import { HABITANTES, OTROS_CENSOS } from '../tablas-de-kae.js'

export default {
  id: "kae-02-las-columnas-que-pides",
  mundo: "kae",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Las columnas que pides",
  enunciado: codigo(
    "Ahora escríbela tú. Y con una norma que va a estar puesta casi todo el mundo:",
    "**nada de `SELECT *`**.",
    "",
    "Escribe una consulta que devuelva, de la tabla `habitantes`, dos columnas y en este",
    "orden: `nombre` y `oficio`. Las diez filas.",
    "",
    "El orden en que las pides es el orden en que salen, y eso lo decides tú.",
  ),
  esquema: HABITANTES.esquema,
  datos: HABITANTES.datos,
  inicial: codigo(
    "-- Las columnas separadas por comas, y `FROM` para decir de dónde.",
    "SELECT",
  ),
  solucion: "SELECT nombre, oficio FROM habitantes;",
  requisitos: [
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas: aquí no vale `SELECT *`" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "salen los diez habitantes", codigo: "esperar(filas, 'las filas').tieneLongitud(10)" },
    {
      nombre: "y solo las dos columnas pedidas",
      codigo: "esperar(columnas, 'las columnas').igualA(['nombre', 'oficio'])",
    },
    {
      nombre: "el primero es Raoden, que es el primero de la tabla",
      codigo: "esperar(filas[0], 'la primera fila').igualA({ nombre: 'Raoden', oficio: 'escribiente' })",
    },
    {
      nombre: "y el último es Adien",
      codigo: "esperar(filas[9].nombre, 'el último nombre').igualA('Adien')",
    },
    {
      nombre: "no se ha colado la edad ni el barrio",
      codigo: codigo(
        "esperar(columnas, 'las columnas').noContiene('edad')",
        "esperar(columnas, 'las columnas').noContiene('barrio')",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Las columnas que pides · otra tanda",
      // La consulta no cambia: cambia el censo. Es lo que distingue una tanda de
      // práctica de otro reto, y en SQL es lo único que se puede cambiar sin
      // pedir otra consulta.
      datos: OTROS_CENSOS[0],
      tests: [
        { nombre: "siguen siendo diez filas", codigo: "esperar(filas).tieneLongitud(10)" },
        { nombre: "y las dos columnas de siempre", codigo: "esperar(columnas).igualA(['nombre', 'oficio'])" },
        {
          nombre: "ahora el primero es Ashe, y es escribiente",
          codigo: "esperar(filas[0]).igualA({ nombre: 'Ashe', oficio: 'escribiente' })",
        },
        { nombre: "y el último, Maare", codigo: "esperar(filas[9].nombre).igualA('Maare')" },
        { nombre: "sigue sin colarse la edad", codigo: "esperar(columnas).noContiene('edad')" },
      ],
    },
    {
      titulo: "Las columnas que pides · y otra",
      datos: OTROS_CENSOS[1],
      tests: [
        { nombre: "diez filas", codigo: "esperar(filas).tieneLongitud(10)" },
        { nombre: "las dos columnas", codigo: "esperar(columnas).igualA(['nombre', 'oficio'])" },
        {
          nombre: "empieza por Torena, comerciante",
          codigo: "esperar(filas[0]).igualA({ nombre: 'Torena', oficio: 'comerciante' })",
        },
        {
          nombre: "y en este censo hay dos canteros",
          codigo: "esperar(filas.filter((f) => f.oficio === 'cantero')).tieneLongitud(2)",
        },
      ],
    },
  ],
  pistas: [
    pista("`SELECT` y detrás las columnas separadas por comas. Después `FROM` y el nombre de la tabla.", 0),
    pista("El punto y coma del final es la costumbre de la casa: marca dónde acaba la consulta. Sin él también funciona, con él se lee mejor.", 1),
    pista("Y una cosa que se busca sin querer: aquí **no** hace falta ninguna cláusula más. Sin condición salen las diez filas, que es justo lo que se pedía; añadir un `WHERE` sería resolver otro reto. Dos líneas y ya está.", 2),
  ],
  recompensa: { croquetas: 5 },
}
