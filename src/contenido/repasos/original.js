/**
 * Las preguntas del repaso de «original».
 *
 * Va en su propio fichero y se pide al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-original",
  mundo: "original",
  quien: "gaotona",
  titulo: "El caso del original",
  preguntas: [
    {
      pregunta: "El papel viene firmado y la firma cuadra. ¿Qué se sabe?",
      opciones: [
        {
          texto: "Que el contenido es el que se firmó, y que lo firmó quien tiene el secreto.",
          correcta: true,
          porque:
            "Eso, y nada más. No prueba que quien lo trae sea su dueño —un papel robado tiene la firma perfectamente correcta— ni que lo que dice dentro siga siendo verdad: un rol dentro de un papel firmado es un permiso copiado, y es el desfase del cuarto mundo con otro envoltorio.",
        },
        {
          texto: "Que el contenido está protegido y nadie lo ha leído.",
          porque:
            "El contenido de un papel firmado se lee sin ningún secreto, y eso es normal y a propósito. Firmar protege de que lo **cambien**; cifrar protege de que lo **lean**. Meter algo privado en un papel firmado es regalarlo.",
        },
        {
          texto: "Que quien lo trae es el usuario que dice el papel.",
          porque:
            "Prueba que el papel es auténtico, no que lo traiga su dueño. Contra el papel robado no hay firma que valga: hay caducidad corta, canal cifrado y poder revocar.",
        },
      ],
    },
    {
      pregunta: "¿En qué se diferencia codificar de cifrar?",
      opciones: [
        {
          texto: "Codificar es escribir los mismos bytes de otra manera y lo deshace cualquiera; cifrar necesita una llave.",
          correcta: true,
          porque:
            "base64 no protege nada: existe para que unos bytes pasen por un canal que no admite cualquiera. El problema es que un contenido codificado **parece** ilegible, y ahí es donde alguien decide que ya está protegido.",
        },
        {
          texto: "Codificar es cifrar con una llave fija conocida.",
          porque:
            "No hay ninguna llave. Y la diferencia importa: con una llave fija conocida al menos habría que saberla; aquí no hay nada que saber, solo una función que hace lo contrario.",
        },
        {
          texto: "Son lo mismo, pero codificar es más rápido.",
          porque:
            "Son cosas distintas con propósitos distintos. La pregunta que las separa en un segundo es: ¿hace falta un secreto para deshacerlo?",
        },
      ],
    },
    {
      pregunta: "El papel viene firmado. ¿Hace falta que caduque?",
      opciones: [
        {
          texto: "Sí, y más que en una sesión guardada: un papel autocontenido no se puede revocar.",
          correcta: true,
          porque:
            "Con una sesión guardada en el servidor, echar a alguien es borrar una fila. Con un papel que el servidor no guarda no hay dónde tacharlo, así que lo único que lo mata es la caducidad. De ahí salen los papeles de minutos y un papel de refresco que sí está guardado.",
        },
        {
          texto: "No: la firma ya garantiza que es válido.",
          porque:
            "La firma dice que es auténtico, no que siga valiendo. Y un papel robado es auténtico.",
        },
        {
          texto: "Solo si lleva permisos dentro.",
          porque:
            "Los permisos dentro son un problema añadido —un permiso copiado— y no el único. Aunque el papel solo lleve un nombre, robado vale para siempre si no caduca.",
        },
      ],
    },
    {
      pregunta: "¿Por qué `Math.random()` no sirve para un identificador de sesión?",
      opciones: [
        {
          texto: "Porque su serie se puede reconstruir: con unos pocos valores se deduce el estado y se calculan los siguientes.",
          correcta: true,
          porque:
            "No está mal hecha: está hecha para repartir y para poder repetir una simulación. Un atacante abre unas sesiones suyas, anota los identificadores, deduce el estado y ya sabe los que se van a repartir después. No ha roto nada: ha usado el generador para lo que era.",
        },
        {
          texto: "Porque devuelve pocos valores distintos.",
          porque:
            "Devuelve muchísimos. El problema no es cuántos, es que están en un orden que se puede calcular.",
        },
        {
          texto: "Porque es lenta.",
          porque:
            "Es de las cosas más rápidas que hay, y el criptográfico es más lento. Lo lento es el precio de lo bueno, aquí y en el hash de contraseñas.",
        },
      ],
    },
    {
      pregunta: "Un secreto se subió al repositorio y se borró en el commit siguiente. ¿Qué se hace?",
      opciones: [
        {
          texto: "Rotarlo: cambiarlo por otro.",
          correcta: true,
          porque:
            "El historial lo guarda todo, y cada clon del repositorio también. Si fue público un rato, hay rastreadores automáticos que vigilan los commits públicos justo para esto, y se mide en minutos. Reescribir el historial es opcional y no cambia que el secreto ya salió.",
        },
        {
          texto: "Reescribir el historial para que no quede rastro.",
          porque:
            "Es doloroso, rompe los clones de todo el mundo y no arregla lo esencial. Puede tener sentido **además** de rotar; nunca en vez de.",
        },
        {
          texto: "Nada, si el repositorio es privado.",
          porque:
            "Privado significa que lo lee quien tiene acceso, que es más gente de la que crees y cambia con el tiempo. Y el día que ese repositorio se abra, o se filtre, el secreto sigue dentro.",
        },
      ],
    },
    {
      pregunta: "¿Qué está mal en `sello(contenido, secreto).startsWith(firma)`?",
      opciones: [
        {
          texto: "Que acepta prefijos: una firma de un carácter cuela una de cada dieciséis veces, y la vacía siempre.",
          correcta: true,
          porque:
            "La cadena vacía es prefijo de todo, así que un papel sin firma se verifica. No hay que adivinar nada: hay que no poner nada. Y además compara con una función que sale en la primera diferencia, con lo que también se chiva por el tiempo.",
        },
        {
          texto: "Nada, si la firma tiene la longitud correcta.",
          porque:
            "«Si la firma tiene la longitud correcta» es justo lo que esa línea no comprueba. Comprobarlo es la mitad del arreglo; la otra mitad es comparar el texto entero.",
        },
        {
          texto: "Que es más lento que comparar con `===`.",
          porque:
            "La velocidad no tiene nada que ver. Y `===` tampoco vale, por otra razón: cuenta cuántas letras has acertado.",
        },
      ],
    },
    {
      pregunta: "Cambias el secreto con el que firmas. ¿Qué pasa con los papeles que hay por ahí?",
      opciones: [
        {
          texto: "Dejan de valer todos. Y eso es lo que hace falta si el secreto se filtró, y un problema si se rota por rutina.",
          correcta: true,
          porque:
            "Para poder rotar sin echar a nadie se numera el secreto: el papel dice con cuál se firmó, el servidor conoce el actual y el anterior, y al cabo de un rato retira el viejo. Ojo con la trampa: el papel puede decir **cuál de tus secretos** —que se busca en tu lista— y nunca qué algoritmo.",
        },
        {
          texto: "Siguen valiendo: la firma es del contenido, no del secreto.",
          porque:
            "El secreto entra en la cuenta. Es lo que hace que un atacante no pueda recalcular la firma aunque vea el contenido y conozca el algoritmo.",
        },
        {
          texto: "Depende de si el contenido ha cambiado.",
          porque:
            "El contenido no ha cambiado y la firma es otra igualmente. La cuarta fila del reto nueve es exactamente esto.",
        },
      ],
    },
    {
      pregunta: "¿Para qué sirve la política de contenidos?",
      opciones: [
        {
          texto: "Para que un script inyectado no se ejecute aunque llegue a la página.",
          correcta: true,
          porque:
            "Es la red de debajo, para el día que escapar falle. No sustituye a escapar y no arregla el agujero: encarece aprovecharlo. El orden es arreglar el agujero **y además** poner la red.",
        },
        {
          texto: "Para que el contenido de la página no se pueda copiar.",
          porque:
            "No tiene nada que ver con eso, y por cierto: lo que llega al navegador se puede copiar siempre.",
        },
        {
          texto: "Para sustituir el escapado, que es más trabajoso.",
          porque:
            "Una política perfecta con un XSS almacenado sigue siendo un XSS almacenado el día que la política tenga un hueco, y las de los sitios grandes tienen huecos porque tienen que dejar pasar cosas.",
        },
      ],
    },
    {
      pregunta: "¿Qué protege el campo del hash en un fichero de bloqueo?",
      opciones: [
        {
          texto: "De que el contenido de esa versión exacta cambie: si cambia, la instalación falla.",
          correcta: true,
          porque:
            "Es la única línea del fichero que puede decir «no». Los otros campos describen; este comprueba. Y lo que **no** dice es quién hizo el paquete: para eso está la procedencia firmada, que se está haciendo y todavía no es lo normal.",
        },
        {
          texto: "De que el paquete tenga agujeros de seguridad.",
          porque:
            "No protege de eso: la versión que fijaste puede tener un problema conocido, y para eso hay que leer los avisos. El hash solo dice que es la misma que era.",
        },
        {
          texto: "De que la versión suba sola al instalar.",
          porque:
            "Eso lo hace el campo de la versión exacta, que es otro. El hash es una capa más: aunque la versión sea la misma, comprueba que el contenido también.",
        },
      ],
    },
  ],
}
