import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-02-cuantas-ventas-cada-uno",
  mundo: "mercado",
  entorno: "sql",
  tipo: "codigo",
  titulo: "Cuántas ventas hizo cada uno",
  enunciado: codigo(
    "El agregado más usado de todos: contar.",
    "",
    "Escribe una consulta sobre `ventas` que devuelva, para cada puesto que haya vendido algo,",
    "dos columnas:",
    "",
    "- `puesto_id` — el número del puesto.",
    "- `cuantas` — cuántas ventas hizo.",
    "",
    "Ordenadas de más ventas a menos y, cuando empaten, por el número de puesto de menor a",
    "mayor -que para eso está la segunda columna del `ORDER BY`-.",
    "",
    "Todavía sin unir: el nombre del puesto está en la otra tabla y llega en el reto cinco.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  inicial: codigo(
    "SELECT puesto_id",
    "FROM ventas",
    "-- Cuenta, y di en qué montones.",
  ),
  solucion: codigo(
    "SELECT puesto_id, COUNT(*) AS cuantas",
    "FROM ventas",
    "GROUP BY puesto_id",
    "ORDER BY cuantas DESC, puesto_id ASC;",
  ),
  requisitos: [
    { tipo: "usaPalabra", valor: "GROUP BY", texto: "Agrupa con `GROUP BY`" },
    { tipo: "usaPalabra", valor: "COUNT", texto: "Y cuenta con `COUNT`" },
    { tipo: "prohibeAsterisco", texto: "Nombra las columnas del `SELECT`: el `*` de `COUNT(*)` no cuenta como pedir todo" },
    { tipo: "unaSolaConsulta", texto: "Una sola consulta" },
  ],
  tests: [
    { nombre: "ocho filas: un puesto de los nueve no ha vendido nada", codigo: "esperar(filas, 'las filas').tieneLongitud(8)" },
    { nombre: "las dos columnas", codigo: "esperar(columnas, 'las columnas').igualA(['puesto_id', 'cuantas'])" },
    {
      nombre: "los dos de tres ventas primero, y por número de puesto entre ellos",
      codigo: codigo(
        "esperar(filas[0], 'la primera').igualA({ puesto_id: 1, cuantas: 3 })",
        "esperar(filas[1], 'la segunda').igualA({ puesto_id: 7, cuantas: 3 })",
      ),
    },
    {
      nombre: "y las cuentas suman dieciséis, que son todas las ventas",
      codigo: "esperar(filas.reduce((suma, f) => suma + f.cuantas, 0), 'la suma de las cuentas').igualA(16)",
    },
    {
      nombre: "de más a menos",
      codigo: "esperar(filas.map((f) => f.cuantas), 'las cuentas').igualA([3, 3, 2, 2, 2, 2, 1, 1])",
    },
    {
      nombre: "el puesto ocho no está: no tiene ni una venta",
      codigo: "esperar(filas.map((f) => f.puesto_id), 'los puestos').noContiene(8)",
    },
  ],
  variantes: [
    {
      titulo: "Cuántas ventas hizo cada uno · otra tanda",
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
        "  (1, 3, 'lunes', 50), (2, 3, 'lunes', 50), (3, 3, 'martes', 50), (4, 3, 'martes', 50),",
        "  (5, 6, 'lunes', 90), (6, 6, 'martes', 90),",
        "  (7, 1, 'lunes', 20),",
        "  (8, 9, 'miércoles', 70);",
      ),
      tests: [
        { nombre: "cuatro puestos han vendido", codigo: "esperar(filas).tieneLongitud(4)" },
        { nombre: "las dos columnas", codigo: "esperar(columnas).igualA(['puesto_id', 'cuantas'])" },
        {
          nombre: "el caldero con cuatro va primero",
          codigo: "esperar(filas[0]).igualA({ puesto_id: 3, cuantas: 4 })",
        },
        {
          nombre: "y los dos de una venta, por número de puesto",
          codigo: "esperar(filas.slice(2).map((f) => f.puesto_id)).igualA([1, 9])",
        },
        {
          nombre: "las cuentas suman las ocho ventas",
          codigo: "esperar(filas.reduce((s, f) => s + f.cuantas, 0)).igualA(8)",
        },
      ],
    },
  ],
  pistas: [
    pista("`COUNT(*)` cuenta las filas del montón. Y hay que decirle cuáles son los montones.", 0),
    pista("El `GROUP BY` va detrás del `FROM` y lleva la columna por la que se parte: la misma que estás pidiendo en el `SELECT`.", 1),
    pista("Y para ordenar puedes usar el **alias** de la columna calculada -`ORDER BY cuantas DESC`-, porque el `ORDER BY` trabaja después del `SELECT`. El desempate va detrás, separado por una coma.", 2),
  ],
  recompensa: { croquetas: 6 },
}
