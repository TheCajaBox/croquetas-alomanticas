import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "linea-05-el-mejor-y-el-acumulado",
  mundo: "linea",
  entorno: "sql",
  tipo: "codigo",
  titulo: "El mejor, y lo que llevaba el mercado",
  enunciado: codigo(
    "Dos ventanas en la misma consulta, sobre un paso con nombre. Es lo más largo que se escribe",
    "en este camino sin ser el jefe.",
    "",
    "Devuelve, para cada puesto que haya vendido algo, cuatro columnas:",
    "",
    "- `puesto` — el nombre.",
    "- `total` — lo que recaudó.",
    "- `sitio` — qué número hace en el mercado, del que más recauda al que menos.",
    "- `acumulado` — cuánto llevaban recaudado entre todos hasta él incluido, siguiendo ese",
    "  mismo orden.",
    "",
    "Ordenado por sitio.",
    "",
    "La última columna es la que hay que pensar: es un acumulado sobre el orden del ranking, no",
    "sobre el orden de la tabla.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  inicial: codigo(
    "WITH totales AS (",
    "  -- Un puesto por fila.",
    ")",
    "SELECT",
    "FROM totales",
  ),
  solucion: codigo(
    "WITH totales AS (",
    "  SELECT p.id, p.nombre, SUM(v.monedas) AS total",
    "  FROM ventas AS v",
    "  JOIN puestos AS p ON v.puesto_id = p.id",
    "  GROUP BY p.id",
    ")",
    "SELECT",
    "  t.nombre AS puesto,",
    "  t.total AS total,",
    "  ROW_NUMBER() OVER (ORDER BY t.total DESC) AS sitio,",
    "  SUM(t.total) OVER (ORDER BY t.total DESC) AS acumulado",
    "FROM totales AS t",
    "ORDER BY sitio ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "WITH", texto: "El paso intermedio, con nombre" },
    { tipo: "usaPalabra", valor: "ROW_NUMBER", texto: "El sitio, con `ROW_NUMBER`" },
    { tipo: "alMenos", valor: "OVER", veces: 2, texto: "Dos ventanas: el sitio y el acumulado" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    {
      nombre: "las cuatro columnas",
      codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'total', 'sitio', 'acumulado'])",
    },
    { nombre: "los ocho puestos que han vendido", codigo: "esperar(filas, 'las filas').tieneLongitud(8)" },
    {
      nombre: "el ranking, del 1 al 8",
      codigo: codigo(
        "esperar(filas.map((f) => f.sitio), 'los sitios').igualA([1, 2, 3, 4, 5, 6, 7, 8])",
        "esperar(filas.map((f) => f.puesto), 'los puestos').igualA([",
        "  'Los dos ríos', 'El caldero', 'El yunque', 'El tenderete', 'Aon Aon', 'Aon Ashe', 'La piedra', 'Aon Ien',",
        "])",
      ),
    },
    {
      nombre: "el acumulado empieza por el primero y acaba en el total del mercado",
      codigo: codigo(
        "esperar(filas[0].acumulado, 'el primero').igualA(320)",
        "esperar(filas.at(-1).acumulado, 'el último').igualA(1275)",
      ),
    },
    {
      nombre: "y va sumando en el orden del ranking",
      codigo: codigo(
        "// Si el acumulado se hiciera sobre el orden de la tabla en vez del ranking, el",
        "// total final sería el mismo y todos los de por medio, distintos. Es el fallo",
        "// que este reto existe para cazar.",
        "esperar(filas.map((f) => f.acumulado), 'los acumulados').igualA([320, 530, 710, 875, 1015, 1120, 1215, 1275])",
      ),
    },
    {
      nombre: "los cuatro primeros ya son más de la mitad del mercado",
      codigo: codigo(
        "esperar(filas[3].acumulado > 1275 / 2, 'que los cuatro primeros pasen de la mitad').esVerdadero()",
      ),
    },
    {
      nombre: "La muralla no está: no ha vendido nada",
      codigo: "esperar(filas.map((f) => f.puesto), 'los puestos').noContiene('La muralla')",
    },
  ],
  variantes: [
    {
      titulo: "El mejor y el acumulado · otra tanda",
      datos: codigo(
        'INSERT INTO gremios (id, nombre, maestro) VALUES',
        "  (1, 'escribas', 'Adien'), (2, 'canteros', 'Karata'), (3, 'cocineros', NULL),",
        "  (4, 'herreros', 'Saolin'), (5, 'comercio', 'Roial'), (6, 'aones', 'Raoden');",
        '',
        'INSERT INTO puestos (id, nombre, gremio_id) VALUES',
        "  (1, 'Aon Aon', 1), (2, 'La piedra', 2), (3, 'El caldero', 3),",
        "  (4, 'Aon Ien', 1), (5, 'El yunque', 4), (6, 'Los dos ríos', 5),",
        "  (7, 'Aon Ashe', 1), (8, 'La muralla', 2), (9, 'El tenderete', NULL);",
        '',
        'INSERT INTO ventas (id, puesto_id, dia, monedas) VALUES',
        "  (1, 1, 'lunes', 100), (2, 2, 'lunes', 300), (3, 3, 'lunes', 50), (4, 6, 'lunes', 50);",
      ),
      tests: [
        {
          nombre: "las cuatro columnas",
          codigo: "esperar(columnas).igualA(['puesto', 'total', 'sitio', 'acumulado'])",
        },
        { nombre: "cuatro puestos han vendido", codigo: "esperar(filas).tieneLongitud(4)" },
        {
          nombre: "La piedra es la primera, con 300",
          codigo: "esperar(filas[0].puesto).igualA('La piedra')",
        },
        {
          nombre: "y el acumulado acaba en 500",
          codigo: codigo(
            "// Los dos empatados a 50 se llevan los sitios 3 y 4 en el orden que la base",
            "// quiera, y el acumulado de los dos últimos es 450 y 500 en cualquier caso.",
            "esperar(filas.at(-1).acumulado).igualA(500)",
            "esperar(filas[0].acumulado).igualA(300)",
            "esperar(filas[1].acumulado).igualA(400)",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("El paso con nombre es el de siempre: una fila por puesto con su total. Las dos columnas nuevas van en la consulta de fuera.", 0),
    pista("Las dos ventanas llevan el **mismo** `ORDER BY` dentro del `OVER`, porque las dos hablan del mismo orden: el del ranking.", 1),
    pista("Y para el acumulado, acuérdate de que un `ORDER BY` dentro del `OVER` hace que la ventana sea «desde el principio hasta esta fila». Sin ese `ORDER BY`, la suma sería el total en todas las filas.", 2),
  ],
  recompensa: { croquetas: 12 },
}
