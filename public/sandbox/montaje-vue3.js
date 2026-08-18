/**
 * Cómo se monta un componente en el sandbox de Vue 3.
 *
 * Mismo motivo que su gemelo de Vue 2: vive fuera del HTML para que las
 * pruebas monten componentes con este código y no con una copia parecida.
 */
;(function (global) {
  'use strict'

  global.crearMontaje = function (escenario) {
    var Vue = global.Vue
    var apps = []
    var raices = []

    function siguienteTick() {
      return Vue.nextTick()
    }

    function montar(opciones) {
      var hueco = document.createElement('div')
      escenario.appendChild(hueco)
      // En Vue 3, mount() pinta DENTRO del elemento indicado, así que se
      // consulta desde el hueco.
      var app = Vue.createApp(opciones)
      var vm = app.mount(hueco)
      apps.push(app)
      raices.push(hueco)
      var control = global.crearControl(hueco, vm, siguienteTick)
      control.app = app
      return control
    }

    return {
      montar: montar,
      siguienteTick: siguienteTick,
      limpiar: function () {
        apps.forEach(function (app) {
          try { app.unmount() } catch (e) { /* si ya estaba desmontada, mejor */ }
        })
        apps.length = 0
        raices.length = 0
        escenario.innerHTML = ''
      },

      /**
       * Los tests montan el componente varias veces y todas se quedan en el
       * escenario. Al jugador eso le sale como la misma pantalla repetida
       * cuatro veces, así que se deja a la vista solo el primer montaje: el
       * componente tal y como se pinta con sus datos de partida.
       */
      asentar: function () {
        raices.forEach(function (raiz, indice) {
          if (raiz && raiz.style) raiz.style.display = indice === 0 ? '' : 'none'
        })
      },
    }
  }
})(typeof self !== 'undefined' ? self : this)
