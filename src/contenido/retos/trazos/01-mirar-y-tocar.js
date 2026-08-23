import { codigo, pista } from '../comun.js'
import { TRAZOS } from '../tablas-de-elantris.js'

export default {
  id: "trazos-01-mirar-y-tocar",
  mundo: "trazos",
  entorno: "sql",
  tipo: "eleccion",
  titulo: "Mirar y tocar",
  enunciado: codigo(
    "Cuatro mundos leyendo. A partir de aquí se escribe, y hay una diferencia que conviene",
    "sentir antes de empezar: un `SELECT` mal escrito **devuelve** otra cosa, y un `DELETE` mal",
    "escrito **borra** otra cosa.",
    "",
    "Las tres palabras que tocan son `INSERT`, `UPDATE` y `DELETE`. Mira además el esquema de",
    "abajo: ahora las tablas traen reglas -`NOT NULL`, `UNIQUE`, `CHECK`, claves ajenas- y",
    "esas reglas las hace cumplir la base.",
    "",
    "Aquí no se escribe: se elige.",
  ),
  esquema: TRAZOS.esquema,
  datos: TRAZOS.datos,
  pregunta: codigo(
    "```sql",
    "UPDATE puestos SET abierto = 0;",
    "```",
    "",
    "Alguien quería cerrar un puesto y ha escrito eso. ¿Qué pasa?",
  ),
  opciones: [
    {
      texto: "Cierra los seis puestos, y no da ningún error.",
      correcta: true,
      porque:
        "Un `UPDATE` sin `WHERE` cambia **todas** las filas. Es la orden más peligrosa de SQL y la más fácil de escribir por accidente: falta media línea y la base la ejecuta sin pestañear, porque es una orden perfectamente válida. De aquí sale la costumbre del mundo: escribir primero el `SELECT` con ese `WHERE`, mirar las filas, y solo entonces cambiar el verbo.",
    },
    {
      texto: "Da un error, porque falta el `WHERE`.",
      porque:
        "Ojalá. Ninguna base lo exige, porque hay veces en que cambiar toda la tabla es exactamente lo que se quiere. Algunos programas de consola avisan; la base, no.",
    },
    {
      texto: "No hace nada, porque `abierto` ya vale 0 en un puesto.",
      porque:
        "Cambia las cinco que valían 1 y deja la que ya valía 0 como estaba, así que sí hace algo: cinco filas cambiadas. Y aunque no cambiara ninguna, tampoco daría error.",
    },
    {
      texto: "Cierra el primer puesto, porque sin `WHERE` se aplica a la primera fila.",
      porque:
        "No existe esa regla en SQL. Sin condición, la orden se aplica a todas las filas: es lo mismo que un `SELECT` sin `WHERE` devuelva todas, solo que aquí las consecuencias no se deshacen mirando.",
    },
  ],
  pistas: [
    pista("Piensa en qué hace un `SELECT` sin `WHERE`: devuelve todas las filas. Un `UPDATE` sin `WHERE` sigue la misma regla.", 0),
    pista("Y pregúntate si la base tiene alguna manera de saber que te has olvidado media línea. La orden es válida.", 1),
    pista("De las cuatro opciones, dos dicen que pasa algo pequeño y una que da error. La que queda es la incómoda, y es la verdad.", 2),
  ],
  recompensa: { croquetas: 6 },
}
