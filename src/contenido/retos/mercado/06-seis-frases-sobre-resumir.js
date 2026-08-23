import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "mercado-06-seis-frases-sobre-resumir",
  mundo: "mercado",
  entorno: "sql",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre resumir",
  enunciado: codigo(
    "Seis frases sobre agrupar y contar. Aquí las falsas duelen más que en otros mundos: un",
    "informe con las cuentas mal no parece roto, parece un informe.",
    "",
    "Se corrigen todas juntas, así que piénsatelas antes de enviar.",
  ),
  esquema: MERCADO.esquema,
  afirmaciones: [
    {
      texto: "Un `WHERE` no puede filtrar por una suma, y un `HAVING` sí.",
      verdadera: true,
      porque:
        "Porque el `WHERE` trabaja **antes** de agrupar: cuando él mira, las sumas no existen todavía. El `HAVING` trabaja después, sobre los montones ya hechos, y ahí sí. Es la diferencia entre «no cuentes las ventas del miércoles» -eso es `WHERE`- y «no me enseñes los puestos que no lleguen a 150» -eso es `HAVING`-.",
    },
    {
      texto: "`COUNT(*)` y `COUNT(columna)` devuelven siempre lo mismo.",
      porque:
        "`COUNT(*)` cuenta **filas**; `COUNT(columna)` cuenta **valores no nulos** de esa columna. Coinciden mientras no haya nulos, y dejan de coincidir justo donde importa: en un `LEFT JOIN`, un puesto sin ventas forma un montón de una fila con todo a nulo, así que `COUNT(*)` dice 1 y `COUNT(v.id)` dice 0. Uno de los dos números es mentira, y no es el segundo.",
    },
    {
      texto: "Los agregados se saltan los nulos, menos `COUNT(*)`.",
      verdadera: true,
      porque:
        "`SUM`, `AVG`, `MIN` y `MAX` ignoran los nulos por completo: no los cuentan como cero, los tratan como si la fila no estuviera. Eso es lo que quieres casi siempre, y tiene una consecuencia que sorprende: `SUM` de un montón donde todo es nulo devuelve **nulo**, no cero.",
    },
    {
      texto: "Sin `GROUP BY`, un agregado devuelve una fila por cada fila de la tabla.",
      porque:
        "Devuelve **una sola fila** con el resumen de la tabla entera. `SELECT SUM(monedas) FROM ventas` da una fila con 1.275. El `GROUP BY` es lo que lo parte en montones; sin él, el montón es todo.",
    },
    {
      texto: "En un `SELECT` con `GROUP BY`, solo pueden ir columnas por las que agrupas y agregados.",
      verdadera: true,
      porque:
        "Cualquier otra columna no tiene una respuesta única dentro del montón: si agrupas por puesto y pides el día, ¿qué día? Hay tres. Casi todas las bases dan error; SQLite es más permisivo y te devuelve un valor cualquiera del montón, que es peor, porque no avisa. Escríbelo bien y no depende de la base.",
    },
    {
      texto: "Un puesto que no ha vendido nada sale con un cero si agrupas la tabla de ventas por puesto.",
      porque:
        "No sale de ninguna manera. Agrupar solo puede hacer montones con las filas que hay, y de ese puesto no hay ninguna en `ventas`. Para que aparezca con su cero hay que empezar por `puestos` y unir con un `LEFT JOIN`: entonces el puesto está y su montón no tiene ventas dentro.",
    },
  ],
  pistas: [
    pista("Dos de las falsas hablan de contar y de qué sale cuando no hay nada. La tercera confunde una fila por montón con una fila por fila.", 0),
    pista("Piensa en el orden: `WHERE`, `GROUP BY`, `HAVING`. Lo que existe en cada momento decide lo que se puede escribir.", 1),
    pista("Y hay una idea que aparece dos veces desde lados distintos: agrupar **no inventa filas**. Solo reparte las que hay. Si un puesto no tiene ni una venta, no hay nada de él que repartir.", 2),
  ],
  recompensa: { croquetas: 7 },
}
