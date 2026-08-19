import { defineStore } from 'pinia'

import { precioDePista } from '../contenido/retos/comun.js'
import { FASES, evaluarEnvio } from '../motor/ejecutor.js'
import { TIEMPO_LIMITE_MS } from '../motor/protocolo.js'
import { traducirImprevisto } from '../contenido/imprevistos.js'
import { MUNDOS_POR_ID } from '../contenido/mundos.js'
import { usarEconomia } from './economia.js'
import { usarGatos } from './gatos.js'
import { usarInsignias } from './insignias.js'
import { revisar } from '../motor/marasi/revisar.js'
import { seEscribe } from '../contenido/retos/tipos.js'
import { usarNarrador } from './narrador.js'
import { usarProgreso } from './progreso.js'
import { usarRecortes } from './recortes.js'

/** Con la burbuja de Bendaloy, el código tiene bastante más margen. */
const TIEMPO_LIMITE_AMPLIADO_MS = 8000

const normalizar = (texto) =>
  String(texto ?? '')
    .split('\n')
    .map((linea) => linea.replace(/\s+/g, ' ').trim())
    .filter((linea) => linea !== '')
    .join('\n')
    .toLowerCase()

/**
 * El pegamento del juego: aquí es donde resolver un reto se convierte en
 * croquetas, y donde los gatos dejan de ser decorativos y empiezan a cambiar
 * las reglas.
 */
