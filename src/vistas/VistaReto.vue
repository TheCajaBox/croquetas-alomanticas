<script setup>
import { computed, onBeforeUnmount, ref, shallowRef, watch, watchEffect } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import { useRouter } from 'vue-router'

import EditorCodigo from '../componentes/EditorCodigo.vue'
import Marcado from '../componentes/Marcado.vue'
import RetoCazarLinea from '../componentes/RetoCazarLinea.vue'
import RetoCompletar from '../componentes/RetoCompletar.vue'
import RetoEleccion from '../componentes/RetoEleccion.vue'
import RetoEmparejar from '../componentes/RetoEmparejar.vue'
import RetoEtiquetar from '../componentes/RetoEtiquetar.vue'
import RetoOrdenar from '../componentes/RetoOrdenar.vue'
import RetoTrazar from '../componentes/RetoTrazar.vue'
import RetoVerdaderoFalso from '../componentes/RetoVerdaderoFalso.vue'
import MundoCompletado from '../componentes/MundoCompletado.vue'
import PanelApunte from '../componentes/PanelApunte.vue'
import PanelEsquema from '../componentes/PanelEsquema.vue'
import PanelPistas from '../componentes/PanelPistas.vue'
import PanelResultados from '../componentes/PanelResultados.vue'
import VistaPreviaSandbox from '../componentes/VistaPreviaSandbox.vue'
import { MUNDOS_POR_ID } from '../contenido/mundos.js'
import { cargarApunte } from '../contenido/apuntes/index.js'
import { cargarReto, cuantasVariantes, enVariante, RETOS_POR_ID, retoSiguiente } from '../contenido/retos/index.js'
import {
  datosDelTipo,
  esTactil as tipoEsTactil,
  seEscribe as tipoSeEscribe,
  tieneVistaPrevia,
} from '../contenido/retos/tipos.js'
import { crearPuente } from '../motor/ejecutor.js'
import { frenteDe } from '../motor/lenguajes/index.js'
import { quienEscribeElApunte, repartoDelMundo } from '../contenido/itinerarios.js'
import { ENTORNOS } from '../motor/protocolo.js'
import { usarArmonia } from '../almacen/armonia.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarJuego } from '../almacen/juego.js'
import { usarNarrador } from '../almacen/narrador.js'
import { usarProgreso } from '../almacen/progreso.js'

const props = defineProps({ retoId: { type: String, required: true } })

const router = useRouter()
const juego = usarJuego()
const progreso = usarProgreso()
const gatos = usarGatos()
const narrador = usarNarrador()
const armonia = usarArmonia()

/**
 * La **ficha** del reto: id, mundo, entorno, tipo, título, si es jefe, la
 * recompensa y los requisitos. Está desde el primer momento, así que la
 * cabecera, el candado y el sandbox no esperan a nada.
 *
 * Lo demás -enunciado, código de partida, solución, tests, pistas, opciones- es
 * el **cuerpo**, y se pide aparte: son 234 kB entre todos los retos y no tienen
 * por qué viajar en el arranque del juego. Ver `contenido/retos/index.js`.
 */
const reto = RETOS_POR_ID[props.retoId]

// El candado se hace cumplir AQUÍ, no solo en la lista del mundo: por la
// dirección se llegaba a cualquier reto, y las citas de Armonía enlazaban
// lecciones de mundos que todavía estaban cerrados.
if (!reto) router.replace('/')
else if (!progreso.retoDisponible(reto.id)) {
  router.replace({ name: 'mundo', params: { mundoId: reto.mundo } })
}

const mundo = computed(() => MUNDOS_POR_ID[reto?.mundo])

