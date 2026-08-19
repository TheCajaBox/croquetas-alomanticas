<script setup>
import { computed } from 'vue'

import avatar from '../recursos/wayne-avatar.webp'

/**
 * La cara de Wayne.
 *
 * Es el dibujo del personaje, recortado sobre un disco con los colores del
 * juego para que se lea como un avatar y no como una cabeza flotando encima
 * del panel. Se importa como módulo para que Vite le ponga su hash y su ruta
 * base: escrita a mano, la ruta se rompería al publicar en GitHub Pages.
 */
const props = defineProps({
  tamano: { type: Number, default: 64 },
  /** Un saltito al aparecer. No es una expresión, es que está vivo. */
  animado: { type: Boolean, default: false },
})

const lado = computed(() => `${props.tamano}px`)
</script>

<template>
  <img
    :src="avatar"
    class="wayne"
    :class="{ animado }"
    :style="{ width: lado, height: lado }"
    width="320"
    height="320"
    alt="Wayne"
    decoding="async"
  />
</template>

<style scoped>
.wayne { display: block; border-radius: 50%; flex-shrink: 0; }
.wayne.animado { animation: asomar-avatar 0.45s cubic-bezier(0.2, 1.4, 0.4, 1) backwards; }

@keyframes asomar-avatar {
  from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .wayne.animado { animation: none; }
}
</style>
