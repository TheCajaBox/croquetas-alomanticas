import { defineStore } from 'pinia'

import { CROQUETAS_POR_SOMBRERO, SOMBREROS, SOMBREROS_POR_ID } from '../contenido/sombreros.js'
import { usarEconomia } from './economia.js'
import { usarNarrador } from './narrador.js'
import { autoguardar } from './persistencia.js'

export const usarSombreros = defineStore('sombreros', {
  state: () => ({
    encontrados: [],
    ultimoEncontrado: null,
  }),

  getters: {
    tiene: (estado) => (id) => estado.encontrados.includes(id),
    cuantos: (estado) => estado.encontrados.length,
    total: () => SOMBREROS.length,
    estanTodos: (estado) => estado.encontrados.length === SOMBREROS.length,

    /** En la sombrerera, los que faltan se enseñan solo por su pista. */
    lista: (estado) =>
      SOMBREROS.map((sombrero) => ({ ...sombrero, encontrado: estado.encontrados.includes(sombrero.id) })),
  },

  actions: {
    /**
     * Wayne aparece, jura que el sombrero es suyo y te lo cambia por croquetas.
     * Tú te quedas el sombrero igualmente: la sombrerera es el registro de todo
     * lo que ha dicho que era suyo.
     */
    encontrar(id) {
      const sombrero = SOMBREROS_POR_ID[id]
      if (!sombrero || this.encontrados.includes(id)) return null

      this.encontrados.push(id)
      this.ultimoEncontrado = { id, cuando: Date.now() }

      usarEconomia().ingresar(CROQUETAS_POR_SOMBRERO, `Sombrero: ${sombrero.nombre}`)

      const narrador = usarNarrador()
      if (this.estanTodos) narrador.decir('todosLosSombreros', {}, { forzar: true })
      else narrador.decir('sombreroEncontrado', { dice: sombrero.dice }, { forzar: true })

      return sombrero
    },

    olvidarUltimo() {
      this.ultimoEncontrado = null
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharSombreros(almacen) {
  autoguardar(almacen, 'sombreros')
}
