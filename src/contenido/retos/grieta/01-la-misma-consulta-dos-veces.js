import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-01-la-misma-consulta-dos-veces",
  mundo: "grieta",
  entorno: "sql",
  tipo: "eleccion",
  titulo: "La misma consulta, dos veces",
  enunciado: codigo(
    "Un buscador de arbitradores. El programa recibe un nombre y monta la consulta de una de",
    "estas dos maneras:",
    "",
    "```js",
    "// A: se pega el nombre dentro del texto de la consulta.",
    "const sql = \"SELECT nombre, rango FROM arbitradores WHERE nombre = '\" + buscado + \"'\"",
    "base.exec(sql)",
    "",
    "// B: el nombre va aparte, como parámetro.",
    "base.exec('SELECT nombre, rango FROM arbitradores WHERE nombre = :buscado', { buscado })",
    "```",
    "",
    "Con `buscado = 'Gaotona'` las dos devuelven exactamente lo mismo: una fila.",
    "",
    "Ahora alguien escribe en el buscador `' OR 1=1 --`.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  pregunta: "¿Qué devuelve cada una con `' OR 1=1 --` en el buscador?",
  opciones: [
    {
      texto: "**A** devuelve los cinco arbitradores. **B** devuelve cero filas.",
      correcta: true,
      porque:
        "En A el texto se convierte en parte de la orden: sale `WHERE nombre = '' OR 1=1 --'`, y `OR 1=1` es verdadero para todas las filas —el `--` comenta lo que queda—. En B el valor viaja por su propio canal y llega **como dato**: la base busca a alguien que se llame literalmente `' OR 1=1 --`, y no hay nadie. Cero filas. Esa es toda la diferencia, y es la de este mundo entero.",
    },
    {
      texto: "Las dos devuelven cero filas: no hay nadie con ese nombre.",
      correcta: false,
      porque:
        "Eso es lo que hace B, y es lo correcto. A no llega a buscar ese nombre: el texto ha dejado de ser un nombre y se ha convertido en la condición del `WHERE`.",
    },
    {
      texto: "Las dos dan un error de sintaxis por las comillas descolocadas.",
      correcta: false,
      porque:
        "Sería lo cómodo, y no. El ataque está escrito **para que la consulta siga siendo válida**: la comilla del principio cierra la que abrió el programa y el `--` comenta el resto, incluida la comilla que sobra. Un ataque que da error de sintaxis es un ataque mal escrito, y el atacante tiene todo el tiempo del mundo para arreglarlo.",
    },
    {
      texto: "**A** devuelve cero filas y **B** da error, porque el parámetro no está declarado.",
      correcta: false,
      porque:
        "Al revés en las dos mitades. Y sobre el error: pasarle un parámetro a SQLite no falla; lo que falla es esperar que un texto pegado dentro de la orden se comporte como un dato.",
    },
  ],
  pistas: [
    pista("Escribe a mano la consulta de A sustituyendo `buscado` por el texto. Léela entera.", 0),
    pista(
      "En A, `WHERE nombre = '' OR 1=1 --'`. ¿Para cuántas filas es verdad esa condición? ¿Y qué hace el `--`?",
      1,
    ),
    pista(
      "En B la consulta **no cambia de forma**: sigue siendo `WHERE nombre = :buscado`. Lo único que cambia es qué valor se compara, y ese valor es un texto que no es el nombre de nadie.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
