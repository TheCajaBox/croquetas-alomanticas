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
]

export const REPASOS_POR_MUNDO = Object.fromEntries(REPASOS.map((r) => [r.mundo, r]))

/** Lo que paga cada acierto nuevo. Solo se cobra lo que se mejora sobre el mejor intento. */
export const CROQUETAS_POR_ACIERTO = 2