export const usarJuego = defineStore('juego', {
  state: () => ({
    ultimoResultado: null,
    ejecutando: false,
  }),

  getters: {
    tiempoLimite: () =>
      usarGatos().tieneBonus('tiempoAmpliado') ? TIEMPO_LIMITE_AMPLIADO_MS : TIEMPO_LIMITE_MS,

    /** Lo que cuesta ahora mismo una pista, con los descuentos que haya. */
    precioDePista: () => (reto, nivel) => {
      if (!reto.pistas?.[nivel]) return 0
      const coste = precioDePista(reto, nivel)
      if (coste === 0) return 0
      return usarGatos().tieneBonus('pistasBaratas') ? Math.ceil(coste / 2) : coste
    },
  },

  actions: {
    /** Lo primero al abrir el juego: poner al día a los gatos y saludar. */
    arrancarSesion() {
      const progreso = usarProgreso()
      const gatos = usarGatos()
      const narrador = usarNarrador()

      gatos.aplicarDesgaste()

      if (!progreso.vistoLaBienvenida) {
        progreso.vistoLaBienvenida = true
        narrador.decir('bienvenida', {}, { forzar: true })
      } else if (progreso.llevabaSemanasFuera) {
        narrador.decir('vuelvesTrasUnaSemana', {}, { forzar: true })
      } else {
        const tristes = gatos.descuidados
        if (tristes.length > 0) {
          narrador.decir('gatoDesatendido', { gato: tristes[0].nombre }, { forzar: true })
        }
      }

      // Un secreto para quien programa a horas intempestivas.
      const hora = new Date().getHours()
      if (hora >= 3 && hora < 6) usarRecortes().desbloquear('nocturno')

      progreso.registrarVisita()
    },

    /**
     * Compra una pista. La primera es gratis; las otras se pagan, y a cambio
     * Wayne deja un trasto sin ningún valor.
     */
    comprarPista(reto, nivel) {
      const progreso = usarProgreso()
      const economia = usarEconomia()
      const gatos = usarGatos()
      const narrador = usarNarrador()

      const pista = reto.pistas?.[nivel]
      if (!pista) return { ok: false }

      // Una pista ya pagada no se vuelve a cobrar.
      if (progreso.ficha(reto.id).pistasUsadas.includes(nivel)) {
        return { ok: true, pista, yaEstabaPagada: true }
      }

      let precio = this.precioDePista(reto, nivel)
      let cortesiaDeCobre = false

      if (precio > 0 && gatos.bonusDiarioDisponible('pistaGratisDiaria')) {
        cortesiaDeCobre = gatos.consumirBonusDiario('pistaGratisDiaria')
        if (cortesiaDeCobre) precio = 0
      }

      if (precio > 0 && !economia.gastar(precio, `Pista ${nivel + 1} · ${reto.titulo}`)) {
        narrador.decir('sinCroquetas', {}, { forzar: true })
        return { ok: false, motivo: 'No te llegan las croquetas.' }
      }

      progreso.registrarPista(reto.id, nivel)
      if (progreso.ficha(reto.id).pistasUsadas.length === 3) {
        usarRecortes().desbloquear('tres-pistas')
      }
      narrador.decir('pistaPedida', {}, { nivel: nivel + 1, forzar: true })

      const trasto = precio > 0 && !cortesiaDeCobre ? economia.recibirTrasto() : null
      if (trasto) narrador.decir('trastoRecibido', { trasto: trasto.nombre })
      return { ok: true, pista, precio, trasto, cortesiaDeCobre }
    },

    /** Corrige un envío y reparte lo que corresponda. */
    async enviar(reto, codigo, puente) {
      const progreso = usarProgreso()
      const gatos = usarGatos()

      this.ejecutando = true
      let resultado
      try {
        resultado = await evaluarEnvio({ reto, codigo, puente, tiempoLimiteMs: this.tiempoLimite })
      } finally {
        this.ejecutando = false
      }

      const recortes = usarRecortes()
      const ficha = progreso.ficha(reto.id)
      const fallosAntes = ficha.fallos
      const indultado =
        !resultado.ok && !ficha.superado && ficha.fallos === 0 && gatos.tieneBonus('segundaOportunidad')

      if (codigo === reto.inicial) recortes.desbloquear('sin-tocar-nada')
      if (resultado.fase === FASES.SINTAXIS) recortes.desbloquear('error-de-sintaxis')
      if (resultado.error?.bucleInfinito) recortes.desbloquear('bucle-infinito')
      if (!resultado.ok) recortes.desbloquear('primer-fallo')
      if (resultado.ok && fallosAntes >= 5) recortes.desbloquear('insistente')

      // El primer envío de un reto virgen. Estaba escrito y no lo disparaba nadie.
      if (ficha.intentos === 0) usarNarrador().decir('primerIntento')

      progreso.registrarIntento(reto.id, resultado.ok, { indultado })

      // Marasi lee el código al superarlo. Aquí es el único sitio donde se
      // tiene delante, así que es donde se apunta si no tenía nada que decir.
      if (resultado.ok && seEscribe(reto.tipo) && !ficha.superado && revisar(codigo).length === 0) {
        progreso.apuntarRevisionLimpia()
      }

      const completo = resultado.ok
        ? { ...resultado, indultado, ...this.premiar(reto) }
        : { ...resultado, indultado, recompensa: null }

      if (!resultado.ok) {
        // Wayne va de gracioso con cada fallo, pero cuando el reto se resiste de
        // verdad la broma deja de ayudar: ahí entra Wax y explica.
        const fallos = progreso.ficha(reto.id).fallos
        const narrador = usarNarrador()
        if (fallos === 3) narrador.decirWax('atascado')
        else if (fallos > 3 && fallos % 4 === 0) narrador.decirWax('insiste')
        else this.narrarFallo(resultado, reto)
      }
      this.ultimoResultado = completo
      return completo
    },

    /**
     * Predicción: se compara la respuesta escrita con la real, y se ejecuta el
     * código de todas formas para que el jugador vea lo que pasa de verdad.
     */
    async resolverPrediccion(reto, respuesta, puente) {
      const progreso = usarProgreso()

      this.ejecutando = true
      let ejecucion
      try {
        ejecucion = await evaluarEnvio({
          reto: { ...reto, tests: [] },
          codigo: reto.codigoMostrado,
          puente,
          tiempoLimiteMs: this.tiempoLimite,
        })
      } finally {
        this.ejecutando = false
      }

      const acertado = normalizar(respuesta) === normalizar(reto.respuestaEsperada)
      progreso.registrarIntento(reto.id, acertado)

      const completo = {
        ...ejecucion,
        ok: acertado,
        fase: FASES.TESTS,
        salidaReal: ejecucion.consola.map((linea) => linea.texto).join('\n'),
        ...(acertado ? this.premiar(reto) : { recompensa: null }),
      }

      if (!acertado) usarNarrador().decir('testFallado')
      this.ultimoResultado = completo
      return completo
    },

    /**
     * Retos que no ejecutan código: elegir la respuesta y emparejar. Se
     * corrigen aquí mismo, sin sandbox, porque no hay nada que ejecutar.
     */
    resolverInteractivo(reto, acertado) {
      const progreso = usarProgreso()
      progreso.registrarIntento(reto.id, acertado)

      const completo = {
        ok: acertado,
        fase: 'interactivo',
        requisitos: [],
        tests: [],
        consola: [],
        error: null,
        tiempoMs: 0,
        ...(acertado ? this.premiar(reto) : { recompensa: null }),
      }

      if (!acertado) {
        const fallos = progreso.ficha(reto.id).fallos
        const narrador = usarNarrador()
        if (fallos === 3) narrador.decirWax('atascado')
        else narrador.decir('testFallado')
      }

      this.ultimoResultado = completo
      return completo
    },

    /** Croquetas del reto, con las primas por limpieza y por puntería. */
    premiar(reto) {
      const progreso = usarProgreso()
      const economia = usarEconomia()
      const gatos = usarGatos()
      const narrador = usarNarrador()

      const ficha = progreso.ficha(reto.id)
      const sinPistas = ficha.pistasUsadas.length === 0
      const aLaPrimera = ficha.intentos <= 1

      const { esNuevo, racha, rachaRota, rachaAntes } = progreso.registrarVictoria(reto.id, {
        rachaResistente: gatos.tieneBonus('rachaResistente'),
      })

      if (!esNuevo) {
        narrador.decir('retoSuperado')
        return { recompensa: null, repetido: true }
      }

      const base = reto.recompensa?.croquetas ?? 0
      const detalle = [{ concepto: 'Reto superado', croquetas: base }]
      if (sinPistas) detalle.push({ concepto: 'Sin pistas', croquetas: Math.round(base * 0.5) })
      if (aLaPrimera) detalle.push({ concepto: 'A la primera', croquetas: Math.round(base * 0.25) })

      let total = detalle.reduce((suma, parte) => suma + parte.croquetas, 0)
      if (gatos.tieneBonus('croquetasExtra')) {
        const extra = Math.round(total * 0.1)
        detalle.push({ concepto: 'Empujón de Acero', croquetas: extra })
        total += extra
      }

      economia.ingresar(total, reto.titulo)

      if (reto.jefe) narrador.decir('jefeDerrotado', {}, { forzar: true })
      // La racha solo se comenta en los saltos que se notan. Cantarla en cada
      // reto la convertiría en ruido, y dejaría de significar nada.
      else if ([3, 5, 10, 20].includes(racha)) narrador.decir('rachaSube', { racha }, { forzar: true })
      else if (sinPistas && aLaPrimera) narrador.decir('superadoSinPistas')
      else narrador.decir('retoSuperado')

      if (rachaRota) narrador.decir('rachaRota', { racha: rachaAntes }, { forzar: true })

      // Las insignias van al final, cuando ya está todo apuntado: si se
      // miraran antes, la del propio reto que acabas de pasar no contaría.
      for (const insignia of usarInsignias().revisar()) {
        narrador.decir('insigniaGanada', { insignia: insignia.nombre }, { forzar: true })
      }

      // MeLaan comenta lo suyo: que reescribir algo que ya funciona es lo
      // difícil. Sus dos frases estaban escritas y nadie las decía.
      const suMundo = MUNDOS_POR_ID[reto.mundo]
      if (reto.tipo === 'refactor') narrador.decirAnfitrion(suMundo, 'mismaCosa')

      // Wax solo aparece cuando la cosa se pone seria, y cerrar un mundo lo es.
      // Su enhorabuena llevaba escrita desde el principio sin que nadie la usara.
      if (reto.jefe && progreso.mundoCompletado(reto.mundo)) {
        narrador.decirWax('enhorabuena', { mundo: MUNDOS_POR_ID[reto.mundo]?.nombre ?? '' })
      }

      return { recompensa: { total, detalle }, repetido: false }
    },

    narrarFallo(resultado, reto) {
      const narrador = usarNarrador()

      // Steris tiene el error previsto en su lista: si lo sabe traducir, lo
      // dice ella, que para eso es la anfitriona de los cimientos.
      const mundo = MUNDOS_POR_ID[reto?.mundo]
      if (mundo?.anfitrion === 'steris' && traducirImprevisto(resultado.error?.mensaje)) {
        narrador.decirAnfitrion(mundo, 'previsto')
      }
      switch (resultado.fase) {
        case FASES.SINTAXIS:
          return narrador.decir('errorDeSintaxis', { linea: resultado.error?.linea }, { forzar: true })
        case FASES.REQUISITOS:
          return narrador.decir('requisitoIncumplido', {}, { forzar: true })
        case FASES.TIEMPO:
          return narrador.decir('tiempoAgotado', {}, { forzar: true })
        case FASES.EJECUCION:
          return resultado.error?.bucleInfinito
            ? narrador.decir('bucleInfinito', {}, { forzar: true })
            : narrador.decir('testFallado', { fallo: resultado.error?.mensaje })
        default: {
          const primerFallo = resultado.tests?.find((test) => !test.ok)
          return narrador.decir('testFallado', { fallo: primerFallo?.mensaje })
        }
      }
    },
  },
})
