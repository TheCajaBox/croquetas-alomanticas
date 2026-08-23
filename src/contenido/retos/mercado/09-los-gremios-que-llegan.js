import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-09-los-gremios-que-llegan",
  mundo: "mercado",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Los gremios que llegan al mínimo",
  enunciado: codigo(
    "El consejo cobra una cuota a los gremios que hayan pasado de 150 monedas en el mercado.",
    "Hace falta la lista.",
    "",
    "Escribe una consulta que devuelva, para cada gremio que **haya recaudado más de 150**,",
    "tres columnas:",
    "",
    "- `gremio` — el nombre del gremio.",
    "- `ventas` — cuántas ventas hicieron entre todos sus puestos.",
    "- `total` — lo que recaudaron entre todos.",
    "",
    "De más a menos.",
    "",
    "Empieza por `ventas` y ve subiendo: cada venta es de un puesto, y cada puesto es de un",
    "gremio. Son dos uniones seguidas, y las dos normales: aquí solo interesan los gremios que",
    "han vendido algo.",
    "",
    "Y ojo con dónde va la condición del mínimo: habla de una suma.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  inicial: codigo(
    "SELECT",
    "FROM ventas AS v",
    "JOIN puestos AS p ON v.puesto_id = p.id",
    "-- Y de los puestos a los gremios.",
  ),
  solucion: codigo(
    "SELECT g.nombre AS gremio, COUNT(*) AS ventas, SUM(v.monedas) AS total",
    "FROM ventas AS v",
    "JOIN puestos AS p ON v.puesto_id = p.id",
    "JOIN gremios AS g ON p.gremio_id = g.id",
    "GROUP BY g.id",
    "HAVING SUM(v.monedas) > 150",
    "ORDER BY total DESC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "GROUP BY", texto: "Agrupa con `GROUP BY`" },
    { tipo: "usaPalabra", valor: "HAVING", texto: "La condición habla de una suma, así que va en el `HAVING`" },
    { tipo: "alMenos", valor: "JOIN", veces: 2, texto: "Son dos uniones: de ventas a puestos, y de puestos a gremios" },
    { tipo: "prohibePalabra", valor: "LEFT", texto: "Aquí solo interesan los gremios que han vendido: uniones normales" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas del `SELECT`" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "las tres columnas", codigo: "esperar(columnas, 'las columnas').igualA(['gremio', 'ventas', 'total'])" },
    {
      nombre: "cuatro gremios pasan de 150",
      codigo: "esperar(filas, 'las filas').tieneLongitud(4)",
    },
    {
      nombre: "y son estos, de más a menos",
      codigo: codigo(
        "esperar(filas.map((f) => f.gremio), 'los gremios').igualA(['comercio', 'escribas', 'cocineros', 'herreros'])",
        "esperar(filas.map((f) => f.total), 'los totales').igualA([320, 305, 210, 180])",
      ),
    },
    {
      nombre: "los escribas juntan siete ventas de sus tres puestos",
      codigo: "esperar(filas.find((f) => f.gremio === 'escribas'), 'los escribas').igualA({ gremio: 'escribas', ventas: 7, total: 305 })",
    },
    {
      nombre: "los canteros se quedan en 95 y no entran",
      codigo: "esperar(filas.map((f) => f.gremio), 'los gremios').noContiene('canteros')",
    },
    {
      nombre: "el gremio de los aones tampoco: no tiene puestos",
      codigo: "esperar(filas.map((f) => f.gremio), 'los gremios').noContiene('aones')",
    },
    {
      nombre: "y el tenderete no arrastra a ningún gremio, porque no es de ninguno",
      codigo: codigo(
        "// Sus 165 monedas no están en ninguna de las cuatro filas. Con un `LEFT JOIN`",
        "// a gremios saldría un grupo con el nombre a nulo, y ese no es un gremio.",
        "esperar(filas.every((f) => f.gremio !== null), 'que ningún gremio sea nulo').esVerdadero()",
        "esperar(filas.reduce((s, f) => s + f.total, 0), 'lo que suman los cuatro').igualA(1015)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "Los gremios que llegan · otra tanda",
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
        "  (1, 2, 'lunes', 100), (2, 8, 'lunes', 100), (3, 8, 'martes', 60),",
        "  (4, 1, 'lunes', 150), (5, 4, 'martes', 10),",
        "  (6, 5, 'lunes', 150),",
        "  (7, 3, 'lunes', 40),",
        "  (8, 9, 'lunes', 500);",
      ),
      tests: [
        { nombre: "las tres columnas", codigo: "esperar(columnas).igualA(['gremio', 'ventas', 'total'])" },
        { nombre: "dos gremios pasan de 150", codigo: "esperar(filas).tieneLongitud(2)" },
        {
          nombre: "los canteros, con tres ventas, y los escribas",
          codigo: codigo(
            "esperar(filas.map((f) => f.gremio)).igualA(['canteros', 'escribas'])",
            "esperar(filas.map((f) => f.total)).igualA([260, 160])",
            "esperar(filas[0].ventas, 'las ventas de los canteros').igualA(3)",
          ),
        },
        {
          nombre: "los herreros se quedan en 150 justos, y el mínimo es «más de»",
          codigo: "esperar(filas.map((f) => f.gremio)).noContiene('herreros')",
        },
        {
          nombre: "y las 500 del tenderete no entran en ningún gremio",
          codigo: "esperar(filas.reduce((s, f) => s + f.total, 0)).igualA(420)",
        },
      ],
    },
  ],
  pistas: [
    pista("Dos `JOIN` seguidos: el segundo une la tabla que acabas de traer con la siguiente. `puestos` ya está disponible cuando escribes la segunda unión.", 0),
    pista("Agrupa por `g.id`, que es el gremio, y no por el puesto: lo que se pide es el total **del gremio**, sumando todos sus puestos.", 1),
    pista("La condición «más de 150» habla de `SUM(v.monedas)`, y eso no existe cuando el `WHERE` trabaja. Va en la cláusula que filtra montones, escrita con el agregado entero y no con su alias: así funciona en cualquier base.", 2),
  ],
  recompensa: { croquetas: 10 },
}
