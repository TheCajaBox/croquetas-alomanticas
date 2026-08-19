<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import Avatar from './Avatar.vue'
import Marcado from './Marcado.vue'
import { LINEAS_DE_ARMONIA } from '../contenido/narrador/lineas.js'
import { usarArmonia } from '../almacen/armonia.js'
import { usarProgreso } from '../almacen/progreso.js'

/**
 * La conversación con Armonía.
 *
 * Va como cajón lateral y no como diálogo centrado porque aquí sí interesa
 * seguir viendo el reto por detrás: media conversación consiste en mirar tu
 * propio código mientras él te pregunta por él.
 */
const armonia = usarArmonia()
const progreso = usarProgreso()

const escrito = ref('')
const hilo = ref(null)
const campo = ref(null)

const turnos = computed(() => armonia.turnos)

async function alFondo() {
  await nextTick()
  if (hilo.value) hilo.value.scrollTop = hilo.value.scrollHeight
}

const esperando = ref(false)

async function enviar() {
  const texto = escrito.value.trim()
  if (!texto || esperando.value) return
  escrito.value = ''

  // Con clave contesta el proveedor; sin clave, lo que Armonía recuerda. Lo
  // segundo es instantáneo, así que solo lo primero necesita esperar.
  if (!armonia.conVozPrestada) {
    armonia.preguntar(texto)
    return alFondo()
  }

  esperando.value = true
  alFondo()
  try {
    await armonia.preguntarConVoz(texto)
  } finally {
    esperando.value = false
    alFondo()
  }
}

// Se presenta la primera vez que se abre, y solo la primera en toda la partida.
watch(
  () => armonia.abierto,
  (abierto) => {
    if (!abierto) return
    armonia.presentarse(LINEAS_DE_ARMONIA.presentacion[0])
    alFondo()
    nextTick(() => campo.value?.focus())
  },
)

// Al cambiar de pantalla se cierra solo. Si no, el fondo del cajón sobrevive a
// la navegación y se queda tapando la página siguiente.
watch(useRoute(), () => armonia.cerrar())

function alPulsarTecla(evento) {
  if (evento.key === 'Escape' && armonia.abierto) armonia.cerrar()
}

onMounted(() => window.addEventListener('keydown', alPulsarTecla))
onBeforeUnmount(() => window.removeEventListener('keydown', alPulsarTecla))

/** Cómo se nombra cada procedencia al citarla. */
const ETIQUETAS = {
  apunte: 'Apunte de',
  glosario: 'Glosario ·',
  imprevisto: 'Imprevistos ·',
  reto: 'Reto',
}

const SUGERENCIAS = [
  '¿Qué es una variable?',
  '¿Por qué falla?',
  '¿Dónde se explicaba esto?',
]

function sugerir(texto) {
  escrito.value = texto
  campo.value?.focus()
}

/**
 * Si una cita se puede pulsar.
 *
 * Armonía busca en todo el material, y eso está bien: que te diga que lo que
 * preguntas se explica más adelante es información útil. Enlazarlo no lo era.
 * Se colaba por aquí a cualquier lección cerrada, sin haber hecho las de antes.
 */
function enlazable(cita) {
  return !!cita.retoId && progreso.retoDisponible(cita.retoId)
}
</script>

<template>
  <Transition name="armonia">
    <div v-if="armonia.abierto" class="fondo" @click.self="armonia.cerrar()">
      <aside class="cajon" role="dialog" aria-modal="true" aria-label="Preguntar a Armonía">
        <header>
          <Avatar quien="armonia" :tamano="44" />
          <div class="titulo">
            <p class="quien">Armonía</p>
            <p class="tenue lema">Lo sabe todo. Casi nada te va a decir.</p>
          </div>
          <button class="cerrar" title="Cerrar" @click="armonia.cerrar()">×</button>
        </header>

        <div ref="hilo" class="hilo">
          <div v-for="(turno, indice) in turnos" :key="indice" class="turno" :class="turno.de">
            <p v-if="turno.de === 'jugador'" class="mio">{{ turno.texto }}</p>

            <div v-else class="suyo">
              <Marcado :texto="turno.texto" />

              <ul v-if="turno.citas?.length" class="citas">
                <li v-for="(cita, i) in turno.citas" :key="i">
                  <component
                    :is="enlazable(cita) ? 'RouterLink' : 'span'"
                    v-bind="enlazable(cita) ? { to: { name: 'reto', params: { retoId: cita.retoId } } } : {}"
                    class="cita"
                    :class="{ cerrada: cita.retoId && !enlazable(cita) }"
                    @click="enlazable(cita) && armonia.cerrar()"
                  >
                    <span class="fuente">{{ ETIQUETAS[cita.fuente] ?? 'En' }}</span>
                    {{ ' ' }}<span class="donde">{{ cita.reto }}</span>
                    <span v-if="cita.seccion" class="seccion">· {{ cita.seccion }}</span>
                    <span v-if="cita.retoId && !enlazable(cita)" class="candado">· todavía cerrado</span>
                  </component>
                </li>
              </ul>
            </div>
          </div>

          <!-- Lo que va llegando del proveedor mientras contesta. -->
          <div v-if="armonia.escribiendo !== null" class="turno armonia">
            <div class="suyo">
              <Marcado v-if="armonia.escribiendo" :texto="armonia.escribiendo" />
              <p v-else class="tenue pensando">Armonía está considerando qué decirte…</p>
            </div>
          </div>
        </div>

        <p v-if="armonia.conVozPrestada" class="tenue con-voz">
          Con tu clave: {{ armonia.proveedor.proveedor }}
        </p>

        <div v-if="turnos.length <= 1 && !esperando" class="sugerencias">
          <button v-for="s in SUGERENCIAS" :key="s" class="menudo" @click="sugerir(s)">{{ s }}</button>
        </div>

        <form class="preguntar" @submit.prevent="enviar">
          <input
            ref="campo"
            v-model="escrito"
            type="text"
            placeholder="Pregúntale lo que no entiendas"
            aria-label="Tu pregunta"
          />
          <button class="principal" type="submit" :disabled="!escrito.trim() || esperando">
            {{ esperando ? '…' : 'Preguntar' }}
          </button>
        </form>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.fondo {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  justify-content: flex-end;
  background: rgba(12, 10, 18, 0.55);
  backdrop-filter: blur(2px);
}

