import { codigo, pista } from '../comun.js'

export default {
  id: "taller-04b-la-linea-culpable",
  mundo: "taller",
  entorno: "worker",
  tipo: "cazar-linea",
  titulo: "Dónde empezó de verdad",
  enunciado: codigo(
    "Un error te dice dónde **reventó**, no dónde te equivocaste. Casi nunca es la misma",
    "línea, y aprender a leerlo hacia atrás es de las cosas que más tardes ahorran.",
    "",
    "Aquí tienes el código y lo que sale por consola. Pulsa la línea que tiene la culpa.",
  ),
  codigoMostrado: codigo(
    "function inventario() {",
    "  const almacen = { acero: 4, peltre: 2 }",
    "  return almacen",
    "}",
    "",
    "function sinAcero(original) {",
    "  const copia = original",
    "  delete copia.acero",
    "  return copia",
    "}",
    "",
    "const real = inventario()",
    "const filtrado = sinAcero(real)",
    "",
    "console.log(real.acero.toFixed(2))",
  ),
  errorMostrado: codigo(
    "TypeError: Cannot read properties of undefined (reading 'toFixed')",
    "    at <anonymous>:15:23",
  ),
  lineaCulpable: 7,
  explicaciones: {
    7: codigo(
      "Esta. `const copia = original` **no copia nada**: deja dos nombres apuntando al",
      "mismo objeto. A partir de aquí, `copia` y `original` son la misma cosa con dos",
      "etiquetas, así que tocar una toca la otra.",
      "",
      "Para copiar de verdad hay que crear un objeto nuevo: `const copia = { ...original }`.",
    ),
    8: codigo(
      "Aquí es donde se estropea el dato, sí, pero esta línea hace exactamente lo que",
      "pone y lo que la función promete: quitar el acero **de la copia**. El fallo es que",
      "lo que tiene delante no es una copia. Eso se decidió una línea antes.",
    ),
    15: codigo(
      "Aquí es donde **revienta**, y por eso el error apunta a la línea 15. Pero esta línea",
      "no ha hecho nada malo: pide el acero de `real` y lo formatea, que es razonable.",
      "Lo que pasa es que se encuentra un `undefined` que le dejó otro. La línea que",
      "revienta es la víctima, casi nunca el culpable.",
    ),
    2: codigo(
      "El almacén se crea bien y con los dos metales puestos. Nada que objetar: el objeto",
      "que sale de aquí está completo.",
    ),
  },
  pistas: [
    pista("El error dice `undefined`. Así que en algún momento `real.acero` dejó de valer 4 y pasó a no existir. Busca quién lo tocó.", 0),
    pista("`real` nunca se modifica directamente. Lo único que le pasa es que se le da a `sinAcero`. Mira qué hace esa función con lo que le llega.", 1),
    pista("Dentro de la función hay dos líneas sospechosas. Una decide **qué es** `copia` y la otra la modifica. La modificación sería inofensiva si la primera hubiera hecho lo que su nombre promete.", 2),
  ],
  recompensa: { croquetas: 11 },
}
