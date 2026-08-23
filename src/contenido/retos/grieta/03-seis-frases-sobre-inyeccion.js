import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-03-seis-frases-sobre-inyeccion",
  mundo: "grieta",
  entorno: "sql",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre la grieta",
  enunciado: codigo(
    "Seis frases sobre la inyección. Cuatro son cosas que se dicen para no tener que cambiar",
    "el código. Marca cada una.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  afirmaciones: [
    {
      texto: "La inyección no se arregla filtrando la entrada, se arregla no construyendo la orden con el dato dentro.",
      verdadera: true,
      porque:
        "Es la frase del mundo. Filtrar es intentar adivinar qué texto es peligroso —imposible, y además rompe nombres legítimos—; parametrizar es hacer que el texto no pueda ser peligroso, porque llega por un canal donde no se leen órdenes.",
    },
    {
      texto: "Si escapas las comillas simples doblándolas, ya no hay inyección.",
      verdadera: false,
      porque:
        "Es lo que se hacía antes de que existieran los parámetros y es un campo de minas: hay codificaciones donde un carácter multibyte se come la barra de escape, hay motores donde la barra invertida también escapa, y sobre todo **no todo va entre comillas**. Un número o un nombre de columna se pegan sin comillas, y ahí las comillas no protegen de nada.",
    },
    {
      texto: "Con parámetros se puede poner cualquier cosa: el nombre de la tabla, el de la columna o el sentido del orden.",
      verdadera: false,
      porque:
        "No. Un parámetro es un **valor**, y ocupa el sitio de un valor. `ORDER BY :columna` no ordena por esa columna: ordena por una constante, que es lo mismo que no ordenar. Cuando lo que varía es la **estructura** de la consulta, hay que elegirla de una lista cerrada escrita por ti, y eso es la lista de permitidos del mundo anterior.",
    },
    {
      texto: "Una consulta que solo lee no puede hacer daño aunque le inyecten.",
      verdadera: false,
      porque:
        "Leer lo que no te toca es la mitad de las filtraciones que salen en la prensa. Con un `OR 1=1` te llevas la tabla entera; con un `UNION SELECT` te llevas **otra** tabla, la de contraseñas incluida. Y no siempre hace falta ver el resultado: si la página responde distinto según si la condición es verdadera, se saca dato a dato preguntando sí o no.",
    },
    {
      texto: "Un nombre perfectamente legítimo puede romper una consulta pegada con comillas.",
      verdadera: true,
      porque:
        "`d'Alai` la rompe sin ninguna mala intención, y esa es la mejor demostración de que esto no es un problema de gente mala: es un problema de mezclar datos con órdenes. El día que un apellido con apóstrofo da un error del sistema es el día que un atacante sabe que ahí hay una grieta.",
    },
    {
      texto: "Los procedimientos almacenados y las capas de acceso a datos protegen por sí solos de la inyección.",
      verdadera: false,
      porque:
        "Protegen si dentro usan parámetros, y no protegen si dentro pegan cadenas —que es lo que hacen muchos procedimientos almacenados escritos hace quince años, y algunas funciones de las capas modernas que aceptan «SQL crudo»—. La pregunta no es qué biblioteca usas: es si en algún punto del camino el dato acaba dentro del texto de la orden.",
    },
  ],
  pistas: [
    pista("Dos son verdad. Las cuatro falsas ofrecen, cada una, una manera de no tocar el código.", 0),
    pista(
      "Dos de las falsas hablan de defensas que funcionan **a veces**: escapar comillas y confiar en una capa. «A veces» en seguridad significa que no.",
      1,
    ),
    pista(
      "La de los parámetros y el `ORDER BY` es la más técnica: un parámetro ocupa el sitio de un valor, y el nombre de una columna no es un valor.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
