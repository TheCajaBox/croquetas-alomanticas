/**
 * Sandbox de los retos de ES6.
 *
 * Estos retos no necesitan DOM, así que corren en un Web Worker en vez de en
 * un iframe: si algo se dispara, el juego puede matarlo con terminate() sin
 * despeinarse. Es un worker clásico servido desde public/ para poder cargar
 * con importScripts exactamente los mismos ficheros que usan los sandboxes de
 * Vue, y que no haya dos versiones de las aserciones.
 */
importScripts('./aserciones.js', './runner-comun.js')

arrancarRunner({
  responder: function (mensaje) {
    self.postMessage(mensaje)
  },
})
