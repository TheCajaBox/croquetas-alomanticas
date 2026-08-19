import { defineStore } from 'pinia'

import { GLOSARIO_POR_ID } from '../contenido/glosario.js'
import { autoguardar } from './persistencia.js'

/**
 * Qué término está abierto ahora mismo y cuáles se han consultado alguna vez.
 *
 * Lo segundo no es estadística por gusto: en el glosario se marcan los que ya
 * has mirado, y así se ve de un vistazo lo que te queda por conocer.
 */
export const usarGlosario = defineStore('glosario', {
  state: () => ({
    abierto: null,
    consultados: [],
  }),

  getters: {
    entrada: (estado) => (estado.abierto ? GLOSARIO_POR_ID[estado.abierto] ?? null : null),
    consultado: (estado) => (id) => estado.consultados.includes(id),
    cuantosConsultados: (estado) => estado.consultados.length,
  },

  actions: {
    abrir(id) {
      if (!GLOSARIO_POR_ID[id]) return
      this.abierto = id
      if (!this.consultados.includes(id)) this.consultados.push(id)
    },

    cerrar() {
      this.abierto = null
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharGlosario(almacen) {
  autoguardar(almacen, 'glosario')
}
