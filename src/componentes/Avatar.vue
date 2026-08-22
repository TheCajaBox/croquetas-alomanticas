<script setup>
import { computed } from 'vue'

import { PERSONAJES } from '../contenido/personajes.js'

import armonia from '../recursos/armonia-avatar.webp'
import brisa from '../recursos/brisa-avatar.webp'
import wayne from '../recursos/wayne-avatar.webp'
import marasi from '../recursos/marasi-avatar.webp'
import melaan from '../recursos/melaan-avatar.webp'
import steris from '../recursos/steris-avatar.webp'
import wax from '../recursos/wax-avatar.webp'

/**
 * La cara de quien esté hablando.
 *
 * Son las ilustraciones de los personajes, recortadas del fondo y compuestas
 * sobre un disco con los colores que cada uno tiene en la interfaz: el cobre de
 * Wayne, el azul acero de Wax, el lavanda de Steris, el granate de Marasi, el
 * jade de MeLaan y el ciruela de Brisa. Sobre un disco y no recortadas a pelo,
 * porque una cabeza sin fondo dentro de un círculo se lee como una cabeza
 * flotando y no como un avatar.
 *
 * El disco se compone con la misma fórmula que el de quien no tiene
 * ilustración -20% de su color sobre `#1d1826`, ver `.sin-cara` más abajo-, así
 * que los que van llegando encajan con los que ya estaban sin tener que
 * elegirle un tono a mano a cada uno.
 *
 * Armonía es la excepción, y a propósito. Su ilustración tiene la bruma de
 * fondo -un degradado, no un color plano-, así que el recorte por inundación
 * ni la limpiaría ni respetaría la túnica. Y no hace falta quitarla: la bruma
 * es suya. Va recortado en círculo con ella dentro y un aro dorado de sus
 * pendientes, y queda el único disco oscuro de los seis. Eso dice «este no es
 * como los demás» sin escribirlo en ninguna parte.
 *
 * Se importan como módulos para que Vite les ponga su hash y su ruta base;
 * escritas a mano, esas rutas se romperían al publicar en GitHub Pages.
 */
const CARAS = { wayne, wax, steris, marasi, melaan, armonia, brisa }

/**
 * Los que tienen ilustración. El resto -los que aún no la tienen- salen con
 * un disco de su color y su inicial, dibujado aquí mismo: antes un `quien`
 * desconocido caía en la cara de Wayne por descarte, y Vin salía con sombrero.
 * El elenco entero, con nombres y colores, está en `contenido/personajes.js`.
 */

const props = defineProps({
  quien: { type: String, default: 'wayne' },
  tamano: { type: Number, default: 64 },
  /** Un saltito al aparecer. No es una expresión: es que está vivo. */
  animado: { type: Boolean, default: false },
})

const quien = computed(() => PERSONAJES[props.quien] ?? PERSONAJES.wayne)
const cara = computed(() => CARAS[props.quien] ?? null)
const nombre = computed(() => quien.value.nombre)
const inicial = computed(() => nombre.value.slice(0, 1))
const lado = computed(() => `${props.tamano}px`)
</script>

<template>
  <img
    v-if="cara"
    :src="cara"
    class="avatar"
    :class="{ animado }"
    :style="{ width: lado, height: lado }"
    width="320"
    height="320"
    :alt="nombre"
    decoding="async"
  />

  <!-- Sin ilustración: su color y su inicial, que al menos se distinguen. -->
  <svg
    v-else
    class="avatar sin-cara"
    :class="{ animado }"
    :style="{ width: lado, height: lado, '--suyo': quien.color }"
    viewBox="0 0 64 64"
    role="img"
    :aria-label="nombre"
  >
    <circle cx="32" cy="32" r="31" />
    <text x="32" y="42" text-anchor="middle">{{ inicial }}</text>
  </svg>
</template>

<style scoped>
.avatar { display: block; border-radius: 50%; flex-shrink: 0; }

.sin-cara circle {
  fill: color-mix(in srgb, var(--suyo) 20%, #1d1826);
  stroke: color-mix(in srgb, var(--suyo) 55%, transparent);
  stroke-width: 2;
}
.sin-cara text {
  fill: var(--suyo);
  font-family: inherit;
  font-size: 30px;
  font-weight: 650;
}
.avatar.animado { animation: asomar-avatar 0.45s cubic-bezier(0.2, 1.4, 0.4, 1) backwards; }

@keyframes asomar-avatar {
  from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .avatar.animado { animation: none; }
}
</style>
