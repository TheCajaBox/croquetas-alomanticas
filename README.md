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

## Los siete mundos

| Mundo | Qué se aprende | Retos |
|---|---|---|
| **El primer día** | Qué es una variable, qué tipos hay, cómo se lee un programa. Casi sin escribir | 7 |
| **La comisaría** | Comparar y `===`, `if`/`else`, arrays e índices, bucles y acumuladores, objetos, datos anidados, métodos de texto | 10 |
| **Los Áridos** | JavaScript ES6: ámbito, flechas y `this`, desestructuración, `map`/`filter`/`reduce`, `?.` y `??`, promesas | 10 |
| **El taller** | Clases, `extends` y `super`, `throw`/`try`/`catch`, cierres y datos privados, `Set` y `Map`, referencias frente a copias, `find`/`every`/`some`/`sort` | 8 |
| **La mansión Ladrian** | Vue 2 con Options API: `data`, directivas, `computed` frente a `methods`, los caveats de reactividad y `$set`, props y `$emit`, ciclo de vida | 7 |
| **La Nueva Seran** | Vue 3 con Composition API: `ref` y `reactive`, `computed`, `watch` frente a `watchEffect`, `provide`/`inject`, composables | 7 |
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

Hay ocho clases de reto, y solo cuatro piden escribir código:

- **Elegir** la respuesta, con el porqué de todas las opciones, también de las falsas.
- **Emparejar** conceptos con lo que significan.
- **Colocar** líneas desordenadas, que luego se ejecutan tal y como las dejes.
- **Rellenar** huecos con fichas, con fichas de más para que no salga por descarte.
- **Predecir** qué va a imprimir un código, que después se ejecuta delante de ti.
- **Escribir** una solución desde cero.
- **Cazar el fallo** en código que casi funciona.
- **Reescribir** código que ya funciona, con los tests verdes desde el principio como red.

## Los seis que te acompañan

**Wayne** es el juego. Preside la portada, narra, se burla y te vende pistas: la primera
gratis, las otras a precio de amigo. Habla también cuando no ha pasado nada, porque se
aburre.

Todos tienen su cara: las ilustraciones de los personajes, recortadas del fondo y
compuestas sobre un disco con el color que cada uno lleva en la interfaz — el cobre de Wayne,
el azul acero de Wax, el gris ordenado de Steris, el vino de Marasi, el jade de MeLaan.
Viven en `src/recursos/`, pesan 126 kB entre las seis y se importan como
módulos para que Vite les ponga su hash y su ruta base; escritas a mano, esas rutas se
romperían al publicar en Pages.

Wayne sale además de cuerpo entero, con el bastón al hombro, presidiendo la portada.

**Wax** aparece cuando la cosa se pone seria: si un reto se te resiste tres veces, se planta
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
de La comisaría —el mundo de los cimientos, puesto en el orden en que hace falta saberlo— y
lleva además dos listas, y las dos hacen falta:

- **El glosario.** Cincuenta y cuatro términos explicados sin usar otras palabras técnicas
  sin explicar. No hay que ir a buscarlos: aparecen **subrayados con puntitos allá donde
  salgan**, en los enunciados y en los apuntes, y se pulsan sin salir del reto. Nunca dentro
  de un bloque de código, donde `map` es una llamada y no una palabra que definir.
- **La lista de imprevistos.** Los errores de JavaScript salen en inglés y no dicen nada
  útil: `Cannot read properties of undefined` es un muro para quien empieza. Steris los tiene
  previstos y los traduce automáticamente a qué significan y a qué suele haberlos causado,
  justo debajo del error.

Y antes de todo está **la antesala**: su orientación para quien no ha visto código en su
vida. Qué es un programa, qué es JavaScript, qué pinta Vue y por qué aquí hay dos versiones,
cómo funciona el juego y qué hacer cuando algo se atasca. Dos minutos, y se puede volver
cuando sea.

**Marasi** llega al final de cada mundo con el expediente debajo del brazo: seis preguntas
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
construcción. Un test recorre los 56 retos y comprueba que **cada palabra que puede decir
sale de material que ya tienes gratis y abierto en la misma pantalla**.

Que se contenga es el personaje, no una norma nuestra: en la era 2, Armonía podría
intervenir y no lo hace, porque intervenir de más estropea justo lo que intenta sostener.
Es su discusión con Wax durante toda la saga. Aquí queda como un reparto limpio: **Wayne
cobra y te acerca la respuesta; Armonía no cobra y no te la da jamás.** Y en los jefes se
aparta todavía más — ahí solo traduce errores y define palabras.

Su cara se procesa distinta a las otras cinco. A los demás les quité el fondo por
inundación desde los bordes; su ilustración tiene bruma detrás, un degradado, y el recorte
ni la limpiaría ni respetaría la túnica. Tampoco hacía falta: la bruma es suya. Va recortado
en círculo con ella dentro y un aro dorado de sus pendientes terrisanos, y queda el único
avatar de disco oscuro de los seis.

## Los gatos

Diez gatos, uno por metal alomántico, con la personalidad y el beneficio que le corresponde
a su metal: Acero empuja cosas de las mesas y te da más croquetas, Estaño lo oye todo y te
avisa de los requisitos mientras escribes, Bendaloy duerme en una burbuja de tiempo y le da
más margen a tu código, y Aluminio es inmune a todo y no aporta absolutamente nada.

Los indicadores bajan con el tiempo real, estés o no estés delante. **Ningún gato se muere
ni se va nunca**: esto es un juego para aprender, no para castigar. Un gato desatendido solo
se pone triste y deja de echarte una mano hasta que le hagas caso.

## Lo que se colecciona

### Los sombreros

Wayne ha ido dejando **doce sombreros escondidos** por todo el juego: en la cabecera, en el
panel de pistas, en el refugio, dentro de la propia sombrerera… Están casi transparentes,
así que hay que pasar el ratón por los rincones para dar con ellos. Cada uno que encuentras,
él jura que era suyo y te lo cambia por croquetas; tú te lo quedas igual y se apunta en la
sombrerera, que enseña una pista de los que aún faltan.

### Los recortes del Elendel Daily

Nueve recortes de prensa que **no se buscan: caen solos**, al hacer ciertas cosas. Cuáles, no
se dice. El titular es la broma del periódico; el pie de página lleva un consejo que sí
sirve, de esos que normalmente solo se aprenden a base de perder tardes.

## Apartado visual

Bruma de fondo en tres capas que se cruzan muy despacio, gatos que respiran, parpadean y
menean la cola —cada uno con su propio ritmo, sacado de sus colores, para que la colonia no
parezca un escaparate—, resultados de los tests que entran escalonados, croquetas que suben
flotando al ganarlas y transiciones entre pantallas.

Todo eso se apaga solo si el sistema pide menos movimiento (`prefers-reduced-motion`): nada
de lo que se anima hace falta para jugar.

## Desarrollo

```bash
npm install     # instala y copia los runtimes de Vue a public/vendor/
npm run dev
npm test        # motor, almacenes, Armonía y las soluciones de referencia de los 56 retos
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
