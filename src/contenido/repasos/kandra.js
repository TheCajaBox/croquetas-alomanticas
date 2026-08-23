/**
 * Las preguntas del repaso de «kandra».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
  id: "repaso-kandra",
  mundo: "kandra",
  quien: "brisa",
  titulo: "El caso del kandra",
  preguntas: [
    {
      pregunta: "¿Qué es lo primero que hay que hacer antes de tocar un refactor?",
      opciones: [
        {
          texto: "Ejecutar los tests y comprobar que están en verde.",
          correcta: true,
          porque: "Si no lo compruebas antes, cuando algo se ponga rojo no sabrás si lo has roto tú o ya estaba roto. Y todo el método de este mundo se apoya en eso: un refactor grande son diez pequeños con los tests en verde entre uno y otro.",
        },
        {
          texto: "Leer el código entero y planear los siete cambios de golpe.",
          porque: "Leerlo, sí. Hacer los siete de golpe es la tentación y es cómo se acaba tirando el trabajo: algo se rompe, no se sabe cuál de los siete ha sido, y no hay a dónde volver.",
        },
        {
          texto: "Hacer una copia del fichero por si acaso.",
          porque: "Para eso está el control de versiones. Y la copia no dice si lo has roto: los tests sí.",
        },
      ],
    },
    {
      pregunta: "Tres funciones idénticas salvo un número. ¿Cuándo NO conviene juntarlas?",
      opciones: [
        {
          texto: "Cuando no van a cambiar juntas: si una regla puede cambiar sin las otras, se parecen por casualidad.",
          correcta: true,
          porque: "La regla que casi todo el mundo recuerda mal: el problema no es la duplicación de código, es la duplicación de conocimiento. Dos trozos que dicen la misma regla se juntan; dos que se parecen por casualidad se quedan, porque separarlos después es más caro que juntarlos.",
        },
        {
          texto: "Cuando son menos de cinco: por debajo de cinco copias no compensa.",
          porque: "No hay un número. Dos copias de la misma regla ya son un problema, y diez que se parecen por casualidad no lo son.",
        },
        {
          texto: "Nunca: la duplicación siempre se elimina.",
          porque: "Esa costumbre lleva a abstracciones que unen cosas que no tenían nada que ver, y a un parámetro nuevo cada vez que una de las dos cambia. Se llama la abstracción prematura y cuesta más que copiar.",
        },
      ],
    },
    {
      pregunta: "Al convertir cuatro `if` anidados en cláusulas de guarda, ¿qué hay que respetar?",
      opciones: [
        {
          texto: "El orden: la primera guarda que se cumple manda, así que tiene que ser el mismo orden que tenía la escalera.",
          correcta: true,
          porque: "Es el único sitio donde este refactor se puede hacer mal sin darse cuenta. Con datos que fallen dos comprobaciones a la vez, cambiar el orden cambia la respuesta. La forma de no equivocarse: recorrer la escalera de fuera hacia dentro.",
        },
        {
          texto: "Que quede un solo `return` por función.",
          porque: "Es una costumbre antigua que venía de lenguajes donde había que liberar memoria a mano. Con guardas, varios `return` cortos se leen mejor que una variable que se va reasignando hasta el final.",
        },
        {
          texto: "Que las condiciones se escriban igual que estaban, sin negarlas.",
          porque: "Al contrario: cada guarda comprueba lo contrario de lo que comprobaba su `if`, porque ahora sale en vez de entrar.",
        },
      ],
    },
    {
      pregunta: "¿Qué tiene `match` que no tenga `switch`?",
      opciones: [
        {
          texto: "Compara con `===`, devuelve un valor y se queja si ningún caso encaja.",
          correcta: true,
          porque: "Las tres cosas importan. Comparar con `==` da sorpresas -`switch (1)` entra en el caso `'1'`-; no devolver valor obliga a una variable temporal; y caerse de un caso al siguiente por olvidar un `break` es uno de los errores más antiguos del oficio. `match` no tiene ninguno de los tres.",
        },
        {
          texto: "Que admite varias líneas de código por caso.",
          porque: "Es justo al revés: `match` solo admite expresiones. Cuando un caso necesita varias líneas, lo que suele hacer falta es una función con nombre.",
        },
        {
          texto: "Que es más rápido.",
          porque: "La diferencia es inapreciable. Esto se elige por corrección y por cómo se lee, no por velocidad.",
        },
      ],
    },
    {
      pregunta: "Un `foreach` que va llenando una lista con `$salida[] = $x` solo cuando se cumple un `if`. ¿En qué se convierte?",
      opciones: [
        {
          texto: "En un `array_filter`, y con `array_values` alrededor si el resultado se va a leer por posición.",
          correcta: true,
          porque: "El `array_values` es el detalle que se escapa: el `foreach` iba poniendo las posiciones 0, 1, 2, y `array_filter` conserva las originales. Sin él, el resultado tiene huecos en las claves y no es lo que había antes.",
        },
        {
          texto: "En un `array_map` con un `if` dentro de la función.",
          porque: "`array_map` devuelve tantos elementos como entran, siempre. Un `if` dentro solo puede cambiar el valor, no quitarlo.",
        },
        {
          texto: "En un `array_reduce` que va concatenando.",
          porque: "Se puede hacer y sale más largo y menos claro. `array_reduce` es para cuando el resultado es un solo valor.",
        },
      ],
    },
    {
      pregunta: "¿Cómo se reconoce que un parámetro booleano esconde dos funciones?",
      opciones: [
        {
          texto: "Porque el mismo `if ($ese)` aparece dos o más veces en el cuerpo: los dos caminos casi no comparten nada.",
          correcta: true,
          porque: "Esa es la señal. Un booleano que solo cambia una línea es un ajuste y se queda -en el reto, `$enMayusculas`-. Uno que parte el cuerpo en dos es un nombre de función esperando a existir.",
        },
        {
          texto: "Todos los booleanos esconden dos funciones: hay que partir siempre.",
          porque: "No. La pregunta es si las dos versiones comparten casi todo o casi nada. Si comparten casi todo, partir duplica código para nada.",
        },
        {
          texto: "Porque los booleanos hacen la función más lenta.",
          porque: "No es un problema de velocidad: es que `enviar($x, true, false)` no se puede leer sin ir a la firma y volver.",
        },
      ],
    },
    {
      pregunta: "Un carro y un almacén con el mismo método copiado. ¿Por qué no una clase madre común?",
      opciones: [
        {
          texto: "Porque un carro no es un tipo de almacén ni al revés: sería un parentesco inventado para compartir tres líneas.",
          correcta: true,
          porque: "Y el precio se paga después: el día que el carro necesite algo que el almacén no, hay que decidir si va en la madre -y el almacén carga con ello- o en el hijo -y la madre deja de significar nada-. Para compartir código sin parentesco están los rasgos.",
        },
        {
          texto: "Porque PHP no permite heredar de una clase que no sea abstracta.",
          porque: "Sí permite. La razón no es técnica, es de diseño: heredar dice «esto es como aquello», y aquí no lo es.",
        },
        {
          texto: "Porque un rasgo es más rápido que heredar.",
          porque: "Un rasgo es literalmente copiar y pegar que hace el lenguaje: en tiempo de ejecución no hay diferencia. Se elige por lo que significa.",
        },
      ],
    },
    {
      pregunta: "¿Qué comentario merece quedarse?",
      opciones: [
        {
          texto: "El que explica **por qué** se hizo así y no de la manera obvia.",
          correcta: true,
          porque: "El código dice qué se hace; eso no se puede deducir de ninguna manera, porque vive fuera del programa: en una ley, en una conversación, en una decisión que se tomó un martes. Los que repiten el código se desactualizan solos y entonces mandan al que los lee en dirección contraria.",
        },
        {
          texto: "El que explica qué hace una línea complicada.",
          porque: "Ahí lo que sobra es la línea, no el comentario. Si hace falta explicar `$t = $b * 5`, lo que hacía falta era llamarle `$kilos` y sacar el 5 a una constante: entonces la explicación es el código y no se puede desactualizar.",
        },
        {
          texto: "El que dice el nombre de la clase encima de la clase.",
          porque: "Ese es el ejemplo de libro del que sobra: repite lo que hay debajo y no añade nada. Se borra sin perder información.",
        },
      ],
    },
    {
      pregunta: "Al reescribir el jefe de este mundo, apetece ordenar las líneas por valor porque queda mejor. ¿Se puede?",
      opciones: [
        {
          texto: "No: un refactor conserva el comportamiento, no lo mejora.",
          correcta: true,
          porque: "Y hay un motivo práctico además del principio: si de paso cambias el comportamiento, ya no sabes si el cambio de forma estaba bien. Mejorar está muy bien y va después, con los tests en verde y en un cambio aparte donde se vea que el comportamiento cambia a propósito.",
        },
        {
          texto: "Sí, si los tests siguen pasando.",
          porque: "Si el orden cambiara, los tests **no** pasarían: los hay que lo comprueban. Y esa es la señal de que no era un refactor.",
        },
        {
          texto: "Sí: mientras el resultado sea mejor, da igual cómo se llame lo que has hecho.",
          porque: "Da igual el nombre y no da igual la mezcla. Un cambio que a la vez reordena el código y cambia lo que hace es un cambio que nadie puede revisar.",
        },
      ],
    },
  ],
}
