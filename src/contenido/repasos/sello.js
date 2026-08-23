/**
 * Las preguntas del repaso de «sello».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-sello",
  mundo: "sello",
  quien: "gaotona",
  titulo: "El caso del sello",
  preguntas: [
    {
      pregunta: "¿Cuál es la diferencia entre cifrar y hashear?",
      opciones: [
        {
          texto: "Lo cifrado se puede volver a leer con la llave; el hash no vuelve.",
          correcta: true,
          porque:
            "Esa es toda la diferencia y con ella se decide qué usar: cifra lo que haya que **leer** después, hashea lo que solo haya que **comprobar**. Una contraseña solo hay que comprobarla.",
        },
        {
          texto: "Hashear es más seguro que cifrar.",
          porque:
            "No son dos niveles de lo mismo: son dos herramientas para dos problemas. Cifrar un mensaje que el destinatario tiene que leer no es «menos seguro», es lo único que sirve. Hashearlo lo dejaría ilegible para todos.",
        },
        {
          texto: "Cifrar usa una llave y hashear usa una sal, que es lo mismo con otro nombre.",
          porque:
            "La sal no es una llave. Una llave es secreta y sirve para volver; la sal se guarda a la vista y no sirve para volver: solo hace que dos cálculos iguales dejen de coincidir.",
        },
      ],
    },
    {
      pregunta: "Dos cuentas tienen la misma huella en la tabla. ¿Qué se sabe con seguridad?",
      opciones: [
        {
          texto: "Que comparten contraseña, y que a esa tabla le falta la sal.",
          correcta: true,
          porque:
            "Con sal, dos contraseñas iguales dan huellas distintas porque lo que se hashea no es la contraseña sino la sal y la contraseña juntas. Ver dos huellas iguales es ver que no hay sal, y eso es lo que permite precalcular las contraseñas comunes.",
        },
        {
          texto: "Que el hash tiene una colisión.",
          porque:
            "Existen, pero encontrar una por casualidad en una tabla de usuarios es tan improbable que no es la explicación. Cuando dos huellas coinciden, la explicación es siempre la sencilla: la misma entrada.",
        },
        {
          texto: "Nada: las huellas se repiten a menudo y no significa nada.",
          porque:
            "Significa bastante. Adivinar esa contraseña una vez abre las dos cuentas, y en una tabla grande esos grupos son por dónde empieza cualquiera que la robe.",
        },
      ],
    },
    {
      pregunta: "¿Por qué la sal se guarda en texto claro al lado de la huella?",
      opciones: [
        {
          texto: "Porque hace falta para comprobar la contraseña, y verla no le ahorra ningún cálculo al atacante.",
          correcta: true,
          porque:
            "Las dos mitades importan. Sin la sal no se puede recalcular la huella, así que **tiene** que ser legible. Y su trabajo no es esconder: es que el atacante tenga que atacar cuenta por cuenta en vez de todas a la vez.",
        },
        {
          texto: "Por comodidad; sería mejor esconderla, pero complica el código.",
          porque:
            "No es una concesión. Una sal secreta es otra cosa distinta -se llama pimienta, va aparte de la base de datos y añade otra defensa- pero la sal, como tal, es pública por diseño.",
        },
        {
          texto: "Porque la sal no protege de nada; se guarda por costumbre.",
          porque:
            "Protege de algo muy concreto: de que se puedan precalcular las contraseñas comunes una sola vez y buscarlas en toda la tabla. Con sal, ese trabajo hay que repetirlo por cada cuenta.",
        },
      ],
    },
    {
      pregunta: "Alguien envía la huella guardada en el campo de la contraseña. ¿Qué debe pasar?",
      opciones: [
        {
          texto: "Que no entre: lo que llega se vuelve a hashear siempre, sin excepciones.",
          correcta: true,
          porque:
            "La huella es lo que sale de una contraseña, no una contraseña. Aceptarla directamente convierte la tabla robada en un juego de llaves, y anula de un `if` todo el trabajo del hash lento y de la sal.",
        },
        {
          texto: "Que entre: si conoce la huella es que tiene acceso legítimo.",
          porque:
            "Conocer la huella significa exactamente una cosa: que ha visto la tabla. Y ver la tabla es justo el ataque del que nos defendemos.",
        },
        {
          texto: "Da igual, porque una huella nunca coincide con lo que se teclea.",
          porque:
            "Coincidiría si el código la compara con lo guardado antes de hashear, que es el atajo que se pone «para el inicio de sesión automático» y que se queda ahí para siempre.",
        },
      ],
    },
    {
      pregunta: "¿Qué cuenta una comparación que se para en la primera letra distinta?",
      opciones: [
        {
          texto: "Cuántas letras has acertado por delante, porque tarda más cuantas más coincidan.",
          correcta: true,
          porque:
            "Y con eso la clave se adivina letra a letra: se prueban las posibles en la primera posición, se mira cuál tardó un poco más, se fija y se sigue. De dieciséis millones de pruebas a noventa y seis.",
        },
        {
          texto: "Nada: la diferencia son nanosegundos y el ruido de la red se los come.",
          porque:
            "El ruido es aleatorio y se cancela repitiendo la medición mil veces y promediando; la diferencia es sistemática y no. Hay ataques publicados que recuperan claves así a través de una red.",
        },
        {
          texto: "La longitud de la clave guardada.",
          porque:
            "Eso lo cuenta la comprobación del largo, que es la otra fuga de la misma función. Cuando lo que se compara son huellas no importa, porque todas las huellas del mismo algoritmo miden lo mismo.",
        },
      ],
    },
    {
      pregunta: "¿Qué es lo que **no** va dentro de una sesión?",
      opciones: [
        {
          texto: "La contraseña, su huella y los permisos del usuario.",
          correcta: true,
          porque:
            "Los dos primeros porque no hacen falta después de entrar y filtrarlos es filtrar lo que protegíamos. Los permisos por otra razón: si van en la sesión, quitarle un permiso a alguien no le quita nada hasta que vuelva a entrar. Los permisos se miran cuando se usan.",
        },
        {
          texto: "La caducidad, que es cosa del navegador.",
          porque:
            "Al contrario: la caducidad que cuenta es la del servidor. Si solo caduca la cookie, quien tenga copiado el identificador sigue dentro.",
        },
        {
          texto: "El nombre del usuario, porque lo manda el cliente en cada petición.",
          porque:
            "El nombre lo guarda el servidor precisamente para no fiarse del cliente. Lo que manda el cliente es un número; de quién es ese número lo decide la tabla del servidor.",
        },
      ],
    },
    {
      pregunta: "¿Por qué dos caducidades y no una?",
      opciones: [
        {
          texto: "Porque protegen de cosas distintas: la absoluta de la sesión robada que se mantiene viva, y la de inactividad del ordenador que alguien deja abierto.",
          correcta: true,
          porque:
            "Solo con la de inactividad, el ladrón mantiene la sesión abierta indefinidamente haciendo una petición cada diez minutos. Solo con la absoluta, el ordenador olvidado sigue abierto hasta que se cumpla el plazo largo.",
        },
        {
          texto: "Por si una falla; es una defensa por duplicado.",
          porque:
            "No son la misma comprobación dos veces. Son dos comprobaciones distintas contra dos ataques distintos, y quitar cualquiera de las dos deja un ataque entero sin tapar.",
        },
        {
          texto: "Porque el navegador y el servidor cuentan el tiempo de forma distinta.",
          porque:
            "El tiempo del navegador no se usa para decidir nada: lo pone quien controle el navegador. La caducidad la comprueba el servidor con su reloj.",
        },
      ],
    },
    {
      pregunta: "El sistema tarda ochenta milisegundos con un usuario que existe y dos con uno que no. ¿Qué se filtra?",
      opciones: [
        {
          texto: "Quién está dado de alta, sin necesidad de entrar en ninguna cuenta.",
          correcta: true,
          porque:
            "Se llama enumeración de usuarios y no abre ninguna puerta, y aun así es una filtración de las serias: dice quién es cliente de una clínica o quién tiene cuenta en un sitio. Se tapa comparando contra una cuenta señuelo, para hacer el mismo trabajo siempre.",
        },
        {
          texto: "Nada relevante: sin la contraseña no se puede hacer nada con esa información.",
          porque:
            "Se puede hacer bastante: enviar correos creíbles a quien sabes que es cliente, o cruzar la lista con otra filtración. Y además dirige la fuerza bruta solo a las cuentas que existen.",
        },
        {
          texto: "La longitud de la contraseña del usuario que existe.",
          porque:
            "Eso no, porque el hash lento tarda lo mismo con cualquier longitud: la firma que hashea mide siempre igual. Lo que se filtra es la existencia de la cuenta, no lo que hay dentro.",
        },
      ],
    },
    {
      pregunta: "¿Para qué sirve subir el factor de trabajo de un hash lento?",
      opciones: [
        {
          texto: "Para que probar contraseñas siga costando lo mismo dentro de unos años, cuando las máquinas sean más rápidas.",
          correcta: true,
          porque:
            "Es un dial, y hay que moverlo. El número que hoy tarda un décimo de segundo dentro de diez años tardará una fracción de eso, y el ataque se abarata en la misma proporción. Por eso las huellas de verdad guardan el factor dentro: para poder recalcularlas al subirlo.",
        },
        {
          texto: "Para que el hash sea más difícil de deshacer.",
          porque:
            "No se deshace con ningún factor: eso no depende de las vueltas. Lo que las vueltas encarecen es **adivinar**, que es un ataque distinto.",
        },
        {
          texto: "Para que la huella sea más larga y quepa menos información dentro.",
          porque:
            "La longitud no cambia con las vueltas: una huella mide siempre lo mismo. Lo que cambia es cuánto se tarda en calcularla.",
        },
      ],
    },
  ],
}
