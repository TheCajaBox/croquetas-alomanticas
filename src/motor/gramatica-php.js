/**
 * La gramática de PHP para el editor, en un módulo propio.
 *
 * Existe solo para **darle nombre al trozo empaquetado**. Importando
 * `@codemirror/lang-php` directamente en diferido, el trozo salía como
 * `index-xxxx.js` -indistinguible de otros cuatro con el mismo nombre- y no
 * había manera de comprobar, ni mirando `dist` ni desde una prueba, que en la
 * segunda era no se estaba descargando. Con un módulo propio, el trozo se llama
 * como el fichero.
 *
 * Y se hace así, y no con `manualChunks`, porque forzar el trozo a mano se
 * llevaba dentro el núcleo de CodeMirror: el editor pasaba a necesitar la
 * gramática de PHP para arrancar, que es exactamente lo contrario de lo que se
 * busca. Medido: el trozo pasó de 154 kB a 536 kB y el de la vista bajó de 444
 * a 62.
 */
export { php } from '@codemirror/lang-php'
