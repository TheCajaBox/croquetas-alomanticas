import { defineStore } from 'pinia'

import { CROQUETAS_POR_ACIERTO, REPASOS_POR_MUNDO } from '../contenido/repasos.js'
import { usarEconomia } from './economia.js'
import { autoguardar } from './persistencia.js'

/**
 * Los repasos que abre Marasi al terminar un mundo.
 *
 * Se pueden repetir tantas veces como se quiera, pero **solo se cobra lo que se
 * mejora** sobre el mejor intento anterior. Repetir para aprender está bien;
 * repetir para sacar croquetas, no tiene sentido.
 */
export const usarRepasos = defineStore('repasos', {
  state: () => ({
    mejores: {},
    hechos: 0,
  }),

  getters: {
    mejor: (estado) => (repasoId) => estado.mejores[repasoId] ?? 0,
    hecho: (estado) => (repasoId) => repasoId in estado.mejores,

    /** Cuántos repasos se han bordado del todo. */
    perfectos: (estado) =>
      Object.entries(estado.mejores).filter(([id, aciertos]) => {
        const repaso = Object.values(REPASOS_POR_MUNDO).find((r) => r.id === id)
        return repaso && aciertos === repaso.preguntas.length
      }).length,
  },

  actions: {
    /**
     * @returns {{pagado: number, mejorado: boolean, mejorAnterior: number}}
     */
    registrar(repaso, aciertos) {
      const mejorAnterior = this.mejores[repaso.id] ?? 0
      const mejorado = aciertos > mejorAnterior

      this.hechos += 1
      if (mejorado) this.mejores = { ...this.mejores, [repaso.id]: aciertos }

      const pagado = mejorado
        ? usarEconomia().ingresar(
            CROQUETAS_POR_ACIERTO * (aciertos - mejorAnterior),
            `Repaso: ${repaso.titulo}`,
          )
        : 0

      return { pagado, mejorado, mejorAnterior }
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharRepasos(almacen) {
  autoguardar(almacen, 'repasos')
}
