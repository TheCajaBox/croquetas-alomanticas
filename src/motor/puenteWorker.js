import { ENTORNOS, MENSAJES, rutaDeSandbox } from './protocolo.js'

/**
 * Canal con el sandbox de los retos de ES6.
 *
 * Aquí no hace falta DOM, así que en vez de un iframe usamos un Web Worker: si
 * el código del jugador se dispara, terminate() lo corta en seco de verdad, sin
 * depender de que el navegador aísle bien el hilo.
 */
export function crearPuenteWorker(nombreEntorno = 'worker') {
  const entorno = ENTORNOS[nombreEntorno]
  let trabajador = null
  let listo = null
  let contadorDeId = 0

  function levantar() {
    // Worker clásico y no de módulo: así puede cargar con importScripts los
    // mismos ficheros de public/sandbox/ que usan los runners de Vue.
    trabajador = new Worker(rutaDeSandbox(entorno.archivo), { type: 'classic' })

    const actual = trabajador
    listo = new Promise((resolver) => {
      const alRecibir = (evento) => {
        if (evento.data?.tipo !== MENSAJES.LISTO) return
        actual.removeEventListener('message', alRecibir)
        resolver()
      }
      actual.addEventListener('message', alRecibir)
    })
  }

  return {
    // El worker no pinta nada, pero el juego trata a los tres entornos igual.
    montarEn() {},

    async ejecutar(peticion, tiempoLimiteMs) {
      if (!trabajador) levantar()
      await listo

      const id = ++contadorDeId
      const actual = trabajador

      return new Promise((resolver) => {
        let temporizador

        const dejarDeEscuchar = () => {
          clearTimeout(temporizador)
          actual.removeEventListener('message', alRecibir)
        }

        const alRecibir = (evento) => {
          const datos = evento.data
          if (datos?.tipo !== MENSAJES.RESULTADO || datos.id !== id) return
          dejarDeEscuchar()
          resolver(datos)
        }

        actual.addEventListener('message', alRecibir)

        temporizador = setTimeout(() => {
          dejarDeEscuchar()
          this.reiniciar()
          resolver({ ok: false, agotado: true, tests: [], consola: [], error: null })
        }, tiempoLimiteMs)

        actual.postMessage({ tipo: MENSAJES.EJECUTAR, id, ...peticion })
      })
    },

    reiniciar() {
      trabajador?.terminate()
      trabajador = null
      listo = null
      levantar()
    },

    destruir() {
      trabajador?.terminate()
      trabajador = null
      listo = null
    },
  }
}
