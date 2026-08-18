<script setup>
import { computed, ref, watch } from 'vue'

import { barajarConSemilla } from '../motor/barajar.js'

/**
 * Reto de ordenar líneas.
 *
 * Se mueven con botones y no arrastrando: se puede usar con teclado, funciona
 * igual en el móvil y no hace falta ninguna librería.
 *
 * Al enviar no se compara con la respuesta correcta: se monta el código en el
 * orden que haya puesto el jugador y se ejecuta de verdad. Así el que se
 * equivoca ve QUÉ falla, no solo que ha fallado.
 */
const props = defineProps({
  reto: { type: Object, required: true },
  contestado: { type: Boolean, default: false },
})
const emit = defineEmits(['montar'])

const orden = ref([])

watch(
  () => props.reto.id,
  () => {
    orden.value = barajarConSemilla(
      props.reto.lineas.map((texto, indice) => ({ indice, texto })),
      props.reto.id,
    )
  },
  { immediate: true },
)

const codigoMontado = computed(() => orden.value.map((l) => l.texto).join('\n'))

function mover(desde, hacia) {
  if (hacia < 0 || hacia >= orden.value.length) return
  const copia = [...orden.value]
  ;[copia[desde], copia[hacia]] = [copia[hacia], copia[desde]]
  orden.value = copia
}
</script>

<template>
  <section class="ordenar">
    <div class="panel instrucciones">
      <p>Coloca las líneas en el orden correcto y ejecútalo. Se ejecuta tal y como lo dejes.</p>
    </div>

    <ol class="lineas">
      <li v-for="(linea, posicion) in orden" :key="linea.indice" class="linea panel">
        <div class="flechas">
          <button
            class="mover"
            :disabled="posicion === 0 || contestado"
            :aria-label="`Subir la línea ${posicion + 1}`"
            @click="mover(posicion, posicion - 1)"
          >▲</button>
          <button
            class="mover"
            :disabled="posicion === orden.length - 1 || contestado"
            :aria-label="`Bajar la línea ${posicion + 1}`"
            @click="mover(posicion, posicion + 1)"
          >▼</button>
        </div>
        <code>{{ linea.texto }}</code>
      </li>
    </ol>

    <button class="principal" :disabled="contestado" @click="emit('montar', codigoMontado)">
      Ejecutar en este orden
    </button>
  </section>
</template>

<style scoped>
.ordenar { display: flex; flex-direction: column; gap: 14px; }
.instrucciones p { margin: 0; }

.lineas { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; counter-reset: linea; }
.linea {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
}
.linea code {
  background: none;
  color: var(--texto);
  font-size: 0.88rem;
  white-space: pre;
  overflow-x: auto;
}

.flechas { display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
.mover {
  padding: 1px 7px;
  font-size: 0.68rem;
  line-height: 1.35;
  border-radius: 5px;
  color: var(--texto-tenue);
}
.mover:hover:not(:disabled) { color: var(--cobre-claro); }
</style>
