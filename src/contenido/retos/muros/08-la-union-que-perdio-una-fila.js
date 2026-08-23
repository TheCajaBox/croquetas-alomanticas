import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-08-la-union-que-perdio-una-fila",
  mundo: "muros",
  entorno: "sql",
  tipo: "cazar-linea",
  titulo: "La unión que perdió una fila",
  enunciado: codigo(
    "Un informe de los nueve puestos con su gremio, para saber cuáles están sin asignar.",
    "Alguien lo escribió con cuidado, puso el `LEFT JOIN` a propósito, y devuelve ocho filas.",
    "",
    "El puesto sin gremio -que es justo el que se buscaba- no aparece. Pulsa la línea que tiene",
    "la culpa.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  codigoMostrado: codigo(
    "SELECT",
    "  p.nombre AS puesto,",
    "  g.nombre AS gremio",
    "FROM puestos AS p",
    "LEFT JOIN gremios AS g",
    "  ON p.gremio_id = g.id",
    "WHERE g.nombre <> 'aones'",
    "ORDER BY p.nombre ASC;",
  ),
  errorMostrado: codigo(
    "8 filas devueltas.",
    "Se esperaban 9: falta «El tenderete», que es el puesto sin gremio.",
  ),
  lineaCulpable: 7,
  explicaciones: {
    7: codigo(
      "Esta. La condición está en el `WHERE`, y el `WHERE` trabaja **después** de unir: la",
      "fila del tenderete llega ahí con `g.nombre` a nulo, y `NULL <> 'aones'` no vale",
      "verdadero. **Vale «no se sabe»**, y el `WHERE` solo deja pasar lo que es verdadero.",
      "",
      "Así que la fila que el `LEFT JOIN` había salvado la tira el `WHERE` a continuación.",
      "Un `LEFT JOIN` con una condición sobre la tabla de la derecha en el `WHERE` es un",
      "`JOIN` normal escrito de manera confusa: cuesta el mismo trabajo y engaña a quien lo",
      "lea.",
      "",
      "Se arregla de dos maneras, según lo que se quisiera decir. Si la condición es parte",
      "de **con quién se empareja**, se sube al `ON`. Si es un filtro de verdad, hay que",
      "decidir a mano qué pasa con los nulos, y ahí `IS NULL` es la herramienta.",
    ),
    5: codigo(
      "El `LEFT JOIN` está bien puesto y es justo lo que hacía falta: es lo que salva a las",
      "filas de la izquierda que no encuentran pareja. El problema no es que falte; es que",
      "lo que hace se deshace dos líneas más abajo.",
    ),
    6: codigo(
      "La costura es correcta: la clave ajena de puestos contra la clave primaria de",
      "gremios. Con esta condición, el tenderete no encuentra pareja -su `gremio_id` está a",
      "nulo- y eso está bien: es exactamente el caso que el `LEFT JOIN` sabe atender.",
    ),
    2: codigo(
      "Pedir la columna con su tabla delante y ponerle un alias es lo que hay que hacer con",
      "dos tablas unidas: las dos tienen una columna `nombre`. Aquí no hay nada que objetar.",
    ),
    8: codigo(
      "El orden no quita ni pone filas. Un `ORDER BY` puede colocar el resultado de una",
      "manera que despiste -si la fila que buscas cae al final y no te desplazas-, pero no",
      "hace desaparecer nada, y aquí el informe dice ocho filas.",
    ),
  },
  pistas: [
    pista("El `LEFT JOIN` está bien escrito. Así que la fila del tenderete llega a estar en el resultado en algún momento: busca quién se la lleva después.", 0),
    pista("Repasa el orden en que trabajan las cláusulas. ¿Qué pasa después de unir?", 1),
    pista("La clave está en qué vale una comparación cuando uno de los dos lados es nulo. No vale verdadero, y tampoco vale falso.", 2),
  ],
  recompensa: { croquetas: 9 },
}
