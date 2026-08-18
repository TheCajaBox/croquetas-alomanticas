# Gatos y Código

Un juego para aprender **JavaScript ES6, Vue 2 y Vue 3** escribiendo código de verdad.
Lo narra **Wayne**, de *Nacidos de la Bruma: era 2*, que comenta lo que haces, te vende
pistas y te recuerda que le des de comer al gato.

No hay respuestas de opción múltiple: escribes código, se ejecuta en un sandbox aislado y
se comprueba con tests. Lo que ganas se paga en **croquetas**, y con las croquetas se cuida
una colonia de gatos que, cuando están contentos, te devuelven el favor cambiando las reglas
del juego a tu favor.

## Jugar

Está publicado en **https://thecajabox.github.io/Dynamic-Quality-Forms/** — se abre en
cualquier navegador, también en el móvil, y no hace falta instalar nada.

> La primera vez hay que activarlo a mano en el repositorio:
> **Settings → Pages → Source: GitHub Actions**. A partir de ahí, cada empujón a la rama
> lo vuelve a publicar solo.

El progreso se guarda en el navegador (`localStorage`), sin cuentas ni servidores. El móvil
y el ordenador son partidas distintas; en **Ajustes** hay exportar e importar para pasarla
de uno a otro.

## Los tres mundos

| Mundo | Qué se aprende | Retos |
|---|---|---|
| **Los Áridos** | JavaScript ES6: ámbito, flechas y `this`, desestructuración, `map`/`filter`/`reduce`, `?.` y `??`, promesas | 7 |
| **La mansión Ladrian** | Vue 2 con Options API: `data`, directivas, `computed` frente a `methods`, los caveats de reactividad y `$set`, props y `$emit`, ciclo de vida | 7 |
| **La Nueva Seran** | Vue 3 con Composition API: `ref` y `reactive`, `computed`, `watch` frente a `watchEffect`, `provide`/`inject`, composables | 7 |

Los Áridos son la base común. Las dos rutas de Vue son independientes y se juegan en el
orden que se quiera.

Hay tres clases de reto: **escribir** desde cero, **cazar el fallo** en código que casi
funciona, y **acertijos** en los que no se escribe nada, se predice qué va a imprimir un
código y luego se ejecuta delante de ti para comparar.

## Los gatos

Diez gatos, uno por metal alomántico, con la personalidad y el beneficio que le corresponde
a su metal: Acero empuja cosas de las mesas y te da más croquetas, Estaño lo oye todo y te
avisa de los requisitos mientras escribes, Bendaloy duerme en una burbuja de tiempo y le da
más margen a tu código, y Aluminio es inmune a todo y no aporta absolutamente nada.

Los indicadores bajan con el tiempo real, estés o no estés delante. **Ningún gato se muere
ni se va nunca**: esto es un juego para aprender, no para castigar. Un gato desatendido solo
se pone triste y deja de echarte una mano hasta que le hagas caso.

## Los sombreros

Wayne ha ido dejando **doce sombreros escondidos** por todo el juego: en la cabecera, en el
panel de pistas, en el refugio, dentro de la propia sombrerera… Están casi transparentes,
así que hay que pasar el ratón por los rincones para dar con ellos. Cada uno que encuentras,
él jura que era suyo y te lo cambia por croquetas; tú te lo quedas igual y se apunta en la
sombrerera, que enseña una pista de los que aún faltan.

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
npm test        # motor, almacenes y las 21 soluciones de referencia
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
