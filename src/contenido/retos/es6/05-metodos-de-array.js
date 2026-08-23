import { codigo, pista } from '../comun.js'

export default {
  id: "es6-05-metodos-de-array",
  mundo: "es6",
  entorno: "worker",
  tipo: "codigo",
  titulo: "El almacén de metales",
  enunciado: codigo(
    "Un almacén de metales es una lista de objetos `{ nombre, precio }`. Hay que sacar dos cosas",
    "de ahí, y hay que sacarlas **sin un solo bucle**.",
    "",
    "- `nombresCaros(metales, minimo)`: los nombres, **en mayúsculas**, de los que cuestan `minimo`",
    "  o más, en el mismo orden en que venían.",
    "- `valorTotal(metales)`: lo que suman todos los precios.",
    "",
    "Sí, con un `for` te sale en cuatro líneas. Y no es el reto.",
  ),
  inicial: codigo(
    "function nombresCaros(metales, minimo) {",
    "  // filter y map. Por ese orden.",
    "}",
    "",
    "function valorTotal(metales) {",
    "  // reduce. Y acuérdate del valor inicial.",
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
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "saca los caros en mayúsculas",
      codigo: codigo(
        "const almacen = [",
        "  { nombre: 'acero', precio: 30 },",
        "  { nombre: 'estaño', precio: 12 },",
        "  { nombre: 'bendaloy', precio: 90 },",
        "  { nombre: 'oro', precio: 30 },",
        "]",
        "esperar(nombresCaros(almacen, 30)).igualA(['ACERO', 'BENDALOY', 'ORO'])",
      ),
    },
    { nombre: "si no llega ninguno, devuelve lista vacía", codigo: "esperar(nombresCaros([{ nombre: 'estaño', precio: 12 }], 50)).igualA([])" },
    {
      nombre: "con el almacén vacío tampoco se rompe",
      codigo: codigo(
        "esperar(nombresCaros([], 1)).igualA([])",
        "esperar(valorTotal([])).igualA(0)",
      ),
    },
    {
      nombre: "suma todos los precios",
      codigo: codigo(
        "esperar(valorTotal([",
        "  { nombre: 'acero', precio: 30 },",
        "  { nombre: 'estaño', precio: 12 },",
        "  { nombre: 'bendaloy', precio: 90 },",
        "])).igualA(132)",
      ),
    },
    {
      nombre: "no toca el almacén original",
      codigo: codigo(
        "const almacen = [{ nombre: 'acero', precio: 30 }]",
        "nombresCaros(almacen, 1)",
        "valorTotal(almacen)",
        "esperar(almacen).igualA([{ nombre: 'acero', precio: 30 }])",
      ),
    },
  ],
  // Otros almacenes, y con los bordes puestos donde duelen: el metal que cuesta
  // justo el mínimo, el que cuesta cero y el nombre que ya venía en mayúsculas.
  variantes: [
    {
      titulo: "El almacén de metales · otra tanda",
      tests: [
        {
          nombre: "los tres que llegan a cuarenta, y a gritos",
          codigo: codigo(
            "const almacen = [",
            "  { nombre: 'aluminio', precio: 120 },",
            "  { nombre: 'peltre', precio: 8 },",
            "  { nombre: 'zinc', precio: 40 },",
            "  { nombre: 'duraluminio', precio: 200 },",
            "]",
            "esperar(nombresCaros(almacen, 40)).igualA(['ALUMINIO', 'ZINC', 'DURALUMINIO'])",
          ),
        },
        {
          nombre: "el que cuesta justo el mínimo entra: es «o más», no «más»",
          codigo: codigo(
            "const almacen = [",
            "  { nombre: 'aluminio', precio: 120 },",
            "  { nombre: 'peltre', precio: 8 },",
            "  { nombre: 'zinc', precio: 40 },",
            "  { nombre: 'duraluminio', precio: 200 },",
            "]",
            "esperar(nombresCaros(almacen, 120)).igualA(['ALUMINIO', 'DURALUMINIO'])",
          ),
        },
        {
          nombre: "con el mínimo a cero entra el almacén entero",
          codigo: codigo(
            "const almacen = [",
            "  { nombre: 'aluminio', precio: 120 },",
            "  { nombre: 'peltre', precio: 8 },",
            "  { nombre: 'zinc', precio: 40 },",
            "  { nombre: 'duraluminio', precio: 200 },",
            "]",
            "esperar(nombresCaros(almacen, 0)).igualA(['ALUMINIO', 'PELTRE', 'ZINC', 'DURALUMINIO'])",
          ),
        },
        {
          nombre: "y el valor del almacén son los cuatro precios juntos",
          codigo: codigo(
            "const almacen = [",
            "  { nombre: 'aluminio', precio: 120 },",
            "  { nombre: 'peltre', precio: 8 },",
            "  { nombre: 'zinc', precio: 40 },",
            "  { nombre: 'duraluminio', precio: 200 },",
            "]",
            "esperar(valorTotal(almacen)).igualA(368)",
          ),
        },
      ],
    },
    {
      titulo: "El almacén de metales · y otra",
      tests: [
        {
          nombre: "un almacén de un solo metal se filtra y se suma igual",
          codigo: codigo(
            "esperar(nombresCaros([{ nombre: 'cobre', precio: 5 }], 5)).igualA(['COBRE'])",
            "esperar(valorTotal([{ nombre: 'cobre', precio: 5 }])).igualA(5)",
          ),
        },
        {
          nombre: "un precio de cero no llega a un mínimo de uno",
          codigo: "esperar(nombresCaros([{ nombre: 'plomo', precio: 0 }], 1)).igualA([])",
        },
        {
          nombre: "un nombre que ya venía en mayúsculas se queda tal cual",
          codigo: "esperar(nombresCaros([{ nombre: 'ORO', precio: 9 }], 1)).igualA(['ORO'])",
        },
        {
          nombre: "los números rojos también suman, restando",
          codigo: "esperar(valorTotal([{ nombre: 'a', precio: 50 }, { nombre: 'b', precio: -20 }])).igualA(30)",
        },
        {
          nombre: "y el orden que sale es el de entrada, no el del precio",
          codigo: codigo(
            "const almacen = [",
            "  { nombre: 'oro', precio: 300 },",
            "  { nombre: 'acero', precio: 10 },",
            "  { nombre: 'estaño', precio: 900 },",
            "]",
            "esperar(nombresCaros(almacen, 5)).igualA(['ORO', 'ACERO', 'ESTAÑO'])",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("`filter` te deja los que cumplen algo. `map` los transforma uno a uno. `reduce` los aplasta todos en un solo valor.", 0),
    pista("Se pueden encadenar: `metales.filter(...).map(...)`. Y a `reduce` hay que darle el segundo argumento, el `0` inicial, o con la lista vacía te da un error.", 1),
    pista("`metales.filter((m) => m.precio >= minimo).map((m) => m.nombre.toUpperCase())` y `metales.reduce((suma, m) => suma + m.precio, 0)`.", 2),
  ],
  recompensa: { croquetas: 11 },
}
