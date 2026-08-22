# Gatos y Código

Un juego para aprender **JavaScript ES6, Vue 2 y Vue 3** escribiendo código de verdad.
Lo narra **Wayne**, de *Nacidos de la Bruma: era 2*, que comenta lo que haces, te vende
pistas y te recuerda que le des de comer al gato.

No hay respuestas de opción múltiple: escribes código, se ejecuta en un sandbox aislado y
se comprueba con tests. Lo que ganas se paga en **croquetas**, y con las croquetas se cuida
una colonia de gatos que, cuando están contentos, te devuelven el favor cambiando las reglas
del juego a tu favor.

## Jugar

Está publicado en **https://thecajabox.github.io/croquetas-alomanticas/** — se abre en
cualquier navegador, también en el móvil, y no hace falta instalar nada.

> Cada empujón a la rama lo vuelve a publicar solo. La ruta de la que cuelga el juego se
> deduce del nombre del repositorio (ver `scripts/base-del-sitio.mjs`), así que renombrarlo
> no rompe nada: basta con volver a desplegar.

El progreso se guarda en el navegador (`localStorage`), sin cuentas ni servidores. El móvil
y el ordenador son partidas distintas; en **Ajustes** hay exportar e importar para pasarla
de uno a otro.

## Los nueve mundos

| Mundo | Qué se aprende | Retos |
|---|---|---|
| **El primer día** | Qué es una variable, qué tipos hay, cómo se lee un programa, cómo se llama cada parte de una función. Casi sin escribir | 9 |
| **La comisaría** | Comparar y `===`, `if`/`else`, arrays e índices, bucles y acumuladores, seguir un bucle con el dedo, objetos, datos anidados, métodos de texto | 12 |
| **Los Áridos** | JavaScript ES6: ámbito, flechas y `this`, desestructuración, `map`/`filter`/`reduce` por dentro, `?.` y `??`, promesas | 12 |
| **El taller** | Clases, `extends` y `super`, `throw`/`try`/`catch`, cierres y datos privados, `Set` y `Map`, referencias frente a copias, leer un error hacia atrás | 12 |
| **Elendel** | Lo que rodea al lenguaje: módulos, JSON, la familia de `Object`, expresiones regulares, fechas, números que engañan, el bucle de eventos, esperar a varios | 9 |
| **La mansión Ladrian** | Vue 2 con Options API: `data`, directivas, `computed` frente a `methods`, los caveats de reactividad y `$set`, props y `$emit`, ciclo de vida | 10 |
| **La Nueva Seran** | Vue 3 con Composition API: `ref` y `reactive`, `computed` por dentro, `watch` frente a `watchEffect`, `provide`/`inject`, composables | 10 |
| **El ferrocarril** | Vue aplicado: `<script setup>`, huecos, referencias de plantilla, parar lo que se arranca, estado compartido, rutas, composables a fondo, `Transition` y `Teleport` | 9 |
| **Cambio de forma** | Refactorizar: bucles a métodos, `var` a `const`, repetición a función, `.then` a `async`/`await`, Options API a Composition | 7 |

**La cuesta no tiene escalones.** Cada mundo se apoya en el anterior y ninguno se puede
saltar, porque quien llega a Vue sin saber qué es un objeto no aprende Vue: sufre Vue.

El primer día es la rampa de entrada: se empieza señalando y colocando piezas, no
escribiendo. La comisaría es lo que hay debajo de todo lo demás —decidir, repetir y
guardar— y es el mundo que hace que los Áridos no sean un muro. Los Áridos son el
JavaScript moderno del día a día. El taller es el salto de saber la sintaxis a tener
oficio. Y solo entonces aparece Vue, primero la casa vieja y después la ciudad nueva, que
son la misma idea contada de dos maneras. Cambio de forma cierra: el único mundo donde se
empieza con el código ya funcionando, y lo que se aprende no es hacer que funcione sino
dejarlo legible sin romperlo.

Dentro de Los Áridos hay tres retos puente colocados justo antes de los dos escalones que
más se notan: uno sobre pasar una función a otra función, antes de pelearse con `this`, y dos
sobre los métodos de las listas, antes de escribir `map` y `reduce` a pelo.

Hay **doce clases de reto**, y solo cuatro piden escribir código. Los cuatro últimos
mundos llegaron a ser 29 retos seguidos sin uno solo de señalar; ya no:

