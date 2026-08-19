<script setup>
import { computed, onBeforeUnmount, onMounted, shallowRef, triggerRef, watch } from 'vue'

import GatoSvg from './GatoSvg.vue'
import { avanzar, escalaEn, nuevoPaseante } from '../motor/paseo.js'

/**
 * La casa y el jardín donde viven los gatos.
 *
 * Todo el decorado es SVG dibujado a mano: el juego se publica como sitio
 * estático y no depende de ninguna imagen. El paseo lo lleva `motor/paseo.js`;
 * aquí solo se pinta y se pasa el tiempo.
 *
 * Los gatos se ordenan por su `y` antes de pintarlos, que es lo único que hace
 * falta para que el que está delante tape al que está detrás.
 */
const props = defineProps({
  gatos: { type: Array, required: true },
})
const emit = defineEmits(['elegir'])

const paseantes = shallowRef([])

const animoDe = (gato) => (gato.felicidad >= 60 ? 'contento' : gato.felicidad >= 30 ? 'normal' : 'triste')

/** Se sincroniza con la colonia: uno que llega entra andando, uno que no está se va. */
watch(
  () => props.gatos.map((g) => g.id).join(','),
  () => {
    const vivos = new Map(paseantes.value.map((p) => [p.gatoId, p]))
    paseantes.value = props.gatos.map(
      (gato, indice) => vivos.get(gato.id) ?? nuevoPaseante(gato.id, indice),
    )
  },
  { immediate: true },
)

/** Pintados de atrás hacia delante. */
const enOrden = computed(() => {
  const porId = new Map(props.gatos.map((g) => [g.id, g]))
  return [...paseantes.value]
    .map((paseante) => ({ paseante, gato: porId.get(paseante.gatoId) }))
    .filter((cada) => cada.gato)
    .sort((uno, otro) => uno.paseante.y - otro.paseante.y)
})

// ---------------------------------------------------------------------------
// El tiempo
// ---------------------------------------------------------------------------

const quieto =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

let fotograma = null
let anterior = 0

function latido(ahora) {
  const segundos = Math.min(0.05, (ahora - anterior) / 1000)
  anterior = ahora

  const tristes = new Map(props.gatos.map((g) => [g.id, g.felicidad < 30]))
  for (const paseante of paseantes.value) {
    avanzar(paseante, segundos, Math.random, { triste: tristes.get(paseante.gatoId) })
  }
  // Los paseantes son objetos planos a propósito: en vez de que Vue vigile diez
  // gatos campo a campo sesenta veces por segundo, se le avisa una vez.
  triggerRef(paseantes)
  fotograma = requestAnimationFrame(latido)
}

function arrancar() {
  if (quieto || fotograma !== null) return
  anterior = performance.now()
  fotograma = requestAnimationFrame(latido)
}

function parar() {
  if (fotograma !== null) cancelAnimationFrame(fotograma)
  fotograma = null
}

/** Con la pestaña de fondo no hay nadie mirando: no se gasta batería en pasear. */
function alCambiarVisibilidad() {
  if (document.visibilityState === 'hidden') parar()
  else arrancar()
}

onMounted(() => {
  arrancar()
  document.addEventListener('visibilitychange', alCambiarVisibilidad)
})

onBeforeUnmount(() => {
  parar()
  document.removeEventListener('visibilitychange', alCambiarVisibilidad)
})

const LO_QUE_HACE = {
  andando: 'paseando',
  durmiendo: 'durmiendo',
  comiendo: 'en el cuenco',
  jugando: 'jugando',
  sentado: 'sentado',
  quieto: 'a lo suyo',
}
</script>

