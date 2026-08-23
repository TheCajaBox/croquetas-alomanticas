import { defineStore } from 'pinia'

import { autoguardar } from './persistencia.js'

/**
 * Qué término está abierto ahora mismo y cuáles se han consultado alguna vez.
 *
 * Lo segundo no es estadística por gusto: en el glosario se marcan los que ya
 * has mirado, y así se ve de un vistazo lo que te queda por conocer.
 *
 * ## Aquí solo hay identificadores, y es a propósito
 *
 * Este almacén **no importa el glosario**. Lo montaba `main.js` al arrancar y
 * eso metía las 128 entradas -70 kB de definiciones y ejemplos- en el paquete
 * inicial, para usarlas en dos cosas: mirar si un id existe y devolver la
 * entrada abierta.
 *
 * Las dos las hace mejor quien las pinta. `PanelGlosario` ya pide su entrada con
 * `entradaDe(id, lenguaje)` -y tiene que hacerlo él, porque el ejemplo depende
 * del camino donde estés-, así que aquí sobraba. Y si el id no existe, el panel
 * no pinta nada: el `v-if` ya estaba puesto.
 *
 * Lo que queda es una lista de cadenas, que es lo que de verdad hay que guardar
 * en la partida. Hay una prueba que vigila que el corpus no vuelva a colarse.
 */
export const usarGlosario = defineStore('glosario', {
  state: () => ({
    abierto: null,
    consultados: [],
  }),

  getters: {
    consultado: (estado) => (id) => estado.consultados.includes(id),
    cuantosConsultados: (estado) => estado.consultados.length,
  },

  actions: {
    /**
     * Abre un término por su id.
     *
     * No comprueba que exista: comprobarlo obligaría a traer el glosario entero
     * al arranque, y quien lo pinta ya se calla si no encuentra nada. Los ids
     * que llegan aquí salen del propio corpus -de un enlace del texto o de la
     * página del glosario-, así que no hay basura que filtrar.
     */
    abrir(id) {
      if (!id) return
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
