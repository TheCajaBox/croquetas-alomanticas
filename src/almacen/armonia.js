import { defineStore } from 'pinia'

import { responder } from '../motor/armonia/responder.js'
import { autoguardar } from './persistencia.js'

/** Cuántos turnos se recuerdan. Más allá, la conversación no aporta nada. */
const MEMORIA = 30

/**
 * La conversación con Armonía.
 *
 * El panel se abre y se cierra, pero lo hablado se queda: cerrar para mirar el
 * apunte y volver no debería costarte lo que ya habías preguntado.
 *
 * El contexto -qué reto tienes abierto, qué has escrito, qué salió al
 * ejecutar- lo publica aquí `VistaReto`. Sin eso Armonía respondería a ciegas,
 * y su mejor respuesta es justamente la que mira tu código.
 */
export const usarArmonia = defineStore('armonia', {
  state: () => ({
    abierto: false,
    turnos: [],
    /** Se ha presentado ya alguna vez. */
    presentado: false,
    /** Cuántas veces le han pedido la solución. A la tercera, contesta distinto. */
    vecesQuePidioSolucion: 0,
    /** Lo publica la vista del reto; no se guarda en la partida. */
    contexto: { retoId: null, codigo: '', resultado: null },
  }),

  getters: {
    hayConversacion: (estado) => estado.turnos.length > 0,
  },

  actions: {
    abrir() {
      this.abierto = true
    },

    cerrar() {
      this.abierto = false
    },

    alternar() {
      this.abierto = !this.abierto
    },

    /** La vista del reto cuenta dónde está el jugador y qué lleva escrito. */
    situar({ retoId = null, codigo = '', resultado = null } = {}) {
      this.contexto = { retoId, codigo, resultado }
    },

    olvidarSitio() {
      this.contexto = { retoId: null, codigo: '', resultado: null }
    },

    preguntar(texto) {
      const pregunta = (texto ?? '').trim()
      if (!pregunta) return null

      const contestada = responder(pregunta, {
        ...this.contexto,
        vecesQuePidioSolucion: this.vecesQuePidioSolucion,
      })

      if (contestada.tipo === 'peticion') this.vecesQuePidioSolucion += 1

      this.turnos = [
        ...this.turnos,
        { de: 'jugador', texto: pregunta, cuando: Date.now() },
        { de: 'armonia', cuando: Date.now(), ...contestada },
      ].slice(-MEMORIA)

      return contestada
    },

    /** La primera vez que se abre el panel, se presenta. */
    presentarse(texto) {
      if (this.presentado) return
      this.presentado = true
      this.turnos = [...this.turnos, { de: 'armonia', tipo: 'presentacion', texto, citas: [], cuando: Date.now() }]
    },

    borrarConversacion() {
      this.turnos = []
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharArmonia(almacen) {
  // El contexto no es partida: es dónde estás ahora mismo. Guardarlo metería
  // una copia de tu código en la partida y la dejaría rancia al minuto.
  autoguardar(almacen, 'armonia', { omitir: ['contexto', 'abierto'] })
}
