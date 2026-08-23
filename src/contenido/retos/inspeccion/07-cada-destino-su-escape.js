import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-07-cada-destino-su-escape",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "emparejar",
  titulo: "Cada destino, su escape",
  enunciado: codigo(
    "«Escapar» no es una operación: son varias, y cada una sirve para un sitio. Meter en un",
    "sitio lo que se escapó para otro es uno de los agujeros más comunes que hay, porque",
    "**parece** que está protegido.",
    "",
    "Une cada destino con lo que hay que hacerle al texto antes de meterlo ahí.",
  ),
  parejas: [
    {
      izquierda: "Dentro de un párrafo de HTML",
      derecha: "Sustituir `& < > \" '` por sus entidades. Es lo que hace `escaparHtml`.",
    },
    {
      izquierda: "Dentro de un atributo HTML",
      derecha: "Lo mismo, **y** el atributo entre comillas. Sin comillas, un espacio ya basta para añadir otro atributo.",
    },
    {
      izquierda: "Dentro de una URL, como parámetro",
      derecha: "`encodeURIComponent`, que convierte lo que en una dirección significa algo: `&`, `=`, `?`, `/`, el espacio.",
    },
    {
      izquierda: "Dentro de una consulta a la base de datos",
      derecha: "No se escapa: se manda **aparte** de la consulta, como parámetro. Es el único destino donde escapar es la respuesta equivocada.",
    },
    {
      izquierda: "Dentro de un trozo de JavaScript",
      derecha: "No se mete. Se pasa como dato —un atributo, un JSON aparte— y se lee desde el código, que ya está escrito.",
    },
    {
      izquierda: "Dentro de una orden del sistema",
      derecha: "No se pega en la orden: se pasa como argumento suelto a la función que lanza el proceso, sin pasar por un intérprete de órdenes.",
    },
  ],
  pistas: [
    pista("Tres de los seis se resuelven **no escapando**. Ese es el patrón que hay que ver.", 0),
    pista(
      "Los dos primeros son la misma sustitución; lo que los diferencia es una cosa que no está en el texto sino alrededor de él.",
      1,
    ),
    pista(
      "En los tres últimos —base de datos, JavaScript y órdenes del sistema— el dato viaja **por otro canal** en vez de dentro de la frase. Cuando se puede hacer eso, escapar es la solución peor.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
