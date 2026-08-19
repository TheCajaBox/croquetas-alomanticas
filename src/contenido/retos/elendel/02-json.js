import { codigo, pista } from '../comun.js'

export default {
  id: "elendel-02-json",
  mundo: "elendel",
  entorno: "worker",
  tipo: "codigo",
  titulo: "El idioma en que llegan los datos",
  enunciado: codigo(
    "Todo lo que viene de fuera —de un servidor, de un archivo, de otro programa— llega",
    "como **texto**. Y casi siempre en el mismo formato: JSON.",
    "",
    "Te llega el parte de la comisaría en un texto. Escribe `resumirParte(texto)`, que:",
    "",
    "1. Lo convierta en un objeto de verdad.",
    "2. Devuelva `{ ciudad, agentes, casos }`, donde `casos` es la **suma** de los casos",
    "   de todos los agentes y `agentes` cuántos hay.",
    "",
    "Si el texto no se puede leer, que devuelva `null` en vez de reventar. Los datos de",
    "fuera vienen rotos más veces de las que nadie confiesa.",
  ),
  inicial: codigo(
    "function resumirParte(texto) {",
    "  // JSON.parse lanza un error si el texto no vale. Recógelo.",
    "}",
  ),
  solucion: codigo(
    "function resumirParte(texto) {",
    "  let parte",
    "  try {",
    "    parte = JSON.parse(texto)",
    "  } catch {",
    "    return null",
    "  }",
    "",
    "  return {",
    "    ciudad: parte.ciudad,",
    "    agentes: parte.agentes.length,",
    "    casos: parte.agentes.reduce((suma, agente) => suma + agente.casos, 0),",
    "  }",
    "}",
  ),
  requisitos: [
    { tipo: "declaraVariable", valor: "resumirParte" },
    { tipo: "usaLlamada", valor: "parse" },
    { tipo: "prohibeVar" },
  ],
  tests: [
    {
      nombre: "resume un parte con tres agentes",
      codigo: codigo(
        "const texto = JSON.stringify({ ciudad: 'Elendel', agentes: [",
        "  { nombre: 'Wax', casos: 4 },",
        "  { nombre: 'Wayne', casos: 1 },",
        "  { nombre: 'Marasi', casos: 7 },",
        "] })",
        "esperar(resumirParte(texto)).igualA({ ciudad: 'Elendel', agentes: 3, casos: 12 })",
      ),
    },
    {
      nombre: "un parte sin agentes suma cero",
      codigo: codigo(
        "const texto = JSON.stringify({ ciudad: 'Dulsing', agentes: [] })",
        "esperar(resumirParte(texto)).igualA({ ciudad: 'Dulsing', agentes: 0, casos: 0 })",
      ),
    },
    {
      nombre: "devuelve null si el texto está roto",
      codigo: "esperar(resumirParte('{ esto no es json')).igualA(null)",
    },
    {
      nombre: "devuelve null si le llega texto vacío",
      codigo: "esperar(resumirParte('')).igualA(null)",
    },
  ],
  pistas: [
    pista("`JSON.parse(texto)` convierte el texto en objeto. Y `JSON.stringify(objeto)` hace lo contrario, que es lo que hacen los tests para prepararte los datos.", 0),
    pista("`JSON.parse` no devuelve `null` cuando el texto está mal: **lanza un error**. Lo que necesitas para eso ya lo viste en El taller.", 1),
    pista("Dos partes: primero intentar leerlo y salir con `null` si no se puede, y después construir el resumen. Los casos se suman recorriendo la lista de agentes, y eso ya sabes hacerlo de dos o tres maneras.", 2),
  ],
  recompensa: { croquetas: 12 },
}
