import { codigo, pista } from '../comun.js'

export default {
  id: "alma-06-que-contesta-el-sistema",
  mundo: "alma",
  entorno: "worker",
  tipo: "prediccion",
  titulo: "Qué contesta el sistema",
  enunciado: codigo(
    "Un sistema que contesta a cuatro peticiones. Di **exactamente** qué escribe: cuatro",
    "líneas, cada una con el número del estado.",
    "",
    "`shai` tiene sesión y no tiene permiso para borrar. El documento 1 es de `gaotona`; el 9",
    "no existe.",
  ),
  codigoMostrado: codigo(
    "const PERMISOS = { shai: ['ver'], gaotona: ['ver', 'borrar'] }",
    "const DOCUMENTOS = [{ id: 1, de: 'gaotona' }]",
    "",
    "const puede = (quien, accion) => (PERMISOS[quien] ?? []).includes(accion)",
    "const buscar = (id) => DOCUMENTOS.find((d) => d.id === id) ?? null",
    "",
    "function atender(sesion, accion, id) {",
    "  if (!sesion) return 401",
    "  if (!puede(sesion.usuario, accion)) return 404",
    "  const doc = buscar(id)",
    "  if (!doc) return 404",
    "  if (doc.de !== sesion.usuario) return 404",
    "  return 200",
    "}",
    "",
    "console.log(atender({ usuario: 'gaotona' }, 'borrar', 1))",
    "console.log(atender({ usuario: 'shai' }, 'borrar', 1))",
    "console.log(atender({ usuario: 'shai' }, 'ver', 1))",
    "console.log(atender({ usuario: 'gaotona' }, 'ver', 9))",
  ),
  respuestaEsperada: codigo("200", "404", "404", "404"),
  tests: [
    {
      nombre: "la salida real es la que había que predecir",
      codigo: codigo(
        "esperar(consola.map((linea) => linea.texto).join(String.fromCharCode(10)))",
        "  .diceLoMismoQue('200\\n404\\n404\\n404')",
      ),
    },
  ],
  pistas: [
    pista("Solo la primera es un 200. Las otras tres son el mismo número, y eso es a propósito.", 0),
    pista(
      "Las tres últimas fallan por tres motivos distintos: falta de permiso, el documento no es suyo, y el documento no existe. Y las tres contestan lo mismo.",
      1,
    ),
    pista(
      "Esa es la propiedad que hay que ver: **desde fuera no se distingue** por qué te han dicho no. Si el segundo caso contestara 403, `shai` sabría que el documento 1 existe.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
