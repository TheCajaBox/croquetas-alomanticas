import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-07-donde-va-un-parametro",
  mundo: "grieta",
  entorno: "sql",
  tipo: "emparejar",
  titulo: "Dónde va un parámetro y dónde no",
  enunciado: codigo(
    "Un parámetro ocupa el sitio de un **valor**. Y en una consulta no todo lo que puede",
    "variar es un valor: hay cosas que son **estructura**, y esas no se parametrizan.",
    "",
    "Une cada cosa que varía con la manera de dejarla variar sin abrir una grieta.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  parejas: [
    {
      izquierda: "El nombre que se busca",
      derecha: "Parámetro: `WHERE nombre = :buscado`. Es un valor, y es el caso fácil.",
    },
    {
      izquierda: "Cuántas filas se piden",
      derecha: "Parámetro también: `LIMIT :cuantas`. Un número es un valor.",
    },
    {
      izquierda: "Por qué columna se ordena",
      derecha: "Lista cerrada escrita por ti: si lo que llega es `dia`, se pega `dia`; si no está en la lista, se usa el de siempre.",
    },
    {
      izquierda: "Si se ordena hacia arriba o hacia abajo",
      derecha: "Lo mismo: dos posibilidades, y se elige entre dos textos fijos. Nunca se pega lo que llegó.",
    },
    {
      izquierda: "De qué tabla se lee",
      derecha: "No varía. Y si de verdad tiene que variar, es una lista cerrada, y conviene preguntarse antes por qué el usuario elige una tabla.",
    },
    {
      izquierda: "Una lista de nombres, para buscar varios de golpe",
      derecha: "Un parámetro **por cada uno**, generando los huecos según cuántos haya: `IN (:n0, :n1, :n2)`.",
    },
  ],
  pistas: [
    pista("Dos de los seis son valores de libro. Otros dos son estructura pura. Los dos que quedan son los interesantes.", 0),
    pista(
      "Piensa qué pasaría con `ORDER BY :columna`: la base ordenaría por una constante, que es lo mismo que no ordenar. Ahí un parámetro no vale para nada.",
      1,
    ),
    pista(
      "El de la lista de nombres es el que sorprende: `IN :lista` no existe. Lo que se hace es fabricar tantos huecos como elementos haya —eso lo decide tu programa, no el usuario— y atar cada valor a su hueco.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
