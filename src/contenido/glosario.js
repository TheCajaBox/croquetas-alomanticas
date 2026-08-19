/**
 * El glosario de Steris.
 *
 * Cada palabra técnica que sale en el juego, explicada sin usar otras palabras
 * técnicas sin explicar. Los términos se detectan solos en los enunciados y en
 * los apuntes -ver src/motor/enlazarTerminos.js- y se pueden pulsar allí donde
 * aparezcan, sin salir del reto.
 *
 * Los `alias` son las otras formas de escribir lo mismo: plurales, sinónimos y
 * el nombre en inglés, que es como se va a encontrar el término por ahí fuera.
 */
export const GLOSARIO = [
  {
    id: "programa",
    termino: "programa",
    alias: ["programas"],
    definicion: "Una lista de órdenes que el ordenador ejecuta una detrás de otra, de arriba abajo. Eso es todo lo que es.",
  },
  {
    id: "codigo",
    termino: "código",
    definicion: "El texto de un programa. Se escribe con unas reglas muy estrictas: si sobra o falta un símbolo, el ordenador no lo entiende y se para.",
  },
  {
    id: "ejecutar",
    termino: "ejecutar",
    alias: ["ejecuta", "ejecutarlo", "ejecución"],
    definicion: "Decirle al ordenador que haga lo que pone en el código, línea a línea y desde arriba.",
  },
  {
    id: "consola",
    termino: "consola",
    definicion: "El sitio donde el programa escribe mensajes para que tú los leas. No los ve el usuario del programa: son para quien lo está haciendo.",
    ejemplo: "console.log('estoy aquí')",
  },
  {
    id: "variable",
    termino: "variable",
    alias: ["variables"],
    definicion: "Un nombre puesto a un valor para poder usarlo después. Guardas algo, le pones nombre, y a partir de ahí lo llamas por su nombre.",
    ejemplo: "const sombrero = 'bombín'",
  },
  {
    id: "valor",
    termino: "valor",
    alias: ["valores"],
    definicion: "Un dato concreto: un texto, un número, una lista. Lo que se guarda dentro de una variable.",
  },
  {
    id: "declarar",
    termino: "declarar",
    alias: ["declara", "declaras", "declaración", "declarada", "declarado"],
    definicion: "Crear una variable por primera vez, diciendo cómo se llama. Se hace una sola vez; después ya solo se usa.",
    ejemplo: "let dias = 3",
  },
  {
    id: "asignar",
    termino: "asignar",
    alias: ["asigna", "asignarle", "asignación"],
    definicion: "Meter un valor dentro de una variable con el signo `=`. Ojo: `=` no significa «es igual a», significa «guarda esto ahí».",
    ejemplo: "dias = 4",
  },
  {
    id: "constante",
    termino: "constante",
    alias: ["constantes"],
    definicion: "Una variable a la que no se le puede asignar otro valor después de creada. Se declara con `const` y es lo que se usa por defecto.",
    ejemplo: "const TARIFA = 25",
  },
  {
    id: "tipo",
    termino: "tipo",
    alias: ["tipos"],
    definicion: "La clase de dato que es un valor: texto, número, booleano, lista u objeto. Importa porque no todos se pueden operar igual.",
  },
  {
    id: "texto",
    termino: "texto",
    alias: ["textos", "cadena", "cadenas", "string"],
    definicion: "Un valor formado por caracteres. Va siempre entre comillas. `42` es un número; `'42'` es un texto que parece un número.",
    ejemplo: "'Wayne'",
  },
  {
    id: "numero",
    termino: "número",
    alias: ["números"],
    definicion: "Un valor con el que se puede hacer cuentas. Se escribe sin comillas y sin separadores de miles.",
    ejemplo: "500",
  },
  {
    id: "booleano",
    termino: "booleano",
    alias: ["booleanos"],
    definicion: "Un valor que solo puede ser `true` (verdadero) o `false` (falso). Es lo que devuelven las comparaciones.",
    ejemplo: "true",
  },
  {
    id: "lista",
    termino: "lista",
    alias: ["listas", "array", "arrays"],
    definicion: "Varios valores guardados en orden, entre corchetes. Cada uno ocupa una posición, y la primera posición es la 0, no la 1.",
    ejemplo: "['Wax', 'Marasi']",
  },
  {
    id: "objeto",
    termino: "objeto",
    alias: ["objetos"],
    definicion: "Varios valores guardados con nombre, entre llaves. En vez de por posición, a cada uno se llega por su nombre.",
    ejemplo: "{ nombre: 'Wayne', edad: 37 }",
  },
  {
    id: "propiedad",
    termino: "propiedad",
    alias: ["propiedades"],
    definicion: "Cada uno de los valores con nombre que tiene un objeto. Se lee poniendo un punto detrás del objeto.",
    ejemplo: "cartel.nombre",
  },
  {
    id: "indice",
    termino: "índice",
    alias: ["índices"],
    definicion: "La posición que ocupa algo dentro de una lista. Empiezan en 0: el primer elemento es el índice 0.",
    ejemplo: "gatos[0]",
  },
  {
    id: "nulo",
    termino: "null",
    definicion: "Un valor que significa «aquí no hay nada, y consta que no lo hay». Es distinto de un cero o de un texto vacío.",
  },
  {
    id: "indefinido",
    termino: "undefined",
    definicion: "Lo que hay dentro de algo que nunca se ha rellenado. Es la forma que tiene JavaScript de decir «esto no existe».",
  },
  {
    id: "plantilla-de-texto",
    termino: "plantilla de texto",
    alias: ["plantillas de texto"],
    definicion: "Un texto entre comillas invertidas que permite meter valores dentro con `${...}`. Con comillas normales no funciona.",
    ejemplo: "`Hola, ${nombre}`",
  },
  {
    id: "funcion",
    termino: "función",
    alias: ["funciones"],
    definicion: "Un trozo de programa con nombre, que se escribe una vez y se usa tantas veces como haga falta.",
    ejemplo: "function saludar(nombre) { ... }",
  },
  {
    id: "parametro",
    termino: "parámetro",
    alias: ["parámetros"],
    definicion: "El hueco que una función deja para recibir un dato. Se declara entre los paréntesis del nombre.",
    ejemplo: "function cobrar(dias)",
  },
  {
    id: "argumento",
    termino: "argumento",
    alias: ["argumentos"],
    definicion: "El valor concreto que le pasas a una función al usarla. El parámetro es el hueco; el argumento, lo que metes en él.",
    ejemplo: "cobrar(4)",
  },
  {
    id: "llamar",
    termino: "llamar",
    alias: ["llama", "llamada", "llamadas", "llamarla", "llamarlo"],
    definicion: "Usar una función, poniendo su nombre y unos paréntesis. Sin los paréntesis no la usas: solo la nombras.",
    ejemplo: "saludar('Wayne')",
  },
  {
    id: "devolver",
    termino: "devolver",
    alias: ["devuelve", "devuelva", "devuelven", "return"],
    definicion: "Entregar un valor al que llamó a la función, con `return`. No es lo mismo que escribirlo por consola: `console.log` enseña, `return` entrega.",
    ejemplo: "return dias * 25",
  },
  {
    id: "funcion-flecha",
    termino: "función flecha",
    alias: ["funciones flecha", "flecha"],
    definicion: "Una forma corta de escribir una función. Además no tiene `this` propio: usa el del sitio donde está escrita, y por eso funciona dentro de un método.",
    ejemplo: "(n) => n * 2",
  },
  {
    id: "this",
    termino: "this",
    definicion: "Dentro de un método, el objeto sobre el que se está trabajando. Se pierde con facilidad si pasas una función normal a otro sitio.",
    ejemplo: "this.nombres",
  },
  {
    id: "ambito",
    termino: "ámbito",
    alias: ["alcance", "scope"],
    definicion: "La zona del programa donde una variable existe. Fuera de su ámbito es como si no estuviera declarada.",
  },
  {
    id: "metodo",
    termino: "método",
    alias: ["métodos"],
    definicion: "Una función que vive dentro de un objeto. Se usa poniendo un punto: `objeto.metodo()`.",
    ejemplo: "lista.push('Peltre')",
  },
  {
    id: "bucle",
    termino: "bucle",
    alias: ["bucles"],
    definicion: "Una instrucción que repite algo muchas veces. Necesita siempre una condición de salida y algo que la acabe cumpliendo.",
    ejemplo: "for (let i = 0; i < 3; i += 1)",
  },
  {
    id: "bucle-infinito",
    termino: "bucle infinito",
    alias: ["bucles infinitos"],
    definicion: "Un bucle al que se le ha olvidado la salida y repite para siempre. En este juego se corta solo a las cien mil vueltas.",
    ejemplo: "while (true) {}",
  },
  {
    id: "map",
    termino: "map",
    definicion: "Recorre una lista y devuelve otra lista nueva con cada elemento transformado. No toca la original.",
    ejemplo: "precios.map((p) => p * 2)",
  },
  {
    id: "filter",
    termino: "filter",
    definicion: "Recorre una lista y devuelve otra solo con los elementos que cumplen lo que le digas.",
    ejemplo: "precios.filter((p) => p > 30)",
  },
  {
    id: "reduce",
    termino: "reduce",
    definicion: "Recorre una lista y la aplasta en un solo valor: una suma, un total, un texto. El segundo argumento es el valor de partida.",
    ejemplo: "precios.reduce((s, p) => s + p, 0)",
  },
  {
    id: "desestructurar",
    termino: "desestructurar",
    alias: ["desestructuración", "desestructurando"],
    definicion: "Sacar valores de un objeto o de una lista dándoles nombre en el mismo gesto, en vez de uno a uno.",
    ejemplo: "const { nombre } = cartel",
  },
  {
    id: "promesa",
    termino: "promesa",
    alias: ["promesas"],
    definicion: "Un valor que todavía no ha llegado: llegará luego, o fallará. Es lo que devuelve todo lo que tarda.",
  },
  {
    id: "asincrono",
    termino: "asíncrono",
    alias: ["asíncrona", "asincronía", "async", "await"],
    definicion: "Que no da el resultado al momento. `async` marca una función que espera; `await` es el punto donde espera sin bloquear el resto.",
    ejemplo: "const dato = await pedir()",
  },
  {
    id: "componente",
    termino: "componente",
    alias: ["componentes"],
    definicion: "Una pieza de interfaz con sus datos y su aspecto, que se puede usar muchas veces en la misma página.",
  },
  {
    id: "plantilla",
    termino: "plantilla",
    alias: ["plantillas", "template"],
    definicion: "El HTML de un componente: lo que se ve. Ahí dentro los datos se pintan con dobles llaves.",
    ejemplo: "<p>{{ nombre }}</p>",
  },
  {
    id: "directiva",
    termino: "directiva",
    alias: ["directivas"],
    definicion: "Un atributo de Vue que empieza por `v-` y le dice a la plantilla qué hacer: repetir algo, mostrarlo o esconderlo.",
    ejemplo: "v-for, v-if, v-model",
  },
  {
    id: "prop",
    termino: "prop",
    alias: ["props"],
    definicion: "Un dato que un componente padre le pasa a un hijo. El hijo lo usa pero no lo toca: es de quien lo manda.",
    ejemplo: ":gato=\"gato\"",
  },
  {
    id: "evento",
    termino: "evento",
    alias: ["eventos"],
    definicion: "Un aviso de que ha pasado algo: una pulsación, un cambio en un campo. Se escucha con `@`.",
    ejemplo: "@click=\"guardar\"",
  },
  {
    id: "emitir",
    termino: "emitir",
    alias: ["emite", "emitiendo"],
    definicion: "Que un componente hijo avise hacia arriba de que ha pasado algo, para que el padre decida qué hacer.",
    ejemplo: "$emit('adoptar', gato)",
  },
  {
    id: "reactividad",
    termino: "reactividad",
    alias: ["reactivo", "reactiva"],
    definicion: "Que la pantalla se actualice sola cuando cambian los datos, sin que tengas que repintar nada a mano. Es la idea central de Vue.",
  },
  {
    id: "estado",
    termino: "estado",
    definicion: "Los datos que un componente guarda y que pueden cambiar mientras se usa. Cuando cambian, la pantalla cambia.",
  },
  {
    id: "computed",
    termino: "computed",
    definicion: "Un valor calculado a partir de otros que se guarda y solo se rehace cuando cambia algo de lo que usa.",
  },
  {
    id: "watch",
    termino: "watch",
    alias: ["watcher", "watchers"],
    definicion: "Un vigilante que reacciona cuando un dato concreto cambia, y que recibe el valor nuevo y el viejo.",
  },
  {
    id: "ciclo-de-vida",
    termino: "ciclo de vida",
    definicion: "Los momentos por los que pasa un componente: se crea, se pinta, cambia y se destruye. Puedes engancharte a cada uno.",
    ejemplo: "mounted, beforeDestroy",
  },
  {
    id: "ref",
    termino: "ref",
    alias: ["refs"],
    definicion: "En Vue 3, una caja que envuelve un valor para poder vigilarlo. Dentro del código se abre con `.value`; en la plantilla, no.",
    ejemplo: "const balas = ref(6)",
  },
  {
    id: "setup",
    termino: "setup",
    definicion: "En Vue 3, la función donde se declara todo lo del componente y se devuelve lo que la plantilla vaya a necesitar.",
  },
  {
    id: "composable",
    termino: "composable",
    alias: ["composables"],
    definicion: "Una función normal que crea estado reactivo y lo devuelve, para reutilizarla en varios componentes. Cada llamada crea su propio estado.",
    ejemplo: "usarColonia()",
  },
  {
    id: "dom",
    termino: "DOM",
    definicion: "El árbol de elementos de una página web, tal y como lo tiene el navegador en memoria. Es lo que Vue actualiza por ti.",
  },
  {
    id: "test",
    termino: "test",
    alias: ["tests"],
    definicion: "Una comprobación automática: llama a tu código con unos datos y mira si el resultado es el que debía ser.",
  },
  {
    id: "sandbox",
    termino: "sandbox",
    definicion: "El sitio aislado donde este juego ejecuta tu código, separado del juego en sí, para que nada de lo que escribas pueda romperlo.",
  },
]

export const GLOSARIO_POR_ID = Object.fromEntries(GLOSARIO.map((entrada) => [entrada.id, entrada]))

/**
 * Todas las formas de escribir cada término, de la más larga a la más corta.
 * El orden importa: si "función flecha" fuera después de "función", nunca se
 * detectaría entera.
 */
export const TERMINOS_BUSCABLES = GLOSARIO.flatMap((entrada) =>
  [entrada.termino, ...(entrada.alias ?? [])].map((texto) => ({ texto, id: entrada.id })),
).sort((a, b) => b.texto.length - a.texto.length)
