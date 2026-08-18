<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { usarNarrador } from '../almacen/narrador.js'

/** Lo que tarda Wayne en callarse solo. Suficiente para leerle sin prisa. */
const DURACION_MS = 14_000

const narrador = usarNarrador()
const { mensaje, verborrea } = storeToRefs(narrador)

// El bocadillo está fijo sobre la página: si no se retirara, taparía el panel
// de pistas de forma permanente.
let temporizador = null
watch(mensaje, (nuevo) => {
  clearTimeout(temporizador)
  if (nuevo) temporizador = setTimeout(() => narrador.callar(), DURACION_MS)
})
onBeforeUnmount(() => clearTimeout(temporizador))

// Con Wayne callado el bocadillo desaparece del todo salvo cuando trae algo
// que de verdad hace falta saber; de eso ya se encarga el almacén al decidir
// si habla o no.
const visible = computed(() => !!mensaje.value)
</script>

<template>
  <Transition name="asoma">
    <aside v-if="visible" class="narrador" :class="{ callado: verborrea === 'callado' }">
      <svg class="retrato" viewBox="0 0 64 64" width="52" height="52" aria-hidden="true">
        <ellipse cx="32" cy="56" rx="20" ry="8" fill="#3a3050" />
        <circle cx="32" cy="34" r="15" fill="#d9b48e" />
        <path d="M20 30 Q 32 20 44 30 Z" fill="#241f30" />
        <rect x="14" y="26" width="36" height="5" rx="2.5" fill="#241f30" />
        <path d="M22 22 Q 32 8 42 22 Z" fill="#3b3145" />
        <circle cx="27" cy="35" r="2" fill="#241f30" />
        <circle cx="37" cy="35" r="2" fill="#241f30" />
        <path d="M27 43 Q 32 47 37 42" fill="none" stroke="#241f30" stroke-width="2" stroke-linecap="round" />
      </svg>

      <div class="bocadillo">
        <p class="quien">Wayne</p>
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
  max-width: 430px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #2a2338, #241e30);
  border: 1px solid var(--borde);
  border-left: 3px solid var(--cobre);
  border-radius: var(--radio);
  box-shadow: var(--sombra);
}
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
