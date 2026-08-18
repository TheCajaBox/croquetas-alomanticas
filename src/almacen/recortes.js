import { defineStore } from 'pinia'

import { RECORTES, RECORTES_POR_ID } from '../contenido/recortes.js'
import { autoguardar } from './persistencia.js'

export const usarRecortes = defineStore('recortes', {
  state: () => ({
    encontrados: [],
    ultimoEncontrado: null,
  }),

  getters: {
    tiene: (estado) => (id) => estado.encontrados.includes(id),
    cuantos: (estado) => estado.encontrados.length,
    total: () => RECORTES.length,
    mios: (estado) => RECORTES.filter((r) => estado.encontrados.includes(r.id)),
  },

  actions: {
    /**
     * Desbloquea un recorte. Se llama desde donde ocurre la cosa, y si ya
     * estaba no hace nada: cada uno se consigue una sola vez y en silencio.
     */
    desbloquear(id) {
      if (!RECORTES_POR_ID[id] || this.encontrados.includes(id)) return null
      this.encontrados.push(id)
      this.ultimoEncontrado = { id, cuando: Date.now() }
      return RECORTES_POR_ID[id]
    },

    olvidarUltimo() {
      this.ultimoEncontrado = null
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharRecortes(almacen) {
  autoguardar(almacen, 'recortes')
}