<template>
  <div class="escena">
    <svg viewBox="0 0 1000 560" class="lienzo" role="img" aria-label="La casa y el jardín de la colonia">
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1b1830" />
          <stop offset="100%" stop-color="#2b2745" />
        </linearGradient>
        <linearGradient id="pared" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3b3152" />
          <stop offset="100%" stop-color="#2e2742" />
        </linearGradient>
        <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4b3a2c" />
          <stop offset="100%" stop-color="#5d4835" />
        </linearGradient>
        <linearGradient id="hierba" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#243c2e" />
          <stop offset="100%" stop-color="#2f4c39" />
        </linearGradient>
        <radialGradient id="lampara" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#e8b978" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#e8b978" stop-opacity="0" />
        </radialGradient>
        <clipPath id="hueco">
          <rect x="514" y="242" width="85" height="318" />
        </clipPath>
        <radialGradient id="luna" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#e9e3f5" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#e9e3f5" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- noche y bruma -->
      <rect width="1000" height="560" fill="url(#cielo)" />
      <circle cx="892" cy="96" r="68" fill="url(#luna)" />
      <circle cx="892" cy="96" r="21" fill="#efe9fa" opacity="0.8" />
      <g class="bruma" fill="#8f86b5" opacity="0.13">
        <ellipse cx="700" cy="300" rx="180" ry="26" />
        <ellipse cx="900" cy="336" rx="150" ry="20" />
      </g>

      <!-- ================= el jardín ================= -->
      <rect x="600" y="348" width="400" height="212" fill="url(#hierba)" />
      <!-- valla -->
      <g class="valla">
        <rect x="636" y="300" width="364" height="9" fill="#4a3d30" />
        <rect x="636" y="330" width="364" height="9" fill="#4a3d30" />
        <rect
          v-for="x in 15"
          :key="`tabla-${x}`"
          :x="634 + (x - 1) * 25"
          y="272"
          width="15"
          height="78"
          rx="3"
          fill="#564636"
        />
      </g>
      <!-- árbol -->
      <g class="arbol">
        <rect x="912" y="300" width="22" height="112" rx="6" fill="#4b3a2c" />
        <circle cx="923" cy="268" r="58" fill="#2f4d3a" />
        <circle cx="880" cy="290" r="40" fill="#35563f" />
        <circle cx="962" cy="292" r="38" fill="#294434" />
      </g>
      <!-- arbustos y macetas -->
      <ellipse cx="640" cy="392" rx="34" ry="24" fill="#2c4837" />
      <ellipse cx="632" cy="382" rx="20" ry="15" fill="#33553f" />
      <g class="flores" fill="#c98b4b">
        <circle cx="626" cy="374" r="4" /><circle cx="646" cy="382" r="3.5" />
        <circle cx="957" cy="418" r="4" /><circle cx="972" cy="428" r="3.5" />
      </g>
      <ellipse cx="965" cy="432" rx="26" ry="18" fill="#2c4837" />
      <!-- charca -->
      <ellipse cx="800" cy="492" rx="62" ry="24" fill="#2a4159" />
      <ellipse cx="800" cy="489" rx="52" ry="17" fill="#33506d" />
      <path d="M772 486 Q 800 478 828 486" fill="none" stroke="#7fa6c4" stroke-width="2" opacity="0.5" />
      <!-- losas del camino -->
      <g fill="#4a4257" opacity="0.85">
        <ellipse cx="612" cy="470" rx="26" ry="11" />
        <ellipse cx="668" cy="452" rx="24" ry="10" />
        <ellipse cx="722" cy="438" rx="22" ry="9" />
      </g>

      <!-- ================= la casa ================= -->
      <!-- tejado -->
      <polygon points="20,152 320,44 620,152" fill="#3a2f42" />
      <polygon points="20,152 320,44 320,58 44,158" fill="#4a3d56" opacity="0.6" />
      <rect x="470" y="70" width="34" height="60" fill="#4a3d56" />
      <rect x="464" y="62" width="46" height="12" rx="3" fill="#564769" />

      <!-- pared del fondo y suelo -->
      <rect x="52" y="150" width="446" height="200" fill="url(#pared)" />
      <g opacity="0.14" fill="#e6dcff">
        <rect v-for="x in 11" :key="`raya-${x}`" :x="60 + (x - 1) * 40" y="150" width="9" height="200" />
      </g>
      <rect x="52" y="348" width="563" height="212" fill="url(#suelo)" />
      <g stroke="#3d2f24" stroke-width="2" opacity="0.5">
        <line v-for="y in 4" :key="`tabla-suelo-${y}`" x1="52" :y1="368 + (y - 1) * 46" x2="615" :y2="368 + (y - 1) * 46" />
      </g>
      <!-- rodapié -->
      <rect x="52" y="342" width="446" height="10" fill="#463a2c" />

      <!-- la puerta al jardín: jambas a los lados y dintel arriba -->
      <rect x="498" y="150" width="117" height="86" fill="url(#pared)" />
      <rect x="498" y="236" width="16" height="324" fill="#463a2c" />
      <rect x="599" y="236" width="16" height="324" fill="#463a2c" />
      <rect x="498" y="228" width="117" height="14" rx="4" fill="#514231" />
      <!-- lo que se ve por el hueco: el jardín de noche, un punto más oscuro -->
      <rect x="514" y="242" width="85" height="128" fill="#20203a" />
      <rect x="514" y="370" width="85" height="190" fill="#22392c" />
      <g clip-path="url(#hueco)">
        <rect x="530" y="286" width="13" height="70" rx="3" fill="#3f3327" />
        <rect x="566" y="286" width="13" height="70" rx="3" fill="#3f3327" />
        <ellipse cx="556" cy="330" rx="60" ry="14" fill="#8f86b5" opacity="0.12" />
      </g>
      <rect x="510" y="356" width="93" height="12" rx="4" fill="#5b4a37" />
      <!-- la luz de casa cayendo sobre el camino -->
      <polygon points="514,360 599,360 660,560 460,560" fill="#e8b978" opacity="0.07" />

      <!-- ventana -->
      <g class="ventana">
        <rect x="392" y="168" width="92" height="104" rx="4" fill="#2b3a54" />
        <rect x="392" y="168" width="92" height="104" rx="4" fill="none" stroke="#5a4a38" stroke-width="7" />
        <line x1="438" y1="168" x2="438" y2="272" stroke="#5a4a38" stroke-width="5" />
        <line x1="392" y1="220" x2="484" y2="220" stroke="#5a4a38" stroke-width="5" />
        <circle cx="464" cy="192" r="9" fill="#efe9fa" opacity="0.45" />
      </g>

      <!-- lámpara -->
      <g class="lampara">
        <line x1="176" y1="150" x2="176" y2="196" stroke="#4a4257" stroke-width="3" />
        <path d="M148 224 L176 196 L204 224 Z" fill="#8a6f4a" />
        <ellipse cx="176" cy="226" rx="28" ry="6" fill="#e8b978" opacity="0.85" />
        <ellipse cx="176" cy="300" rx="130" ry="110" fill="url(#lampara)" />
      </g>

      <!-- estantería -->
      <g class="estanteria">
        <rect x="318" y="270" width="86" height="80" rx="3" fill="#3f3226" />
        <rect x="322" y="296" width="78" height="5" fill="#544234" />
        <g fill="#8a5a4a">
          <rect x="326" y="274" width="9" height="21" rx="2" />
          <rect x="337" y="277" width="8" height="18" rx="2" fill="#6f7fa0" />
          <rect x="347" y="273" width="10" height="22" rx="2" fill="#7d6a9c" />
          <rect x="328" y="303" width="9" height="19" rx="2" fill="#7a8f6a" />
          <rect x="339" y="301" width="8" height="21" rx="2" />
        </g>
      </g>

      <!-- sofá -->
      <g class="sofa">
        <rect x="96" y="318" width="150" height="52" rx="12" fill="#4e3d5e" />
        <rect x="96" y="352" width="150" height="46" rx="12" fill="#5d4970" />
        <rect x="88" y="340" width="26" height="62" rx="11" fill="#674f7d" />
        <rect x="228" y="340" width="26" height="62" rx="11" fill="#674f7d" />
        <rect x="120" y="344" width="46" height="20" rx="7" fill="#7b5f8f" opacity="0.8" />
        <rect x="176" y="344" width="46" height="20" rx="7" fill="#7b5f8f" opacity="0.8" />
      </g>

      <!-- alfombra y cuenco -->
      <ellipse cx="305" cy="462" rx="96" ry="34" fill="#7a4a3a" opacity="0.75" />
      <ellipse cx="305" cy="462" rx="66" ry="22" fill="none" stroke="#a5674c" stroke-width="4" opacity="0.6" />
      <g class="cuenco">
        <ellipse cx="216" cy="470" rx="22" ry="9" fill="#8a6f4a" />
        <ellipse cx="216" cy="467" rx="16" ry="6" fill="#c98b4b" />
      </g>

      <!-- ================= los gatos ================= -->
      <g
        v-for="{ paseante, gato } in enOrden"
        :key="paseante.gatoId"
        class="paseante"
        role="button"
        tabindex="0"
        :aria-label="`${gato.nombre}, ${LO_QUE_HACE[paseante.pose] ?? 'por ahí'}`"
        :transform="`translate(${paseante.x.toFixed(1)} ${paseante.y.toFixed(1)})`"
        @click="emit('elegir', gato)"
        @keydown.enter.prevent="emit('elegir', gato)"
        @keydown.space.prevent="emit('elegir', gato)"
      >
        <!-- Área de pulsación: el gato dibujado se queda pequeño en un móvil y
             el dedo no acierta. Esto no se ve, pero se toca. -->
        <circle class="agarre" cx="0" cy="-30" r="46" />
        <ellipse class="sombra" cx="0" cy="2" :rx="42 * escalaEn(paseante.y)" :ry="11 * escalaEn(paseante.y)" />
        <g :transform="`scale(${(paseante.mirando * escalaEn(paseante.y)).toFixed(3)} ${escalaEn(paseante.y).toFixed(3)})`">
          <g transform="translate(-60 -116)">
            <GatoSvg
              :aspecto="gato.aspecto"
              :animo="animoDe(gato)"
              :pose="paseante.pose"
              :tamano="120"
            />
          </g>
          <text v-if="paseante.pose === 'durmiendo'" class="zzz" x="34" y="-24">z</text>
        </g>
        <text class="nombre" y="26" text-anchor="middle">{{ gato.nombre }}</text>
      </g>

      <!-- primer plano: lo que tapa a los gatos y da profundidad -->
      <ellipse cx="676" cy="548" rx="58" ry="30" fill="#22392c" />
      <ellipse cx="654" cy="536" rx="30" ry="20" fill="#2a4535" />
    </svg>

    <p v-if="gatos.length === 0" class="tenue vacia">
      La casa está vacía. Supera retos y se irá llenando sola.
    </p>
  </div>
