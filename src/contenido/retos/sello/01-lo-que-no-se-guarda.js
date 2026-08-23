import { codigo, pista } from '../comun.js'

export default {
  id: "sello-01-lo-que-no-se-guarda",
  mundo: "sello",
  entorno: "worker",
  tipo: "eleccion",
  titulo: "Lo que no se guarda",
  enunciado: codigo(
    "Una tienda guarda las cuentas de sus clientes para que puedan volver a entrar. Alguien",
    "roba la tabla entera: se la lleva completa, con todas las filas.",
    "",
    "De estas cuatro formas de haber guardado las contraseñas, **una sola** deja al ladrón sin",
    "poder entrar en ninguna cuenta. ¿Cuál?",
  ),
  pregunta: "El ladrón tiene la tabla entera. ¿Cuál de estas cuatro no le sirve de nada?",
  opciones: [
    {
      texto: "La contraseña tal cual: `abeja14`",
      correcta: false,
      porque:
        "Esto se llama **texto claro** y es lo peor posible: el ladrón no tiene que hacer nada. Ya está dentro de todas las cuentas, y de las cuentas que esa gente tenga en otros sitios con la misma contraseña.",
    },
    {
      texto: "La contraseña al revés: `41ajeba`",
      correcta: false,
      porque:
        "Darle la vuelta se **deshace** dándole la vuelta otra vez. Cualquier cosa que se pueda deshacer no protege nada: solo obliga al ladrón a escribir una línea más.",
    },
    {
      texto: "La contraseña cifrada con una clave que está en el mismo servidor",
      correcta: false,
      porque:
        "Cifrar sirve para lo que hay que **recuperar** después. Y aquí hay un problema de fondo: si el servidor puede descifrarla, quien se lleve el servidor también. Guardar la llave al lado de la caja es no tener llave.",
    },
    {
      texto: "El **hash** de la contraseña con un hash lento: `9f2c…` (60 caracteres)",
      correcta: true,
      porque:
        "Un hash va en un solo sentido: de la contraseña sale el hash, y del hash no sale la contraseña. Lo único que puede hacer el ladrón es **probar** contraseñas una a una y ver si le sale ese hash, y para eso está la parte de «lento»: si cada prueba cuesta un décimo de segundo, probar mil millones cuesta tres años.",
    },
  ],
  pistas: [
    pista("La pregunta de verdad es: ¿cuál de las cuatro **no se puede deshacer**?", 0),
    pista(
      "Tres de las cuatro se pueden deshacer con lo que el ladrón ya tiene en las manos. Una no.",
      1,
    ),
    pista(
      "Cifrar y hashear no son lo mismo. Lo cifrado se descifra —para eso se cifra—; el hash no vuelve, y esa es toda la diferencia.",
      2,
    ),
  ],
  recompensa: { croquetas: 4 },
}
