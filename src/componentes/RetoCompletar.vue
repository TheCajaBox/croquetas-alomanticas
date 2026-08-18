<script setup>
import { computed, ref, watch } from 'vue'

import { barajarConSemilla } from '../motor/barajar.js'

/**
 * Reto de rellenar huecos con fichas.
 *
 * La plantilla trae huecos marcados con ___ y debajo hay un montón de fichas
 * para colocar, con alguna de más para que no salga por descarte. Igual que en
 * el de ordenar, al enviar se ejecuta lo que haya montado el jugador: los
 * huecos mal puestos se ven en los tests, no en un «incorrecto» a secas.
 */
const props = defineProps({
  reto: { type: Object, required: true },
  contestado: { type: Boolean, default: false },
})
const emit = defineEmits(['montar'])

const HUECO = '___'

const trozos = computed(() => props.reto.plantilla.split(HUECO))
const cuantosHuecos = computed(() => trozos.value.length - 1)

const puestas = ref([])
const fichaElegida = ref(null)

watch(
  () => props.reto.id,
  () => {
    puestas.value = Array.from({ length: cuantosHuecos.value }, () => null)
    fichaElegida.value = null
  },
  { immediate: true },
)

const fichas = computed(() => barajarConSemilla(props.reto.fichas, props.reto.id))
const usadas = computed(() => puestas.value.filter((f) => f !== null))
const completo = computed(() => puestas.value.every((f) => f !== null))

const codigoMontado = computed(() =>
  trozos.value.reduce(
    (texto, trozo, indice) => texto + trozo + (indice < cuantosHuecos.value ? (puestas.value[indice] ?? HUECO) : ''),
    '',
  ),
)

function ponerEn(hueco) {
  if (props.contestado) return
  if (puestas.value[hueco] !== null) {
    // Volver a pulsar un hueco lleno lo vacía: así se corrige sin empezar de cero.
    puestas.value = puestas.value.map((f, i) => (i === hueco ? null : f))
    return
  }
  if (fichaElegida.value === null) return
  puestas.value = puestas.value.map((f, i) => (i === hueco ? fichaElegida.value : f))
  fichaElegida.value = null
}
</script>

<template>
  <section class="completar">
    <div class="panel instrucciones">
      <p>Elige una ficha y pulsa el hueco donde va. Para sacarla, pulsa el hueco otra vez.</p>
      <p class="tenue aviso">Sobran fichas, y una misma ficha puede valer para más de un hueco.</p>
    </div>

    <pre class="plantilla panel"><template v-for="(trozo, indice) in trozos" :key="indice"><span class="texto">{{ trozo }}</span><button
        v-if="indice < cuantosHuecos"
        class="hueco"
        :class="{ lleno: puestas[indice] !== null, listo: fichaElegida !== null && puestas[indice] === null }"
        :disabled="contestado"
        @click="ponerEn(indice)"
      >{{ puestas[indice] ?? '␣␣␣' }}</button></template></pre>

    <div class="fichero">
      <button
        v-for="(ficha, indice) in fichas"
        :key="`${ficha}-${indice}`"
        class="ficha"
        :class="{ elegida: fichaElegida === ficha, gastada: usadas.includes(ficha) }"
        :disabled="contestado"
        @click="fichaElegida = fichaElegida === ficha ? null : ficha"
      >
        {{ ficha }}
      </button>
    </div>

    <button class="principal" :disabled="!completo || contestado" @click="emit('montar', codigoMontado)">
      {{ completo ? 'Ejecutar' : 'Rellena todos los huecos' }}
    </button>
  </section>
</template>

<style scoped>
.completar { display: flex; flex-direction: column; gap: 14px; }
.instrucciones p { margin: 0; }
.aviso { margin-top: 5px; font-size: 0.85rem; }

.plantilla {
  margin: 0;
  white-space: pre-wrap;
  line-height: 2.1;
  font-size: 0.9rem;
  background: #16131f;
}
.plantilla .texto { color: var(--texto); }

.hueco {
  font-family: var(--mono);
  font-size: 0.86rem;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px dashed var(--borde);
  background: #1d1826;
  color: var(--texto-apagado);
  vertical-align: baseline;
}
.hueco.listo { border-color: var(--cobre); color: var(--cobre-claro); }
.hueco.lleno {
  border-style: solid;
  border-color: var(--cobre);
  background: rgba(201, 139, 75, 0.14);
  color: var(--cobre-claro);
  font-weight: 600;
}

.fichero { display: flex; flex-wrap: wrap; gap: 8px; }
.ficha { font-family: var(--mono); font-size: 0.85rem; padding: 7px 13px; }
.ficha.elegida { border-color: var(--cobre); background: rgba(201, 139, 75, 0.18); color: var(--cobre-claro); }
/* Puesta en algún hueco, pero se puede volver a usar en otro. */
.ficha.gastada { opacity: 0.6; border-style: dashed; }
</style>
