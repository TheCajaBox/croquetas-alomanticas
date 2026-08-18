<script setup>
/**
 * Wayne.
 *
 * Sombrero verde de ala ancha, sonrisa de oreja a oreja, el pelo asomando por
 * debajo y el bastón de duelos al hombro. Cambia de cara según lo que esté
 * diciendo, porque un narrador que pone siempre la misma cara deja de contar
 * cosas y empieza a ser un icono.
 */
defineProps({
  /** guasa | orgullo | sorpresa | fastidio */
  animo: { type: String, default: 'guasa' },
  tamano: { type: Number, default: 64 },
})

const PIEL = '#c68a5c'
const PIEL_SOMBRA = '#a86f45'
const PELO = '#4a3423'
const SOMBRERO = '#4e5340'
const SOMBRERO_LUZ = '#5c6249'
const SOMBRERO_CINTA = '#3a3e2e'
const CAMISA = '#c9d4e6'
const TRAZO = '#241f2e'
</script>

<template>
  <svg
    :width="tamano"
    :height="tamano * 1.15"
    viewBox="0 0 120 138"
    class="wayne"
    :class="`animo-${animo}`"
    role="img"
    aria-label="Wayne"
  >
    <!-- el bastón, asomando por detrás del hombro -->
    <path d="M96 12 L70 132" :stroke="'#b9a382'" stroke-width="7" stroke-linecap="round" opacity="0.95" />

    <!-- hombros y camisa -->
    <path d="M18 138 Q 22 112 46 104 L74 104 Q 98 112 102 138 Z" :fill="CAMISA" />
    <path d="M46 104 L60 122 L74 104 L66 100 L54 100 Z" fill="#eef2f8" />
    <!-- la correa de la bolsa -->
    <path d="M40 138 L78 104 L86 110 L50 138 Z" fill="#2c2a33" opacity="0.9" />

    <!-- cuello -->
    <path d="M50 84 L50 104 Q 60 112 70 104 L70 84 Z" :fill="PIEL_SOMBRA" />

    <!-- orejas -->
    <ellipse cx="30" cy="66" rx="6" ry="9" :fill="PIEL" />
    <ellipse cx="90" cy="66" rx="6" ry="9" :fill="PIEL" />

    <!-- pelo por detrás -->
    <path d="M28 44 Q 26 74 34 86 L38 60 Z" :fill="PELO" />
    <path d="M92 44 Q 94 76 84 88 L82 60 Z" :fill="PELO" />

    <!-- cara -->
    <ellipse cx="60" cy="62" rx="28" ry="32" :fill="PIEL" />
    <path d="M33 44 Q 60 56 87 44 L87 40 Q 60 48 33 40 Z" :fill="PIEL_SOMBRA" opacity="0.45" />

    <!-- mechones asomando por debajo del ala -->
    <path d="M33 48 Q 40 40 50 42 L44 54 Z" :fill="PELO" />
    <path d="M87 48 Q 80 40 70 42 L76 54 Z" :fill="PELO" />

    <!-- cejas: la izquierda siempre un poco más alta, que por algo es Wayne -->
    <g :stroke="PELO" stroke-width="3.4" stroke-linecap="round" fill="none">
      <path class="ceja-izq" d="M42 46 Q 50 41 57 45" />
      <path class="ceja-der" d="M64 45 Q 71 41 78 46" />
    </g>

    <!-- ojos -->
    <g class="ojos">
      <template v-if="animo === 'orgullo'">
        <path d="M43 58 Q 50 51 57 58" fill="none" :stroke="TRAZO" stroke-width="3" stroke-linecap="round" />
        <path d="M64 58 Q 71 51 78 58" fill="none" :stroke="TRAZO" stroke-width="3" stroke-linecap="round" />
      </template>
      <template v-else-if="animo === 'fastidio'">
        <path d="M43 57 L57 57" :stroke="TRAZO" stroke-width="3" stroke-linecap="round" />
        <path d="M64 57 L78 57" :stroke="TRAZO" stroke-width="3" stroke-linecap="round" />
      </template>
      <template v-else>
        <ellipse cx="50" cy="57" :rx="animo === 'sorpresa' ? 6.5 : 6" :ry="animo === 'sorpresa' ? 8 : 5.6" fill="#fbf8f2" />
        <ellipse cx="71" cy="57" :rx="animo === 'sorpresa' ? 6.5 : 6" :ry="animo === 'sorpresa' ? 8 : 5.6" fill="#fbf8f2" />
        <!-- mira de lado: está pensando algo y no es bueno -->
        <circle :cx="animo === 'sorpresa' ? 50 : 52" cy="57" :r="animo === 'sorpresa' ? 3 : 3.6" fill="#5a3c22" />
        <circle :cx="animo === 'sorpresa' ? 71 : 73" cy="57" :r="animo === 'sorpresa' ? 3 : 3.6" fill="#5a3c22" />
        <circle :cx="animo === 'sorpresa' ? 50 : 52" cy="57" r="1.5" :fill="TRAZO" />
        <circle :cx="animo === 'sorpresa' ? 71 : 73" cy="57" r="1.5" :fill="TRAZO" />
        <!-- párpado superior: sin él la mirada sale demasiado abierta y pierde la guasa -->
        <path v-if="animo !== 'sorpresa'" d="M44 54 Q 50 51 56 54" fill="none" :stroke="TRAZO" stroke-width="2" stroke-linecap="round" />
        <path v-if="animo !== 'sorpresa'" d="M65 54 Q 71 51 77 54" fill="none" :stroke="TRAZO" stroke-width="2" stroke-linecap="round" />
      </template>
    </g>

    <!-- nariz -->
    <path d="M59 63 Q 55 71 61 72" fill="none" :stroke="PIEL_SOMBRA" stroke-width="2.6" stroke-linecap="round" />

    <!-- boca -->
    <template v-if="animo === 'sorpresa'">
      <ellipse cx="60" cy="80" rx="6" ry="7.5" :fill="TRAZO" />
      <ellipse cx="60" cy="83" rx="4" ry="4" fill="#c96f7d" />
    </template>
    <template v-else-if="animo === 'fastidio'">
      <path d="M48 80 Q 55 84 60 80 Q 65 76 72 80" fill="none" :stroke="TRAZO" stroke-width="2.8" stroke-linecap="round" />
    </template>
    <template v-else>
      <!-- la sonrisa de oreja a oreja, que es media firma del personaje -->
      <path d="M43 74 Q 60 70 78 74 Q 74 92 60 93 Q 46 92 43 74 Z" :fill="TRAZO" />
      <path d="M45 75 Q 60 72 76 75 Q 74 80 60 80 Q 46 80 45 75 Z" fill="#fbf8f2" />
      <path d="M53 88 Q 60 91 68 88 Q 62 85 53 88 Z" fill="#c96f7d" />
    </template>

    <!-- el sombrero: ala ancha, copa alta y cinta -->
    <ellipse cx="60" cy="40" rx="52" ry="13" :fill="SOMBRERO" />
    <ellipse cx="60" cy="38" rx="52" ry="12" :fill="SOMBRERO_LUZ" />
    <path d="M32 40 Q 30 8 60 6 Q 90 8 88 40 Z" :fill="SOMBRERO_LUZ" />
    <path d="M60 6 Q 90 8 88 40 L74 40 Q 78 10 60 6 Z" :fill="SOMBRERO" opacity="0.55" />
    <path d="M31 34 Q 60 42 89 34 L89 41 Q 60 49 31 41 Z" :fill="SOMBRERO_CINTA" />
  </svg>
</template>

<style scoped>
.wayne { display: block; overflow: visible; }

/* La ceja se le levanta sola cuando está de guasa. */
.animo-guasa .ceja-izq { transform: translateY(-2px) rotate(-4deg); transform-origin: 50px 46px; }

@media (prefers-reduced-motion: no-preference) {
  .animo-guasa .ojos { animation: parpadear 7.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
}
</style>
