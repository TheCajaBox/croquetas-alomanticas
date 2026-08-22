<script setup>
import { computed } from 'vue'

import armonia from '../recursos/armonia-avatar.webp'
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
 * Wayne, el azul acero de Wax, el lavanda de Steris, el granate de Marasi y el
 * jade de MeLaan. Sobre un disco y no recortadas a pelo, porque una cabeza sin
 * fondo dentro de un círculo se lee como una cabeza flotando y no como un
 * avatar.
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
const CARAS = { wayne, wax, steris, marasi, melaan, armonia }

/**
 * Todos los que hablan en el juego, tengan ilustración o no.
 *
 * Los de la primera era todavía no la tienen —no hay imágenes que poner— y
 * hasta que aparezcan salen con un disco de su color y su inicial, dibujado
 * aquí mismo. Antes, un `quien` desconocido caía en la cara de Wayne por
 * descarte: Vin salía con el sombrero puesto, que es peor que no salir.
 */
const QUIENES = {
  wayne: { nombre: 'Wayne', color: '#c98b4b' },
  wax: { nombre: 'Wax', color: '#7fa3c4' },
  steris: { nombre: 'Steris', color: '#9aa8d8' },
  marasi: { nombre: 'Marasi', color: '#b06f8a' },
  melaan: { nombre: 'MeLaan', color: '#4fb89c' },
  armonia: { nombre: 'Armonía', color: '#c6a45c' },
  // La primera era.
  brisa: { nombre: 'Brisa', color: '#b07a9a' },
  ham: { nombre: 'Ham', color: '#9a8f6a' },
  kelsier: { nombre: 'Kelsier', color: '#cfd6e0' },
  fantasma: { nombre: 'Fantasma', color: '#d0a24f' },
  // A Sazed le toca el mismo color que a Armonía. No es un descuido: es el
  // mismo, unos cuantos siglos antes.
  sazed: { nombre: 'Sazed', color: '#c6a45c' },
  elend: { nombre: 'Elend', color: '#7f8fd8' },
  vin: { nombre: 'Vin', color: '#a8a2bd' },
  tensoon: { nombre: 'TenSoon', color: '#6fb08a' },
  dockson: { nombre: 'Dockson', color: '#8a9aa8' },
  marsh: { nombre: 'Marsh', color: '#8a8a96' },

  // Elantris.
  galladon: { nombre: 'Galladon', color: '#b98a63' },
  raoden: { nombre: 'Raoden', color: '#e0c987' },
  sarene: { nombre: 'Sarene', color: '#63b0c9' },
  adien: { nombre: 'Adien', color: '#cbd6e4' },
  karata: { nombre: 'Karata', color: '#8a7f8c' },
  hrathen: { nombre: 'Hrathen', color: '#b0503f' },

  // Sel, cien días para falsificar un alma.
  shai: { nombre: 'Shai', color: '#c46a5a' },
  gaotona: { nombre: 'Gaotona', color: '#b9a678' },
  hanshuxen: { nombre: 'Han ShuXen', color: '#7f8a96' },
  sellador: { nombre: 'el Sellador de sangre', color: '#8f2f2f' },
  frava: { nombre: 'Frava', color: '#7a6f92' },
}

const props = defineProps({
  quien: { type: String, default: 'wayne' },
  tamano: { type: Number, default: 64 },
  /** Un saltito al aparecer. No es una expresión: es que está vivo. */
  animado: { type: Boolean, default: false },
})

const quien = computed(() => QUIENES[props.quien] ?? QUIENES.wayne)
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
