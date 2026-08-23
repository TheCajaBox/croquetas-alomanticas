import { codigo, pista } from '../comun.js'
import { MERCADO } from '../tablas-de-elantris.js'

export default {
  id: "linea-03-el-sintoma-y-la-causa",
  mundo: "linea",
  entorno: "sql",
  tipo: "emparejar",
  titulo: "El síntoma y la causa",
  enunciado: codigo(
    "Este es el reto más útil del mundo, y no se escribe una línea.",
    "",
    "Una consulta de SQL casi nunca se rompe: devuelve otra cosa. Así que lo que hace falta no",
    "es saber arreglar errores, es **reconocer síntomas**. Empareja cada síntoma con lo que",
    "casi siempre lo causa.",
  ),
  esquema: MERCADO.esquema,
  datos: MERCADO.datos,
  parejas: [
    {
      izquierda: "Falta **una** fila y nadie la echa de menos",
      derecha: "Una comparación sobre una columna con nulos: `<> algo` deja fuera el nulo, y no avisa.",
    },
    {
      izquierda: "No devuelve **ninguna** fila teniendo razón",
      derecha: "Un `NOT IN` cuya subconsulta trae un nulo. La versión afirmativa con `IN` funcionaría.",
    },
    {
      izquierda: "Devuelve **muchísimas más** filas de las que hay",
      derecha: "Una unión sin `ON`: cada fila de una contra cada fila de la otra.",
    },
    {
      izquierda: "Un cero sale como **uno**",
      derecha: "`COUNT(*)` después de un `LEFT JOIN`: cuenta la fila vacía que la unión fabricó.",
    },
    {
      izquierda: "Donde iba un número hay un **hueco**",
      derecha: "`SUM` o `AVG` sobre un montón sin nada: se saltan los nulos, así que no queda nada que sumar.",
    },
    {
      izquierda: "Los totales suman **más** que el total de la tabla",
      derecha: "Una unión que duplica filas: alguna se cuenta dos veces dentro de su montón.",
    },
    {
      izquierda: "El informe sale **del revés**",
      derecha: "Un `DESC` olvidado. La consulta funciona, devuelve las filas que toca, y son las de abajo.",
    },
  ],
  pistas: [
    pista("Empieza por los dos extremos: el que no devuelve nada y el que devuelve muchísimo. Los dos tienen una causa muy concreta y muy famosa.", 0),
    pista("Tres de los síntomas tienen que ver con nulos, y son tres nulos distintos: uno en una comparación, uno en una subconsulta y uno que fabricó una unión.", 1),
    pista("Y dos hablan de números que no cuadran: uno de más y uno donde iba un cero. El primero es de duplicados y el segundo de contar filas en vez de valores.", 2),
  ],
  recompensa: { croquetas: 8 },
}
