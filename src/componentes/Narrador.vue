<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import WayneSvg from './WayneSvg.vue'
import { PERSONAJES, usarNarrador } from '../almacen/narrador.js'

/** La cara que pone Wayne según lo que esté contando. */
const ANIMOS = {
  orgullo: ['retoSuperado', 'superadoSinPistas', 'jefeDerrotado', 'sombreroEncontrado', 'todosLosSombreros', 'gatoAdoptado', 'gatoCuidado'],
  sorpresa: ['errorDeSintaxis', 'bucleInfinito', 'tiempoAgotado', 'vuelvesTrasUnaSemana'],
  fastidio: ['requisitoIncumplido', 'sinCroquetas', 'gatoDesatendido', 'verborreaBaja'],
}

/** Lo que tarda el bocadillo en quitarse solo. Suficiente para leerlo sin prisa. */
const DURACION_MS = 14_000
/** Silencio a partir del cual Wayne se aburre y suelta algo por su cuenta. */
const SILENCIO_PARA_CHARLAR_MS = 95_000
const CADA_CUANTO_MIRA_MS = 20_000

const narrador = usarNarrador()
const { mensaje, verborrea } = storeToRefs(narrador)

const quien = computed(() => mensaje.value?.personaje ?? 'wayne')
const nombre = computed(() => PERSONAJES[quien.value]?.nombre ?? 'Wayne')

const animo = computed(() => {
  const evento = mensaje.value?.evento
  const encontrado = Object.entries(ANIMOS).find(([, eventos]) => eventos.includes(evento))
  return encontrado?.[0] ?? 'guasa'
})

// El bocadillo está fijo sobre la página: si no se retirara acabaría tapando el
// panel de pistas de forma permanente.
let temporizador = null
const ultimaVez = ref(Date.now())

watch(mensaje, (nuevo) => {
  clearTimeout(temporizador)
  if (!nuevo) return
  ultimaVez.value = Date.now()
  temporizador = setTimeout(() => narrador.callar(), DURACION_MS)
})

// Wayne habla también cuando no ha pasado nada. No informa de nada: es que está
// ahí y se aburre. Con la verborrea al mínimo, se lo calla.
let vigilante = null
onMounted(() => {
  vigilante = setInterval(() => {
    if (mensaje.value) return
    if (Date.now() - ultimaVez.value < SILENCIO_PARA_CHARLAR_MS) return
    ultimaVez.value = Date.now()
    narrador.charlar()
  }, CADA_CUANTO_MIRA_MS)
})

onBeforeUnmount(() => {
  clearTimeout(temporizador)
  clearInterval(vigilante)
})
</script>

<template>
  <Transition name="asoma">
    <aside v-if="mensaje" class="narrador" :class="[`es-${quien}`, { callado: verborrea === 'callado' }]">
      <WayneSvg v-if="quien === 'wayne'" class="retrato" :animo="animo" :tamano="66" />

      <!-- Wax: sombrero de ala recta, cara larga y ni un gesto de más. -->
      <svg v-else class="retrato" viewBox="0 0 64 64" width="52" height="52" aria-hidden="true">
        <ellipse cx="32" cy="56" rx="20" ry="8" fill="#2f3a44" />
        <ellipse cx="32" cy="36" rx="13" ry="16" fill="#d9b48e" />
        <rect x="11" y="25" width="42" height="4" rx="2" fill="#1f2630" />
        <rect x="21" y="8" width="22" height="18" rx="2" fill="#2b3540" />
        <rect x="21" y="20" width="22" height="4" fill="#4a5866" />
        <circle cx="27" cy="36" r="2" fill="#1f2630" />
        <circle cx="37" cy="36" r="2" fill="#1f2630" />
        <path d="M27 45 L37 45" stroke="#1f2630" stroke-width="2" stroke-linecap="round" />
        <path d="M22 50 L32 54 L42 50" fill="none" stroke="#4a5866" stroke-width="3" stroke-linecap="round" />
      </svg>

      <div class="bocadillo">
        <p class="quien">{{ nombre }}</p>
        <p class="dice">{{ mensaje.texto }}</p>
      </div>

      <button class="cerrar" title="Que se calle un rato" @click="narrador.callar()">×</button>
    </aside>
  </Transition>
</template>

<style scoped>
.narrador {
  position: fixed;
  left: 18px;
  bottom: 18px;
  z-index: 40;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 460px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #2a2338, #241e30);
  border: 1px solid var(--borde);
  border-left: 3px solid var(--cobre);
  border-radius: var(--radio);
  box-shadow: var(--sombra);
}
/* Wax se distingue de un vistazo: cuando aparece él, la cosa va en serio. */
.narrador.es-wax {
  border-left-color: #6f93b0;
  background: linear-gradient(180deg, #232c36, #1e242c);
}
.narrador.es-wax .quien { color: #8fb4d0; }

.retrato { flex-shrink: 0; margin: -6px -2px -10px 0; }
.bocadillo { min-width: 0; }
.quien {
  margin: 0 0 2px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cobre);
}
.dice { margin: 0; font-size: 0.94rem; }
.cerrar {
  flex-shrink: 0;
  padding: 0;
  width: 24px;
  height: 24px;
  line-height: 1;
  font-size: 1.1rem;
  background: none;
  border: none;
  color: var(--texto-apagado);
}
.cerrar:hover { background: none; color: var(--texto); }

.asoma-enter-active { transition: opacity 0.25s, transform 0.25s cubic-bezier(0.2, 1.2, 0.4, 1); }
.asoma-leave-active { transition: opacity 0.15s, transform 0.15s; }
.asoma-enter-from, .asoma-leave-to { opacity: 0; transform: translateY(10px) scale(0.97); }

@media (max-width: 700px) {
  .narrador { left: 10px; right: 10px; bottom: 10px; max-width: none; }
}
</style>
