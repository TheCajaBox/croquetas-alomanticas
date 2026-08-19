<script setup>
import { computed, ref, watch } from 'vue'

import Marcado from './Marcado.vue'

/**
 * Reto de marcar verdadero o falso en una tanda de afirmaciones.
 *
 * Es el más ligero del juego, y está para eso: entre dos retos duros hace falta
 * algo que se resuelva en un minuto y que aun así enseñe. Se corrigen todas de
 * golpe, no una a una, para que haya que pensárselas antes de mandar.
 *
 * Como en el de elegir, al corregir se enseña el porqué de TODAS -también el de
 * las que acertaste-, porque acertar por intuición y acertar sabiendo por qué no
 * son lo mismo, y desde fuera se parecen demasiado.
 */
const props = defineProps({
  reto: { type: Object, required: true },
  contestado: { type: Boolean, default: false },
})
const emit = defineEmits(['responder'])

/** Lo marcado por el jugador: true, false o null si todavía no ha dicho nada. */
const marcas = ref([])

watch(
  () => props.reto.id,
  () => {
    marcas.value = props.reto.afirmaciones.map(() => null)
  },
  { immediate: true },
)

const completo = computed(() => marcas.value.every((m) => m !== null))

/** `verdadera` se omite en las falsas, igual que `correcta` en las opciones. */
const esVerdadera = (afirmacion) => Boolean(afirmacion.verdadera)

const acertada = (indice) =>
  props.contestado && marcas.value[indice] === esVerdadera(props.reto.afirmaciones[indice])

function marcar(indice, valor) {
  if (props.contestado) return
  marcas.value = marcas.value.map((m, i) => (i === indice ? valor : m))
}

function responder() {
  emit(
    'responder',
    props.reto.afirmaciones.every((afirmacion, i) => marcas.value[i] === esVerdadera(afirmacion)),
  )
}
</script>

<template>
  <section class="vof">
    <div class="panel instrucciones">
      <p>Marca cada frase como verdadera o falsa. Se corrigen todas juntas al enviar.</p>
    </div>

    <ul class="afirmaciones">
      <li
        v-for="(afirmacion, indice) in reto.afirmaciones"
        :key="indice"
        class="afirmacion panel"
        :class="{ acierto: acertada(indice), fallo: contestado && !acertada(indice) }"
      >
        <div class="fila">
          <Marcado class="texto" :texto="afirmacion.texto" />
          <div class="botones" role="group" :aria-label="`Afirmación ${indice + 1}`">
            <button
              class="marca"
              :class="{ elegida: marcas[indice] === true }"
              :disabled="contestado"
              @click="marcar(indice, true)"
            >Verdadero</button>
            <button
              class="marca"
              :class="{ elegida: marcas[indice] === false }"
              :disabled="contestado"
              @click="marcar(indice, false)"
            >Falso</button>
          </div>
        </div>

        <p v-if="contestado" class="veredicto" :class="{ bien: acertada(indice) }">
          {{ acertada(indice) ? '✓ ' : '✕ ' }}
          Era {{ esVerdadera(afirmacion) ? 'verdadera' : 'falsa' }}.
        </p>
        <Marcado v-if="contestado" class="porque" :texto="afirmacion.porque" />
      </li>
    </ul>

    <button v-if="!contestado" class="principal" :disabled="!completo" @click="responder">
      {{ completo ? 'Corregir' : 'Te falta marcar alguna' }}
    </button>
  </section>
</template>

<style scoped>
.vof { display: flex; flex-direction: column; gap: 14px; }
.instrucciones p { margin: 0; }

.afirmaciones { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.afirmacion { transition: border-color 0.15s, background 0.15s; }
.afirmacion.acierto { border-color: var(--verde); background: rgba(95, 185, 138, 0.08); }
.afirmacion.fallo { border-color: var(--rojo); background: rgba(224, 122, 114, 0.08); }

.fila { display: flex; gap: 14px; align-items: flex-start; justify-content: space-between; }
.texto { min-width: 0; flex: 1; }
.texto :deep(p) { margin: 0; }

.botones { display: flex; gap: 6px; flex-shrink: 0; }
.marca {
  padding: 5px 11px;
  font-size: 0.82rem;
  border-radius: 7px;
  color: var(--texto-tenue);
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.marca:hover:not(:disabled) { color: var(--texto); }
.marca.elegida { border-color: var(--cobre); color: var(--cobre-claro); background: rgba(201, 139, 75, 0.12); }
.marca:disabled { cursor: default; }

.veredicto {
  margin: 10px 0 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--rojo);
}
.veredicto.bien { color: var(--verde); }

.porque {
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px solid var(--borde-suave);
  font-size: 0.87rem;
  color: var(--texto-tenue);
}
.porque :deep(p) { margin: 0; }

@media (max-width: 620px) {
  .fila { flex-direction: column; gap: 10px; }
}
</style>
