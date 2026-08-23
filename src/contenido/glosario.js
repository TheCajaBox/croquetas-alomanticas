import { ENTORNOS } from '../motor/protocolo.js'
import { ITINERARIOS, ITINERARIOS_POR_ID } from './itinerarios.js'
import { MUNDOS_POR_ID, mundosDelItinerario } from './mundos.js'

/**
 * El glosario de Steris.
 *
 * Cada palabra técnica que sale en el juego, explicada sin usar otras palabras
 * técnicas sin explicar. Los términos se detectan solos en los enunciados y en
 * los apuntes -ver src/motor/enlazarTerminos.js- y se pueden pulsar allí donde
 * aparezcan, sin salir del reto.
 *
 * ## Cada término tiene su sitio, y antes de su sitio no existe
 *
 * Cada entrada declara `desde`: **en qué mundo se enseña**, camino por camino.
 * `{ era2: 'taller', era1: 'fundacion' }` significa que «clase» se explica en El
 * taller si vienes por JavaScript y en La Fundación si vienes por PHP, y que
 * antes de esos mundos no sale: ni en el glosario, ni enlazada en un enunciado,
 * ni pulsable. Un camino que no aparece en `desde` es un camino donde ese
 * término no existe -`ref` es de Vue, `foreach` es de PHP-.
 *
 * Esto sustituye a la etiqueta de lenguaje que había antes, y no es lo mismo:
 * el lenguaje separaba `foreach` de `ref`, pero dejaba las cien entradas
 * disponibles desde el primer reto. Medido en La Ceniza, el primer mundo de PHP:
 * el glosario ofrecía 65 términos y **27 de ellos solo se enseñan en la segunda
 * era** -`map`, `clase`, `herencia`, `sandbox`, `cache`-. Alguien en su tercer
 * reto de la vida podía pulsar «herencia» y leer una definición de algo que no
 * verá en cinco mundos. Ahora en La Ceniza hay 23.
 *
 * El mundo de cada término está escrito contra el temario real de su mundo -los
 * títulos de sus doce retos- y no contra la primera vez que la palabra aparece
 * en un texto: `clase` se menciona de pasada el primer día y se enseña en El
 * taller, cuatro mundos después.
 *
 * ## Listado y alcanzable no son lo mismo
 *
 * `desde` decide lo que se **lista** y lo que se **enlaza**. Por id sigue
 * alcanzando cualquier entrada (`entradaDe`), porque una definición puede citar
 * un término de más adelante y dejar el enlace muerto sería peor.
 *
 * Los `alias` son las otras formas de escribir lo mismo: plurales, sinónimos y
 * el nombre en inglés, que es como se va a encontrar el término por ahí fuera.
 * Y el **ejemplo** cambia con el lenguaje: `ejemplo` puede ser un texto -vale
 * para todos- o `{ js, php }`. Sin eso, Sazed explicaba «lista» con
 * `['Wax', 'Marasi']` -sintaxis de JavaScript- en un mundo de PHP.
 */
