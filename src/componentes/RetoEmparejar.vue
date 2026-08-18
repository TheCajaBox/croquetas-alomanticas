<script setup>
import { computed, ref } from 'vue'

import { barajarConSemilla } from '../motor/barajar.js'

/**
 * Reto de emparejar: se pulsa a la izquierda, se pulsa a la derecha y si la
 * pareja es correcta se queda enganchada.
 *
 * Las dos columnas se barajan con la misma semilla siempre, así que el reto es
 * exactamente igual cada vez que se abre: si cambiara en cada recarga, un
 * jugador atascado no podría comparar con lo que hizo antes.
 */
const props = defineProps({
  reto: { type: Object, required: true },
  contestado: { type: Boolean, default: false },
})
const emit = defineEmits(['responder'])

const izquierdas = computed(() =>
  barajarConSemilla(
    props.reto.parejas.map((p, i) => ({ indice: i, texto: p.izquierda })),
    `${props.reto.id}-izq`,
  ),
)
const derechas = computed(() =>
  barajarConSemilla(
    props.reto.parejas.map((p, i) => ({ indice: i, texto: p.derecha })),
    `${props.reto.id}-der`,
  ),
)

const enganchadas = ref([])
const seleccionada = ref(null)
const falloReciente = ref(null)

const resuelta = (indice) => enganchadas.value.includes(indice)

function elegirIzquierda(indice) {
  if (props.contestado || resuelta(indice)) return
  seleccionada.value = seleccionada.value === indice ? null : indice
}

function elegirDerecha(indice) {
  if (props.contestado || seleccionada.value === null || resuelta(indice)) return

  if (seleccionada.value === indice) {
    enganchadas.value.push(indice)
    seleccionada.value = null
    if (enganchadas.value.length === props.reto.parejas.length) emit('responder', true)
    return
  }

  // Fallo: se marca un instante y se suelta, sin castigar más.
  falloReciente.value = indice
  seleccionada.value = null
  setTimeout(() => { falloReciente.value = null }, 450)
}
</script>

<template>
  <section class="emparejar">
    <div class="panel instrucciones">
      <p>Pulsa una de la izquierda y su pareja de la derecha. Si aciertas, se quedan juntas.</p>
      <p class="tenue cuenta">{{ enganchadas.length }} de {{ reto.parejas.length }}</p>
    </div>

    <div class="columnas">
      <ul class="columna">
        <li v-for="opcion in izquierdas" :key="opcion.indice">
          <button
            class="ficha panel"
            :class="{ elegida: seleccionada === opcion.indice, hecha: resuelta(opcion.indice) }"
            :disabled="contestado || resuelta(opcion.indice)"
            @click="elegirIzquierda(opcion.indice)"
          >
            <code>{{ opcion.texto }}</code>
          </button>
        </li>
      </ul>

      <ul class="columna">
        <li v-for="opcion in derechas" :key="opcion.indice">
          <button
            class="ficha panel derecha"
            :class="{ hecha: resuelta(opcion.indice), mal: falloReciente === opcion.indice }"
            :disabled="contestado || resuelta(opcion.indice)"
            @click="elegirDerecha(opcion.indice)"
          >
            {{ opcion.texto }}
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.emparejar { display: flex; flex-direction: column; gap: 14px; }
.instrucciones p { margin: 0; }
.cuenta { margin-top: 6px; font-size: 0.87rem; }

.columnas { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr); gap: 12px; }
.columna { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }

.ficha {
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  transition: border-color 0.15s, background 0.15s, transform 0.12s;
}
.ficha code { background: none; color: var(--cobre-claro); font-size: 0.92rem; }
.ficha:hover:not(:disabled) { transform: translateY(-1px); border-color: var(--borde); }
.ficha.elegida { border-color: var(--cobre); background: rgba(201, 139, 75, 0.12); }
.ficha.hecha { border-color: var(--verde); background: rgba(95, 185, 138, 0.10); opacity: 1; cursor: default; }
.ficha.hecha code { color: var(--verde); }
.ficha.mal { border-color: var(--rojo); background: rgba(224, 122, 114, 0.12); }

@media (max-width: 620px) {
  .columnas { grid-template-columns: 1fr; }
}
</style>
