import { defineStore } from 'pinia'

import { INSIGNIAS, INSIGNIAS_POR_ID } from '../contenido/insignias.js'
import { MUNDOS } from '../contenido/mundos.js'
import { RETOS } from '../contenido/retos/index.js'
import { usarGatos } from './gatos.js'
import { usarProgreso } from './progreso.js'
import { usarRecortes } from './recortes.js'
import { usarRepasos } from './repasos.js'
import { usarSombreros } from './sombreros.js'
import { autoguardar } from './persistencia.js'

/**
 * Las insignias de Marasi.
 *
 * No pagan croquetas y no van a pagarlas nunca: ver el porqué en
 * `contenido/insignias.js`. Aquí solo se comprueba quién se ha ganado cuál.
 *
 * Se revisan en los dos momentos en que puede haber cambiado algo -al superar
 * un reto y al terminar un repaso- y no en cada pintado: son dieciocho
 * comprobaciones sobre varios almacenes y no hace falta hacerlas sin motivo.
 */
export const usarInsignias = defineStore('insignias', {
  state: () => ({
    ganadas: [],
    /** La última, para poder enseñarla un momento y olvidarla. */
    ultimaGanada: null,
  }),

  getters: {
    tiene: (estado) => (id) => estado.ganadas.includes(id),
    cuantas: (estado) => estado.ganadas.length,
    total: () => INSIGNIAS.length,
    mias: (estado) => INSIGNIAS.filter((i) => estado.ganadas.includes(i.id)),
    pendientes: (estado) => INSIGNIAS.filter((i) => !estado.ganadas.includes(i.id)),
  },

  actions: {
    /**
     * Mira cuáles se acaban de ganar y las apunta.
     * @returns {Array} las nuevas, para poder anunciarlas
     */
    revisar() {
      const contexto = {
        progreso: usarProgreso(),
        repasos: usarRepasos(),
        gatos: usarGatos(),
        sombreros: usarSombreros(),
        recortes: usarRecortes(),
        totalDeRetos: RETOS.length,
        totalDeMundos: MUNDOS.length,
        jefesALaPrimera: usarProgreso().jefesALaPrimera,
        mundosSinPistas: usarProgreso().mundosSinPistas,
        mundosALaPrimera: usarProgreso().mundosALaPrimera,
        revisionesLimpias: usarProgreso().revisionesLimpias,
        retosPeleados: usarProgreso().retosPeleados,
      }

      const nuevas = []
      for (const insignia of INSIGNIAS) {
        if (this.ganadas.includes(insignia.id)) continue
        // Una insignia mal escrita no puede tumbar el reto que acabas de pasar.
        let cumple = false
        try {
          cumple = Boolean(insignia.cumple(contexto))
        } catch {
          continue
        }
        if (cumple) nuevas.push(insignia)
      }

      if (nuevas.length > 0) {
        this.ganadas = [...this.ganadas, ...nuevas.map((i) => i.id)]
        this.ultimaGanada = { id: nuevas.at(-1).id, cuando: Date.now() }
      }
      return nuevas
    },

    olvidarUltima() {
      this.ultimaGanada = null
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export { INSIGNIAS_POR_ID }

export function engancharInsignias(almacen) {
  autoguardar(almacen, 'insignias')
}
