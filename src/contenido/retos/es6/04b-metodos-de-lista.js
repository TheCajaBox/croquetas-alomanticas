import { codigo, pista } from '../comun.js'

export default {
  id: "es6-04b-metodos-de-lista",
  mundo: "es6",
  entorno: "worker",
  tipo: "emparejar",
  titulo: "Qué hace cada uno",
  enunciado: codigo(
    "Antes de escribirlos, conviene tenerlos claros. Las listas traen métodos de fábrica",
    "y cada uno hace una cosa muy concreta.",
    "",
    "Empareja cada uno con lo que hace.",
  ),
  parejas: [
    { izquierda: "map", derecha: "Devuelve otra lista con cada elemento transformado" },
    { izquierda: "filter", derecha: "Devuelve otra lista solo con los que cumplen algo" },
    { izquierda: "reduce", derecha: "Aplasta la lista entera en un solo valor" },
    { izquierda: "push", derecha: "Añade al final, y sí cambia la lista original" },
    { izquierda: "includes", derecha: "Dice si algo está en la lista: true o false" },
    { izquierda: "length", derecha: "Cuántos elementos hay. No es un método: es una propiedad" },
  ],
  pistas: [
    pista("Tres de ellos devuelven algo nuevo sin tocar la lista. Uno la cambia. Y dos son solo consultas.", 0),
    pista("El que aplasta todo en un valor único es el que suena a «reducir».", 1),
    pista("`map` transforma, `filter` selecciona, `reduce` aplasta, `push` añade, `includes` consulta y `length` cuenta.", 2),
  ],
  recompensa: { croquetas: 7 },
}
