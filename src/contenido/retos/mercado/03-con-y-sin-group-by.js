import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-03-con-y-sin-group-by",
  mundo: "mercado",
  entorno: "sql",
  tipo: "prediccion",
  titulo: "Con GROUP BY y sin él",
  enunciado: codigo(
    "Un agregado **sin** `GROUP BY` resume la tabla entera en una sola fila. Con `GROUP BY`,",
    "una fila por montón. Esta consulta agrupa por día.",
    "",
    "Escribe abajo, tal cual, lo que va a devolver: primero la línea de las columnas y después",
    "una línea por fila, con los valores separados por ` | `.",
    "",
    "Hay dieciséis ventas repartidas en tres días. Cuéntalas en la tabla de abajo antes de",
    "contestar: son sumas cortas y se hacen a mano.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  codigoMostrado: codigo(
    "SELECT dia, COUNT(*) AS cuantas, SUM(monedas) AS total",
    "FROM ventas",
    "GROUP BY dia",
    "ORDER BY total DESC;",
  ),
  respuestaEsperada: codigo(
    "dia | cuantas | total",
    "lunes | 8 | 730",
    "martes | 7 | 510",
    "miércoles | 1 | 35",
  ),
  tests: [
    {
      nombre: "tres días, y el lunes es el que más se hizo",
      codigo: codigo(
        "esperar(filas, 'las filas').tieneLongitud(3)",
        "esperar(filas.map((f) => f.dia), 'los días').igualA(['lunes', 'martes', 'miércoles'])",
        "esperar(filas.map((f) => f.total), 'los totales').igualA([730, 510, 35])",
        "esperar(filas.reduce((s, f) => s + f.cuantas, 0), 'las ventas contadas').igualA(16)",
      ),
    },
  ],
  pistas: [
    pista("Tres montones, uno por día distinto. Recorre la tabla de ventas apuntando en qué día cae cada una.", 0),
    pista("`COUNT(*)` es cuántas filas hay en el montón y `SUM(monedas)` es la suma de esa columna dentro del montón. Las tres cuentas tienen que sumar dieciséis ventas.", 1),
    pista("El orden es por total de mayor a menor, no por día. El miércoles solo tuvo una venta, así que va último aunque sea el día más tarde.", 2),
  ],
  recompensa: { croquetas: 7 },
}
