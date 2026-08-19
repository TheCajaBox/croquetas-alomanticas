<script setup>
import { computed, ref, watch } from 'vue'

import Marcado from './Marcado.vue'

/**
 * Reto de señalar la línea culpable.
 *
 * Es un reto de cazar el fallo sin teclado: se enseña código que revienta y el
 * error tal y como sale por consola, y hay que pulsar la línea que lo provoca.
 *
 * La gracia está en que **la línea que revienta casi nunca es la culpable**. Un
 * `Cannot read properties of undefined` salta donde se usa el dato, pero el
 * fallo está donde se rellenó mal. Aprender a leer un error hacia atrás es de
 * las cosas que más tiempo ahorran y que nadie enseña.
 *
 * Por eso las líneas señuelo llevan su propia explicación: al fallar, se dice
 * por qué esa que elegiste era sospechosa pero no era.
 */
const props = defineProps({
  reto: { type: Object, required: true },
  contestado: { type: Boolean, default: false },
})
const emit = defineEmits(['responder'])

const elegida = ref(null)

watch(
  () => props.reto.id,
  () => {
    elegida.value = null
  },
  { immediate: true },
)

/** Numeradas desde 1, como las cuenta la consola y como las nombra el error. */
const lineas = computed(() =>
  props.reto.codigoMostrado.split('\n').map((texto, indice) => ({ numero: indice + 1, texto })),
)

const acertado = computed(() => elegida.value === props.reto.lineaCulpable)

/** Lo que hay que decir al terminar: de la culpable, o de la que se eligió. */
const explicacion = computed(() => {
  if (!props.contestado) return null
  const propias = props.reto.explicaciones ?? {}
  return acertado.value ? propias[props.reto.lineaCulpable] : propias[elegida.value]
})
</script>

<template>
  <section class="cazar">
    <section class="panel bloque error">
      <h3>Lo que sale por consola</h3>
      <pre><code>{{ reto.errorMostrado }}</code></pre>
    </section>

    <div class="panel instrucciones">
      <p>Pulsa la línea que provoca el fallo.</p>
      <p class="tenue aviso">
        Ojo: la línea donde revienta y la línea que tiene la culpa casi nunca son la misma.
      </p>
    </div>

    <ol class="lineas">
      <li v-for="linea in lineas" :key="linea.numero">
        <button
          class="linea"
          :class="{
            elegida: elegida === linea.numero,
            culpable: contestado && linea.numero === reto.lineaCulpable,
            fallo: contestado && !acertado && elegida === linea.numero,
          }"
          :disabled="contestado"
          :aria-label="`Línea ${linea.numero}`"
          @click="elegida = linea.numero"
        >
          <span class="numero" aria-hidden="true">{{ linea.numero }}</span>
          <code>{{ linea.texto || ' ' }}</code>
        </button>
      </li>
    </ol>

    <button v-if="!contestado" class="principal" :disabled="elegida === null" @click="emit('responder', acertado)">
      {{ elegida === null ? 'Señala una línea' : `Es la línea ${elegida}` }}
    </button>

    <section v-if="contestado" class="panel veredicto" :class="{ bien: acertado }">
      <p class="titular">
        {{ acertado
          ? `✓ La línea ${reto.lineaCulpable} era.`
          : `✕ La culpable era la línea ${reto.lineaCulpable}, no la ${elegida}.` }}
      </p>
      <Marcado v-if="explicacion" class="porque" :texto="explicacion" />
    </section>
  </section>
</template>

<style scoped>
.cazar { display: flex; flex-direction: column; gap: 14px; }
.instrucciones p { margin: 0; }
.aviso { margin-top: 5px; font-size: 0.85rem; }

.error pre { margin: 0; }
.error code { color: var(--rojo); white-space: pre-wrap; }

.lineas { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.linea {
  display: flex;
  gap: 12px;
  width: 100%;
  text-align: left;
  align-items: baseline;
  padding: 4px 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--panel);
  transition: border-color 0.15s, background 0.15s;
}
.linea:hover:not(:disabled) { background: var(--panel-alto); }
.linea.elegida { border-color: var(--cobre); background: rgba(201, 139, 75, 0.12); }
.linea.culpable { border-color: var(--verde); background: rgba(95, 185, 138, 0.12); }
.linea.fallo { border-color: var(--rojo); background: rgba(224, 122, 114, 0.12); }
.linea:disabled { cursor: default; }

.numero {
  flex-shrink: 0;
  width: 1.6em;
  text-align: right;
  font-family: var(--mono);
  font-size: 0.78rem;
  color: var(--texto-apagado);
}
.linea code {
  background: none;
  color: var(--texto);
  font-size: 0.86rem;
  white-space: pre;
  overflow-x: auto;
}

.veredicto { border-color: var(--rojo); }
.veredicto.bien { border-color: var(--verde); }
.veredicto .titular { margin: 0; font-weight: 600; color: var(--rojo); }
.veredicto.bien .titular { color: var(--verde); }
.porque { margin-top: 8px; font-size: 0.88rem; color: var(--texto-tenue); }
.porque :deep(p) { margin: 0; }
</style>
