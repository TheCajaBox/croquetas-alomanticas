/**
 * El apunte de Wax para «melaan-03-lo-repetido».
 *
 * Vive fuera del reto y se carga cuando se abre, no al arrancar el juego.
 * Los apuntes son lo más largo que hay aquí -y tienen que serlo, porque son
 * la lección- así que si viajaran en el paquete inicial cada lección nueva
 * haría más lento el arranque para todo el mundo.
 */
import { codigo } from '../retos/comun.js'

export default codigo(
    "Cuando el mismo código aparece tres veces, el problema no es que ocupe sitio. Es que",
    "**cambiarlo cuesta el triple y se olvida uno de la tercera**.",
    "",
    "Aquí hay un arreglo que hacer dentro de un mes. Con tres copias, lo haces en dos y",
    "la tercera se queda con el fallo, esperando. Con una función, lo haces una vez.",
    "",
    "El procedimiento es siempre igual:",
    "",
    "1. Pon las tres versiones una debajo de otra y mira **qué cambia** entre ellas.",
    "2. Lo que cambia se convierte en parámetros.",
    "3. Lo que no cambia se queda dentro de la función.",
    "",
    "```js",
    "// tres veces esto, con la palabra cambiada",
    "return 'Wayne, ' + 'ladrón' + ' de Elendel'",
    "",
    "// una vez esto",
    "const describir = (quien, oficio, ciudad) => `${quien}, ${oficio} de ${ciudad}`",
    "```",
    "",
    "Y el aviso que hay que dar siempre: **no toda repetición hay que quitarla**. Dos",
    "trozos que hoy se parecen pero van a cambiar por motivos distintos es mejor",
    "dejarlos separados. Juntarlos crea una función que tiene que servir para dos cosas",
    "que ya no son la misma, y esas son peores que la repetición.",
    "",
    "Aquí sí: son literalmente lo mismo.",
)
