import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-01-el-dato-en-dos-sitios",
  mundo: "muros",
  entorno: "sql",
  tipo: "eleccion",
  titulo: "El mismo dato en dos sitios",
  enunciado: codigo(
    "Fuera de la muralla, cada puesto llevaba su gremio escrito en su propia fila: la columna",
    "`gremio` era un texto y decía `'escribas'` tres veces, una por cada puesto de escribas.",
    "",
    "Aquí dentro está de otra manera. Los gremios son **su propia tabla**, con su número, y",
    "cada puesto guarda ese número en `gremio_id`. Mira el esquema de abajo.",
    "",
    "Aquí no se escribe: se elige.",
  ),
  esquema: MUROS.esquema,
  datos: MUROS.datos,
  pregunta: codigo(
    "El gremio de los escribas tiene tres puestos. En Kae, la palabra «escribas» estaba",
    "escrita tres veces; aquí está escrita una.",
    "",
    "¿Cuál es la ventaja **de fondo** de haberlo cambiado?",
  ),
  opciones: [
    {
      texto:
        "Que el gremio pasa a ser una cosa con vida propia: se escribe una vez, no se puede escribir de tres maneras distintas, y se le pueden colgar más datos suyos.",
      correcta: true,
      porque:
        "Eso es. Fíjate en la tabla `gremios`: tiene una columna `maestro`. Con el gremio escrito dentro de cada puesto, ¿dónde metías al maestro? En cada puesto, repetido, y esperando que las tres copias digan lo mismo. El ahorro de letras es lo de menos; lo que se gana es que el gremio existe como cosa, y no como un adjetivo de los puestos.",
    },
    {
      texto: "Que se escriben menos letras y la base ocupa menos.",
      porque:
        "Ocupa algo menos, sí, y es la razón menos importante de todas. Con nueve puestos no ahorras nada apreciable. Lo que se gana es otra cosa, y sigue valiendo la pena con nueve filas igual que con nueve millones.",
    },
    {
      texto: "Que las consultas son más rápidas, porque los números se comparan antes que los textos.",
      porque:
        "Comparar números es algo más rápido que comparar textos, es verdad, y también es un efecto secundario. Además ahora hay que unir dos tablas, así que en velocidad no está claro que se gane. El motivo es de orden, no de velocidad.",
    },
    {
      texto: "Que ya no se pueden meter puestos sin gremio.",
      porque:
        "Justo al contrario, y este mundo entero va de eso: mira la fila del tenderete, con `gremio_id` a nulo. Se puede, y lo que hay que aprender es qué pasa con esa fila cuando unes.",
    },
  ],
  pistas: [
    pista("Fíjate en las columnas de la tabla `gremios`. Hay una que no existía en Kae.", 0),
    pista("Pregúntate dónde habrías guardado el nombre del maestro del gremio con el modelo de antes.", 1),
    pista("Las dos razones técnicas -menos letras, comparar números- son ciertas y pequeñas. La grande es que el gremio pasa a ser una cosa, y las cosas pueden tener datos propios.", 2),
  ],
  recompensa: { croquetas: 5 },
}
