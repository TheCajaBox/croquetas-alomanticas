import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-07-cada-union-lo-suyo",
  mundo: "muros",
  entorno: "sql",
  tipo: "emparejar",
  titulo: "Cada unión trae lo suyo",
  enunciado: codigo(
    "Nueve puestos -uno de ellos sin gremio- y seis gremios -uno de ellos sin ningún puesto,",
    "el de los aones-.",
    "",
    "Empareja cada unión con cuántas filas devuelve y por qué. La condición del `ON` es siempre",
    "la misma: `p.gremio_id = g.id`.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  parejas: [
    {
      izquierda: "FROM puestos p JOIN gremios g ON …",
      derecha: "8 filas. Se pierden el puesto sin gremio y el gremio sin puestos: solo salen las parejas.",
    },
    {
      izquierda: "FROM puestos p LEFT JOIN gremios g ON …",
      derecha: "9 filas. Todos los puestos, y el que no tiene gremio sale con las columnas del gremio a nulo.",
    },
    {
      izquierda: "FROM gremios g LEFT JOIN puestos p ON …",
      derecha: "9 filas también, pero otras: todos los gremios, y el de los aones sale con las columnas del puesto a nulo.",
    },
    {
      izquierda: "FROM puestos p JOIN gremios g   (sin ON)",
      derecha: "54 filas: cada puesto contra cada gremio. Ninguna señal de que algo vaya mal.",
    },
    {
      izquierda: "FROM puestos p LEFT JOIN gremios g ON … WHERE g.nombre IS NOT NULL",
      derecha: "8 filas: el `WHERE` filtra después de unir, así que tira justo la fila que el `LEFT` había salvado.",
    },
  ],
  pistas: [
    pista("Empieza contando lo que hay: nueve a la izquierda, seis a la derecha, ocho parejas de verdad.", 0),
    pista("Los dos `LEFT JOIN` devuelven el mismo número de filas y no son la misma consulta: uno conserva todos los puestos y el otro todos los gremios. Mira qué tabla va delante del `LEFT`.", 1),
    pista("Y la última es la trampa que hay que reconocer de vista: un `LEFT JOIN` con una condición sobre la tabla de la derecha en el `WHERE` es un `JOIN` normal escrito de forma confusa. El `WHERE` trabaja después de unir.", 2),
  ],
  recompensa: { croquetas: 7 },
}
