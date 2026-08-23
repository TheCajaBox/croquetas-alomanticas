import { codigo, pista } from '../comun.js'

export default {
  id: "cien-dias-03-seis-frases-sobre-permisos",
  mundo: "cien-dias",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre quién puede",
  enunciado: codigo(
    "Seis frases sobre autorización. Las cuatro falsas son cosas que se dicen en reuniones y",
    "que nadie discute porque suenan sensatas. Marca cada una.",
  ),
  afirmaciones: [
    {
      texto: "Autenticar y autorizar son dos comprobaciones distintas y hacen falta las dos.",
      verdadera: true,
      porque:
        "Y la segunda es la que casi nadie hace bien. Autenticar se hace una vez, al entrar; autorizar se hace **cada vez que se toca algo**, y hay que preguntar por el recurso concreto. La mayoría de las filtraciones grandes las hace alguien con cuenta pidiendo lo que no es suyo.",
    },
    {
      texto: "Si el botón no aparece en la pantalla, la acción no se puede hacer.",
      verdadera: false,
      porque:
        "La pantalla es del usuario. Esconder un botón es una decisión de interfaz, no una comprobación: la petición que ese botón enviaba se escribe a mano. Es el primer mundo otra vez, y aquí duele más, porque lo que se esconde suele ser «borrar» o «ver el de otro».",
    },
    {
      texto: "Guardar los permisos en la sesión ahorra una consulta y no tiene inconvenientes.",
      verdadera: false,
      porque:
        "Tiene uno gordo: quitarle un permiso a alguien no le quita nada hasta que vuelva a entrar. Al despedido le sigue funcionando el botón de borrar el resto del día. Los permisos se miran **cuando se usan**, contra la fuente que manda.",
    },
    {
      texto: "Un identificador imposible de adivinar hace innecesaria la comprobación de dueño.",
      verdadera: false,
      porque:
        "Un identificador difícil de adivinar es una buena idea **además** de comprobar, nunca en vez de. Los identificadores se comparten en enlaces, aparecen en registros, se envían por correo y se quedan en el historial del navegador. Confiar en que no se conozca no es una comprobación: es una esperanza.",
    },
    {
      texto: "Ante una acción que no reconoces, lo prudente es denegarla.",
      verdadera: true,
      porque:
        "Denegar por omisión, y es la misma idea que la lista de permitidos del segundo mundo aplicada a los permisos. La alternativa —permitir lo que no se reconoce— significa que cada acción nueva que alguien añada al sistema nace abierta para todos, y nadie se enterará hasta que se use.",
    },
    {
      texto: "Un mensaje de error detallado ayuda al usuario y no le cuenta nada útil a un atacante.",
      verdadera: false,
      porque:
        "«No tienes permiso para ver el expediente de Frava» y «ese expediente no existe» son dos respuestas que dicen cosas distintas: la primera confirma que existe **y de quién es**. Con eso se cartografía un sistema entero sin entrar en nada. La respuesta a algo que no te toca es la misma que a algo que no existe.",
    },
  ],
  pistas: [
    pista("Dos son verdad. Las cuatro falsas ofrecen, cada una, una manera de ahorrarse una comprobación.", 0),
    pista(
      "Dos de las falsas confían en algo que está en manos del usuario: la pantalla y un número.",
      1,
    ),
    pista(
      "La de la sesión es la más difícil de ver porque el problema no aparece hasta que alguien pierde un permiso. Piensa en qué pasa el día que despiden a alguien.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
