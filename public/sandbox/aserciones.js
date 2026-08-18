/**
 * Librería de aserciones de Gatos y Código, en español.
 *
 * Vive en public/ y es un script clásico a propósito: la cargan tanto los
 * runners de Vue (que son HTML estático y no pueden importar del bundle) como
 * el worker de los retos ES6, vía importScripts. Así los tres entornos usan
 * exactamente las mismas comprobaciones y no hay dos versiones que se
 * desincronicen.
 */
;(function (global) {
  'use strict'

  var FALLO = '__FALLO_DE_ASERCION__'
  var MARCA_BUCLE = '__BUCLE_INFINITO__'
  var AVISO_DE_BUCLE = 'Uno de tus bucles no sabe cuándo parar: lleva cientos de miles de vueltas.'

  function describir(valor) {
    if (typeof valor === 'string') return '"' + valor + '"'
    if (typeof valor === 'function') return valor.name ? 'la función ' + valor.name : 'una función'
    if (typeof valor === 'symbol') return valor.toString()
    if (valor === undefined) return 'undefined'
    if (valor === null) return 'null'
    if (typeof valor === 'number' && Number.isNaN(valor)) return 'NaN'
    try {
      var texto = JSON.stringify(valor)
      return texto === undefined ? String(valor) : texto
    } catch (e) {
      return String(valor)
    }
  }

  /** Igualdad profunda: los retos comparan arrays y objetos constantemente. */
  function sonIguales(a, b) {
    if (a === b) return true
    if (typeof a === 'number' && typeof b === 'number') {
      return Number.isNaN(a) && Number.isNaN(b)
    }
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false
    if (Array.isArray(a) !== Array.isArray(b)) return false
    if (a instanceof Date || b instanceof Date) {
      return a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
    }
    var clavesA = Object.keys(a)
    var clavesB = Object.keys(b)
    if (clavesA.length !== clavesB.length) return false
    for (var i = 0; i < clavesA.length; i++) {
      var clave = clavesA[i]
      if (!Object.prototype.hasOwnProperty.call(b, clave)) return false
      if (!sonIguales(a[clave], b[clave])) return false
    }
    return true
  }

  function fallar(mensaje) {
    var error = new Error(mensaje)
    error.nombre = FALLO
    error.esFalloDeAsercion = true
    throw error
  }

  function normalizar(texto) {
    return String(texto).replace(/\s+/g, ' ').trim()
  }

  function crearComprobador(valor, etiqueta) {
    var nombre = etiqueta || 'el valor'

    return {
      igualA: function (esperado) {
        if (!sonIguales(valor, esperado)) {
          fallar('Esperaba que ' + nombre + ' fuera ' + describir(esperado) + ', pero es ' + describir(valor) + '.')
        }
      },
      noEsIgualA: function (prohibido) {
        if (sonIguales(valor, prohibido)) {
          fallar('Esperaba que ' + nombre + ' NO fuera ' + describir(prohibido) + ', pero lo es.')
        }
      },
      contiene: function (parte) {
        var contenido =
          typeof valor === 'string'
            ? valor.indexOf(parte) !== -1
            : Array.isArray(valor)
              ? valor.some(function (elemento) { return sonIguales(elemento, parte) })
              : false
        if (!contenido) {
          fallar('Esperaba que ' + nombre + ' contuviera ' + describir(parte) + ', pero es ' + describir(valor) + '.')
        }
      },
      noContiene: function (parte) {
        var contenido =
          typeof valor === 'string'
            ? valor.indexOf(parte) !== -1
            : Array.isArray(valor)
              ? valor.some(function (elemento) { return sonIguales(elemento, parte) })
              : false
        if (contenido) {
          fallar('Esperaba que ' + nombre + ' NO contuviera ' + describir(parte) + ', pero ahí está.')
        }
      },
      esVerdadero: function () {
        if (valor !== true) fallar('Esperaba true, pero obtuve ' + describir(valor) + '.')
      },
      esFalso: function () {
        if (valor !== false) fallar('Esperaba false, pero obtuve ' + describir(valor) + '.')
      },
      existe: function () {
        if (valor === undefined || valor === null) {
          fallar('Esperaba que ' + nombre + ' existiera, pero es ' + describir(valor) + '.')
        }
      },
      esDeTipo: function (tipo) {
        var real = Array.isArray(valor) ? 'array' : valor === null ? 'null' : typeof valor
        if (real !== tipo) {
          fallar('Esperaba que ' + nombre + ' fuera de tipo "' + tipo + '", pero es "' + real + '".')
        }
      },
      tieneLongitud: function (largo) {
        var real = valor && typeof valor.length === 'number' ? valor.length : undefined
        if (real !== largo) {
          fallar('Esperaba ' + largo + ' elemento(s) en ' + nombre + ', pero hay ' + describir(real) + '.')
        }
      },
      /** Compara texto ignorando espacios y saltos de línea sobrantes. */
      diceLoMismoQue: function (esperado) {
        if (normalizar(valor) !== normalizar(esperado)) {
          fallar('Esperaba el texto ' + describir(normalizar(esperado)) + ', pero encontré ' + describir(normalizar(valor)) + '.')
        }
      },
      lanzaError: function () {
        if (typeof valor !== 'function') fallar('Para comprobar un error hay que pasarme una función.')
        try {
          valor()
        } catch (e) {
          return
        }
        fallar('Esperaba que eso lanzara un error, pero se ha quedado tan tranquilo.')
      },
    }
  }

  /**
   * @param {{ montar?: Function }} entorno  utilidades propias del entorno
   * @returns el API que se inyecta en el ámbito del código del jugador
   */
  global.crearAserciones = function (entorno) {
    var opciones = entorno || {}
    var resultados = []
    var consola = []

    function esperar(valor, etiqueta) {
      return crearComprobador(valor, etiqueta)
    }

    /** Ejecuta un test y guarda su resultado sin dejar que reviente la tanda. */
    function registrar(nombre, prueba) {
      return Promise.resolve()
        .then(prueba)
        .then(function () {
          resultados.push({ nombre: nombre, ok: true, mensaje: '' })
        })
        .catch(function (error) {
          var mensaje = (error && error.message) || String(error)
          // El contador de vueltas revienta dentro del test, no fuera: si no se
          // traduce aquí, al jugador le sale el marcador interno en crudo.
          var esBucle = mensaje.indexOf(MARCA_BUCLE) !== -1
          resultados.push({
            nombre: nombre,
            ok: false,
            esFalloDeAsercion: !!(error && error.esFalloDeAsercion),
            bucleInfinito: esBucle,
            mensaje: esBucle ? AVISO_DE_BUCLE : mensaje,
          })
        })
    }

    function anotarEnConsola(nivel, argumentos) {
      var partes = []
      for (var i = 0; i < argumentos.length; i++) {
        partes.push(typeof argumentos[i] === 'string' ? argumentos[i] : describir(argumentos[i]))
      }
      consola.push({ nivel: nivel, texto: partes.join(' ') })
    }

    /** Sustituye la consola real para poder enseñar la salida en el juego. */
    function interceptarConsola() {
      var original = { log: console.log, warn: console.warn, error: console.error }
      console.log = function () { anotarEnConsola('log', arguments); original.log.apply(console, arguments) }
      console.warn = function () { anotarEnConsola('warn', arguments); original.warn.apply(console, arguments) }
      console.error = function () { anotarEnConsola('error', arguments); original.error.apply(console, arguments) }
      return function restaurar() {
        console.log = original.log
        console.warn = original.warn
        console.error = original.error
      }
    }

    return {
      esperar: esperar,
      registrar: registrar,
      montar: opciones.montar,
      siguienteTick: opciones.siguienteTick,
      consola: consola,
      resultados: resultados,
      interceptarConsola: interceptarConsola,
      utiles: { sonIguales: sonIguales, describir: describir, normalizar: normalizar },
    }
  }
})(typeof self !== 'undefined' ? self : this)
