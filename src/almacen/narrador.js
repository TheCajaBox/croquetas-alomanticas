import { defineStore } from 'pinia'

import {
  EVENTOS_IMPORTANTES,
  cargarVoces,
  sacoDe,
  vozLista,
} from '../contenido/narrador/index.js'
import { repartoDelMundo } from '../contenido/itinerarios.js'
import { autoguardar } from './persistencia.js'

/** Cuántas frases recientes se recuerdan por evento para no repetirlas. */
const MEMORIA = 3

/**
 * Una de cada cuántas veces interrumpe quien interrumpe.
 *
 * En todas sería un pesado, y a un pesado se le cierra el bocadillo sin leerlo;
 * en una de cada diez no existiría. Se cuenta, no se sortea: así la pregunta
 * cae siempre a la misma altura para todo el mundo y se puede probar.
 */
const CADA_CUANTAS_INTERRUMPE = 3

/** Eventos que con la verborrea normal sobran: son ruido de Wayne, no información. */
const SOLO_CON_VERBORREA_ALTA = new Set(['primerIntento', 'gatoCuidado'])


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
    /**
     * Quién narra ahora mismo.
     *
     * No se guarda en la partida -es de dónde estás, no de lo que llevas
     * hecho-, y por eso vive aquí y se pone al abrir un mundo o un reto. Antes
     * todas las llamadas a `decir` daban por hecho que era Wayne, y en un mundo
     * de la primera era Wayne no ha estado nunca.
     */
    quienNarra: 'wayne',
    /**
     * Lo que se va a decir en cuanto acabe la frase de ahora.
     *
     * Cabe una sola cosa, y es para las interrupciones: quien interrumpe
     * espera a que el narrador termine y entonces le corta. Guardar una lista
     * larga acabaría soltando de golpe preguntas de hace tres retos.
     */
    cola: [],
    /** Cuántas veces se ha podido interrumpir, para interrumpir una de cada tres. */
    ocasionesDeInterrumpir: 0,
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
     * Lo pone la vista al abrir un mundo o un reto, según el reparto.
     *
     * Y de paso pide las voces que van a hacer falta en esa pantalla: la de
     * quien narra y las dos que hablan en cualquiera -Wax cuando te atascas,
     * Wayne cuando no hay nadie puesto-. Devuelve la promesa por si quien llama
     * quiere esperarla; nadie tiene que hacerlo, porque `decir` sabe esperar.
     */
    ponerNarrador(quien) {
      this.quienNarra = quien ?? 'wayne'
      return cargarVoces(this.quienNarra, 'wayne', 'wax')
    },

    /**
     * ¿Están aquí las voces que hacen falta? Si no, se piden y se dice que no.
     *
     * Quien pregunta esto vuelve a intentarlo cuando lleguen, con `reintentar`,
     * y no toca nada antes: una acción que apunta a alguien como presentado y
     * luego se queda sin frase gasta la presentación en silencio.
     */
    listas(...quienes) {
      const faltan = quienes.filter((quien) => quien && !vozLista(quien))
      if (faltan.length === 0) return true
      cargarVoces(...faltan)
      return false
    },

    /** Lo mismo, pero volviendo a llamar a lo que se quedó a medias. */
    reintentar(quienes, seguir) {
      cargarVoces(...quienes).then(seguir)
      return null
    },

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
     * Elige qué diría esa persona ante ese evento, sin decirlo todavía.
     *
     * Separado de `decir` porque hay dos destinos: el bocadillo de ahora y la
     * cola de quien va a interrumpir después.
     */
    frase(quien, evento, contexto = {}, nivel = null) {
      // Sin saco propio, callado. Antes se caía en el de Wayne por descarte, y
      // eso hacía que en un mundo de la primera era hablara Wayne -que no ha
      // estado allí nunca- con frases de otro itinerario. Mejor no decir nada.
      const sacos = sacoDe(quien)
      if (!sacos) return null
      const saco = nivel != null ? sacos[evento]?.[nivel] : sacos[evento]
      if (!Array.isArray(saco) || saco.length === 0) return null

      const clave = `${quien}:${nivel != null ? `${evento}:${nivel}` : evento}`
      const linea = saco[this.elegirIndice(clave, saco.length)]
      return typeof linea === 'function' ? linea(contexto) : linea
    },

    /**
     * @param {string} evento clave de src/contenido/narrador/voces/*.js
     * @param {object} contexto datos para las frases que se rellenan
     * @param {{nivel?: number, forzar?: boolean, personaje?: string}} opciones
     */
    decir(evento, contexto = {}, { nivel, forzar = false, personaje = null } = {}) {
      const quien = personaje ?? this.quienNarra
      if (!forzar && !this.leTocaHablar(evento, quien)) return null
      // Sin la voz aquí todavía, se pide y se vuelve. Comprobar si le toca
      // hablar no cambia nada, así que repetirlo al llegar es gratis.
      if (!this.listas(quien)) {
        return this.reintentar([quien], () => this.decir(evento, contexto, { nivel, forzar, personaje }))
      }

      const texto = this.frase(quien, evento, contexto, nivel ?? null)
      if (texto == null) return null

      this.mensaje = { texto, evento, personaje: quien, cuando: Date.now() }
      return texto
    },

    /**
     * Alguien le corta al narrador para preguntar por qué.
     *
     * Quién interrumpe lo dice el reparto del itinerario (`interrumpe`), así
     * que en la segunda era no interrumpe nadie: allí no hay nadie puesto para
     * eso y esto no hace nada. La frase no sustituye a la del narrador, espera
     * a que termine; el componente le da menos tiempo cuando ve que hay algo
     * esperando, porque una interrupción a los catorce segundos no interrumpe.
     */
    interrumpirEn(mundo, evento, contexto = {}) {
      const quien = repartoDelMundo(mundo)?.interrumpe
      if (!quien || quien === this.quienNarra) return null
      // Antes de tocar los contadores: una presentación gastada sin frase no se
      // recupera, y una ocasión contada de más descoloca el «una de cada tres».
      if (!this.listas(quien)) {
        return this.reintentar([quien], () => this.interrumpirEn(mundo, evento, contexto))
      }
      // Con el narrador callado del todo, tampoco interrumpe nadie: quien pide
      // silencio no quiere dos voces en vez de una.
      if (this.verborrea === 'callado') return null

      // La primera vez que abre la boca dice quién es. Sin esto aparecería un
      // desconocido preguntándote cosas, y encima solo una de cada tres veces:
      // la presentación no puede depender de un contador.
      let cual = evento
      if (!this.presentados.includes(quien)) {
        this.presentados = [...this.presentados, quien]
        cual = 'presentacion'
      } else {
        this.ocasionesDeInterrumpir += 1
        if (this.ocasionesDeInterrumpir % CADA_CUANTAS_INTERRUMPE !== 0) return null
      }

      const texto = this.frase(quien, cual, contexto)
      if (texto == null) return null

      // Si no hay nadie hablando, no hay a quien interrumpir: se dice ya. Sin
      // esto la frase se quedaba en la cola para siempre -nadie la sacaba,
      // porque quien la saca es el final de la frase anterior- y el silencio
      // parecía que Ham no existía.
      if (!this.mensaje) {
        this.mensaje = { texto, evento: cual, personaje: quien, cuando: Date.now() }
        return texto
      }

      this.cola = [{ texto, evento: cual, personaje: quien }]
      return texto
    },

    /** Se acaba la frase de ahora: o entra lo que esperaba, o se hace el silencio. */
    pasarAlSiguiente() {
      const [siguiente, ...resto] = this.cola
      this.cola = resto
      this.mensaje = siguiente ? { ...siguiente, cuando: Date.now() } : null
    },

    /**
     * Se entra en un mundo. Si ese mundo tiene dueño, sale a recibirte y se
     * presenta la primera vez; el resto los abre Wayne, que se apunta a todo.
     */
    entrarAlMundo(mundo) {
      const anfitrion = mundo?.anfitrion
      // Aquí hablan tres: quien narra, el dueño del mundo si lo tiene, y quien
      // interrumpe. Se piden los tres de una vez, que es una espera y no tres.
      const interrumpe = repartoDelMundo(mundo)?.interrumpe
      if (!this.listas(this.quienNarra, anfitrion, interrumpe)) {
        return this.reintentar([this.quienNarra, anfitrion, interrumpe], () =>
          this.entrarAlMundo(mundo),
        )
      }
      // Presentarse dos veces es de no acordarse de con quién hablas. A partir
      // de la segunda visita el mundo lo abre Wayne, como todos los demás.
      if (anfitrion && !this.presentados.includes(anfitrion)) {
        this.presentados = [...this.presentados, anfitrion]
        const presentacion = this.decir('presentacion', {}, { personaje: anfitrion, forzar: true })
        this.interrumpirEn(mundo, 'entrarAlMundo')
        return presentacion
      }
      const dicho = this.decir('entrarAlMundo')
      this.interrumpirEn(mundo, 'entrarAlMundo')
      return dicho
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
      // `waxSePresento` se marca aquí, así que la voz tiene que estar antes.
      if (!this.listas('wax')) {
        return this.reintentar(['wax'], () => this.decirWax(evento, contexto))
      }
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
      // Quien cierra el bocadillo quiere silencio, no la siguiente frase.
      this.cola = []
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
  // `mensaje`, `quienNarra` y la cola no son partida: son dónde estás ahora
  // mismo. Guardarlos haría que al volver te recibiera la voz del último mundo
  // que visitaste, diciendo lo último que dijo.
  autoguardar(almacen, 'narrador', {
    omitir: ['mensaje', 'quienNarra', 'cola', 'ocasionesDeInterrumpir'],
  })
}
