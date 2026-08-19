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
 */
export const IMPREVISTOS = [
  {
    id: 'no-definido',
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
    patron: /Cannot access '([\w$]+)' before initialization/,
    titulo: 'Lo has usado antes de crearlo',
    significa: (c) => `\`${c[1]}\` sí existe, pero se declara más abajo, y arriba todavía no está.`,
    causas: [
      'Tienes las líneas en otro orden del que hacen falta: primero se declara y después se usa.',
    ],
  },
  {
    id: 'const-reasignada',
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
    patron: /missing \) after argument list/,
    titulo: 'Falta un paréntesis de cerrar',
    significa: () => 'Has abierto un paréntesis para llamar a algo y no lo has cerrado.',
    causas: [
      'Mira la línea que te señala, y también la de arriba: el fallo suele estar donde se abrió, no donde se ha notado.',
    ],
  },
  {
    id: 'declarada-dos-veces',
    patron: /Identifier '([\w$]+)' has already been declared/,
    titulo: 'Has declarado lo mismo dos veces',
    significa: (c) => `Ya existe un \`${c[1]}\` en ese mismo sitio, y no puede haber dos.`,
    causas: [
      'Declarar es crear, y solo se hace una vez. Para cambiarle el valor después, basta con `nombre = valor`, sin `const` ni `let` delante.',
    ],
  },
  {
    id: 'json-html',
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
    patron: /Cannot mix BigInt and other types/,
    titulo: 'Un BigInt no se mezcla con un número normal',
    significa: () => 'Los números enormes que acaban en `n` son otro tipo y no se suman con los de siempre.',
    causas: [
      'Conviértelos a propósito: `Number(grande)` si de verdad cabe, o `BigInt(pequeno)` para subir el otro.',
    ],
  },
  {
    id: 'simbolo-raro',
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
    patron: /infinite update loop/,
    titulo: 'Vue se ha metido en un bucle repintando',
    significa: () => 'Algo cambia un dato mientras se está pintando, lo que obliga a pintar otra vez, y así sin parar.',
    causas: [
      'Un `computed` o un `watch` que modifica el mismo dato del que depende.',
      'Un método que cambia datos y al que se llama desde la propia plantilla.',
    ],
  },
]

/**
 * Busca el imprevisto que corresponde a un mensaje de error.
 * @returns {{titulo: string, significa: string, causas: string[]} | null}
 */
export function traducirImprevisto(mensaje) {
  if (!mensaje) return null

  for (const imprevisto of IMPREVISTOS) {
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
