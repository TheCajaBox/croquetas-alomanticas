import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-05-el-permiso-se-mira-al-usarlo",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "codigo",
  titulo: "El permiso se mira al usarlo",
  enunciado: codigo(
    "`puede(sesion, accion)` decide si alguien puede hacer algo. Ahora mismo lee los permisos",
    "**de la sesión**, que se copiaron ahí cuando la persona entró.",
    "",
    "Resultado: a quien le quitas un permiso le sigue funcionando hasta que vuelva a entrar.",
    "Al despedido le funciona el botón de borrar el resto del día.",
    "",
    "Cámbialo para que los permisos se lean de `PERMISOS`, que es la fuente que manda, usando",
    "el usuario de la sesión. Y que deniegue lo que no reconozca.",
  ),
  inicial: codigo(
    "// Dado. No lo toques: esto es la fuente que manda, y cambia mientras el",
    "// programa está en marcha.",
    "const PERMISOS = {",
    "  gaotona: ['ver', 'firmar'],",
    "  frava: ['ver'],",
    "  hanshuxen: ['ver', 'firmar', 'borrar'],",
    "}",
    "",
    "function quitarPermiso(usuario, accion) {",
    "  PERMISOS[usuario] = (PERMISOS[usuario] ?? []).filter((cada) => cada !== accion)",
    "}",
    "",
    "// Tu parte.",
    "function puede(sesion, accion) {",
    "  if (!sesion) return false",
    "  return sesion.permisos.includes(accion)",
    "}",
  ),
  solucion: codigo(
    "// Dado. No lo toques: esto es la fuente que manda, y cambia mientras el",
    "// programa está en marcha.",
    "const PERMISOS = {",
    "  gaotona: ['ver', 'firmar'],",
    "  frava: ['ver'],",
    "  hanshuxen: ['ver', 'firmar', 'borrar'],",
    "}",
    "",
    "function quitarPermiso(usuario, accion) {",
    "  PERMISOS[usuario] = (PERMISOS[usuario] ?? []).filter((cada) => cada !== accion)",
    "}",
    "",
    "// Tu parte.",
    "function puede(sesion, accion) {",
    "  if (!sesion) return false",
    "  const suyos = PERMISOS[sesion.usuario] ?? []",
    "  return suyos.includes(accion)",
    "}",
  ),
  requisitos: [
    { tipo: "usaIdentificador", valor: "PERMISOS", texto: "Los permisos se leen de la fuente que manda" },
    { tipo: "prohibePropiedad", valor: "permisos", texto: "Los de la sesión no se miran: están viejos desde el momento en que se copiaron" },
  ],
  tests: [
    {
      nombre: "quien tiene el permiso, puede",
      codigo: "esperar(puede({ usuario: 'hanshuxen' }, 'borrar'), 'puede borrar').esVerdadero()",
    },
    {
      nombre: "quien no lo tiene, no",
      codigo: "esperar(puede({ usuario: 'frava' }, 'borrar'), 'puede borrar').esFalso()",
    },
    {
      nombre: "sin sesión, tampoco",
      codigo: "esperar(puede(null, 'ver'), 'puede ver').esFalso()",
    },
    {
      nombre: "el ataque: quitar un permiso surte efecto **ya**, sin volver a entrar",
      codigo: codigo(
        "const sesion = { usuario: 'hanshuxen', permisos: ['ver', 'firmar', 'borrar'] }",
        "esperar(puede(sesion, 'borrar'), 'antes').esVerdadero()",
        "quitarPermiso('hanshuxen', 'borrar')",
        "esperar(puede(sesion, 'borrar'), 'después de quitárselo').esFalso()",
      ),
    },
    {
      nombre: "el ataque de la sesión con los permisos puestos a mano",
      codigo: codigo(
        "// Una sesión manipulada no vale: los permisos no se leen de ahí.",
        "const inventada = { usuario: 'frava', permisos: ['ver', 'firmar', 'borrar'] }",
        "esperar(puede(inventada, 'borrar'), 'puede borrar').esFalso()",
        "esperar(puede(inventada, 'firmar'), 'puede firmar').esFalso()",
      ),
    },
    {
      nombre: "el ataque del usuario que no existe",
      codigo: "esperar(puede({ usuario: 'nadie' }, 'ver'), 'puede ver').esFalso()",
    },
    {
      nombre: "y una acción que nadie ha declarado se deniega",
      codigo: codigo(
        "esperar(puede({ usuario: 'hanshuxen' }, 'exportar'), 'puede exportar').esFalso()",
        "esperar(puede({ usuario: 'hanshuxen' }, ''), 'la acción vacía').esFalso()",
      ),
    },
  ],
  variantes: [
    {
      titulo: "El permiso se mira al usarlo · otra tanda",
      tests: [
        {
          nombre: "los tres permisos de Han ShuXen",
          codigo: codigo(
            "for (const cada of ['ver', 'firmar', 'borrar']) {",
            "  esperar(puede({ usuario: 'hanshuxen' }, cada), cada).esVerdadero()",
            "}",
          ),
        },
        {
          nombre: "el ataque: quitarle el de firmar a Gaotona se nota al instante",
          codigo: codigo(
            "const sesion = { usuario: 'gaotona' }",
            "esperar(puede(sesion, 'firmar'), 'antes').esVerdadero()",
            "quitarPermiso('gaotona', 'firmar')",
            "esperar(puede(sesion, 'firmar'), 'después').esFalso()",
            "esperar(puede(sesion, 'ver'), 'el otro sigue').esVerdadero()",
          ),
        },
        {
          nombre: "el ataque de quitarle todos: no queda ninguno",
          codigo: codigo(
            "quitarPermiso('frava', 'ver')",
            "esperar(puede({ usuario: 'frava' }, 'ver'), 'puede ver').esFalso()",
          ),
        },
      ],
    },
  ],
  pistas: [
    pista("La sesión sirve para una cosa: saber **quién** es. Los permisos se buscan con eso.", 0),
    pista(
      "`PERMISOS` es un objeto por usuario. Con el nombre que trae la sesión se saca su lista.",
      1,
    ),
    pista(
      "Ojo con el usuario que no está en el objeto: `PERMISOS['nadie']` es `undefined`, y llamar a `includes` sobre eso revienta. Un valor por omisión —una lista vacía— lo resuelve.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
