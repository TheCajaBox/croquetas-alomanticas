/**
 * Las preguntas del repaso de «cien-dias».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-cien-dias",
  mundo: "cien-dias",
  quien: "gaotona",
  titulo: "El caso de los cien días",
  preguntas: [
    {
      pregunta: "La sesión es válida y el expediente no es suyo. ¿Qué comprobación falta?",
      opciones: [
        {
          texto: "Que **ese** expediente sea de quien tiene la sesión.",
          correcta: true,
          porque:
            "Autenticar y autorizar son dos comprobaciones, y hay una tercera que se olvida más: si **esta cosa concreta** es tuya. Se puede tener permiso para ver expedientes y que este no sea tuyo. Se llama IDOR y es el agujero más común que existe.",
        },
        {
          texto: "Que el `usuario` que viene en la dirección coincida con el de la sesión.",
          porque:
            "Eso sobra, no falta: el `usuario` de la dirección lo escribe el cliente y se cambia con una tecla. Cuando dos datos dicen lo mismo y uno viene de fuera, no se comparan: se usa el bueno y el otro se ignora.",
        },
        {
          texto: "Ninguna: si la sesión es válida, está autorizado.",
          porque:
            "Esa frase es el agujero escrito con palabras. Estar dentro de un edificio no es tener permiso para entrar en todos sus despachos.",
        },
      ],
    },
    {
      pregunta: "¿Por qué los permisos no se guardan en la sesión?",
      opciones: [
        {
          texto: "Porque quitárselos a alguien no le quita nada hasta que vuelva a entrar.",
          correcta: true,
          porque:
            "Y el caso que importa no es el descuido: es el despido, la cuenta comprometida, el permiso dado por error que hay que retirar **ya**. Con los permisos en la sesión, la respuesta es «hasta que cierre el navegador».",
        },
        {
          texto: "Porque la sesión la puede modificar el cliente.",
          porque:
            "Una sesión guardada en el servidor no la toca el cliente: solo viaja el identificador. El problema no es que se pueda falsificar; es que se queda vieja.",
        },
        {
          texto: "Porque ocuparía demasiado espacio.",
          porque:
            "Ocupa muy poco, y ese nunca ha sido el motivo. La objeción legítima es la contraria —«leerlos cada vez es una consulta»— y se responde con una caché de segundos que se pueda invalidar, no con una copia que dura toda la sesión.",
        },
      ],
    },
    {
      pregunta: "Ante una acción que la tabla de permisos no conoce, ¿qué se hace?",
      opciones: [
        {
          texto: "Denegarla.",
          correcta: true,
          porque:
            "Denegar por omisión: es la lista de permitidos aplicada a los permisos. Con la política contraria, cada acción nueva nace abierta para todos y nadie se entera hasta que se usa. Y sí, molesta: algo deja de funcionar cuando te olvidas de declararlo. Eso es lo que se quiere.",
        },
        {
          texto: "Permitirla y apuntarlo en el registro para revisarlo.",
          porque:
            "El registro se revisa cuando alguien tiene tiempo, y para entonces la acción ya se ha hecho. Apuntarlo está bien **además** de denegar, nunca en vez de.",
        },
        {
          texto: "Depende del rol: al administrador se le permite todo.",
          porque:
            "«Al administrador se le permite todo» es cómodo y es cómo se convierte una cuenta comprometida en un desastre. Un rol es una lista de permisos, no un comodín.",
        },
      ],
    },
    {
      pregunta: "El código comprueba `puedeBorrar(usuario, peticion.duenoDeclarado)` y borra `expediente.id`. ¿Qué pasa?",
      opciones: [
        {
          texto: "Que se comprueba una cosa y se hace otra: quien quiera borrar lo de otro declara que el dueño es él.",
          correcta: true,
          porque:
            "La comprobación es real y funciona; la pregunta está mal. Es la confusión de validación del mundo anterior con otra ropa: la comprobación y la acción tienen que hablar del **mismo** dato. Y el arreglo de fondo es que la función reciba el recurso completo y no un nombre suelto.",
        },
        {
          texto: "Nada, si `duenoDeclarado` se valida antes.",
          porque:
            "Se puede validar todo lo que se quiera: es un dato que manda el cliente y que dice quién es el dueño. Validarlo comprueba que tiene la forma de un nombre, no que sea verdad.",
        },
        {
          texto: "Que falla, porque `duenoDeclarado` puede no venir.",
          porque:
            "Cuando no viene, la comprobación deniega y parece que funciona. El agujero aparece justo cuando **sí** viene, con el valor que le conviene a quien lo manda.",
        },
      ],
    },
    {
      pregunta: "Un límite de intentos que se pone a cero al acertar. ¿Qué problema tiene?",
      opciones: [
        {
          texto: "Que quien tenga una contraseña buena de una cuenta puede alternar y probar sin límite.",
          correcta: true,
          porque:
            "Dos fallos, un acierto, dos fallos más. Con un contador global el límite deja de existir para cualquiera que tenga **una** cuenta. Acertar no borra el historial de fallos: los fallos caducan por tiempo, que es otra cosa.",
        },
        {
          texto: "Ninguno: si ha acertado, era él.",
          porque:
            "«Era él» es lo que hay que demostrar, no lo que se puede suponer. Y aunque fuera él en esa cuenta, el contador que se borra puede ser el de otra.",
        },
        {
          texto: "Que hace falta guardar más datos.",
          porque:
            "Guardar los instantes de los fallos en vez de un número es más datos y es lo correcto por otra razón: así los viejos dejan de contar solos y no hay que reiniciar nada.",
        },
      ],
    },
    {
      pregunta: "¿Por qué un `403` puede ser peor que un `404`?",
      opciones: [
        {
          texto: "Porque confirma que el recurso existe, y con eso se recorre el sistema entero sin entrar en nada.",
          correcta: true,
          porque:
            "Anotar qué identificadores dan 403 y cuáles 404 dibuja el mapa: cuántos hay, cuáles están usados, si una persona concreta está dada de alta. La regla es «si no puedes verlo, para ti no existe», y el `403` se reserva para cuando el que pregunta ya sabe que existe porque es suyo.",
        },
        {
          texto: "No es peor: es más honesto y ayuda al usuario.",
          porque:
            "Es más honesto y cuenta de más. La incomodidad para el usuario legítimo se compensa con una referencia de error que se pueda buscar en el registro, no contándole lo que hay al otro lado.",
        },
        {
          texto: "Porque algunos clientes tratan el 403 como un error grave.",
          porque:
            "Eso es una cuestión de interfaz. Lo que decide aquí es qué información se regala con cada código.",
        },
      ],
    },
    {
      pregunta: "¿Por qué el límite de intentos se comprueba antes de mirar la contraseña?",
      opciones: [
        {
          texto: "Porque comprobar la contraseña cuesta, y porque cualquier respuesta anterior al límite ya distingue casos.",
          correcta: true,
          porque:
            "Un hash lento es caro a propósito, así que atender mil intentos por segundo es una manera de tumbar el servidor con una lista de contraseñas. Y si el límite se mira después, una cuenta «bloqueada» sigue recibiendo respuestas distintas y sigue sondeando.",
        },
        {
          texto: "Por orden lógico: primero se cuenta y luego se comprueba.",
          porque:
            "El orden lógico admite las dos, y aquí hay dos razones concretas para este: el coste y lo que se filtra. En seguridad, el orden de las comprobaciones es parte del diseño y no una cuestión de estilo.",
        },
        {
          texto: "Para poder registrar el intento antes de saber si acierta.",
          porque:
            "El intento se registra igual en los dos órdenes. Lo que cambia es cuánto trabajo se le hace hacer al servidor y cuánta información se da.",
        },
      ],
    },
    {
      pregunta: "El botón de borrar solo se le enseña a los administradores. ¿Qué protege eso?",
      opciones: [
        {
          texto: "Nada: es cortesía. No ofrecer lo que va a fallar.",
          correcta: true,
          porque:
            "La pantalla es del usuario, y la petición que ese botón enviaba se escribe a mano en veinte segundos. La costumbre correcta es escribir las dos cosas sabiendo para qué sirve cada una: la pantalla decide qué se **ofrece**, el servidor decide qué se **hace**.",
        },
        {
          texto: "Protege de los usuarios normales, que no saben escribir peticiones.",
          porque:
            "Hoy cualquiera copia una petición desde las herramientas del navegador con dos pulsaciones. Y aunque no fuera así: una defensa que solo funciona con quien no quiere atacarte no es una defensa.",
        },
        {
          texto: "Protege mientras el JavaScript de la página no se pueda modificar.",
          porque:
            "El JavaScript de la página está en el ordenador del usuario, así que siempre se puede modificar. Ese «mientras» no llega nunca.",
        },
      ],
    },
    {
      pregunta: "¿Qué sale de la sesión y qué se busca?",
      opciones: [
        {
          texto: "De la sesión sale quién es. El rol, los permisos y el estado de la cuenta se buscan.",
          correcta: true,
          porque:
            "Es la regla del mundo entero. De la petición y de la sesión sale **quién dice ser** y nada más; todo lo demás se lee de la fuente que manda, cuando se usa. Con eso, una sesión con el rol puesto a mano no sirve de nada.",
        },
        {
          texto: "De la sesión sale todo lo que se guardó al entrar, que para eso se guardó.",
          porque:
            "Y todo lo que se guardó al entrar está viejo desde ese momento. La pregunta que hay que hacerse en cada campo es: ¿qué pasa si esto cambia mientras la sesión está abierta?",
        },
        {
          texto: "De la sesión sale quién es y qué rol tiene; el rol no cambia casi nunca.",
          porque:
            "«Casi nunca» es el problema: el día que cambia es justo el día que importa —un ascenso, un despido, una cuenta comprometida— y ese día el rol viejo sigue valiendo hasta que la persona vuelva a entrar.",
        },
      ],
    },
  ],
}
