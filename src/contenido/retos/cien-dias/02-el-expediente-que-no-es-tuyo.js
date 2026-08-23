import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-02-el-expediente-que-no-es-tuyo",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "codigo",
  titulo: "El expediente que no es tuyo",
  enunciado: codigo(
    "`verExpediente(sesion, id)` devuelve el expediente pedido, o `null` si no se puede.",
    "Ahora mismo comprueba que haya sesión y nada más, así que cualquiera con cuenta puede",
    "leer los expedientes de todo el mundo cambiando un número.",
    "",
    "Arréglalo. Se puede ver un expediente si **es tuyo**, y punto. Y el usuario sale de la",
    "sesión, no de lo que llegue en la petición.",
    "",
    "`EXPEDIENTES` está dado y cada uno trae su `de`, que es el usuario dueño.",
  ),
  inicial: codigo(
    "// Dado. No lo toques.",
    "const EXPEDIENTES = [",
    "  { id: 410, de: 'gaotona', asunto: 'nombramiento de Shai' },",
    "  { id: 411, de: 'gaotona', asunto: 'permiso de obra' },",
    "  { id: 412, de: 'frava', asunto: 'traslado de la guardia' },",
    "  { id: 413, de: 'hanshuxen', asunto: 'plano de la muralla norte' },",
    "]",
    "",
    "function buscarExpediente(id) {",
    "  return EXPEDIENTES.find((cada) => cada.id === id) ?? null",
    "}",
    "",
    "// Tu parte.",
    "function verExpediente(sesion, id) {",
    "  if (!sesion) return null",
    "  return buscarExpediente(id)",
    "}",
  ),
  solucion: codigo(
    "// Dado. No lo toques.",
    "const EXPEDIENTES = [",
    "  { id: 410, de: 'gaotona', asunto: 'nombramiento de Shai' },",
    "  { id: 411, de: 'gaotona', asunto: 'permiso de obra' },",
    "  { id: 412, de: 'frava', asunto: 'traslado de la guardia' },",
    "  { id: 413, de: 'hanshuxen', asunto: 'plano de la muralla norte' },",
    "]",
    "",
    "function buscarExpediente(id) {",
    "  return EXPEDIENTES.find((cada) => cada.id === id) ?? null",
    "}",
    "",
    "// Tu parte.",
    "function verExpediente(sesion, id) {",
    "  if (!sesion) return null",
    "  const expediente = buscarExpediente(id)",
    "  if (!expediente) return null",
    "  if (expediente.de !== sesion.usuario) return null",
    "  return expediente",
    "}",
  ),
  requisitos: [
    { tipo: "usaPropiedad", valor: "usuario", texto: "Quién eres sale de la sesión" },
    { tipo: "usaLlamada", valor: "buscarExpediente", texto: "El expediente se busca por su id" },
  ],
  tests: [
    {
      nombre: "el dueño ve el suyo",
      codigo: codigo(
        "const suyo = verExpediente({ usuario: 'gaotona' }, 410)",
        "esperar(suyo, 'el expediente').existe()",
        "esperar(suyo.asunto, 'el asunto').igualA('nombramiento de Shai')",
      ),
    },
    {
      nombre: "y los dos suyos, que tiene dos",
      codigo: codigo(
        "esperar(verExpediente({ usuario: 'gaotona' }, 411), 'el 411').existe()",
      ),
    },
    {
      nombre: "el ataque: con sesión válida, el de otro no se ve",
      codigo: "esperar(verExpediente({ usuario: 'gaotona' }, 412), 'el de Frava').igualA(null)",
    },
    {
      nombre: "ni el de un tercero",
      codigo: "esperar(verExpediente({ usuario: 'frava' }, 413), 'el de Han ShuXen').igualA(null)",
    },
    {
      nombre: "sin sesión no se ve nada",
      codigo: "esperar(verExpediente(null, 410), 'sin sesión').igualA(null)",
    },
    {
      nombre: "un expediente que no existe tampoco revienta",
      codigo: "esperar(verExpediente({ usuario: 'gaotona' }, 999), 'el 999').igualA(null)",
    },
    {
      nombre: "el ataque de mandar el usuario en la petición: la sesión es la que manda",
      codigo: codigo(
        "// Aunque la petición traiga a quién quiere hacerse pasar, se usa la sesión.",
        "const sesion = { usuario: 'gaotona', peticion: { usuario: 'frava' } }",
        "esperar(verExpediente(sesion, 412), 'el de Frava').igualA(null)",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El expediente que no es tuyo · otra tanda",
      tests: [
        {
          nombre: "Han ShuXen ve el suyo",
          codigo: "esperar(verExpediente({ usuario: 'hanshuxen' }, 413).asunto, 'el asunto').igualA('plano de la muralla norte')",
        },
        {
          nombre: "el ataque: y no ve ninguno de los otros tres",
          codigo: codigo(
            "for (const id of [410, 411, 412]) {",
            "  esperar(verExpediente({ usuario: 'hanshuxen' }, id), 'el ' + id).igualA(null)",
            "}",
          ),
        },
        {
          nombre: "el ataque del usuario que no existe: no ve nada",
          codigo: codigo(
            "for (const id of [410, 411, 412, 413]) {",
            "  esperar(verExpediente({ usuario: 'nadie' }, id), 'el ' + id).igualA(null)",
            "}",
          ),
        },
        {
          nombre: "el ataque de la sesión sin usuario",
          codigo: "esperar(verExpediente({}, 410), 'sesión sin usuario').igualA(null)",
        },
      ],
    },
  ],
  pistas: [
    pista("Hay dos preguntas: si hay sesión —ya está— y si el expediente es de quien la tiene.", 0),
    pista(
      "Necesitas el expediente antes de poder mirar de quién es. Así que primero búscalo, y luego decide.",
      1,
    ),
    pista(
      "Tres comprobaciones seguidas, cada una devolviendo `null`: sin sesión, sin expediente, y con dueño distinto. Y el dueño se compara con el usuario **de la sesión**.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
