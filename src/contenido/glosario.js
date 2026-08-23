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
 *
 * ## El lenguaje, que es lo que decide qué se ve
 *
 * Casi todas las definiciones valen para cualquier lenguaje -una variable es un
 * nombre puesto a un valor en todos-, así que se escriben una vez. Lo que cambia
 * es el **ejemplo**, y ahí `ejemplo` puede ser un texto -vale para todos- o
 * `{ js, php }`.
 *
 * Y hay términos que **solo existen en un lenguaje**: `ref` y `computed` son de
 * Vue, y `foreach` y la interpolación son de PHP. Esos declaran `lenguajes` y
 * fuera de ahí no salen ni en el glosario ni enlazados en un enunciado. Sin
 * esto, Sazed explicaba «lista» con `['Wax', 'Marasi']` -sintaxis de
 * JavaScript- en un mundo de PHP.
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
    ejemplo: { js: "console.log('estoy aquí')", php: "echo 'estoy aquí';" },
  },
  {
    id: "variable",
    termino: "variable",
    alias: ["variables"],
    definicion: "Un nombre puesto a un valor para poder usarlo después. Guardas algo, le pones nombre, y a partir de ahí lo llamas por su nombre.",
    ejemplo: { js: "const sombrero = 'bombín'", php: "$sombrero = 'bombín';" },
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
    ejemplo: { js: "let dias = 3", php: "$dias = 3;" },
  },
  {
    id: "asignar",
    termino: "asignar",
    alias: ["asigna", "asignarle", "asignación"],
    definicion: "Meter un valor dentro de una variable con el signo `=`. Ojo: `=` no significa «es igual a», significa «guarda esto ahí».",
    ejemplo: { js: "dias = 4", php: "$dias = 4;" },
  },
  {
    id: "constante",
    termino: "constante",
    alias: ["constantes"],
    definicion: "Una variable a la que no se le puede asignar otro valor después de creada. Se declara con `const` y es lo que se usa por defecto.",
    ejemplo: { js: "const TARIFA = 25", php: "const TARIFA = 25;" },
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
    ejemplo: { js: "{ nombre: 'Wayne', edad: 37 }", php: "new Agente('Wayne')" },
  },
  {
    id: "propiedad",
    termino: "propiedad",
    alias: ["propiedades"],
    definicion: "Cada uno de los valores con nombre que tiene un objeto. Se lee poniendo un punto detrás del objeto.",
    ejemplo: { js: "cartel.nombre", php: "$cartel->nombre" },
  },
  {
    id: "indice",
    termino: "índice",
    alias: ["índices"],
    definicion: "La posición que ocupa algo dentro de una lista. Empiezan en 0: el primer elemento es el índice 0.",
    ejemplo: { js: "gatos[0]", php: "$gatos[0]" },
  },
  {
    id: "nulo",
    termino: "null",
    definicion: "Un valor que significa «aquí no hay nada, y consta que no lo hay». Es distinto de un cero o de un texto vacío.",
  },
  {
    id: "indefinido",
    lenguajes: ["js"],
    termino: "undefined",
    definicion: "Lo que hay dentro de algo que nunca se ha rellenado. Es la forma que tiene JavaScript de decir «esto no existe».",
  },
  {
    id: "plantilla-de-texto",
    lenguajes: ["js"],
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
    ejemplo: { js: "function saludar(nombre) { ... }", php: "function saludar(string $nombre): string { ... }" },
  },
  {
    id: "parametro",
    termino: "parámetro",
    alias: ["parámetros"],
    definicion: "El hueco que una función deja para recibir un dato. Se declara entre los paréntesis del nombre.",
    ejemplo: { js: "function cobrar(dias)", php: "function cobrar(int $dias)" },
  },
  {
    id: "argumento",
    termino: "argumento",
    alias: ["argumentos"],
    definicion: "El valor concreto que le pasas a una función al usarla. El parámetro es el hueco; el argumento, lo que metes en él.",
    ejemplo: { js: "cobrar(4)", php: "cobrar(4);" },
  },
  {
    id: "llamar",
    termino: "llamar",
    alias: ["llama", "llamada", "llamadas", "llamarla", "llamarlo"],
    definicion: "Usar una función, poniendo su nombre y unos paréntesis. Sin los paréntesis no la usas: solo la nombras.",
    ejemplo: { js: "saludar('Wayne')", php: "saludar('Wayne');" },
  },
  {
    id: "devolver",
    termino: "devolver",
    alias: ["devuelve", "devuelva", "devuelven", "return"],
    definicion: "Entregar un valor al que llamó a la función, con `return`. No es lo mismo que escribirlo por consola: `console.log` enseña, `return` entrega.",
    ejemplo: { js: "return dias * 25", php: "return $dias * 25;" },
  },
  {
    id: "funcion-flecha",
    lenguajes: ["js"],
    termino: "función flecha",
    alias: ["funciones flecha", "flecha"],
    definicion: "Una forma corta de escribir una función. Además no tiene `this` propio: usa el del sitio donde está escrita, y por eso funciona dentro de un método.",
    ejemplo: "(n) => n * 2",
  },
  {
    id: "this",
    termino: "this",
    definicion: "Dentro de un método, el objeto sobre el que se está trabajando. Se pierde con facilidad si pasas una función normal a otro sitio.",
    ejemplo: { js: "this.nombres", php: "$this->nombres" },
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
    ejemplo: { js: "lista.push('Peltre')", php: "$lista->añadir('Peltre');" },
  },
  {
    id: "bucle",
    termino: "bucle",
    alias: ["bucles"],
    definicion: "Una instrucción que repite algo muchas veces. Necesita siempre una condición de salida y algo que la acabe cumpliendo.",
    ejemplo: { js: "for (let i = 0; i < 3; i += 1)", php: "for ($i = 0; $i < 3; $i++)" },
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
    ejemplo: { js: "precios.map((p) => p * 2)", php: "array_map(fn($p) => $p * 2, $precios)" },
  },
  {
    id: "filter",
    termino: "filter",
    definicion: "Recorre una lista y devuelve otra solo con los elementos que cumplen lo que le digas.",
    ejemplo: { js: "precios.filter((p) => p > 30)", php: "array_filter($precios, fn($p) => $p > 30)" },
  },
  {
    id: "reduce",
    termino: "reduce",
    definicion: "Recorre una lista y la aplasta en un solo valor: una suma, un total, un texto. El segundo argumento es el valor de partida.",
    ejemplo: { js: "precios.reduce((s, p) => s + p, 0)", php: "array_reduce($precios, fn($s, $p) => $s + $p, 0)" },
  },
  {
    id: "desestructurar",
    lenguajes: ["js"],
    termino: "desestructurar",
    alias: ["desestructuración", "desestructurando"],
    definicion: "Sacar valores de un objeto o de una lista dándoles nombre en el mismo gesto, en vez de uno a uno.",
    ejemplo: "const { nombre } = cartel",
  },
  {
    id: "promesa",
    lenguajes: ["js"],
    termino: "promesa",
    alias: ["promesas"],
    definicion: "Un valor que todavía no ha llegado: llegará luego, o fallará. Es lo que devuelve todo lo que tarda.",
  },
  {
    id: "asincrono",
    lenguajes: ["js"],
    termino: "asíncrono",
    alias: ["asíncrona", "asincronía", "async", "await"],
    definicion: "Que no da el resultado al momento. `async` marca una función que espera; `await` es el punto donde espera sin bloquear el resto.",
    ejemplo: "const dato = await pedir()",
  },
  {
    id: "componente",
    lenguajes: ["js"],
    termino: "componente",
    alias: ["componentes"],
    definicion: "Una pieza de interfaz con sus datos y su aspecto, que se puede usar muchas veces en la misma página.",
  },
  {
    id: "plantilla",
    lenguajes: ["js"],
    termino: "plantilla",
    alias: ["plantillas", "template"],
    definicion: "El HTML de un componente: lo que se ve. Ahí dentro los datos se pintan con dobles llaves.",
    ejemplo: "<p>{{ nombre }}</p>",
  },
  {
    id: "directiva",
    lenguajes: ["js"],
    termino: "directiva",
    alias: ["directivas"],
    definicion: "Un atributo de Vue que empieza por `v-` y le dice a la plantilla qué hacer: repetir algo, mostrarlo o esconderlo.",
    ejemplo: "v-for, v-if, v-model",
  },
  {
    id: "prop",
    lenguajes: ["js"],
    termino: "prop",
    alias: ["props"],
    definicion: "Un dato que un componente padre le pasa a un hijo. El hijo lo usa pero no lo toca: es de quien lo manda.",
    ejemplo: ":gato=\"gato\"",
  },
  {
    id: "evento",
    lenguajes: ["js"],
    termino: "evento",
    alias: ["eventos"],
    definicion: "Un aviso de que ha pasado algo: una pulsación, un cambio en un campo. Se escucha con `@`.",
    ejemplo: "@click=\"guardar\"",
  },
  {
    id: "emitir",
    lenguajes: ["js"],
    termino: "emitir",
    alias: ["emite", "emitiendo"],
    definicion: "Que un componente hijo avise hacia arriba de que ha pasado algo, para que el padre decida qué hacer.",
    ejemplo: "$emit('adoptar', gato)",
  },
  {
    id: "reactividad",
    lenguajes: ["js"],
    termino: "reactividad",
    alias: ["reactivo", "reactiva"],
    definicion: "Que la pantalla se actualice sola cuando cambian los datos, sin que tengas que repintar nada a mano. Es la idea central de Vue.",
  },
  {
    id: "estado",
    lenguajes: ["js"],
    termino: "estado",
    definicion: "Los datos que un componente guarda y que pueden cambiar mientras se usa. Cuando cambian, la pantalla cambia.",
  },
  {
    id: "computed",
    lenguajes: ["js"],
    termino: "computed",
    definicion: "Un valor calculado a partir de otros que se guarda y solo se rehace cuando cambia algo de lo que usa.",
  },
  {
    id: "watch",
    lenguajes: ["js"],
    termino: "watch",
    alias: ["watcher", "watchers"],
    definicion: "Un vigilante que reacciona cuando un dato concreto cambia, y que recibe el valor nuevo y el viejo.",
  },
  {
    id: "ciclo-de-vida",
    lenguajes: ["js"],
    termino: "ciclo de vida",
    definicion: "Los momentos por los que pasa un componente: se crea, se pinta, cambia y se destruye. Puedes engancharte a cada uno.",
    ejemplo: "mounted, beforeDestroy",
  },
  {
    id: "ref",
    lenguajes: ["js"],
    termino: "ref",
    alias: ["refs"],
    definicion: "En Vue 3, una caja que envuelve un valor para poder vigilarlo. Dentro del código se abre con `.value`; en la plantilla, no.",
    ejemplo: "const balas = ref(6)",
  },
  {
    id: "setup",
    lenguajes: ["js"],
    termino: "setup",
    definicion: "En Vue 3, la función donde se declara todo lo del componente y se devuelve lo que la plantilla vaya a necesitar.",
  },
  {
    id: "composable",
    lenguajes: ["js"],
    termino: "composable",
    alias: ["composables"],
    definicion: "Una función normal que crea estado reactivo y lo devuelve, para reutilizarla en varios componentes. Cada llamada crea su propio estado.",
    ejemplo: "usarColonia()",
  },
  {
    id: "dom",
    lenguajes: ["js"],
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
  {
    id: "modulo",
    lenguajes: ["js"],
    termino: "módulo",
    alias: ["módulos"],
    definicion:
      "Un archivo de código. Lo que no saca a propósito con `export` no lo puede usar nadie de fuera, y así dos archivos no se pisan sin querer.",
    ejemplo: "export const TARIFA = 25",
  },
  {
    id: "importar",
    lenguajes: ["js"],
    termino: "importar",
    alias: ["importa", "importación", "import"],
    definicion:
      "Traer a este archivo algo que otro archivo ha sacado. Va siempre arriba del todo, porque se resuelve antes de ejecutar nada.",
    ejemplo: "import { cobrar } from './tarifas.js'",
  },
  {
    id: "exportar",
    lenguajes: ["js"],
    termino: "exportar",
    alias: ["exporta", "exportación", "export"],
    definicion:
      "Dejar que otros archivos usen algo de este. Lo que no se exporta es privado del módulo.",
    ejemplo: "export function cobrar(dias) { ... }",
  },
  {
    id: "json",
    termino: "JSON",
    definicion:
      "El formato en que viajan casi todos los datos entre programas. Es texto, con las claves siempre entre comillas dobles. `JSON.parse` lo convierte en datos y `JSON.stringify` hace el camino de vuelta.",
    ejemplo: { js: '{"ciudad": "Elendel", "agentes": 3}', php: "{\"ciudad\": \"Luthadel\", \"ladrones\": 3}" },
  },
  {
    id: "expresion-regular",
    termino: "expresión regular",
    alias: ["expresiones regulares", "regex"],
    definicion:
      "Una forma de buscar por la pinta que tiene algo, y no por su contenido exacto: tres dígitos seguidos, una palabra en mayúsculas. Va entre barras.",
    ejemplo: { js: "/recompensa: (\\d+)/", php: "preg_match('/recompensa: (\\\\d+)/', $texto, $c)" },
  },
  {
    id: "microtarea",
    lenguajes: ["js"],
    termino: "microtarea",
    alias: ["microtareas"],
    definicion:
      "Lo que queda pendiente por una promesa. Tiene su propia cola y es prioritaria: se vacía entera antes de atender un solo temporizador.",
  },
  {
    id: "cola-de-tareas",
    lenguajes: ["js"],
    termino: "cola de tareas",
    alias: ["bucle de eventos"],
    definicion:
      "Lo que decide en qué orden ocurren las cosas apuntadas para después. JavaScript hace una cosa a la vez: primero termina lo que está haciendo, luego las microtareas, y solo entonces un temporizador.",
  },
  {
    id: "acumulador",
    termino: "acumulador",
    definicion:
      "La variable que va guardando el resultado parcial mientras se recorre algo. En un `reduce` es el primer parámetro, y lo que devuelve una vuelta es lo que recibe la siguiente.",
    ejemplo: { js: "lista.reduce((acumulado, uno) => acumulado + uno, 0)", php: "array_reduce($lista, fn($acumulado, $uno) => $acumulado + $uno, 0)" },
  },
  {
    id: "cierre",
    termino: "cierre",
    alias: ["cierres", "closure"],
    definicion:
      "Una función que sigue usando variables del sitio donde se creó, aunque ese sitio ya haya terminado. Es la forma de tener datos que nadie de fuera puede tocar.",
  },
  {
    id: "instancia",
    termino: "instancia",
    alias: ["instancias"],
    definicion:
      "Un objeto concreto hecho con el molde de una clase. La clase es el molde; la instancia, la pieza. Se crea con `new`.",
    ejemplo: { js: "const wax = new Agente('Wax')", php: "$wax = new Agente('Wax');" },
  },
  {
    id: "referencia",
    termino: "referencia",
    alias: ["referencias", "por referencia"],
    definicion:
      "Lo que de verdad guarda una variable cuando dentro hay un objeto o una lista: no la cosa, sino dónde está. Por eso dos nombres pueden apuntar a lo mismo y tocar uno toca el otro.",
  },
  {
    id: "slot",
    lenguajes: ["js"],
    termino: "slot",
    alias: ["slots"],
    definicion:
      "Un hueco que un componente deja para que quien lo use meta dentro lo que quiera. Es lo que convierte un componente en algo reutilizable de verdad.",
  },
  {
    id: "falsy",
    termino: "falsy",
    alias: ["truthy"],
    definicion:
      "Los seis valores que un `if` considera falsos: `false`, `0`, el texto vacío, `null`, `undefined` y `NaN`. Todo lo demás entra en el `if`, incluidos `'0'`, `[]` y `{}`.",
    ejemplo: { js: "if ([]) { /* entra: una lista vacía no es falsy */ }", php: "if ('0') { /* NO entra: en PHP el texto '0' es falso */ }" },
  },
  {
    id: "expresion",
    termino: "expresión",
    alias: ["expresiones"],
    definicion:
      "Un trozo de código que **vale algo**: un número, una cuenta, una comparación, una llamada. Se puede poner donde se espera un valor.",
    ejemplo: { js: "edad >= 18", php: "$edad >= 18" },
  },
  {
    id: "propagacion",
    lenguajes: ["js"],
    termino: "propagación",
    alias: ["spread"],
    definicion:
      "Esparcir lo que hay dentro de una lista o un objeto en otro sitio, con tres puntos. Es la forma de copiar un nivel y de juntar dos cosas.",
    ejemplo: "const copia = { ...original, rango: 'inspector' }",
  },
  {
    id: "resto",
    lenguajes: ["js"],
    termino: "resto",
    alias: ["rest"],
    definicion:
      "Los mismos tres puntos al revés: recoger en una variable todo lo que no se nombró.",
    ejemplo: "const { nombre, ...loDemas } = ficha",
  },
  {
    id: "ternario",
    termino: "ternario",
    definicion:
      "Un `if` que vale un valor, en una línea: condición, interrogación, lo de sí, dos puntos, lo de no. Para elegir entre dos valores, no para hacer dos cosas.",
    ejemplo: { js: "const tarifa = esSocio ? 10 : 25", php: "$tarifa = $esSocio ? 10 : 25;" },
  },
  {
    id: "guarda",
    termino: "cláusula de guarda",
    alias: ["guarda"],
    definicion:
      "Quitar de en medio los casos raros al principio de una función con un `return`, para que el caso normal quede al final y sin sangrar.",
    ejemplo: { js: "if (!ficha) return null", php: "if (!$ficha) { return null; }" },
  },
  {
    id: "efecto",
    termino: "efecto secundario",
    alias: ["efecto"],
    definicion:
      "Todo lo que una función hace además de devolver un valor: guardar algo, pedir datos, cambiar una variable de fuera. Es lo que hace que llamarla dos veces no dé lo mismo.",
  },
  {
    id: "cache",
    termino: "caché",
    definicion:
      "Guardarse el resultado de un cálculo para no repetirlo mientras no cambie nada de lo que depende. Es lo que hace un `computed`.",
  },
  {
    id: "refactorizar",
    termino: "refactorizar",
    alias: ["refactorización"],
    definicion:
      "Cambiar cómo está escrito algo sin cambiar lo que hace. Si el comportamiento cambia, aunque sea a mejor, ya no es refactorizar.",
  },
  {
    id: "depurar",
    termino: "depurar",
    alias: ["depuración"],
    definicion:
      "Buscar por qué un programa hace algo distinto de lo que esperabas. No es adivinar: es acorralar el fallo mirando qué vale cada cosa en cada paso.",
  },
  {
    id: "clase",
    termino: "clase",
    alias: ["clases"],
    definicion:
      "Un molde para fabricar objetos que traen su propio comportamiento. La clase es el molde; cada objeto hecho con ella es una instancia.",
    ejemplo: "class Agente extends Persona { ... }",
  },
  {
    id: "constructor",
    termino: "constructor",
    definicion:
      "La función que prepara un objeto recién creado. La llama `new` por ti, una sola vez, y es donde se le ponen sus datos.",
    ejemplo: { js: "constructor(nombre) { this.nombre = nombre }", php: "public function __construct(private string $nombre) {}" },
  },
  {
    id: "herencia",
    termino: "herencia",
    alias: ["heredar"],
    definicion:
      "Que una clase se quede con todo lo de otra y añada lo suyo. Solo encaja cuando una **es** un tipo de la otra, no cuando la tiene dentro.",
  },
  {
    id: "getter",
    lenguajes: ["js"],
    termino: "getter",
    alias: ["getters"],
    definicion:
      "Una función de una clase que se lee como si fuera un dato, sin paréntesis. Para lo que se puede deducir de lo que ya hay.",
    ejemplo: "get caro() { return this.precio > 20 }",
  },
  {
    id: "conjunto",
    lenguajes: ["js"],
    termino: "Set",
    definicion:
      "Una colección sin repetidos. Preguntarle si algo está es inmediato, por muchos elementos que tenga.",
    ejemplo: "const sinRepetir = [...new Set(lista)]",
  },
  {
    id: "diccionario",
    lenguajes: ["js"],
    termino: "diccionario",
    definicion:
      "Una colección de pares clave-valor. En JavaScript, un objeto normal si las claves son texto y las conoces, o un `Map` si admiten cualquier cosa y crecen. (No lleva alias `Map` a propósito: chocaría con el método `map` de las listas, que es otra cosa.)",
    ejemplo: "porAgente.set(wax, ['Bleeder'])",
  },
  {
    id: "ruta",
    lenguajes: ["js"],
    termino: "ruta",
    alias: ["rutas", "enrutador"],
    definicion:
      "La dirección que identifica una pantalla. Es lo que permite compartir un enlace, volver atrás y recargar sin perder dónde estabas.",
    ejemplo: "{ path: '/reto/:retoId', component: Reto }",
  },
  {
    id: "almacen",
    lenguajes: ["js"],
    termino: "almacén",
    alias: ["almacenes"],
    definicion:
      "Un sitio donde vive un dato que miran varios componentes que no son padre e hijo. Por debajo es un objeto reactivo declarado fuera de toda función.",
  },
  {
    id: "gancho",
    lenguajes: ["js"],
    termino: "gancho",
    alias: ["ganchos"],
    definicion:
      "Una función que le das a Vue para que la llame en un momento concreto de la vida de un componente: al montarse, al desaparecer.",
    ejemplo: "onMounted(() => caja.value.focus())",
  },
  {
    id: "funcion-de-vuelta",
    termino: "función de vuelta",
    alias: ["callback"],
    definicion:
      "Una función que le pasas a otra para que la llame ella cuando toque. Quien la recibe decide cuándo y con qué argumentos.",
    ejemplo: { js: "lista.map((n) => n * 2)", php: "array_map(fn($n) => $n * 2, $lista)" },
  },
  {
    id: "inmutable",
    termino: "inmutable",
    alias: ["inmutabilidad"],
    definicion:
      "La costumbre de no tocar lo que ya existe y devolver algo nuevo en su lugar. Evita de golpe la clase entera de fallos de las copias que no eran copias.",
    ejemplo: { js: "return { ...agente, rango: 'inspector' }", php: "$copia = [...$agente, 'rango' => 'inspector'];" },
  },
  {
    id: "traza",
    termino: "traza",
    alias: ["trazar"],
    definicion:
      "Seguir la ejecución paso a paso anotando qué vale cada cosa. También, la lista de llamadas que trae un error, de la más reciente a la más antigua.",
  },
  // ---- De PHP -------------------------------------------------------------
  {
    id: "echo",
    termino: "echo",
    lenguajes: ["php"],
    definicion: "La orden de PHP para escribir algo en la salida. No es una función: no necesita paréntesis, y acaba en punto y coma como todo.",
    ejemplo: "echo 'Los Pozos de Hathsin';",
  },
  {
    id: "concatenar",
    termino: "concatenar",
    alias: ["concatenación", "pegar textos"],
    lenguajes: ["php"],
    definicion: "Juntar dos textos para formar uno. En PHP se hace con un punto, no con un `+`: el `+` es para sumar números y con textos que no son números da error.",
    ejemplo: "'Hola, ' . $nombre",
  },
  {
    id: "interpolacion",
    termino: "interpolación",
    alias: ["interpolar"],
    lenguajes: ["php"],
    definicion: "Que PHP mire dentro de un texto y sustituya las variables que encuentre. Pasa solo con comillas dobles; con comillas simples el texto sale tal cual, con el dólar y todo.",
    ejemplo: '"Llevo $cuantos de $metal"',
  },
  {
    id: "foreach",
    termino: "foreach",
    lenguajes: ["php"],
    definicion: "El bucle de PHP para recorrer una lista de principio a fin, sin llevar la cuenta a mano. Con `as` se le pone nombre a cada elemento, y con `=>` se saca también su clave.",
    ejemplo: "foreach ($inventario as $metal => $cuantos) { ... }",
  },
  {
    id: "array-asociativo",
    termino: "array asociativo",
    alias: ["arrays asociativos", "array con clave"],
    lenguajes: ["php"],
    definicion: "Una lista en la que cada elemento tiene un nombre en vez de una posición. Es la estructura con la que se trabaja de verdad en PHP: lo que en otros lenguajes serían un objeto y un diccionario, aquí son esto.",
    ejemplo: "['acero' => 4, 'peltre' => 2]",
  },
  {
    id: "clave",
    termino: "clave",
    alias: ["claves"],
    lenguajes: ["php"],
    definicion: "El nombre con el que se guarda un valor dentro de un array asociativo. No se repite: asignar dos veces la misma clave sobrescribe lo que hubiera.",
    ejemplo: "$inventario['acero']",
  },
  {
    id: "isset",
    termino: "isset",
    lenguajes: ["php"],
    definicion: "Pregunta si una variable o una clave existe **y** no vale null. Es lo que hay que usar antes de leer algo que puede no estar, porque pedir una clave que no existe da un aviso.",
    ejemplo: "if (isset($inventario['oro'])) { ... }",
  },
  {
    id: "coalescencia-php",
    termino: "??",
    alias: ["operador de coalescencia"],
    lenguajes: ["php"],
    definicion: "«Lo que haya a la izquierda, y si no hay nada, lo de la derecha.» Sirve para leer una clave que puede no existir sin avisos y sin un `if`.",
    ejemplo: "$cuantos = $inventario[$metal] ?? 0;",
  },
  {
    id: "var-dump",
    termino: "var_dump",
    lenguajes: ["php"],
    definicion: "Imprime el tipo y el contenido de lo que le des, con detalle. Es la herramienta con la que se arregla la mitad de lo que se rompe: `echo` de un `true` y de un `'1'` se ven igual, y `var_dump` los distingue.",
    ejemplo: "var_dump($cuantos);   // int(3)",
  },
  {
    id: "comparacion-estricta",
    termino: "comparación estricta",
    alias: ["===", "!=="],
    lenguajes: ["php"],
    definicion: "Comparar exigiendo que el tipo también coincida. `1 == '1'` es cierto porque PHP convierte; `1 === '1'` es falso. La costumbre buena es usar `===` por defecto.",
    ejemplo: "if ($cantidad === 0) { ... }",
  },
  {
    id: "intdiv",
    termino: "intdiv",
    lenguajes: ["php"],
    definicion: "Divide dos enteros y se queda con la parte entera, sin decimales. Es lo que se usa para porcentajes y repartos cuando el resultado tiene que ser un número redondo.",
    ejemplo: "intdiv($importe * 10, 100)",
  },
  {
    id: "valor-por-defecto",
    termino: "valor por defecto",
    alias: ["parámetro opcional"],
    definicion: "Un valor que un parámetro toma cuando quien llama a la función no lo pasa. Los parámetros que lo tienen van al final: los argumentos se pasan por posición y no hay forma de saltarse uno de en medio.",
    ejemplo: { js: 'function comision(importe, porcentaje = 10)', php: 'function comision(int $importe, int $porcentaje = 10)' },
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

/** Si esa entrada se enseña en ese lenguaje. Sin `lenguajes`, en todos. */
const esDe = (entrada, lenguaje) => !entrada.lenguajes || entrada.lenguajes.includes(lenguaje)

/** El ejemplo que le toca a ese lenguaje, ya como texto. */
const ejemploDe = (entrada, lenguaje) =>
  typeof entrada.ejemplo === 'object' && entrada.ejemplo !== null
    ? entrada.ejemplo[lenguaje] ?? null
    : entrada.ejemplo ?? null

/**
 * El glosario tal y como se lee desde un lenguaje: sin los términos que allí no
 * existen y con el ejemplo que le corresponde.
 *
 * Se guarda lo calculado porque lo piden el panel, la página del glosario y el
 * enlazado de cada enunciado, y son cien entradas cada vez.
 */
const porLenguaje = new Map()

export function glosarioDe(lenguaje = 'js') {
  if (!porLenguaje.has(lenguaje)) {
    porLenguaje.set(
      lenguaje,
      GLOSARIO.filter((entrada) => esDe(entrada, lenguaje)).map((entrada) => ({
        ...entrada,
        ejemplo: ejemploDe(entrada, lenguaje),
      })),
    )
  }
  return porLenguaje.get(lenguaje)
}

/** Una entrada vista desde un lenguaje, o null si allí no existe. */
export function entradaDe(id, lenguaje = 'js') {
  return glosarioDe(lenguaje).find((entrada) => entrada.id === id) ?? null
}

/**
 * Los términos que se marcan en un texto de ese lenguaje.
 *
 * Mismo orden que `TERMINOS_BUSCABLES` -del más largo al más corto, para que
 * «función flecha» se detecte entera antes que «función»- y sin los que no son
 * de ahí.
 */
const buscablesPorLenguaje = new Map()

export function terminosBuscablesDe(lenguaje = 'js') {
  if (!buscablesPorLenguaje.has(lenguaje)) {
    buscablesPorLenguaje.set(
      lenguaje,
      glosarioDe(lenguaje)
        .flatMap((entrada) =>
          [entrada.termino, ...(entrada.alias ?? [])].map((texto) => ({ texto, id: entrada.id })),
        )
        .sort((a, b) => b.texto.length - a.texto.length),
    )
  }
  return buscablesPorLenguaje.get(lenguaje)
}
