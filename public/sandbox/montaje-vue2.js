/**
 * Cómo se monta un componente en el sandbox de Vue 2.
 *
 * Está en su propio fichero, y no dentro del HTML del runner, para que las
 * pruebas puedan montar componentes exactamente igual que el juego. Si esto
 * viviera en una etiqueta <script>, habría que reescribirlo en los tests y
 * tarde o temprano las dos versiones dirían cosas distintas.
 */
;(function (global) {
  'use strict'

  global.crearMontaje = function (escenario) {
    var Vue = global.Vue

    // La build de desarrollo saluda por consola en cada arranque, y el panel
    // de consola del juego es para el jugador, no para eso.
    Vue.config.productionTip = false
    Vue.config.devtools = false

    var montados = []
    var raices = []

    function siguienteTick() {
      return Vue.nextTick()
    }

    function montar(opciones) {
      var hueco = document.createElement('div')
      escenario.appendChild(hueco)
      // En Vue 2, $mount(el) SUSTITUYE el elemento por la raíz del componente,
      // así que se consulta desde vm.$el y no desde el hueco.
      var vm = new Vue(Object.assign({}, opciones)).$mount(hueco)
      montados.push(vm)
      raices.push(vm.$el)
      return global.crearControl(vm.$el, vm, siguienteTick)
    }

    return {
      montar: montar,
      siguienteTick: siguienteTick,
      limpiar: function () {
        montados.forEach(function (vm) {
          try { vm.$destroy() } catch (e) { /* si ya estaba destruido, mejor */ }
        })
        montados.length = 0
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
