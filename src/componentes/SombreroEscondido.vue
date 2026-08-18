<script setup>
import { computed } from 'vue'

import { usarSombreros } from '../almacen/sombreros.js'

/**
 * Un sombrero escondido en algún rincón del juego.
 *
 * Se coloca dentro de cualquier elemento que tenga `position: relative` y se
 * queda ahí, casi transparente, hasta que alguien le pasa el ratón por encima.
 * Una vez encontrado desaparece de su escondite y se va a la sombrerera.
 *
 * Lleva su etiqueta accesible a propósito: quien navegue con lector de
 * pantalla también tiene derecho a encontrarlos.
 */
const props = defineProps({
  id: { type: String, required: true },
  posicion: { type: Object, default: () => ({ top: '6px', right: '8px' }) },
  tamano: { type: Number, default: 20 },
})

const sombreros = usarSombreros()
const encontrado = computed(() => sombreros.tiene(props.id))
</script>

<template>
  <button
    v-if="!encontrado"
    class="sombrero-escondido"
    :style="{ ...posicion, width: `${tamano}px`, height: `${tamano}px` }"
    title="¿Eso de ahí es un sombrero?"
    aria-label="Un sombrero escondido. Púlsalo para quedártelo."
    @click.stop.prevent="sombreros.encontrar(id)"
  >
    <svg viewBox="0 0 32 24" aria-hidden="true">
      <ellipse cx="16" cy="19" rx="15" ry="4" fill="currentColor" />
      <path d="M6 19 Q 6 4 16 4 Q 26 4 26 19 Z" fill="currentColor" />
      <rect x="5.5" y="14" width="21" height="4" rx="2" fill="rgba(0,0,0,0.45)" />
    </svg>
  </button>
</template>

<style scoped>
.sombrero-escondido {
  position: absolute;
  z-index: 5;
  padding: 0;
  border: none;
  background: none;
  color: var(--texto);
  /* Casi invisible: está ahí, pero hay que ir a buscarlo. */
  opacity: 0.07;
  transform: rotate(-8deg);
  transition: opacity 0.2s, transform 0.25s cubic-bezier(0.2, 1.4, 0.4, 1);
}
.sombrero-escondido svg { width: 100%; height: 100%; display: block; }

.sombrero-escondido:hover,
.sombrero-escondido:focus-visible {
  opacity: 1;
  color: var(--cobre-claro);
  transform: rotate(6deg) scale(1.35) translateY(-2px);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
}

@media (prefers-reduced-motion: reduce) {
  .sombrero-escondido { transition: opacity 0.2s; }
  .sombrero-escondido:hover, .sombrero-escondido:focus-visible { transform: rotate(-8deg); }
}
</style>
