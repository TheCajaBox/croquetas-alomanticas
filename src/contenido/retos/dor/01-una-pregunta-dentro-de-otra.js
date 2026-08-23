import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "dor-01-una-pregunta-dentro-de-otra",
  mundo: "dor",
  entorno: "sql",
  tipo: "eleccion",
  titulo: "Una pregunta dentro de otra",
  enunciado: codigo(
    "«Los puestos que vendieron más que la media» son **dos** preguntas: cuál es la media, y",
    "quién la pasa. Y no se pueden hacer en una consulta plana, porque la media hay que saberla",
    "antes de poder comparar con ella.",
    "",
    "Para eso está la **subconsulta**: una consulta dentro de otra, entre paréntesis.",
    "",
    "Aquí no se escribe: se elige.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  pregunta: codigo(
    "```sql",
    "SELECT nombre",
    "FROM puestos",
    "WHERE id IN (SELECT puesto_id FROM ventas);",
    "```",
    "",
    "Hay nueve puestos y dieciséis ventas de ocho puestos distintos.",
    "",
    "¿Qué devuelve esa consulta, y qué papel hace la subconsulta?",
  ),
  opciones: [
    {
      texto:
        "Ocho filas: los puestos que aparecen en las ventas. La subconsulta devuelve una lista de números y el `IN` comprueba si el `id` está en ella.",
      correcta: true,
      porque:
        "Eso es. La subconsulta se ejecuta y produce una lista -los `puesto_id` de las dieciséis ventas, con repetidos-, y el `IN` de fuera pregunta, para cada puesto, si su `id` está ahí. `La muralla` no está en ninguna venta, así que se queda fuera.",
    },
    {
      texto: "Nueve filas: el `IN` con una subconsulta no filtra, solo comprueba que la subconsulta funcione.",
      porque:
        "El `IN` filtra igual que si le hubieras escrito la lista a mano: `WHERE id IN (1, 2, 3)`. Lo único que cambia es de dónde sale la lista.",
    },
    {
      texto: "Dieciséis filas, una por venta, porque la subconsulta devuelve dieciséis valores.",
      porque:
        "La subconsulta sí devuelve dieciséis valores -con repetidos-, y el número de filas del resultado lo decide la consulta **de fuera**: recorre los nueve puestos y se queda con los que pasen la condición. Una subconsulta en un `WHERE` no multiplica filas: filtra.",
    },
    {
      texto: "Da error: una subconsulta tiene que devolver una sola fila.",
      porque:
        "Depende de dónde esté. Con `IN` puede devolver muchas -es una lista-. Donde tiene que devolver una sola fila y una sola columna es cuando se compara con `=` o con `>`, y ahí sí da error si devuelve más.",
    },
  ],
  pistas: [
    pista("Empieza por dentro. Ejecuta mentalmente solo la subconsulta: `SELECT puesto_id FROM ventas`. ¿Qué devuelve?", 0),
    pista("Con esa lista en la mano, la consulta de fuera es un `WHERE id IN (...)` de los de siempre.", 1),
    pista("Y cuenta cuántos puestos distintos hay en las ventas. Hay nueve puestos en la tabla y uno de ellos no ha vendido nunca.", 2),
  ],
  recompensa: { croquetas: 6 },
}
