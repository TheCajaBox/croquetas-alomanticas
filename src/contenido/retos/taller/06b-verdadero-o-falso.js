import { codigo, pista } from '../comun.js'

export default {
  id: "taller-06b-verdadero-o-falso",
  mundo: "taller",
  entorno: "worker",
  tipo: "verdadero-o-falso",
  titulo: "Seis frases sobre copias y colecciones",
  enunciado: codigo(
    "Las copias que no copian y las colecciones que no son listas son los dos sitios",
    "donde más tardes se pierden en este mundo. Seis frases, todas sobre eso.",
    "",
    "Marca las seis y corrige. Se explican todas.",
  ),
  afirmaciones: [
    {
      texto: "`const lista = [1, 2]` impide añadirle elementos a la lista.",
      porque: "No. `const` protege **el nombre**, no el contenido: `lista.push(3)` funciona perfectamente. Lo que no puedes es hacer `lista = [4]`, que sería apuntar el nombre a otra lista distinta. Es la sorpresa clásica de `const`.",
    },
    {
      texto: "`{ ...original }` copia también los objetos que haya dentro del original.",
      porque: "No: copia un nivel. Las propiedades que sean objetos o listas se copian **por referencia**, así que la copia y el original siguen compartiéndolas. Se llama copia superficial, y es la causa del «pero si yo no he tocado eso» más repetido.",
    },
    {
      texto: "Un `Set` no puede tener dos elementos iguales.",
      verdadera: true,
      porque: "Esa es toda su razón de existir. Añadir algo que ya está no hace nada y no da error. Por eso quitar duplicados de una lista es `[...new Set(lista)]`, que es de los trucos más usados de JavaScript.",
    },
    {
      texto: "Un `Map` y un objeto normal sirven para lo mismo, y el `Map` solo es más moderno.",
      porque: "Hacen cosas parecidas y no son intercambiables. Un `Map` admite **cualquier cosa como clave** —un objeto, una función, un número de verdad—, recuerda el orden en que se metieron y sabe cuántos hay con `.size`. Un objeto solo admite textos y símbolos como clave. Usa objeto para datos con forma fija y `Map` para colecciones que crecen.",
    },
    {
      texto: "Dos objetos con exactamente el mismo contenido son distintos para `===`.",
      verdadera: true,
      porque: "`{ a: 1 } === { a: 1 }` es `false`. Con objetos, `===` no compara lo que hay dentro: compara si son **el mismo objeto**. Dos fichas idénticas siguen siendo dos fichas. Para comparar contenidos hay que hacerlo campo a campo, o recurrir a trucos como comparar sus `JSON.stringify`.",
    },
    {
      texto: "Pasar un objeto a una función y modificarlo dentro cambia también el de fuera.",
      verdadera: true,
      porque: "Sí, y es la mitad de los fallos de este mundo. A la función no le llega una copia: le llega el mismo objeto con otro nombre. Si no quieres eso, la función tiene que copiarlo antes de tocarlo, o mejor, devolver uno nuevo y no tocar el que le dieron.",
    },
  ],
  pistas: [
    pista("Tres de las seis van de lo mismo: qué significa de verdad tener un objeto guardado en una variable. Pista: la variable no guarda el objeto, guarda dónde está.", 0),
    pista("La de `const` es la que más gente falla. Prueba a pensar qué es exactamente lo que `const` no te deja hacer: ¿tocar la lista, o cambiar a qué lista apunta el nombre?", 1),
    pista("Las dos de colecciones: una es verdad de manual y la otra dice que dos herramientas distintas son la misma cosa, que casi nunca es verdad cuando el lenguaje se molesta en tener las dos.", 2),
  ],
  recompensa: { croquetas: 11 },
}
