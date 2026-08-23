import { codigo, pista } from '../comun.js'

export default {
  id: "fundacion-06-seis-frases-sobre-clases",
  mundo: "fundacion",
  entorno: "php",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre clases",
  enunciado: codigo(
    "Las clases traen unas cuantas reglas pequeñas que no se deducen mirando y que se pagan",
    "caras cuando se olvidan. Estas seis son las que muerden antes.",
    "",
    "Seis frases. Márcalas todas y luego lee el porqué de cada una.",
  ),
  afirmaciones: [
    {
      texto: "Asignar un objeto a otra variable copia el objeto.",
      porque:
        "Copia la manija, no el objeto: las dos variables llevan al mismo. Es lo contrario de lo que hacen los arrays, y es la diferencia práctica más importante entre los dos. Para copiar de verdad está `clone`, que además copia por encima -si el objeto lleva otros objetos dentro, esos se siguen compartiendo-.",
    },
    {
      texto: "Una clase hija puede hacer público un método que en la madre era `protected`.",
      verdadera: true,
      porque:
        "Se puede abrir, no cerrar: PHP deja subir la visibilidad y no bajarla. Tiene su lógica —quien use la madre tiene que poder usar la hija igual—, y es la primera vez que se topa uno con esa idea, que en el reto de las interfaces vuelve.",
    },
    {
      texto: "Si la hija define un constructor, el de la madre no se ejecuta solo.",
      verdadera: true,
      porque:
        "Y es la fuente número uno de objetos a medio construir. Definir un constructor en la hija sustituye el de la madre; si quieres los dos, la hija tiene que llamar a `parent::__construct(...)` a mano. Si la hija no define ninguno, se hereda el de la madre entero y no hay problema.",
    },
    {
      texto: "`$this` dentro de un método siempre se refiere al objeto sobre el que se llamó, aunque el método esté escrito en la madre.",
      verdadera: true,
      porque:
        "Es lo que hace útil heredar. Un método de la madre que llame a `$this->texto()` acabará ejecutando la versión de la hija si la hija lo ha cambiado. La madre no sabe quién hereda de ella y funciona igual.",
    },
    {
      texto: "Declarar `private string $nombre` y no rellenarlo en el constructor deja la propiedad valiendo `null`.",
      porque:
        "Con tipo declarado y sin valor por defecto, la propiedad queda **sin inicializar**, que no es lo mismo que `null`: leerla lanza un error inmediato -«must not be accessed before initialization»- en vez de darte un `null` que se cuela hacia abajo. Es de las pocas veces que PHP prefiere reventar, y hace bien.",
    },
    {
      texto: "Dos objetos de la misma clase con los mismos datos son `===` iguales.",
      porque:
        "`==` sí los da por iguales -misma clase y mismas propiedades-, pero `===` pregunta si son **el mismo objeto**, y son dos. Es la misma distinción de siempre, con una vuelta más: con objetos, `===` no compara contenido sino identidad.",
    },
  ],
  pistas: [
    pista("Dos de las seis van de lo que pasa al asignar y al comparar. Piensa en la diferencia entre «una cosa igual» y «la misma cosa».", 0),
    pista("Cuatro son ciertas y dos son falsas. Las falsas dicen que PHP hace lo cómodo, y PHP aquí hace lo estricto.", 1),
    pista("La del constructor tiene truco: depende de si la hija define uno o no. Lee la frase entera.", 2),
  ],
  recompensa: { croquetas: 7 },
}
