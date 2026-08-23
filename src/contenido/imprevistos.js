/**
 * La lista de imprevistos de Steris.
 *
 * Los errores de JavaScript salen en inglés, sin contexto y sin decir qué hacer.
 * Para quien empieza son un muro: se lee «Cannot read properties of undefined»,
 * no se entiende nada y se cierra la pestaña.
 *
 * Aquí está cada uno de los que salen de verdad en este juego, traducido a lo
 * que significa y a lo que suele haberlo causado. Steris los tiene previstos
 * todos, que para eso es ella.
 *
 * El orden importa: se devuelve el primero que case, así que los patrones
 * concretos van antes que los generales.
 *
 * ## Por lenguaje, porque los errores no se parecen en nada
 *
 * `Cannot read properties of undefined` es de JavaScript y `Call to a member
 * function on null` es de PHP: **son el mismo fallo con dos mensajes que no
 * tienen una palabra en común**. Así que cada imprevisto declara de qué
 * `lenguaje` es y `traducirImprevisto` recibe dónde estás. Sin eso, en un mundo
 * de PHP no se traducía ni uno y quien empieza se comía el mensaje en inglés,
 * que es exactamente lo que esta lista existe para evitar.
 *
 * Los mensajes de PHP están copiados de los que **suelta el motor del juego**,
 * ejecutándolos: no de memoria ni de la documentación.
 */
