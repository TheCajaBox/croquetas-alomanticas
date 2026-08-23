/**
 * Las preguntas del repaso de «alma»: el último del camino de Sel.
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-alma",
  mundo: "alma",
  quien: "gaotona",
  titulo: "El caso del alma del emperador",
  preguntas: [
    {
      pregunta: "Cinco defensas bien puestas y un agujero. ¿Por dónde se busca?",
      opciones: [
        {
          texto: "Por las costuras: lo que pasa entre una defensa y la siguiente, y lo que ninguna cubre.",
          correcta: true,
          porque:
            "Los cuatro retos de este camino que no tenían ningún error son los cuatro del mismo tipo: cada pieza bien y la unión mal. Y hay una razón estructural: las defensas se pueden centralizar y las costuras no, porque dependen de qué dato es, así que se escriben a mano en cincuenta sitios.",
        },
        {
          texto: "Repasando cada defensa con más cuidado: alguna estará mal hecha.",
          porque:
            "Es lo primero que uno hace y donde menos se encuentra. Una defensa mal hecha se delata: rompe una prueba o falla con datos normales. Lo que sobrevive años es lo que está bien hecho en el sitio equivocado, porque no falla nunca: solo no protege.",
        },
        {
          texto: "Por las dependencias, que son la mitad del código.",
          porque:
            "Es verdad y hay herramientas que lo hacen leyendo el fichero de bloqueo. Las costuras de tu propio código no las encuentra ninguna herramienta.",
        },
      ],
    },
    {
      pregunta: "¿Por qué la recuperación de contraseña es la puerta de atrás?",
      opciones: [
        {
          texto: "Porque un vale de recuperación vale más que la contraseña: la sustituye.",
          correcta: true,
          porque:
            "Quien tenga el vale no necesita saber la contraseña: pone otra. Así que es una credencial y le aplica todo: azar bueno, comparación entera, caducidad de minutos y **un solo uso**. Y todo el trabajo del primer mundo no sirve de nada si esta puerta está peor hecha.",
        },
        {
          texto: "Porque el correo no va cifrado.",
          porque:
            "Es un problema real y no es el principal: la mayoría de los agujeros de recuperación están en el propio sistema —vales que no caducan, que valen dos veces, o que se pueden adivinar— y no en el transporte.",
        },
        {
          texto: "Porque la usan pocos usuarios y se revisa menos.",
          porque:
            "Se revisa menos, cierto, y eso explica por qué está mal, no por qué importa. Importa porque cambia la contraseña.",
        },
      ],
    },
    {
      pregunta: "El sistema devuelve un vale solo si la cuenta existe. ¿Qué tiene de malo?",
      opciones: [
        {
          texto: "Que enumera usuarios: se prueban mil direcciones y las que dan vale son las que tienen cuenta.",
          correcta: true,
          porque:
            "Y no hace falta ni ver el vale: basta con que la pantalla diga «te hemos mandado un correo» en un caso y «esa cuenta no existe» en el otro. Lo correcto es contestar siempre lo mismo, y mandar el correo solo si existe. Y cuidado también con el tiempo: si un caso tarda medio segundo y el otro dos milisegundos, el reloj vuelve a contar.",
        },
        {
          texto: "Nada: no tiene sentido dar un vale a una cuenta que no existe.",
          porque:
            "No tiene sentido **mandar el correo**, y eso no se hace. Lo que no puede pasar es que la respuesta al que pregunta diga si la cuenta está.",
        },
        {
          texto: "Que gasta recursos generando vales que nadie va a usar.",
          porque:
            "Generar un código de treinta y dos caracteres no cuesta nada, y aunque costara, la comparación no es «coste contra nada»: es «coste contra regalar la lista de usuarios».",
        },
      ],
    },
    {
      pregunta: "«Añadir defensas siempre mejora la seguridad». ¿Verdad o mentira?",
      opciones: [
        {
          texto: "Mentira: cada defensa añade una costura, y las costuras son donde están los agujeros.",
          correcta: true,
          porque:
            "Una validación de más que aprueba un valor y deja que se use otro **crea** un problema donde no lo había. Lo que mejora no es el número de comprobaciones: es que el camino del dato esté claro de principio a fin. Y hay un efecto secundario: cada defensa que estorba se acaba desactivando, y ese interruptor es el agujero siguiente.",
        },
        {
          texto: "Verdad: cuantas más comprobaciones, más difícil pasar.",
          porque:
            "Es la intuición y falla justo aquí. Dos comprobaciones de permiso en dos capas sobre datos ligeramente distintos son peores que una bien puesta: hay un hueco entre ellas.",
        },
        {
          texto: "Depende de si están bien escritas.",
          porque:
            "Aunque las dos estén perfectas, la unión entre ellas es un sitio nuevo donde equivocarse. El reto ocho de este mundo es exactamente eso: una comprobación bien escrita, añadida por prudencia, que abre un agujero.",
        },
      ],
    },
    {
      pregunta: "Con la sesión sin usuario, el código coge `peticion.usuario`. ¿Qué pasa?",
      opciones: [
        {
          texto: "Que la petición decide quién eres: la identidad no tiene valor por omisión.",
          correcta: true,
          porque:
            "Un valor de repuesto es buena costumbre cuando cae en algo escrito por ti —una lista vacía de permisos, la página 1—. Cuando cae en algo que manda el cliente, es lo más permisivo posible. Si la sesión no dice quién es, no hay nadie.",
        },
        {
          texto: "Nada, porque una sesión sin usuario no puede llegar.",
          porque:
            "«No puede llegar» es una suposición sobre el resto del sistema, y las suposiciones caducan. Además, quien manda la petición decide qué manda: puede mandar la sesión que quiera con el campo que quiera.",
        },
        {
          texto: "Que falla, porque `peticion.usuario` no existe.",
          porque:
            "Cuando no existe, el código rechaza y parece que funciona. El agujero aparece justo cuando **sí** existe, con el valor que le conviene a quien lo manda.",
        },
      ],
    },
    {
      pregunta: "El límite de intentos va después del permiso. ¿Importa?",
      opciones: [
        {
          texto: "Sí: una cuenta pasada de intentos sigue distinguiendo lo que existe de lo que no, y sigue cartografiando.",
          correcta: true,
          porque:
            "El límite estaba puesto para dejar de contestar, y contesta. Y hay un segundo motivo: las comprobaciones de después cuestan —una consulta, otra consulta, un hash lento—, así que hacerlas para alguien a quien vas a rechazar es trabajo que te hacen hacer de gratis.",
        },
        {
          texto: "No: al final rechaza igual.",
          porque:
            "Rechaza con **respuestas distintas** según el caso, y eso es la filtración. Lo que corta, corta antes de todo.",
        },
        {
          texto: "Solo si el permiso es caro de comprobar.",
          porque:
            "El coste es un motivo y no el principal. Aunque comprobar el permiso fuera gratis, seguiría contestando cosas distintas mientras la cuenta está bloqueada.",
        },
      ],
    },
    {
      pregunta: "¿Cuáles son las cinco preguntas que hay que hacerse línea a línea?",
      opciones: [
        {
          texto: "De dónde sale quién es; quién ha aprobado esto que viene de fuera; si se comprueba el mismo dato que se usa; qué cuenta esto; y a dónde acaba.",
          correcta: true,
          porque:
            "Una por mundo, más o menos. Con esas cinco se encuentran los cuatro agujeros silenciosos del camino y el del acto I. Y se leen al revés de como se lee buscando errores: se empieza por lo peligroso y se sigue el dato hacia atrás.",
        },
        {
          texto: "Si está bien indentado, si se puede sacar a una función, y si hay un test.",
          porque:
            "Son las preguntas de una revisión normal y hay que hacerlas. El problema es que son cómodas de contestar y se hacen **en vez** de las otras cinco cuando hay prisa. Y la del test, en esta materia, es «¿hay un test que sea el ataque?».",
        },
        {
          texto: "Si cada una de las cinco defensas está puesta.",
          porque:
            "Eso es la lista de la compra, y las defensas de este camino estaban todas puestas en los cuatro retos que no tenían ningún error. Las preguntas van sobre el **dato**, no sobre las defensas.",
        },
      ],
    },
    {
      pregunta: "¿Qué tiene de especial un test de seguridad?",
      opciones: [
        {
          texto: "Que parte de un uso hostil y comprueba que rebota, en vez de partir de uno correcto.",
          correcta: true,
          porque:
            "Un test que comprueba que la función hace su trabajo no distingue la versión buena de la mala en **ninguno** de los doce retos de este mundo. Y algunos tienen que mirar **la forma** del código y no el resultado, porque hay agujeros que se pueden tapar de manera que el resultado no cambia.",
        },
        {
          texto: "Que hay que escribirlo después de arreglar el agujero.",
          porque:
            "Al contrario: escrito antes, demuestra que el agujero existía. Escrito después, demuestra que ya no. Los dos momentos valen y ninguno es lo que hace especial al test.",
        },
        {
          texto: "Que lo escribe alguien de seguridad y no quien programó.",
          porque:
            "Ayuda que lo mire alguien más y no es lo esencial. Quien mejor puede escribir el test hostil es quien acaba de entender el ataque, y eso suele ser quien arregla el código.",
        },
      ],
    },
    {
      pregunta: "En el acto II, ¿por qué siete de los doce tests comprueban lo de antes?",
      opciones: [
        {
          texto: "Porque un arreglo de seguridad que rompe algo se revierte, y al revertirlo vuelve el agujero.",
          correcta: true,
          porque:
            "La secuencia es siempre la misma: se tapa, se rompe un informe, se quita el arreglo «hasta que lo miremos bien», y ahí se queda. Taparlo **sin romper nada** no es un extra del reto: es la mitad del trabajo.",
        },
        {
          texto: "Por costumbre: los tests viejos se dejan.",
          porque:
            "No están dejados: están puestos en este reto porque el reto cambia una rama de una función que hace seis cosas. Comprobar las otras cinco es lo que permite tocar la sexta.",
        },
        {
          texto: "Para que el reto sea más largo.",
          porque:
            "Son la parte que enseña. Cualquiera tapa un agujero; lo difícil es taparlo y que el sistema siga haciendo lo que hacía, y eso solo se sabe si hay con qué comprobarlo.",
        },
      ],
    },
  ],
}
