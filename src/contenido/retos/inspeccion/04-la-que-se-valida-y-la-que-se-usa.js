import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-04-la-que-se-valida-y-la-que-se-usa",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "cazar-linea",
  titulo: "La que se valida y la que se usa",
  enunciado: codigo(
    "Este código valida bien. La expresión regular es una lista de permitidos correcta, está",
    "anclada por los dos lados y rechaza todo lo que hay que rechazar.",
    "",
    "Y no sirve de nada. **Una línea** lo anula. Encuéntrala.",
  ),
  codigoMostrado: codigo(
    "const PERMITIDO = /^[a-z0-9._-]{1,40}$/",
    "",
    "function servirArchivo(peticion) {",
    "  const pedido = peticion.nombre",
    "  const limpio = pedido.trim().toLowerCase()",
    "  if (!PERMITIDO.test(limpio)) {",
    "    return { estado: 400, cuerpo: 'nombre no válido' }",
    "  }",
    "  const contenido = leerDeDisco('/publico/' + pedido)",
    "  return { estado: 200, cuerpo: contenido }",
    "}",
  ),
  errorMostrado:
    "No hay error. La validación funciona, la expresión regular es correcta y el código pasa sus pruebas.",
  lineaCulpable: 9,
  explicaciones: {
    4: "Coge el nombre de la petición. Todavía no se ha comprobado nada, y eso está bien: aquí solo se recoge.",
    5: "Normaliza antes de comprobar: quita espacios de los lados y pasa a minúsculas. Es el orden correcto —normalizar y **después** validar— porque si se valida primero, un espacio de más puede colar algo que luego se convierte en otra cosa.",
    6: "La comprobación en sí, y está bien hecha: lista de permitidos, anclada por los dos lados, con límite de longitud.",
    9: "Aquí. Se ha validado `limpio` y se usa `pedido`, que es el original sin tocar. La validación ha aprobado un texto y el disco recibe otro. Con `pedido = '  ../SECRETO  '`, `limpio` sale como `../secreto`… que también se rechaza; pero con `pedido = 'NOTA.TXT'` y una validación que exigiera minúsculas, pasaría el original en mayúsculas. Y en cuanto la normalización haga cualquier cosa que no sea una simplificación exacta —decodificar, quitar acentos, resolver `..`— la diferencia entre las dos variables es un agujero abierto. La regla, sin excepciones: **se usa exactamente el valor que se validó**.",
    10: "Devuelve el contenido con estado 200. Nada que objetar aquí: el daño ya está hecho en la línea anterior.",
  },
  pistas: [
    pista("El código no falla. Compara con cuidado **qué** se comprueba y **qué** se usa.", 0),
    pista("Hay dos variables con el nombre del fichero. No son la misma.", 1),
    pista(
      "La validación aprueba una y el disco recibe la otra. En el momento en que la normalización cambie algo de verdad, esas dos dejan de ser equivalentes.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
