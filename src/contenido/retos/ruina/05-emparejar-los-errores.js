import { codigo, pista } from '../comun.js'

export default {
  id: "ruina-05-emparejar-los-errores",
  mundo: "ruina",
  entorno: "php",
  tipo: "emparejar",
  titulo: "Cada error con su causa",
  enunciado: codigo(
    "Estos seis mensajes salen en el noventa por ciento de los ratos perdidos. Saber leerlos es",
    "una habilidad aparte, y la que más tiempo ahorra de todas las de este juego.",
    "",
    "Empareja cada mensaje con lo que hay que mirar.",
  ),
  parejas: [
    {
      izquierda: "Undefined array key \"importe\"",
      derecha: "La clave no está. Léela con `??` si puede faltar, y comprueba que no sea una errata.",
    },
    {
      izquierda: "Call to a member function total() on null",
      derecha: "Lo que esperabas que fuera un objeto vale `null`. Mira de dónde sale: casi siempre una función sin `return`.",
    },
    {
      izquierda: "must not be accessed before initialization",
      derecha: "Una propiedad tipada que nadie rellenó. Mira los constructores, de la hija hacia arriba.",
    },
    {
      izquierda: "Cannot access private property",
      derecha: "Visibilidad. Si quien lo intenta es una hija, lo que hace falta es `protected`.",
    },
    {
      izquierda: "Class \"Cuadrilla\\Saco\" not found",
      derecha: "Falta el `use`, el apellido no coincide, o el autoload no se ha rehecho. En ese orden.",
    },
    {
      izquierda: "Argument #1 must be of type Contable, string given",
      derecha: "El tipo del parámetro ha parado algo en la puerta. Mira quién llama y con qué.",
    },
  ],
  explicacion: codigo(
    "Los seis tienen algo en común y merece decirlo: **el mensaje trae la respuesta dentro**.",
    "Dice la clave, la propiedad, la clase, el tipo y la línea. Casi nadie los lee más allá de",
    "la primera palabra.",
    "",
    "Y hay una diferencia entre ellos que conviene tener clara: los tres primeros son cosas que",
    "**pasan al ejecutar**, y los tres últimos son cosas que PHP comprueba **antes** o **en la",
    "puerta**. Los segundos son mejores noticias: fallan en el sitio exacto y no dejan que un",
    "dato malo viaje.",
    "",
    "Por eso vale la pena declarar tipos y visibilidades: convierten fallos silenciosos en",
    "fallos ruidosos, y un fallo ruidoso se arregla en cinco minutos.",
  ),
  pistas: [
    pista("Tres de los seis van de un dato que no está: una clave, un objeto que es `null`, y una propiedad sin rellenar.", 0),
    pista("Dos van de permisos y tipos: los que PHP para en la puerta antes de que hagas nada.", 1),
    pista("El de la clase que no se encuentra es el único que no tiene nada que ver con los datos: es de cómo están organizados los ficheros.", 2),
  ],
  recompensa: { croquetas: 7 },
}
