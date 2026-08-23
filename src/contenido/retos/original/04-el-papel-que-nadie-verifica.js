import { codigo, pista } from '../comun.js'

export default {
  id: "original-04-el-papel-que-nadie-verifica",
  mundo: "original",
  entorno: "worker",
  tipo: "cazar-linea",
  titulo: "El papel que nadie verifica",
  enunciado: codigo(
    "Este código lee un papel firmado y saca de dentro quién eres y qué rol tienes. Y lo",
    "hace bien: parte el papel, descodifica el contenido, comprueba la caducidad.",
    "",
    "Y **una línea** que no está hace que todo lo demás no sirva de nada. Señala la línea",
    "donde se usa lo que nadie ha comprobado.",
  ),
  codigoMostrado: codigo(
    "function quienEres(papel, ahora) {",
    "  const trozos = papel.split('.')",
    "  if (trozos.length !== 2) return null",
    "  const contenido = descodificar(trozos[0])",
    "  const datos = JSON.parse(contenido)",
    "  if (datos.caduca <= ahora) return null",
    "  return { usuario: datos.usuario, rol: datos.rol }",
    "}",
  ),
  errorMostrado:
    "No hay error. La función parte el papel, descodifica el contenido, comprueba la caducidad y devuelve quién eres.",
  lineaCulpable: 7,
  explicaciones: {
    2: "Parte el papel en dos por el punto. Recoger los trozos no es fiarse de ellos.",
    3: "Comprueba que hay exactamente dos trozos: contenido y firma. Bien, y fíjate en que el segundo trozo —la firma— no se vuelve a mirar en toda la función.",
    4: "Descodifica el contenido. Ojo con lo que **no** es esto: descodificar no es descifrar ni verificar. Es escribir los mismos bytes de otra manera, y lo hace cualquiera sin ningún secreto.",
    5: "Convierte el texto en un objeto. Y aquí conviene saber que `JSON.parse` de un texto que llega de fuera puede lanzar: sin un `try`, un papel con basura dentro tira la función.",
    6: "Comprueba la caducidad, y la comprueba bien. Lo que pasa es que la caducidad la escribe quien haya escrito el papel: si nadie verifica la firma, ese número lo pone el atacante.",
    7: "Aquí. Se devuelven el usuario y el rol de un papel **cuya firma no ha comprobado nadie**. La firma está en `trozos[1]` y no se ha vuelto a mirar. Con eso, cualquiera se fabrica su propio papel —`{\"usuario\":\"yo\",\"rol\":\"general\",\"caduca\":9999999}`, codificado, un punto, y cualquier cosa detrás— y entra como general. Todo lo que hace esta función está bien hecho y da igual: el papel no es el original y nadie lo ha comparado con nada.",
  },
  pistas: [
    pista("Cuenta cuántas veces se usa cada uno de los dos trozos del papel.", 0),
    pista(
      "El segundo trozo se cuenta en la línea 3 y no se vuelve a mirar. ¿Qué era el segundo trozo?",
      1,
    ),
    pista(
      "Descodificar no es verificar. Se puede leer el contenido de un papel firmado sin tener ningún secreto: eso es normal y es a propósito. Lo que hace falta es **comparar la firma** antes de creerse lo que hay dentro.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
