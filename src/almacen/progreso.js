import { defineStore } from 'pinia'

import { MUNDOS } from '../contenido/mundos.js'
import { RETOS, RETOS_POR_ID, retosDelMundo } from '../contenido/retos/index.js'
import { autoguardar } from './persistencia.js'

const SEMANA_EN_MS = 7 * 24 * 60 * 60 * 1000

const fichaVacia = () => ({
  superado: false,
  intentos: 0,
  fallos: 0,
  pistasUsadas: [],
  codigoGuardado: null,
  superadoEn: null,
})

export const usarProgreso = defineStore('progreso', {
  state: () => ({
    retos: {},
    rachaSinPistas: 0,
    mejorRacha: 0,
    ultimaVisita: null,
    vistoLaBienvenida: false,
    vistoLaAntesala: false,
  }),

  getters: {
    ficha: (estado) => (retoId) => estado.retos[retoId] ?? fichaVacia(),

    retosSuperados: (estado) => Object.values(estado.retos).filter((f) => f.superado).length,

    superado: (estado) => (retoId) => !!estado.retos[retoId]?.superado,

    superadosDelMundo: (estado) => (mundoId) =>
      retosDelMundo(mundoId).filter((reto) => estado.retos[reto.id]?.superado).length,

    mundoCompletado() {
      return (mundoId) => {
        const total = retosDelMundo(mundoId).length
        return total > 0 && this.superadosDelMundo(mundoId) === total
      }
    },

    mundoDisponible() {
      return (mundoId) => {
        const mundo = MUNDOS.find((m) => m.id === mundoId)
        return !mundo?.requiere || this.mundoCompletado(mundo.requiere)
      }
    },

    jefesDerrotados: (estado) =>
      RETOS.filter((reto) => reto.jefe && estado.retos[reto.id]?.superado).length,

    /** Hace cuánto que no aparece por aquí, para que Wayne pueda echárselo en cara. */
    llevabaSemanasFuera: (estado) =>
      !!estado.ultimaVisita && Date.now() - estado.ultimaVisita > SEMANA_EN_MS,
  },

  actions: {
    asegurarFicha(retoId) {
      if (!this.retos[retoId]) this.retos[retoId] = fichaVacia()
      return this.retos[retoId]
    },

    registrarVisita() {
      this.ultimaVisita = Date.now()
    },

    guardarBorrador(retoId, codigo) {
      this.asegurarFicha(retoId).codigoGuardado = codigo
    },

    /**
     * @param {boolean} indultado si el gato Oro perdona este fallo
     */
    registrarIntento(retoId, acertado, { indultado = false } = {}) {
      const ficha = this.asegurarFicha(retoId)
      ficha.intentos += 1
      if (!acertado && !indultado) ficha.fallos += 1
      return ficha
    },

    registrarPista(retoId, nivel) {
      const ficha = this.asegurarFicha(retoId)
      if (!ficha.pistasUsadas.includes(nivel)) ficha.pistasUsadas.push(nivel)
    },

    /**
     * Cierra un reto superado y actualiza la racha.
     * @param {boolean} rachaResistente si el gato Peltre permite que una sola
     *   pista no rompa la racha
     */
    registrarVictoria(retoId, { rachaResistente = false } = {}) {
      const ficha = this.asegurarFicha(retoId)
      const yaEstaba = ficha.superado

      ficha.superado = true
      ficha.superadoEn = ficha.superadoEn ?? Date.now()

      if (!yaEstaba) {
        const pistas = ficha.pistasUsadas.length
        const mantieneRacha = pistas === 0 || (rachaResistente && pistas === 1)
        this.rachaSinPistas = mantieneRacha ? this.rachaSinPistas + 1 : 0
        this.mejorRacha = Math.max(this.mejorRacha, this.rachaSinPistas)
      }

      return { esNuevo: !yaEstaba, reto: RETOS_POR_ID[retoId] }
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharProgreso(almacen) {
  autoguardar(almacen, 'progreso')
}
