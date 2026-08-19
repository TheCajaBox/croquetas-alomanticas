/**
 * Los repasos de Marasi.
 *
 * Resolver un reto y no volver a ver ese concepto nunca es la forma más rápida
 * de olvidarlo. Al terminar un mundo, Marasi abre el caso y repasa lo que se ha
 * visto, insistiendo en lo que más se confunde.
 *
 * Cada opción lleva su porqué, también las falsas: media enseñanza de un repaso
 * está en entender por qué la que casi eliges estaba mal.
 */
export const REPASOS = [
  {
    id: "repaso-primer-dia",
    mundo: "primer-dia",
    titulo: "El caso de los primeros pasos",
    preguntas: [
      {
        pregunta: "¿Cuándo se usa `let` en vez de `const`?",
        opciones: [
          {
            texto: "Solo cuando compruebes que a esa variable le vas a asignar otro valor.",
            correcta: true,
            porque: "Se empieza siempre por `const`. Así, al leer código ajeno, cada `let` avisa de que ese valor se mueve.",
          },
          {
            texto: "Siempre que la variable vaya a usarse en más de un sitio.",
            porque: "Usarla en muchos sitios no tiene nada que ver. Lo que decide es si se le va a **asignar** otro valor.",
          },
          {
            texto: "Cuando el valor es un número, porque los números cambian.",
            porque: "El tipo de dato no decide nada. Un número puede ser `const` perfectamente.",
          },
        ],
      },
      {
        pregunta: "`const gatos = ['Acero']` y luego `gatos.push('Bronce')`. ¿Qué pasa?",
        opciones: [
          {
            texto: "Funciona: `const` protege la caja, no lo que hay dentro.",
            correcta: true,
            porque: "Exacto. Lo que no se puede es darle OTRA lista con `gatos = [...]`.",
          },
          {
            texto: "Da error, porque `const` no deja cambiar nada.",
            porque: "Es la confusión más común. `const` impide reasignar la variable, no modificar el contenido de una lista o un objeto.",
          },
          {
            texto: "Funciona pero la lista deja de ser reactiva.",
            porque: "La reactividad es cosa de Vue y no tiene nada que ver con `const`.",
          },
        ],
      },
      {
        pregunta: "¿Qué escribe `console.log('Van ' + 2 + 1)`?",
        opciones: [
          {
            texto: "`Van 21`",
            correcta: true,
            porque: "De izquierda a derecha: `'Van ' + 2` da el texto `'Van 2'`, y a eso se le pega el `1`.",
          },
          {
            texto: "`Van 3`",
            porque: "Eso saldría con paréntesis: `'Van ' + (2 + 1)`. Sin ellos, al llegar al `1` ya se estaba trabajando con texto.",
          },
          {
            texto: "Da error por mezclar texto y números.",
            porque: "No avisa: convierte el número a texto y sigue. Ese es justamente el problema.",
          },
        ],
      },
      {
        pregunta: "¿Qué diferencia hay entre `return` y `console.log`?",
        opciones: [
          {
            texto: "`console.log` enseña algo por pantalla; `return` entrega un valor a quien llamó a la función.",
            correcta: true,
            porque: "Una función sin `return` devuelve `undefined`, por muchos `console.log` que tenga dentro.",
          },
          {
            texto: "Ninguna: las dos sacan el valor de la función.",
            porque: "Es el malentendido que más tests suspende. Solo `return` entrega algo utilizable.",
          },
          {
            texto: "`return` solo vale dentro de un bucle.",
            porque: "`return` vale en cualquier función, y de hecho la termina en ese punto.",
          },
        ],
      },
      {
        pregunta: "¿Por qué falla `console.log(equipo)` puesto encima de `const equipo = []`?",
        opciones: [
          {
            texto: "Porque el programa se lee de arriba abajo y ahí `equipo` todavía no existe.",
            correcta: true,
            porque: "El error es `Cannot access 'equipo' before initialization`, que dice justo eso con peores palabras.",
          },
          {
            texto: "Porque `console.log` no sabe pintar listas.",
            porque: "Pinta listas perfectamente. El problema es el orden, no el tipo.",
          },
          {
            texto: "Porque falta un punto y coma.",
            porque: "En JavaScript los puntos y coma casi nunca son el problema, y desde luego no aquí.",
          },
        ],
      },
      {
        pregunta: "¿Qué es `null`?",
        opciones: [
          {
            texto: "Un valor que dice «aquí no hay nada, y consta que no lo hay».",
            correcta: true,
            porque: "Distinto de `undefined`, que es «esto nunca se rellenó», y distinto de `0` o de un texto vacío.",
          },
          {
            texto: "Lo mismo que `0`.",
            porque: "`0` es un número con el que se puede operar. `null` es la ausencia deliberada de valor.",
          },
          {
            texto: "Un error que hay que evitar siempre.",
            porque: "Es un valor legítimo y muy útil: sirve para dejar constancia de un hueco a propósito.",
          },
        ],
      },
    ],
  },
  {
    id: "repaso-es6",
    mundo: "es6",
    titulo: "El caso de los Áridos",
    preguntas: [
      {
        pregunta: "¿Por qué se usa una flecha dentro de `map` en lugar de `function`?",
        opciones: [
          {
            texto: "Porque la flecha no tiene `this` propio y usa el del sitio donde está escrita.",
            correcta: true,
            porque: "Una función clásica trae su propio `this`, que al pasarla a `map` se pierde y queda en `undefined`.",
          },
          {
            texto: "Porque las flechas son más rápidas.",
            porque: "La velocidad es irrelevante aquí. Lo que cambia es el `this`.",
          },
          {
            texto: "Porque `map` solo admite flechas.",
            porque: "`map` admite cualquier función. Lo que pasa es que con la clásica el `this` de dentro ya no es el que esperabas.",
          },
        ],
      },
      {
        pregunta: "`const nombre = ''`. ¿Qué da `nombre || 'anónimo'` y qué da `nombre ?? 'anónimo'`?",
        opciones: [
          {
            texto: "`'anónimo'` el primero, y el texto vacío el segundo.",
            correcta: true,
            porque: "`||` salta con cualquier valor flojo, el texto vacío incluido. `??` solo con `null` y `undefined`.",
          },
          {
            texto: "Los dos dan `'anónimo'`.",
            porque: "Esa es la trampa. `??` respeta el texto vacío, porque un nombre en blanco es un dato, no una ausencia.",
          },
          {
            texto: "Los dos dan el texto vacío.",
            porque: "`||` sí lo sustituye: para él, un texto vacío cuenta como falso.",
          },
        ],
      },
      {
        pregunta: "¿Qué le falta a `precios.reduce((suma, p) => suma + p)`?",
        opciones: [
          {
            texto: "El valor inicial: `, 0` al final.",
            correcta: true,
            porque: "Sin él, con la lista vacía da un error en vez de un cero.",
          },
          {
            texto: "Nada, está completo.",
            porque: "Funciona con listas que tengan elementos, y falla el día que le llegue una vacía. De los peores fallos: aparece tarde.",
          },
          {
            texto: "Le falta un `return` dentro.",
            porque: "Una flecha sin llaves ya devuelve lo que hay a la derecha.",
          },
        ],
      },
      {
        pregunta: "`Promise.all([lento, rapido])`. ¿En qué orden llega el resultado?",
        opciones: [
          {
            texto: "En el orden en que se las pasaste: primero `lento`, después `rapido`.",
            correcta: true,
            porque: "Que uno conteste antes no lo pone el primero en la lista. Se ejecutan a la vez, pero el resultado respeta tu orden.",
          },
          {
            texto: "En el orden en que terminan: primero `rapido`.",
            porque: "Eso sería `Promise.race`, que además solo devuelve el primero.",
          },
          {
            texto: "En orden aleatorio, depende de la red.",
            porque: "El orden está garantizado por el propio `Promise.all`.",
          },
        ],
      },
      {
        pregunta: "¿Qué hace `const { senas: { sombrero } = {} } = cartel`?",
        opciones: [
          {
            texto: "Saca `sombrero` de dentro de `senas`, y si `senas` no viene, no revienta.",
            correcta: true,
            porque: "El `= {}` es el valor por defecto de `senas`. Sin él, intentaría abrir un `undefined`.",
          },
          {
            texto: "Crea dos variables: `senas` y `sombrero`.",
            porque: "Solo crea `sombrero`. Al desestructurar en profundidad, el nivel intermedio no queda como variable.",
          },
          {
            texto: "Copia el objeto entero en `sombrero`.",
            porque: "Copia solo esa propiedad concreta.",
          },
        ],
      },
      {
        pregunta: "`map`, `filter` y `reduce`, ¿modifican la lista original?",
        opciones: [
          {
            texto: "No: las tres devuelven algo nuevo y dejan la original intacta.",
            correcta: true,
            porque: "Por eso se pueden encadenar sin miedo. El que sí la modifica es `push`, entre otros.",
          },
          {
            texto: "Sí, las tres la modifican en el sitio.",
            porque: "Ninguna la toca. Confundirlo lleva a hacer copias defensivas que no hacen falta.",
          },
          {
            texto: "Solo `reduce` la modifica.",
            porque: "`reduce` tampoco: recorre y acumula, pero no escribe en la lista.",
          },
        ],
      },
    ],
  },
  {
    id: "repaso-vue2",
    mundo: "vue2",
    titulo: "El caso de la mansión",
    preguntas: [
      {
        pregunta: "¿Por qué `data` tiene que ser una función y no un objeto?",
        opciones: [
          {
            texto: "Para que cada copia del componente reciba su propio objeto de datos.",
            correcta: true,
            porque: "Siendo un objeto, todas las copias compartirían el mismo y cambiar un dato en una lo cambiaría en todas.",
          },
          {
            texto: "Porque Vue necesita llamarla para saber cuándo repintar.",
            porque: "El repintado no depende de eso: depende de los accesores que Vue instala sobre las propiedades.",
          },
          {
            texto: "Por costumbre heredada, no cambia nada.",
            porque: "Cambia bastante: con dos copias en pantalla se ve el problema al instante.",
          },
        ],
      },
      {
        pregunta: "¿Para qué sirve `:key` en un `v-for`?",
        opciones: [
          {
            texto: "Para que Vue sepa qué fila es cuál cuando la lista cambia de orden o de tamaño.",
            correcta: true,
            porque: "Sin ella, al reordenar se quedan datos pegados en la fila equivocada. Usa un identificador estable, nunca la posición.",
          },
          {
            texto: "Para ordenar la lista automáticamente.",
            porque: "No ordena nada: solo identifica.",
          },
          {
            texto: "Es opcional y solo sirve para quitar un aviso de la consola.",
            porque: "El aviso está por algo: sin `key` aparecen fallos visuales que cuesta muchísimo diagnosticar.",
          },
        ],
      },
      {
        pregunta: "Un valor que sale solo de otros datos, ¿`computed` o `method`?",
        opciones: [
          {
            texto: "`computed`: guarda el resultado y solo lo rehace cuando cambia algo de lo que usa.",
            correcta: true,
            porque: "Un `method` se ejecuta cada vez que se le llama, y la plantilla lo llama en cada pintado.",
          },
          {
            texto: "`method`, porque es una función.",
            porque: "Los dos son funciones. La diferencia es que el `computed` cachea.",
          },
          {
            texto: "Da igual: el resultado es el mismo.",
            porque: "El resultado sí, el trabajo no. Con listas grandes la diferencia deja de ser teórica muy pronto.",
          },
        ],
      },
      {
        pregunta: "`this.inventario.cuerda = 1` sobre una clave nueva. ¿Qué pasa en Vue 2?",
        opciones: [
          {
            texto: "El dato cambia pero la pantalla no se entera, porque esa clave no existía al montar.",
            correcta: true,
            porque: "Para eso está `this.$set`, que da de alta la propiedad **y** avisa.",
          },
          {
            texto: "Da un error en la consola.",
            porque: "No protesta. Se queda callado, que es lo que lo hace difícil de encontrar.",
          },
          {
            texto: "Funciona igual que en Vue 3.",
            porque: "Vue 3 usa `Proxy` y sí se entera. Este hueco es propio de Vue 2.",
          },
        ],
      },
      {
        pregunta: "Un componente hijo necesita cambiar un dato del padre. ¿Qué hace?",
        opciones: [
          {
            texto: "Emitir un evento y dejar que el padre decida.",
            correcta: true,
            porque: "Datos abajo, avisos arriba. Así solo hay un sitio donde ese dato puede cambiar.",
          },
          {
            texto: "Modificar la prop directamente.",
            porque: "Las props son de quien las manda. Tocarlas rompe la única garantía que hace esto manejable.",
          },
          {
            texto: "Guardar una copia y modificar la copia.",
            porque: "Entonces el padre nunca se entera del cambio, y acabas con dos verdades distintas.",
          },
        ],
      },
      {
        pregunta: "¿Por qué hay que parar un `setInterval` en `beforeDestroy`?",
        opciones: [
          {
            texto: "Porque si no, sigue corriendo cuando el componente ya no existe.",
            correcta: true,
            porque: "Es una fuga: no avisa, no se ve, y va comiendo hasta que la aplicación va a trompicones.",
          },
          {
            texto: "Porque Vue lo para solo, pero conviene ser explícito.",
            porque: "Vue no lo para. Lo que tú enciendes, tú lo apagas.",
          },
          {
            texto: "Solo hace falta si el intervalo cambia datos.",
            porque: "Hace falta siempre. Aunque no tocara nada, seguiría ejecutándose para siempre.",
          },
        ],
      },
    ],
  },
  {
    id: "repaso-vue3",
    mundo: "vue3",
    titulo: "El caso de la ciudad nueva",
    preguntas: [
      {
        pregunta: "`const balas = ref(6)`. ¿Dónde hace falta `.value`?",
        opciones: [
          {
            texto: "Dentro de `setup` sí; en la plantilla no.",
            correcta: true,
            porque: "Vue abre la caja por ti al pintar. Olvidarlo dentro de `setup` es el error número uno, y no avisa.",
          },
          {
            texto: "En los dos sitios.",
            porque: "En la plantilla `{{ balas.value }}` no da error, pero sobra: Vue ya lo desenvuelve.",
          },
          {
            texto: "En ninguno de los dos.",
            porque: "Dentro de `setup`, `balas` es la caja. Sin `.value` estás operando con la caja, no con el número.",
          },
        ],
      },
      {
        pregunta: "`const { balas } = reactive({ balas: 6 })`. ¿Qué se rompe?",
        opciones: [
          {
            texto: "La reactividad: `balas` es una copia del valor, no un vínculo con el objeto.",
            correcta: true,
            porque: "La vigilancia está sobre el objeto. Para desestructurar sin perderla existe `toRefs`.",
          },
          {
            texto: "Nada: sigue siendo reactivo.",
            porque: "Es la trampa clásica de Vue 3, y no da ningún error: simplemente deja de actualizarse.",
          },
          {
            texto: "Da error al desestructurar un objeto reactivo.",
            porque: "Deja hacerlo tan tranquilo. Ese es el problema.",
          },
        ],
      },
      {
        pregunta: "Nada más montar el componente, ¿cuál de los dos ha corrido ya?",
        opciones: [
          {
            texto: "`watchEffect`, que se lanza inmediatamente; `watch` espera al primer cambio.",
            correcta: true,
            porque: "`watchEffect` además averigua solo de qué depende, leyendo lo que usa por dentro.",
          },
          {
            texto: "`watch`, que se lanza con el valor inicial.",
            porque: "Solo si le pasas `{ immediate: true }`. Por defecto espera.",
          },
          {
            texto: "Los dos.",
            porque: "Solo `watchEffect`. Es la diferencia práctica más visible entre ambos.",
          },
        ],
      },
      {
        pregunta: "¿Qué hay que pasarle a `provide` para que el de abajo se entere de los cambios?",
        opciones: [
          {
            texto: "El `ref` entero, no su `.value`.",
            correcta: true,
            porque: "Compartiendo el valor, el de abajo se queda con una foto del momento y no se entera de nada más.",
          },
          {
            texto: "El `.value`, que es el dato de verdad.",
            porque: "Eso comparte una copia. El vínculo vive en el ref.",
          },
          {
            texto: "Da igual, Vue lo resuelve solo.",
            porque: "No lo resuelve: si compartes el valor, el de abajo deja de actualizarse.",
          },
        ],
      },
      {
        pregunta: "Dos componentes llaman al mismo composable. ¿Comparten estado?",
        opciones: [
          {
            texto: "No: cada llamada crea su propio estado.",
            correcta: true,
            porque: "Es una función normal. Si quieres estado compartido, saca los `ref` fuera de ella.",
          },
          {
            texto: "Sí, siempre: para eso está un composable.",
            porque: "Eso sería un almacén global. Un composable da a cada uno lo suyo.",
          },
          {
            texto: "Depende de si lleva `ref` o `reactive`.",
            porque: "No depende de eso, sino de si los `ref` están dentro o fuera de la función.",
          },
        ],
      },
      {
        pregunta: "¿Qué pasa si `setup` no devuelve algo que la plantilla usa?",
        opciones: [
          {
            texto: "La plantilla no lo ve y Vue avisa de que esa propiedad no está definida.",
            correcta: true,
            porque: "Es el fallo más habitual al convertir de Options API a Composition: se traduce todo y se olvida el `return`.",
          },
          {
            texto: "Vue lo encuentra igual, porque está en el mismo fichero.",
            porque: "No lo encuentra: la plantilla solo ve lo que `setup` entrega.",
          },
          {
            texto: "Funciona pero deja de ser reactivo.",
            porque: "Directamente no existe para la plantilla.",
          },
        ],
      },
    ],
  },
  {
    id: "repaso-melaan",
    mundo: "melaan",
    titulo: "El caso del cambio de forma",
    preguntas: [
      {
        pregunta: "¿Qué hace que refactorizar sea seguro?",
        opciones: [
          {
            texto: "Tener tests: cambias la forma, los ejecutas y sabes si el comportamiento se ha movido.",
            correcta: true,
            porque: "Sin tests, reescribir es apostar. Con ellos, es una operación mecánica.",
          },
          {
            texto: "Hacer los cambios muy pequeños.",
            porque: "Ayuda, pero sin red sigues sin saber si has roto algo hasta que alguien se queja.",
          },
          {
            texto: "Guardar una copia del fichero antes.",
            porque: "Te deja volver atrás, pero no te dice si lo nuevo funciona.",
          },
        ],
      },
      {
        pregunta: "¿Cuándo NO conviene quitar código repetido?",
        opciones: [
          {
            texto: "Cuando los trozos se parecen hoy pero van a cambiar por motivos distintos.",
            correcta: true,
            porque: "Juntarlos crea una función que sirve para dos cosas que ya no son la misma, y esas son peores que la repetición.",
          },
          {
            texto: "Nunca: la repetición siempre se quita.",
            porque: "Es la regla que más daño hace aplicada a ciegas. Parecerse no es ser lo mismo.",
          },
          {
            texto: "Cuando solo se repite dos veces.",
            porque: "El número importa menos que si los trozos comparten un motivo para cambiar.",
          },
        ],
      },
      {
        pregunta: "Al pasar de Options API a `setup`, ¿qué se olvida más?",
        opciones: [
          {
            texto: "Devolver al final todo lo que la plantilla usa.",
            correcta: true,
            porque: "Se traduce cada dato y cada método, y el `return` se queda corto. La plantilla solo ve lo que se le entrega.",
          },
          {
            texto: "Poner `async` en `setup`.",
            porque: "`setup` no necesita ser asíncrono, y hacerlo tiene sus propias complicaciones.",
          },
          {
            texto: "Registrar el componente en `components`.",
            porque: "Eso no cambia al pasar a `setup`: sigue igual que estaba.",
          },
        ],
      },
      {
        pregunta: "Un temporizador que se guarda para poder pararlo, ¿va en un `ref`?",
        opciones: [
          {
            texto: "No: un `let` normal basta, porque no se pinta en ninguna parte.",
            correcta: true,
            porque: "Los `ref` son para lo que la pantalla mira. Envolver en `ref` lo que no se pinta es un vicio común al llegar a Vue 3.",
          },
          {
            texto: "Sí, todo lo que se guarda en `setup` va en un `ref`.",
            porque: "Solo lo que tenga que provocar un repintado cuando cambie.",
          },
          {
            texto: "Sí, o Vue no lo conservará entre repintados.",
            porque: "`setup` se ejecuta una sola vez por componente: las variables de dentro sobreviven perfectamente.",
          },
        ],
      },
      {
        pregunta: "En Vue 3, ¿dónde va lo que antes estaba en `created`?",
        opciones: [
          {
            texto: "Suelto en el cuerpo de `setup`, sin gancho ninguno.",
            correcta: true,
            porque: "`setup` se ejecuta en ese mismo momento, antes de que exista nada en pantalla.",
          },
          {
            texto: "En `onMounted`.",
            porque: "`onMounted` es más tarde: cuando ya está pintado. Si tocas el DOM, ahí; si no, en el cuerpo.",
          },
          {
            texto: "En `onBeforeMount`.",
            porque: "Existe, pero para lo que hacía `created` es dar un rodeo: el cuerpo de `setup` ya está en ese punto.",
          },
        ],
      },
      {
        pregunta: "Reescribir un bucle como `filter().map()`, ¿qué gana de verdad?",
        opciones: [
          {
            texto: "Que se lee qué hace sin tener que seguir el bucle entero.",
            correcta: true,
            porque: "Los nombres de los métodos son la explicación. El bucle hay que leerlo completo para deducirla.",
          },
          {
            texto: "Que va más rápido.",
            porque: "Normalmente va algo más lento. Se hace por lo que cuesta leerlo, no por lo que tarda.",
          },
          {
            texto: "Que ocupa menos líneas.",
            porque: "A veces sí y a veces no. Y en cualquier caso, el número de líneas nunca es el objetivo.",
          },
        ],
      },
    ],
  },
  {
    id: "repaso-comisaria",
    mundo: "comisaria",
    titulo: "El caso de los cimientos",
    preguntas: [
      {
        pregunta: "¿Por qué se recomienda `===` y no `==`?",
        opciones: [
          {
            texto: "Porque `==` convierte los valores antes de comparar, y las reglas de conversión son largas y sorprendentes.",
            correcta: true,
            porque: "`0 == ''` da `true`, y `'0' == false` también. Nadie se sabe la tabla entera, así que lo práctico es no depender de ella.",
          },
          {
            texto: "Porque `==` es más lento.",
            porque: "La diferencia de velocidad es irrelevante. El problema no es el tiempo, es que da resultados que no esperabas.",
          },
          {
            texto: "Porque `==` está obsoleto y da error en el JavaScript moderno.",
            porque: "Sigue siendo válido y funciona. No es que no se pueda: es que casi nunca conviene.",
          },
        ],
      },
      {
        pregunta: "¿Cuál de estos vale `true`: `Boolean([])`, `Boolean('')` o `Boolean(0)`?",
        opciones: [
          {
            texto: "`Boolean([])`, porque una lista vacía sigue siendo un objeto.",
            correcta: true,
            porque: "Los falsos son solo seis: `false`, `0`, `''`, `null`, `undefined` y `NaN`. La lista vacía no está en esa lista, aunque no tenga nada dentro.",
          },
          {
            texto: "Ninguno: los tres están vacíos, así que los tres son falsos.",
            porque: "«Vacío» no es un concepto que JavaScript aplique a los objetos. `[]` y `{}` son verdaderos, y es de las cosas que más despistan al principio.",
          },
          {
            texto: "`Boolean('')`, porque un texto siempre es verdadero.",
            porque: "Al revés: el texto **vacío** es de los seis falsos. Cualquier otro texto, incluido `'0'` y `'false'`, es verdadero.",
          },
        ],
      },
      {
        pregunta: "En una lista de 4 elementos, ¿qué devuelve `lista[4]`?",
        opciones: [
          {
            texto: "`undefined`, sin dar ningún error.",
            correcta: true,
            porque: "Se cuenta desde 0, así que las posiciones son 0, 1, 2 y 3. La 4 está vacía, y pedirla no protesta: devuelve `undefined` y sigue.",
          },
          {
            texto: "El último elemento.",
            porque: "El último está en `lista[3]`, o en general en `lista[lista.length - 1]`. Ese uno de diferencia es el error más repetido de la profesión.",
          },
          {
            texto: "Un error de índice fuera de rango.",
            porque: "Eso hacen otros lenguajes. JavaScript se encoge de hombros y devuelve `undefined`, que es más traicionero: el fallo aparece más tarde y en otro sitio.",
          },
        ],
      },
      {
        pregunta: "¿Por qué el acumulador de un bucle se declara **fuera** del bucle?",
        opciones: [
          {
            texto: "Porque si se declara dentro se crea nuevo en cada vuelta y se pierde lo acumulado.",
            correcta: true,
            porque: "Cada vuelta abriría una variable nueva a cero. Al acabar tendrías solo el último valor, no la suma.",
          },
          {
            texto: "Porque dentro del bucle no se pueden declarar variables.",
            porque: "Sí se pueden, y se hace constantemente. El problema no es que no se pueda, es que no sobrevive a la vuelta.",
          },
          {
            texto: "Por costumbre: da lo mismo dónde se ponga.",
            porque: "No da lo mismo. Cámbialo de sitio y el resultado cambia, que es la definición de que importa.",
          },
        ],
      },
      {
        pregunta: "Tienes que guardar el nombre, el alias y la recompensa de un sospechoso. ¿Lista u objeto?",
        opciones: [
          {
            texto: "Un objeto, porque cada dato significa una cosa distinta.",
            correcta: true,
            porque: "Con un objeto cada dato lleva su etiqueta: `sospechoso.alias`. En una lista tendrías que acordarte de que el alias era la posición 1.",
          },
          {
            texto: "Una lista, porque son tres datos del mismo sospechoso.",
            porque: "Ser del mismo sospechoso no los hace del mismo tipo. La lista es para muchos elementos equivalentes; aquí cada hueco significa otra cosa.",
          },
          {
            texto: "Da igual: las dos guardan tres valores.",
            porque: "Guardar, guardan las dos. Pero dentro de seis meses `sospechoso[1]` no te va a decir nada y `sospechoso.alias` sí, y eso es la mitad del oficio.",
          },
        ],
      },
      {
        pregunta: "`const nombre = '  wax  '` y luego `nombre.trim()`. ¿Qué vale `nombre`?",
        opciones: [
          {
            texto: "Sigue valiendo `'  wax  '`: `trim` devuelve un texto nuevo y no cambia el original.",
            correcta: true,
            porque: "Los textos son inmutables. Todos sus métodos fabrican uno nuevo, y si no recoges el resultado se pierde.",
          },
          {
            texto: "`'wax'`, porque `trim` le quita los espacios.",
            porque: "Se los quita al texto que devuelve, no al que le pasaste. Llamar a `.trim()` y no guardar el resultado es un fallo clásico.",
          },
          {
            texto: "Da error, porque `nombre` es `const`.",
            porque: "`const` impediría `nombre = otra cosa`, pero aquí nadie asigna nada. `trim` solo lee.",
          },
        ],
      },
    ],
  },
  {
    id: "repaso-taller",
    mundo: "taller",
    titulo: "El caso del oficio",
    preguntas: [
      {
        pregunta: "En un método de una clase, ¿qué es `this`?",
        opciones: [
          {
            texto: "El objeto concreto sobre el que se llamó al método.",
            correcta: true,
            porque: "En `arma.disparar()`, `this` es `arma`. Por eso un solo método escrito una vez sirve para todos los objetos de esa clase.",
          },
          {
            texto: "La clase.",
            porque: "La clase es el molde. `this` es la pieza concreta que salió del molde, y cada una tiene sus propios datos.",
          },
          {
            texto: "Siempre el mismo objeto durante todo el programa.",
            porque: "Cambia en cada llamada. Ese es justamente el mecanismo que hace que las clases sirvan para algo.",
          },
        ],
      },
      {
        pregunta: "¿Por qué `super(...)` tiene que ir antes de tocar `this` en el constructor de una clase hija?",
        opciones: [
          {
            texto: "Porque hasta que el constructor del padre no termina, el objeto no está construido y `this` no existe todavía.",
            correcta: true,
            porque: "JavaScript no lo deja pasar: da un error directamente. No es una convención de estilo, es una regla del lenguaje.",
          },
          {
            texto: "Por legibilidad: queda más ordenado poner primero lo heredado.",
            porque: "Queda más ordenado, sí, pero no es opcional. Ponerlo después no es feo: es un error de ejecución.",
          },
          {
            texto: "No hace falta: `super` puede ir en cualquier sitio del constructor.",
            porque: "Pruébalo y verás el error. Tiene que ir antes de la primera vez que aparezca `this`.",
          },
        ],
      },
      {
        pregunta: "¿Cuándo conviene lanzar un error en vez de devolver `null`?",
        opciones: [
          {
            texto: "Cuando quien llama no puede seguir razonablemente sin ese valor.",
            correcta: true,
            porque: "Un `null` que nadie mira viaja hacia dentro y revienta lejos del origen. El error para en el sitio exacto y con el motivo puesto.",
          },
          {
            texto: "Siempre: devolver `null` es una mala práctica.",
            porque: "`null` está bien cuando «no hay nada» es un resultado normal y esperado, como una búsqueda que no encuentra.",
          },
          {
            texto: "Nunca, porque los errores paran el programa.",
            porque: "Solo lo paran si nadie los recoge, y para eso está `try/catch`. Un error recogido es más información, no menos.",
          },
        ],
      },
      {
        pregunta: "`const b = a` donde `a` es una lista. ¿Qué pasa si haces `b.push(1)`?",
        opciones: [
          {
            texto: "`a` también cambia: los dos nombres apuntan a la misma lista.",
            correcta: true,
            porque: "De las listas y los objetos se copia la dirección, no el contenido. Para una copia de verdad hay que pedirla: `[...a]`.",
          },
          {
            texto: "Solo cambia `b`, porque la asignación hizo una copia.",
            porque: "Eso pasa con números y textos. Con listas y objetos no, y esta diferencia es la causa de una cantidad enorme de tardes perdidas.",
          },
          {
            texto: "Da error, porque `b` es `const`.",
            porque: "`const` protege el nombre, no el contenido. `b = otraLista` daría error; `b.push(1)` no.",
          },
        ],
      },
      {
        pregunta: "¿Qué devuelve `[...lista].sort((a, b) => b - a)` y qué le pasa a `lista`?",
        opciones: [
          {
            texto: "Una lista nueva de mayor a menor, y `lista` se queda como estaba.",
            correcta: true,
            porque: "`sort` ordena la lista que le des, pero le estamos dando la copia. Y `b - a` da positivo cuando `b` es mayor, o sea, orden descendente.",
          },
          {
            texto: "Una lista nueva de menor a mayor, y `lista` se queda como estaba.",
            porque: "La copia sí protege el original, pero el orden está al revés: `b - a` es descendente. `a - b` sería de menor a mayor.",
          },
          {
            texto: "Una lista nueva de mayor a menor, y `lista` también queda ordenada.",
            porque: "`lista` no se toca precisamente por los tres puntos. Sin ellos sí quedaría ordenada, y ese es el fallo que los corchetes evitan.",
          },
        ],
      },
      {
        pregunta: "¿Para qué sirve de verdad un cierre?",
        opciones: [
          {
            texto: "Para que unos datos sobrevivan a la función que los creó y solo se puedan tocar por las funciones que tú decidas.",
            correcta: true,
            porque: "Es la base de los datos privados en JavaScript, y también de lo que hacen los composables de Vue: estado que vive dentro y solo sale por donde tú abres.",
          },
          {
            texto: "Para escribir funciones más cortas.",
            porque: "No tiene nada que ver con la longitud. Tiene que ver con qué recuerda una función y quién puede tocarlo.",
          },
          {
            texto: "Para que una función pueda llamarse a sí misma.",
            porque: "Eso es la recursión, que es otra cosa. Un cierre no se llama a sí mismo: recuerda variables de fuera.",
          },
        ],
      },
    ],
  },
  {
    id: "repaso-elendel",
    mundo: "elendel",
    titulo: "El caso de la ciudad",
    preguntas: [
      {
        pregunta: "Llega un texto de un servidor y haces `JSON.parse(texto)`. ¿Qué pasa si el texto está roto?",
        opciones: [
          {
            texto: "Lanza un error, así que hay que envolverlo en un `try`.",
            correcta: true,
            porque: "`JSON.parse` no avisa devolviendo nada: rompe el programa. Y los datos de fuera vienen rotos más de lo que nadie confiesa, así que todo `parse` de algo que no controlas va dentro de un `try`.",
          },
          {
            texto: "Devuelve `null`, y basta con comprobarlo.",
            porque: "Eso sería cómodo y no es lo que hace. Ojo además con que `JSON.parse('null')` sí devuelve `null` sin error, así que comprobar por `null` mezcla dos casos distintos.",
          },
          {
            texto: "Devuelve un objeto vacío con lo que haya podido leer.",
            porque: "No hay lectura parcial: o el texto entero es JSON válido o no lo es.",
          },
          {
            texto: "Depende del navegador.",
            porque: "Está en el estándar y todos hacen lo mismo. Lo que sí cambia entre navegadores es el texto exacto del mensaje de error.",
          },
        ],
      },
      {
        pregunta: "¿Qué diferencia hay entre `export default` y una exportación con nombre?",
        opciones: [
          {
            texto: "Lo que va por defecto se importa sin llaves y se le puede poner el nombre que quieras.",
            correcta: true,
            porque: "Y por eso conviene no abusar de ella: si cada archivo la llama de una forma, buscar dónde se usa algo se vuelve difícil. Lo que va con nombre se importa entre llaves y con su nombre exacto.",
          },
          {
            texto: "La de por defecto es más rápida de cargar.",
            porque: "No hay ninguna diferencia de velocidad. La elección es de legibilidad, no de rendimiento.",
          },
          {
            texto: "Solo se puede usar una de las dos formas por archivo.",
            porque: "Se pueden mezclar sin problema: un `default` y todas las exportaciones con nombre que quieras, y se importan juntas en la misma línea.",
          },
          {
            texto: "La de por defecto no se puede renombrar al importarla.",
            porque: "Es justo al revés: la de por defecto se llama como quien la importa decida, y la que tiene nombre necesita un `as` para cambiárselo.",
          },
        ],
      },
      {
        pregunta: "Quieres subir un 50% todos los valores de `{ acero: 12, peltre: 30 }` y que siga siendo un objeto. ¿Cómo?",
        opciones: [
          {
            texto: "`Object.fromEntries(Object.entries(precios).map(([k, v]) => [k, v * 1.5]))`",
            correcta: true,
            porque: "Ese es el patrón: convertir a lista de pares, transformar cada par en otro par, y reconstruir. La clave está en que el `map` tiene que devolver **un par**, no solo el valor.",
          },
          {
            texto: "`precios.map((v) => v * 1.5)`",
            porque: "Un objeto no tiene `map`: eso es de las listas. Da `TypeError: precios.map is not a function`.",
          },
          {
            texto: "`Object.values(precios).map((v) => v * 1.5)`",
            porque: "Eso da `[18, 45]`, una lista sin las claves. Ha perdido qué metal era cada precio, que es justo lo que había que conservar.",
          },
          {
            texto: "`Object.entries(precios).map(([k, v]) => [k, v * 1.5])`",
            porque: "Casi: eso deja una lista de pares. Falta el `Object.fromEntries` que la vuelve a convertir en objeto.",
          },
        ],
      },
      {
        pregunta: "`cartel.match(/recompensa: (\\d+)/)` sobre un cartel que no lleva recompensa. ¿Qué devuelve?",
        opciones: [
          {
            texto: "`null`, y leerle `[1]` a eso revienta.",
            correcta: true,
            porque: "Ese `null` es medio ejercicio de cualquier búsqueda con expresiones regulares. Hay que comprobarlo antes de sacar el grupo, siempre.",
          },
          {
            texto: "Una lista vacía.",
            porque: "Sería más cómodo, porque `[]` no revienta al pedirle `[1]` —da `undefined`—. Pero devuelve `null`.",
          },
          {
            texto: "El texto entero sin cambios.",
            porque: "Eso es lo que hace `replace` cuando no encuentra nada. `match` devuelve lo encontrado, o `null`.",
          },
          {
            texto: "`undefined`.",
            porque: "Se parece y no es lo mismo. Los dos revientan al pedirles una propiedad, pero conviene distinguirlos al leer un error.",
          },
        ],
      },
      {
        pregunta: "¿Por qué `0.1 + 0.2 === 0.3` es falso?",
        opciones: [
          {
            texto: "Porque los decimales se guardan en binario y 0,1 no cabe exacto.",
            correcta: true,
            porque: "Igual que un tercio no cabe exacto en decimal. Pasa en casi todos los lenguajes, y por eso el dinero se guarda en céntimos enteros y no en euros con decimales.",
          },
          {
            texto: "Porque es un fallo conocido de JavaScript.",
            porque: "No es de JavaScript: es del estándar de coma flotante que usan casi todos los lenguajes. Lo que sí es de JavaScript es que no puedas escaparte eligiendo otro tipo de número.",
          },
          {
            texto: "Porque `===` compara también el tipo, y uno es entero y otro decimal.",
            porque: "En JavaScript solo hay un tipo de número: no existen «entero» y «decimal» por separado. Y `0.1 + 0.2` da `0.30000000000000004`, que es otro número.",
          },
          {
            texto: "Porque hay que usar `==` para comparar decimales.",
            porque: "`==` daría exactamente lo mismo, y de paso traería sus propios problemas de conversión. La forma de comparar decimales es con un margen.",
          },
        ],
      },
      {
        pregunta: "¿Cuál se escribe antes, `setTimeout(f, 0)` o `Promise.resolve().then(g)`, si están seguidos?",
        opciones: [
          {
            texto: "Primero `g`: las promesas tienen su propia cola y es prioritaria.",
            correcta: true,
            porque: "Al acabar el cuerpo se vacía **entera** la cola de microtareas —donde van las promesas y lo que sigue a un `await`— y solo después se coge una tarea de la otra cola, donde están los temporizadores.",
          },
          {
            texto: "Primero `f`, porque su línea está escrita antes.",
            porque: "El orden del código no manda aquí: ninguna de las dos ejecuta nada en su línea. Las dos apuntan algo para después, en colas distintas.",
          },
          {
            texto: "A la vez, porque los dos están pendientes.",
            porque: "JavaScript hace una cosa a la vez, siempre. Nunca hay dos trozos de tu código corriendo en paralelo.",
          },
          {
            texto: "Depende de cuánto tarde el cuerpo del programa.",
            porque: "El cuerpo retrasa a las dos por igual, pero no cambia el orden entre ellas: las microtareas van antes pase lo que pase.",
          },
        ],
      },
    ],
  },
  {
    id: "repaso-ferrocarril",
    mundo: "ferrocarril",
    titulo: "El caso de la línea",
    preguntas: [
      {
        pregunta: "¿Qué desaparece al pasar de `setup()` a `<script setup>`?",
        opciones: [
          {
            texto: "El `return`: todo lo declarado arriba queda visible para la plantilla.",
            correcta: true,
            porque: "Y con él se va el olvido más común de la Composition API, que era declarar algo y no devolverlo. El síntoma era un hueco vacío sin ningún error.",
          },
          {
            texto: "Las props, que ya no se pueden declarar.",
            porque: "Se declaran con `defineProps`, que hace lo mismo que la opción `props`. Lo que no se puede es importarla: no es una función de verdad, es una instrucción para el compilador.",
          },
          {
            texto: "La reactividad, que pasa a ser automática.",
            porque: "Sigue habiendo `ref` y `computed`, y sigue haciendo falta `.value` en el JavaScript. `<script setup>` es azúcar de sintaxis, no un modelo distinto.",
          },
          {
            texto: "El `.value`, que ya no hace falta.",
            porque: "En la plantilla nunca hizo falta y en el JavaScript sigue haciéndolo. Esa asimetría no cambia.",
          },
        ],
      },
      {
        pregunta: "Un componente `Ficha` con `<slot name=\"pie\" :casos=\"casos\" />`. ¿Para qué sirve ese `:casos`?",
        opciones: [
          {
            texto: "Para que quien rellene el hueco pueda usar un dato que solo tiene el hijo.",
            correcta: true,
            porque: "Es lo que hace potentes a los huecos: el hijo tiene el dato y no sabe cómo enseñarlo; el padre sabe cómo enseñarlo y no tiene el dato. Se recoge con `<template #pie=\"{ casos }\">`.",
          },
          {
            texto: "Para pasarle una prop al componente `Ficha`.",
            porque: "Las props van en la etiqueta del componente, no en el `<slot>`. Esto va en dirección contraria: del hijo hacia el contenido que le metieron.",
          },
          {
            texto: "Para que el hueco solo se pinte si `casos` tiene valor.",
            porque: "Eso sería un `v-if`. Un `<slot>` sin contenido y sin respaldo no pinta nada, pero no es por esto.",
          },
          {
            texto: "Para nombrar el hueco.",
            porque: "El nombre lo pone `name=\"pie\"`. Lo de los dos puntos son datos que viajan con él.",
          },
        ],
      },
      {
        pregunta: "`const caja = ref(null)` con `<input ref=\"caja\" />`. ¿Dónde se puede usar `caja.value`?",
        opciones: [
          {
            texto: "En `onMounted` o después, nunca en el cuerpo de `setup`.",
            correcta: true,
            porque: "`setup` corre antes de que se pinte nada, así que ahí la referencia vale `null`. Vue la rellena justo después de montar. Es la misma regla de siempre: lo que toca el DOM va después del primer pintado.",
          },
          {
            texto: "En cualquier sitio: Vue la rellena en cuanto se declara.",
            porque: "En cuanto se declara vale `null`, y usarla ahí da `Cannot read properties of null`. El elemento todavía no existe.",
          },
          {
            texto: "Solo dentro de la plantilla.",
            porque: "En la plantilla no se usa la referencia: la plantilla es quien la **rellena**, con el atributo `ref`.",
          },
          {
            texto: "En `setup`, pero envuelta en `nextTick`.",
            porque: "Funcionaría, y `onMounted` dice mucho mejor lo que quieres. `nextTick` se reserva para cuando cambias un dato y necesitas leer el DOM ya repintado.",
          },
        ],
      },
      {
        pregunta: "¿Cuál es la diferencia entre un composable y un almacén compartido?",
        opciones: [
          {
            texto: "Dónde se declara el estado: dentro de la función o fuera.",
            correcta: true,
            porque: "Dentro, cada llamada crea el suyo; fuera, todas comparten uno, porque un módulo se ejecuta una sola vez. Son dos líneas de sitio y el comportamiento opuesto — y no da ningún error, así que hay que saber mirarlo.",
          },
          {
            texto: "Que el almacén necesita Pinia y el composable no.",
            porque: "Un almacén compartido cabe en diez líneas con un `reactive` fuera de la función. Pinia añade herramientas de desarrollo, una forma única de escribirlo y el renderizado en servidor, no la idea.",
          },
          {
            texto: "Que el composable no puede tener funciones, solo datos.",
            porque: "Puede tener las dos cosas, y lo normal es que devuelva estado y las funciones que lo cambian.",
          },
          {
            texto: "Que el almacén es reactivo y el composable no.",
            porque: "Los dos lo son. La reactividad la da `ref` o `reactive`, y eso se usa igual en ambos.",
          },
        ],
      },
      {
        pregunta: "¿Por qué `usarDescuento` tiene que llamar a `unref` **dentro** de la `computed`?",
        opciones: [
          {
            texto: "Porque un computed depende de lo que lee mientras se ejecuta.",
            correcta: true,
            porque: "Leer el `.value` fuera coge un valor y se acabó: Vue nunca ve esa lectura y no se entera de que hay que recalcular. Dentro, la lectura establece la dependencia. Cuando algo no se actualiza en Vue, la primera pregunta es dónde se está leyendo el `.value`.",
          },
          {
            texto: "Porque `unref` solo funciona dentro de un computed.",
            porque: "Funciona en cualquier sitio: es `isRef(x) ? x.value : x`. Lo que cambia según dónde lo pongas es si establece una dependencia o solo coge un valor.",
          },
          {
            texto: "Por rendimiento: fuera se ejecutaría más veces.",
            porque: "Al revés: fuera se ejecuta una sola vez. El problema no es cuántas, es que el resultado se queda congelado.",
          },
          {
            texto: "Porque fuera daría un error.",
            porque: "No da ninguno, y eso es lo malo. Devuelve un número perfectamente válido que ya no cambia nunca.",
          },
        ],
      },
      {
        pregunta: "¿Qué hace exactamente `<Transition>`?",
        opciones: [
          {
            texto: "Poner y quitar clases CSS en los momentos justos, y esperar a que la salida termine.",
            correcta: true,
            porque: "La animación la escribes tú en CSS. Sin reglas que usen esas clases no se ve nada, y el componente parece roto. Lo que sí resuelve Vue —y a mano es incómodo— es no quitar el elemento del DOM hasta que la animación de salida acabe.",
          },
          {
            texto: "Animar el elemento con una animación por defecto.",
            porque: "No trae ninguna. Vue no puede saber cómo quieres que se vea.",
          },
          {
            texto: "Evitar que el componente se destruya al ocultarse.",
            porque: "Eso es `<KeepAlive>`. `<Transition>` no cambia si el elemento existe o no, solo cómo entra y sale.",
          },
          {
            texto: "Pintarlo en otro sitio del documento.",
            porque: "Eso es `<Teleport>`, que sirve para que un diálogo no lo recorte un `overflow: hidden`.",
          },
        ],
      },
    ],
  },
]

export const REPASOS_POR_MUNDO = Object.fromEntries(REPASOS.map((r) => [r.mundo, r]))

/** Lo que paga cada acierto nuevo. Solo se cobra lo que se mejora sobre el mejor intento. */
export const CROQUETAS_POR_ACIERTO = 2
