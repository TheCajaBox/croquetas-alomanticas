/**
 * Tronco común de los sandboxes de Vue.
 *
 * Los runners de Vue 2 y Vue 3 solo se diferencian en cómo montan un
 * componente; todo lo demás -el protocolo de mensajes, la construcción del
 * ámbito donde vive el código del jugador y las utilidades para consultar el
 * DOM pintado- está aquí.
 *
 * Los nombres de mensaje son copia literal de src/motor/protocolo.js. No se
 * pueden importar: esto es un script clásico servido desde public/.
 */
;(function (global) {
  'use strict'

  var MENSAJES = {
    LISTO: 'gatos:listo',
    EJECUTAR: 'gatos:ejecutar',
    RESULTADO: 'gatos:resultado',
  }

  /** Busca dentro de lo pintado, aceptando también que la raíz sea el objetivo. */
  function seleccionar(raiz, selector) {
    if (!selector) return raiz
    if (raiz.matches && raiz.matches(selector)) return raiz
    return raiz.querySelector(selector)
  }

  function exigir(raiz, selector) {
    var elemento = seleccionar(raiz, selector)
    if (!elemento) {
      throw new Error('No he encontrado ningún elemento "' + selector + '" en lo que has pintado.')
    }
    return elemento
  }

  /**
   * Mando a distancia de un componente ya montado: leer lo pintado e
   * interactuar con ello. Todo lo que cambia el DOM espera al siguiente tick,
   * para que el test lea la interfaz ya actualizada.
   */
  global.crearControl = function (raiz, vm, siguienteTick) {
    return {
      vm: vm,
      elemento: raiz,
      texto: function (selector) {
        return exigir(raiz, selector).textContent.replace(/\s+/g, ' ').trim()
      },
      html: function (selector) {
        return (selector ? exigir(raiz, selector) : raiz).innerHTML
      },
      existe: function (selector) {
        return !!seleccionar(raiz, selector)
      },
      contar: function (selector) {
        return raiz.querySelectorAll(selector).length
      },
      textos: function (selector) {
        return Array.prototype.map.call(raiz.querySelectorAll(selector), function (elemento) {
          return elemento.textContent.replace(/\s+/g, ' ').trim()
        })
      },
      valor: function (selector) {
        return exigir(raiz, selector).value
      },
      click: function (selector) {
        exigir(raiz, selector).dispatchEvent(new MouseEvent('click', { bubbles: true }))
        return siguienteTick()
      },
      escribir: function (selector, texto) {
        var campo = exigir(raiz, selector)
        campo.value = texto
        campo.dispatchEvent(new Event('input', { bubbles: true }))
        campo.dispatchEvent(new Event('change', { bubbles: true }))
        return siguienteTick()
      },
      siguienteTick: siguienteTick,
    }
  }

  /**
   * Construye el ámbito donde se ejecuta todo. El código del jugador y los
   * tests comparten scope a propósito: así el enunciado puede pedir "declara
   * `componente`" y el test lo usa directamente, sin exports ni ceremonias.
   */
  global.construirEjecutable = function (codigo, tests) {
    var llamadas = tests
      .map(function (test) {
        return (
          'await __api.registrar(' + JSON.stringify(test.nombre) + ', async function () {\n' +
          test.codigo + '\n});'
        )
      })
      .join('\n')

    var fuente =
      '"use strict";\n' +
      'return (async function (__api) {\n' +
      'const esperar = __api.esperar, montar = __api.montar, siguienteTick = __api.siguienteTick, consola = __api.consola;\n' +
      codigo + '\n' +
      llamadas + '\n' +
      '});'

    return new Function(fuente)()
  }

  /**
   * Los temporizadores que deja abiertos un intento no deben seguir
   * disparando durante el siguiente: un setInterval olvidado en el intento 3
   * produce fallos incomprensibles en el intento 4.
   */
  function vigilarTemporizadores() {
    var abiertos = []
    var ponerIntervalo = global.setInterval
    var ponerEspera = global.setTimeout

    global.setInterval = function () {
      var id = ponerIntervalo.apply(global, arguments)
      abiertos.push(['intervalo', id])
      return id
    }
    global.setTimeout = function () {
      var id = ponerEspera.apply(global, arguments)
      abiertos.push(['espera', id])
      return id
    }

    return function cancelarTodos() {
      abiertos.forEach(function (par) {
        if (par[0] === 'intervalo') global.clearInterval(par[1])
        else global.clearTimeout(par[1])
      })
      abiertos.length = 0
    }
  }

  /**
   * Arranca el sandbox y se queda escuchando al juego. Lo usan tanto los
   * runners de Vue (que contestan a la ventana padre) como el worker de los
   * retos ES6 (que contesta por su propio canal), de ahí que el modo de
   * responder y la limpieza del escenario sean inyectables.
   *
   * @param {{ montar?: Function, siguienteTick?: Function, limpiar?: Function, responder?: Function }} entorno
   */
  global.arrancarRunner = function (entorno) {
    var responder = entorno.responder || function (mensaje) {
      global.parent.postMessage(mensaje, '*')
    }
    var limpiar = entorno.limpiar || function () {}
    var cancelarTemporizadores = vigilarTemporizadores()

    global.addEventListener('message', function (evento) {
      var datos = evento.data
      if (!datos || datos.tipo !== MENSAJES.EJECUTAR) return

      var api = global.crearAserciones({
        montar: entorno.montar,
        siguienteTick: entorno.siguienteTick,
      })
      var restaurarConsola = api.interceptarConsola()
      cancelarTemporizadores()
      limpiar()

      Promise.resolve()
        .then(function () {
          return global.construirEjecutable(datos.codigo, datos.tests || [])(api)
        })
        .then(function () {
          responder({
            tipo: MENSAJES.RESULTADO,
            id: datos.id,
            ok: api.resultados.every(function (r) { return r.ok }),
            tests: api.resultados,
            consola: api.consola,
            error: null,
          })
        })
        .catch(function (error) {
          responder({
            tipo: MENSAJES.RESULTADO,
            id: datos.id,
            ok: false,
            tests: api.resultados,
            consola: api.consola,
            error: {
              mensaje: (error && error.message) || String(error),
              bucleInfinito: !!(error && /__BUCLE_INFINITO__/.test(error.message || '')),
            },
          })
        })
        .then(function () {
          restaurarConsola()
          if (entorno.asentar) entorno.asentar()
        })
    })

    responder({ tipo: MENSAJES.LISTO })
  }
})(typeof self !== 'undefined' ? self : this)
