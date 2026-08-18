<script setup>
import { computed, ref } from 'vue'

import Marcado from './Marcado.vue'

/**
 * Reto de elegir la respuesta. El más suave de todos: no hay que escribir nada,
 * solo pensar y señalar.
 *
 * Al contestar se enseña el porqué de TODAS las opciones, no solo el de la que
 * has marcado: la mitad de lo que se aprende aquí está en entender por qué las
 * otras estaban mal.
 */
const props = defineProps({
  reto: { type: Object, required: true },
  contestado: { type: Boolean, default: false },
})
const emit = defineEmits(['responder'])

const elegidas = ref([])
const multiple = computed(() => props.reto.opciones.filter((o) => o.correcta).length > 1)

function marcar(indice) {
  if (props.contestado) return
  if (!multiple.value) {
    elegidas.value = [indice]
    return
  }
  elegidas.value = elegidas.value.includes(indice)
    ? elegidas.value.filter((i) => i !== indice)
    : [...elegidas.value, indice]
}

function responder() {
  const correctas = props.reto.opciones
    .map((opcion, indice) => (opcion.correcta ? indice : null))
    .filter((i) => i !== null)
  const acertado =
    elegidas.value.length === correctas.length &&
    correctas.every((i) => elegidas.value.includes(i))
  emit('responder', acertado)
}
</script>

<template>
  <section class="eleccion">
    <div class="panel pregunta">
      <Marcado :texto="reto.pregunta" />
      <p v-if="multiple" class="tenue aviso">Hay más de una correcta.</p>
    </div>

    <ul class="opciones">
      <li v-for="(opcion, indice) in reto.opciones" :key="indice">
        <button
          class="opcion panel"
          :class="{
            marcada: elegidas.includes(indice),
            acierto: contestado && opcion.correcta,
            fallo: contestado && !opcion.correcta && elegidas.includes(indice),
          }"
          :disabled="contestado"
          @click="marcar(indice)"
        >
          <span class="casilla" aria-hidden="true">
            {{ contestado && opcion.correcta ? '✓' : elegidas.includes(indice) ? '●' : '' }}
          </span>
          <span class="cuerpo">
            <Marcado class="texto" :texto="opcion.texto" />
            <Marcado v-if="contestado" class="porque" :texto="opcion.porque" />
          </span>
        </button>
      </li>
    </ul>

    <button v-if="!contestado" class="principal" :disabled="!elegidas.length" @click="responder">
      Responder
    </button>
  </section>
</template>

<style scoped>
.eleccion { display: flex; flex-direction: column; gap: 14px; }
.pregunta { font-size: 1rem; }
.aviso { margin: 6px 0 0; font-size: 0.85rem; }

.opciones { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.opcion {
  display: flex;
  gap: 12px;
  width: 100%;
  text-align: left;
  align-items: flex-start;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
}
.opcion:hover:not(:disabled) { transform: translateX(3px); }
.opcion.marcada { border-color: var(--cobre); background: rgba(201, 139, 75, 0.10); }
.opcion.acierto { border-color: var(--verde); background: rgba(95, 185, 138, 0.10); }
.opcion.fallo { border-color: var(--rojo); background: rgba(224, 122, 114, 0.10); }
.opcion:disabled { opacity: 1; cursor: default; }

.casilla {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid var(--borde);
  display: grid;
  place-items: center;
  font-size: 0.8rem;
  color: var(--cobre-claro);
}
.opcion.acierto .casilla { color: var(--verde); border-color: var(--verde); }
.cuerpo { min-width: 0; }
.texto :deep(p) { margin: 0; }
.porque {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--borde-suave);
  font-size: 0.87rem;
  color: var(--texto-tenue);
}
.porque :deep(p) { margin: 0; }
</style>
