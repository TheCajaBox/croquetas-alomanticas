import { codigo, pista } from '../comun.js'

export default {
  id: "sello-07-cada-palabra-su-sitio",
  mundo: "sello",
  entorno: "worker",
  tipo: "emparejar",
  titulo: "Cada palabra, su sitio",
  enunciado: codigo(
    "Seis palabras de este mundo y seis definiciones. Une cada una con la suya.",
    "",
    "No es vocabulario por gusto: en seguridad casi todas las discusiones absurdas salen de",
    "que dos personas usan la misma palabra para dos cosas distintas.",
  ),
  parejas: [
    {
      izquierda: "texto claro",
      derecha: "El dato tal cual se escribió, sin transformar. Es como **no** se guarda una contraseña.",
    },
    {
      izquierda: "hash",
      derecha: "Firma de un texto que va en un solo sentido: del texto sale la firma, y de la firma no vuelve el texto.",
    },
    {
      izquierda: "sal",
      derecha: "Texto distinto por cuenta que se mezcla con la contraseña antes de hashear. No es secreto; sirve para que dos huellas iguales dejen de serlo.",
    },
    {
      izquierda: "cifrar",
      derecha: "Transformar algo con una llave para poder recuperarlo después con esa misma llave. Se deshace, y para eso se hace.",
    },
    {
      izquierda: "fuerza bruta",
      derecha: "Probar candidatos uno a uno hasta acertar. Es lo único que le queda a quien roba una tabla de huellas, y lo que encarece el hash lento.",
    },
    {
      izquierda: "autenticar",
      derecha: "Comprobar que alguien es quien dice ser. Distinto de comprobar qué puede hacer, que es otra cosa y otro mundo.",
    },
  ],
  pistas: [
    pista("Empieza por las dos que se confunden entre ellas: cifrar y hashear.", 0),
    pista("La que se deshace es cifrar. El que no vuelve es el hash.", 1),
    pista(
      "«Autenticar» es quién eres. Lo que puedes hacer se llama de otra manera y llega en el cuarto mundo.",
      2,
    ),
  ],
  recompensa: { croquetas: 5 },
}
