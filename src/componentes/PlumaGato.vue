<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, triggerRef } from 'vue'

import GatoSvg from './GatoSvg.vue'
import { ZARPAZOS, comoVa, nuevoJuego, perseguir } from '../motor/juguete.js'
import { dentroDe } from '../motor/puntero.js'

/**
 * Jugar con un gato: una pluma que se arrastra y un gato que la persigue.
 *
 * No se llena una barra arrastrando; se cuentan **zarpazos**, y para que haya
 * otro hay que moverla: retirársela de golpe o pasearla un buen rato por
 * delante. Dejarla quieta encima del morro no es jugar con nadie, y el gato
 * deja de picar. La regla no está escrita en ninguna parte: la cuenta el propio
 * gato con lo que hace.
 *
 * La persecución vive en `motor/juguete.js`. Aquí solo se pinta y se pasa el
 * tiempo, como en la casa.
 */
const props = defineProps({
  gato: { type: Object, required: true },
  animo: { type: String, default: 'normal' },
})
const emit = defineEmits(['completado', 'salir'])

const zona = ref(null)
const pluma = ref(null)
const juego = shallowRef(nuevoJuego())
const zarpando = ref(false)

const zarpazos = computed(() => juego.value.zarpazos)
const listo = computed(() => zarpazos.value >= ZARPAZOS)

const PIES = {
  esperando: 'Pásale la pluma por delante.',
  persiguiendo: '¡Que va a por ella!',
  muevela: 'Muévela, que así no pica.',
  aleja: 'Aléjasela otra vez, que ya la tiene.',
  listo: 'Se ha quedado a gusto.',
}
const pie = computed(() => PIES[comoVa(juego.value, pluma.value !== null)])

// ---------------------------------------------------------------------------
// El tiempo
// ---------------------------------------------------------------------------

let fotograma = null
let anterior = 0
let avisoDeZarpazo = null

function latido(ahora) {
  const segundos = Math.min(0.05, (ahora - anterior) / 1000)
  anterior = ahora

  const { zarpazo } = perseguir(juego.value, pluma.value, segundos)
  triggerRef(juego)

  if (zarpazo) {
    zarpando.value = true
    clearTimeout(avisoDeZarpazo)
    avisoDeZarpazo = setTimeout(() => { zarpando.value = false }, 420)
    if (juego.value.zarpazos >= ZARPAZOS) rematar()
  }

  fotograma = requestAnimationFrame(latido)
}

onMounted(() => {
  anterior = performance.now()
  fotograma = requestAnimationFrame(latido)
})

onBeforeUnmount(() => {
  if (fotograma !== null) cancelAnimationFrame(fotograma)
  clearTimeout(avisoDeZarpazo)
})

// ---------------------------------------------------------------------------
// La pluma
// ---------------------------------------------------------------------------

function agarrar(evento) {
  if (listo.value) return
  zona.value.setPointerCapture(evento.pointerId)
  pluma.value = dentroDe(evento, zona.value)
}

function mover(evento) {
  if (listo.value) return
  pluma.value = dentroDe(evento, zona.value)
}

function soltar(evento) {
  pluma.value = null
  if (evento?.pointerId !== undefined && zona.value?.hasPointerCapture(evento.pointerId)) {
    zona.value.releasePointerCapture(evento.pointerId)
  }
}

let terminado = false
function rematar() {
  if (terminado) return
  terminado = true
  pluma.value = null
  emit('completado')
}
</script>

