import { ENTORNOS, MENSAJES, rutaDeSandbox } from './protocolo.js'

/**
 * Canal con un sandbox de Vue.
 *
 * El iframe se crea con sandbox="allow-scripts" y SIN allow-same-origin: eso
 * le da un origen opaco, así que el código del jugador no puede leer la
 * partida guardada ni tocar el DOM del juego. La contrapartida es que hay que
 * postear con targetOrigin "*" y comprobar la procedencia por `source`.
 *
 * El iframe se reutiliza entre intentos -así la vista previa no parpadea- y
 * solo se tira y se vuelve a levantar cuando un intento agota el tiempo, que
 * es justo cuando puede haberse quedado bloqueado.
 */
export function crearPuenteIframe(nombreEntorno) {
  const entorno = ENTORNOS[nombreEntorno]
  if (!entorno) throw new Error(`Entorno desconocido: "${nombreEntorno}"`)

  let iframe = null
  let contenedor = null
  let listo = null
  let contadorDeId = 0

  function levantar() {
    iframe = document.createElement('iframe')
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.setAttribute('title', `Vista previa del sandbox de ${entorno.etiqueta}`)
    iframe.className = 'marco-sandbox'

    const marco = iframe
    listo = new Promise((resolver) => {
      const alRecibir = (evento) => {
        if (evento.source !== marco.contentWindow) return
        if (evento.data?.tipo !== MENSAJES.LISTO) return
        window.removeEventListener('message', alRecibir)
        resolver()
      }
      window.addEventListener('message', alRecibir)
    })

    iframe.src = rutaDeSandbox(entorno.archivo)
    contenedor.appendChild(iframe)
  }

  return {
    /** Engancha la vista previa donde el juego quiera enseñarla. */
    montarEn(elemento) {
      contenedor = elemento
      if (!iframe) levantar()
      else contenedor.appendChild(iframe)
    },

    async ejecutar(peticion, tiempoLimiteMs) {
      if (!contenedor) throw new Error('El sandbox no está montado en ningún sitio todavía.')
      if (!iframe) levantar()
      await listo

      const id = ++contadorDeId
      const marco = iframe

      return new Promise((resolver) => {
        let temporizador

        const dejarDeEscuchar = () => {
          clearTimeout(temporizador)
          window.removeEventListener('message', alRecibir)
        }

        const alRecibir = (evento) => {
          if (evento.source !== marco.contentWindow) return
          const datos = evento.data
          if (datos?.tipo !== MENSAJES.RESULTADO || datos.id !== id) return
          dejarDeEscuchar()
          resolver(datos)
        }

        window.addEventListener('message', alRecibir)

        temporizador = setTimeout(() => {
          dejarDeEscuchar()
          this.reiniciar()
          resolver({ ok: false, agotado: true, tests: [], consola: [], error: null })
        }, tiempoLimiteMs)

        marco.contentWindow.postMessage({ tipo: MENSAJES.EJECUTAR, id, ...peticion }, '*')
      })
    },

    /** Tira el sandbox y levanta otro limpio. */
    reiniciar() {
      iframe?.remove()
      iframe = null
      listo = null
      if (contenedor) levantar()
    },

    destruir() {
      iframe?.remove()
      iframe = null
      listo = null
      contenedor = null
    },
  }
}