.cajon {
  display: flex;
  flex-direction: column;
  width: min(460px, 100%);
  height: 100%;
  padding: 18px 20px 20px;
  background: linear-gradient(180deg, #23212f, #1c1b27);
  border-left: 1px solid #4a4460;
  box-shadow: -18px 0 46px rgba(0, 0, 0, 0.45);
}

header { display: flex; align-items: center; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid var(--borde-suave); }
.titulo { flex: 1; min-width: 0; }
.quien {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #c6a45c;
}
.lema { margin: 2px 0 0; font-size: 0.8rem; font-style: italic; }

.cerrar {
  padding: 0;
  width: 26px;
  height: 26px;
  line-height: 1;
  font-size: 1.2rem;
  background: none;
  border: none;
  color: var(--texto-apagado);
}
.cerrar:hover { background: none; color: var(--texto); }

.hilo { flex: 1; overflow-y: auto; padding: 16px 2px; display: flex; flex-direction: column; gap: 16px; }

.turno.jugador { display: flex; justify-content: flex-end; }
.mio {
  margin: 0;
  max-width: 85%;
  padding: 8px 12px;
  font-size: 0.9rem;
  background: rgba(198, 164, 92, 0.14);
  border: 1px solid rgba(198, 164, 92, 0.3);
  border-radius: 12px 12px 2px 12px;
}

.suyo { font-size: 0.92rem; }
.suyo :deep(p) { margin: 0 0 0.7em; }
.suyo :deep(p:last-child) { margin-bottom: 0; }
.suyo :deep(pre) { font-size: 0.82rem; }

.citas {
  margin: 12px 0 0;
  padding: 10px 0 0;
  list-style: none;
  border-top: 1px solid var(--borde-suave);
  font-size: 0.84rem;
}
.citas li { margin-bottom: 5px; }
.cita { display: block; text-decoration: none; color: var(--texto-tenue); }
a.cita:hover { color: var(--texto); }
a.cita:hover .donde { text-decoration: underline; }
.fuente { color: var(--texto-apagado); }
.donde { color: #c6a45c; }
.seccion { color: var(--texto-apagado); }
.cita.cerrada .donde { color: var(--texto-tenue); }
.candado { color: var(--texto-apagado); font-style: italic; }

.pensando { margin: 0; font-style: italic; }
.con-voz { padding: 6px 0 0; font-size: 0.76rem; text-align: right; }

.sugerencias { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0; }
.sugerencias .menudo { font-size: 0.8rem; }

.preguntar { display: flex; gap: 8px; padding-top: 12px; border-top: 1px solid var(--borde-suave); }
.preguntar input {
  flex: 1;
  min-width: 0;
  padding: 9px 12px;
  font: inherit;
  font-size: 0.9rem;
  color: var(--texto);
  background: #16151f;
  border: 1px solid var(--borde-suave);
  border-radius: var(--radio-menudo);
}
.preguntar input:focus { outline: none; border-color: #c6a45c; }

.armonia-enter-active { transition: opacity 0.2s; }
.armonia-leave-active { transition: opacity 0.15s; }
.armonia-enter-from, .armonia-leave-to { opacity: 0; }
.armonia-enter-active .cajon { transition: transform 0.26s cubic-bezier(0.2, 1, 0.4, 1); }
.armonia-enter-from .cajon { transform: translateX(28px); }

@media (max-width: 620px) {
  .cajon { width: 100%; border-left: none; }
}
</style>
