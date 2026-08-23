import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-01-soy-el-usuario-siete",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "«Soy el usuario siete»",
  enunciado: codigo(
    "Un sistema de expedientes. La petición para ver uno llega así:",
    "",
    "```",
    "GET /expediente/412?usuario=7",
    "Cookie: sesion=9f2c4a71…",
    "```",
    "",
    "Y el servidor hace esto:",
    "",
    "```js",
    "if (!sesionValida(peticion.cookie)) return 401",
    "return leerExpediente(peticion.query.expediente)",
    "```",
    "",
    "El expediente 412 es de otra persona. ¿Qué falta?",
  ),
  pregunta: "La sesión es válida y el expediente no es suyo. ¿Qué comprobación falta?",
  opciones: [
    {
      texto: "Que **ese** expediente sea de **quien** tiene la sesión.",
      correcta: true,
      porque:
        "Autenticar y autorizar son dos comprobaciones distintas. La primera —«¿eres quien dices?»— la hace `sesionValida` y la hace bien. La segunda —«¿puedes ver **esto**?»— no la hace nadie, y es la que decide. Se llama IDOR: referencia directa a un objeto sin comprobar de quién es, y es el agujero más común que hay en aplicaciones reales.",
    },
    {
      texto: "Comprobar que el `usuario=7` de la dirección coincide con el de la sesión.",
      correcta: false,
      porque:
        "Eso sobra, no falta. El `usuario=7` de la dirección **no prueba nada**: lo escribe el cliente y se cambia a `usuario=8` con una letra. Comparar dos cosas que manda el cliente con una que sí es de fiar es una comprobación que se puede saltar; lo correcto es no mirar ese parámetro nunca y sacar la identidad de la sesión.",
    },
    {
      texto: "Usar identificadores imposibles de adivinar en vez de números seguidos.",
      correcta: false,
      porque:
        "Ayuda y no arregla nada. Un identificador largo y aleatorio hace más difícil **encontrar** un expediente ajeno, y sigue dejando verlo a quien tenga el número: se comparte un enlace, aparece en un registro, se ve en un correo. Confiar en que un identificador no se conozca es seguridad por oscuridad, y no es una comprobación.",
    },
    {
      texto: "Nada: si la sesión es válida, la persona está autorizada.",
      correcta: false,
      porque:
        "Esa frase es exactamente el agujero, escrita con palabras. Estar dentro de un edificio no es tener permiso para entrar en todos sus despachos, y la mayoría de las filtraciones grandes no las hace un desconocido: las hace alguien con cuenta pidiendo lo que no es suyo.",
    },
  ],
  pistas: [
    pista("Hay dos preguntas que hay que hacer en cada petición, y el código solo hace una.", 0),
    pista(
      "«¿Eres quien dices?» está resuelto. Escribe la otra pregunta con tus palabras.",
      1,
    ),
    pista(
      "Fíjate en que el número del expediente sale de la petición y no se compara con nada. Cambiar un 412 por un 413 cuesta una tecla.",
      2,
    ),
  ],
  recompensa: { croquetas: 4 },
}