// Quien narra aquí es de este itinerario: Wayne en la segunda era, Brisa en la
// primera. Se pone antes de que nadie diga nada.
narrador.ponerNarrador(repartoDelMundo(mundo.value)?.narra)
const siguiente = computed(() => (reto ? retoSiguiente(reto) : null))
// Si el tipo no está declarado, se para aquí. Antes se colaba y salía pintado
// como un reto de escribir, porque la plantilla acaba en un `v-else` con el
// editor: un fallo que no se nota hasta que alguien juega.
if (reto) datosDelTipo(reto.tipo)

const esPrediccion = computed(() => reto?.tipo === 'prediccion')
/** Los que se escriben a mano: editor, botón de ejecutar y requisitos en vivo. */
const seEscribe = computed(() => tipoSeEscribe(reto?.tipo))
/** Los que se resuelven señalando y colocando: traen su propio botón. */
const esTactil = computed(() => tipoEsTactil(reto?.tipo))
/**
 * El componente pintado, solo donde hay algo del jugador que pintar.
 *
 * Por el canal del entorno y no por «cualquiera que no sea worker»: en cuanto
 * apareció PHP -que tampoco pinta nada- salía un panel de «Vista previa» vacío
 * debajo de cada reto.
 */
const muestraVistaPrevia = computed(
  () => ENTORNOS[reto?.entorno]?.canal === 'iframe' && tieneVistaPrevia(reto?.tipo),
)

/** Con qué gramática colorea el editor. Del entorno, no del mundo. */
const lenguajeDelReto = computed(() => ENTORNOS[reto?.entorno]?.lenguaje ?? 'js')

// El puente se crea aquí y se destruye con la vista. La clave por ruta del
// RouterView garantiza que cambiar de reto levante un sandbox limpio.
const puente = reto ? crearPuente(reto.entorno) : null

/**
 * El apunte vive fuera del reto y se pide al abrirlo. Es una carga local, así
 * que se ve al momento; y a cambio, la lección puede ser todo lo larga que
 * haga falta sin pesar en el arranque del juego.
 */
/**
 * El anfitrión del mundo saluda al abrir el reto.
 *
 * MeLaan avisa de que el código ya funciona -que es lo que hace distinto a su
 * mundo- y Steris recuerda para qué sirven los cimientos. Las dos frases
 * llevaban escritas desde el principio y no las decía nadie.
 */
if (reto && !progreso.superado(reto.id)) {
  if (reto.tipo === 'refactor') narrador.decirAnfitrion(mundo.value, 'funcionaYaLoSe')
  else if (mundo.value?.anfitrion === 'steris') narrador.decirAnfitrion(mundo.value, 'loBasico')
}

/** Quién firma el apunte: Wax en la segunda era, Kelsier en la primera. */
const autorDelApunte = computed(() => quienEscribeElApunte(mundo.value))
const apunte = ref('')
if (reto) cargarApunte(reto.id).then((texto) => { apunte.value = texto ?? '' })

/**
 * En qué tanda de práctica estás. La 0 es el reto de siempre.
 *
 * Un reto de escribir se resuelve una vez y ahí se queda, y una vez no basta
 * para que se te quede. Al superarlo aparece «otra vez, con otros números» y se
 * juega el mismo reto con otros datos: **sin volver a cobrar**, porque el `id`
 * es el mismo y para el progreso sigue siendo un reto ya superado.
 */
const variante = ref(0)

/**
 * El cuerpo del reto, en cuanto llega. Es una carga local: se ve al momento.
 *
 * `shallowRef` y no `ref` por un motivo que se paga caro: un `ref` normal
 * envuelve el objeto en un proxy reactivo hasta el último rincón, y el reto
 * viaja al sandbox por `postMessage`. Un proxy no se puede clonar, así que
 * ejecutar reventaba con `DataCloneError` sin que nada dijera por qué. Y de
 * paso: el cuerpo del reto no cambia nunca, así que la reactividad profunda
 * sobre sus tests y sus pistas no servía para nada.
 */
const cuerpo = shallowRef(null)
const codigo = ref(progreso.ficha(props.retoId).codigoGuardado ?? '')

