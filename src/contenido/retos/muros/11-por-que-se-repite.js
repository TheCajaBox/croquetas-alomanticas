import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-11-por-que-se-repite",
  mundo: "muros",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Por qué se repite, y qué hacer",
  enunciado: codigo(
    "Uniendo desde los gremios, el de los escribas salía tres veces: una por cada puesto. Eso",
    "no es un fallo -es lo que significa unir- pero estorba cuando lo que quieres es la lista",
    "de gremios y no la de puestos.",
    "",
    "Para eso está `DISTINCT`: quita las filas repetidas del resultado. Se pone justo detrás",
    "del `SELECT` y afecta a la fila entera, no a una columna.",
    "",
    "Escribe una consulta que devuelva **los nombres de los gremios que tienen al menos un",
    "puesto**, sin repetir ninguno, en una sola columna llamada `gremio` y en orden alfabético.",
    "",
    "Son cinco: el de los aones no tiene ninguno.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  inicial: codigo(
    "SELECT",
    "FROM gremios AS g",
    "JOIN puestos AS p ON p.gremio_id = g.id",
    "ORDER BY g.nombre ASC;",
  ),
  solucion: codigo(
    "SELECT DISTINCT g.nombre AS gremio",
    "FROM gremios AS g",
    "JOIN puestos AS p ON p.gremio_id = g.id",
    "ORDER BY g.nombre ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "DISTINCT", texto: "Quita los repetidos con `DISTINCT`" },
    { tipo: "usaPalabra", valor: "JOIN", texto: "Hace falta unir: la información está en las dos tablas" },
    { tipo: "prohibePalabra", valor: "LEFT", texto: "Aquí no se salva a nadie: el gremio sin puestos no entra" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "una sola columna, llamada gremio", codigo: "esperar(columnas, 'las columnas').igualA(['gremio'])" },
    { nombre: "cinco filas, sin repetir ninguna", codigo: "esperar(filas, 'las filas').tieneLongitud(5)" },
    {
      nombre: "los cinco que tienen puestos, en orden",
      codigo: codigo(
        "esperar(filas.map((f) => f.gremio), 'los gremios')",
        "  .igualA(['canteros', 'cocineros', 'comercio', 'escribas', 'herreros'])",
      ),
    },
    {
      nombre: "el de los aones no está: no tiene ni un puesto",
      codigo: "esperar(filas.map((f) => f.gremio), 'los gremios').noContiene('aones')",
    },
    {
      nombre: "y los escribas salen una vez, no tres",
      codigo: "esperar(filas.filter((f) => f.gremio === 'escribas'), 'las filas de escribas').tieneLongitud(1)",
    },
    {
      nombre: "sin el DISTINCT saldrían ocho, que es de donde viene todo esto",
      codigo: codigo(
        "// Se le pregunta a la base directamente para que se vea la diferencia: la",
        "// unión da ocho filas y los gremios distintos son cinco.",
        "esperar(consulta('SELECT g.nombre FROM gremios g JOIN puestos p ON p.gremio_id = g.id').length, 'la unión sin DISTINCT')",
        "  .igualA(8)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Por qué se repite · otra tanda",
      datos: codigo(
        'INSERT INTO gremios (id, nombre, maestro) VALUES',
        "  (1, 'escribas',  'Adien'),",
        "  (2, 'canteros',  'Karata'),",
        "  (3, 'cocineros', NULL),",
        "  (4, 'herreros',  'Saolin'),",
        "  (5, 'comercio',  'Roial'),",
        "  (6, 'aones',     'Raoden');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id, monedas) VALUES',
        "  (1, 'Aon Rao',      6,    260),",
        "  (2, 'El cincel',    2,    150),",
        "  (3, 'La brasa',     3,     80),",
        "  (4, 'Aon Dii',      6,    115),",
        "  (5, 'El fuelle',    4,    200),",
        "  (6, 'El tenderete', NULL,  30);",
      ),
      tests: [
        { nombre: "una columna", codigo: "esperar(columnas).igualA(['gremio'])" },
        { nombre: "aquí son cuatro", codigo: "esperar(filas).tieneLongitud(4)" },
        {
          nombre: "y el de los aones sí entra, porque ahora tiene dos puestos",
          codigo: "esperar(filas.map((f) => f.gremio)).igualA(['aones', 'canteros', 'cocineros', 'herreros'])",
        },
        {
          nombre: "los aones una vez, no dos",
          codigo: "esperar(filas.filter((f) => f.gremio === 'aones')).tieneLongitud(1)",
        },
      ],
    },
  ],
  pistas: [
    pista("La consulta ya está casi entera en el código de partida. Falta la columna y la palabra que quita repetidos.", 0),
    pista("`DISTINCT` va pegado al `SELECT`, antes de la primera columna, y mira la fila completa: con dos columnas quitaría las filas iguales en las dos.", 1),
    pista("Y una advertencia que vale más que el reto: cuando te salga un `DISTINCT` en una consulta, pregúntate **por qué** se repite antes de escribirlo. Aquí se repite porque un gremio tiene varios puestos, y eso es verdad. Muchas veces se repite porque el `ON` está mal, y entonces el `DISTINCT` está tapando un fallo en vez de arreglarlo.", 2),
  ],
  recompensa: { croquetas: 8 },
}
