import { codigo, pista } from '../comun.js'

export default {
  id: "melaan-02-codigo-viejo",
  mundo: "melaan",
  entorno: "worker",
  tipo: "refactor",
  titulo: "Código de hace quince años",
  enunciado: codigo(
    "Esto lo escribió alguien hace mucho y sigue funcionando perfectamente. Te lo vas a",
    "encontrar tal cual en cualquier proyecto que lleve años en marcha.",
    "",
    "Tráelo a este siglo sin cambiar lo que hace:",
    "",
    "- ni una `var`",
    "- el texto con plantillas, no pegado con `+`",
    "- las funciones, con flecha",
  ),
  inicial: codigo(
    "var IMPUESTO = 0.1",
    "",
    "function resumirCartel(cartel) {",
    "  var recompensa = cartel.recompensa",
    "  var conImpuesto = recompensa + recompensa * IMPUESTO",
    "  return 'Se busca a ' + cartel.nombre + ' por ' + conImpuesto + ' monedas'",
    "}",
    "",
    "function ordenarPorRecompensa(carteles) {",
    "  return carteles.slice().sort(function (uno, otro) {",
    "    return otro.recompensa - uno.recompensa",
    "  })",
    "}",
  ),
  solucion: codigo(
    "const IMPUESTO = 0.1",
    "",
    "const resumirCartel = (cartel) => {",
    "  const conImpuesto = cartel.recompensa + cartel.recompensa * IMPUESTO",
    "  return `Se busca a ${cartel.nombre} por ${conImpuesto} monedas`",
    "}",
    "",
    "const ordenarPorRecompensa = (carteles) =>",
    "  carteles.slice().sort((uno, otro) => otro.recompensa - uno.recompensa)",
  ),
  requisitos: [
    { tipo: "prohibeVar" },
    { tipo: "usaPlantilla" },
    { tipo: "usaFlecha" },
    { tipo: "declaraVariable", valor: "resumirCartel" },
    { tipo: "declaraVariable", valor: "ordenarPorRecompensa" },
  ],
  tests: [
    {
      nombre: "resume el cartel con su impuesto",
      codigo: codigo(
        "esperar(resumirCartel({ nombre: 'Wayne', recompensa: 500 }))",
        "  .igualA('Se busca a Wayne por 550 monedas')",
      ),
    },
    {
      nombre: "ordena de mayor a menor recompensa",
      codigo: codigo(
        "const carteles = [",
        "  { nombre: 'a', recompensa: 100 },",
        "  { nombre: 'b', recompensa: 900 },",
        "  { nombre: 'c', recompensa: 400 },",
        "]",
        "esperar(ordenarPorRecompensa(carteles).map((c) => c.nombre)).igualA(['b', 'c', 'a'])",
      ),
    },
    {
      nombre: "ordenar no toca la lista original",
      codigo: codigo(
        "const carteles = [{ nombre: 'a', recompensa: 100 }, { nombre: 'b', recompensa: 900 }]",
        "ordenarPorRecompensa(carteles)",
        "esperar(carteles.map((c) => c.nombre)).igualA(['a', 'b'])",
      ),
    },
  ],
  // Al pasar de pegar textos con `+` a una plantilla es fácil colarse con un
  // espacio. Estas tandas traen recompensas con decimales y a cero, que es donde
  // el texto cantaría si el orden de los trozos hubiera cambiado.
  variantes: [
    {
      titulo: "Código de hace quince años · otra tanda",
      tests: [
        {
          nombre: "una recompensa redonda sale redonda",
          codigo: "esperar(resumirCartel({ nombre: 'Miles', recompensa: 10 })).igualA('Se busca a Miles por 11 monedas')",
        },
        {
          nombre: "el impuesto puede dejar decimales, y salen tal cual",
          codigo: "esperar(resumirCartel({ nombre: 'Wax', recompensa: 7 })).igualA('Se busca a Wax por 7.7 monedas')",
        },
        {
          nombre: "por quien no pagan nada tampoco se cobra impuesto",
          codigo: "esperar(resumirCartel({ nombre: 'Nadie', recompensa: 0 })).igualA('Se busca a Nadie por 0 monedas')",
        },
        {
          nombre: "un cartel solo se ordena solo, y en otra lista",
          codigo: codigo(
            "const carteles = [{ nombre: 'a', recompensa: 5 }]",
            "esperar(ordenarPorRecompensa(carteles) === carteles).esFalso()",
            "esperar(ordenarPorRecompensa(carteles).map((cartel) => cartel.nombre)).igualA(['a'])",
          ),
        },
      ],
    },
    {
      titulo: "Código de hace quince años · y otra",
      tests: [
        {
          nombre: "una recompensa de mil doscientos y su impuesto",
          codigo: "esperar(resumirCartel({ nombre: 'Paalm', recompensa: 1200 })).igualA('Se busca a Paalm por 1320 monedas')",
        },
        {
          nombre: "un nombre con espacios dentro se respeta entero",
          codigo: "esperar(resumirCartel({ nombre: 'Miles Dagouter', recompensa: 100 })).igualA('Se busca a Miles Dagouter por 110 monedas')",
        },
        {
          nombre: "ordenar cinco carteles los deja de mayor a menor",
          codigo: codigo(
            "const carteles = [",
            "  { nombre: 'a', recompensa: 10 },",
            "  { nombre: 'b', recompensa: 1000 },",
            "  { nombre: 'c', recompensa: 70 },",
            "  { nombre: 'd', recompensa: 0 },",
            "  { nombre: 'e', recompensa: 500 },",
            "]",
            "esperar(ordenarPorRecompensa(carteles).map((cartel) => cartel.nombre)).igualA(['b', 'e', 'c', 'a', 'd'])",
          ),
        },
        {
          nombre: "ordenar la lista vacía devuelve la lista vacía",
          codigo: "esperar(ordenarPorRecompensa([])).igualA([])",
        },
        {
          nombre: "y con dos empatados la lista original sigue en su orden",
          codigo: codigo(
            "const carteles = [{ nombre: 'a', recompensa: 50 }, { nombre: 'b', recompensa: 50 }]",
            "ordenarPorRecompensa(carteles)",
            "esperar(carteles.map((cartel) => cartel.nombre)).igualA(['a', 'b'])",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Empieza por lo mecánico: cambia las tres `var` por `const` y mira si algo se queja. No debería.", 0),
    pista("El texto largo con `+` se pasa a comillas invertidas y cada trozo variable va dentro de `${...}`.", 1),
    pista("La función que va dentro de `sort` se pasa como valor: es el sitio típico de una flecha. `(uno, otro) => otro.recompensa - uno.recompensa`.", 2),
  ],
  recompensa: { croquetas: 14 },
}
