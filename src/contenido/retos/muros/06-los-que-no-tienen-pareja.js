import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-06-los-que-no-tienen-pareja",
  mundo: "muros",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Los que no tienen pareja",
  enunciado: codigo(
    "El `JOIN` de antes perdía el tenderete, porque no tiene gremio. A veces eso es lo que",
    "quieres. Y muchas veces no: «todos los puestos, con su gremio si lo tienen» es una",
    "pregunta distinta de «los puestos que tienen gremio», y las dos se hacen todos los días.",
    "",
    "Para la primera está `LEFT JOIN`: une igual, pero **no pierde ninguna fila de la",
    "izquierda**. Las que no encuentran pareja salen con las columnas de la derecha a nulo.",
    "",
    "Escribe una consulta que devuelva **los nueve puestos** con dos columnas: `puesto` y",
    "`gremio`. Ordenadas por el nombre del puesto.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  inicial: codigo(
    "SELECT p.nombre AS puesto, g.nombre AS gremio",
    "FROM puestos AS p",
    "-- Una unión que no pierda a nadie de la izquierda.",
    "ORDER BY p.nombre ASC;",
  ),
  solucion: codigo(
    "SELECT p.nombre AS puesto, g.nombre AS gremio",
    "FROM puestos AS p",
    "LEFT JOIN gremios AS g ON p.gremio_id = g.id",
    "ORDER BY p.nombre ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "LEFT JOIN", texto: "Aquí hace falta un `LEFT JOIN`: no se puede perder ninguna fila" },
    { tipo: "usaPalabra", valor: "ON", texto: "Y su `ON`, que dice por dónde se unen" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "los nueve puestos, ninguno perdido", codigo: "esperar(filas, 'las filas').tieneLongitud(9)" },
    {
      nombre: "y el tenderete está, con su gremio a nulo",
      codigo: codigo(
        "const tenderete = filas.find((f) => f.puesto === 'El tenderete')",
        "esperar(tenderete, 'la fila del tenderete').existe()",
        "esperar(tenderete.gremio, 'su gremio').igualA(null)",
      ),
    },
    {
      nombre: "los demás siguen teniendo el suyo",
      codigo: codigo(
        "esperar(filas.find((f) => f.puesto === 'El caldero').gremio, 'el gremio de El caldero').igualA('cocineros')",
        "esperar(filas.filter((f) => f.gremio === 'escribas'), 'los de escribas').tieneLongitud(3)",
      ),
    },
    {
      nombre: "en orden alfabético, y el tenderete cae donde le toca",
      codigo: codigo(
        "esperar(filas.map((f) => f.puesto), 'los puestos').igualA([",
        "  'Aon Aon', 'Aon Ashe', 'Aon Ien', 'El caldero', 'El tenderete', 'El yunque',",
        "  'La muralla', 'La piedra', 'Los dos ríos',",
        "])",
      ),
    },
    {
      nombre: "exactamente uno se queda sin gremio",
      codigo: "esperar(filas.filter((f) => f.gremio === null), 'los sin gremio').tieneLongitud(1)",
    },
    {
      nombre: "y no se ha multiplicado nada",
      codigo: "esperar(filas.length < 12, 'que no haya salido un producto cartesiano').esVerdadero()",
    },
  ],
  variantes: [
    {
      titulo: "Los que no tienen pareja · otra tanda",
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
        { nombre: "los ocho puestos", codigo: "esperar(filas).tieneLongitud(8)" },
        {
          nombre: "y los dos sin gremio están los dos",
          codigo: "esperar(filas.filter((f) => f.gremio === null).map((f) => f.puesto)).igualA(['El tenderete', 'La esquina'])",
        },
        {
          nombre: "en orden alfabético",
          codigo: codigo(
            "esperar(filas.map((f) => f.puesto)).igualA([",
            "  'Aon Dii', 'Aon Rao', 'El cincel', 'El fuelle', 'El tenderete', 'La balanza', 'La brasa', 'La esquina',",
            "])",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Es la misma consulta de antes cambiando una palabra por dos. La condición del `ON` no se toca.", 0),
    pista("«No perder las filas de la izquierda» tiene un nombre en SQL, y la palabra que lleva delante dice de qué lado se conserva todo.", 1),
    pista("Y fíjate en lo que sale en la columna del gremio para el tenderete: no es el texto vacío ni un cero. Es un nulo, que es «aquí no hay nada», y con eso hay que tener cuidado en cuanto se compare.", 2),
  ],
  recompensa: { croquetas: 8 },
}
