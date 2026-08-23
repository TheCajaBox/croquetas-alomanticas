import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-04-el-permiso-de-otro",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "cazar-linea",
  titulo: "El permiso de otro",
  enunciado: codigo(
    "Este código comprueba permisos. Los comprueba de verdad, contra la lista buena, y no se",
    "fía de la pantalla.",
    "",
    "Y aun así deja borrar expedientes ajenos. **Una línea** lo explica.",
  ),
  codigoMostrado: codigo(
    "function borrarExpediente(sesion, peticion) {",
    "  if (!sesion) return { estado: 401 }",
    "  const expediente = buscar(peticion.id)",
    "  if (!expediente) return { estado: 404 }",
    "  if (!puedeBorrar(sesion.usuario, peticion.duenoDeclarado)) {",
    "    return { estado: 403 }",
    "  }",
    "  borrar(expediente.id)",
    "  return { estado: 204 }",
    "}",
  ),
  errorMostrado:
    "No hay error. El código comprueba la sesión, comprueba que el expediente existe y comprueba el permiso antes de borrar.",
  lineaCulpable: 5,
  explicaciones: {
    2: "Sin sesión, 401. La primera pregunta —«¿eres quien dices?»— resuelta.",
    3: "Busca el expediente por el id que llega. Aquí todavía no hay nada que objetar: recoger el dato no es usarlo.",
    4: "Si no existe, 404. Correcto, y de paso: fíjate en que contestar 404 a algo que existe pero no es tuyo sería **mejor** que contestar 403, y eso es el reto once.",
    5: "Aquí. El permiso se comprueba contra `peticion.duenoDeclarado`, que **lo manda el cliente**. Quien quiera borrar el expediente de Frava manda `duenoDeclarado: 'gaotona'` —él mismo— y la comprobación dice que sí, porque le está preguntando si puede borrar los suyos. El expediente que se borra dos líneas más abajo es otro. La comprobación es real, la respuesta es correcta, y la pregunta está mal: se pregunta por un dato que no es de fiar en vez de por el dueño de verdad, que está en `expediente.de` y se acaba de leer de la base.",
    8: "Borra el expediente encontrado, no el declarado. Y ese es el detalle que hace que la línea 5 sea un agujero y no solo una fealdad: se comprueba una cosa y se hace otra.",
    9: "Devuelve 204, que es «hecho, y no tengo nada que contarte». Bien elegido.",
  },
  pistas: [
    pista("La comprobación de permiso está y funciona. Mira **qué** se le pregunta.", 0),
    pista(
      "Hay dos maneras de saber de quién es el expediente: una viene en la petición y la otra está dentro del expediente que se acaba de leer.",
      1,
    ),
    pista(
      "Es la confusión del segundo mundo con otra ropa: se comprueba una cosa y se usa otra. Aquí se pide permiso sobre un dueño y se borra el expediente de otro.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
