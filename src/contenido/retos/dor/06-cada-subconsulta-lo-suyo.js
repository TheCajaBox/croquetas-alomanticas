import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "dor-06-cada-subconsulta-lo-suyo",
  mundo: "dor",
  entorno: "sql",
  tipo: "emparejar",
  titulo: "Cada subconsulta en su sitio",
  enunciado: codigo(
    "Una subconsulta puede ir en cuatro sitios, y en cada uno hace un papel distinto. Merece la",
    "pena reconocerlos: al leer una consulta ajena, saber qué papel hace la de dentro es la",
    "mitad de entenderla.",
    "",
    "Empareja cada forma con para qué sirve.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  parejas: [
    {
      izquierda: "WHERE monedas > (SELECT AVG(monedas) FROM ventas)",
      derecha: "**Escalar**: devuelve un solo valor y se usa donde iría un número. Si devolviera más de una fila, daría error.",
    },
    {
      izquierda: "WHERE id IN (SELECT puesto_id FROM ventas)",
      derecha: "**Lista**: devuelve una columna con muchos valores y el `IN` comprueba pertenencia. Ojo si algún valor es nulo.",
    },
    {
      izquierda: "WHERE EXISTS (SELECT 1 FROM ventas v WHERE v.puesto_id = p.id)",
      derecha: "**Existencia**: solo pregunta si hay al menos una fila. Se para en la primera, y no se rompe con los nulos.",
    },
    {
      izquierda: "FROM (SELECT puesto_id, SUM(monedas) AS t FROM ventas GROUP BY puesto_id) AS x",
      derecha: "**Tabla derivada**: el resultado de una consulta usado como si fuera una tabla. Es lo mismo que un `WITH`, escrito por dentro y peor de leer.",
    },
    {
      izquierda: "SELECT nombre, (SELECT COUNT(*) FROM ventas v WHERE v.puesto_id = p.id) AS ventas",
      derecha: "**Correlacionada en el SELECT**: se ejecuta una vez por cada fila de fuera. Da lo mismo que una unión con `GROUP BY` y suele costar más.",
    },
  ],
  pistas: [
    pista("Fíjate en **cuántas filas y columnas** devuelve cada subconsulta: una sola cosa, una columna con muchas, o cualquier cosa.", 0),
    pista("Dos de ellas mencionan una columna de la consulta de fuera dentro del paréntesis -`p.id`-. Esas son las que se ejecutan una vez por fila, y se llaman correlacionadas.", 1),
    pista("Y la que va en el `FROM` es la única que aporta filas en vez de filtrar o calcular. Es un `WITH` disfrazado: exactamente lo mismo, escrito de dentro hacia fuera.", 2),
  ],
  recompensa: { croquetas: 8 },
}
