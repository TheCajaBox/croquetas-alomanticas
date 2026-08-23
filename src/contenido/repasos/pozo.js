/**
 * Las preguntas del repaso de «pozo».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-pozo",
    mundo: "pozo",
    quien: "brisa",
    titulo: "El caso del Pozo",
    preguntas: [
      {
        pregunta: "¿Qué imprime esto?\n\n```php\n$metales = ['acero', 'peltre'];\narray_map(fn($m) => strtoupper($m), $metales);\necho implode(',', $metales);\n```",
        opciones: [
          {
            texto: "`acero,peltre`: nadie se ha quedado con lo que devolvió `array_map`.",
            correcta: true,
            porque: "`array_map` devuelve una lista nueva y no toca la que le das. Esa llamada calcula las mayúsculas y las tira, porque no hay ningún `=` que las recoja.",
          },
          {
            texto: "`ACERO,PELTRE`: `array_map` cambia la lista que le pasas.",
            porque: "Esa es la confusión. Hay funciones que cambian lo que les das -`sort`, `usort`- y funciones que devuelven algo nuevo -`array_map`, `array_filter`-, y no se distinguen por el nombre.",
          },
          {
            texto: "Nada: falta guardar el resultado y PHP da un error.",
            porque: "No da error. Llamar a una función y no usar lo que devuelve es perfectamente legal, y por eso este fallo no avisa.",
          },
        ],
      },
      {
        pregunta: "Con `$sacos = [0, 3, 5]`, ¿por qué `array_filter($sacos, fn($s) => $s > 0)[0]` avisa de que no existe la clave 0?",
        opciones: [
          {
            texto: "Porque `array_filter` conserva la clave de cada elemento: el 3 estaba en la 1 y sigue en la 1.",
            correcta: true,
            porque: "El filtro decide quién se queda, no en qué posición va. Quedan las claves 1 y 2. `array_values` las renumera desde cero.",
          },
          {
            texto: "Porque `array_filter` devuelve el resultado al revés.",
            porque: "No cambia el orden en absoluto: conserva el que había, con las claves originales y sin los elementos descartados.",
          },
          {
            texto: "Porque hay que pasarle la función primero y la lista después.",
            porque: "El orden de `array_filter` es lista y luego función, que es justo al revés que `array_map`. Aquí está bien puesto.",
          },
        ],
      },
      {
        pregunta: "¿Cuánto vale `array_reduce([4, 0, 7], fn($ll, $u) => $ll + $u, 10)`?",
        opciones: [
          {
            texto: "21: el valor de partida entra en la cuenta.",
            correcta: true,
            porque: "El tercer argumento es lo que recibe el acumulador en la primera vuelta: 10 + 4 + 0 + 7. Dar por hecho que un reduce empieza en cero da resultados plausibles, que son los que nadie revisa.",
          },
          {
            texto: "11: el valor de partida es solo por si la lista está vacía.",
            porque: "También sirve para eso -con la lista vacía se devuelve tal cual, sin dar una vuelta-, pero no solo: entra en la primera operación.",
          },
          {
            texto: "10: la lista no se recorre porque ya hay un valor.",
            porque: "Se da una vuelta por elemento, siempre. El valor de partida no cancela nada.",
          },
        ],
      },
      {
        pregunta: "¿Cuál es la diferencia entre `$stock ?? 99` y `$stock ?: 99` cuando `$stock` vale `0`?",
        opciones: [
          {
            texto: "`??` devuelve 0 y `?:` devuelve 99.",
            correcta: true,
            porque: "`??` mira si hay algo -si es `null` o no existe- y el cero es algo. `?:` mira si cuenta como cierto, y un cero, un texto vacío y un array vacío no cuentan. Un stock de cero unidades convertido en 99 es un fallo que nadie ve leyendo el código.",
          },
          {
            texto: "Ninguna: son dos formas de escribir lo mismo.",
            porque: "Se parecen y no lo son. Con datos que pueden ser cero legítimamente, `?:` los tira y `??` los respeta.",
          },
          {
            texto: "`?:` da un error de sintaxis sin la parte del medio.",
            porque: "`$a ?: $b` es válido desde PHP 5.3: es el ternario con la parte del medio quitada.",
          },
        ],
      },
      {
        pregunta: "¿Qué devuelve `usort($numeros, fn($a, $b) => $b - $a)`?",
        opciones: [
          {
            texto: "`true`. Ordena el array que le das, y hay que devolver el array por separado.",
            correcta: true,
            porque: "Es de las funciones que hacen en vez de devolver. Dentro de una función el parámetro es una copia, así que ordenarla no toca la lista de quien llamó: hay que devolverla.",
          },
          {
            texto: "La lista ordenada de mayor a menor.",
            porque: "Eso es lo que uno espera y es la fuente del fallo: `return usort(...)` deja una función que devuelve un booleano donde prometía un array.",
          },
          {
            texto: "La lista ordenada de menor a mayor: el orden de la resta no importa.",
            porque: "Importa y es lo único que decide el orden. `$a - $b` ordena de menor a mayor; `$b - $a`, al contrario.",
          },
        ],
      },
      {
        pregunta: "`isset($datos['nombre'])` con `$datos = ['nombre' => null]`, ¿qué devuelve?",
        opciones: [
          {
            texto: "`false`: `isset` pregunta que exista **y** que no sea `null`.",
            correcta: true,
            porque: "Son dos preguntas en una. Cuando de verdad hace falta distinguir «no me lo mandaron» de «me lo mandaron vacío», la que responde es `array_key_exists`, que solo mira la clave.",
          },
          {
            texto: "`true`: la clave existe, y eso es lo que pregunta `isset`.",
            porque: "Sería lo lógico por el nombre, y no es lo que hace: trata «existe pero vale nada» igual que «no existe».",
          },
          {
            texto: "Avisa de que la clave vale `null` y devuelve `null`.",
            porque: "`isset` nunca avisa de nada; es su otra utilidad. Devuelve siempre un booleano.",
          },
        ],
      },
      {
        pregunta: "¿Qué imprime `echo 'hay ' . $lista['oro'] ?? 0;` cuando esa clave no existe?",
        opciones: [
          {
            texto: "`hay ` y un aviso: el `??` se aplica al texto pegado, no a la clave.",
            correcta: true,
            porque: "`??` se evalúa después del punto, así que PHP entiende «(`'hay ' . $lista['oro']`) o si no, 0», y el texto pegado ya cuenta como algo. Por eso el `??` siempre entre paréntesis cuando hay algo más en la línea.",
          },
          {
            texto: "`hay 0`: el `??` cubre la clave que falta.",
            porque: "Es lo que uno quería escribir, pero hacen falta los paréntesis: `'hay ' . ($lista['oro'] ?? 0)`.",
          },
          {
            texto: "Un error fatal: no se puede concatenar con `??`.",
            porque: "Es código válido, y lo malo del fallo es justo eso: imprime algo y sigue.",
          },
        ],
      },
      {
        pregunta: "¿Por qué lanzar una excepción es mejor que devolver `0` cuando no se puede repartir entre cero?",
        opciones: [
          {
            texto: "Porque un cero se puede confundir con un resultado y una excepción no.",
            correcta: true,
            porque: "Quien llama recibiría un cero perfectamente creíble, lo sumaría a un total y el error viajaría disfrazado de dato. Y además: la función que detecta el problema casi nunca sabe qué hay que hacer con él. Lanza, y decide quien la usa.",
          },
          {
            texto: "Porque las excepciones son más rápidas que los `if`.",
            porque: "Son más lentas, y da igual: esto no se decide por velocidad sino porque un error no debe parecerse a una respuesta.",
          },
          {
            texto: "Porque devolver `0` obliga a comprobar el resultado y una excepción no.",
            porque: "Al revés: la excepción obliga a decidir qué hacer -recogerla o dejarla subir- y el cero se puede ignorar sin querer. Esa obligación es la ventaja.",
          },
        ],
      },
      {
        pregunta: "En un `try` con dos `echo` seguidos, ¿qué pasa si el primero lanza una excepción?",
        opciones: [
          {
            texto: "El segundo no se ejecuta y el salto va directo al `catch`.",
            correcta: true,
            porque: "`throw` abandona todo lo que queda del `try`. Por eso conviene comprobar al principio: comprobando por el camino, para cuando te enteras ya has dejado media cosa hecha.",
          },
          {
            texto: "El segundo se ejecuta igual y luego se entra en el `catch`.",
            porque: "No queda nada por hacer dentro del `try`: se sale en el punto exacto donde se lanzó.",
          },
          {
            texto: "El programa se para: el `catch` solo funciona con errores de sintaxis.",
            porque: "El `catch` recoge lo que se lanza y el programa sigue vivo después. Los errores de sintaxis son otra cosa y no se pueden capturar: no llega a ejecutarse nada.",
          },
        ],
      },
    ],
  }
