import { defineStore } from 'pinia'

import { cargarApunte } from '../contenido/apuntes/index.js'
import { RETOS_POR_ID } from '../contenido/retos/index.js'
import { buscar } from '../motor/armonia/buscar.js'
import { contexto, instrucciones, preguntarAlProveedor, sinCodigo } from '../motor/armonia/proveedores.js'
import { prepararArmonia, responder } from '../motor/armonia/responder.js'
import { guardarAjustesDeProveedor, hayClave, leerAjustesDeProveedor } from './clave.js'
import { autoguardar } from './persistencia.js'

/** Cuántos turnos se recuerdan. Más allá, la conversación no aporta nada. */
const MEMORIA = 30

/**
 * La conversación con Armonía.
 *
 * El panel se abre y se cierra, pero lo hablado se queda: cerrar para mirar el
 * apunte y volver no debería costarte lo que ya habías preguntado.
 *
 * El contexto -qué reto tienes abierto, qué has escrito, qué salió al
 * ejecutar- lo publica aquí `VistaReto`. Sin eso Armonía respondería a ciegas,
 * y su mejor respuesta es justamente la que mira tu código.
 */
export const usarArmonia = defineStore('armonia', {
  state: () => ({
    abierto: false,
    turnos: [],
    /** Se ha presentado ya alguna vez. */
    presentado: false,
    /** Cuántas veces le han pedido la solución. A la tercera, contesta distinto. */
    vecesQuePidioSolucion: 0,
    /** Lo publica la vista del reto; no se guarda en la partida. */
    contexto: { retoId: null, codigo: '', resultado: null },
    /** Proveedor y clave. Viven fuera de la partida, ver `almacen/clave.js`. */
    proveedor: leerAjustesDeProveedor(),
    /** Mientras el proveedor contesta, su respuesta se va escribiendo aquí. */
    escribiendo: null,
  }),

  getters: {
    hayConversacion: (estado) => estado.turnos.length > 0,
    conVozPrestada: (estado) => hayClave(estado.proveedor),
  },

  actions: {
    abrir() {
      this.abierto = true
    },

    cerrar() {
      this.abierto = false
    },

    alternar() {
      this.abierto = !this.abierto
    },

    /** La vista del reto cuenta dónde está el jugador y qué lleva escrito. */
    situar({ retoId = null, codigo = '', resultado = null } = {}) {
      this.contexto = { retoId, codigo, resultado }
    },

    olvidarSitio() {
      this.contexto = { retoId: null, codigo: '', resultado: null }
    },

    /** Trae los apuntes y monta el índice. Idempotente: se puede llamar siempre. */
    async preparar() {
      await prepararArmonia()
    },

    async preguntar(texto) {
      const pregunta = (texto ?? '').trim()
      if (!pregunta) return null
      await prepararArmonia()

      const contestada = responder(pregunta, {
        ...this.contexto,
        vecesQuePidioSolucion: this.vecesQuePidioSolucion,
      })

      if (contestada.tipo === 'peticion') this.vecesQuePidioSolucion += 1
      this.apuntar(pregunta, contestada)
      return contestada
    },

    /** La primera vez que se abre el panel, se presenta. */
    presentarse(texto) {
      if (this.presentado) return
      this.presentado = true
      this.turnos = [...this.turnos, { de: 'armonia', tipo: 'presentacion', texto, citas: [], cuando: Date.now() }]
    },

    guardarProveedor(ajustes) {
      this.proveedor = { ...this.proveedor, ...ajustes }
      guardarAjustesDeProveedor(this.proveedor)
    },

    /**
     * Con clave, contesta el proveedor. Sin clave, contesta el coppermind.
     *
     * Las tres capas que impiden que suelte la solución siguen puestas también
     * aquí: no se le manda (ver `contexto`), se le dice que no (ver
     * `instrucciones`) y se le tacha a la salida (ver `sinCodigo`). Y si algo
     * falla —sin red, clave mala, cuota agotada— se cae de vuelta a lo local,
     * que es lo que siempre funciona.
     */
    async preguntarConVoz(texto) {
      const pregunta = (texto ?? '').trim()
      if (!pregunta) return null

      await prepararArmonia()
      const reto = this.contexto.retoId ? RETOS_POR_ID[this.contexto.retoId] : null

      // El diagnóstico local se calcula igual y se le pasa al modelo: es lo que
      // de verdad le pasa al código, y ningún modelo lo sabría por su cuenta.
      const local = responder(pregunta, {
        ...this.contexto,
        vecesQuePidioSolucion: this.vecesQuePidioSolucion,
      })

      // Pedir la solución se corta aquí, sin gastar la clave de nadie.
      if (local.tipo === 'peticion') {
        this.vecesQuePidioSolucion += 1
        this.apuntar(pregunta, local)
        return local
      }

      // Lo que el modelo puede decir sale de aquí y de ningún otro sitio: el
      // apunte del reto y los trozos que la búsqueda local ya ha encontrado.
      // Sin esto, un modelo pequeño recita de su propia memoria y contesta como
      // un manual, que es exactamente lo que hacía.
      const apunte = reto ? await cargarApunte(reto.id) : null
      const material = buscar(pregunta, {
        retoId: reto?.id ?? null,
        mundoId: reto?.mundo ?? null,
        cuantos: 5,
      })

      this.escribiendo = ''
      try {
        const crudo = await preguntarAlProveedor({
          ajustes: this.proveedor,
          sistema: instrucciones({ enJefe: Boolean(reto?.jefe) }),
          mensajes: [
            {
              role: 'user',
              content: contexto({ ...this.contexto, reto, apunte, material, diagnostico: local.texto }),
            },
            ...this.turnos
              .slice(-6)
              .map((t) => ({ role: t.de === 'jugador' ? 'user' : 'assistant', content: t.texto })),
            { role: 'user', content: pregunta },
          ],
          alTexto: (trozo) => {
            this.escribiendo += trozo
          },
        })

        const { texto: limpio, tachado } = sinCodigo(crudo, { hayRetoAbierto: Boolean(reto) })
        this.escribiendo = null
        const dicho = { tipo: 'voz', texto: limpio, citas: local.citas ?? [], tachado }
        this.apuntar(pregunta, dicho)
        return dicho
      } catch (error) {
        this.escribiendo = null
        // Sin red o con la clave mal: se contesta con lo local y se avisa.
        const dicho = {
          ...local,
          texto: `${local.texto}\n\n_(No he podido usar tu clave: ${error.message} Te contesto con lo que recuerdo.)_`,
        }
        this.apuntar(pregunta, dicho)
        return dicho
      }
    },

    /** Mete el turno del jugador y el de Armonía en el hilo. */
    apuntar(pregunta, dicho) {
      this.turnos = [
        ...this.turnos,
        { de: 'jugador', texto: pregunta, cuando: Date.now() },
        { de: 'armonia', cuando: Date.now(), ...dicho },
      ].slice(-MEMORIA)
    },

    borrarConversacion() {
      this.turnos = []
    },

    reiniciar() {
      this.$reset()
    },
  },
})

export function engancharArmonia(almacen) {
  // El contexto no es partida: es dónde estás ahora mismo. Guardarlo metería
  // una copia de tu código en la partida y la dejaría rancia al minuto.
  autoguardar(almacen, 'armonia', { omitir: ['contexto', 'abierto'] })
}
