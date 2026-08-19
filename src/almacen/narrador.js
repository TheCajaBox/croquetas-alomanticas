import { defineStore } from 'pinia'

import {
  EVENTOS_IMPORTANTES,
  LINEAS,
  LINEAS_DE_ARMONIA,
  LINEAS_DE_MARASI,
  LINEAS_DE_MELAAN,
  LINEAS_DE_STERIS,
  LINEAS_DE_WAX,
} from '../contenido/narrador/lineas.js'
import { autoguardar } from './persistencia.js'

/** Cuántas frases recientes se recuerdan por evento para no repetirlas. */
const MEMORIA = 3

/** Eventos que con la verborrea normal sobran: son ruido de Wayne, no información. */
const SOLO_CON_VERBORREA_ALTA = new Set(['primerIntento', 'gatoCuidado'])

const SACOS = {
  wayne: LINEAS,
  armonia: LINEAS_DE_ARMONIA,
  wax: LINEAS_DE_WAX,
  steris: LINEAS_DE_STERIS,
  marasi: LINEAS_DE_MARASI,
  melaan: LINEAS_DE_MELAAN,
}

export const PERSONAJES = {
  wayne: { nombre: 'Wayne' },
  wax: { nombre: 'Wax' },
  armonia: { nombre: 'Armonía' },
  steris: { nombre: 'Steris' },
  marasi: { nombre: 'Marasi' },
  melaan: { nombre: 'MeLaan' },
}

export const NIVELES_DE_VERBORREA = [
  { id: 'alta', titulo: 'Que hable todo lo que quiera' },
  { id: 'normal', titulo: 'Lo normal' },
  { id: 'callado', titulo: '«Wayne, cállate»' },
]

export const usarNarrador = defineStore('narrador', {
  state: () => ({
    verborrea: 'normal',
    recientes: {},
    mensaje: null,
    /** Wax se presenta una sola vez en toda la partida. */
    waxSePresento: false,
    /** Y quien presenta un mundo, igual: la segunda vez ya te conoce. */
    presentados: [],
  }),

  getters: {
    /**
     * Decide si toca hablar. Wax nunca se calla del todo: cuando aparece es
     * porque llevas un rato atascado, y eso es información, no cháchara.
     */
    leTocaHablar: (estado) => (evento, personaje = 'wayne') => {
      // Solo Wayne está de cháchara. Cuando habla cualquier otro es porque
      // trae algo que hace falta saber.
      if (personaje !== 'wayne') return true
      if (estado.verborrea === 'callado') return EVENTOS_IMPORTANTES.has(evento)
      if (estado.verborrea === 'normal') return !SOLO_CON_VERBORREA_ALTA.has(evento)
      return true
    },
  },

  actions: {
    /**
     * Saca una frase del saco del evento evitando las últimas dichas. Si todas
     * están vistas se olvida del historial y vuelve a empezar: mejor repetirse
     * que quedarse callado.
     */
    elegirIndice(clave, cuantas) {
      if (cuantas <= 1) return 0
      const vistas = this.recientes[clave] ?? []
      let libres = []
      for (let i = 0; i < cuantas; i += 1) if (!vistas.includes(i)) libres.push(i)
      if (libres.length === 0) libres = Array.from({ length: cuantas }, (_, i) => i)

      const elegido = libres[Math.floor(Math.random() * libres.length)]
      this.recientes = {
        ...this.recientes,
        [clave]: [elegido, ...vistas].slice(0, Math.min(MEMORIA, cuantas - 1)),
      }
      return elegido
    },

    /**
     * @param {string} evento clave de src/contenido/narrador/lineas.js
     * @param {object} contexto datos para las frases que se rellenan
     * @param {{nivel?: number, forzar?: boolean, personaje?: 'wayne'|'wax'}} opciones
     */
    decir(evento, contexto = {}, { nivel, forzar = false, personaje = 'wayne' } = {}) {
      if (!forzar && !this.leTocaHablar(evento, personaje)) return null

      const sacos = SACOS[personaje] ?? LINEAS
      const saco = nivel != null ? sacos[evento]?.[nivel] : sacos[evento]
      if (!Array.isArray(saco) || saco.length === 0) return null

      const clave = `${personaje}:${nivel != null ? `${evento}:${nivel}` : evento}`
      const linea = saco[this.elegirIndice(clave, saco.length)]
      const texto = typeof linea === 'function' ? linea(contexto) : linea

      this.mensaje = { texto, evento, personaje, cuando: Date.now() }
      return texto
    },

    /**
     * Se entra en un mundo. Si ese mundo tiene dueño, sale a recibirte y se
     * presenta la primera vez; el resto los abre Wayne, que se apunta a todo.
     */
    entrarAlMundo(mundo) {
      const anfitrion = mundo?.anfitrion
      // Presentarse dos veces es de no acordarse de con quién hablas. A partir
      // de la segunda visita el mundo lo abre Wayne, como todos los demás.
      if (anfitrion && !this.presentados.includes(anfitrion)) {
        this.presentados = [...this.presentados, anfitrion]
        return this.decir('presentacion', {}, { personaje: anfitrion, forzar: true })
      }
      return this.decir('entrarAlMundo')
    },

    /**
     * El anfitrión de un mundo comenta uno de sus retos.
     *
     * Steris tenía escritas dos cosas que decir -sobre los cimientos y sobre
     * los fallos previstos- y MeLaan otras dos, y ninguna la disparaba nadie.
     * Estaban escritas, pagadas y sin usar.
     */
    decirAnfitrion(mundo, evento, contexto = {}) {
      const anfitrion = mundo?.anfitrion
      if (!anfitrion || anfitrion === 'wayne') return null
      return this.decir(evento, contexto, { personaje: anfitrion, forzar: true })
    },

    /**
     * Wax entra en escena. La primera vez se presenta; a partir de ahí va
     * directo al grano, que es lo suyo.
     */
    decirWax(evento, contexto = {}) {
      if (!this.waxSePresento) {
        this.waxSePresento = true
        return this.decir('presentacion', contexto, { personaje: 'wax', forzar: true })
      }
      return this.decir(evento, contexto, { personaje: 'wax', forzar: true })
    },

    /** Cháchara de Wayne sin que haya pasado nada. Con él callado, no. */
    charlar() {
      if (this.verborrea === 'callado' || this.mensaje) return null
      return this.decir('charla', {}, { forzar: true })
    },

    callar() {
      this.mensaje = null
    },

    cambiarVerborrea(nivel) {
      this.verborrea = nivel
      if (nivel === 'callado') this.decir('verborreaBaja', {}, { forzar: true })
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharNarrador(almacen) {
  autoguardar(almacen, 'narrador')
}