</template>

<style scoped>
.escena { position: relative; }

.lienzo {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--radio);
  border: 1px solid var(--borde-suave);
  background: #14121a;
  touch-action: manipulation;
}

.paseante { cursor: pointer; }
.paseante .agarre { fill: transparent; }
.paseante .sombra { fill: #000; opacity: 0.28; }
.paseante .nombre {
  font-size: 15px;
  fill: var(--texto-tenue);
  opacity: 0;
  transition: opacity 0.18s;
  pointer-events: none;
}
.paseante:hover .nombre, .paseante:focus-visible .nombre { opacity: 1; }
.paseante:focus-visible { outline: 2px solid var(--cobre-claro); outline-offset: 4px; border-radius: 8px; }
.paseante:hover .sombra { opacity: 0.4; }

.zzz {
  font-size: 22px;
  fill: #cdc4e6;
  animation: dormitar 3.4s ease-in-out infinite;
}

.bruma ellipse { animation: vagar 24s ease-in-out infinite alternate; }
.bruma ellipse:nth-child(2) { animation-duration: 31s; }

@keyframes dormitar {
  0% { opacity: 0; transform: translate(0, 0) scale(0.7); }
  35% { opacity: 0.9; }
  100% { opacity: 0; transform: translate(10px, -22px) scale(1.1); }
}

@keyframes vagar {
  from { transform: translateX(-26px); }
  to { transform: translateX(26px); }
}

.vacia { margin: 10px 0 0; text-align: center; font-size: 0.9rem; }

/* En un móvil la escena entera cabría, pero los gatos saldrían del tamaño de
   una uña y no habría manera de darles. Se deja a un tamaño decente y se
   arrastra de lado para ver el resto de la casa. */
@media (max-width: 700px) {
  .escena { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .lienzo { width: 760px; max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  .zzz, .bruma ellipse { animation: none; }
}
</style>
