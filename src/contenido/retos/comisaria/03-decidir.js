import { codigo, pista } from '../comun.js'

export default {
  id: "com-03-decidir",
  mundo: "comisaria",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Quién entra y quién no",
  enunciado: codigo(
    "Ahora lo escribes tú entero, sin fichas.",
    "",
    "Escribe `puedeEntrar(edad, tieneCita)`, que decide quién pasa al despacho:",
    "",
    "- Con cita, pasa **siempre**.",
    "- Sin cita, pasa solo si tiene **18 años o más**.",
    "",
    "Devuelve `true` o `false`. No escribas nada por pantalla: **devuélvelo**.",
  ),
  inicial: codigo(
    "function puedeEntrar(edad, tieneCita) {",
    "  // Con cita pasa siempre. Sin cita, 18 o más.",
    "}",
    "",
    "console.log(puedeEntrar(15, true))",
    "console.log(puedeEntrar(15, false))",
  ),
  solucion: codigo(
    "function puedeEntrar(edad, tieneCita) {",
    "  return tieneCita || edad >= 18",
    "}",
    "",
    "console.log(puedeEntrar(15, true))",
    "console.log(puedeEntrar(15, false))",
  ),
  requisitos: [
    { tipo: "usaDeclaracion", valor: "function" },
  ],
  tests: [
    { nombre: "con cita entra aunque sea menor", codigo: "esperar(puedeEntrar(15, true)).esVerdadero()" },
    { nombre: "sin cita y menor, no entra", codigo: "esperar(puedeEntrar(15, false)).esFalso()" },
    { nombre: "sin cita y mayor, entra", codigo: "esperar(puedeEntrar(30, false)).esVerdadero()" },
    { nombre: "18 justos entran sin cita", codigo: "esperar(puedeEntrar(18, false)).esVerdadero()" },
    { nombre: "17 sin cita se queda fuera", codigo: "esperar(puedeEntrar(17, false)).esFalso()" },
    {
      nombre: "devuelve un booleano de verdad, no un texto",
      codigo: "esperar(puedeEntrar(20, false)).esDeTipo('boolean')",
    },
  ],
  // Las dos tandas mueven el límite de sitio: la primera cambia la edad que
  // manda, la segunda mira lo que pasa justo al lado del corte.
  variantes: [
    {
      titulo: "Quién entra y quién no · otra tanda",
      tests: [
        { nombre: "un chaval de doce con cita pasa igual", codigo: "esperar(puedeEntrar(12, true)).esVerdadero()" },
        { nombre: "y sin cita se queda en el pasillo", codigo: "esperar(puedeEntrar(12, false)).esFalso()" },
        { nombre: "un recién nacido con cita también: la cita no pregunta la edad", codigo: "esperar(puedeEntrar(0, true)).esVerdadero()" },
        { nombre: "cero años y sin cita, fuera", codigo: "esperar(puedeEntrar(0, false)).esFalso()" },
        { nombre: "los setenta y dos de Ranette entran solos", codigo: "esperar(puedeEntrar(72, false)).esVerdadero()" },
      ],
    },
    {
      titulo: "Quién entra y quién no · y otra",
      tests: [
        { nombre: "19 sin cita pasa, que es uno más que el corte", codigo: "esperar(puedeEntrar(19, false)).esVerdadero()" },
        { nombre: "16 sin cita no, que es dos menos", codigo: "esperar(puedeEntrar(16, false)).esFalso()" },
        { nombre: "16 con cita sí: la cita se salta el corte", codigo: "esperar(puedeEntrar(16, true)).esVerdadero()" },
        { nombre: "también devuelve booleano cuando dice que no", codigo: "esperar(puedeEntrar(10, false)).esDeTipo('boolean')" },
        { nombre: "y cuando dice que sí por la cita, tampoco cuela una cadena", codigo: "esperar(puedeEntrar(10, true)).esDeTipo('boolean')" },
      ],
    },
  ],
  pistas: [
    pista("Son dos caminos distintos que llevan a poder entrar: tener cita, o tener 18 o más. Con que se cumpla uno, basta.", 0),
    pista("No hace falta ningún `if`. `tieneCita` ya es verdadero o falso, y `edad >= 18` también.", 1),
    pista("Son dos caminos que llevan al mismo sitio y basta con que se cumpla uno: el operador que significa eso está en el apunte, en «Juntar dos condiciones». No necesitas ningún `if`, porque los dos lados ya valen verdadero o falso por sí solos.", 2),
  ],
  recompensa: { croquetas: 7 },
}
