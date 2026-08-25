import { codigo, pista } from '../comun.js'

export default {
  id: "melaan-01-de-bucle-a-metodo",
  mundo: "melaan",
  entorno: "worker",
  tipo: "refactor",
  titulo: "La misma vuelta, otra forma",
  enunciado: codigo(
    "Este código **funciona**. Ejecútalo antes de tocar nada y compruébalo: los tests pasan.",
    "",
    "Y aun así lo vas a reescribir.",
    "",
    "Haz lo mismo sin un solo bucle, con los métodos de las listas. El resultado tiene que",
    "ser idéntico: los mismos tests, verdes, sin cambiarles ni una coma.",
  ),
  inicial: codigo(
    "function nombresCaros(metales, minimo) {",
    "  const caros = []",
    "  for (let i = 0; i < metales.length; i += 1) {",
    "    if (metales[i].precio >= minimo) {",
    "      caros.push(metales[i].nombre.toUpperCase())",
    "    }",
    "  }",
    "  return caros",
    "}",
    "",
    "function valorTotal(metales) {",
    "  let suma = 0",
    "  for (const metal of metales) {",
    "    suma += metal.precio",
    "  }",
    "  return suma",
    "}",
  ),
  solucion: codigo(
    "function nombresCaros(metales, minimo) {",
    "  return metales",
    "    .filter((metal) => metal.precio >= minimo)",
    "    .map((metal) => metal.nombre.toUpperCase())",
    "}",
    "",
    "function valorTotal(metales) {",
    "  return metales.reduce((suma, metal) => suma + metal.precio, 0)",
    "}",
  ),
  requisitos: [
    { tipo: "prohibeBucles" },
    { tipo: "usaLlamada", valor: "filter" },
    { tipo: "usaLlamada", valor: "map" },
    { tipo: "usaLlamada", valor: "reduce" },
  ],
  tests: [
    {
      nombre: "saca los caros en mayúsculas",
      codigo: codigo(
        "const almacen = [",
        "  { nombre: 'acero', precio: 30 },",
        "  { nombre: 'estaño', precio: 12 },",
        "  { nombre: 'bendaloy', precio: 90 },",
        "]",
        "esperar(nombresCaros(almacen, 30)).igualA(['ACERO', 'BENDALOY'])",
      ),
    },
    {
      nombre: "con el almacén vacío devuelve lista vacía",
      codigo: codigo(
        "esperar(nombresCaros([], 1)).igualA([])",
        "esperar(valorTotal([])).igualA(0)",
      ),
    },
    { nombre: "suma los precios", codigo: "esperar(valorTotal([{ nombre: 'a', precio: 30 }, { nombre: 'b', precio: 12 }])).igualA(42)" },
    {
      nombre: "no toca el almacén original",
      codigo: codigo(
        "const almacen = [{ nombre: 'acero', precio: 30 }]",
        "nombresCaros(almacen, 1)",
        "esperar(almacen).igualA([{ nombre: 'acero', precio: 30 }])",
      ),
    },
  ],
  // Reescribir un bucle bien hecho se nota justo en los bordes: el mínimo justo,
  // el precio de cero y la lista vacía, que es donde `reduce` sin valor inicial
  // se cae y el bucle de antes no se caía.
  variantes: [
    {
      titulo: "La misma vuelta, otra forma · otra tanda",
      tests: [
        {
          nombre: "un metal solo que llega justo al mínimo",
          codigo: "esperar(nombresCaros([{ nombre: 'cobre', precio: 50 }], 50)).igualA(['COBRE'])",
        },
        {
          nombre: "el que no llega se queda fuera y la lista sale vacía",
          codigo: "esperar(nombresCaros([{ nombre: 'peltre', precio: 8 }], 20)).igualA([])",
        },
        {
          nombre: "el orden de salida es el de entrada, no el del precio",
          codigo: codigo(
            "const almacen = [",
            "  { nombre: 'oro', precio: 300 },",
            "  { nombre: 'acero', precio: 10 },",
            "  { nombre: 'zinc', precio: 900 },",
            "]",
            "esperar(nombresCaros(almacen, 5)).igualA(['ORO', 'ACERO', 'ZINC'])",
          ),
        },
        {
          nombre: "y esos tres precios suman lo que suman",
          codigo: codigo(
            "const almacen = [",
            "  { nombre: 'oro', precio: 300 },",
            "  { nombre: 'acero', precio: 10 },",
            "  { nombre: 'zinc', precio: 900 },",
            "]",
            "esperar(valorTotal(almacen)).igualA(1210)",
          ),
        },
      ],
    },
    {
      titulo: "La misma vuelta, otra forma · y otra",
      tests: [
        {
          nombre: "un precio de cero no llega a un mínimo de uno, pero sí a un mínimo de cero",
          codigo: codigo(
            "esperar(nombresCaros([{ nombre: 'plomo', precio: 0 }], 1)).igualA([])",
            "esperar(nombresCaros([{ nombre: 'plomo', precio: 0 }], 0)).igualA(['PLOMO'])",
          ),
        },
        {
          nombre: "los números rojos también entran en la suma, restando",
          codigo: "esperar(valorTotal([{ nombre: 'a', precio: 80 }, { nombre: 'b', precio: -30 }])).igualA(50)",
        },
        {
          nombre: "un nombre que ya venía en mayúsculas se queda igual",
          codigo: "esperar(nombresCaros([{ nombre: 'ORO', precio: 9 }], 1)).igualA(['ORO'])",
        },
        {
          nombre: "el almacén vacío suma cero: es el valor inicial de reduce, no un descuido",
          codigo: "esperar(valorTotal([])).igualA(0)",
        },
        {
          nombre: "y ninguna de las dos toca el almacén que le dieron",
          codigo: codigo(
            "const almacen = [{ nombre: 'zinc', precio: 40 }, { nombre: 'oro', precio: 300 }]",
            "nombresCaros(almacen, 1)",
            "valorTotal(almacen)",
            "esperar(almacen).igualA([{ nombre: 'zinc', precio: 40 }, { nombre: 'oro', precio: 300 }])",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("La primera función hace dos cosas a la vez: descarta unos y transforma otros. Son dos métodos encadenados.", 0),
    pista("La segunda va acumulando en una variable de fuera. Eso es exactamente lo que hace `reduce`.", 1),
    pista("`metales.filter((m) => m.precio >= minimo).map((m) => m.nombre.toUpperCase())` y `metales.reduce((suma, m) => suma + m.precio, 0)`.", 2),
  ],
  recompensa: { croquetas: 12 },
}
