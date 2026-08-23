import { defineStore } from 'pinia'

import { ITINERARIO_POR_DEFECTO, itinerarioTieneSitio } from '../contenido/itinerarios.js'
import { itinerarioDeLaRuta } from '../contenido/dondeEstas.js'
import { autoguardar } from './persistencia.js'

/**
 * En qué camino estás.
 *
 * Hace falta que alguien lo sepa **fuera** de un mundo. Dentro se deduce de la
 * ruta y ya está —eso lo hace `contenido/dondeEstas.js`—, pero la barra de
 * arriba se pinta en todas las pantallas, y en el glosario, en los ajustes o en
 * la propia casa de los gatos la ruta no dice nada de ningún camino. Sin
 * recordarlo, la casa desaparecería de la barra justo al entrar en ella.
 *
 * Así que se recuerda: cada vez que pasas por un itinerario, un mundo o un reto
 * se apunta cuál era, y las pantallas de en medio heredan el último. Se guarda
 * en la partida porque es de la misma clase de cosa que «por dónde ibas»: al
 * volver mañana, la barra tiene que seguir siendo la del camino que estabas
 * jugando y no la del primero de la lista.
 */
export const usarRumbo = defineStore('rumbo', {
  state: () => ({
    /** El último itinerario por el que has pasado. Nulo hasta que pases por uno. */
    itinerarioId: null,
  }),

  getters: {
    /**
     * El camino que manda ahora mismo. Sin haber pasado por ninguno, el de por
     * defecto: quien llega de nuevas y se va derecho al glosario tiene que ver
     * una barra completa, no una barra a medias.
     */
    dondeEstoy: (estado) => estado.itinerarioId ?? ITINERARIO_POR_DEFECTO,

    /** Si desde aquí se puede ir a ese sitio. */
    hay() {
      return (sitio) => itinerarioTieneSitio(this.dondeEstoy, sitio)
    },
  },

  actions: {
    /**
     * Apunta el camino, si la ruta dice de cuál se trata.
     *
     * Lo llama la barra al navegar, con los parámetros de la ruta. Cuando la
     * ruta no es de ningún camino -el glosario, los ajustes, la entrada- **no
     * se toca nada**: se hereda el anterior, que es de lo que va todo esto.
     */
    situar(params = {}) {
      if (!params?.mundoId && !params?.retoId && !params?.itinerarioId) return
      const itinerario = itinerarioDeLaRuta(params)
      if (itinerario) this.itinerarioId = itinerario.id
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharRumbo(almacen) {
  autoguardar(almacen, 'rumbo')
}
