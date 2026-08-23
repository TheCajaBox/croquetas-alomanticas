import { codigo, pista } from '../comun.js'

export default {
  id: "es6-07-asincronia",
  mundo: "es6",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Jefe: el golpe de los Desvanecedores",
  jefe: true,
  enunciado: codigo(
    "Última parada de los Áridos.",
    "",
    "Hay que avisar a varios y esperar. Cada aviso tarda lo suyo, y **no tardan lo mismo**.",
    "",
    "Te doy hecho `avisar(nombre)`, que devuelve una promesa. Tú escribes dos funciones:",
    "",
    "- `reunirEquipo(nombres)`: espera a que lleguen **todos** y devuelve la lista de avisos",
    "  **en el orden en que los pediste**, no en el que llegaron.",
    "- `primeroEnLlegar(nombres)`: devuelve solo el aviso del **primero** que llegue.",
    "",
    "Las dos con `async` y `await`.",
    "",
    "Aquí está el truco del reto: `Promise.all` respeta el orden de entrada aunque las promesas",
    "terminen desordenadas. Mucha gente cree que no.",
  ),
  inicial: codigo(
    "// Esto te lo doy hecho. No hace falta que lo toques.",
    "const avisar = (nombre) =>",
    "  new Promise((llega) => setTimeout(() => llega(`${nombre} llega`), nombre.length * 10))",
    "",
    "async function reunirEquipo(nombres) {",
    "  // Todos. Y en orden.",
    "}",
    "",
    "async function primeroEnLlegar(nombres) {",
    "  // Solo el más rápido.",
    "}",
  ),
  solucion: codigo(
    "const avisar = (nombre) =>",
    "  new Promise((llega) => setTimeout(() => llega(`${nombre} llega`), nombre.length * 10))",
    "",
    "async function reunirEquipo(nombres) {",
    "  const llegadas = await Promise.all(nombres.map((nombre) => avisar(nombre)))",
    "  return llegadas",
    "}",
    "",
    "async function primeroEnLlegar(nombres) {",
    "  return await Promise.race(nombres.map((nombre) => avisar(nombre)))",
    "}",
  ),
  requisitos: [
    { tipo: "usaAsync" },
    { tipo: "usaLlamada", valor: "all" },
    { tipo: "usaLlamada", valor: "race" },
    { tipo: "prohibeBucles" },
  ],
  tests: [
    { nombre: "reúne a todo el equipo", codigo: "esperar(await reunirEquipo(['Wax', 'Wayne'])).igualA(['Wax llega', 'Wayne llega'])" },
    {
      nombre: "respeta el orden de entrada aunque lleguen desordenados",
      codigo: codigo(
        "// Marasi tarda el doble que Wax, y aun así va primera en la lista.",
        "esperar(await reunirEquipo(['Marasi', 'Wax'])).igualA(['Marasi llega', 'Wax llega'])",
      ),
    },
    { nombre: "con la lista vacía devuelve lista vacía", codigo: "esperar(await reunirEquipo([])).igualA([])" },
    { nombre: "devuelve una promesa, no el valor directamente", codigo: "esperar(reunirEquipo([]) instanceof Promise).esVerdadero()" },
    { nombre: "el primero en llegar es el de nombre más corto", codigo: "esperar(await primeroEnLlegar(['Marasi', 'Wax', 'Steris'])).igualA('Wax llega')" },
  ],
  // El jefe se practica con equipos nuevos. Lo que se vuelve a mirar es lo
  // mismo -que `all` respeta el orden de entrada y `race` no espera a nadie-
  // pero con nombres que tardan otras cosas, incluidos dos que tardan igual.
  variantes: [
    {
      titulo: "Jefe: el golpe de los Desvanecedores · otra tanda",
      tests: [
        {
          nombre: "reúne a tres y los devuelve en el orden en que los llamaste",
          codigo: codigo(
            "// Steris tarda el doble que Wax y aun así sale primera.",
            "esperar(await reunirEquipo(['Steris', 'Wax', 'Marasi'])).igualA([",
            "  'Steris llega',",
            "  'Wax llega',",
            "  'Marasi llega',",
            "])",
          ),
        },
        {
          nombre: "un equipo de uno también es un equipo",
          codigo: "esperar(await reunirEquipo(['Wayne'])).igualA(['Wayne llega'])",
        },
        {
          nombre: "entre Wayne y Wax gana Wax, que tiene menos letras",
          codigo: "esperar(await primeroEnLlegar(['Wayne', 'Wax'])).igualA('Wax llega')",
        },
        {
          nombre: "y llamar al más rápido devuelve su aviso, un texto y no una lista",
          codigo: "esperar(await primeroEnLlegar(['Ranette', 'Vin']), 'el primer aviso').esDeTipo('string')",
        },
      ],
    },
    {
      titulo: "Jefe: el golpe de los Desvanecedores · y otra",
      tests: [
        {
          nombre: "dos nombres del mismo largo salen en el orden que pediste, no a suertes",
          codigo: "esperar(await reunirEquipo(['Wax', 'Vin'])).igualA(['Wax llega', 'Vin llega'])",
        },
        {
          nombre: "el más largo primero tampoco cuela: el orden es el tuyo",
          codigo: "esperar(await reunirEquipo(['Waxillium', 'Wax'])).igualA(['Waxillium llega', 'Wax llega'])",
        },
        {
          nombre: "cinco avisos, cinco llegadas, y ninguna fuera de sitio",
          codigo: codigo(
            "esperar(await reunirEquipo(['Wax', 'Wayne', 'Marasi', 'Steris', 'Ranette'])).igualA([",
            "  'Wax llega',",
            "  'Wayne llega',",
            "  'Marasi llega',",
            "  'Steris llega',",
            "  'Ranette llega',",
            "])",
          ),
        },
        {
          nombre: "con un solo aviso, el primero en llegar es ese",
          codigo: "esperar(await primeroEnLlegar(['MeLaan'])).igualA('MeLaan llega')",
        },
        {
          nombre: "y el más rápido también devuelve una promesa antes de resolverse",
          codigo: "esperar(primeroEnLlegar(['Wax']) instanceof Promise).esVerdadero()",
        },
      ],
    },
  ],
  recompensa: { croquetas: 18 },
}
