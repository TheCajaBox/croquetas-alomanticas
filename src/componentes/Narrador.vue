<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import Avatar from './Avatar.vue'
import { nombreDe } from '../contenido/personajes.js'
import { usarNarrador } from '../almacen/narrador.js'

/** Lo que tarda el bocadillo en quitarse solo. Suficiente para leerlo sin prisa. */
const DURACION_MS = 14_000
/**
 * Y lo que dura cuando alguien va a interrumpir.
 *
 * Una interrupción a los catorce segundos no interrumpe nada: es otra frase
 * suelta. Ham corta a Brisa a media idea, que es lo que hace Ham.
 */
const DURACION_ANTES_DE_INTERRUMPIR_MS = 5_000
/** Silencio a partir del cual Wayne se aburre y suelta algo por su cuenta. */
const SILENCIO_PARA_CHARLAR_MS = 95_000
const CADA_CUANTO_MIRA_MS = 20_000

const narrador = usarNarrador()
const { cola, mensaje, verborrea } = storeToRefs(narrador)

const quien = computed(() => mensaje.value?.personaje ?? 'wayne')
// Del elenco entero, no de la lista corta que había aquí: con seis nombres,
// Brisa y Fantasma hablaban con el rótulo de «Wayne» encima.
const nombre = computed(() => nombreDe(quien.value))

// El bocadillo está fijo sobre la página: si no se retirara acabaría tapando el
// panel de pistas de forma permanente.
let temporizador = null
const ultimaVez = ref(Date.now())

watch(mensaje, (nuevo) => {
  clearTimeout(temporizador)
  if (!nuevo) return
  ultimaVez.value = Date.now()
  const dura = cola.value.length ? DURACION_ANTES_DE_INTERRUMPIR_MS : DURACION_MS
  temporizador = setTimeout(() => narrador.pasarAlSiguiente(), dura)
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
      <Avatar class="retrato" :quien="quien" :tamano="60" animado />

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

.retrato { flex-shrink: 0; }
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
