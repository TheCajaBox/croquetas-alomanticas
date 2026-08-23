import { codigo, pista } from '../comun.js'
import { MUROS } from '../tablas-de-elantris.js'

export default {
  id: "muros-05-seis-frases-sobre-unir",
  mundo: "muros",
  entorno: "sql",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre unir",
  enunciado: codigo(
    "Seis frases sobre uniones. Tres son verdad y tres suenan a verdad, que es peor: unir mal",
    "no da error, da otras filas.",
    "",
    "Se corrigen todas juntas, así que piénsatelas antes de enviar.",
  ),
  esquema: MUROS.esquema,
  afirmaciones: [
    {
      texto: "Un `JOIN` sin `ON` no une: devuelve cada fila de una tabla contra cada fila de la otra.",
      verdadera: true,
      porque:
        "Y es el fallo más caro de este mundo. Nueve puestos y seis gremios dan cincuenta y cuatro filas, todas con aspecto de dato bueno. Tiene nombre -producto cartesiano- y no da ningún error. La comprobación es de dos segundos: contar las filas y ver si son más de las que había en la tabla de la izquierda.",
    },
    {
      texto: "Un `JOIN` normal puede devolver menos filas que la tabla de la izquierda.",
      verdadera: true,
      porque:
        "Exacto, y es lo que se acaba de ver: el tenderete no tiene gremio, así que no encuentra pareja y desaparece. Ahí es donde se pierden filas sin que nadie se entere, porque un informe con ocho filas en vez de nueve no llama la atención.",
    },
    {
      texto: "El `ON` y el `WHERE` hacen lo mismo, solo que uno se escribe antes.",
      porque:
        "En un `JOIN` normal casi da igual dónde pongas la condición, y de ahí sale la confusión. En un `LEFT JOIN` la diferencia es total: el `ON` decide con quién se empareja cada fila -y las que no encuentran pareja se quedan igual-, mientras que el `WHERE` filtra **después de unir** y tira esas filas. Un `LEFT JOIN` con la condición en el `WHERE` es un `JOIN` normal escrito de forma confusa.",
    },
    {
      texto: "Si `gremio_id` está a nulo, la fila se une con el gremio que tenga el `id` nulo.",
      porque:
        "No existe ningún `id` nulo -una clave primaria no puede estar vacía- y, sobre todo, **nulo no es igual a nada, ni siquiera a otro nulo**. Comparar un nulo con cualquier cosa no da verdadero ni falso: da «no se sabe», y el `ON` solo empareja cuando la condición es verdadera.",
    },
    {
      texto: "Después de unir, una fila de la izquierda puede aparecer varias veces.",
      verdadera: true,
      porque:
        "Si tiene varias parejas, sale una vez por pareja. Aquí no pasa -cada puesto tiene un gremio como mucho- pero en cuanto unas por el otro lado sí: el gremio de los escribas tiene tres puestos, así que sale tres veces. De ahí viene la mitad de los `DISTINCT` que se escriben en el mundo, y la otra mitad es gente tapando un `ON` mal puesto.",
    },
    {
      texto: "Con dos tablas unidas, `SELECT nombre` sirve si solo una de las dos tiene esa columna.",
      porque:
        "Suena razonable y es al revés de como conviene escribirlo. Funciona -si solo una la tiene, no hay ambigüedad-, pero es una consulta que se rompe sola el día que alguien añada una columna `nombre` a la otra tabla. Poner la tabla delante cuesta dos caracteres y no se rompe nunca.",
    },
  ],
  pistas: [
    pista("Dos de las falsas hablan de nulos y de dónde va la condición. La tercera es la que parece más inofensiva.", 0),
    pista("Piensa en qué hace el `ON` -empareja- y en qué hace el `WHERE` -filtra lo ya emparejado-. Con un `LEFT JOIN` delante, esa diferencia decide cuántas filas salen.", 1),
    pista("Y sobre el nulo: la regla es que un nulo no es igual a nada. Ni a cero, ni al texto vacío, ni a otro nulo. Comparar con nulo no da falso, da «no se sabe», y eso es distinto.", 2),
  ],
  recompensa: { croquetas: 7 },
}