if (reto) {
  cargarReto(props.retoId).then((cargado) => {
    if (!cargado) return
    cuerpo.value = cargado
    // El borrador manda sobre el código de partida: es donde lo dejaste.
    if (!progreso.ficha(props.retoId).codigoGuardado) codigo.value = cargado.inicial ?? ''
  })
}

/** El reto que se está jugando ahora mismo, con los tests de su tanda. */
const enJuego = computed(() => (cuerpo.value ? enVariante(cuerpo.value, variante.value) : null))
const tandasDePractica = computed(() => cuantasVariantes(cuerpo.value))

const respuesta = ref('')
const resultado = ref(null)
const verSolucion = ref(false)

watch(codigo, (nuevo) => {
  // El borrador es el del reto de verdad. Practicando no se guarda: si no, la
  // primera tanda de práctica te borraría la solución que ya tenías escrita.
  if (variante.value !== 0) return
  // Y el código de partida que trae el reto tampoco es un borrador: sin esto,
  // abrir un reto y no tocar nada dejaría una copia guardada de lo que ya
  // viene de fábrica.
  if (nuevo === cuerpo.value?.inicial && !progreso.ficha(props.retoId).codigoGuardado) return
  progreso.guardarBorrador(props.retoId, nuevo)
})

/** Otra tanda con otros datos. Da la vuelta al llegar al final. */
function practicarOtraVez() {
  variante.value = variante.value >= tandasDePractica.value ? 1 : variante.value + 1
  codigo.value = enJuego.value?.inicial ?? ''
  resultado.value = null
  verSolucion.value = false
}

function volverAlRetoDeVerdad() {
  variante.value = 0
  codigo.value = progreso.ficha(props.retoId).codigoGuardado ?? cuerpo.value?.inicial ?? ''
  resultado.value = null
}

/**
 * Armonía necesita saber dónde estás para que su diagnóstico valga algo: sin
 * el código y sin el último resultado solo podría definir palabras, que es lo
 * que hace cualquiera.
 *
 * Se le quita al salir del reto: fuera de aquí no hay nada que mirar, y dejarle
 * una foto vieja del código sería peor que no darle ninguna.
 */
watchEffect(() => {
  armonia.situar({ retoId: props.retoId, codigo: codigo.value, resultado: resultado.value })
})
/**
 * Wayne se impacienta si llevas un rato sin ejecutar nada.
 *
 * Una sola vez por reto: repetirlo sería dar la lata a quien está pensando, que
 * es exactamente lo que hay que dejar hacer. Y se para al salir, que es lo que
 * enseña el reto del ferrocarril sobre lo que se arranca.
 */
const ESPERA_ANTES_DE_METER_PRISA = 150_000
const impaciencia = setTimeout(() => {
  if (!resultado.value) narrador.decir('inactividad')
}, ESPERA_ANTES_DE_METER_PRISA)

onBeforeUnmount(() => {
  clearTimeout(impaciencia)
  armonia.olvidarSitio()
})

const yaSuperado = computed(() => progreso.superado(props.retoId))
const ficha = computed(() => progreso.ficha(props.retoId))

/**
 * El oído fino de Estaño: comprueba los requisitos mientras se escribe, sin
 * ejecutar nada. Si el código todavía no se puede parsear no dice nada, que
 * para eso ya está el mensaje de error al ejecutar.
 */
const avisosEnVivo = computed(() => {
  // De la ficha: los requisitos viajan con ella justamente para que el oído
  // fino funcione desde la primera tecla, sin esperar al cuerpo.
  if (!gatos.tieneBonus('avisoDeRequisitos') || !reto?.requisitos?.length) return []
  if (!codigo.value.trim()) return []
  // Se lo pregunta al frente del lenguaje, que es quien sabe si esto se puede
  // mirar sin ejecutar: JavaScript sí -tiene analizador aquí mismo-, SQL
  // también -sus reglas son sobre el texto- y PHP no, porque quien sabe de PHP
  // es PHP. Estaba escrito «solo si es JavaScript», y el día que entró SQL el
  // oído se quedó sordo en un camino donde podía oír perfectamente.
  return frenteDe(reto.entorno).enVivo(codigo.value, reto) ?? []
})

