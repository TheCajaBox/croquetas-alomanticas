<script setup>
import { computed } from 'vue'

/**
 * Un gato dibujado con SVG y coloreado según su metal. Sin imágenes externas:
 * el juego se publica como sitio estático y así no depende de nada.
 */
const props = defineProps({
  aspecto: { type: Object, required: true },
  animo: { type: String, default: 'normal' }, // contento | normal | triste
  tamano: { type: Number, default: 120 },
})

const durmiendo = computed(() => props.animo === 'triste')
const contento = computed(() => props.animo === 'contento')
</script>

<template>
  <svg :width="tamano" :height="tamano" viewBox="0 0 120 120" role="img" aria-hidden="true">
    <!-- cola -->
    <path
      :d="contento ? 'M92 96 C 116 92, 116 58, 100 54' : 'M92 98 C 114 100, 116 82, 106 74'"
      fill="none" :stroke="aspecto.pelo" stroke-width="9" stroke-linecap="round"
    />
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
    <template v-else>
      <ellipse cx="48" cy="51" rx="7" ry="9" :fill="aspecto.ojos" />
      <ellipse cx="72" cy="51" rx="7" ry="9" :fill="aspecto.ojos" />
      <ellipse cx="48" cy="51" :rx="contento ? 1.8 : 3" ry="8" fill="#1d1826" />
      <ellipse cx="72" cy="51" :rx="contento ? 1.8 : 3" ry="8" fill="#1d1826" />
    </template>

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
  </svg>
</template>
