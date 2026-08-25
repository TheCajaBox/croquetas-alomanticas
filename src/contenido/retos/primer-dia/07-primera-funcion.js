import { codigo, pista } from '../comun.js'

export default {
  id: "dia1-07-primera-funcion",
  mundo: "primer-dia",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Tu primera función",
  jefe: true,
  enunciado: codigo(
    "Y ahora sí: a escribir. Una función, y pequeña.",
    "",
    "Escribe `saludar(nombre)`, que **devuelva** el texto:",
    "",
    "`Buenas, NOMBRE.`",
    "",
    "Por ejemplo, `saludar('Wayne')` tiene que devolver `Buenas, Wayne.` — con la coma,",
    "con el punto final y con esas mayúsculas.",
    "",
    "Te dejo el hueco preparado abajo. Solo hay que rellenar la línea del `return`.",
  ),
  inicial: codigo(
    "function saludar(nombre) {",
    "  // Devuelve aquí el saludo. Acuérdate de las comillas invertidas.",
    "}",
  ),
  solucion: codigo(
    "function saludar(nombre) {",
    "  return `Buenas, ${nombre}.`",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "saludar" },
    { tipo: "usaPlantilla" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    { nombre: "saluda a Wayne", codigo: "esperar(saludar('Wayne')).igualA('Buenas, Wayne.')" },
    { nombre: "saluda a Marasi", codigo: "esperar(saludar('Marasi')).igualA('Buenas, Marasi.')" },
    { nombre: "devuelve el saludo en vez de escribirlo", codigo: "esperar(saludar('Wax'), 'lo que devuelve la función').esDeTipo('string')" },
    { nombre: "aguanta hasta un nombre vacío", codigo: "esperar(saludar('')).igualA('Buenas, .')" },
  ],
  // Practicar esto es practicar la plantilla: los tests cambian de nombre y de
  // caso raro, y la función tiene que seguir saliendo de una sola línea.
  variantes: [
    {
      titulo: "Tu primera función · otra tanda",
      tests: [
        { nombre: "saluda a Steris, que agradecerá la puntualidad", codigo: "esperar(saludar('Steris')).igualA('Buenas, Steris.')" },
        { nombre: "y a MeLaan, con sus mayúsculas raras intactas", codigo: "esperar(saludar('MeLaan')).igualA('Buenas, MeLaan.')" },
        { nombre: "un nombre con espacio dentro no se toca", codigo: "esperar(saludar('Lord Waxillium')).igualA('Buenas, Lord Waxillium.')" },
        { nombre: "el punto final está, y no hay dos", codigo: "esperar(saludar('Wayne').endsWith('.')).esVerdadero()" },
      ],
    },
    {
      titulo: "Tu primera función · y otra",
      tests: [
        { nombre: "saluda a Ranette sin pedir nada a cambio", codigo: "esperar(saludar('Ranette')).igualA('Buenas, Ranette.')" },
        { nombre: "las tildes pasan tal cual: es un texto, no un traductor", codigo: "esperar(saludar('Aradán')).igualA('Buenas, Aradán.')" },
        { nombre: "un número disfrazado de nombre también entra", codigo: "esperar(saludar('724')).igualA('Buenas, 724.')" },
        { nombre: "llamarla dos veces da lo mismo: no guarda rencor ni estado", codigo: "esperar(saludar('Vin')).igualA(saludar('Vin'))" },
        { nombre: "y empieza por «Buenas, » siempre", codigo: "esperar(saludar('Elend').startsWith('Buenas, ')).esVerdadero()" },
      ],
    },
  ],
  recompensa: { croquetas: 10 },
}
