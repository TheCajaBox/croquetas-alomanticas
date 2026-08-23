import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-03-la-primera-union",
  mundo: "muros",
  entorno: "sql",
  tipo: "codigo",
  titulo: "La primera unión",
  enunciado: codigo(
    "Escribe una consulta que devuelva, para cada puesto que tenga gremio, dos columnas:",
    "",
    "- `puesto` — el nombre del puesto.",
    "- `gremio` — el nombre de su gremio.",
    "",
    "Ordenadas por el nombre del puesto, de la A a la Z.",
    "",
    "Las dos tablas tienen una columna que se llama `nombre`, así que hace falta decir de cuál",
    "es cada una. Ponles alias a las tablas -`puestos AS p`- y usa el alias delante de la",
    "columna: `p.nombre`.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  inicial: codigo(
    "SELECT",
    "FROM puestos AS p",
    "-- Une con gremios, y di por dónde.",
  ),
  solucion: codigo(
    "SELECT p.nombre AS puesto, g.nombre AS gremio",
    "FROM puestos AS p",
    "JOIN gremios AS g ON p.gremio_id = g.id",
    "ORDER BY p.nombre ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "JOIN", texto: "Une las dos tablas con `JOIN`" },
    { tipo: "usaPalabra", valor: "ON", texto: "Y di por dónde se unen, con `ON`" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta: sacar las dos tablas por separado no es unirlas" },
  ],
  tests: [
    {
      nombre: "las dos columnas, con los nombres pedidos",
      codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'gremio'])",
    },
    {
      nombre: "ocho filas: el tenderete no tiene gremio y se queda fuera",
      codigo: "esperar(filas, 'las filas').tieneLongitud(8)",
    },
    {
      nombre: "y en orden alfabético de puesto",
      codigo: codigo(
        "esperar(filas.map((f) => f.puesto), 'los puestos').igualA([",
        "  'Aon Aon', 'Aon Ashe', 'Aon Ien', 'El caldero', 'El yunque', 'La muralla', 'La piedra', 'Los dos ríos',",
        "])",
      ),
    },
    {
      nombre: "cada puesto con su gremio de verdad",
      codigo: codigo(
        "esperar(filas[0], 'la primera').igualA({ puesto: 'Aon Aon', gremio: 'escribas' })",
        "esperar(filas[3], 'El caldero').igualA({ puesto: 'El caldero', gremio: 'cocineros' })",
      ),
    },
    {
      nombre: "los tres puestos de los escribas están los tres",
      codigo: "esperar(filas.filter((f) => f.gremio === 'escribas'), 'los de escribas').tieneLongitud(3)",
    },
    {
      nombre: "no se ha multiplicado nada",
      codigo: codigo(
        "// Sin el `ON`, la unión da nueve por seis igual a cincuenta y cuatro filas.",
        "// Es el fallo caro de este mundo y no da ningún error, así que se vigila.",
        "esperar(filas.length < 10, 'que no haya salido un producto cartesiano').esVerdadero()",
      ),
    },
  ],
  variantes: [
    {
      titulo: "La primera unión · otra tanda",
      // Otro mercado: otro reparto de puestos entre los gremios, y dos sin
      // gremio en vez de uno. La consulta buena sigue siendo la misma.
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
        "  (6, 'La balanza',   5,    340),",
        "  (7, 'El tenderete', NULL,  30),",
        "  (8, 'La esquina',   NULL,  25);",
      ),
      tests: [
        { nombre: "las dos columnas", codigo: "esperar(columnas).igualA(['puesto', 'gremio'])" },
        {
          nombre: "seis filas: los dos sin gremio se quedan fuera",
          codigo: "esperar(filas).tieneLongitud(6)",
        },
        {
          nombre: "en orden alfabético",
          codigo: codigo(
            "esperar(filas.map((f) => f.puesto)).igualA([",
            "  'Aon Dii', 'Aon Rao', 'El cincel', 'El fuelle', 'La balanza', 'La brasa',",
            "])",
          ),
        },
        {
          nombre: "y aquí los dos aones son del gremio de los aones",
          codigo: "esperar(filas.filter((f) => f.gremio === 'aones')).tieneLongitud(2)",
        },
      ],
    },
  ],
  pistas: [
    pista("La unión es una línea entre el `FROM` y el `ORDER BY`: `JOIN` la otra tabla, y `ON` la condición que las cose.", 0),
    pista("La condición del `ON` compara la clave ajena con la clave primaria: la columna de puestos que guarda el número, contra el `id` de gremios.", 1),
    pista("Y no te olvides de los alias en las **columnas** además de en las tablas: las dos tablas tienen una columna `nombre`, así que las dos salidas se llamarían igual y hay que distinguirlas con `AS`.", 2),
  ],
  recompensa: { croquetas: 8 },
}
