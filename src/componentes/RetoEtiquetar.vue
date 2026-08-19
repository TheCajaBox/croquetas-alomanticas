<script setup>
import { computed, ref, watch } from 'vue'

import Marcado from './Marcado.vue'
import { barajarConSemilla } from '../motor/barajar.js'

/**
 * Reto de ponerle nombre a las partes del código.
 *
 * Se enseña un fragmento troceado; algunos trozos se pueden pulsar y hay que
 * decir qué son: cuál es el parámetro, cuál el argumento, cuál el cuerpo, cuál
 * la llamada. Nada que escribir, y aun así es de los que más enseñan.
 *
 * El motivo es que el vocabulario se aprende reconociéndolo, no memorizando la
 * definición. Quien no sabe distinguir un parámetro de un argumento no puede
 * leer un mensaje de error que hable de ellos, ni buscar en internet lo que le
 * pasa, ni entender el enunciado del reto siguiente. Es el suelo de todo lo
 * demás y normalmente se da por sabido.
 *
 * Las etiquetas vienen con señuelos, para que no salga por descarte.
 */
const props = defineProps({
  reto: { type: Object, required: true },
  contestado: { type: Boolean, default: false },
})
const emit = defineEmits(['responder'])

/** Los índices de los trozos que hay que nombrar. Los demás son decorado. */
const marcables = computed(() =>
  props.reto.fragmentos
    .map((fragmento, indice) => (fragmento.etiqueta ? indice : null))
    .filter((i) => i !== null),
)

/** Lo puesto por el jugador, indexado por el índice del fragmento. */
const puestas = ref({})
const etiquetaElegida = ref(null)

watch(
  () => props.reto.id,
  () => {
    puestas.value = {}
    etiquetaElegida.value = null
  },
  { immediate: true },
)

const etiquetas = computed(() => barajarConSemilla(props.reto.etiquetas, props.reto.id))
const completo = computed(() => marcables.value.every((i) => puestas.value[i]))

const acertadaEn = (indice) => puestas.value[indice] === props.reto.fragmentos[indice].etiqueta

function ponerEn(indice) {
  if (props.contestado || !props.reto.fragmentos[indice].etiqueta) return
  if (puestas.value[indice]) {
    // Volver a pulsar uno ya puesto lo vacía, como en el de rellenar huecos.
    const { [indice]: _, ...resto } = puestas.value
    puestas.value = resto
    return
  }
  if (!etiquetaElegida.value) return
  puestas.value = { ...puestas.value, [indice]: etiquetaElegida.value }
  etiquetaElegida.value = null
}

function responder() {
  emit('responder', marcables.value.every(acertadaEn))
}
</script>

<template>
  <section class="etiquetar">
    <div class="panel instrucciones">
      <p>Elige un nombre de abajo y pulsa el trozo de código al que le corresponde.</p>
      <p class="tenue aviso">Sobran nombres. Para quitar uno puesto, pulsa el trozo otra vez.</p>
    </div>

    <pre class="fragmento panel"><template
      v-for="(trozo, indice) in reto.fragmentos"
      :key="indice"
    ><button
        v-if="trozo.etiqueta"
        class="marcable"
        :class="{
          puesta: !!puestas[indice],
          listo: !!etiquetaElegida && !puestas[indice],
          acierto: contestado && acertadaEn(indice),
          fallo: contestado && !acertadaEn(indice),
        }"
        :disabled="contestado"
        :aria-label="`Trozo ${trozo.texto}`"
        @click="ponerEn(indice)"
      >{{ trozo.texto }}<span v-if="puestas[indice]" class="etiqueta-puesta">{{ puestas[indice] }}</span></button><span
        v-else
        class="texto"
      >{{ trozo.texto }}</span></template></pre>

    <div class="etiquetero">
      <button
        v-for="etiqueta in etiquetas"
        :key="etiqueta"
        class="etiqueta"
        :class="{ elegida: etiquetaElegida === etiqueta }"
        :disabled="contestado"
        @click="etiquetaElegida = etiquetaElegida === etiqueta ? null : etiqueta"
      >
        {{ etiqueta }}
      </button>
    </div>

    <button v-if="!contestado" class="principal" :disabled="!completo" @click="responder">
      {{ completo ? 'Comprobar' : 'Te queda alguno por nombrar' }}
    </button>

    <section v-if="contestado" class="panel repaso">
      <h3>Cómo se llama cada cosa</h3>
      <ul>
        <li v-for="indice in marcables" :key="indice" :class="{ mal: !acertadaEn(indice) }">
          <code>{{ reto.fragmentos[indice].texto }}</code>
          <span class="flecha" aria-hidden="true">→</span>
          <strong>{{ reto.fragmentos[indice].etiqueta }}</strong>
        </li>
      </ul>
      <Marcado v-if="reto.porque" class="porque" :texto="reto.porque" />
    </section>
  </section>
</template>

<style scoped>
.etiquetar { display: flex; flex-direction: column; gap: 14px; }
.instrucciones p { margin: 0; }
.aviso { margin-top: 5px; font-size: 0.85rem; }

.fragmento {
  font-family: var(--mono);
  font-size: 0.9rem;
  line-height: 2.1;
  white-space: pre-wrap;
  overflow-x: auto;
}
.texto { color: var(--texto); }

.marcable {
  padding: 1px 6px;
  border-radius: 5px;
  border: 1px dashed var(--borde);
  background: var(--fondo-alto);
  font-family: var(--mono);
  font-size: 0.9rem;
  color: var(--texto);
  transition: border-color 0.15s, background 0.15s;
}
.marcable:hover:not(:disabled) { border-color: var(--cobre); }
.marcable.listo { border-color: var(--cobre); background: rgba(201, 139, 75, 0.08); }
.marcable.puesta { border-style: solid; border-color: var(--cobre); }
.marcable.acierto { border-color: var(--verde); background: rgba(95, 185, 138, 0.10); }
.marcable.fallo { border-color: var(--rojo); background: rgba(224, 122, 114, 0.10); }
.marcable:disabled { cursor: default; }

.etiqueta-puesta {
  margin-left: 7px;
  padding: 0 5px;
  border-radius: 4px;
  background: rgba(201, 139, 75, 0.18);
  font-size: 0.74rem;
  color: var(--cobre-claro);
}
.marcable.acierto .etiqueta-puesta { background: rgba(95, 185, 138, 0.18); color: var(--verde); }
.marcable.fallo .etiqueta-puesta { background: rgba(224, 122, 114, 0.18); color: var(--rojo); }

.etiquetero { display: flex; flex-wrap: wrap; gap: 8px; }
.etiqueta { padding: 5px 11px; font-size: 0.83rem; border-radius: 7px; color: var(--texto-tenue); }
.etiqueta:hover:not(:disabled) { color: var(--texto); }
.etiqueta.elegida { border-color: var(--cobre); color: var(--cobre-claro); background: rgba(201, 139, 75, 0.12); }

.repaso ul { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.repaso li { display: flex; gap: 9px; align-items: baseline; font-size: 0.88rem; }
.repaso li.mal code { color: var(--rojo); }
.repaso .flecha { color: var(--texto-apagado); }
.repaso strong { color: var(--cobre-claro); font-weight: 600; }
.porque { margin-top: 12px; font-size: 0.88rem; color: var(--texto-tenue); }
.porque :deep(p) { margin: 0; }
</style>
