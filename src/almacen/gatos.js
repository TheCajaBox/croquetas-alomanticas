import { defineStore } from 'pinia'

import {
  CUIDADOS,
  DESGASTE_MAXIMO,
  DESGASTE_POR_HORA,
  FELICIDAD_PARA_BONUS,
  GATOS,
  GATOS_POR_ID,
} from '../contenido/gatos.js'
import { usarEconomia } from './economia.js'
import { usarNarrador } from './narrador.js'
import { usarProgreso } from './progreso.js'
import { usarRecortes } from './recortes.js'
import { autoguardar } from './persistencia.js'

const UNA_HORA = 60 * 60 * 1000
const hoy = () => new Date().toISOString().slice(0, 10)

const gatoNuevo = () => ({
  adoptado: true,
  comida: 100,
  felicidad: 100,
  limpieza: 100,
  ultimoCuidado: {},
  adoptadoEn: Date.now(),
})

function cumpleDesbloqueo(desbloqueo, progreso, economia) {
  switch (desbloqueo.tipo) {
    case 'retosResueltos': return progreso.retosSuperados >= desbloqueo.valor
    case 'mundoCompletado': return progreso.mundoCompletado(desbloqueo.valor)
    case 'jefesDerrotados': return progreso.jefesDerrotados >= desbloqueo.valor
    case 'rachaSinPistas': return progreso.mejorRacha >= desbloqueo.valor
    case 'croquetasGastadas': return economia.gastadasEnTotal >= desbloqueo.valor
    default: return false
  }
}

export const usarGatos = defineStore('gatos', {
  state: () => ({
    colonia: {},
    ultimaActualizacion: null,
    bonusUsadosHoy: {},
  }),

  getters: {
    estado: (estado) => (gatoId) => estado.colonia[gatoId] ?? null,

    adoptados: (estado) =>
      GATOS.filter((gato) => estado.colonia[gato.id]?.adoptado).map((gato) => ({
        ...gato,
        ...estado.colonia[gato.id],
      })),

    /** Gatos que ya se han ganado pero todavía no se han recogido del refugio. */
    enElRefugio: (estado) => {
      const progreso = usarProgreso()
      const economia = usarEconomia()
      return GATOS.filter(
        (gato) => !estado.colonia[gato.id]?.adoptado && cumpleDesbloqueo(gato.desbloqueo, progreso, economia),
      )
    },

    porVenir: (estado) => {
      const progreso = usarProgreso()
      const economia = usarEconomia()
      return GATOS.filter(
        (gato) => !estado.colonia[gato.id]?.adoptado && !cumpleDesbloqueo(gato.desbloqueo, progreso, economia),
      )
    },

    /** Un gato triste no da nada: por eso hay que cuidarlos y no solo coleccionarlos. */
    bonusActivos() {
      return new Set(
        this.adoptados
          .filter((gato) => gato.felicidad >= FELICIDAD_PARA_BONUS)
          .map((gato) => gato.bonus.id),
      )
    },

    tieneBonus() {
      return (bonusId) => this.bonusActivos.has(bonusId)
    },

    descuidados() {
      return this.adoptados.filter(
        (gato) => gato.comida < 40 || gato.felicidad < 40 || gato.limpieza < 40,
      )
    },
  },

  actions: {
    /**
     * Baja los indicadores según el tiempo REAL transcurrido desde la última
     * vez, y no con un temporizador en marcha: así el juego se comporta igual
     * tanto si lo dejas abierto como si cierras y vuelves dentro de un mes.
     *
     * La caída de una sola tacada está topada, para que volver después de
     * mucho tiempo encuentre a los gatos tristes pero no destrozados.
     */
    aplicarDesgaste() {
      const ahora = Date.now()
      if (!this.ultimaActualizacion) {
        this.ultimaActualizacion = ahora
        return
      }

      const horas = (ahora - this.ultimaActualizacion) / UNA_HORA
      if (horas <= 0) return

      // Se mira antes de tocar nada: si no, calmar la colonia dependería de si
      // ya se ha aplicado el desgaste a Latón o todavía no.
      const hayCalma = this.tieneBonus('calmaColonia')

      for (const gato of Object.values(this.colonia)) {
        if (!gato.adoptado) continue
        for (const [indicador, porHora] of Object.entries(DESGASTE_POR_HORA)) {
          const freno = indicador === 'felicidad' && hayCalma ? 0.5 : 1
          const caida = Math.min(horas * porHora * freno, DESGASTE_MAXIMO)
          gato[indicador] = Math.max(0, Math.round(gato[indicador] - caida))
        }
      }

      this.ultimaActualizacion = ahora
    },

    adoptar(gatoId) {
      if (!GATOS_POR_ID[gatoId] || this.colonia[gatoId]?.adoptado) return null
      this.colonia[gatoId] = gatoNuevo()
      this.ultimaActualizacion = this.ultimaActualizacion ?? Date.now()
      return GATOS_POR_ID[gatoId]
    },

    /** Minutos que faltan para poder repetir un cuidado, o 0 si ya se puede. */
    esperaRestante(gatoId, accion) {
      const cuidado = CUIDADOS[accion]
      const ultimo = this.colonia[gatoId]?.ultimoCuidado?.[accion]
      if (!cuidado || !ultimo) return 0
      const pasados = (Date.now() - ultimo) / 60000
      return Math.max(0, Math.ceil(cuidado.esperaMinutos - pasados))
    },

    /**
     * @returns {{ok: boolean, motivo?: string}} qué ha pasado, para poder
     *   contárselo al jugador en vez de no hacer nada sin explicación
     */
    cuidar(gatoId, accion) {
      const cuidado = CUIDADOS[accion]
      const gato = this.colonia[gatoId]
      if (!cuidado || !gato?.adoptado) return { ok: false, motivo: 'Ese gato no vive aquí.' }

      const espera = this.esperaRestante(gatoId, accion)
      if (espera > 0) {
        return { ok: false, motivo: `Acabas de hacerlo. Vuelve dentro de ${espera} min.` }
      }

      if (cuidado.coste > 0) {
        const economia = usarEconomia()
        if (!economia.gastar(cuidado.coste, `${cuidado.titulo}: ${GATOS_POR_ID[gatoId].nombre}`)) {
          return { ok: false, motivo: 'No te quedan croquetas.' }
        }
      }

      if (accion === 'alimentar' && gato.comida < 20) usarRecortes().desbloquear('gato-al-limite')
      // Wayne lo comenta solo con la verborrea alta; su línea estaba escrita y
      // no la disparaba nadie.
      usarNarrador().decir('gatoCuidado', { gato: GATOS_POR_ID[gatoId]?.nombre ?? '' })

      gato[cuidado.indicador] = Math.min(100, gato[cuidado.indicador] + cuidado.cantidad)
      gato.ultimoCuidado = { ...gato.ultimoCuidado, [accion]: Date.now() }
      return { ok: true }
    },

    /**
     * Beneficios de una vez al día, como la pista gratis de Cobre.
     * @returns {boolean} si quedaba por gastar hoy
     */
    consumirBonusDiario(bonusId) {
      if (!this.tieneBonus(bonusId)) return false
      if (this.bonusUsadosHoy[bonusId] === hoy()) return false
      this.bonusUsadosHoy = { ...this.bonusUsadosHoy, [bonusId]: hoy() }
      return true
    },

    bonusDiarioDisponible(bonusId) {
      return this.tieneBonus(bonusId) && this.bonusUsadosHoy[bonusId] !== hoy()
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharGatos(almacen) {
  autoguardar(almacen, 'gatos')
}