- **Elegir** la respuesta, con el porqué de todas las opciones, también de las falsas.
- **Emparejar** conceptos con lo que significan.
- **Colocar** líneas desordenadas, que luego se ejecutan tal y como las dejes.
- **Rellenar** huecos con fichas, con fichas de más para que no salga por descarte.
- **Predecir** qué va a imprimir un código, que después se ejecuta delante de ti.
- **Escribir** una solución desde cero.
- **Cazar el fallo** en código que casi funciona.
- **Reescribir** código que ya funciona, con los tests verdes desde el principio como red.
- **Seguir el hilo**: rellenar la tabla de la ejecución, una fila por vuelta y una columna
  por variable. Leer código es simular su ejecución en la cabeza, y eso no se practica en
  ningún sitio.
- **Cazar la línea**: código roto y su error de verdad, y hay que señalar la culpable — que
  casi nunca es donde revienta.
- **Poner nombre** a las partes de un fragmento: cuál es el parámetro, cuál el argumento,
  cuál el cuerpo. El vocabulario se aprende reconociéndolo.
- **Verdadero o falso**: una tanda de frases que se marcan de golpe, con el porqué de todas
  al corregir, también de las que acertaste.

Qué es cada tipo está en un solo sitio, [`retos/tipos.js`](src/contenido/retos/tipos.js), y
un tipo que no esté ahí no abre. Antes vivía en cuatro listas escritas a mano y un tipo mal
cableado salía pintado como un reto de escribir, sin dar ningún error.

## Los seis que te acompañan

**Wayne** es el juego. Preside la portada, narra, se burla y te vende pistas. Habla también
cuando no ha pasado nada, porque se aburre. Y cobra: la primera invita la casa, la segunda
va al 60% de lo que paga el reto y **la tercera al doble**, así que comprarla siempre te
deja en números rojos respecto a lo que vas a ganar. Esa es la idea — cada pista es comida
que le quitas a tus gatos. En los jefes ni siquiera abre el puesto.

Todos tienen su cara: las ilustraciones de los personajes, recortadas del fondo y
compuestas sobre un disco con el color que cada uno lleva en la interfaz — el cobre de Wayne,
el azul acero de Wax, el gris ordenado de Steris, el vino de Marasi, el jade de MeLaan y el
ciruela de Brisa. El disco sale de la misma fórmula que el de quien **no** tiene ilustración
—un 20% de su color sobre `#1d1826`—, así que los que van llegando encajan con los que ya
estaban sin elegirle un tono a mano a cada uno, y quien todavía no tiene cara sale con ese
disco y su inicial en vez de con la de otro.
Viven en `src/recursos/`, pesan 166 kB entre las siete y se importan como
módulos para que Vite les ponga su hash y su ruta base; escritas a mano, esas rutas se
romperían al publicar en Pages.

Wayne sale además de cuerpo entero, con el bastón al hombro, presidiendo la portada.

**Wax** escribe el temario, y es lo más largo del juego: **90 lecciones, 700.000
caracteres**, una por reto — entre 7.000 y 9.000 cada una, sin excepción. No son notas al margen — cada una tiene la estructura de
un artículo: el problema que resuelve, la idea, el modelo mental, **lo que despista**,
**un ejemplo trabajado con su salida exacta** y **cómo se plantea** ese tipo de problema.
Esas tres últimas secciones las tienen las noventa, y son las que convierten saber la
sintaxis en saber plantear.

Todos los ejemplos están comprobados ejecutándolos, no escritos de memoria. De ahí salen
cosas que casi siempre se cuentan mal: que `[] == false` sea verdadero **y** que una lista
vacía entre en un `if`; que `[1,2,3].map(parseInt)` dé `[1, NaN, NaN]`; que
`[10, 9, 100].sort()` dé `[10, 100, 9]` y además te ordene la lista original; que
`[].every(...)` sea verdadero; o que Álvaro vaya después de Beatriz al comparar con `<`.

Viven fuera del paquete inicial y se piden al abrir su reto, así que pueden crecer
todo lo que haga falta sin que le cuesten un byte a quien no las abra.

