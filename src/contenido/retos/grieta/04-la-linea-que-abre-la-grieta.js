import { codigo, pista } from '../comun.js'
import { SELLOS } from '../tablas-de-sel.js'

export default {
  id: "grieta-04-la-linea-que-abre-la-grieta",
  mundo: "grieta",
  entorno: "sql",
  tipo: "cazar-linea",
  titulo: "La línea que abre la grieta",
  enunciado: codigo(
    "Este código usa parámetros. Los usa bien, en tres sitios de cuatro.",
    "",
    "**Una línea** lo estropea todo. Encuéntrala.",
  ),
  esquema: SELLOS.esquema,
  datos: SELLOS.datos,
  codigoMostrado: codigo(
    "function buscarFirmas(peticion) {",
    "  const partes = ['SELECT documento, dia FROM firmas WHERE 1 = 1']",
    "  const valores = {}",
    "  if (peticion.dia) {",
    "    partes.push('AND dia = :dia')",
    "    valores.dia = peticion.dia",
    "  }",
    "  if (peticion.sello) {",
    "    partes.push('AND sello_id = :sello')",
    "    valores.sello = peticion.sello",
    "  }",
    "  if (peticion.orden) {",
    "    partes.push('ORDER BY ' + peticion.orden)",
    "  }",
    "  partes.push('LIMIT :cuantas')",
    "  valores.cuantas = peticion.cuantas ?? 20",
    "  return base.exec(partes.join(' '), valores)",
    "}",
  ),
  errorMostrado:
    "No hay error. La función funciona, filtra por día y por sello, ordena por donde le digas y limita las filas.",
  lineaCulpable: 13,
  explicaciones: {
    2: "Empieza la consulta con `WHERE 1 = 1`, que parece un truco sucio y es lo contrario: permite añadir todas las condiciones con `AND` sin llevar la cuenta de cuál es la primera. Es una costumbre buena y no filtra nada.",
    5: "Añade un trozo de consulta con un parámetro nombrado, y el trozo es **texto fijo escrito por ti**. Así se hace.",
    6: "Y aquí el valor, aparte. Lo que llega de la petición no toca el texto de la consulta en ningún momento.",
    9: "Lo mismo con el sello: trozo fijo, parámetro, valor aparte.",
    13: "Aquí. `peticion.orden` se pega **dentro del texto de la consulta**, y eso ya no es un valor: es estructura. Con `orden = 'dia'` funciona; con `orden = '(SELECT secreto FROM firmas LIMIT 1)'` se ordena por un dato que no debía salir, y con `orden = 'dia; DROP TABLE firmas'` depende de lo generoso que sea el motor. Y no se puede arreglar con un parámetro: `ORDER BY :orden` ordena por una constante, que es lo mismo que no ordenar. Cuando lo que varía es la estructura, se elige de una **lista cerrada escrita por ti**.",
    15: "Un `LIMIT` con parámetro. Este sí se puede parametrizar, porque un límite es un número: un valor.",
    16: "El valor del límite, con un valor por omisión razonable. Bien.",
  },
  pistas: [
    pista("Hay cuatro sitios donde algo de la petición entra en la consulta. Tres entran igual.", 0),
    pista(
      "Compara qué se hace con `peticion.dia`, con `peticion.sello` y con `peticion.cuantas`. Y luego mira el cuarto.",
      1,
    ),
    pista(
      "Tres valores viajan en el objeto de los valores. Uno viaja **dentro del texto**, y no es un valor: es una parte de la consulta.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
