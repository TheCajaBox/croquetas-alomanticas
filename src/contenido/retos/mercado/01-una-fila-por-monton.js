import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-01-una-fila-por-monton",
  mundo: "mercado",
  entorno: "sql",
  tipo: "eleccion",
  titulo: "Una fila por montón",
  enunciado: codigo(
    "Fíjate en el esquema: los `puestos` ya no tienen columna `monedas`. Lo que hay es una",
    "tabla `ventas` con **una fila por venta**, y el total de un puesto es la suma de las suyas.",
    "",
    "Se gana que el total siempre cuadre -entra una venta y el total cambia solo- y que se",
    "pueda desglosar: ¿cuánto se hizo el lunes? Se paga que haya que calcularlo.",
    "",
    "Calcular sobre muchas filas para sacar una se llama **agrupar**, y cambia lo que es una",
    "fila del resultado. Aquí no se escribe: se elige.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  pregunta: codigo(
    "```sql",
    "SELECT puesto_id, SUM(monedas) AS total",
    "FROM ventas",
    "GROUP BY puesto_id;",
    "```",
    "",
    "Hay dieciséis ventas de ocho puestos distintos. ¿Qué devuelve esa consulta?",
  ),
  opciones: [
    {
      texto: "Ocho filas: una por puesto que tenga ventas, con la suma de las suyas.",
      correcta: true,
      porque:
        "Eso es. `GROUP BY puesto_id` parte las dieciséis filas en montones -uno por valor distinto de `puesto_id`- y `SUM` se aplica **a cada montón**. Una fila del resultado ya no es una venta: es un montón de ventas resumido. Ese cambio es lo más importante del mundo entero.",
    },
    {
      texto: "Dieciséis filas, una por venta, y en cada una el total de su puesto repetido.",
      porque:
        "Eso es lo que devolvería una unión, y es una manera razonable de esperarlo cuando vienes del mundo anterior. Agrupar hace lo contrario: en vez de repetir el resumen en cada fila, **quita filas** hasta que quede una por grupo.",
    },
    {
      texto: "Una sola fila con la suma de todo, porque `SUM` suma la tabla entera.",
      porque:
        "Eso es lo que pasaría **sin** el `GROUP BY`: un agregado sin agrupar resume la tabla entera en una fila. El `GROUP BY` es lo que lo parte en montones.",
    },
    {
      texto: "Nueve filas, una por puesto de la tabla `puestos`.",
      porque:
        "Son ocho, no nueve, y ahí hay una lección que llega en el reto once: `La muralla` no tiene ni una venta, así que **no aparece en ningún montón**. Agrupar solo puede hacer montones con las filas que hay, y de esa tabla no hay ninguna suya. Para que salga con un cero hace falta unir desde `puestos`.",
    },
  ],
  pistas: [
    pista("Cuenta cuántos valores distintos de `puesto_id` hay en las dieciséis ventas. Ese es el número de montones.", 0),
    pista("`GROUP BY` no añade información a cada fila: quita filas. De cada montón sale una.", 1),
    pista("Y ojo a la diferencia entre «puestos que hay» y «puestos que aparecen en las ventas». Hay nueve puestos y solo ocho han vendido algo.", 2),
  ],
  recompensa: { croquetas: 5 },
}
