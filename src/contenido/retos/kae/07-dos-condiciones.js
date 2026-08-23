import { codigo, pista } from '../comun.js'
import { HABITANTES, OTROS_CENSOS } from '../tablas-de-elantris.js'

export default {
  id: "kae-07-dos-condiciones",
  mundo: "kae",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Dos condiciones a la vez",
  enunciado: codigo(
    "Un `WHERE` puede llevar más de una condición, unidas con `AND` -las dos- o con `OR`",
    "-cualquiera de las dos-. Y además de la igualdad hay comparaciones: `<`, `>`, `<=`,",
    "`>=` y `<>`, que es «distinto de».",
    "",
    "Escribe una consulta que devuelva el `nombre`, el `oficio` y la `edad` de los habitantes",
    "que vivan en `Kae` **y** tengan 40 años o más.",
    "",
    "Ojo con una cosa que se paga cara: `AND` y `OR` no se turnan por orden de aparición.",
    "`AND` aprieta más que `OR`, así que en cuanto mezclas los dos, hacen falta paréntesis o",
    "el resultado no es el que crees.",
  ),
  esquema: HABITANTES.esquema,
  datos: HABITANTES.datos,
  inicial: codigo(
    "SELECT nombre, oficio, edad",
    "FROM habitantes",
    "WHERE ",
  ),
  solucion: codigo(
    "SELECT nombre, oficio, edad",
    "FROM habitantes",
    "WHERE barrio = 'Kae' AND edad >= 40;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "AND", texto: "Las dos condiciones a la vez: `AND`" },
    { tipo: "prohibePalabra", valor: "OR", texto: "Aquí no hay ningún `OR`: se piden las dos cosas" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "salen tres", codigo: "esperar(filas, 'las filas').tieneLongitud(3)" },
    {
      nombre: "Kiin, Roial y Daora",
      codigo: "esperar(filas.map((f) => f.nombre), 'los nombres').igualA(['Kiin', 'Roial', 'Daora'])",
    },
    { nombre: "las tres columnas", codigo: "esperar(columnas).igualA(['nombre', 'oficio', 'edad'])" },
    {
      nombre: "ninguno baja de cuarenta",
      codigo: "esperar(filas.every((f) => f.edad >= 40), 'que todos lleguen a cuarenta').esVerdadero()",
    },
    {
      nombre: "Raoden vive en Kae y tiene 26: no sale",
      codigo: "esperar(filas.map((f) => f.nombre)).noContiene('Raoden')",
    },
    {
      nombre: "Eondel tiene 52 pero vive en la Puerta: tampoco",
      codigo: "esperar(filas.map((f) => f.nombre)).noContiene('Eondel')",
    },
    {
      nombre: "y `>=` incluye el número justo, que `>` no",
      codigo: codigo(
        "// En este censo nadie tiene exactamente cuarenta, así que un `>` colado por",
        "// un `>=` no se notaría en el resultado de arriba. Se le pregunta a la base",
        "// por un número que sí está -Galladon tiene 41- y se ve la diferencia.",
        "esperar(consulta('SELECT COUNT(*) AS n FROM habitantes WHERE edad >= 41')[0].n, 'con >= 41').igualA(5)",
        "esperar(consulta('SELECT COUNT(*) AS n FROM habitantes WHERE edad > 41')[0].n, 'con > 41').igualA(4)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Dos condiciones a la vez · otra tanda",
      datos: OTROS_CENSOS[0],
      tests: [
        { nombre: "en este censo son dos", codigo: "esperar(filas).tieneLongitud(2)" },
        { nombre: "Aanden y Saolin", codigo: "esperar(filas.map((f) => f.nombre)).igualA(['Aanden', 'Saolin'])" },
        { nombre: "las tres columnas", codigo: "esperar(columnas).igualA(['nombre', 'oficio', 'edad'])" },
        {
          nombre: "Karata vive en Kae y tiene 38: se queda fuera por dos años",
          codigo: "esperar(filas.map((f) => f.nombre)).noContiene('Karata')",
        },
        {
          nombre: "y Taan pasa de cuarenta pero no es de Kae",
          codigo: "esperar(filas.map((f) => f.nombre)).noContiene('Taan')",
        },
      ],
    },
    {
      titulo: "Dos condiciones a la vez · y otra",
      datos: OTROS_CENSOS[1],
      tests: [
        { nombre: "aquí son dos también", codigo: "esperar(filas).tieneLongitud(2)" },
        { nombre: "Ahan y Kahar", codigo: "esperar(filas.map((f) => f.nombre)).igualA(['Ahan', 'Kahar'])" },
        {
          nombre: "Ahan es comerciante y tiene 55",
          codigo: "esperar(filas[0]).igualA({ nombre: 'Ahan', oficio: 'comerciante', edad: 55 })",
        },
        {
          nombre: "Seinalan tiene 64 y vive en la Puerta: fuera",
          codigo: "esperar(filas.map((f) => f.nombre)).noContiene('Seinalan')",
        },
      ],
    },
  ],
  pistas: [
    pista("Dos condiciones unidas por `AND`: una sobre el barrio y otra sobre la edad.", 0),
    pista("«40 o más» es `>=`, no `>`. Con `>` te dejarías fuera a quien tenga cuarenta justos, y ese es el fallo clásico de este tipo de filtro.", 1),
    pista("`WHERE barrio = 'Kae' AND edad >= 40`. El `AND` va entre las dos condiciones enteras, no entre los valores.", 2),
  ],
  recompensa: { croquetas: 7 },
}
