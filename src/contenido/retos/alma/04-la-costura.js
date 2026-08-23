import { codigo, pista } from '../comun.js'

export default {
  id: "alma-04-la-costura",
  mundo: "alma",
  entorno: "worker",
  tipo: "cazar-linea",
  titulo: "La costura",
  enunciado: codigo(
    "Este código tiene las cinco defensas del camino. Todas. Y una de ellas está en el sitio",
    "equivocado, así que las otras cuatro no sirven.",
    "",
    "Señala la línea.",
  ),
  codigoMostrado: codigo(
    "function firmarDocumento(peticion, ahora) {",
    "  const sesion = abrirPapel(peticion.papel, ahora)",
    "  if (!sesion) return { estado: 401 }",
    "  const documento = buscarDocumento(peticion.id)",
    "  if (!documento) return NO_ENCONTRADO",
    "  if (documento.de !== sesion.usuario) return NO_ENCONTRADO",
    "  const texto = normalizar(peticion.texto)",
    "  if (!TEXTO_PERMITIDO.test(texto)) return { estado: 400 }",
    "  base.ejecutar('UPDATE documentos SET nota = :nota WHERE id = :id', {",
    "    nota: peticion.texto,",
    "    id: documento.id,",
    "  })",
    "  return { estado: 200 }",
    "}",
  ),
  errorMostrado:
    "No hay error. La función verifica el papel, comprueba el dueño, valida el texto y escribe con la consulta parametrizada.",
  lineaCulpable: 10,
  explicaciones: {
    2: "Abre el papel firmado, que es una sola función y devuelve la sesión solo si la firma cuadra. Así se hace: si hubiera una de descodificar y otra de verificar, alguien llamaría a la primera.",
    4: "Busca el documento por el id que llega. Recoger el dato no es fiarse de él.",
    6: "Comprueba que el documento es de quien tiene la sesión, y compara con `sesion.usuario` —que sale del papel verificado— y no con nada de la petición. Correcto.",
    7: "Normaliza el texto antes de validarlo. El orden es el bueno: normalizar y después comprobar.",
    8: "Valida el texto normalizado con una lista de lo permitido, anclada. La validación está bien hecha.",
    10: "Aquí. Se validó `texto` —el normalizado— y se guarda `peticion.texto`, que es el original. La consulta está parametrizada, así que no hay inyección; lo que hay es un dato que **nadie ha aprobado** metiéndose en la base. Y de ahí sale a una página algún día. Es la confusión de validación de La inspección, en un código que hace todo lo demás bien: la validación aprueba un valor y el sistema usa otro.",
    11: "El id sale del documento que se leyó, no de la petición. Bien: es el mismo cuidado que la línea 6, y aquí sí está.",
  },
  pistas: [
    pista("Las cinco defensas están. Busca dos variables que se parezcan y que no sean la misma.", 0),
    pista(
      "Compara la línea 7 con la 10. Y fíjate en que la 11 hace lo contrario que la 10, bien.",
      1,
    ),
    pista(
      "La consulta está parametrizada, así que no hay inyección. Lo que se guarda es un texto que la validación no ha visto.",
      2,
    ),
  ],
  recompensa: { croquetas: 7 },
}
