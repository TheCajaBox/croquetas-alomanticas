import { codigo, pista } from '../comun.js'
import { HABITANTES } from '../tablas-de-elantris.js'

export default {
  id: "kae-01-lo-que-se-pide",
  mundo: "kae",
  entorno: "sql",
  tipo: "eleccion",
  titulo: "Lo que se pide y lo que sale",
  enunciado: codigo(
    "En Kae hay un censo. Es una **tabla**: una rejilla con nombre, con sus columnas -qué se",
    "guarda de cada persona- y sus filas -las personas-.",
    "",
    "Para sacar algo de ahí se escribe una **consulta**, y una consulta tiene siempre la",
    "misma forma: `SELECT` qué columnas quieres, `FROM` de qué tabla. En ese orden, porque",
    "SQL no admite otro.",
    "",
    "Aquí no se escribe: se elige. Mira el esquema de abajo antes de contestar.",
  ),
  esquema: HABITANTES.esquema,
  datos: HABITANTES.datos,
  pregunta: codigo(
    "Quieres **los nombres de los habitantes, y solo los nombres**.",
    "",
    "¿Cuál de estas cuatro consultas hace exactamente eso?",
  ),
  opciones: [
    {
      texto: "`SELECT nombre FROM habitantes;`",
      correcta: true,
      porque:
        "Eso es. `SELECT nombre` pide una columna y solo una; `FROM habitantes` dice de dónde. Diez filas, una columna. Es la consulta más corta que se puede escribir y ya tiene todas las piezas que va a tener cualquier otra.",
    },
    {
      texto: "`SELECT * FROM habitantes;`",
      porque:
        "Esa devuelve los nombres, sí, y también el id, el barrio, el oficio y la edad. El asterisco significa «todas las columnas», y aquí se pedían los nombres. Además es una costumbre que conviene no coger: pedir «todo» es pedir también lo que la tabla tenga mañana.",
    },
    {
      texto: "`SELECT habitantes FROM nombre;`",
      porque:
        "Está del revés. Detrás de `SELECT` van las **columnas** y detrás de `FROM` la **tabla**, y aquí están cambiadas: no existe ninguna tabla llamada `nombre`. La base contestaría que no la encuentra.",
    },
    {
      texto: "`FROM habitantes SELECT nombre;`",
      porque:
        "Tiene las dos piezas buenas y en el orden equivocado. SQL empieza siempre por `SELECT`, aunque -y esto tiene gracia- por dentro la base lo resuelve al revés: primero busca la tabla y después decide qué columnas saca.",
    },
  ],
  pistas: [
    pista("Dos de las cuatro tienen las palabras en el sitio bueno. De esas dos, una pide más de lo que se pedía.", 0),
    pista("Detrás de `SELECT` van las columnas. Detrás de `FROM`, la tabla. Descarta las que lo tengan al revés.", 1),
    pista("Queda elegir entre pedir una columna y pedir todas. El enunciado dice «y solo los nombres».", 2),
  ],
  recompensa: { croquetas: 4 },
}
