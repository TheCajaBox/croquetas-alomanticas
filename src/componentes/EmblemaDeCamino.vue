<script setup>
import { computed } from 'vue'

/**
 * El emblema de un camino: la figura que lo presenta cuando no hay retrato.
 *
 * Dos de los cuatro caminos tienen ilustración de quien narra -Wayne y Brisa- y
 * dos no. En la portada eso se veía mucho: donde uno enseñaba un retrato de
 * setecientos píxeles de alto, el otro enseñaba un disco con una inicial dentro,
 * y el camino entero parecía provisional. No lo es: Elantris y Sel tienen los
 * mismos mundos, los mismos retos y el mismo cuidado que los otros dos.
 *
 * Así que en vez de esperar a tener ilustraciones, cada camino sin retrato trae
 * su **figura**, que además dice algo del temario y no solo rellena:
 *
 * - **Elantris** es un aon. Un aon es una figura que, trazada bien, hace algo, y
 *   trazada mal no hace nada. Eso es una consulta, y es el hilo del itinerario
 *   entero, así que la portada lo dice sin escribirlo.
 * - **Sel** es un sello, que es de lo que va el camino: algo que se estampa para
 *   certificar que una cosa es de verdad, y que se puede falsificar si nadie lo
 *   mira bien.
 * - Y cualquier camino que llegue sin figura propia sale con un anillo, que no
 *   miente sobre nada.
 *
 * Van dibujadas y no como imagen a propósito: pesan cuatrocientos bytes, toman
 * el color del camino sin tener que exportar una versión por cada uno, y se ven
 * igual de nítidas en un móvil que en una pantalla grande.
 */
const props = defineProps({
  camino: { type: String, required: true },
  color: { type: String, default: 'currentColor' },
  tamano: { type: Number, default: 190 },
})

const lado = computed(() => `${props.tamano}px`)
const cual = computed(() => (['elantris', 'sel'].includes(props.camino) ? props.camino : 'anillo'))
</script>

<template>
  <svg
    class="emblema"
    :class="cual"
    :style="{ width: lado, height: lado, '--tono': color }"
    viewBox="0 0 200 200"
    role="img"
    aria-hidden="true"
  >
    <!-- Elantris: el aon. Cuadrado exterior, la cruz que lo parte y los cuatro
         puntos que lo terminan; sin uno de los trazos no haría nada, que es lo
         que se cuenta en el primer mundo. -->
    <g v-if="cual === 'elantris'" class="trazos">
      <rect x="30" y="30" width="140" height="140" rx="6" />
      <path d="M100 30 V170 M30 100 H170" />
      <circle cx="100" cy="100" r="34" />
      <path d="M62 62 L138 138 M138 62 L62 138" class="tenue" />
      <circle cx="30" cy="30" r="5" class="lleno" />
      <circle cx="170" cy="30" r="5" class="lleno" />
      <circle cx="30" cy="170" r="5" class="lleno" />
      <circle cx="170" cy="170" r="5" class="lleno" />
    </g>

    <!-- Sel: el sello. El disco con el aro, la marca de dentro, y una esquina
         del aro que no cierra: un sello con una grieta sigue pareciendo un
         sello, y de eso va el camino. -->
    <g v-else-if="cual === 'sel'" class="trazos">
      <circle cx="100" cy="100" r="70" />
      <path d="M100 22 A78 78 0 0 1 178 100 A78 78 0 0 1 100 178 A78 78 0 0 1 30 58" />
      <path d="M72 78 H128 M72 100 H112 M72 122 H128" />
      <path d="M60 60 L140 140" class="grieta" />
      <circle cx="100" cy="100" r="5" class="lleno" />
    </g>

    <!-- Y el que no tenga figura propia: un anillo, que no promete nada. -->
    <g v-else class="trazos">
      <circle cx="100" cy="100" r="70" />
      <circle cx="100" cy="100" r="52" class="tenue" />
    </g>
  </svg>
</template>

<style scoped>
.emblema { display: block; overflow: visible; }

.trazos {
  fill: none;
  stroke: var(--tono);
  stroke-width: 2.5;
  stroke-linecap: round;
  /* Bastante para reconocerse, poco para no competir con el texto de al lado:
     el emblema presenta el camino, no lo protagoniza. */
  opacity: 0.5;
}
.trazos .tenue { opacity: 0.4; }
.trazos .lleno { fill: var(--tono); stroke: none; }
/* La grieta del sello va cortada, que es lo que la hace grieta y no un trazo. */
.trazos .grieta { stroke-dasharray: 8 12; opacity: 0.5; }

/* El halo. Detrás de los trazos y del mismo color, para que la figura parezca
   encendida en vez de dibujada encima del panel. */
.emblema {
  filter: drop-shadow(0 0 14px color-mix(in srgb, var(--tono) 26%, transparent));
}
</style>
