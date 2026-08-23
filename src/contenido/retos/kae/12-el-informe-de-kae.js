import { codigo } from '../comun.js'
import { HABITANTES, OTROS_CENSOS } from '../tablas-de-kae.js'

export default {
  id: "kae-12-el-informe-de-kae",
  mundo: "kae",
  entorno: "sql",
  tipo: "codigo",
  jefe: true,
  titulo: "Jefe: el informe de Kae",
  enunciado: codigo(
    "Aquí no hay pistas. Todo lo que hace falta lo has visto en los once retos de antes, y",
    "esta vez va junto.",
    "",
    "Escribe **una** consulta sobre `habitantes` que devuelva tres columnas, con estos nombres",
    "exactos y en este orden:",
    "",
    "- `quien` — el nombre.",
    "- `oficio` — el oficio.",
    "- `anos` — la edad.",
    "",
    "De los habitantes que **no** vivan en el barrio `Puerta` **y** tengan menos de 50 años.",
    "",
    "Ordenados por barrio de la A a la Z y, dentro de cada barrio, por edad de mayor a menor.",
    "Y como mucho cinco filas.",
    "",
    "Sin `SELECT *`. Y ojo al final: el corte se hace **después** de ordenar, así que la",
    "quinta fila no es la que parece si ordenas por otra cosa.",
  ),
  esquema: HABITANTES.esquema,
  datos: HABITANTES.datos,
  inicial: codigo(
    "SELECT",
    "FROM habitantes",
  ),
  solucion: codigo(
    "SELECT nombre AS quien, oficio AS oficio, edad AS anos",
    "FROM habitantes",
    "WHERE barrio <> 'Puerta' AND edad < 50",
    "ORDER BY barrio ASC, edad DESC",
    "LIMIT 5;",
  ),
  requisitos: [
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas: nada de `SELECT *`" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta, no tres seguidas" },
    { tipo: "alMenos", valor: "AS", veces: 3, texto: "Las tres columnas llevan alias: tres `AS`" },
    { tipo: "usaPalabra", valor: "WHERE", texto: "Filtra con `WHERE`" },
    { tipo: "usaPalabra", valor: "ORDER BY", texto: "Ordena con `ORDER BY`" },
    { tipo: "usaPalabra", valor: "LIMIT", texto: "Y corta con `LIMIT`" },
  ],
  tests: [
    {
      nombre: "las tres columnas, con sus nombres y en su orden",
      codigo: "esperar(columnas, 'las columnas').igualA(['quien', 'oficio', 'anos'])",
    },
    { nombre: "cinco filas, ni más ni menos", codigo: "esperar(filas, 'las filas').tieneLongitud(5)" },
    {
      nombre: "los cinco que son, en el orden que se pedía",
      codigo: codigo(
        "esperar(filas.map((f) => f.quien), 'los nombres')",
        "  .igualA(['Kiin', 'Daora', 'Raoden', 'Sarene', 'Galladon'])",
      ),
    },
    {
      nombre: "la primera fila entera",
      codigo: "esperar(filas[0], 'la primera').igualA({ quien: 'Kiin', oficio: 'cocinero', anos: 48 })",
    },
    {
      nombre: "nadie de la Puerta",
      codigo: codigo(
        "esperar(filas.map((f) => f.quien), 'los nombres').noContiene('Lukel')",
        "esperar(filas.map((f) => f.quien), 'los nombres').noContiene('Eondel')",
      ),
    },
    {
      nombre: "nadie de cincuenta o más",
      codigo: codigo(
        "// Roial vive en Kae y tiene 62: cumple el barrio y no la edad. Es la fila que",
        "// se cuela si el `AND` se escribe como un `OR`.",
        "esperar(filas.every((f) => f.anos < 50), 'que ninguno llegue a cincuenta').esVerdadero()",
        "esperar(filas.map((f) => f.quien), 'los nombres').noContiene('Roial')",
      ),
    },
    {
      nombre: "dentro de Kae, de mayor a menor",
      codigo: codigo(
        "const deKae = filas.slice(0, 4).map((f) => f.anos)",
        "esperar(deKae, 'las edades de Kae').igualA([48, 45, 26, 25])",
      ),
    },
    {
      nombre: "y el corte se hace después de ordenar",
      codigo: codigo(
        "// Cumplen las condiciones siete personas y salen cinco. Las dos que se quedan",
        "// fuera tienen que ser las dos últimas del orden pedido -Shuden y Adien-, y no",
        "// dos cualesquiera: si el `LIMIT` actuara antes del `ORDER BY`, saldría otra",
        "// gente y en otro orden.",
        "esperar(consulta(\"SELECT COUNT(*) AS n FROM habitantes WHERE barrio <> 'Puerta' AND edad < 50\")[0].n, 'los que cumplen')",
        "  .igualA(7)",
        "esperar(filas.map((f) => f.quien), 'los nombres').noContiene('Shuden')",
        "esperar(filas.map((f) => f.quien), 'los nombres').noContiene('Adien')",
      ),
    },
    {
      nombre: "y la tabla sigue entera: una consulta pregunta, no cambia",
      codigo: "esperar(cuantas('habitantes'), 'las filas de la tabla').igualA(10)",
    },
  ],
  variantes: [
    {
      titulo: "El informe de Kae · otro censo",
      datos: OTROS_CENSOS[0],
      tests: [
        {
          nombre: "las tres columnas siguen llamándose igual",
          codigo: "esperar(columnas).igualA(['quien', 'oficio', 'anos'])",
        },
        { nombre: "cinco filas", codigo: "esperar(filas).tieneLongitud(5)" },
        {
          nombre: "los cinco de este censo",
          codigo: "esperar(filas.map((f) => f.quien)).igualA(['Saolin', 'Aanden', 'Karata', 'Mareshe', 'Maare'])",
        },
        {
          nombre: "los cinco son de Kae, así que la Muralla se queda fuera del corte",
          codigo: codigo(
            "// En este censo hay seis que cumplen y cinco son de Kae. El `LIMIT 5` corta",
            "// justo en la frontera del barrio, que es lo que hace visible que el orden",
            "// manda sobre el corte.",
            "esperar(filas.map((f) => f.quien)).noContiene('Ashe')",
            "esperar(filas.map((f) => f.quien)).noContiene('Taan')",
          ),
        },
        {
          nombre: "y de mayor a menor dentro de Kae",
          codigo: "esperar(filas.map((f) => f.anos)).igualA([49, 44, 38, 31, 27])",
        },
      ],
    },
    {
      titulo: "El informe de Kae · y otro",
      datos: OTROS_CENSOS[1],
      tests: [
        { nombre: "las tres columnas", codigo: "esperar(columnas).igualA(['quien', 'oficio', 'anos'])" },
        { nombre: "cinco filas", codigo: "esperar(filas).tieneLongitud(5)" },
        {
          nombre: "aquí entran los dos barrios: dos de Kae y tres de la Muralla",
          codigo: "esperar(filas.map((f) => f.quien)).igualA(['Jalla', 'Torena', 'Dilaf', 'Kaloo', 'Matisse'])",
        },
        {
          nombre: "Ahan tiene 55 y Kahar 58: los dos se quedan fuera por la edad",
          codigo: codigo(
            "esperar(filas.map((f) => f.quien)).noContiene('Ahan')",
            "esperar(filas.map((f) => f.quien)).noContiene('Kahar')",
          ),
        },
        {
          nombre: "y Telrii vive en la Puerta",
          codigo: "esperar(filas.map((f) => f.quien)).noContiene('Telrii')",
        },
      ],
    },
  ],
  recompensa: { croquetas: 12 },
}
