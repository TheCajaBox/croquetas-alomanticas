import { defineStore } from 'pinia'

import { TRASTOS } from '../contenido/trastos.js'
import { autoguardar } from './persistencia.js'

/** Con esto se empieza: da para una pista barata y una comida. Y poco más. */
export const CROQUETAS_INICIALES = 12

export const usarEconomia = defineStore('economia', {
  state: () => ({
    croquetas: CROQUETAS_INICIALES,
    ganadasEnTotal: 0,
    gastadasEnTotal: 0,
    trastos: [],
    movimientos: [],
  }),

  getters: {
    /** Cuántos trastos distintos le ha colocado ya Wayne. */
    trastosDistintos: (estado) => new Set(estado.trastos).size,
    puedePagar: (estado) => (cantidad) => estado.croquetas >= cantidad,
  },

  actions: {
    anotar(concepto, cantidad) {
      this.movimientos.unshift({ concepto, cantidad, cuando: Date.now() })
      // El histórico completo no le interesa a nadie y ocupa partida.
      if (this.movimientos.length > 40) this.movimientos.length = 40
    },

    ingresar(cantidad, concepto) {
      const redondeada = Math.max(0, Math.round(cantidad))
      if (redondeada === 0) return 0
      this.croquetas += redondeada
      this.ganadasEnTotal += redondeada
      this.anotar(concepto, redondeada)
      return redondeada
    },

    /**
     * Cobra si hay con qué. Nunca deja el saldo en negativo: si no llega, no
     * se cobra nada y quien llame se entera por el valor devuelto.
     * @returns {boolean} si se pudo pagar
     */
    gastar(cantidad, concepto) {
      const redondeada = Math.max(0, Math.round(cantidad))
      if (this.croquetas < redondeada) return false
      this.croquetas -= redondeada
      this.gastadasEnTotal += redondeada
      this.anotar(concepto, -redondeada)
      return true
    },

    /**
     * Wayne no roba: intercambia. Deja un trasto sin ningún valor, y a ser
     * posible uno que no te haya colocado ya.
     */
    recibirTrasto() {
      const sinRepetir = TRASTOS.filter((trasto) => !this.trastos.includes(trasto.id))
      const posibles = sinRepetir.length > 0 ? sinRepetir : TRASTOS
      const elegido = posibles[Math.floor(Math.random() * posibles.length)]
      this.trastos.push(elegido.id)
      return elegido
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharEconomia(almacen) {
  autoguardar(almacen, 'economia')
}
