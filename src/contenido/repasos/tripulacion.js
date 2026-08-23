/**
 * Las preguntas del repaso de «tripulacion».
 *
 * Van en su propio fichero y se piden al abrir el repaso, no al arrancar el
 * juego. Ver `repasos/index.js` para el motivo.
 */
export default {
    id: "repaso-tripulacion",
    mundo: "tripulacion",
    quien: "brisa",
    titulo: "El caso de la tripulación",
    preguntas: [
      {
        pregunta: "¿Por qué este orden de tramos está mal?\n\n```php\nif ($n >= 20) { return 'suficiente'; }\nif ($n >= 100) { return 'mucho'; }\n```",
        opciones: [
          {
            texto: "Porque 500 cumple el primero y se queda ahí: el segundo no se alcanza nunca.",
            correcta: true,
            porque: "Las condiciones se miran de arriba abajo y se para en la primera que se cumple. Los tramos van del más alto al más bajo, o del más estrecho al más amplio.",
          },
          {
            texto: "Porque falta un `else` entre los dos.",
            porque: "Con `return` dentro no hace falta: al devolver, la función termina. El problema no es la sintaxis, es el orden.",
          },
          {
            texto: "No está mal: PHP mira todas las condiciones y elige la que encaja mejor.",
            porque: "No elige nada. Ejecuta la primera que se cumple y para. Nadie mira si había otra que encajaba mejor.",
          },
        ],
      },
      {
        pregunta: "¿Qué imprime `if ('0') { echo 'sí'; } else { echo 'no'; }`?",
        opciones: [
          {
            texto: "`no`: el texto `'0'` cuenta como falso.",
            correcta: true,
            porque: "Es la excepción que hay que memorizar. Solo dos textos cuentan como falsos: el vacío y el que contiene exactamente un cero.",
          },
          {
            texto: "`sí`, porque cualquier texto que no esté vacío cuenta como cierto.",
            porque: "Casi: la regla es esa con una excepción, y esa excepción es justo `'0'`. Con datos que llegan de un formulario, donde todo es texto, muerde de verdad.",
          },
          {
            texto: "`no`, porque todos los textos cortos cuentan como falsos.",
            porque: "La longitud no tiene nada que ver. `'a'` cuenta como cierto y es igual de corto.",
          },
        ],
      },
      {
        pregunta: "En un bucle que suma, ¿qué pasa si `$total = 0;` está **dentro** del bucle?",
        opciones: [
          {
            texto: "Al final vale el último elemento, no la suma. Y con una lista de uno parece funcionar.",
            correcta: true,
            porque: "Por eso es tan caro: se prueba con un elemento, sale bien, y se sube. El acumulador va siempre fuera del bucle.",
          },
          {
            texto: "Da error, porque la variable se declara dos veces.",
            porque: "En PHP asignar una variable que ya existe no es ningún error. Ojalá lo fuera: se cazaría al momento.",
          },
          {
            texto: "Vale 0 al final, porque lo último que se ejecuta es ponerlo a cero.",
            porque: "Lo último de cada vuelta es la suma, no el cero: el cero es la primera línea. Queda valiendo el último elemento.",
          },
        ],
      },
      {
        pregunta: "Un `if` dentro de un bucle no se cumple en una vuelta. ¿Qué le pasa a la variable que asignaba?",
        opciones: [
          {
            texto: "Nada: se queda con el valor que tuviera de la vuelta anterior.",
            correcta: true,
            porque: "Un `if` que no entra no hace nada, no vacía nada. Por eso al final tienes «el último que cumplió» y no «el que cumplía».",
          },
          {
            texto: "Vuelve a su valor inicial en cada vuelta que la condición falla.",
            porque: "Eso solo pasaría si alguien la reiniciara a mano. PHP no deshace asignaciones al salir de un `if`.",
          },
          {
            texto: "Se queda en `null` hasta que la condición se cumpla otra vez.",
            porque: "Sigue valiendo lo que valía. Confundir esto es de donde sale la mitad de los fallos con bucles y banderas.",
          },
        ],
      },
      {
        pregunta: "¿Por qué avisa PHP de `function f(int $a = 1, int $b)`?",
        opciones: [
          {
            texto: "Porque para omitir `$a` habría que omitir `$b`, que es obligatorio: el defecto no se puede usar nunca.",
            correcta: true,
            porque: "Los argumentos van por posición y no hay forma de saltarse uno de en medio. Los parámetros con defecto van al final.",
          },
          {
            texto: "Porque `$b` tendría que declarar también un valor por defecto.",
            porque: "No hace falta que lo tenga: lo que hace falta es que los que sí lo tienen vayan detrás.",
          },
          {
            texto: "Porque los dos parámetros son del mismo tipo y PHP no sabe a cuál va cada argumento.",
            porque: "PHP nunca reparte los argumentos por tipo: los reparte por orden, siempre. El tipo no tiene nada que ver.",
          },
        ],
      },
      {
        pregunta: "Con `$inv = ['acero' => 4]`, ¿qué devuelve `in_array('acero', $inv)`?",
        opciones: [
          {
            texto: "`false`: `in_array` busca valores, y `'acero'` es una clave.",
            correcta: true,
            porque: "Es el error más repetido con arrays asociativos. Para claves, `array_key_exists` o `isset`.",
          },
          {
            texto: "`true`, porque `'acero'` está en el array.",
            porque: "Está como clave, y `in_array` no mira las claves. Los valores de ese array son `[4]`.",
          },
          {
            texto: "Da error, porque el array tiene claves de texto.",
            porque: "No da error: contesta que no, que es peor. Un error se ve; un `false` se cuela.",
          },
        ],
      },
      {
        pregunta: "`$notas = ['vin' => null]`. ¿Qué contestan `isset($notas['vin'])` y `array_key_exists('vin', $notas)`?",
        opciones: [
          {
            texto: "`false` la primera y `true` la segunda.",
            correcta: true,
            porque: "`isset` dice «está y tiene valor»; `array_key_exists` dice «la clave está». La diferencia importa cuando `null` significa algo, como una nota sin poner.",
          },
          {
            texto: "`true` las dos: la clave está en el array.",
            porque: "Para `isset`, una clave que vale `null` es como si no estuviera. Es la única diferencia entre las dos y es toda la lección.",
          },
          {
            texto: "`false` las dos, porque el valor es `null`.",
            porque: "`array_key_exists` no mira el valor, solo si la clave existe. Y existe.",
          },
        ],
      },
      {
        pregunta: "En un `foreach`, ¿qué diferencia hay entre `continue` y `break`?",
        opciones: [
          {
            texto: "`continue` se salta el resto de esa vuelta; `break` sale del bucle entero.",
            correcta: true,
            porque: "Uno se salta un elemento y el otro se salta todos los que quedan. `continue` para filtrar, `break` para buscar.",
          },
          {
            texto: "`continue` salta al siguiente elemento y `break` salta dos.",
            porque: "`break` no salta: termina. Después de un `break` no hay más vueltas.",
          },
          {
            texto: "Son lo mismo; `break` es la forma antigua.",
            porque: "Hacen cosas distintas y las dos se usan. Cambiar una por la otra suele cambiar la salida entera.",
          },
        ],
      },
      {
        pregunta: "Un `foreach` con `continue` se salta un elemento. ¿Cambia `count()` del array?",
        opciones: [
          {
            texto: "No: el bucle mira el array, no lo modifica.",
            correcta: true,
            porque: "Saltarse elementos al recorrer no los borra. Si quieres un array sin ellos, hay que construir otro.",
          },
          {
            texto: "Sí: los elementos saltados se quitan del array.",
            porque: "Nada de lo que hace un `foreach` toca el array que recorre, salvo que se lo pidas expresamente.",
          },
          {
            texto: "Depende de si el `foreach` saca la clave o solo el valor.",
            porque: "No depende de eso. En los dos casos el array se queda igual que estaba.",
          },
        ],
      },
    ],
  }
