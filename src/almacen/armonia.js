import { defineStore } from 'pinia'

import { cargarApunte } from '../contenido/apuntes/index.js'
import { cargarReto } from '../contenido/retos/index.js'
import { guardarAjustesDeProveedor, hayClave, leerAjustesDeProveedor } from './clave.js'
import { autoguardar } from './persistencia.js'

/**
 * El cerebro de Armonía, en diferido.
 *
 * Este almacén lo monta `main.js` al arrancar, y con los `import` estáticos se
 * llevaba al paquete inicial todo lo que hay detrás: el índice de búsqueda, el
 * pegamento del corpus, los mensajes de los proveedores y -por la cadena de
 * `buscar.js`- **las 128 entradas del glosario**. Todo eso para una ventana que
 * no se abre hasta que alguien pregunta algo.
 *
 * Lo que se queda aquí es el estado: si está abierta, lo hablado, los ajustes
 * del proveedor. Lo que piensa se pide la primera vez que hace falta, y las
 * cuatro acciones que lo necesitan ya eran asíncronas.
 *
 * Se guarda la promesa y no el módulo: dos preguntas seguidas no piden el
 * mismo trozo dos veces, y no hace falta esperar a que la primera acabe.
 */
let elCerebro = null
function cerebro() {
  elCerebro ??= Promise.all([
    import('../motor/armonia/responder.js'),
    import('../motor/armonia/proveedores.js'),
    import('../motor/armonia/buscar.js'),
  ]).then(([responder, proveedores, buscar]) => ({ ...responder, ...proveedores, ...buscar }))
  return elCerebro
}

/** Cuántos turnos se recuerdan. Más allá, la conversación no aporta nada. */
const MEMORIA = 30

/** Cuántos trozos de material acompañan a la pregunta. */
const TROZOS = 5

/**
 * Lo que se le pone delante al modelo además del apunte del reto.
 *
 * Vive fuera de la acción para poder probarlo sin salir a la red. El apunte del
 * reto abierto se manda entero por su cuenta, así que sus secciones se quitan
 * de aquí: iban por duplicado y costaban un cuarto del contexto, y en un modelo
 * pequeño el contexto gastado es respuesta perdida.
 */
export async function materialParaElModelo(pregunta, reto) {
  const { buscar } = await cerebro()
  return buscar(pregunta, {
    retoId: reto?.id ?? null,
    mundoId: reto?.mundo ?? null,
    cuantos: TROZOS + 3,
  })
    .filter((trozo) => !(reto && trozo.tipo === 'apunte' && trozo.retoId === reto.id))
    .slice(0, TROZOS)
}

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
      const { prepararArmonia } = await cerebro()
      await prepararArmonia()
    },

    async preguntar(texto) {
      const pregunta = (texto ?? '').trim()
      if (!pregunta) return null
      const { prepararArmonia, responder } = await cerebro()
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

      const { contexto, instrucciones, prepararArmonia, preguntarAlProveedor, responder, sinCodigo } =
        await cerebro()
      await prepararArmonia()
      // El reto entero, no su ficha: de aquí sale el enunciado que se le da al
      // modelo, y el enunciado vive en el cuerpo. Es una carga local y esto ya
      // está esperando a la red, así que no se nota.
      const reto = this.contexto.retoId ? await cargarReto(this.contexto.retoId) : null

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
      const material = await materialParaElModelo(pregunta, reto)

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
  //
  // Y `proveedor` MENOS todavía: ahí dentro está la clave de API. Vive en su
  // propia entrada de localStorage (ver `almacen/clave.js`) justo para que
  // exportar la partida no exporte la clave, y estando en el estado del
  // almacén se colaba igualmente en cada guardado. La prueba que lo vigilaba
  // no lo vio porque configuraba la clave antes de enganchar el almacén.
  autoguardar(almacen, 'armonia', {
    omitir: ['contexto', 'abierto', 'proveedor', 'escribiendo'],
  })
}
