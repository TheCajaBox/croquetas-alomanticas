import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "linea-08-monta-el-informe",
  mundo: "linea",
  entorno: "sql",
  tipo: "completar",
  titulo: "Monta el informe",
  enunciado: codigo(
    "Un informe de **todos los puestos** con cuántas ventas hizo cada uno y en qué estado está:",
    "`sin ventas`, `fuerte` si pasa de 200 monedas, y `flojo` si no.",
    "",
    "Faltan cinco piezas, y cada una es de un mundo distinto del camino. Elige la ficha y pulsa",
    "el hueco donde va.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  plantilla: codigo(
    "SELECT",
    "  p.nombre AS puesto,",
    "  ___ AS ventas,",
    "  CASE",
    "    ___ COUNT(v.id) = 0 THEN 'sin ventas'",
    "    WHEN SUM(v.monedas) > 200 THEN 'fuerte'",
    "    ___ 'flojo'",
    "  END AS estado",
    "FROM puestos AS p",
    "___ ventas AS v ON v.puesto_id = p.id",
    "___ p.id",
    "ORDER BY p.nombre ASC;",
  ),
  fichas: ["COUNT(v.id)", "COUNT(*)", "WHEN", "ELSE", "LEFT JOIN", "JOIN", "GROUP BY", "HAVING"],
  solucion: codigo(
    "SELECT",
    "  p.nombre AS puesto,",
    "  COUNT(v.id) AS ventas,",
    "  CASE",
    "    WHEN COUNT(v.id) = 0 THEN 'sin ventas'",
    "    WHEN SUM(v.monedas) > 200 THEN 'fuerte'",
    "    ELSE 'flojo'",
    "  END AS estado",
    "FROM puestos AS p",
    "LEFT JOIN ventas AS v ON v.puesto_id = p.id",
    "GROUP BY p.id",
    "ORDER BY p.nombre ASC;",
  ),
  tests: [
    { nombre: "las tres columnas", codigo: "esperar(columnas, 'las columnas').igualA(['puesto', 'ventas', 'estado'])" },
    { nombre: "los nueve puestos, ninguno perdido", codigo: "esperar(filas, 'las filas').tieneLongitud(9)" },
    {
      nombre: "La muralla sale con cero ventas y «sin ventas»",
      codigo: codigo(
        "const muralla = filas.find((f) => f.puesto === 'La muralla')",
        "esperar(muralla, 'la fila de La muralla').igualA({ puesto: 'La muralla', ventas: 0, estado: 'sin ventas' })",
      ),
    },
    {
      nombre: "los dos que pasan de 200 son fuertes",
      codigo: codigo(
        "esperar(filas.filter((f) => f.estado === 'fuerte').map((f) => f.puesto), 'los fuertes')",
        "  .igualA(['El caldero', 'Los dos ríos'])",
      ),
    },
    {
      nombre: "y los otros seis, flojos",
      codigo: "esperar(filas.filter((f) => f.estado === 'flojo'), 'los flojos').tieneLongitud(6)",
    },
    {
      nombre: "las ventas suman dieciséis",
      codigo: "esperar(filas.reduce((s, f) => s + f.ventas, 0), 'las ventas contadas').igualA(16)",
    },
  ],
  pistas: [
    pista("Cinco huecos y cinco mundos. El de la unión no puede perder ningún puesto; el del `GROUP BY` es el de siempre.", 0),
    pista("Ojo al primer hueco: hay dos fichas que cuentan y una miente después de esa unión. Es el fallo de El mercado.", 1),
    pista("Y en el `CASE`, la primera rama tiene que comprobar el caso vacío **antes** que el de las monedas: si no, el puesto sin ventas caería en el `ELSE` y saldría como flojo. Las ramas se prueban en orden.", 2),
  ],
  recompensa: { croquetas: 9 },
}
