import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-07-cada-comprobacion-su-sitio",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "emparejar",
  titulo: "Cada comprobación, su sitio",
  enunciado: codigo(
    "Seis preguntas que un sistema tiene que hacerse, y seis sitios donde se contestan. Une",
    "cada una con el suyo.",
    "",
    "Las dos primeras suenan iguales y no lo son, y de confundirlas sale la mitad de este",
    "mundo.",
  ),
  parejas: [
    {
      izquierda: "¿Eres quien dices ser?",
      derecha: "Una vez, al entrar: se comprueba la contraseña y se abre una sesión. Es autenticar.",
    },
    {
      izquierda: "¿Puedes hacer esta acción?",
      derecha: "Cada vez que se hace algo, leyendo los permisos de la fuente que manda. Es autorizar.",
    },
    {
      izquierda: "¿Es tuyo **este** expediente?",
      derecha: "Cada vez, y mirando el dueño que trae el propio expediente después de leerlo de la base.",
    },
    {
      izquierda: "¿Llevas demasiados intentos fallidos?",
      derecha: "Antes de comprobar la contraseña, contando por cuenta y por origen, en una ventana de tiempo.",
    },
    {
      izquierda: "¿Le enseñamos el botón de borrar?",
      derecha: "En la pantalla, y solo para no ofrecer lo que va a fallar: es cortesía, nunca una comprobación.",
    },
    {
      izquierda: "¿Qué le contamos cuando le decimos que no?",
      derecha: "Lo mismo que le contaríamos si el recurso no existiera: nada que confirme que existe.",
    },
  ],
  pistas: [
    pista("Empieza por las dos primeras: una se hace una vez y la otra se hace cada vez.", 0),
    pista(
      "Hay dos que se hacen «cada vez» y son distintas: una pregunta por la **acción** y la otra por **la cosa concreta**. Se puede tener permiso para ver expedientes y que este no sea tuyo.",
      1,
    ),
    pista(
      "La del botón es la única que no protege nada, y está en la lista a propósito: es cortesía, y confundirla con una comprobación es el agujero más común del mundo.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
