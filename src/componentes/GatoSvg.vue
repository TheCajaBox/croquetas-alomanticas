<script setup>
import { computed } from 'vue'

/**
 * Un gato dibujado con SVG y coloreado según su metal. Sin imágenes externas:
 * el juego se publica como sitio estático y así no depende de nada.
 *
 * Respira, parpadea y menea la cola. Cada gato arranca sus animaciones con un
 * desfase distinto, sacado de sus propios colores: si todos parpadearan a la
 * vez la colonia parecería un escaparate, no una colonia.
 */
const props = defineProps({
  aspecto: { type: Object, required: true },
  animo: { type: String, default: 'normal' }, // contento | normal | triste
  tamano: { type: Number, default: 120 },
  /**
   * Qué está haciendo, cuando el gato vive en la casa y no en una ficha:
   * andando | durmiendo | comiendo | jugando | sentado | quieto. El ánimo dice
   * cómo está; la postura, qué hace. Un gato contento también duerme.
   */
  pose: { type: String, default: null },
})

const durmiendo = computed(() => props.pose === 'durmiendo' || props.animo === 'triste')
const andando = computed(() => props.pose === 'andando')
const contento = computed(() => props.animo === 'contento')

/** Desfase estable por gato: mismo gato, mismo ritmo, siempre. */
const retardo = computed(() => {
  const semilla = `${props.aspecto.pelo}${props.aspecto.ojos}`
  let suma = 0
  for (let i = 0; i < semilla.length; i += 1) suma = (suma * 31 + semilla.charCodeAt(i)) % 997
  return `-${(suma % 40) / 10}s`
})
</script>

<template>
  <svg
    :width="tamano"
    :height="tamano"
    viewBox="0 0 120 120"
    class="gato"
    :class="{ contento, durmiendo, andando }"
    :style="{ '--retardo': retardo }"
    role="img"
    aria-hidden="true"
  >
    <!-- cola -->
    <g class="cola">
      <path
        :d="contento ? 'M92 96 C 116 92, 116 58, 100 54' : 'M92 98 C 114 100, 116 82, 106 74'"
        fill="none" :stroke="aspecto.pelo" stroke-width="9" stroke-linecap="round"
      />
    </g>

    <g class="respiracion">
      <!-- cuerpo -->
      <ellipse cx="60" cy="94" rx="33" ry="25" :fill="aspecto.pelo" />
      <!-- patas: los calcetines son de un tono más claro -->
      <ellipse cx="45" cy="112" rx="10" ry="6" :fill="aspecto.patron === 'calcetines' ? '#f3efe8' : aspecto.pelo" />
      <ellipse cx="75" cy="112" rx="10" ry="6" :fill="aspecto.patron === 'calcetines' ? '#f3efe8' : aspecto.pelo" />
      <!-- orejas -->
      <path d="M33 40 L38 12 L58 28 Z" :fill="aspecto.pelo" />
      <path d="M87 40 L82 12 L62 28 Z" :fill="aspecto.pelo" />
      <path d="M38 34 L41 21 L51 29 Z" :fill="aspecto.manchas" />
      <path d="M82 34 L79 21 L69 29 Z" :fill="aspecto.manchas" />
      <!-- cabeza -->
      <circle cx="60" cy="52" r="30" :fill="aspecto.pelo" />

      <g v-if="aspecto.patron === 'rayas'" :fill="aspecto.manchas">
        <rect x="50" y="24" width="5" height="13" rx="2.5" />
        <rect x="60" y="22" width="5" height="15" rx="2.5" />
        <rect x="70" y="24" width="5" height="13" rx="2.5" />
        <rect x="44" y="86" width="5" height="17" rx="2.5" opacity="0.75" />
        <rect x="72" y="86" width="5" height="17" rx="2.5" opacity="0.75" />
      </g>
      <g v-else-if="aspecto.patron === 'manchas'" :fill="aspecto.manchas">
        <ellipse cx="43" cy="38" rx="9" ry="7" />
        <ellipse cx="78" cy="66" rx="7" ry="6" opacity="0.8" />
        <ellipse cx="74" cy="96" rx="12" ry="9" opacity="0.7" />
      </g>

      <!-- ojos -->
      <template v-if="durmiendo">
        <path d="M40 52 Q 48 59 56 52" fill="none" stroke="#241f30" stroke-width="3" stroke-linecap="round" />
        <path d="M64 52 Q 72 59 80 52" fill="none" stroke="#241f30" stroke-width="3" stroke-linecap="round" />
      </template>
      <g v-else class="ojos">
        <ellipse cx="48" cy="51" rx="7" ry="9" :fill="aspecto.ojos" />
        <ellipse cx="72" cy="51" rx="7" ry="9" :fill="aspecto.ojos" />
        <ellipse cx="48" cy="51" :rx="contento ? 1.8 : 3" ry="8" fill="#1d1826" />
        <ellipse cx="72" cy="51" :rx="contento ? 1.8 : 3" ry="8" fill="#1d1826" />
      </g>

      <!-- morro -->
      <path d="M56 64 L64 64 L60 69 Z" fill="#e08a9a" />
      <path
        :d="contento ? 'M60 69 Q 53 77 47 70 M60 69 Q 67 77 73 70' : 'M60 69 Q 54 74 49 71 M60 69 Q 66 74 71 71'"
        fill="none" stroke="#241f30" stroke-width="2.2" stroke-linecap="round"
      />
      <!-- bigotes -->
      <g stroke="#241f30" stroke-width="1.6" stroke-linecap="round" opacity="0.65">
        <path d="M52 68 L30 64" /><path d="M52 71 L31 73" />
        <path d="M68 68 L90 64" /><path d="M68 71 L89 73" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
/* transform-box: fill-box hace que los orígenes de giro se midan dentro de
   cada grupo y no sobre el lienzo entero, que es lo que hace falta para que la
   cola gire desde su base y no desde una esquina. */
.gato g { transform-box: fill-box; }

.respiracion {
  transform-origin: center bottom;
  animation: respirar 4.4s ease-in-out infinite;
  animation-delay: var(--retardo);
}

.cola {
  transform-origin: left center;
  animation: menear-cola 3.8s ease-in-out infinite;
  animation-delay: var(--retardo);
}
/* Andar es un balanceo corto: no hay patas que animar, así que el paso se
   cuenta con el cuerpo. */
.gato.andando .respiracion { animation: pasitos 0.52s ease-in-out infinite; }
.gato.andando .cola { animation-duration: 1.4s; }

/* Contento menea más y más rápido; triste, casi nada. */
.gato.contento .cola { animation-duration: 2.1s; }
.gato.durmiendo .cola { animation-duration: 7.5s; }
.gato.durmiendo .respiracion { animation-duration: 6.5s; }

.ojos {
  transform-origin: center center;
  animation: parpadear 6.5s ease-in-out infinite;
  animation-delay: var(--retardo);
}

@keyframes pasitos {
  0%, 100% { transform: translateY(0) rotate(-1.2deg); }
  50% { transform: translateY(-3px) rotate(1.2deg); }
}

@media (prefers-reduced-motion: reduce) {
  .respiracion, .cola, .ojos { animation: none; }
}
</style>
