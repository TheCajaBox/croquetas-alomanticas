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
    /** Retos de escribir superados sin que Marasi tuviera nada que decir. */
    revisionesLimpias: 0,
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

    /**
     * `requiere` admite un mundo o una lista de mundos. El ferrocarril necesita
     * las dos cosas -saber Vue 3 y saber lo de Elendel- y con un solo id no se
     * podía decir.
     */
    mundoDisponible() {
      return (mundoId) => {
        const mundo = MUNDOS.find((m) => m.id === mundoId)
        if (!mundo?.requiere) return true
        const exigidos = Array.isArray(mundo.requiere) ? mundo.requiere : [mundo.requiere]
        return exigidos.every((id) => this.mundoCompletado(id))
      }
    },

    jefesDerrotados: (estado) =>
      RETOS.filter((reto) => reto.jefe && estado.retos[reto.id]?.superado).length,

    /** Jefes superados en el primer envío. No tienen pistas, así que cuenta. */
    jefesALaPrimera: (estado) =>
      RETOS.filter((reto) => reto.jefe && estado.retos[reto.id]?.superado && estado.retos[reto.id].intentos <= 1)
        .length,

    /** Retos que se resistieron cinco veces o más y acabaron cayendo. */
    retosPeleados: (estado) =>
      Object.values(estado.retos).filter((f) => f.superado && f.fallos >= 5).length,

    mundosCompletados() {
      return MUNDOS.filter((mundo) => this.mundoCompletado(mundo.id)).length
    },

    /** Mundos terminados enteros sin comprar una sola pista. */
    mundosSinPistas() {
      return MUNDOS.filter(
        (mundo) =>
          this.mundoCompletado(mundo.id) &&
          retosDelMundo(mundo.id).every((reto) => (this.retos[reto.id]?.pistasUsadas.length ?? 0) === 0),
      ).length
    },

    /** Mundos terminados sin un solo intento fallido. */
    mundosALaPrimera() {
      return MUNDOS.filter(
        (mundo) =>
          this.mundoCompletado(mundo.id) &&
          retosDelMundo(mundo.id).every((reto) => (this.retos[reto.id]?.intentos ?? 99) <= 1),
      ).length
    },

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

    /** Marasi ha leído el código y no ha encontrado nada que objetar. */
    apuntarRevisionLimpia() {
      this.revisionesLimpias += 1
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

      const rachaAntes = this.rachaSinPistas
      let mantieneRacha = true

      if (!yaEstaba) {
        const pistas = ficha.pistasUsadas.length
        mantieneRacha = pistas === 0 || (rachaResistente && pistas === 1)
        this.rachaSinPistas = mantieneRacha ? this.rachaSinPistas + 1 : 0
        this.mejorRacha = Math.max(this.mejorRacha, this.rachaSinPistas)
      }

      return {
        esNuevo: !yaEstaba,
        reto: RETOS_POR_ID[retoId],
        // La racha se calculaba desde siempre y no se veía en ninguna parte.
        // Quien premia necesita saber si ha subido o si se acaba de romper.
        rachaAntes,
        racha: this.rachaSinPistas,
        rachaRota: !yaEstaba && !mantieneRacha && rachaAntes >= 2,
      }
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharProgreso(almacen) {
  autoguardar(almacen, 'progreso')
}