async function ejecutar() {
  if (!enJuego.value) return
  clearTimeout(impaciencia)
  resultado.value = esPrediccion.value
    ? await juego.resolverPrediccion(enJuego.value, respuesta.value, puente)
    : await juego.enviar(enJuego.value, codigo.value, puente)
  if (resultado.value?.ok) progreso.apuntarVariante(reto.id, variante.value)
}

/** Elegir y emparejar se corrigen sin ejecutar nada. */
function responderTactil(acertado) {
  resultado.value = juego.resolverInteractivo(reto, acertado)
}

/** Ordenar y completar sí ejecutan: se monta el código y se manda al sandbox. */
async function ejecutarMontaje(codigoMontado) {
  if (!enJuego.value) return
  resultado.value = await juego.enviar(enJuego.value, codigoMontado, puente)
  if (resultado.value?.ok) progreso.apuntarVariante(reto.id, variante.value)
}

/**
 * Acabas de cerrar el mundo aquí mismo.
 *
 * Terminar un mundo es lo que más cuesta del juego y era lo único que no se
 * celebraba: se salía por el mismo enlace que en cualquier otro reto.
 */
const mundoRecienCerrado = computed(
  () => resultado.value?.ok && !siguiente.value && progreso.mundoCompletado(reto.mundo),
)

function reiniciarCodigo() {
  codigo.value = enJuego.value?.inicial ?? ''
  resultado.value = null
}
</script>