Además, aparece cuando la cosa se pone seria: si un reto se te resiste tres veces, se planta
ahí y te manda a leer. Y cada reto lleva **un apunte suyo, gratis y a todo lo ancho**, con la
explicación del concepto y sus ejemplos — al estilo de un artículo de
[javascript.info](https://es.javascript.info): primero se lee, después se pelea uno con el
ejercicio. Wayne cobra por decirte la respuesta; Wax no cobra por explicarte el porqué.

Los apuntes explican con lo que Wax tiene a mano: carteles de busca y captura, el almacén de
metales, el inventario de la mansión, los avisos que tardan en llegar. Un `const` es una
tarifa fijada por la casa; desestructurar es sacar datos de una ficha; `Promise.all` es
esperar a que contesten todos aunque uno conteste antes. La sintaxis se aprende igual y se
recuerda mejor.

**Steris** se encarga de que nadie se quede fuera por no saber las palabras. Es la anfitriona
de La comisaría —el mundo de los cimientos— y del ferrocarril —donde se monta la aplicación
entera—, y
lleva además dos listas, y las dos hacen falta:

- **El glosario.** Ochenta y ocho términos explicados sin usar otras palabras técnicas
  sin explicar. No hay que ir a buscarlos: aparecen **subrayados con puntitos allá donde
  salgan**, en los enunciados y en los apuntes, y se pulsan sin salir del reto. Nunca dentro
  de un bloque de código, donde `map` es una llamada y no una palabra que definir.
- **La lista de imprevistos.** Los errores de JavaScript salen en inglés y no dicen nada
  útil: `Cannot read properties of undefined` es un muro para quien empieza. Steris tiene
  **veinte** previstos y los traduce automáticamente a qué significan y a qué suele haberlos
  causado, justo debajo del error. El orden de la lista importa: los patrones concretos van
  antes que los generales, porque gana el primero que casa. Un HTML devuelto en vez de datos
  encajaba con el genérico y salía traducido como «hay un símbolo donde no tocaba», que es
  verdad y no ayuda; ahora dice que el servidor ha mandado una página de error.

Y antes de todo está **la antesala**: su orientación para quien no ha visto código en su
vida. Qué es un programa, qué es JavaScript, qué pinta Vue y por qué aquí hay dos versiones,
cómo funciona el juego y qué hacer cuando algo se atasca. Dos minutos, y se puede volver
cuando sea.

**Marasi** hace tres cosas, y es anfitriona de Elendel — el mundo de los expedientes, los
formatos y las referencias cruzadas, que es lo suyo.

**Te revisa el código cuando ya funciona.** Superas un reto y ella lee lo que
escribiste: un `let` que nunca cambia, tres `if` metidos uno dentro de otro, un
parámetro reasignado, un `catch` vacío, el mismo número suelto tres veces. Diez
comprobaciones sobre el árbol de sintaxis, nombrando siempre lo concreto que ha
visto y explicando por qué importa.

Aparece **solo después de superar**, nunca antes: primero se resuelve, después se
mira si se puede dejar mejor. Ese es el orden del oficio y es el único que no
desanima. Y no paga croquetas a propósito — pagar por seguir consejos los
convertiría en requisitos, y las buenas prácticas son criterio, no reglamento.
El criterio incluye saber cuándo no aplican.

Y llega al final de cada mundo con el expediente debajo del brazo: seis preguntas
sobre lo que se acaba de ver, con el porqué de todas las opciones, también de las que no
elegiste. No cuentan para el progreso y se pueden repetir tantas veces como quieras, pero
**solo se cobra lo que se mejore**: repetir un repaso bordado no da ni una croqueta más.
Resolver algo una vez y no volver a verlo nunca es la forma más rápida de olvidarlo.

**MeLaan** es la única que aparece con un mundo propio. Cambiar de forma se le da bien, así
que le toca el mundo donde nada cambia de comportamiento y todo cambia de aspecto: los siete
retos de Cambio de forma parten de código que ya pasa sus tests, y el reto es dejarlo mejor
sin ponerlos rojos ni una vez. Es el único sitio del juego donde el enunciado empieza
diciendo «esto funciona».

**Armonía** es a quien se le pregunta. Los demás te hablan; él solo contesta, y solo lo que
le preguntes: qué significa una palabra, qué significa el error que te ha salido, dónde se
explicaba aquello que ya viste, y —lo que de verdad lo distingue— **qué le pasa a tu código
ahora mismo**, porque lee lo que has escrito y mira qué test se ha puesto rojo.

Lo que no hace, nunca, es darte la solución. Y no porque se lo hayamos prohibido: es que no
la tiene. Lo que Armonía recuerda se construye con una lista blanca de tres campos —título,
enunciado y apunte—, así que las soluciones, los tests y las pistas quedan fuera por
construcción. Un test recorre los 114 retos y comprueba que **cada palabra que puede decir
sale de material que ya tienes gratis y abierto en la misma pantalla**.

Que se contenga es el personaje, no una norma nuestra: en la era 2, Armonía podría
intervenir y no lo hace, porque intervenir de más estropea justo lo que intenta sostener.
Es su discusión con Wax durante toda la saga. Aquí queda como un reparto limpio: **Wayne
cobra y te acerca la respuesta; Armonía no cobra y no te la da jamás.** Y en los jefes se
aparta todavía más — ahí solo traduce errores y define palabras.

### Y si quieres, que además converse

Armonía funciona para todo el mundo sin configurar nada. Quien quiera conversación de
verdad puede enchufarle **una clave suya** en Ajustes: Claude, OpenRouter (que tiene modelos
gratuitos), DeepSeek, Groq o cualquier servicio compatible.

La clave la pone el jugador y no hay alternativa: el juego es un sitio estático en un
repositorio público, así que cualquier clave que fuera en el paquete la leería cualquiera
abriendo las herramientas del navegador. No es una clave, es un cartel. Se guarda en este
navegador y **aparte de la partida**, para que exportar tu progreso al móvil no se lleve
también tu clave — hay un test que lo fija.

Con clave o sin ella, las tres capas que impiden que dé la solución siguen puestas: **no la
recibe** (lo que se envía al modelo se arma sin ella), se le dice que no la dé, y **se le
tacha el código a la salida** mientras haya un reto abierto — una instrucción se puede
sortear hablándole bonito, una comprobación de texto no. Y pedirle la solución se corta en
el navegador, sin llegar a gastar la clave de nadie.

El SDK de Anthropic se carga solo si eliges Claude: son 162 kB que no se descarga quien no
los use. El paquete principal crece 6 kB por todo esto.

Su cara se procesa distinta a las otras cinco. A los demás les quité el fondo por
inundación desde los bordes; su ilustración tiene bruma detrás, un degradado, y el recorte
ni la limpiaría ni respetaría la túnica. Tampoco hacía falta: la bruma es suya. Va recortado
en círculo con ella dentro y un aro dorado de sus pendientes terrisanos, y queda el único
avatar de disco oscuro de los seis.

### Lo que cuesta que te ayuden

El precio de una pista sale de lo que paga su reto, no de una tabla fija. Antes era
`[0, 3, 8]` y la curva salía justo al revés de lo que hacía falta: la tercera pista costaba
el **133%** de tu bolsa en el primer mundo y el **9%** en el último, porque los precios no
se movían y tú ibas acumulando. Cuanto más difícil el reto, más barata la ayuda. Comprar
todas las pistas del juego costaba 616 croquetas cuando el juego reparte 614: salía a
cuenta comprarlas todas.

Atado a la recompensa, la curva se sostiene sola —se estabiliza en torno a un tercio de la
bolsa— y comprarlas todas pasa a costar 1259. No hará falta recalibrar nada al añadir
mundos.

Y ninguna pista da ya la solución entera. La escalera es: **gratis**, dónde mirar; **60%**,
qué concepto te falta; **200%**, el paso exacto que te queda, sin la línea escrita. Un test
recorre los 103 retos con pistas y comprueba que la última no contenga ni una línea de su
solución — es lo que impide que esto se relaje con el tiempo.

Los once jefes no tienen pistas en absoluto. Cierran un mundo, y todo lo que hace falta se
ha visto en los retos de antes: saber que lo sabes es resolverlo sin nadie detrás. Ahí solo
queda Armonía, y en los jefes él tampoco diagnostica — únicamente traduce errores y define
palabras, que es la válvula para que nadie se quede mirando un muro en inglés.

## La voz de Wayne

Casi doscientas frases repartidas por todo lo que puede pasar, y ninguna copiada de los
libros: el registro se imita, el texto es propio —el repositorio es público y ese texto tiene
dueño y traductor—. Lo que se imita está escrito en la cabecera de
`src/contenido/narrador/lineas.js` para que no se pierda por el camino: Wayne le habla al
sombrero como si fuera alguien, corrige la gramática en el peor momento, consuela fatal
—siempre hay alguien peor—, infla las historias hasta que no queda nada de verdad y lo
reconoce a mitad de frase, nunca dice que bebe sino que investiga estados, y no roba:
intercambia.

Hay pruebas que vigilan que ningún saco de frases se quede con una sola, que los que más
salen tengan de sobra y que no haya dos frases repetidas en todo el juego.

## Cómo se ejecuta el código

Cada itinerario declara con qué se ejecuta lo que escribe el jugador, y el motor tiene un
**frente por lenguaje** (`src/motor/lenguajes/`) que decide qué se mira antes de ejecutar:

| | JavaScript | PHP |
|---|---|---|
| ¿Se entiende? | acorn, aquí mismo | el `ParseError` de PHP al incluir el fichero |
| ¿Cumple las reglas del reto? | el árbol de acorn | `token_get_all()` dentro del sandbox |
| Bucle sin salida | contador inyectado | se mata el worker, que ya se hacía |
| Tests | `public/sandbox/aserciones.js` | `sandbox-php/aserciones.php`, mismas palabras |

Antes esto no existía y `evaluarEnvio` daba por hecho que todo era JavaScript: el primer reto
de PHP contestaba «tu código no se puede ni leer» señalando la línea 1. Un entorno cuyo
lenguaje no tenga frente **falla al arrancar** en vez de caer en el de JavaScript por descarte.

### PHP en el navegador, sin servidor

PHP 8.5 compilado a WebAssembly (`@php-wasm/web`, el runtime de WordPress Playground) dentro
de un Web Worker. No hay backend: el código del jugador se ejecuta **en su propio navegador**,
igual que el de JavaScript, y no sale a ninguna parte.

Lo que costó, medido y no supuesto:

- **`loadWebRuntime` arrastra las ocho versiones de PHP** (5.2 a 8.5) con un `switch` de
  importaciones dinámicas: unos 140 MB de wasm en `dist/`. Se recorta a la 8.5 con un alias, y
  las otras siete van a un módulo que avisa si alguien las pide.
- De las dos variantes de la 8.5 se lleva **solo asyncify**, que funciona en todos los
  navegadores: cargar también jspi serían 40 MB en vez de 20.
- Vite intentaba **instanciar** el `.wasm` en vez de darle una URL. Declarándolo recurso
  (`assetsInclude`) funciona sin plugins.
- `icu.dat`, 29 MB de datos de internacionalización que el juego no usa, salían en `dist/`
  pesando más que PHP. Un plugin de diez líneas los sustituye por un fichero vacío.
- El worker se empaqueta **en una pasada aparte y con sus propios plugins**. Los de arriba no
  llegan: sin dárselos también a `worker.plugins`, los 29 MB seguían saliendo.

Resultado: `dist/` son **24 MB**, de los que 20 son el binario de PHP **pedido en diferido** —
solo lo descarga quien entra en la primera era— y el paquete principal se queda en 0,49 MB. El
worker empieza a descargar en cuanto se abre el reto, así que cuando el jugador pulsa Ejecutar
suele estar listo: 0,9 s el primer envío y 1,6 s los siguientes, medidos en el navegador. Y el
primer envío tiene un margen de 60 s en vez de 3, porque ahí el reloj no mide el código de
nadie: mide una descarga.

Y el editor **colorea PHP como PHP**: antes lo pintaba con la gramática de JavaScript y `<?php`
salía como dos operadores y una variable. La gramática son otros 154 kB, así que se pide en
diferido igual que el binario, con dos trampas que costaron encontrar:

- El trozo empaquetado salía como `index-xxxx.js`, indistinguible de otros cuatro con el mismo
  nombre. Se le pone nombre con un módulo propio de una línea
  ([`motor/gramatica-php.js`](src/motor/gramatica-php.js)) y no con `manualChunks`, que se
  llevaba dentro el núcleo de CodeMirror: el trozo pasaba de 154 a 536 kB y el editor acababa
  necesitando la gramática de PHP para arrancar.
- Vite mete las dependencias de un trozo en la lista de **precarga** de la ruta que lo pide, así
  que abrir cualquier reto de JavaScript descargaba el analizador de PHP —justo lo que se
  quería evitar—. Se quita con `build.modulePreload.resolveDependencies`. Lo cazó la prueba de
  extremo a extremo mirando la red, no una revisión del código.

## La ficha y el cuerpo de un reto

El catálogo se montaba con `import.meta.glob(..., { eager: true })`, así que **los retos
viajaban enteros en el paquete principal**: enunciado, código de partida, solución, tests,
pistas y explicaciones incluidos. Todo eso lo descargaba y lo analizaba quien entraba a mirar
la portada.

Medido campo por campo sobre los retos que había entonces, 102:

| | |
|---|---|
| Lo que el índice necesita de verdad | **9,2 kB** |
| El cuerpo del reto, que solo hace falta al abrirlo | **233,8 kB** |

Una proporción de 25 a 1, con `tests` (52,1 kB), `pistas` (41,4 kB), `enunciado` (40,4 kB) y
`solucion` (25,6 kB) a la cabeza. Así que ahora van por separado:

- La **ficha** —id, mundo, entorno, tipo, título, si es jefe, la recompensa y los requisitos— la
  genera al construir [`scripts/plugin-fichas-de-retos.mjs`](scripts/plugin-fichas-de-retos.mjs),
  que importa los retos en Node y emite un módulo virtual. Es lo justo para pintar la lista de
  un mundo, decidir qué está abierto, contar el avance y repartir insignias.
- El **cuerpo** se pide al abrir el reto, igual que los apuntes.

Resultado medido: el paquete principal pasa de **725 kB a 488** (de 237 a 169 comprimido), y los
~170 retos que quedan por escribir añadirán al arranque unos 15 kB en vez de 600.

**Por qué un plugin y no algo más simple.** La forma evidente sería que cada reto exportara dos
cosas, la ficha y el resto: no funciona, porque el módulo tendría un import estático y otro
dinámico a la vez y entonces Rollup **no lo separa**. La otra sería un índice generado y
versionado, y habría que acordarse de regenerarlo con cada reto; quedan unos 170 por escribir y
añadir uno sigue siendo crear su fichero y nada más.

**La regla que sostiene todo esto:** los `import()` de los cuerpos viven **solo** en
`contenido/retos/index.js`. Si otro módulo importara un reto de forma estática, Rollup dejaría
de poder separarlo y su trozo volvería al paquete principal sin que nada fallara ni avisara. Hay
tres pruebas para eso: una recorre `src/` buscando ese import, otra compara la ficha con el
fichero del reto campo por campo, y una de extremo a extremo mira la red y comprueba que la
portada y la lista de un mundo **no piden ningún cuerpo** y que abrir un reto pide exactamente
el suyo.

Y una que costó encontrar: el cuerpo del reto vive en un `shallowRef`, no en un `ref`. Un `ref`
normal lo envuelve en un proxy reactivo hasta el último rincón, y el reto viaja al sandbox por
`postMessage`; un proxy no se puede clonar, así que ejecutar reventaba con `DataCloneError` en
los 18 recorridos que escriben código. El cuerpo de un reto no cambia nunca, así que la
reactividad profunda tampoco servía para nada.

## Cuatro caminos

El juego tiene **itinerarios**: caminos de aprendizaje completos, cada uno con su materia, su
temario y su reparto. El primero está terminado y **el de PHP lleva dos mundos jugables** —La
Ceniza y La tripulación—; Elantris y Sel se anuncian en la entrada y dicen «en obras» hasta que
tengan mundos.

| Itinerario | Materia | Narra | Quién explica |
|---|---|---|---|
| **La segunda era** | JavaScript y Vue | Wayne | Wax |
| **La primera era** | PHP | Brisa, y Ham le interrumpe | Kelsier la primera mitad; Elend y Vin la segunda |
| **Elantris** | SQL | Galladon | Raoden |
| **El alma del emperador** | Ciberseguridad | Shai | Gaotona |

Cada uno declara con qué se **ejecuta** el código (`lenguajes`) y su **reparto**: quién narra,
quién escribe el temario, quién vende las pistas, quién lleva el glosario y quién contesta
dudas sin dar la solución. El reparto no es adorno: un itinerario con el reparto mal puesto
suena a otro. Seguridad es el único con dos lenguajes, porque una inyección de SQL no se
entiende sin una base de datos recibiéndola de verdad.

No compiten: no hay que terminar uno para empezar otro, y **comparten croquetas, gatos,
sombreros e insignias**, porque es un solo juego con varios temarios. Lo primero al entrar es
elegir cuál, y esa pantalla **no redirige sola** al que venías jugando: si `/` saltara al
itinerario de siempre, los demás dejarían de existir para quien ya tuviera partida.

## Menos texto y más práctica, a propósito

Los itinerarios nuevos cambian el equilibrio respecto a la segunda era, y no por casualidad:

- **Doce retos por mundo** y **la mitad como mucho de escribir código**. El resto son
  predicciones, trazas, elegir, emparejar, verdadero o falso y rellenar huecos, que ya existían
  y no dependen del lenguaje.
- **Apuntes de la mitad de largo**: hasta 4.500 caracteres en vez de los 7.000 a 9.000 de los
  de Wax. Lo que antes era un párrafo explicando algo, aquí es un reto que te lo hace ver.
- **Cuatro tipos de reto distintos como mínimo** por mundo, o serían doce retos iguales.

Las tres cosas las vigila una prueba, y solo se les exigen a los itinerarios nuevos: El kandra
es refactor de principio a fin y eso es su gracia, no un defecto.

### Las tandas de práctica

Un reto de escribir puede traer **`variantes`**: más tandas de tests con otros datos. Al
superarlo aparece «otra vez, con otros datos» y se juega el mismo reto contra otros números,
tantas veces como se quiera. Cuesta cuatro líneas de motor porque los `tests` de un reto ya son
datos y no código.

Practicar **no paga croquetas y no cuenta como intento**. Lo segundo importa más de lo que
parece: dos insignias se miran en `intentos`, así que contar la práctica las volvía
inalcanzables por el simple hecho de volver a abrir un reto que ya estabas haciendo bien. Y las
soluciones de referencia de **cada tanda** se ejecutan en las pruebas: una tanda imposible es
un reto imposible que además parece resuelto.

### Ham interrumpe

En la primera era, Brisa cuenta lo que ha pasado y **Ham le corta para preguntar por qué**. Que
un test pase no es lo mismo que entender por qué pasa, y esa distancia es la que separa copiar
de aprender; la pregunta cae justo cuando menos apetece hacérsela, al ver el verde.

Interrumpe **una de cada tres veces** que podría —en todas sería un pesado, y a un pesado se le
cierra el bocadillo sin leerlo—, se presenta la primera vez que abre la boca, y no aparece
donde el reparto del itinerario no declara `interrumpe`: en la segunda era no interrumpe nadie.
Su frase espera a que el narrador termine en vez de pisarla, y con el narrador callado del todo
tampoco habla: quien pide silencio no quiere dos voces en vez de una.

## La portada de un itinerario

Dentro de cada camino, lo primero que hay si ya has empezado es **por dónde ibas**: el reto
que toca, en qué mundo, lo que llevas hecho —retos, racha, insignias, sombreros, croquetas— y
un botón que lleva justo ahí. Antes la portada enseñaba los mundos y ni una palabra de dónde
te habías quedado, así que para seguir jugando había que acordarse. Recién llegado dice «por
aquí se empieza» y señala el primero.

Debajo del retrato de quien narra va un lema distinto cada vez que se entra: el mismo siempre
acababa siendo parte del mueble.

## Los gatos

Diez gatos, uno por metal alomántico, con la personalidad y el beneficio que le corresponde
a su metal: Acero empuja cosas de las mesas y te da más croquetas, Estaño lo oye todo y te
avisa de los requisitos mientras escribes, Bendaloy duerme en una burbuja de tiempo y le da
más margen a tu código, y Aluminio es inmune a todo y no aporta absolutamente nada.

Se ganan repartidos por toda la cuesta. Antes estaban todos al acabar el tercer mundo: los
29 retos siguientes —más de la mitad del juego— repartían dos, y El taller y Cambio de forma
ninguno. La curva de premio iba justo al revés que la de dificultad, que es el mismo error
que ya tenía la economía de las pistas.

Los indicadores bajan con el tiempo real, estés o no estés delante. **Ningún gato se muere
ni se va nunca**: esto es un juego para aprender, no para castigar. Un gato desatendido solo
se pone triste y deja de echarte una mano hasta que le hagas caso.

### La casa y el jardín

Los gatos no viven en una lista de fichas: viven en una casa con jardín, dibujada en SVG como
todo lo demás —el juego es un sitio estático y no depende de ninguna imagen—. Duermen en el
sofá, se sientan junto a la ventana, cruzan la puerta y se van a la charca o al pie del árbol,
y vuelven. El deambular vive en `src/motor/paseo.js`, aparte de lo que pinta, para poder
probarlo: hay una prueba que pasea a cinco gatos media hora y comprueba que ninguno acaba
andando por el tejado.

Se pulsa un gato para atenderlo, y dos de los tres cuidados se hacen con las manos:

- **Cepillar es arrastrar por encima del gato**, con el dedo o con el ratón, hasta que deja de
  soltar pelo. El pelo va cayendo por el aire mientras tanto.
- **Jugar es una pluma que persigue.** No se llena una barra: se cuentan **zarpazos**, y para
  que haya otro hay que mover la pluma —retirándosela de golpe o paseándosela por delante—.
  Plantar el dedo encima del morro cuenta una vez y ya: el gato deja de picar, y así la regla
  se aprende sin que nadie la escriba. La persecución vive en `src/motor/juguete.js`, aparte
  de lo que pinta, con sus pruebas.

Las dos se manejan con eventos de puntero, que valen para el dedo y para el ratón sin
detectar nada. Y las dos dejan un botón para terminar sin arrastrar, porque hay quien navega
con teclado y dejarle el gato sucio —o aburrido— no tendría ninguna gracia.

Las fichas de siempre siguen ahí, en la otra pestaña, para quien quiera ver los números.

## Lo que se colecciona

### Los sombreros

Wayne ha ido dejando **catorce sombreros escondidos** por todo el juego: en la cabecera, en el
panel de pistas, en el refugio, dentro de la propia sombrerera… Están casi transparentes,
así que hay que pasar el ratón por los rincones para dar con ellos. Cada uno que encuentras,
él jura que era suyo y te lo cambia por croquetas; tú te lo quedas igual y se apunta en la
sombrerera, que enseña una pista de los que aún faltan.

### Los recortes del Elendel Daily

Nueve recortes de prensa que **no se buscan: caen solos**, al hacer ciertas cosas. Cuáles, no
se dice. El titular es la broma del periódico; el pie de página lleva un consejo que sí
sirve, de esos que normalmente solo se aprenden a base de perder tardes.

## Lo que sostiene las ganas

Nada de esto paga croquetas. La tarifa por reto se calibró a propósito y no se toca; lo que
había que arreglar era que la motivación se apagaba justo donde el juego se pone difícil.

- **La racha, a la vista.** El juego llevaba contando los retos seguidos sin pedir una pista
  desde siempre, y solo se veía como una línea de estadística en Ajustes. Ahora sale en la
  cabecera a partir de dos, Wayne la comenta en 3, 5, 10 y 20 —solo en los saltos que se
  notan, porque cantarla en cada reto la convertiría en ruido— y avisa cuando se rompe.
- **Terminar un mundo tiene su momento.** Antes no lo tenía: la despedida que Wayne llevaba
  escrita para cada mundo salía como un párrafo en la lista de retos, y quien tumbaba al
  jefe salía por el mismo enlace que en cualquier otro reto. Ahora se cierra con su
  despedida, lo que se abre, el gato que espera en el refugio y el enlace al repaso.
- **Las insignias**, que no pagan (ver arriba).
- **Nueve frases que estaban escritas y no decía nadie.** Wayne se impacienta si llevas un
  rato sin ejecutar nada, comenta el trasto que te acaba de colocar y el primer intento de
  un reto; Wax te da la enhorabuena al cerrar un mundo; Steris avisa de que un fallo lo
  tenía previsto; MeLaan recuerda que el código ya funciona. Hay una prueba que comprueba
  que ningún saco de frases se quede otra vez sin usar.

## Apartado visual

Bruma de fondo en tres capas que se cruzan muy despacio, gatos que respiran, parpadean y
menean la cola —cada uno con su propio ritmo, sacado de sus colores, para que la colonia no
parezca un escaparate—, la casa de noche con su lámpara encendida y su luna, resultados de
los tests que entran escalonados, croquetas que suben flotando al ganarlas y transiciones
entre pantallas.

Todo eso se apaga solo si el sistema pide menos movimiento (`prefers-reduced-motion`): nada
de lo que se anima hace falta para jugar.

## Desarrollo

```bash
npm install     # instala y copia los runtimes de Vue a public/vendor/
npm run dev
npm test        # motor, almacenes, Armonía, Marasi y las soluciones de los 114 retos
npm run test:e2e
```

En este entorno, las pruebas de extremo a extremo usan el Chromium ya instalado:

```bash
CHROMIUM_DEL_SISTEMA=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run test:e2e
```

### Cómo está montado

El juego es una aplicación de Vue 3 con Vite, Pinia y CodeMirror 6. El código del jugador
**nunca** se ejecuta en la misma página que el juego:

- Los retos de ES6 corren en un **Web Worker**, que se puede matar en seco si algo se dispara.
- Los de Vue corren en un **iframe** con `sandbox="allow-scripts"` y sin `allow-same-origin`,
  o sea con origen opaco: desde ahí no se puede leer la partida guardada ni tocar el juego.
  Ese mismo iframe es la vista previa, así que ves tu componente pintado de verdad.

Los runtimes de Vue 2.7 y Vue 3 se sirven desde `public/vendor/`, en su versión de
desarrollo: sus avisos («evita usar un valor no primitivo como key») son material didáctico.

Antes de ejecutar nada, el código pasa por dos filtros construidos sobre el AST con acorn:
los **requisitos** del reto («sin bucles», «declara `componente`») y un **contador de vueltas**
inyectado en cada bucle, para que un `while (true)` acabe en un error legible en lugar de
congelar la pestaña.

Para añadir un reto basta con crear su fichero en `src/contenido/retos/`; el formato está
explicado en el [README de esa carpeta](src/contenido/retos/README.md). No hay ningún índice
que tocar.

### Sobre el contenido

Todos los diálogos de Wayne son originales, escritos imitando el registro del personaje. No
hay texto copiado de los libros de Brandon Sanderson: las referencias son alusiones (metales,
lugares, manías del personaje), como en cualquier proyecto de aficionado.
