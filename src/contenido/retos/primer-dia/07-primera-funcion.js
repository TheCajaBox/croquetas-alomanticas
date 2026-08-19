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
  recompensa: { croquetas: 10 },
}
