import { codigo, pista } from '../comun.js'
import { HABITANTES } from '../tablas-de-kae.js'

export default {
  id: "kae-06-seis-frases-sobre-preguntar",
  mundo: "kae",
  entorno: "sql",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre preguntar",
  enunciado: codigo(
    "Seis frases sobre lo que llevas visto. Todas suenan razonables y tres no lo son, que es",
    "justo el problema: en SQL las cosas que suenan razonables y no lo son no dan error,",
    "dan otro resultado.",
    "",
    "Se corrigen todas juntas, así que piénsatelas antes de enviar.",
  ),
  esquema: HABITANTES.esquema,
  afirmaciones: [
    {
      texto: "`SELECT` elige columnas y `WHERE` elige filas.",
      verdadera: true,
      porque:
        "Eso es, y tenerlo claro ahorra media docena de líos más adelante. `SELECT` recorta cada fila a lo lado; `WHERE` tira filas enteras. Se pueden usar los dos, uno solo o ninguno.",
    },
    {
      texto: "Sin `ORDER BY`, las filas salen en el orden en que se metieron en la tabla.",
      porque:
        "Aquí salen así, y por eso es una trampa tan buena. Pero la base **no lo promete**: sin `ORDER BY` puede devolverlas en el orden que le convenga, y ese orden cambia cuando la tabla crece, cuando aparece un índice o cuando la versión de al lado hace otra cosa. Si el orden importa, se pide.",
    },
    {
      texto: "`WHERE barrio = \"Kae\"` y `WHERE barrio = 'Kae'` hacen lo mismo.",
      porque:
        "No. Las comillas simples son para los **textos** y las dobles para nombrar **columnas**. Con dobles le estás diciendo «compara la columna `barrio` con la columna `Kae`», y como esa columna no existe, la base contesta que no la encuentra. Es de los errores que más despistan porque el mensaje no habla de comillas.",
    },
    {
      texto: "`LIMIT 3` sin `ORDER BY` devuelve tres filas cualesquiera.",
      verdadera: true,
      porque:
        "Exacto, y por eso `LIMIT` casi nunca va solo. «Los tres primeros» solo significa algo si antes has dicho primeros **según qué**. Sin orden, la base corta por donde le pilla.",
    },
    {
      texto: "Una consulta con `WHERE` borra de la tabla las filas que no cumplen la condición.",
      porque:
        "No borra nada. Una consulta **mira**; lo que devuelve es una respuesta, no la tabla. Después de sacar los cinco de Kae, la tabla sigue teniendo sus diez filas. Lo que sí cambia las tablas son otras palabras -`INSERT`, `UPDATE`, `DELETE`- y esas llegan mucho más adelante.",
    },
    {
      texto: "El orden de las columnas en el resultado lo decides tú, en el `SELECT`.",
      verdadera: true,
      porque:
        "Sí, y es de las pocas cosas que controlas del todo. `SELECT edad, nombre` y `SELECT nombre, edad` devuelven los mismos datos con las columnas al revés, y quien lea tu consulta después va a leerlas en el orden que tú pusiste.",
    },
  ],
  pistas: [
    pista("Dos de las falsas tratan del orden y de las comillas. La tercera dice que una consulta cambia algo.", 0),
    pista("Piensa en qué palabras miran y qué palabras tocan. De momento solo has usado las de mirar.", 1),
    pista("Sobre el orden hay dos frases y las dos hablan de lo mismo desde lados distintos: una dice que sin pedirlo hay orden -no lo hay- y otra que sin orden el `LIMIT` corta a ciegas -sí-.", 2),
  ],
  recompensa: { croquetas: 6 },
}