export const GLOSARIO = [
  {
    id: "programa",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "programa",
    alias: ["programas"],
    definicion: "Una lista de órdenes que el ordenador ejecuta una detrás de otra, de arriba abajo. Eso es todo lo que es.",
  },
  {
    id: "codigo",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "código",
    definicion: "El texto de un programa. Se escribe con unas reglas muy estrictas: si sobra o falta un símbolo, el ordenador no lo entiende y se para.",
  },
  {
    id: "ejecutar",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "ejecutar",
    alias: ["ejecuta", "ejecutarlo", "ejecución"],
    definicion: "Decirle al ordenador que haga lo que pone en el código, línea a línea y desde arriba.",
  },
  {
    id: "consola",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "consola",
    definicion: "El sitio donde el programa escribe mensajes para que tú los leas. No los ve el usuario del programa: son para quien lo está haciendo.",
    ejemplo: { js: "console.log('estoy aquí')", php: "echo 'estoy aquí';" },
  },
  {
    id: "variable",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "variable",
    alias: ["variables"],
    definicion: "Un nombre puesto a un valor para poder usarlo después. Guardas algo, le pones nombre, y a partir de ahí lo llamas por su nombre.",
    ejemplo: { js: "const sombrero = 'bombín'", php: "$sombrero = 'bombín';" },
  },
  {
    id: "valor",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "valor",
    alias: ["valores"],
    definicion: "Un dato concreto: un texto, un número, una lista. Lo que se guarda dentro de una variable.",
  },
  {
    id: "declarar",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "declarar",
    alias: ["declara", "declaras", "declaración", "declarada", "declarado"],
    definicion: "Crear una variable por primera vez, diciendo cómo se llama. Se hace una sola vez; después ya solo se usa.",
    ejemplo: { js: "let dias = 3", php: "$dias = 3;" },
  },
  {
    id: "asignar",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "asignar",
    alias: ["asigna", "asignarle", "asignación"],
    definicion: "Meter un valor dentro de una variable con el signo `=`. Ojo: `=` no significa «es igual a», significa «guarda esto ahí».",
    ejemplo: { js: "dias = 4", php: "$dias = 4;" },
  },
  {
    id: "constante",
    desde: { era2: 'primer-dia', era1: 'kandra' },
    termino: "constante",
    alias: ["constantes"],
    definicion: "Una variable a la que no se le puede asignar otro valor después de creada. Se declara con `const` y es lo que se usa por defecto.",
    ejemplo: { js: "const TARIFA = 25", php: "const TARIFA = 25;" },
  },
  {
    id: "tipo",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "tipo",
    alias: ["tipos"],
    definicion: "La clase de dato que es un valor: texto, número, booleano, lista u objeto. Importa porque no todos se pueden operar igual.",
  },
  {
    id: "texto",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "texto",
    alias: ["textos", "cadena", "cadenas", "string"],
    definicion: "Un valor formado por caracteres. Va siempre entre comillas. `42` es un número; `'42'` es un texto que parece un número.",
    ejemplo: { js: "'Wayne'", php: "'Kelsier'" },
  },
  {
    id: "numero",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "número",
    alias: ["números"],
    definicion: "Un valor con el que se puede hacer cuentas. Se escribe sin comillas y sin separadores de miles.",
    ejemplo: "500",
  },
  {
    id: "booleano",
    desde: { era2: 'comisaria', era1: 'ceniza' },
    termino: "booleano",
    alias: ["booleanos"],
    definicion: "Un valor que solo puede ser `true` (verdadero) o `false` (falso). Es lo que devuelven las comparaciones.",
    ejemplo: "true",
  },
  {
    id: "lista",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "lista",
    alias: ["listas", "array", "arrays"],
    definicion: "Varios valores guardados en orden, entre corchetes. Cada uno ocupa una posición, y la primera posición es la 0, no la 1.",
    ejemplo: { js: "['Wax', 'Marasi']", php: "['Kelsier', 'Brisa']" },
  },
  {
    id: "objeto",
    desde: { era2: 'comisaria', era1: 'fundacion' },
    termino: "objeto",
    alias: ["objetos"],
    definicion: "Varios valores guardados con nombre, entre llaves. En vez de por posición, a cada uno se llega por su nombre.",
    ejemplo: { js: "{ nombre: 'Wayne', edad: 37 }", php: "new Agente('Kelsier')" },
  },
  {
    id: "propiedad",
    desde: { era2: 'comisaria', era1: 'fundacion' },
    termino: "propiedad",
    alias: ["propiedades"],
    definicion: "Cada uno de los valores con nombre que tiene un objeto. Se lee poniendo un punto detrás del objeto.",
    ejemplo: { js: "cartel.nombre", php: "$cartel->nombre" },
  },
  {
    id: "indice",
    desde: { era2: 'comisaria', era1: 'ceniza' },
    termino: "índice",
    alias: ["índices"],
    definicion: "La posición que ocupa algo dentro de una lista. Empiezan en 0: el primer elemento es el índice 0.",
    ejemplo: { js: "gatos[0]", php: "$gatos[0]" },
  },
  {
    id: "nulo",
    desde: { era2: 'comisaria', era1: 'ceniza' },
    termino: "null",
    definicion: "Un valor que significa «aquí no hay nada, y consta que no lo hay». Es distinto de un cero o de un texto vacío.",
  },
  {
    id: "indefinido",
    desde: { era2: 'primer-dia' },
    termino: "undefined",
    definicion: "Lo que hay dentro de algo que nunca se ha rellenado. Es la forma que tiene JavaScript de decir «esto no existe».",
  },
  {
    id: "plantilla-de-texto",
    desde: { era2: 'primer-dia' },
    termino: "plantilla de texto",
    alias: ["plantillas de texto"],
    definicion: "Un texto entre comillas invertidas que permite meter valores dentro con `${...}`. Con comillas normales no funciona.",
    ejemplo: "`Hola, ${nombre}`",
  },
  {
    id: "funcion",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "función",
    alias: ["funciones"],
    definicion: "Un trozo de programa con nombre, que se escribe una vez y se usa tantas veces como haga falta.",
    ejemplo: { js: "function saludar(nombre) { ... }", php: "function saludar(string $nombre): string { ... }" },
  },
  {
    id: "parametro",
    desde: { era2: 'primer-dia', era1: 'tripulacion' },
    termino: "parámetro",
    alias: ["parámetros"],
    definicion: "El hueco que una función deja para recibir un dato. Se declara entre los paréntesis del nombre.",
    ejemplo: { js: "function cobrar(dias)", php: "function cobrar(int $dias)" },
  },
  {
    id: "argumento",
    desde: { era2: 'primer-dia', era1: 'tripulacion' },
    termino: "argumento",
    alias: ["argumentos"],
    definicion: "El valor concreto que le pasas a una función al usarla. El parámetro es el hueco; el argumento, lo que metes en él.",
    ejemplo: { js: "cobrar(4)", php: "cobrar(4);" },
  },
  {
    id: "llamar",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "llamar",
    alias: ["llama", "llamada", "llamadas", "llamarla", "llamarlo"],
    definicion: "Usar una función, poniendo su nombre y unos paréntesis. Sin los paréntesis no la usas: solo la nombras.",
    ejemplo: { js: "saludar('Wayne')", php: "saludar('Kelsier');" },
  },
  {
    id: "devolver",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "devolver",
    alias: ["devuelve", "devuelva", "devuelven", "return"],
    definicion: "Entregar un valor al que llamó a la función, con `return`. No es lo mismo que escribirlo por consola: `console.log` enseña, `return` entrega.",
    ejemplo: { js: "return dias * 25", php: "return $dias * 25;" },
  },
  {
    id: "funcion-flecha",
    desde: { era2: 'es6' , era1: 'pozo' },
    termino: "función flecha",
    alias: ["funciones flecha", "flecha"],
    definicion: "Una forma corta de escribir una función. Además no tiene `this` propio: usa el del sitio donde está escrita, y por eso funciona dentro de un método.",
    ejemplo: "(n) => n * 2",
  },
  {
    id: "this",
    desde: { era2: 'es6', era1: 'fundacion' },
    termino: "this",
    definicion: "Dentro de un método, el objeto sobre el que se está trabajando. Se pierde con facilidad si pasas una función normal a otro sitio.",
    ejemplo: { js: "this.nombres", php: "$this->nombres" },
  },
  {
    id: "ambito",
    desde: { era2: 'es6', era1: 'tripulacion' },
    termino: "ámbito",
    alias: ["alcance", "scope"],
    definicion: "La zona del programa donde una variable existe. Fuera de su ámbito es como si no estuviera declarada.",
  },
  {
    id: "metodo",
    desde: { era2: 'es6', era1: 'fundacion' },
    termino: "método",
    alias: ["métodos"],
    definicion: "Una función que vive dentro de un objeto. Se usa poniendo un punto: `objeto.metodo()`.",
    ejemplo: { js: "lista.push('Peltre')", php: "$lista->añadir('Peltre');" },
  },
  {
    id: "bucle",
    desde: { era2: 'comisaria', era1: 'ceniza' },
    termino: "bucle",
    alias: ["bucles"],
    definicion: "Una instrucción que repite algo muchas veces. Necesita siempre una condición de salida y algo que la acabe cumpliendo.",
    ejemplo: { js: "for (let i = 0; i < 3; i += 1)", php: "for ($i = 0; $i < 3; $i++)" },
  },
  {
    id: "bucle-infinito",
    desde: { era2: 'comisaria', era1: 'tripulacion' },
    termino: "bucle infinito",
    alias: ["bucles infinitos"],
    definicion: "Un bucle al que se le ha olvidado la salida y repite para siempre. En este juego se corta solo a las cien mil vueltas.",
    ejemplo: "while (true) {}",
  },
  {
    id: "map",
    desde: { era2: 'es6' , era1: 'pozo' },
    termino: "map",
    definicion: "Recorre una lista y devuelve otra lista nueva con cada elemento transformado. No toca la original.",
    ejemplo: { js: "precios.map((p) => p * 2)", php: "array_map(fn($p) => $p * 2, $precios)" },
  },
  {
    id: "filter",
    desde: { era2: 'es6' , era1: 'pozo' },
    termino: "filter",
    definicion: "Recorre una lista y devuelve otra solo con los elementos que cumplen lo que le digas.",
    ejemplo: { js: "precios.filter((p) => p > 30)", php: "array_filter($precios, fn($p) => $p > 30)" },
  },
  {
    id: "reduce",
    desde: { era2: 'es6' , era1: 'pozo' },
    termino: "reduce",
    definicion: "Recorre una lista y la aplasta en un solo valor: una suma, un total, un texto. El segundo argumento es el valor de partida.",
    ejemplo: { js: "precios.reduce((s, p) => s + p, 0)", php: "array_reduce($precios, fn($s, $p) => $s + $p, 0)" },
  },
  {
    id: "desestructurar",
    desde: { era2: 'es6' },
    termino: "desestructurar",
    alias: ["desestructuración", "desestructurando"],
    definicion: "Sacar valores de un objeto o de una lista dándoles nombre en el mismo gesto, en vez de uno a uno.",
    ejemplo: "const { nombre } = cartel",
  },
  {
    id: "promesa",
    desde: { era2: 'es6' },
    termino: "promesa",
    alias: ["promesas"],
    definicion: "Un valor que todavía no ha llegado: llegará luego, o fallará. Es lo que devuelve todo lo que tarda.",
  },
  {
    id: "asincrono",
    desde: { era2: 'es6' },
    termino: "asíncrono",
    alias: ["asíncrona", "asincronía", "async", "await"],
    definicion: "Que no da el resultado al momento. `async` marca una función que espera; `await` es el punto donde espera sin bloquear el resto.",
    ejemplo: "const dato = await pedir()",
  },
  {
    id: "componente",
    desde: { era2: 'vue2' },
    termino: "componente",
    alias: ["componentes"],
    definicion: "Una pieza de interfaz con sus datos y su aspecto, que se puede usar muchas veces en la misma página.",
  },
  {
    id: "plantilla",
    desde: { era2: 'vue2' },
    termino: "plantilla",
    alias: ["plantillas", "template"],
    definicion: "El HTML de un componente: lo que se ve. Ahí dentro los datos se pintan con dobles llaves.",
    ejemplo: "<p>{{ nombre }}</p>",
  },
  {
    id: "directiva",
    desde: { era2: 'vue2' },
    termino: "directiva",
    alias: ["directivas"],
    definicion: "Un atributo de Vue que empieza por `v-` y le dice a la plantilla qué hacer: repetir algo, mostrarlo o esconderlo.",
    ejemplo: "v-for, v-if, v-model",
  },
  {
    id: "prop",
    desde: { era2: 'vue2' },
    termino: "prop",
    alias: ["props"],
    definicion: "Un dato que un componente padre le pasa a un hijo. El hijo lo usa pero no lo toca: es de quien lo manda.",
    ejemplo: ":gato=\"gato\"",
  },
  {
    id: "evento",
    desde: { era2: 'vue2' },
    termino: "evento",
    alias: ["eventos"],
    definicion: "Un aviso de que ha pasado algo: una pulsación, un cambio en un campo. Se escucha con `@`.",
    ejemplo: "@click=\"guardar\"",
  },
  {
    id: "emitir",
    desde: { era2: 'vue2' },
    termino: "emitir",
    alias: ["emite", "emitiendo"],
    definicion: "Que un componente hijo avise hacia arriba de que ha pasado algo, para que el padre decida qué hacer.",
    ejemplo: "$emit('adoptar', gato)",
  },
  {
    id: "reactividad",
    desde: { era2: 'vue2' },
    termino: "reactividad",
    alias: ["reactivo", "reactiva"],
    definicion: "Que la pantalla se actualice sola cuando cambian los datos, sin que tengas que repintar nada a mano. Es la idea central de Vue.",
  },
  {
    id: "estado",
    desde: { era2: 'vue2' },
    termino: "estado",
    definicion: "Los datos que un componente guarda y que pueden cambiar mientras se usa. Cuando cambian, la pantalla cambia.",
  },
  {
    id: "computed",
    desde: { era2: 'vue2' },
    termino: "computed",
    definicion: "Un valor calculado a partir de otros que se guarda y solo se rehace cuando cambia algo de lo que usa.",
  },
  {
    id: "watch",
    desde: { era2: 'vue2' },
    termino: "watch",
    alias: ["watcher", "watchers"],
    definicion: "Un vigilante que reacciona cuando un dato concreto cambia, y que recibe el valor nuevo y el viejo.",
  },
  {
    id: "ciclo-de-vida",
    desde: { era2: 'vue2' },
    termino: "ciclo de vida",
    definicion: "Los momentos por los que pasa un componente: se crea, se pinta, cambia y se destruye. Puedes engancharte a cada uno.",
    ejemplo: "mounted, beforeDestroy",
  },
  {
    id: "ref",
    desde: { era2: 'vue3' },
    termino: "ref",
    alias: ["refs"],
    definicion: "En Vue 3, una caja que envuelve un valor para poder vigilarlo. Dentro del código se abre con `.value`; en la plantilla, no.",
    ejemplo: "const balas = ref(6)",
  },
  {
    id: "setup",
    desde: { era2: 'vue3' },
    termino: "setup",
    definicion: "En Vue 3, la función donde se declara todo lo del componente y se devuelve lo que la plantilla vaya a necesitar.",
  },
  {
    id: "composable",
    desde: { era2: 'vue3' },
    termino: "composable",
    alias: ["composables"],
    definicion: "Una función normal que crea estado reactivo y lo devuelve, para reutilizarla en varios componentes. Cada llamada crea su propio estado.",
    ejemplo: "usarColonia()",
  },
  {
    id: "dom",
    desde: { era2: 'vue2' },
    termino: "DOM",
    definicion: "El árbol de elementos de una página web, tal y como lo tiene el navegador en memoria. Es lo que Vue actualiza por ti.",
  },
  {
    id: "test",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "test",
    alias: ["tests"],
    definicion: "Una comprobación automática: llama a tu código con unos datos y mira si el resultado es el que debía ser.",
  },
  {
    id: "sandbox",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "sandbox",
    definicion: "El sitio aislado donde este juego ejecuta tu código, separado del juego en sí, para que nada de lo que escribas pueda romperlo.",
  },
  {
    id: "modulo",
    desde: { era2: 'elendel' },
    termino: "módulo",
    alias: ["módulos"],
    definicion:
      "Un archivo de código. Lo que no saca a propósito con `export` no lo puede usar nadie de fuera, y así dos archivos no se pisan sin querer.",
    ejemplo: "export const TARIFA = 25",
  },
  {
    id: "importar",
    desde: { era2: 'elendel' },
    termino: "importar",
    alias: ["importa", "importación", "import"],
    definicion:
      "Traer a este archivo algo que otro archivo ha sacado. Va siempre arriba del todo, porque se resuelve antes de ejecutar nada.",
    ejemplo: "import { cobrar } from './tarifas.js'",
  },
  {
    id: "exportar",
    desde: { era2: 'elendel' },
    termino: "exportar",
    alias: ["exporta", "exportación", "export"],
    definicion:
      "Dejar que otros archivos usen algo de este. Lo que no se exporta es privado del módulo.",
    ejemplo: "export function cobrar(dias) { ... }",
  },
  {
    id: "json",
    desde: { era2: 'elendel' },
    termino: "JSON",
    definicion:
      "El formato en que viajan casi todos los datos entre programas. Es texto, con las claves siempre entre comillas dobles. `JSON.parse` lo convierte en datos y `JSON.stringify` hace el camino de vuelta.",
    ejemplo: { js: '{"ciudad": "Elendel", "agentes": 3}', php: "{\"ciudad\": \"Luthadel\", \"ladrones\": 3}" },
  },
  {
    id: "expresion-regular",
    desde: { era2: 'elendel' },
    termino: "expresión regular",
    alias: ["expresiones regulares", "regex"],
    definicion:
      "Una forma de buscar por la pinta que tiene algo, y no por su contenido exacto: tres dígitos seguidos, una palabra en mayúsculas. Va entre barras.",
    ejemplo: { js: "/recompensa: (\\d+)/", php: "preg_match('/recompensa: (\\\\d+)/', $texto, $c)" },
  },
  {
    id: "microtarea",
    desde: { era2: 'elendel' },
    termino: "microtarea",
    alias: ["microtareas"],
    definicion:
      "Lo que queda pendiente por una promesa. Tiene su propia cola y es prioritaria: se vacía entera antes de atender un solo temporizador.",
  },
  {
    id: "cola-de-tareas",
    desde: { era2: 'elendel' },
    termino: "cola de tareas",
    alias: ["bucle de eventos"],
    definicion:
      "Lo que decide en qué orden ocurren las cosas apuntadas para después. JavaScript hace una cosa a la vez: primero termina lo que está haciendo, luego las microtareas, y solo entonces un temporizador.",
  },
  {
    id: "acumulador",
    desde: { era2: 'comisaria', era1: 'ceniza' },
    termino: "acumulador",
    definicion:
      "La variable que va guardando el resultado parcial mientras se recorre algo. En un `reduce` es el primer parámetro, y lo que devuelve una vuelta es lo que recibe la siguiente.",
    ejemplo: { js: "lista.reduce((acumulado, uno) => acumulado + uno, 0)", php: "array_reduce($lista, fn($acumulado, $uno) => $acumulado + $uno, 0)" },
  },
  {
    id: "cierre",
    desde: { era2: 'taller' },
    termino: "cierre",
    alias: ["cierres", "closure"],
    definicion:
      "Una función que sigue usando variables del sitio donde se creó, aunque ese sitio ya haya terminado. Es la forma de tener datos que nadie de fuera puede tocar.",
  },
  {
    id: "instancia",
    desde: { era2: 'taller', era1: 'fundacion' },
    termino: "instancia",
    alias: ["instancias"],
    definicion:
      "Un objeto concreto hecho con el molde de una clase. La clase es el molde; la instancia, la pieza. Se crea con `new`.",
    ejemplo: { js: "const wax = new Agente('Wax')", php: "$brisa = new Agente('Brisa');" },
  },
  {
    id: "referencia",
    desde: { era2: 'taller', era1: 'fundacion' },
    termino: "referencia",
    alias: ["referencias", "por referencia"],
    definicion:
      "Lo que de verdad guarda una variable cuando dentro hay un objeto o una lista: no la cosa, sino dónde está. Por eso dos nombres pueden apuntar a lo mismo y tocar uno toca el otro.",
  },
  {
    id: "slot",
    desde: { era2: 'vue3' },
    termino: "slot",
    alias: ["slots"],
    definicion:
      "Un hueco que un componente deja para que quien lo use meta dentro lo que quiera. Es lo que convierte un componente en algo reutilizable de verdad.",
  },
  {
    id: "falsy",
    desde: { era2: 'comisaria', era1: 'tripulacion' },
    termino: "falsy",
    alias: ["truthy"],
    definicion:
      "Los seis valores que un `if` considera falsos: `false`, `0`, el texto vacío, `null`, `undefined` y `NaN`. Todo lo demás entra en el `if`, incluidos `'0'`, `[]` y `{}`.",
    ejemplo: { js: "if ([]) { /* entra: una lista vacía no es falsy */ }", php: "if ('0') { /* NO entra: en PHP el texto '0' es falso */ }" },
  },
  {
    id: "expresion",
    desde: { era2: 'primer-dia', era1: 'ceniza' },
    termino: "expresión",
    alias: ["expresiones"],
    definicion:
      "Un trozo de código que **vale algo**: un número, una cuenta, una comparación, una llamada. Se puede poner donde se espera un valor.",
    ejemplo: { js: "edad >= 18", php: "$edad >= 18" },
  },
  {
    id: "propagacion",
    desde: { era2: 'vue2' },
    termino: "propagación",
    alias: ["spread"],
    definicion:
      "Esparcir lo que hay dentro de una lista o un objeto en otro sitio, con tres puntos. Es la forma de copiar un nivel y de juntar dos cosas.",
    ejemplo: "const copia = { ...original, rango: 'inspector' }",
  },
  {
    id: "resto",
    desde: { era2: 'es6' },
    termino: "resto",
    alias: ["rest"],
    definicion:
      "Los mismos tres puntos al revés: recoger en una variable todo lo que no se nombró.",
    ejemplo: "const { nombre, ...loDemas } = ficha",
  },
  {
    id: "ternario",
    desde: { era2: 'comisaria', era1: 'tripulacion' },
    termino: "ternario",
    definicion:
      "Un `if` que vale un valor, en una línea: condición, interrogación, lo de sí, dos puntos, lo de no. Para elegir entre dos valores, no para hacer dos cosas.",
    ejemplo: { js: "const tarifa = esSocio ? 10 : 25", php: "$tarifa = $esSocio ? 10 : 25;" },
  },
  {
    id: "guarda",
    desde: { era2: 'comisaria', era1: 'tripulacion' },
    termino: "cláusula de guarda",
    alias: ["guarda"],
    definicion:
      "Quitar de en medio los casos raros al principio de una función con un `return`, para que el caso normal quede al final y sin sangrar.",
    ejemplo: { js: "if (!ficha) return null", php: "if (!$ficha) { return null; }" },
  },
  {
    id: "efecto",
    desde: { era2: 'vue3' },
    termino: "efecto secundario",
    alias: ["efecto"],
    definicion:
      "Todo lo que una función hace además de devolver un valor: guardar algo, pedir datos, cambiar una variable de fuera. Es lo que hace que llamarla dos veces no dé lo mismo.",
  },
  {
    id: "cache",
    desde: { era2: 'vue2' },
    termino: "caché",
    definicion:
      "Guardarse el resultado de un cálculo para no repetirlo mientras no cambie nada de lo que depende. Es lo que hace un `computed`.",
  },
  {
    id: "refactorizar",
    desde: { era2: 'melaan', era1: 'kandra' },
    termino: "refactorizar",
    alias: ["refactorización"],
    definicion:
      "Cambiar cómo está escrito algo sin cambiar lo que hace. Si el comportamiento cambia, aunque sea a mejor, ya no es refactorizar.",
  },
  {
    id: "depurar",
    desde: { era2: 'comisaria', era1: 'ceniza' },
    termino: "depurar",
    alias: ["depuración"],
    definicion:
      "Buscar por qué un programa hace algo distinto de lo que esperabas. No es adivinar: es acorralar el fallo mirando qué vale cada cosa en cada paso.",
  },
  {
    id: "clase",
    desde: { era2: 'taller', era1: 'fundacion' },
    termino: "clase",
    alias: ["clases"],
    definicion:
      "Un molde para fabricar objetos que traen su propio comportamiento. La clase es el molde; cada objeto hecho con ella es una instancia.",
    ejemplo: "class Agente extends Persona { ... }",
  },
  {
    id: "constructor",
    desde: { era2: 'taller', era1: 'fundacion' },
    termino: "constructor",
    definicion:
      "La función que prepara un objeto recién creado. La llama `new` por ti, una sola vez, y es donde se le ponen sus datos.",
    ejemplo: { js: "constructor(nombre) { this.nombre = nombre }", php: "public function __construct(private string $nombre) {}" },
  },
  {
    id: "herencia",
    desde: { era2: 'taller', era1: 'fundacion' },
    termino: "herencia",
    alias: ["heredar"],
    definicion:
      "Que una clase se quede con todo lo de otra y añada lo suyo. Solo encaja cuando una **es** un tipo de la otra, no cuando la tiene dentro.",
  },
  {
    id: "getter",
    desde: { era2: 'taller', era1: 'fundacion' },
    termino: "getter",
    alias: ["getters"],
    definicion:
      "Una función de una clase que se lee como si fuera un dato, sin paréntesis. Para lo que se puede deducir de lo que ya hay.",
    ejemplo: "get caro() { return this.precio > 20 }",
  },
  {
    id: "conjunto",
    desde: { era2: 'taller' },
    termino: "Set",
    definicion:
      "Una colección sin repetidos. Preguntarle si algo está es inmediato, por muchos elementos que tenga.",
    ejemplo: "const sinRepetir = [...new Set(lista)]",
  },
  {
    id: "diccionario",
    desde: { era2: 'taller', era1: 'tripulacion' },
    termino: "diccionario",
    definicion:
      "Una colección de pares clave-valor. En JavaScript, un objeto normal si las claves son texto y las conoces, o un `Map` si admiten cualquier cosa y crecen. (No lleva alias `Map` a propósito: chocaría con el método `map` de las listas, que es otra cosa.)",
    ejemplo: "porAgente.set(wax, ['Bleeder'])",
  },
  {
    id: "ruta",
    desde: { era2: 'ferrocarril' },
    termino: "ruta",
    alias: ["rutas", "enrutador"],
    definicion:
      "La dirección que identifica una pantalla. Es lo que permite compartir un enlace, volver atrás y recargar sin perder dónde estabas.",
    ejemplo: "{ path: '/reto/:retoId', component: Reto }",
  },
  {
    id: "almacen",
    desde: { era2: 'vue3' },
    termino: "almacén",
    alias: ["almacenes"],
    definicion:
      "Un sitio donde vive un dato que miran varios componentes que no son padre e hijo. Por debajo es un objeto reactivo declarado fuera de toda función.",
  },
  {
    id: "gancho",
    desde: { era2: 'vue2' },
    termino: "gancho",
    alias: ["ganchos"],
    definicion:
      "Una función que le das a Vue para que la llame en un momento concreto de la vida de un componente: al montarse, al desaparecer.",
    ejemplo: "onMounted(() => caja.value.focus())",
  },
  {
    id: "funcion-de-vuelta",
    desde: { era2: 'es6' , era1: 'pozo' },
    termino: "función de vuelta",
    alias: ["callback"],
    definicion:
      "Una función que le pasas a otra para que la llame ella cuando toque. Quien la recibe decide cuándo y con qué argumentos.",
    ejemplo: { js: "lista.map((n) => n * 2)", php: "array_map(fn($n) => $n * 2, $lista)" },
  },
  {
    id: "inmutable",
    desde: { era2: 'taller' , era1: 'pozo' },
    termino: "inmutable",
    alias: ["inmutabilidad"],
    definicion:
      "La costumbre de no tocar lo que ya existe y devolver algo nuevo en su lugar. Evita de golpe la clase entera de fallos de las copias que no eran copias.",
    ejemplo: { js: "return { ...agente, rango: 'inspector' }", php: "$copia = [...$agente, 'rango' => 'inspector'];" },
  },
  {
    id: "traza",
    desde: { era2: 'taller', era1: 'tripulacion' },
    termino: "traza",
    alias: ["trazar"],
    definicion:
      "Seguir la ejecución paso a paso anotando qué vale cada cosa. También, la lista de llamadas que trae un error, de la más reciente a la más antigua.",
  },
  // ---- De PHP -------------------------------------------------------------
  {
    id: "match",
    // No existía, y en la primera era tiene un reto propio -«Del if largo al
    // match»- en el mundo de refactor. En la segunda no hay equivalente
    // directo: lo que se enseña allí es la búsqueda en un objeto.
    desde: { era1: 'kandra' },
    termino: "match",
    definicion: "Compara un valor con una lista de casos y devuelve el que encaje. Compara con `===` -sin convertir nada-, es una expresión -así que devuelve un valor y se puede devolver directamente- y exige que algún caso coincida: si no hay `default` y no encaja ninguno, se queja en vez de seguir con `null`.",
    ejemplo: "match ($metal) { 'acero', 'hierro' => 'físico', default => 'otro' }",
  },
  {
    id: "interfaz",
    desde: { era2: 'taller', era1: 'fundacion' },
    termino: "interfaz",
    alias: ["interfaces", "implements", "contrato"],
    definicion: "Una lista de métodos sin cuerpo: dice qué hay que saber hacer, no cómo. Quien la cumple promete tenerlos todos, y el lenguaje lo comprueba. Sirve para escribir código que funcione con cualquier cosa que cumpla el contrato, sin saber de qué clase es.",
    ejemplo: { js: "class Saco { total() { ... } }", php: "class Saco implements Contable { ... }" },
  },
  {
    id: "rasgo",
    desde: { era1: 'fundacion' },
    termino: "rasgo",
    alias: ["rasgos", "trait", "traits"],
    definicion: "Un trozo de clase con métodos de verdad que se pega dentro de otra clase con `use`. Para cuando dos clases que no tienen nada que ver necesitan el mismo código y heredar obligaría a inventarse un parentesco falso. No es un tipo: no se puede pedir en un parámetro.",
    ejemplo: "trait Registra { public function anota(string $que): string { ... } }",
  },
  {
    id: "estatico",
    desde: { era2: 'taller', era1: 'fundacion' },
    termino: "estático",
    alias: ["estática", "static", "self"],
    definicion: "Lo que pertenece a la clase y no a cada objeto: hay uno solo y lo comparten todos. Útil para constantes y para fábricas. Un estático público es una variable global con otro nombre, con sus mismos problemas: cualquiera lo cambia y nadie sabe quién.",
    ejemplo: { js: "static KILOS = 5", php: "public const KILOS = 5;" },
  },
  {
    id: "espacio-de-nombres",
    desde: { era1: 'fundacion' },
    termino: "espacio de nombres",
    alias: ["namespace", "namespaces"],
    definicion: "El apellido de una clase. Sin él, dos librerías que llamen igual a su clase no se pueden usar en el mismo programa. Por convención copia la estructura de carpetas, y eso es lo que permite que las clases se carguen solas sin escribir un `require`.",
    ejemplo: "namespace Cuadrilla\\Metales;",
  },
  {
    id: "excepcion",
    // No existía en el glosario y El taller tiene un reto entero -«Cuando algo
    // va mal a propósito»- que la enseña. Así que faltaba en los dos caminos.
    desde: { era2: 'taller', era1: 'pozo' },
    termino: "excepción",
    alias: ["excepciones", "lanzar", "lanza", "throw"],
    definicion: "Una manera de decir «esto no lo puedo hacer y no voy a fingir que sí». Para la función en el sitio, no devuelve nada, y sube hasta que alguien la recoge. Un error así no se puede confundir con un resultado, que es toda su ventaja sobre devolver un cero.",
    ejemplo: { js: "throw new Error('no se puede repartir entre cero')", php: "throw new InvalidArgumentException('no se puede repartir entre cero');" },
  },
  {
    id: "capturar",
    desde: { era2: 'taller', era1: 'pozo' },
    termino: "capturar",
    alias: ["captura", "try", "catch", "try/catch"],
    definicion: "Recoger una excepción para decidir qué hacer con ella. En el `try` va lo que se intenta y en el `catch` qué hacer si sale mal; en cuanto algo lanza, se abandona el resto del `try`. Capturada, la excepción no para el programa.",
    ejemplo: { js: "try { cobrar() } catch (error) { avisar(error.message) }", php: "try { cobrar(); } catch (Throwable $error) { echo $error->getMessage(); }" },
  },
  {
    id: "echo",
    desde: { era1: 'ceniza' },
    termino: "echo",
    definicion: "La orden de PHP para escribir algo en la salida. No es una función: no necesita paréntesis, y acaba en punto y coma como todo.",
    ejemplo: "echo 'Los Pozos de Hathsin';",
  },
  {
    id: "concatenar",
    desde: { era1: 'ceniza' },
    termino: "concatenar",
    alias: ["concatenación", "pegar textos"],
    definicion: "Juntar dos textos para formar uno. En PHP se hace con un punto, no con un `+`: el `+` es para sumar números y con textos que no son números da error.",
    ejemplo: "'Hola, ' . $nombre",
  },
  {
    id: "interpolacion",
    desde: { era1: 'ceniza' },
    termino: "interpolación",
    alias: ["interpolar"],
    definicion: "Que PHP mire dentro de un texto y sustituya las variables que encuentre. Pasa solo con comillas dobles; con comillas simples el texto sale tal cual, con el dólar y todo.",
    ejemplo: '"Llevo $cuantos de $metal"',
  },
  {
    id: "foreach",
    desde: { era1: 'ceniza' },
    termino: "foreach",
    definicion: "El bucle de PHP para recorrer una lista de principio a fin, sin llevar la cuenta a mano. Con `as` se le pone nombre a cada elemento, y con `=>` se saca también su clave.",
    ejemplo: "foreach ($inventario as $metal => $cuantos) { ... }",
  },
  {
    id: "array-asociativo",
    desde: { era1: 'tripulacion' },
    termino: "array asociativo",
    alias: ["arrays asociativos", "array con clave"],
    definicion: "Una lista en la que cada elemento tiene un nombre en vez de una posición. Es la estructura con la que se trabaja de verdad en PHP: lo que en otros lenguajes serían un objeto y un diccionario, aquí son esto.",
    ejemplo: "['acero' => 4, 'peltre' => 2]",
  },
  {
    id: "clave",
    desde: { era2: 'comisaria', era1: 'tripulacion' },
    termino: "clave",
    alias: ["claves"],
    definicion: "El nombre con el que se guarda un valor dentro de un objeto o de un array asociativo. No se repite: asignar dos veces la misma clave sobrescribe lo que hubiera.",
    ejemplo: { js: "inventario['acero']", php: "$inventario['acero']" },
  },
  {
    id: "isset",
    desde: { era1: 'tripulacion' },
    termino: "isset",
    definicion: "Pregunta si una variable o una clave existe **y** no vale null. Es lo que hay que usar antes de leer algo que puede no estar, porque pedir una clave que no existe da un aviso.",
    ejemplo: "if (isset($inventario['oro'])) { ... }",
  },
  {
    id: "coalescencia",
    // Se llamaba `coalescencia-php` y solo existía en la primera era, así que
    // en Los Áridos había un reto entero -«El azúcar que se usa de verdad»-
    // enseñando `??` sin una sola palabra que poder pulsar. Es el mismo
    // operador en los dos lenguajes y ahora es la misma entrada.
    desde: { era2: 'es6', era1: 'tripulacion' },
    termino: "??",
    alias: ["operador de coalescencia", "coalescencia nula"],
    definicion: "«Lo que haya a la izquierda, y si no hay nada, lo de la derecha.» Sirve para leer algo que puede no estar sin avisos y sin un `if`. Ojo: solo salta con `null`; un cero o un texto vacío **sí** son algo.",
    ejemplo: { js: "const cuantos = inventario[metal] ?? 0", php: "$cuantos = $inventario[$metal] ?? 0;" },
  },
  {
    id: "encadenamiento-opcional",
    desde: { era2: 'es6' , era1: 'pozo' },
    termino: "?.",
    alias: ["encadenamiento opcional"],
    definicion: "Pide algo de dentro de otra cosa **solo si esa cosa existe**. Si no existe, en vez de reventar, el resultado entero vale nulo. Ahorra el `if` de comprobar cada paso del camino.",
    ejemplo: { js: "agente.sombrero?.color" },
  },
  {
    id: "var-dump",
    desde: { era1: 'ceniza' },
    termino: "var_dump",
    definicion: "Imprime el tipo y el contenido de lo que le des, con detalle. Es la herramienta con la que se arregla la mitad de lo que se rompe: `echo` de un `true` y de un `'1'` se ven igual, y `var_dump` los distingue.",
    ejemplo: "var_dump($cuantos);   // int(3)",
  },
  {
    id: "comparacion-estricta",
    desde: { era2: 'comisaria', era1: 'ceniza' },
    termino: "comparación estricta",
    alias: ["===", "!=="],
    definicion: "Comparar exigiendo que el tipo también coincida. `1 == '1'` es cierto, porque el lenguaje convierte uno de los dos para poder compararlos; `1 === '1'` es falso. La costumbre buena es usar `===` por defecto y `==` solo cuando sepas por qué.",
    ejemplo: { js: "if (cantidad === 0) { ... }", php: "if ($cantidad === 0) { ... }" },
  },
  {
    id: "intdiv",
    desde: { era1: 'tripulacion' },
    termino: "intdiv",
    definicion: "Divide dos enteros y se queda con la parte entera, sin decimales. Es lo que se usa para porcentajes y repartos cuando el resultado tiene que ser un número redondo.",
    ejemplo: "intdiv($importe * 10, 100)",
  },
  {
    id: "valor-por-defecto",
    desde: { era2: 'es6', era1: 'tripulacion' },
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

/** El ejemplo que le toca a ese lenguaje, ya como texto. */
const ejemploDe = (entrada, lenguaje) =>
  typeof entrada.ejemplo === 'object' && entrada.ejemplo !== null
    ? entrada.ejemplo[lenguaje] ?? null
    : entrada.ejemplo ?? null

/** Los itinerarios donde se ejecuta ese lenguaje. */
const caminosDe = (lenguaje) =>
  ITINERARIOS.filter((cada) => cada.lenguajes.includes(lenguaje)).map((cada) => cada.id)

/** En qué caminos se enseña una entrada. */
const caminosDeLaEntrada = (entrada) => Object.keys(entrada.desde ?? {})

const preparar = (entrada, lenguaje) => ({ ...entrada, ejemplo: ejemploDe(entrada, lenguaje) })

const ordenar = (entradas) => [...entradas]

const buscablesDe = (entradas) =>
  entradas
    .flatMap((entrada) =>
      [entrada.termino, ...(entrada.alias ?? [])].map((texto) => ({ texto, id: entrada.id })),
    )
    .sort((a, b) => b.texto.length - a.texto.length)

/**
 * El glosario entero de un lenguaje: lo que se enseña en alguno de los caminos
 * que se juegan con él, con el ejemplo que le corresponde.
 *
 * Es lo que enseña la **página** del glosario, que se abre desde la barra y
 * fuera de todo mundo: ahí sí se ve el temario completo del camino, agrupado por
 * mundos, que es media gracia de mirarlo. Dentro de un reto manda
 * `glosarioHasta`, que es más estrecho.
 *
 * Se guarda lo calculado porque lo piden el panel, la página y el enlazado de
 * cada enunciado, y son cien entradas cada vez.
 */
const porLenguaje = new Map()

export function glosarioDe(lenguaje = 'js') {
  if (!porLenguaje.has(lenguaje)) {
    const caminos = caminosDe(lenguaje)
    porLenguaje.set(
      lenguaje,
      ordenar(
        GLOSARIO.filter((entrada) =>
          caminosDeLaEntrada(entrada).some((camino) => caminos.includes(camino)),
        ),
      ).map((entrada) => preparar(entrada, lenguaje)),
    )
  }
  return porLenguaje.get(lenguaje)
}

/**
 * El glosario tal y como está cuando llegas a un mundo: lo que ese mundo enseña
 * y lo que enseñaron los anteriores de su camino. Nada de más adelante.
 *
 * Esto es lo que se ve **dentro** de un reto, y es lo que arregla el problema de
 * verdad. Antes, en el tercer reto de La Ceniza, el glosario ofrecía «herencia»
 * y «reduce»: términos de mundos que ese jugador no ha visto y, dos de ellos, de
 * un camino que no está jugando.
 */
const porMundo = new Map()

export function glosarioHasta(mundoId) {
  if (!porMundo.has(mundoId)) {
    const mundo = MUNDOS_POR_ID[mundoId]
    const camino = mundo?.itinerario
    const hermanos = mundosDelItinerario(camino ?? '').map((cada) => cada.id)
    const hasta = hermanos.indexOf(mundoId)
    const lenguaje = ENTORNOS[mundo?.entorno]?.lenguaje ?? 'js'
    // Sin mundo -o un mundo que no existe- se responde el glosario del camino
    // entero y no una lista vacía: quedarse sin glosario por una ruta rara es
    // peor que enseñar de más.
    if (!mundo || hasta < 0) {
      porMundo.set(mundoId, glosarioDe(lenguaje))
    } else {
      porMundo.set(
        mundoId,
        ordenar(
          GLOSARIO.filter((entrada) => {
            const suyo = entrada.desde?.[camino]
            if (!suyo) return false
            const cuando = hermanos.indexOf(suyo)
            return cuando >= 0 && cuando <= hasta
          }),
        ).map((entrada) => preparar(entrada, lenguaje)),
      )
    }
  }
  return porMundo.get(mundoId)
}

/**
 * Una entrada por su id, vista desde un lenguaje.
 *
 * A propósito **sin filtrar por mundo**: una definición puede citar un término
 * de más adelante, y dejar ese enlace muerto sería peor que enseñarlo. Lo que
 * `desde` decide es lo que se lista y lo que se detecta solo en un texto; por su
 * nombre se alcanza siempre.
 */
export function entradaDe(id, lenguaje = 'js') {
  const entrada = GLOSARIO_POR_ID[id]
  if (!entrada) return null
  const caminos = caminosDe(lenguaje)
  if (!caminosDeLaEntrada(entrada).some((camino) => caminos.includes(camino))) return null
  return preparar(entrada, lenguaje)
}

/**
 * Los términos que se marcan en un texto, del más largo al más corto para que
 * «función flecha» se detecte entera antes que «función».
 */
const buscablesPorLenguaje = new Map()

export function terminosBuscablesDe(lenguaje = 'js') {
  if (!buscablesPorLenguaje.has(lenguaje)) {
    buscablesPorLenguaje.set(lenguaje, buscablesDe(glosarioDe(lenguaje)))
  }
  return buscablesPorLenguaje.get(lenguaje)
}

/**
 * Y los que se marcan dentro de un mundo: solo lo que ya se ha enseñado ahí.
 *
 * Que un enunciado use una palabra no significa que el jugador pueda pulsarla:
 * si el término se enseña tres mundos más adelante, marcarla es ofrecer una
 * definición que no toca todavía.
 */
const buscablesPorMundo = new Map()

export function terminosBuscablesHasta(mundoId) {
  if (!buscablesPorMundo.has(mundoId)) {
    buscablesPorMundo.set(mundoId, buscablesDe(glosarioHasta(mundoId)))
  }
  return buscablesPorMundo.get(mundoId)
}

/**
 * El glosario de un camino, partido por mundos y en orden de juego.
 *
 * Para la página del glosario: ver «esto es de La Ceniza y esto de La
 * tripulación» es la mitad de la información. Un mundo sin términos propios no
 * sale.
 */
export function glosarioPorMundos(itinerarioId) {
  const lenguaje = ITINERARIOS_POR_ID[itinerarioId]?.lenguajes[0] ?? 'js'
  return mundosDelItinerario(itinerarioId)
    .map((mundo) => ({
      mundo,
      entradas: GLOSARIO.filter((entrada) => entrada.desde?.[itinerarioId] === mundo.id).map(
        (entrada) => preparar(entrada, lenguaje),
      ),
    }))
    .filter((grupo) => grupo.entradas.length > 0)
}
