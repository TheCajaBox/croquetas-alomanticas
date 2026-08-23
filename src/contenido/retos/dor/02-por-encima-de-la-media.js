import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "dor-02-por-encima-de-la-media",
  mundo: "dor",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Por encima de la media",
  enunciado: codigo(
    "Una subconsulta que devuelve **un solo valor** se puede usar donde iría un número. Se",
    "llama subconsulta escalar y es la más común de todas:",
    "",
    "```sql",
    "WHERE monedas > (SELECT AVG(monedas) FROM ventas)",
    "```",
    "",
    "Escribe una consulta que devuelva los puestos cuyo **total** pase de la media de todas las",
    "ventas, con dos columnas:",
    "",
    "- `puesto` — el nombre.",
    "- `total` — lo que recaudó.",
    "",
    "De más a menos. La media de las dieciséis ventas es 79,6875, así que la condición mira",
    "totales de puesto contra esa cifra: no es una comparación entre cosas parecidas, y es a",
    "propósito -el consejo quiere saber quién factura más que una venta media-.",
    "",
    "La condición habla de una suma, así que ya sabes en qué cláusula va.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  inicial: codigo(
    "SELECT p.nombre AS puesto, SUM(v.monedas) AS total",
    "FROM ventas AS v",
    "JOIN puestos AS p ON v.puesto_id = p.id",
    "GROUP BY p.id",
    "-- Y aquí la condición, con la media dentro.",
  ),
  solucion: codigo(
    "SELECT p.nombre AS puesto, SUM(v.monedas) AS total",
    "FROM ventas AS v",
    "JOIN puestos AS p ON v.puesto_id = p.id",
    "GROUP BY p.id",
    "HAVING SUM(v.monedas) > (SELECT AVG(monedas) FROM ventas)",
    "ORDER BY total DESC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "HAVING", texto: "La condición habla de una suma: va en el `HAVING`" },
    { tipo: "usaPalabra", valor: "AVG", texto: "La media, con `AVG`, dentro de la subconsulta" },
    { tipo: "alMenos", valor: "SELECT", veces: 2, texto: "Dos `SELECT`: el de fuera y el de la subconsulta" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta: la subconsulta va dentro, no al lado" },
  ],
  tests: [
    { nombre: "las dos columnas", codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'total'])" },
    { nombre: "siete puestos pasan la media", codigo: "esperar(filas, 'las filas').tieneLongitud(7)" },
    {
      nombre: "y son estos, de más a menos",
      codigo: codigo(
        "esperar(filas.map((f) => f.puesto), 'los puestos').igualA([",
        "  'Los dos ríos', 'El caldero', 'El yunque', 'El tenderete', 'Aon Aon', 'Aon Ashe', 'La piedra',",
        "])",
      ),
    },
    {
      nombre: "Aon Ien se queda fuera con sus 60 monedas",
      codigo: "esperar(filas.map((f) => f.puesto), 'los puestos').noContiene('Aon Ien')",
    },
    {
      nombre: "y La muralla tampoco está: no ha vendido nada",
      codigo: "esperar(filas.map((f) => f.puesto), 'los puestos').noContiene('La muralla')",
    },
    {
      nombre: "la media que se usa es la de las ventas, no la de los totales",
      codigo: codigo(
        "// Son dos cifras distintas y las dos son creíbles: la media por venta es",
        "// 79,69 y la media por puesto es 159,375. Con la segunda saldrían tres filas",
        "// en vez de siete, así que el test distingue de verdad.",
        "esperar(consulta('SELECT AVG(monedas) AS m FROM ventas')[0].m, 'la media por venta').igualA(79.6875)",
        "esperar(filas.length, 'las filas con la media por venta').igualA(7)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Por encima de la media · otra tanda",
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
        "  (1, 1, 'lunes', 10), (2, 1, 'martes', 10),",
        "  (3, 2, 'lunes', 500),",
        "  (4, 3, 'lunes', 20), (5, 3, 'martes', 20),",
        "  (6, 6, 'lunes', 300);",
      ),
      tests: [
        { nombre: "las dos columnas", codigo: "esperar(columnas).igualA(['puesto', 'total'])" },
        {
          nombre: "solo dos puestos pasan una media que dos ventas gordas han disparado",
          codigo: codigo(
            "esperar(filas).tieneLongitud(2)",
            "esperar(filas.map((f) => f.puesto)).igualA(['La piedra', 'Los dos ríos'])",
          ),
        },
        {
          nombre: "la media por venta es 143,33 y arrastra a casi todos por debajo",
          codigo: "esperar(Math.round(consulta('SELECT AVG(monedas) AS m FROM ventas')[0].m * 100) / 100).igualA(143.33)",
        },
        {
          nombre: "El caldero suma 40 y se queda fuera",
          codigo: "esperar(filas.map((f) => f.puesto)).noContiene('El caldero')",
        },
      ],
    },
  ],
  pistas: [
    pista("La consulta de fuera ya está escrita. Falta una línea con la condición y otra con el orden.", 0),
    pista("La subconsulta va entre paréntesis y devuelve un solo número, así que se puede poner justo donde iría ese número.", 1),
    pista("Y fíjate en un detalle que ahorra sustos: la subconsulta no se entera de lo que pasa fuera. `SELECT AVG(monedas) FROM ventas` promedia **las dieciséis ventas**, no las del puesto que se esté mirando en ese momento.", 2),
  ],
  recompensa: { croquetas: 9 },
}
