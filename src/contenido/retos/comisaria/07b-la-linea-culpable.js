import { codigo, pista } from '../comun.js'

export default {
  id: "com-07b-la-linea-culpable",
  mundo: "comisaria",
  entorno: "worker",
  tipo: "cazar-linea",
  titulo: "El expediente que no era",
  enunciado: codigo(
    "Aquí no hay que escribir nada: hay que leer.",
    "",
    "Este código revienta, y el error señala una línea. Esa línea no tiene la culpa —",
    "solo es donde se ha notado. Pulsa la que de verdad la tiene.",
  ),
  codigoMostrado: codigo(
    "const fichas = [",
    "  { nombre: 'Wax', rango: 'agente' },",
    "  { nombre: 'Wayne', rango: 'agente' },",
    "]",
    "",
    "const buscado = 'Marasi'",
    "",
    "let encontrada",
    "for (const ficha of fichas) {",
    "  if (ficha.nombre === buscado) {",
    "    encontrada = ficha",
    "  }",
    "}",
    "",
    "console.log(encontrada.rango)",
  ),
  errorMostrado: codigo(
    "TypeError: Cannot read properties of undefined (reading 'rango')",
    "    at <anonymous>:15:23",
  ),
  lineaCulpable: 8,
  explicaciones: {
    8: codigo(
      "Esta. `let encontrada` sin valor deja la variable en `undefined`, y si el bucle no",
      "encuentra a nadie se queda así. El código está escrito dando por hecho que siempre",
      "se encuentra algo, y aquí no se encuentra: `'Marasi'` no está en la lista.",
      "",
      "No es que falte una línea: es que **falta decidir qué pasa cuando no aparece**. Eso",
      "se decide aquí, al declararla, o justo después del bucle con un `if`.",
    ),
    10: codigo(
      "La comparación está bien hecha, con `===` y sobre la propiedad correcta. Lo que",
      "pasa es que ninguna ficha cumple la condición, y eso no es un fallo de esta línea:",
      "es un caso que el programa tenía que haber previsto.",
    ),
    15: codigo(
      "Aquí es donde salta el error, y por eso el mensaje dice «línea 15». Pero esta línea",
      "hace algo razonable: pedirle el rango a la ficha encontrada. El problema es que le",
      "dieron una ficha que no existe. La línea que revienta suele ser la última en",
      "enterarse, no la primera en equivocarse.",
    ),
    6: codigo(
      "Buscar a alguien que no está en la lista no es ningún error. Es lo normal: la mitad",
      "de las búsquedas de este mundo no encuentran nada. El fallo está en no haber",
      "previsto esa mitad.",
    ),
  },
  pistas: [
    pista("El error dice que algo vale `undefined`. Busca qué variable es y en qué línea nace.", 0),
    pista("`encontrada` solo recibe un valor si el `if` de dentro del bucle se cumple alguna vez. Comprueba si con estos datos se cumple.", 1),
    pista("No busques una línea mal escrita, porque no la hay: todas hacen lo que dicen. Busca la línea donde se decidió qué valdría `encontrada` si el bucle no encontraba nada.", 2),
  ],
  recompensa: { croquetas: 8 },
}