<template>
  <div v-if="reto" class="reto">
    <header class="encabezado">
      <RouterLink :to="{ name: 'mundo', params: { mundoId: reto.mundo } }" class="tenue volver">
        ← {{ mundo.nombre }}
      </RouterLink>
      <div class="fila etiquetas">
        <span class="etiqueta" :style="{ color: mundo.color, borderColor: mundo.color }">{{ mundo.subtitulo }}</span>
        <span v-if="reto.acto" class="etiqueta acto">acto {{ reto.acto === 1 ? 'I' : 'II' }}</span>
        <span v-if="reto.jefe" class="etiqueta jefe">jefe</span>
        <span v-if="yaSuperado" class="etiqueta superado">superado</span>
        <span v-if="variante" class="etiqueta practica">
          práctica {{ variante }} de {{ tandasDePractica }}
        </span>
      </div>
      <h1>{{ reto.titulo }}</h1>
    </header>

    <PanelApunte
      v-if="apunte"
      class="apunte-ancho"
      :texto="apunte"
      :quien="autorDelApunte"
      :empieza-abierto="!yaSuperado"
    />

    <!-- El cuerpo del reto es una carga local, así que esto se ve un instante o
         no se ve. La cabecera y el apunte ya están, que es lo que evita que la
         página parezca vacía mientras llega. -->
    <p v-if="!enJuego" class="tenue trayendo">Trayendo el reto…</p>

    <div v-else class="tablero">
      <div class="columna izquierda">
        <section class="panel enunciado">
          <SombreroEscondido id="enunciado" :posicion="{ top: '10px', right: '12px' }" :tamano="17" />
          <Marcado :texto="enJuego.enunciado" />
        </section>

        <!-- Solo los retos de SQL traen tablas, y quien las trae las necesita
             delante: una consulta se escribe mirando el esquema, no el
             enunciado. Ver `PanelEsquema`. -->
        <PanelEsquema v-if="enJuego.esquema" :esquema="enJuego.esquema" :datos="enJuego.datos ?? ''" />

        <PanelPistas :reto="enJuego" />

        <section v-if="yaSuperado && enJuego.solucion" class="panel solucion">
          <button v-if="!verSolucion" @click="verSolucion = true">Ver una solución posible</button>
          <template v-else>
            <h3>Una solución posible</h3>
            <p class="tenue nota">No es la única. Si la tuya pasa los tests, la tuya vale.</p>
            <pre><code>{{ enJuego.solucion }}</code></pre>
          </template>
        </section>
      </div>

      <div class="columna derecha">
        <!-- Predicción: el código se lee, no se toca; lo que se escribe es la respuesta -->
        <template v-if="esPrediccion">
          <section class="panel bloque">
            <h3>El código</h3>
            <pre><code>{{ enJuego.codigoMostrado }}</code></pre>
          </section>

          <section class="panel bloque">
            <h3>Tu predicción</h3>
            <textarea
              v-model="respuesta"
              class="respuesta"
              rows="5"
              spellcheck="false"
              placeholder="Una línea por cada cosa que se imprima…"
            />
          </section>
        </template>

        <RetoEleccion
          v-else-if="reto.tipo === 'eleccion'"
          :reto="enJuego"
          :contestado="!!resultado"
          @responder="responderTactil"
        />

        <RetoEmparejar
          v-else-if="reto.tipo === 'emparejar'"
          :reto="enJuego"
          :contestado="!!resultado?.ok"
          @responder="responderTactil"
        />

        <RetoOrdenar
          v-else-if="reto.tipo === 'ordenar'"
          :reto="enJuego"
          :contestado="!!resultado?.ok"
          @montar="ejecutarMontaje"
        />

        <RetoCompletar
          v-else-if="reto.tipo === 'completar'"
          :reto="enJuego"
          :contestado="!!resultado?.ok"
          @montar="ejecutarMontaje"
        />

        <RetoTrazar
          v-else-if="reto.tipo === 'trazar'"
          :reto="enJuego"
          :contestado="!!resultado"
          @responder="responderTactil"
        />

        <RetoCazarLinea
          v-else-if="reto.tipo === 'cazar-linea'"
          :reto="enJuego"
          :contestado="!!resultado"
          @responder="responderTactil"
        />

        <RetoEtiquetar
          v-else-if="reto.tipo === 'etiquetar'"
          :reto="enJuego"
          :contestado="!!resultado"
          @responder="responderTactil"
        />

        <RetoVerdaderoFalso
          v-else-if="reto.tipo === 'verdadero-o-falso'"
          :reto="enJuego"
          :contestado="!!resultado"
          @responder="responderTactil"
        />

        <template v-else>
          <section class="bloque editor-bloque">
            <div class="cabecera-editor">
              <h3>Tu código</h3>
              <button class="menudo" @click="reiniciarCodigo">Empezar de nuevo</button>
            </div>
            <EditorCodigo v-model="codigo" :lenguaje="lenguajeDelReto" />
          </section>
        </template>

        <div v-if="avisosEnVivo.length && seEscribe" class="oido-fino">
          <p class="titulo">Estaño ha oído algo</p>
          <ul>
            <li v-for="aviso in avisosEnVivo" :key="aviso.tipo + aviso.mensaje">{{ aviso.mensaje }}</li>
          </ul>
        </div>

        <div v-if="!esTactil" class="acciones">
          <button class="principal" :class="{ trabajando: juego.ejecutando }" :disabled="juego.ejecutando" @click="ejecutar">
            {{ juego.ejecutando ? 'Ejecutando…' : esPrediccion ? 'Comprobar predicción' : 'Ejecutar' }}
          </button>
          <span v-if="variante" class="tenue intentos">
            Práctica: no se cobra y no cuenta como intento.
          </span>
          <span v-else class="tenue intentos">
            {{ ficha.intentos }} intento{{ ficha.intentos === 1 ? '' : 's' }}
          </span>
        </div>

        <VistaPreviaSandbox
          v-if="muestraVistaPrevia"
          :puente="puente"
          :entorno="reto.entorno"
        />

        <PanelResultados
          v-if="!esTactil || resultado"
          :resultado="resultado"
          :ejecutando="juego.ejecutando"
          :codigo="seEscribe ? codigo : ''"
          :mundo-id="reto.mundo"
        />

        <section v-if="resultado?.ok && esPrediccion" class="panel bloque">
          <h3>Lo que ha pasado de verdad</h3>
          <pre><code>{{ resultado.salidaReal }}</code></pre>
        </section>

        <MundoCompletado v-if="mundoRecienCerrado" :mundo-id="reto.mundo" />

        <div v-else-if="resultado?.ok" class="siguiente">
          <RouterLink
            v-if="siguiente"
            :to="{ name: 'reto', params: { retoId: siguiente.id } }"
            class="boton-siguiente"
          >
            Siguiente reto: {{ siguiente.titulo }} →
          </RouterLink>
          <RouterLink v-else :to="{ name: 'mundo', params: { mundoId: reto.mundo } }" class="boton-siguiente">
            Has terminado este mundo →
          </RouterLink>

          <!-- Resolverlo una vez no basta para que se te quede. Esto no paga
               croquetas: se practica porque se quiere, no porque rente. -->
          <button v-if="tandasDePractica" class="menudo practicar" @click="practicarOtraVez">
            {{ variante ? 'Otra tanda' : 'Otra vez, con otros datos' }}
          </button>
          <button v-if="variante" class="menudo" @click="volverAlRetoDeVerdad">
            Volver al reto original
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trayendo { margin: 0; font-size: 0.9rem; }
.etiqueta.practica { color: #8fce9b; border-color: #8fce9b; }
.practicar { border-color: #8fce9b; color: #8fce9b; }

.encabezado { margin-bottom: 20px; }
.volver { display: inline-block; text-decoration: none; font-size: 0.85rem; margin-bottom: 10px; }
.etiquetas { gap: 6px; margin-bottom: 8px; }
.encabezado h1 { margin: 0; }

.apunte-ancho { margin-bottom: 18px; }

.tablero { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 18px; align-items: start; }
.columna { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

.enunciado { position: relative; font-size: 0.95rem; }

.bloque h3 { margin: 0 0 10px; font-size: 0.95rem; }
.bloque pre { margin: 0; }
.editor-bloque { display: flex; flex-direction: column; }
.cabecera-editor { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cabecera-editor h3 { margin: 0; font-size: 0.95rem; }
.menudo { padding: 5px 10px; font-size: 0.8rem; }

.respuesta { width: 100%; font-family: var(--mono); font-size: 0.87rem; resize: vertical; }

.oido-fino {
  padding: 11px 14px;
  border-radius: 8px;
  background: rgba(127, 216, 232, 0.08);
  border: 1px solid rgba(127, 216, 232, 0.28);
  font-size: 0.87rem;
}
.oido-fino .titulo {
  margin: 0 0 6px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #7fd8e8;
  font-weight: 700;
}
.oido-fino ul { margin: 0; padding-left: 18px; }

.acciones { display: flex; align-items: center; gap: 14px; }
.principal.trabajando { animation: pulso-suave 1.1s ease-in-out infinite; }
.intentos { font-size: 0.83rem; }

.solucion .nota { margin: 0 0 10px; font-size: 0.85rem; }

.siguiente { display: flex; }
.boton-siguiente {
  flex: 1;
  text-align: center;
  text-decoration: none;
  padding: 13px 18px;
  border-radius: var(--radio);
  background: rgba(95, 185, 138, 0.12);
  border: 1px solid rgba(95, 185, 138, 0.35);
  color: var(--verde);
  font-weight: 600;
}
.boton-siguiente:hover { background: rgba(95, 185, 138, 0.2); }

@media (max-width: 1000px) {
  .tablero { grid-template-columns: 1fr; }
}
</style>