<template>
  <div class="pluma-juego">
    <div
      ref="zona"
      class="zona"
      :class="{ hecho: listo }"
      @pointerdown="agarrar"
      @pointermove="mover"
      @pointerup="soltar"
      @pointercancel="soltar"
      @pointerleave="soltar"
    >
      <div
        class="gato-jugando"
        :class="{ zarpando }"
        :style="{ left: `${juego.x * 100}%`, top: `${juego.y * 100}%` }"
      >
        <div :style="{ transform: `scaleX(${juego.mirando})` }">
          <GatoSvg
            :aspecto="gato.aspecto"
            :animo="listo ? 'contento' : animo"
            :pose="pluma ? 'andando' : null"
            :tamano="94"
          />
        </div>
      </div>

      <span v-if="zarpando" class="zas" :style="{ left: `${juego.x * 100}%`, top: `${juego.y * 100}%` }">
        ¡zas!
      </span>

      <svg
        v-if="pluma && !listo"
        class="la-pluma"
        :style="{ left: `${pluma.x * 100}%`, top: `${pluma.y * 100}%` }"
        viewBox="0 0 40 52"
        aria-hidden="true"
      >
        <line x1="20" y1="2" x2="20" y2="26" stroke="#6f6880" stroke-width="1.5" />
        <path d="M20 26 C 8 30, 6 44, 20 50 C 34 44, 32 30, 20 26 Z" fill="#9578ba" />
        <path d="M20 27 C 13 31, 12 43, 20 48 Z" fill="#b9a2d6" />
        <line x1="20" y1="28" x2="20" y2="49" stroke="#efe9fa" stroke-width="1.2" opacity="0.7" />
      </svg>
    </div>

    <div class="zarpazos" role="progressbar" :aria-valuenow="zarpazos" aria-valuemin="0" :aria-valuemax="ZARPAZOS" aria-label="Zarpazos">
      <span v-for="n in ZARPAZOS" :key="n" class="huella" :class="{ dada: n <= zarpazos }">●</span>
    </div>

    <p class="pie tenue">{{ pie }}</p>

    <div class="salidas">
      <button class="menudo" @click="emit('salir')">Dejarlo</button>
      <button v-if="!listo" class="menudo" @click="rematar()">Jugar sin arrastrar</button>
    </div>
  </div>
</template>

<style scoped>
.pluma-juego { display: flex; flex-direction: column; align-items: center; gap: 8px; }

.zona {
  position: relative;
  width: 168px;
  height: 168px;
  border-radius: var(--radio);
  border: 1px dashed var(--borde);
  background: rgba(149, 120, 186, 0.08);
  overflow: hidden;
  /* Sin esto, perseguir la pluma con el dedo desplaza la página. */
  touch-action: none;
  cursor: none;
  user-select: none;
}
.zona.hecho { border-style: solid; border-color: rgba(95, 185, 138, 0.5); cursor: default; }

.gato-jugando {
  position: absolute;
  transform: translate(-50%, -50%);
  transition: transform 0.12s;
  pointer-events: none;
}
.gato-jugando.zarpando { animation: zarpar 0.42s ease-out; }

.la-pluma {
  position: absolute;
  width: 34px;
  height: 44px;
  margin: -6px 0 0 -17px;
  pointer-events: none;
  transform-origin: 50% 10%;
  animation: ondear 0.7s ease-in-out infinite alternate;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55));
}

.zas {
  position: absolute;
  transform: translate(-50%, -140%);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--cobre-claro);
  pointer-events: none;
  animation: subir 0.42s ease-out forwards;
}

.zarpazos { display: flex; gap: 6px; }
.huella { color: var(--texto-apagado); font-size: 0.7rem; transition: color 0.2s, transform 0.2s; }
.huella.dada { color: var(--verde); transform: scale(1.35); }

.pie { margin: 0; font-size: 0.8rem; text-align: center; min-height: 1.2em; }
.salidas { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.salidas .menudo { font-size: 0.78rem; padding: 4px 9px; }

@keyframes zarpar {
  0% { transform: translate(-50%, -50%) scale(1); }
  35% { transform: translate(-50%, -58%) scale(1.16); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes ondear {
  from { transform: rotate(-16deg); }
  to { transform: rotate(14deg); }
}

@keyframes subir {
  from { opacity: 1; transform: translate(-50%, -140%); }
  to { opacity: 0; transform: translate(-50%, -220%); }
}

@media (prefers-reduced-motion: reduce) {
  .gato-jugando { transition: none; }
  .gato-jugando.zarpando, .la-pluma, .zas { animation: none; }
}
</style>
