import { codigo, pista } from '../comun.js'

export default {
  id: "elendel-03-por-dentro-de-un-objeto",
  mundo: "elendel",
  entorno: "worker",
  tipo: "completar",
  titulo: "Recorrer un objeto como si fuera una lista",
  enunciado: codigo(
    "Un objeto no se recorre con `map` ni con `filter`. Pero se puede **convertir en**",
    "lista, recorrerla con lo que ya sabes, y volver a convertirla en objeto.",
    "",
    "Esa ida y vuelta es una de las cosas que más se usan y casi nunca se enseñan. Aquí",
    "hay un almacén con los precios en croquetas y hay que subirlos todos la mitad.",
    "",
    "Rellena los huecos. Sobran fichas.",
  ),
  plantilla: codigo(
    "const precios = { acero: 12, peltre: 30, oro: 8 }",
    "",
    "const subidos = Object.___(",
    "  Object.___(precios).___(([metal, precio]) => [metal, precio * 1.5]),",
    ")",
    "",
    "console.log(subidos.acero)",
  ),
  solucion: codigo(
    "const precios = { acero: 12, peltre: 30, oro: 8 }",
    "",
    "const subidos = Object.fromEntries(",
    "  Object.entries(precios).map(([metal, precio]) => [metal, precio * 1.5]),",
    ")",
    "",
    "console.log(subidos.acero)",
  ),
  fichas: ["fromEntries", "entries", "map", "keys", "values", "filter", "forEach", "assign"],
  requisitos: [
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "el acero sube de 12 a 18",
      codigo: "esperar(subidos.acero).igualA(18)",
    },
    {
      nombre: "siguen estando los tres metales",
      codigo: "esperar(Object.keys(subidos)).igualA(['acero', 'peltre', 'oro'])",
    },
    {
      nombre: "el peltre también ha subido",
      codigo: "esperar(subidos.peltre).igualA(45)",
    },
    {
      nombre: "el original no se ha tocado",
      codigo: "esperar(precios.acero).igualA(12)",
    },
  ],
  pistas: [
    pista("Hay tres huecos y dos son de la familia `Object`. Uno convierte el objeto en lista de pares y el otro hace el camino de vuelta.", 0),
    pista("`Object.entries({ a: 1 })` da `[['a', 1]]`: una lista de pares `[clave, valor]`. El hueco del medio es cómo se recorre una lista transformando cada elemento.", 1),
    pista("El orden es: convertir a lista de pares, transformar cada par en otro par, y reconstruir el objeto. Fíjate en que la flecha recibe el par ya desestructurado y tiene que devolver otro par.", 2),
  ],
  recompensa: { croquetas: 12 },
}
