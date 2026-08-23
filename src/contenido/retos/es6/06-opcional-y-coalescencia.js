import { codigo, pista } from '../comun.js'

export default {
  id: "es6-06-opcional-y-coalescencia",
  mundo: "es6",
  entorno: "worker",
  tipo: "codigo",
  titulo: "Fichas incompletas",
  enunciado: codigo(
    "Las fichas de los agentes las rellena gente con prisa. Faltan campos, faltan objetos",
    "enteros, y a veces hay campos vacíos que **sí** son correctos y hay que respetar.",
    "",
    "Escribe `informeDeAgente(agente)`, que devuelva exactamente:",
    "",
    "`nombre — ciudad — N contacto(s)`",
    "",
    "Con estas reglas:",
    "",
    "- si no hay `nombre`, pon `desconocido`",
    "- la ciudad está en `agente.destino.ciudad`, y puede no haber `destino` siquiera; entonces, `sin asignar`",
    "- `N` es cuántos `contactos` tiene; si no hay lista, `0`",
    "",
    "**Ojo con esto**, que es la trampa: un nombre vacío `''` es un nombre vacío, no es «que falte».",
    "Tiene que salir vacío. Por eso aquí `||` no te vale.",
  ),
  inicial: codigo(
    "function informeDeAgente(agente) {",
    "  // ?. para lo que puede no existir, ?? para lo que puede faltar.",
    "}",
  ),
  solucion: codigo(
    "function informeDeAgente(agente) {",
    "  const nombre = agente?.nombre ?? 'desconocido'",
    "  const ciudad = agente?.destino?.ciudad ?? 'sin asignar'",
    "  const contactos = agente?.contactos?.length ?? 0",
    "  return `${nombre} — ${ciudad} — ${contactos} contacto(s)`",
    "}",
  ),
  requisitos: [
    { tipo: "usaEncadenamientoOpcional" },
    { tipo: "usaCoalescencia" },
    { tipo: "prohibeVar" },
    { tipo: "declaraVariable", valor: "informeDeAgente" },
  ],
  tests: [
    {
      nombre: "ficha completa",
      codigo: codigo(
        "esperar(informeDeAgente({",
        "  nombre: 'Marasi',",
        "  destino: { ciudad: 'Elendel' },",
        "  contactos: ['Wax', 'Wayne'],",
        "})).igualA('Marasi — Elendel — 2 contacto(s)')",
      ),
    },
    { nombre: "ficha en blanco", codigo: "esperar(informeDeAgente({})).igualA('desconocido — sin asignar — 0 contacto(s)')" },
    { nombre: "sin destino no revienta", codigo: "esperar(informeDeAgente({ nombre: 'Wax' })).igualA('Wax — sin asignar — 0 contacto(s)')" },
    { nombre: "destino a null tampoco revienta", codigo: "esperar(informeDeAgente({ nombre: 'Wax', destino: null })).igualA('Wax — sin asignar — 0 contacto(s)')" },
    { nombre: "un nombre vacío se respeta, no se sustituye", codigo: "esperar(informeDeAgente({ nombre: '' })).igualA(' — sin asignar — 0 contacto(s)')" },
    { nombre: "cero contactos es cero, no es que falte la lista", codigo: "esperar(informeDeAgente({ nombre: 'Wax', contactos: [] })).igualA('Wax — sin asignar — 0 contacto(s)')" },
  ],
  // La lección es la frontera entre «no existe» y «existe y está vacío». Las
  // tandas la cruzan por sitios nuevos: la ficha que no llega, el destino sin
  // ciudad, la ciudad vacía y el nombre a null, que sí es que falta.
  variantes: [
    {
      titulo: "Fichas incompletas · otra tanda",
      tests: [
        {
          nombre: "sin ficha siquiera no revienta: llamarla a secas también vale",
          codigo: "esperar(informeDeAgente()).igualA('desconocido — sin asignar — 0 contacto(s)')",
        },
        {
          nombre: "y una ficha a null tampoco",
          codigo: "esperar(informeDeAgente(null)).igualA('desconocido — sin asignar — 0 contacto(s)')",
        },
        {
          nombre: "cuatro contactos son cuatro",
          codigo: "esperar(informeDeAgente({ nombre: 'Wayne', contactos: ['a', 'b', 'c', 'd'] })).igualA('Wayne — sin asignar — 4 contacto(s)')",
        },
        {
          nombre: "un destino sin ciudad es un destino sin asignar",
          codigo: "esperar(informeDeAgente({ nombre: 'Wax', destino: {} })).igualA('Wax — sin asignar — 0 contacto(s)')",
        },
        {
          nombre: "y una ciudad vacía se respeta igual que un nombre vacío",
          codigo: "esperar(informeDeAgente({ nombre: 'Steris', destino: { ciudad: '' } })).igualA('Steris —  — 0 contacto(s)')",
        },
      ],
    },
    {
      titulo: "Fichas incompletas · y otra",
      tests: [
        {
          nombre: "el nombre vacío y la ciudad vacía a la vez, y el informe sigue en pie",
          codigo: "esperar(informeDeAgente({ nombre: '', destino: { ciudad: '' }, contactos: [] })).igualA(' —  — 0 contacto(s)')",
        },
        {
          nombre: "una lista de contactos a null cuenta cero, no revienta",
          codigo: "esperar(informeDeAgente({ nombre: 'Wax', contactos: null })).igualA('Wax — sin asignar — 0 contacto(s)')",
        },
        {
          nombre: "un solo contacto también se cuenta",
          codigo: "esperar(informeDeAgente({ nombre: 'Marasi', destino: { ciudad: 'Bilming' }, contactos: ['Wax'] })).igualA('Marasi — Bilming — 1 contacto(s)')",
        },
        {
          nombre: "un nombre a null sí se sustituye: null es que falta, y el vacío no",
          codigo: "esperar(informeDeAgente({ nombre: null })).igualA('desconocido — sin asignar — 0 contacto(s)')",
        },
        {
          nombre: "y lo que sale es un texto, pase lo que pase",
          codigo: "esperar(informeDeAgente({}), 'el informe').esDeTipo('string')",
        },
      ],
    },
  ],
  pistas: [
    pista("`?.` corta por lo sano si lo de la izquierda no existe, y devuelve `undefined` en vez de reventar.", 0),
    pista("`??` solo salta con `null` y `undefined`. `||` salta también con `''` y con `0`, y por eso aquí te suspende dos tests.", 1),
    pista("Tres líneas: `agente?.nombre ?? 'desconocido'`, `agente?.destino?.ciudad ?? 'sin asignar'` y `agente?.contactos?.length ?? 0`. Luego los juntas con una plantilla.", 2),
  ],
  recompensa: { croquetas: 11 },
}
