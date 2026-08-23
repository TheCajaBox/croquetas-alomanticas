import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-10-monta-el-resumen",
  mundo: "mercado",
  entorno: "sql",
  tipo: "completar",
  titulo: "Monta el resumen",
  enunciado: codigo(
    "La consulta quiere los días de mercado en los que se hicieron **más de cinco ventas**, con",
    "cuántas fueron y lo que se recaudó ese día. Sin contar las ventas de menos de 40 monedas,",
    "que el consejo no las registra.",
    "",
    "Fíjate en que hay dos condiciones y no van en el mismo sitio: una habla de **una venta** y",
    "la otra habla de **un día entero**.",
    "",
    "Faltan cuatro piezas. Elige la ficha y pulsa el hueco donde va.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  plantilla: codigo(
    "SELECT dia, ___ AS cuantas, SUM(monedas) AS total",
    "FROM ventas",
    "___ monedas >= 40",
    "GROUP BY ___",
    "___ COUNT(*) > 5",
    "ORDER BY total DESC;",
  ),
  fichas: ["COUNT(*)", "WHERE", "dia", "HAVING", "SUM(*)", "monedas", "AND", "LIMIT"],
  solucion: codigo(
    "SELECT dia, COUNT(*) AS cuantas, SUM(monedas) AS total",
    "FROM ventas",
    "WHERE monedas >= 40",
    "GROUP BY dia",
    "HAVING COUNT(*) > 5",
    "ORDER BY total DESC;",
  ),
  tests: [
    { nombre: "las tres columnas", codigo: "esperar(columnas, 'las columnas').igualA(['dia', 'cuantas', 'total'])" },
    {
      nombre: "dos días pasan de cinco ventas registradas",
      codigo: "esperar(filas, 'las filas').tieneLongitud(2)",
    },
    {
      nombre: "el lunes y el martes, y el miércoles fuera",
      codigo: codigo(
        "esperar(filas.map((f) => f.dia), 'los días').igualA(['lunes', 'martes'])",
        "esperar(filas.map((f) => f.cuantas), 'las cuentas').igualA([7, 6])",
      ),
    },
    {
      nombre: "y los totales no incluyen las ventas de 35 monedas",
      codigo: codigo(
        "// Las tres ventas de Aon Ashe son de 35 y el `WHERE` las quita antes de",
        "// agrupar. Si estuvieran, el lunes serían ocho ventas y 730 monedas.",
        "esperar(filas.map((f) => f.total), 'los totales').igualA([695, 475])",
      ),
    },
  ],
  pistas: [
    pista("El primer hueco cuenta las filas del montón. El tercero dice en qué montones se parte, y el enunciado habla de días.", 0),
    pista("De las dos condiciones, la de `monedas >= 40` mira **una venta**: eso se puede decidir antes de agrupar. La de `COUNT(*) > 5` mira **un día entero**: eso solo existe después.", 1),
    pista("Así que el segundo hueco es la cláusula que filtra filas y el cuarto la que filtra montones. Y fíjate en el efecto: quitar las ventas pequeñas antes de agrupar cambia también las cuentas, porque esas filas ya no están en ningún montón.", 2),
  ],
  recompensa: { croquetas: 8 },
}
