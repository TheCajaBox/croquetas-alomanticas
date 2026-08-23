import { codigo, pista } from '../comun.js'

export default {
  id: "alma-08-la-comprobacion-que-sobra",
  mundo: "alma",
  entorno: "worker",
  tipo: "bug",
  titulo: "La comprobación que sobra",
  enunciado: codigo(
    "Alguien añadió una comprobación de más «por seguridad». Y esa comprobación **abre** un",
    "agujero: acepta un usuario que llega en la petición cuando la sesión no trae ninguno.",
    "",
    "Quítala, y deja el código con la regla de siempre: **la identidad sale de la sesión y solo",
    "de la sesión**.",
    "",
    "Aquí no hay ninguna norma que lo vigile, y no por descuido: una norma que prohibiera el",
    "`??` la incumpliría el código que te dan, que lo usa en `buscar`. Esto lo comprueban los",
    "tests, que es la otra manera.",
    "",
    "`verDocumento(sesion, peticion)` devuelve el documento si es de quien tiene la sesión, y",
    "`null` si no.",
  ),
  inicial: codigo(
    "// Dado. No lo toques.",
    "const DOCUMENTOS = [",
    "  { id: 1, de: 'gaotona', asunto: 'el sello imperial' },",
    "  { id: 2, de: 'frava', asunto: 'el traslado' },",
    "  { id: 3, de: 'shai', asunto: 'los cien días' },",
    "]",
    "function buscar(id) {",
    "  return DOCUMENTOS.find((cada) => cada.id === id) ?? null",
    "}",
    "",
    "// Tu parte.",
    "function verDocumento(sesion, peticion) {",
    "  if (!sesion) return null",
    "  // «Por si la sesión viene sin usuario»: y así se cuela cualquiera.",
    "  const quien = sesion.usuario ?? peticion.usuario",
    "  const documento = buscar(peticion.id)",
    "  if (!documento) return null",
    "  if (documento.de !== quien) return null",
    "  return documento",
    "}",
  ),
  solucion: codigo(
    "// Dado. No lo toques.",
    "const DOCUMENTOS = [",
    "  { id: 1, de: 'gaotona', asunto: 'el sello imperial' },",
    "  { id: 2, de: 'frava', asunto: 'el traslado' },",
    "  { id: 3, de: 'shai', asunto: 'los cien días' },",
    "]",
    "function buscar(id) {",
    "  return DOCUMENTOS.find((cada) => cada.id === id) ?? null",
    "}",
    "",
    "// Tu parte.",
    "function verDocumento(sesion, peticion) {",
    "  if (!sesion || !sesion.usuario) return null",
    "  const documento = buscar(peticion.id)",
    "  if (!documento) return null",
    "  if (documento.de !== sesion.usuario) return null",
    "  return documento",
    "}",
  ),
  requisitos: [
    { tipo: "usaPropiedad", valor: "usuario", texto: "La identidad sale de la sesión" },
  ],
  tests: [
    {
      nombre: "el dueño ve el suyo",
      codigo: codigo(
        "const suyo = verDocumento({ usuario: 'gaotona' }, { id: 1 })",
        "esperar(suyo, 'el documento').existe()",
        "esperar(suyo.asunto, 'el asunto').igualA('el sello imperial')",
      ),
    },
    {
      nombre: "y no ve el de otro",
      codigo: "esperar(verDocumento({ usuario: 'gaotona' }, { id: 2 }), 'el de Frava').igualA(null)",
    },
    {
      nombre: "el ataque: con la sesión sin usuario, la petición no decide quién eres",
      codigo: codigo(
        "esperar(verDocumento({}, { id: 1, usuario: 'gaotona' }), 'sin usuario en la sesión').igualA(null)",
        "esperar(verDocumento({ usuario: null }, { id: 2, usuario: 'frava' }), 'usuario nulo').igualA(null)",
        "esperar(verDocumento({ usuario: undefined }, { id: 3, usuario: 'shai' }), 'usuario indefinido').igualA(null)",
      ),
    },
    {
      nombre: "el ataque de recorrer los tres documentos con una sesión vacía",
      codigo: codigo(
        "for (const cada of DOCUMENTOS) {",
        "  esperar(verDocumento({}, { id: cada.id, usuario: cada.de }), 'el ' + cada.id).igualA(null)",
        "}",
      ),
    },
    {
      nombre: "sin sesión, nada",
      codigo: codigo(
        "esperar(verDocumento(null, { id: 1, usuario: 'gaotona' }), 'sin sesión').igualA(null)",
        "esperar(verDocumento(undefined, { id: 1 }), 'sin sesión').igualA(null)",
      ),
    },
    {
      nombre: "un documento que no existe tampoco revienta",
      codigo: "esperar(verDocumento({ usuario: 'gaotona' }, { id: 99 }), 'el 99').igualA(null)",
    },
    {
      nombre: "y el usuario de la petición se ignora aunque la sesión sí traiga uno",
      codigo: codigo(
        "const sesion = { usuario: 'gaotona' }",
        "esperar(verDocumento(sesion, { id: 2, usuario: 'frava' }), 'el de Frava').igualA(null)",
        "esperar(verDocumento(sesion, { id: 1, usuario: 'frava' }), 'el suyo').existe()",
      ),
    },
  ],
  variantes: [
    {
      titulo: "La comprobación que sobra · otra tanda",
      tests: [
        {
          nombre: "cada uno ve el suyo y ninguno los otros",
          codigo: codigo(
            "for (const cada of DOCUMENTOS) {",
            "  for (const otro of DOCUMENTOS) {",
            "    const visto = verDocumento({ usuario: otro.de }, { id: cada.id })",
            "    if (cada.de === otro.de) esperar(visto, 'el suyo').existe()",
            "    else esperar(visto, 'el ajeno').igualA(null)",
            "  }",
            "}",
          ),
        },
        {
          nombre: "el ataque de la cadena vacía como usuario de la sesión",
          codigo: codigo(
            "esperar(verDocumento({ usuario: '' }, { id: 1, usuario: 'gaotona' }), 'vacío').igualA(null)",
          ),
        },
        {
          nombre: "el ataque de la sesión con el usuario en otro campo, y el bueno en la petición",
          codigo: codigo(
            "// La sesión no dice quién es, y la petición sí. Con el valor de repuesto",
            "// puesto, esto entra.",
            "esperar(verDocumento({ nombre: 'gaotona' }, { id: 1, usuario: 'gaotona' }), 'en otro campo').igualA(null)",
          ),
        },
        {
          nombre: "el ataque de recorrer los tres con la sesión vacía y el dueño en la petición",
          codigo: codigo(
            "for (const cada of DOCUMENTOS) {",
            "  esperar(verDocumento({}, { id: cada.id, usuario: cada.de }), 'el ' + cada.id).igualA(null)",
            "}",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("Sobra una línea y hay que reforzar otra. Ninguna se añade.", 0),
    pista(
      "El `??` es el problema: dice «si la sesión no trae usuario, coge el que venga en la petición».",
      1,
    ),
    pista(
      "Quítalo y usa `sesion.usuario` directamente. Y añade a la primera comprobación que la sesión **tiene que traer** un usuario: si no, `undefined !== documento.de` daría `null` por casualidad, y funcionar por casualidad no es funcionar.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
