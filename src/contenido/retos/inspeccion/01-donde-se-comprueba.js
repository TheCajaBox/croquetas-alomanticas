import { codigo, pista } from '../comun.js'

export default {
  id: "inspeccion-01-donde-se-comprueba",
  mundo: "inspeccion",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "Dónde se comprueba",
  enunciado: codigo(
    "Un formulario pide una edad. El campo es `<input type=\"number\" min=\"18\" max=\"120\">` y",
    "además hay código en la página que comprueba el número antes de enviarlo y no deja",
    "continuar si está mal.",
    "",
    "Llega una petición al servidor con `edad = -4000`. ¿Cómo?",
  ),
  pregunta: "El navegador no dejaba enviar eso. ¿Cómo ha llegado al servidor?",
  opciones: [
    {
      texto: "Alguien ha enviado la petición sin usar el formulario.",
      correcta: true,
      porque:
        "Eso es. El formulario y su comprobación son **una cortesía para el usuario**: le avisan antes de que pierda el tiempo. Pero la petición es HTTP, y una petición HTTP la escribe cualquiera con una línea de `curl`, con las herramientas del navegador, o cambiando el HTML de la página, que está en su ordenador y es suyo. Todo lo que llega del cliente llega de un sitio que no controlas.",
    },
    {
      texto: "Un error del navegador: `type=\"number\"` a veces no valida.",
      correcta: false,
      porque:
        "No hace falta ningún error. El atributo `min` no es una cerradura: es una indicación para el navegador que decide obedecer. Y aunque todos los navegadores del mundo la obedecieran siempre, la petición no tiene que salir de un navegador.",
    },
    {
      texto: "Se ha desbordado el número al convertirlo.",
      correcta: false,
      porque:
        "Podría pasar en otros casos, y aquí no explica nada: `-4000` no es un desbordamiento de nada. Buscar la explicación complicada cuando hay una sencilla es lo que hace que estos agujeros duren años.",
    },
    {
      texto: "Alguien ha modificado el HTML de la página con las herramientas del navegador.",
      correcta: false,
      porque:
        "Se puede hacer, y es un caso particular de la respuesta buena y no el problema de fondo. Aunque el HTML fuera imposible de tocar, la petición seguiría pudiendo escribirse a mano. El problema no es que se pueda editar la página: es que **la comprobación no vive donde tiene que vivir**.",
    },
  ],
  pistas: [
    pista("La pregunta no es qué se ha roto. Es qué **no** se ha comprobado, y dónde.", 0),
    pista(
      "Piensa en dónde se ejecuta el código que comprueba la edad. ¿De quién es ese ordenador?",
      1,
    ),
    pista(
      "Lo que el servidor recibe es una petición HTTP. Nada de lo que hay en la página obliga a nadie a usar la página.",
      2,
    ),
  ],
  recompensa: { croquetas: 4 },
}
