<script setup>
import { computed } from 'vue'

import wayne from '../recursos/wayne-avatar.webp'
import steris from '../recursos/steris-avatar.webp'
import wax from '../recursos/wax-avatar.webp'

/**
 * La cara de quien esté hablando.
 *
 * Son las ilustraciones de los personajes, recortadas del fondo y compuestas
 * sobre un disco con los colores que cada uno tiene en la interfaz: el cobre de
 * Wayne, el azul acero de Wax, el lavanda de Steris. Sobre un disco y no
 * recortadas a pelo, porque
 * una cabeza sin fondo dentro de un círculo se lee como una cabeza flotando y
 * no como un avatar.
 *
 * Se importan como módulos para que Vite les ponga su hash y su ruta base;
 * escritas a mano, esas rutas se romperían al publicar en GitHub Pages.
 */
const CARAS = { wayne, wax, steris }
const NOMBRES = { wayne: 'Wayne', wax: 'Wax', steris: 'Steris' }

const props = defineProps({
  quien: { type: String, default: 'wayne' },
  tamano: { type: Number, default: 64 },
  /** Un saltito al aparecer. No es una expresión: es que está vivo. */
  animado: { type: Boolean, default: false },
})

const cara = computed(() => CARAS[props.quien] ?? CARAS.wayne)
const nombre = computed(() => NOMBRES[props.quien] ?? 'Wayne')
const lado = computed(() => `${props.tamano}px`)
</script>

<template>
  <img
    :src="cara"
    class="avatar"
    :class="{ animado }"
    :style="{ width: lado, height: lado }"
    width="320"
    height="320"
    :alt="nombre"
    decoding="async"
  />
</template>

<style scoped>
.avatar { display: block; border-radius: 50%; flex-shrink: 0; }
.avatar.animado { animation: asomar-avatar 0.45s cubic-bezier(0.2, 1.4, 0.4, 1) backwards; }

@keyframes asomar-avatar {
  from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .avatar.animado { animation: none; }
}
</style>