export const IMPREVISTOS = [
  {
    id: 'no-definido',
    lenguaje: 'js',
    patron: /([\w$]+) is not defined/,
    titulo: 'Estás usando un nombre que no existe',
    significa: (c) => `En ese punto del programa no hay nada que se llame \`${c[1]}\`.`,
    causas: [
      'Lo has escrito con una errata, o con mayúsculas distintas: para el ordenador, `Cobrar` y `cobrar` son dos cosas.',
      'No lo has declarado todavía. Recuerda que el programa se lee de arriba abajo.',
      'Lo has declarado dentro de una función, y desde fuera de esa función no se ve.',
    ],
  },
  {
    id: 'antes-de-existir',
    lenguaje: 'js',
    patron: /Cannot access '([\w$]+)' before initialization/,
    titulo: 'Lo has usado antes de crearlo',
    significa: (c) => `\`${c[1]}\` sí existe, pero se declara más abajo, y arriba todavía no está.`,
    causas: [
      'Tienes las líneas en otro orden del que hacen falta: primero se declara y después se usa.',
    ],
  },
  {
    id: 'const-reasignada',
    lenguaje: 'js',
    patron: /Assignment to constant variable/,
    titulo: 'Le has dado otro valor a una constante',
    significa: () => 'Algo declarado con `const` no admite que se le asigne otro valor después.',
    causas: [
      'Si ese valor tiene que cambiar, decláralo con `let` en vez de con `const`.',
      'Si lo que querías era cambiar lo de DENTRO de una lista o un objeto, eso sí se puede: usa `push`, `splice` o asigna a una propiedad, pero sin reemplazar la variable entera.',
    ],
  },
  {
    id: 'propiedad-de-nada',
    lenguaje: 'js',
    patron: /Cannot read propert(?:y|ies) of undefined \(reading '([\w$]+)'\)/,
    titulo: 'Has intentado abrir algo que no existe',
    significa: (c) => `Has pedido \`.${c[1]}\` de una cosa que vale \`undefined\`, o sea que no hay nada donde mirar.`,
    causas: [
      'El objeto no tiene esa propiedad: repasa cómo se llama exactamente.',
      'Viene de una función que no devuelve nada. Comprueba que tiene su `return`.',
      'En Vue 3, si lo que falta es `.value`, puede que hayas desestructurado un objeto reactivo y hayas perdido el vínculo.',
      'Para datos que pueden no venir existe `?.`, que devuelve `undefined` en vez de pararlo todo.',
    ],
  },
  {
    id: 'propiedad-de-null',
    lenguaje: 'js',
    patron: /Cannot read propert(?:y|ies) of null \(reading '([\w$]+)'\)/,
    titulo: 'Has intentado abrir algo que está vacío a propósito',
    significa: (c) => `Has pedido \`.${c[1]}\` de un valor \`null\`, que significa «aquí no hay nada, y consta».`,
    causas: [
      'Alguien puso ese hueco en blanco deliberadamente y hay que contemplarlo antes de entrar.',
      'Con `?.` puedes pedirlo sin que el programa se pare.',
    ],
  },
  {
    id: 'no-es-funcion',
    lenguaje: 'js',
    patron: /([\w$.]+) is not a function/,
    titulo: 'Le has puesto paréntesis a algo que no es una función',
    significa: (c) => `\`${c[1]}\` existe, pero no es algo que se pueda llamar.`,
    causas: [
      'Errata en el nombre del método: `pusg` en vez de `push`, por ejemplo.',
      'Estás usando un método de lista sobre algo que no es una lista. `map`, `filter` y `reduce` solo valen para listas.',
      'Has puesto paréntesis a una variable normal, que no hace falta.',
    ],
  },
  {
    id: 'no-recorrible',
    lenguaje: 'js',
    patron: /is not iterable/,
    titulo: 'Has intentado repartir algo que no se puede repartir',
    significa: () => 'Los tres puntos `...` y la desestructuración de listas solo funcionan sobre cosas que se puedan recorrer.',
    causas: [
      'Lo que tienes ahí es `undefined` o un número, y no una lista.',
      'Para objetos, la desestructuración va entre llaves `{ }`, no entre corchetes `[ ]`.',
    ],
  },
  {
    id: 'final-inesperado',
    lenguaje: 'js',
    patron: /Unexpected end of input|Unterminated (?:string|template)/,
    titulo: 'Te has dejado algo sin cerrar',
    significa: () => 'El programa se acaba estando algo todavía abierto, y el ordenador se queda esperando.',
    causas: [
      'Falta una llave `}`, un paréntesis `)` o un corchete `]`.',
      'Falta una comilla de cerrar. Y tienen que ser del mismo tipo que la de abrir.',
      'Truco: cuenta los símbolos de abrir y los de cerrar. Van siempre por parejas.',
    ],
  },
  {
    id: 'falta-parentesis',
    lenguaje: 'js',
    patron: /missing \) after argument list/,
    titulo: 'Falta un paréntesis de cerrar',
    significa: () => 'Has abierto un paréntesis para llamar a algo y no lo has cerrado.',
    causas: [
      'Mira la línea que te señala, y también la de arriba: el fallo suele estar donde se abrió, no donde se ha notado.',
    ],
  },
  {
    id: 'declarada-dos-veces',
    lenguaje: 'js',
    patron: /Identifier '([\w$]+)' has already been declared/,
    titulo: 'Has declarado lo mismo dos veces',
    significa: (c) => `Ya existe un \`${c[1]}\` en ese mismo sitio, y no puede haber dos.`,
    causas: [
      'Declarar es crear, y solo se hace una vez. Para cambiarle el valor después, basta con `nombre = valor`, sin `const` ni `let` delante.',
    ],
  },
  {
    id: 'json-html',
    lenguaje: 'js',
    patron: /Unexpected token '<'.*is not valid JSON/,
    titulo: 'Te han mandado una página web en vez de datos',
    significa: () =>
      'El texto que intentas leer como JSON empieza por `<`, así que casi seguro es HTML y no datos.',
    causas: [
      'El servidor ha devuelto una página de error -un 404 o un 500- en vez de lo que pediste. El fallo está en la petición, no en tu `JSON.parse`.',
      'La dirección a la que has pedido los datos no es la que creías.',
      'Antes de darle vueltas al `parse`, escribe el texto tal cual por consola y mira qué te ha llegado de verdad.',
    ],
  },
  {
    id: 'json-invalido',
    lenguaje: 'js',
    patron: /(?:Expected .*|Unexpected .*) in JSON at position (\d+)/,
    titulo: 'El texto no es JSON válido',
    significa: (c) => `Se ha atragantado en el carácter ${c[1]} del texto.`,
    causas: [
      'Las claves de JSON van entre **comillas dobles**, siempre: `{"a": 1}`, no `{a: 1}` ni con comillas simples.',
      'Hay una coma de más después del último elemento. En JavaScript se perdona; en JSON no.',
      'El texto viene cortado a medias, así que el JSON nunca llega a cerrarse.',
      'JSON no admite comentarios, por mucho que parezca código.',
    ],
  },
  {
    id: 'json-circular',
    lenguaje: 'js',
    patron: /Converting circular structure to JSON/,
    titulo: 'Ese objeto se contiene a sí mismo',
    significa: () =>
      'Siguiendo sus propiedades se acaba llegando otra vez al mismo objeto, y `JSON.stringify` daría vueltas para siempre.',
    causas: [
      'Dos objetos que se apuntan el uno al otro: un padre con lista de hijos y cada hijo con una referencia a su padre.',
      'Estás intentando guardar algo que no eran datos -un elemento del DOM, un componente de Vue- y esas cosas están llenas de referencias circulares.',
    ],
  },
  {
    id: 'asignacion-imposible',
    lenguaje: 'js',
    patron: /Invalid left-hand side in assignment/,
    titulo: 'Estás asignando a algo que no es un sitio',
    significa: () => 'A la izquierda del `=` tiene que haber algo donde se pueda guardar un valor.',
    causas: [
      'Has escrito `?.` en el lado izquierdo: `ficha?.nombre = "Wax"` no existe. El encadenamiento opcional sirve para leer, no para asignar.',
      'Estás asignando al resultado de una llamada, como `obtener() = 3`.',
    ],
  },
  {
    id: 'promesa-sin-recoger',
    lenguaje: 'js',
    patron: /Unhandled(?: promise)? [Rr]ejection/,
    titulo: 'Una promesa ha fallado y no la esperaba nadie',
    significa: () =>
      'Algo ha salido mal dentro de una promesa, y no había ningún `await` ni ningún `.catch` recogiendo el fallo.',
    causas: [
      'Has llamado a una función `async` sin `await` y sin `.catch`. Si falla, el error no tiene dónde ir.',
      'Dentro de un `forEach` con funciones `async`: `forEach` no espera a nada, así que esas promesas quedan sueltas.',
      'Si lo que querías era lanzar varias a la vez, `Promise.allSettled` las recoge todas por ti.',
    ],
  },
  {
    id: 'bigint-mezclado',
    lenguaje: 'js',
    patron: /Cannot mix BigInt and other types/,
    titulo: 'Un BigInt no se mezcla con un número normal',
    significa: () => 'Los números enormes que acaban en `n` son otro tipo y no se suman con los de siempre.',
    causas: [
      'Conviértelos a propósito: `Number(grande)` si de verdad cabe, o `BigInt(pequeno)` para subir el otro.',
    ],
  },
  {
    id: 'simbolo-raro',
    lenguaje: 'js',
    patron: /Invalid or unexpected token|Unexpected token|Unexpected identifier/,
    titulo: 'Hay un símbolo donde no tocaba',
    significa: () => 'El ordenador iba leyendo y se ha encontrado algo que ahí no puede ir.',
    causas: [
      'Falta una coma entre dos elementos, o sobra una al final.',
      'Comillas mal cerradas, o mezcladas: una de abrir simple y otra de cerrar doble.',
      'Un acento o una letra rara colada dentro de un nombre de variable.',
    ],
  },
  {
    id: 'pila-desbordada',
    lenguaje: 'js',
    patron: /Maximum call stack size exceeded/,
    titulo: 'Una función que se llama a sí misma sin parar',
    significa: () => 'Se ha llamado tantas veces seguidas que el ordenador se ha quedado sin sitio para apuntarlo.',
    causas: [
      'Una función se llama a sí misma y no tiene un caso en el que pare.',
      'Dos funciones se llaman la una a la otra en círculo.',
    ],
  },
  {
    id: 'no-definido-en-plantilla',
    lenguaje: 'js',
    patron: /Property or method "([\w$]+)" is not defined on the instance/,
    titulo: 'La plantilla usa algo que el componente no tiene',
    significa: (c) => `La plantilla pinta \`${c[1]}\`, pero el componente no lo ofrece.`,
    causas: [
      'En Vue 2: no está en lo que devuelve `data`, ni en `methods`, ni en `computed`.',
      'En Vue 3: se te ha olvidado devolverlo desde `setup`. Lo que no se devuelve, la plantilla no lo ve.',
      'O es una errata: el nombre de la plantilla y el del componente tienen que coincidir exactamente.',
    ],
  },
  {
    id: 'bucle-de-actualizacion',
    lenguaje: 'js',
    patron: /infinite update loop/,
    titulo: 'Vue se ha metido en un bucle repintando',
    significa: () => 'Algo cambia un dato mientras se está pintando, lo que obliga a pintar otra vez, y así sin parar.',
    causas: [
      'Un `computed` o un `watch` que modifica el mismo dato del que depende.',
      'Un método que cambia datos y al que se llama desde la propia plantilla.',
    ],
  },
  // ---- De PHP ---------------------------------------------------------------
  // Los mensajes están copiados de lo que suelta el motor del juego al
  // ejecutarlos de verdad, no de la documentación.
  {
    id: 'php-funcion-no-existe',
    lenguaje: 'php',
    patron: /Call to undefined function ([\w\\]+)\(\)/,
    titulo: 'Estás llamando a una función que no existe',
    significa: (c) => `PHP no encuentra ninguna función que se llame \`${c[1]}\`.`,
    causas: [
      'Una errata en el nombre, o mayúsculas distintas de las que pusiste al declararla.',
      'La has declarado más abajo y dentro de otra función: las de dentro no existen hasta que se ejecuta la de fuera.',
      'Es una función de PHP y se llama de otra manera: `count` y no `length`, `strlen` y no `size`, `intdiv` y no `idiv`.',
    ],
  },
  {
    id: 'php-metodo-en-null',
    lenguaje: 'php',
    patron: /Call to a member function (\w+)\(\) on null/,
    titulo: 'Le estás pidiendo algo a la nada',
    significa: (c) => `Has llamado a \`${c[1]}()\` sobre algo que vale \`null\`: ahí no hay objeto al que pedirle nada.`,
    causas: [
      'Lo que esperabas que fuera un objeto viene vacío: mira de dónde sale con `var_dump` justo antes.',
      'Una función que debía devolver un objeto ha acabado sin `return`, y entonces devuelve `null`.',
      'Si puede venir vacío a propósito, pregúntalo antes con `if ($x !== null)` o usa `?->`.',
    ],
  },
  {
    id: 'php-metodo-no-existe',
    lenguaje: 'php',
    patron: /Call to undefined method ([\w\\]+)::(\w+)\(\)/,
    titulo: 'Ese método no está en esa clase',
    significa: (c) => `\`${c[1]}\` existe, pero no tiene ningún método que se llame \`${c[2]}()\`.`,
    causas: [
      'Una errata, o el método está en otra clase.',
      'Lo has declarado `private` y lo estás llamando desde fuera.',
    ],
  },
  {
    id: 'php-clase-no-existe',
    lenguaje: 'php',
    patron: /Class "([\w\\]+)" not found/,
    titulo: 'Esa clase no existe',
    significa: (c) => `PHP no encuentra ninguna clase que se llame \`${c[1]}\`.`,
    causas: [
      'Una errata en el nombre, o la clase está declarada más abajo de donde la usas.',
      'Le falta el espacio de nombres, o el `use` que lo trae.',
    ],
  },
  {
    id: 'php-division-por-cero',
    lenguaje: 'php',
    patron: /(Division|Modulo) by zero/,
    titulo: 'Estás dividiendo entre cero',
    significa: () => 'Dividir entre cero no da un número, así que PHP se para en vez de inventarse uno.',
    causas: [
      'El divisor viene de una cuenta que ha salido 0, o de una lista vacía: `count($lista)` es 0 y dividir entre eso revienta.',
      'La media de una lista vacía es el caso clásico. Pregunta `if (count($lista) === 0)` antes de dividir.',
    ],
  },
  {
    id: 'php-tipo-de-argumento',
    lenguaje: 'php',
    patron: /(\w+)\(\): Argument #\d+ \(\$(\w+)\) must be of type ([\w|?]+), (\w+) given/,
    titulo: 'Le estás pasando algo de otro tipo',
    significa: (c) =>
      `\`${c[1]}()\` espera que \`$${c[2]}\` sea de tipo \`${c[3]}\`, y le has pasado un \`${c[4]}\`.`,
    causas: [
      'Has pasado los argumentos en otro orden: van por posición, no por tipo.',
      'Lo que le pasas viene de otra función que devuelve otra cosa de la que creías.',
      'Si es un número que viene como texto -de un formulario, por ejemplo-, conviértelo a propósito con `(int)`.',
    ],
  },
  {
    id: 'php-tipo-de-retorno',
    lenguaje: 'php',
    patron: /(\w+)\(\): Return value must be of type ([\w|?]+), (\w+) returned/,
    titulo: 'La función devuelve algo de otro tipo',
    significa: (c) => `\`${c[1]}()\` dice que devuelve \`${c[2]}\`, y ha devuelto un \`${c[3]}\`.`,
    causas: [
      'Un camino de la función devuelve otra cosa: mira todos los `return`, no solo el último.',
      'Si el tipo declarado es `int` y devuelves una división, puede salir `float`: usa `intdiv`.',
      '`null` cuenta como otro tipo. Si puede no haber nada que devolver, decláralo `?int` o `?string`.',
    ],
  },
  {
    id: 'php-faltan-argumentos',
    lenguaje: 'php',
    patron: /Too few arguments to function (\w+)\(\), (\d+) passed .*?and (?:exactly|at least) (\d+) expected/,
    titulo: 'Faltan argumentos en la llamada',
    significa: (c) => `\`${c[1]}()\` necesita ${c[3]} y le has pasado ${c[2]}.`,
    causas: [
      'Te has dejado uno por el camino.',
      'Si ese parámetro debería ser opcional, dale un valor por defecto en la firma. Y los que lo tienen van al final.',
    ],
  },
  {
    id: 'php-operacion-imposible',
    lenguaje: 'php',
    patron: /Unsupported operand types: (\w+) ([-+*/%.]) (\w+)/,
    titulo: 'Esa operación no se puede hacer con esas cosas',
    significa: (c) => `No se puede hacer \`${c[2]}\` entre un \`${c[1]}\` y un \`${c[3]}\`.`,
    causas: [
      'Para pegar textos en PHP se usa un punto, no un `+`. El `+` solo suma números.',
      'Estás sumando un array, seguramente sin querer: mira si te falta un `[0]` o un `count()`.',
      'Si es un texto que contiene un número, PHP lo convierte solo; si no lo contiene, no.',
    ],
  },
  {
    id: 'php-no-es-funcion',
    lenguaje: 'php',
    patron: /Value of type (\w+) is not callable/,
    titulo: 'Estás llamando a algo que no es una función',
    significa: (c) => `Has puesto paréntesis detrás de un \`${c[1]}\`, y eso no se puede llamar.`,
    causas: [
      'Le sobran los paréntesis: si querías el valor, va sin ellos.',
      'La variable guarda un dato y no la función que esperabas.',
    ],
  },
  {
    id: 'php-variable-no-definida',
    lenguaje: 'php',
    patron: /Undefined variable \$(\w+)/,
    titulo: 'Esa variable no existe todavía',
    significa: (c) => `En ese punto no hay nada que se llame \`$${c[1]}\`. PHP avisa y sigue con \`null\`.`,
    causas: [
      'Una errata, o mayúsculas distintas: `$Total` y `$total` son dos variables.',
      'La declaras más abajo. El programa se lee de arriba abajo.',
      'La declaras dentro de una función y la usas fuera, o al revés: en PHP las funciones no ven las variables de fuera.',
      'Es un acumulador que empieza con `+=` sin haberlo puesto a cero antes.',
    ],
  },
  {
    id: 'php-clave-no-definida',
    lenguaje: 'php',
    patron: /Undefined array key "?([\w\s]+)"?/,
    titulo: 'Esa clave no está en el array',
    significa: (c) => `El array no tiene nada guardado en \`${c[1]}\`. PHP avisa y sigue con \`null\`.`,
    causas: [
      'Una errata en la clave, o mayúsculas distintas.',
      'Si es un número, te has pasado del final: las posiciones empiezan en 0, así que la última es `count($lista) - 1`.',
      'Si puede no estar, léela con `??`: `$inventario[$metal] ?? 0`.',
    ],
  },
  {
    id: 'php-llave-sin-cerrar',
    lenguaje: 'php',
    patron: /Unclosed '\{'/,
    titulo: 'Te falta cerrar una llave',
    significa: () => 'Has abierto un bloque con `{` y el fichero se acaba sin cerrarlo.',
    causas: [
      'Cuenta las llaves de una función o de un bucle: por cada `{` tiene que haber un `}`.',
      'Suele pasar al añadir un `if` dentro de otro. La sangría ayuda a verlo: si algo no está a la altura que le toca, ahí está.',
    ],
  },
  {
    id: 'php-fichero-a-medias',
    lenguaje: 'php',
    patron: /syntax error, unexpected end of file/,
    titulo: 'El código se acaba a mitad de una frase',
    significa: () => 'PHP ha llegado al final del fichero esperando algo más.',
    causas: [
      'Falta un punto y coma, una llave, un paréntesis o una comilla de cierre.',
      'Una comilla sin cerrar se come todo lo que viene detrás, así que el error sale al final aunque la causa esté arriba.',
    ],
  },
  {
    id: 'php-sintaxis',
    lenguaje: 'php',
    patron: /syntax error, unexpected token "([^"]+)"(?:, expecting ([^\n]+))?/,
    titulo: 'Eso todavía no es PHP',
    significa: (c) =>
      c[2]
        ? `PHP se ha encontrado un \`${c[1]}\` donde esperaba ${c[2]}.`
        : `PHP no esperaba un \`${c[1]}\` en ese sitio.`,
    causas: [
      'Casi siempre falta algo en la línea de ANTES: un punto y coma, un paréntesis o una coma.',
      'El número de línea que da PHP es donde se ha dado cuenta, no siempre donde está el fallo.',
      'Si el símbolo que nombra es `{`, mira la firma de la función: puede faltarle un paréntesis.',
    ],
  },

]

/**
 * Busca el imprevisto que corresponde a un mensaje de error.
 *
 * El lenguaje importa: los mensajes de JavaScript y los de PHP no comparten una
 * palabra, así que buscar en la lista entera solo puede acertar o no acertar,
 * nunca confundirse. Se filtra igual, por dos razones: no gastar el patrón de
 * otro lenguaje en cada error, y que un patrón nuevo no pueda casar por
 * casualidad con el mensaje del otro.
 *
 * @param {string} mensaje el error tal y como lo suelta el motor
 * @param {'js'|'php'|'sql'} lenguaje dónde se estaba ejecutando
 * @returns {{titulo: string, significa: string, causas: string[]} | null}
 */
export function traducirImprevisto(mensaje, lenguaje = 'js') {
  if (!mensaje) return null

  for (const imprevisto of IMPREVISTOS) {
    if (imprevisto.lenguaje !== lenguaje) continue
    const casa = String(mensaje).match(imprevisto.patron)
    if (!casa) continue
    return {
      id: imprevisto.id,
      titulo: imprevisto.titulo,
      significa: imprevisto.significa(casa),
      causas: imprevisto.causas,
    }
  }
  return null
}
