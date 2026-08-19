<script setup>
import { computed, ref } from 'vue'

import GatoSvg from './GatoSvg.vue'

/**
 * Cepillar a un gato arrastrando por encima.
 *
 * Se maneja con eventos de puntero, que valen igual para el dedo y para el
 * ratón: no hay dos caminos que mantener ni nada que detectar. El progreso sale
 * de los píxeles recorridos ENCIMA del gato, así que pasar el cepillo por el
 * aire no cuenta, y arrastrar despacio cuenta lo mismo que arrastrar deprisa.
 *
 * Queda un botón para terminar sin arrastrar. No es una trampa: hay quien
 * navega con teclado y quien no puede sostener un arrastre, y dejarles el gato
 * sucio no tendría ninguna gracia.
 */
const props = defineProps({
  gato: { type: Object, required: true },
  animo: { type: String, default: 'normal' },
})
const emit = defineEmits(['completado', 'salir'])

/** Cuántos píxeles de cepillado hacen un gato limpio. */
const RECORRIDO = 900
/** Radio del gato dentro del cuadro, en tanto por uno: fuera de ahí no se cepilla. */
const CUERPO = 0.42

const recorrido = ref(0)
const puntero = ref(null)
const pelusas = ref([])
const zona = ref(null)

let ultimo = null
let siguientePelusa = 0
let terminado = false

const progreso = computed(() => Math.min(100, Math.round((recorrido.value / RECORRIDO) * 100)))

/** Coordenadas del puntero dentro del cuadro, en tanto por uno. */
function relativas(evento) {
  const caja = zona.value.getBoundingClientRect()
  return {
    x: (evento.clientX - caja.left) / caja.width,
    y: (evento.clientY - caja.top) / caja.height,
    ancho: caja.width,
    alto: caja.height,
  }
}

const encimaDelGato = (punto) => Math.hypot(punto.x - 0.5, punto.y - 0.52) < CUERPO

function empezar(evento) {
  if (terminado) return
  zona.value.setPointerCapture(evento.pointerId)
  ultimo = relativas(evento)
  puntero.value = { x: ultimo.x, y: ultimo.y }
}

function mover(evento) {
  if (terminado) return
  const punto = relativas(evento)
  puntero.value = { x: punto.x, y: punto.y }
  if (!ultimo) return

  const avance = Math.hypot((punto.x - ultimo.x) * punto.ancho, (punto.y - ultimo.y) * punto.alto)
  ultimo = punto
  if (!encimaDelGato(punto)) return

  recorrido.value += avance

  // Una pelusa cada tanto recorrido, no cada movimiento: si no, un arrastre
  // rápido suelta cuarenta de golpe y parece que el gato se deshace.
  siguientePelusa -= avance
  if (siguientePelusa <= 0) {
    siguientePelusa = 55
    const id = `${Date.now()}-${pelusas.value.length}`
    pelusas.value = [...pelusas.value, { id, x: punto.x, y: punto.y, giro: Math.random() * 60 - 30 }]
    setTimeout(() => {
      pelusas.value = pelusas.value.filter((pelusa) => pelusa.id !== id)
    }, 900)
  }

  if (recorrido.value >= RECORRIDO) rematar()
}

function soltar(evento) {
  ultimo = null
  if (evento?.pointerId !== undefined && zona.value?.hasPointerCapture(evento.pointerId)) {
    zona.value.releasePointerCapture(evento.pointerId)
  }
}

function salirse() {
  puntero.value = null
  ultimo = null
}

function rematar() {
  if (terminado) return
  terminado = true
  recorrido.value = RECORRIDO
  emit('completado')
}
</script>

<template>
  <div class="cepillo">
    <div
      ref="zona"
      class="zona"
      :class="{ hecho: progreso === 100 }"
      @pointerdown="empezar"
      @pointermove="mover"
      @pointerup="soltar"
      @pointercancel="soltar"
      @pointerleave="salirse"
    >
      <GatoSvg :aspecto="gato.aspecto" :animo="animo" :tamano="150" />

      <span
        v-for="pelusa in pelusas"
        :key="pelusa.id"
        class="pelusa"
        :style="{
          left: `${pelusa.x * 100}%`,
          top: `${pelusa.y * 100}%`,
          '--giro': `${pelusa.giro}deg`,
          background: gato.aspecto.pelo,
        }"
      />

      <svg
        v-if="puntero"
        class="brocha"
        :style="{ left: `${puntero.x * 100}%`, top: `${puntero.y * 100}%` }"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <rect x="15" y="2" width="10" height="17" rx="4" fill="#8a6f4a" />
        <rect x="12" y="17" width="16" height="7" rx="2" fill="#c98b4b" />
        <g stroke="#efe6d5" stroke-width="2" stroke-linecap="round">
          <line x1="15" y1="24" x2="14" y2="34" />
          <line x1="19" y1="24" x2="18.5" y2="36" />
          <line x1="23" y1="24" x2="23.5" y2="36" />
          <line x1="27" y1="24" x2="28" y2="34" />
        </g>
      </svg>
    </div>

    <div class="progreso" role="progressbar" :aria-valuenow="progreso" aria-valuemin="0" aria-valuemax="100" aria-label="Cepillado">
      <span :style="{ width: `${progreso}%` }" />
    </div>

    <p class="pie tenue">
      <template v-if="progreso === 0">Arrastra por encima del gato para cepillarlo.</template>
      <template v-else-if="progreso < 100">Sigue, que todavía suelta pelo.</template>
      <template v-else>Reluciente.</template>
    </p>

    <div class="salidas">
      <button class="menudo" @click="emit('salir')">Dejarlo</button>
      <button v-if="progreso < 100" class="menudo" @click="rematar()">Cepillar sin arrastrar</button>
    </div>
  </div>
</template>

<style scoped>
.cepillo { display: flex; flex-direction: column; align-items: center; gap: 8px; }

.zona {
  position: relative;
  width: 168px;
  height: 168px;
  display: grid;
  place-items: center;
  border-radius: var(--radio);
  border: 1px dashed var(--borde);
  background: rgba(201, 139, 75, 0.06);
  /* Sin esto, arrastrar el dedo sobre el gato desplaza la página. */
  touch-action: none;
  cursor: none;
  user-select: none;
}
.zona.hecho { border-style: solid; border-color: rgba(95, 185, 138, 0.5); cursor: default; }

.brocha {
  position: absolute;
  width: 46px;
  height: 46px;
  margin: -8px 0 0 -19px;
  pointer-events: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
  animation: cepillar 0.4s ease-in-out infinite alternate;
}

.pelusa {
  position: absolute;
  width: 9px;
  height: 5px;
  border-radius: 50%;
  opacity: 0.9;
  pointer-events: none;
  animation: volar 0.9s ease-out forwards;
}

.progreso {
  width: 168px;
  height: 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}
.progreso span { display: block; height: 100%; background: var(--verde); transition: width 0.12s linear; }

.pie { margin: 0; font-size: 0.8rem; text-align: center; }
.salidas { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.salidas .menudo { font-size: 0.78rem; padding: 4px 9px; }

@keyframes cepillar {
  from { transform: rotate(-12deg); }
  to { transform: rotate(10deg); }
}

@keyframes volar {
  from { transform: translate(0, 0) rotate(var(--giro)); opacity: 0.9; }
  to { transform: translate(calc(var(--giro) * 0.9), -34px) rotate(calc(var(--giro) * 3)); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .brocha, .pelusa { animation: none; }
}
</style>
