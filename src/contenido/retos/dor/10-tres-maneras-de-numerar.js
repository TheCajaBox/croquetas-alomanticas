import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "dor-10-tres-maneras-de-numerar",
  mundo: "dor",
  entorno: "sql",
  tipo: "prediccion",
  titulo: "Tres maneras de numerar",
  enunciado: codigo(
    "Hay tres funciones que numeran y solo se diferencian en los **empates**. Con datos sin",
    "empates dan lo mismo, así que la diferencia solo se ve cuando importa:",
    "",
    "- `ROW_NUMBER` — 1, 2, 3, sin repetir nunca. Entre iguales, el orden lo decide la base.",
    "- `RANK` — repite el número en los empates y luego **salta**.",
    "- `DENSE_RANK` — repite y **no salta**.",
    "",
    "Esta consulta pide las cinco ventas más altas con las tres numeraciones. Hay dos ventas de",
    "120 monedas, y ahí está todo.",
    "",
    "Predice lo que devuelve: la línea de las columnas y una línea por fila, con los valores",
    "separados por ` | `.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  codigoMostrado: codigo(
    "SELECT",
    "  monedas,",
    "  RANK()       OVER (ORDER BY monedas DESC) AS rango,",
    "  DENSE_RANK() OVER (ORDER BY monedas DESC) AS denso,",
    "  ROW_NUMBER() OVER (ORDER BY monedas DESC) AS fila",
    "FROM ventas",
    "ORDER BY monedas DESC",
    "LIMIT 5;",
  ),
  respuestaEsperada: codigo(
    "monedas | rango | denso | fila",
    "200 | 1 | 1 | 1",
    "120 | 2 | 2 | 2",
    "120 | 2 | 2 | 3",
    "100 | 4 | 3 | 4",
    "95 | 5 | 4 | 5",
  ),
  tests: [
    {
      nombre: "el empate de 120 numera igual en rango y denso, y distinto en fila",
      codigo: codigo(
        "esperar(filas, 'las filas').tieneLongitud(5)",
        "esperar(filas.map((f) => f.rango), 'los rangos').igualA([1, 2, 2, 4, 5])",
        "esperar(filas.map((f) => f.denso), 'los densos').igualA([1, 2, 2, 3, 4])",
        "esperar(filas.map((f) => f.fila), 'las filas numeradas').igualA([1, 2, 3, 4, 5])",
      ),
    },
  ],
  pistas: [
    pista("Busca las cinco ventas más altas en la tabla. Dos de ellas valen lo mismo.", 0),
    pista("`ROW_NUMBER` no sabe de empates: numera de uno en uno y ya está. Las otras dos les dan el mismo número a los empatados.", 1),
    pista("La diferencia entre las otras dos está en lo que viene **después** del empate: una se salta el número que se ha gastado dos veces -como en una carrera, no hay segundo si hay dos primeros- y la otra sigue contando sin huecos.", 2),
  ],
  recompensa: { croquetas: 8 },
}
