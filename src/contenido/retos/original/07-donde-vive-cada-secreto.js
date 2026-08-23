import { codigo, pista } from '../comun.js'

export default {
  id: "original-07-donde-vive-cada-secreto",
  mundo: "original",
  entorno: "worker",
  tipo: "emparejar",
  titulo: "Dónde vive cada secreto",
  enunciado: codigo(
    "Seis cosas que un programa necesita saber, y seis sitios donde ponerlas. Une cada una con",
    "el suyo.",
    "",
    "La pregunta que decide en cada caso es la misma: **¿quién puede leer esto?**",
  ),
  parejas: [
    {
      izquierda: "La clave con la que se firman los papeles",
      derecha: "Fuera del repositorio: en una variable de entorno o en un gestor de secretos, y distinta en cada entorno.",
    },
    {
      izquierda: "La dirección de la base de datos",
      derecha: "También fuera, aunque no parezca un secreto: dice qué hay y dónde, y cambia entre desarrollo y producción.",
    },
    {
      izquierda: "La clave de una API que se usa **desde el navegador**",
      derecha: "En ninguna parte que valga: todo lo que llega al navegador es público. Se hace una llamada desde el servidor, que sí puede guardar la clave.",
    },
    {
      izquierda: "El número de vueltas del hash de contraseñas",
      derecha: "En el código, y a la vista: no es un secreto, es una decisión que conviene poder leer y discutir.",
    },
    {
      izquierda: "La lista de dominios de correo admitidos",
      derecha: "En el código o en la base de datos, según cada cuánto cambie. No es secreta y sí es una regla del negocio.",
    },
    {
      izquierda: "Un secreto que ya se subió al repositorio por error",
      derecha: "Rotado: se cambia por otro. Borrarlo del código no lo borra del historial ni de las copias que haya por ahí.",
    },
  ],
  pistas: [
    pista("Dos de los seis no son secretos, aunque estén en la lista. Empieza por descartarlos.", 0),
    pista(
      "El de la clave de API desde el navegador es el que engaña: la respuesta no es un sitio, es que no hay sitio.",
      1,
    ),
    pista(
      "El del secreto ya subido no habla de dónde ponerlo: habla de qué hacer cuando ya es tarde. Y la respuesta no es borrarlo.",
      2,
    ),
  ],
  recompensa: { croquetas: 6 },
}
