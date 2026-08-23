/**
 * Sandbox de los retos de SQL: el cartero.
 *
 * Un worker clásico, como el de ES6, y por el mismo motivo: aquí no hay nada
 * que pintar, y una consulta que no termina se corta con `terminate()` sin
 * despeinar la página. El cargador de SQLite es un script de los de siempre,
 * así que entra por `importScripts` igual que los runtimes de Vue.
 *
 * Todo lo que piensa está en `nucleo-sql.js`, que es el fichero que las pruebas
 * ejecutan tal cual en node: aquí solo quedan los mensajes.
 *
 * Los nombres de mensaje son copia literal de src/motor/protocolo.js. No se
 * pueden importar: esto es un script clásico servido desde public/.
 */
importScripts('./aserciones.js', './nucleo-sql.js', '../vendor/sql-wasm.js')

;(function (global) {
  'use strict'

  var MENSAJES = {
    LISTO: 'gatos:listo',
    EJECUTAR: 'gatos:ejecutar',
    RESULTADO: 'gatos:resultado',
  }

  /**
   * SQLite se pide **al nacer el worker**, no al primer envío: son 658 kB, y
   * mientras el jugador lee el enunciado y escribe la consulta ya están de
   * camino. Se guarda la promesa para no volver a pedirlos en cada «Ejecutar».
   */
  var motor = global.initSqlJs({
    locateFile: function (fichero) {
      return '../vendor/' + fichero
    },
  })

  global.addEventListener('message', function (evento) {
    var datos = evento.data
    if (!datos || datos.tipo !== MENSAJES.EJECUTAR) return

    var api = global.crearAserciones({})
    var restaurarConsola = api.interceptarConsola()

    motor
      .then(function (SQL) {
        return global.nucleoSql.corregir(SQL, datos, api)
      })
      .then(function () {
        global.postMessage({
          tipo: MENSAJES.RESULTADO,
          id: datos.id,
          ok: api.resultados.every(function (r) { return r.ok }),
          tests: api.resultados,
          consola: api.consola,
          // Las reglas del reto se miran fuera, en `motor/lenguajes/sql.js`:
          // aquí no hay nada que añadir, pero se contesta el campo para que el
          // ejecutor no tenga que preguntar de qué entorno viene la respuesta.
          requisitos: [],
          error: null,
        })
      })
      .catch(function (error) {
        global.postMessage({
          tipo: MENSAJES.RESULTADO,
          id: datos.id,
          ok: false,
          tests: api.resultados,
          consola: api.consola,
          requisitos: [],
          error: {
            mensaje: (error && error.message) || String(error),
            sintaxis: !!(error && error.sintaxis),
          },
        })
      })
      .then(function () {
        restaurarConsola()
      })
  })

  global.postMessage({ tipo: MENSAJES.LISTO })
})(self)
