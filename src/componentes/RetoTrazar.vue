<script setup>
import { computed, ref, watch } from 'vue'

import Marcado from './Marcado.vue'

/**
 * Reto de seguir el hilo: la tabla de la ejecución, paso a paso.
 *
 * Se enseña un código que no se toca y una tabla con una fila por paso -cada
 * vuelta del bucle, normalmente- y una columna por variable. Hay que decir
 * cuánto vale cada una en cada momento, eligiendo de un montón de valores.
 *
 * ## Por qué este reto existe
 *
 * Porque leer código es simular su ejecución en la cabeza, y eso no se enseña
 * en ningún sitio: se supone que sale solo. No sale solo. Quien se atasca en un
 * bucle casi nunca se atasca en la sintaxis — se atasca porque no sabe decir
 * qué vale el acumulador en la segunda vuelta, y sin eso no hay forma de ver
 * por qué el resultado sale mal.
 *
 * Rellenar la tabla obliga a hacer despacio y por escrito lo que un programador
 * con oficio hace de un vistazo. Es el único reto del juego donde no se
 * construye nada: solo se mira, que es la mitad del trabajo de verdad.
 *
 * Los valores se eligen de una lista con señuelos -y con los clásicos:
 * `undefined`, el valor de antes de entrar al bucle, el de una vuelta de más-
 * para que no se pueda ir por descarte.
 */
const props = defineProps({
  reto: { type: Object, required: true },
  contestado: { type: Boolean, default: false },
})
const emit = defineEmits(['responder'])

/** Lo puesto por el jugador, con clave "fila:columna". */
const puestas = ref({})
/** La celda que espera valor. Se va sola a la siguiente para no picar tanto. */
const celdaActiva = ref(null)

const celdas = computed(() =>
  props.reto.pasos.flatMap((paso, fila) =>
    props.reto.variables.map((variable, columna) => ({ fila, columna, variable, paso })),
  ),
)

const clave = (fila, columna) => `${fila}:${columna}`

watch(
  () => props.reto.id,
  () => {
    puestas.value = {}
    celdaActiva.value = clave(0, 0)
  },
  { immediate: true },
)

const esperado = (fila, columna) =>
  props.reto.pasos[fila].valores[props.reto.variables[columna]]

const acertadaEn = (fila, columna) => puestas.value[clave(fila, columna)] === esperado(fila, columna)

const completo = computed(() => celdas.value.every((c) => puestas.value[clave(c.fila, c.columna)]))

const cuantasBien = computed(() => celdas.value.filter((c) => acertadaEn(c.fila, c.columna)).length)

/** La primera celda vacía a partir de una dada, para ir saltando sola. */
function siguienteVacia(desde) {
  const orden = celdas.value.map((c) => clave(c.fila, c.columna))
  const empieza = orden.indexOf(desde)
  const rotado = [...orden.slice(empieza + 1), ...orden.slice(0, empieza + 1)]
  return rotado.find((k) => !puestas.value[k]) ?? null
}

function elegirCelda(fila, columna) {
  if (props.contestado) return
  const k = clave(fila, columna)
  // Pulsar una celda ya puesta la vacía y se queda esperando otro valor.
  if (puestas.value[k]) {
    const { [k]: _, ...resto } = puestas.value
    puestas.value = resto
  }
  celdaActiva.value = k
}

function ponerValor(valor) {
  if (props.contestado || !celdaActiva.value) return
  const k = celdaActiva.value
  puestas.value = { ...puestas.value, [k]: valor }
  celdaActiva.value = siguienteVacia(k)
}

function responder() {
  emit('responder', celdas.value.every((c) => acertadaEn(c.fila, c.columna)))
}
</script>

<template>
  <section class="trazar">
    <section class="panel bloque">
      <h3>El código</h3>
      <pre><code>{{ reto.codigoMostrado }}</code></pre>
    </section>

    <div class="panel instrucciones">
      <p>Pulsa una casilla y elige lo que vale ahí. Al rellenar una salta sola a la siguiente.</p>
      <p class="tenue aviso">Sobran valores, y uno mismo puede repetirse en varias casillas.</p>
    </div>

    <div class="tabla-envoltorio">
      <table class="tabla">
        <thead>
          <tr>
            <th scope="col" class="paso">Paso</th>
            <th v-for="variable in reto.variables" :key="variable" scope="col">
              <code>{{ variable }}</code>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(paso, fila) in reto.pasos" :key="fila">
            <th scope="row" class="paso">{{ paso.etiqueta }}</th>
            <td v-for="(variable, columna) in reto.variables" :key="variable">
              <button
                class="celda"
                :class="{
                  activa: celdaActiva === clave(fila, columna),
                  puesta: !!puestas[clave(fila, columna)],
                  acierto: contestado && acertadaEn(fila, columna),
                  fallo: contestado && !acertadaEn(fila, columna),
                }"
                :disabled="contestado"
                :aria-label="`${variable} en ${paso.etiqueta}`"
                @click="elegirCelda(fila, columna)"
              >
                <span class="valor">{{ puestas[clave(fila, columna)] ?? '·' }}</span>
                <span v-if="contestado && !acertadaEn(fila, columna)" class="era">
                  {{ esperado(fila, columna) }}
                </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!contestado" class="valores">
      <button
        v-for="(valor, indice) in reto.valoresPosibles"
        :key="`${valor}-${indice}`"
        class="valor-ficha"
        :disabled="!celdaActiva"
        @click="ponerValor(valor)"
      >
        {{ valor }}
      </button>
    </div>

    <button v-if="!contestado" class="principal" :disabled="!completo" @click="responder">
      {{ completo ? 'Comprobar la traza' : 'Te quedan casillas por rellenar' }}
    </button>

    <section v-if="contestado" class="panel veredicto" :class="{ bien: cuantasBien === celdas.length }">
      <p class="titular">
        {{ cuantasBien === celdas.length
          ? '✓ La traza entera, clavada.'
          : `✕ ${cuantasBien} de ${celdas.length} casillas. En rojo, lo que valía de verdad.` }}
      </p>
      <Marcado v-if="reto.porque" class="porque" :texto="reto.porque" />
    </section>
  </section>
</template>

<style scoped>
.trazar { display: flex; flex-direction: column; gap: 14px; }
.instrucciones p { margin: 0; }
.aviso { margin-top: 5px; font-size: 0.85rem; }

.tabla-envoltorio { overflow-x: auto; }
.tabla { border-collapse: collapse; width: 100%; font-size: 0.88rem; }
.tabla th, .tabla td { border: 1px solid var(--borde-suave); padding: 0; }
.tabla thead th {
  padding: 7px 10px;
  background: var(--fondo-alto);
  color: var(--texto-tenue);
  font-weight: 600;
  text-align: center;
}
.tabla thead th code { background: none; color: var(--cobre-claro); }
.tabla th.paso {
  padding: 7px 12px;
  text-align: left;
  white-space: nowrap;
  color: var(--texto-tenue);
  font-weight: 500;
}

.celda {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100%;
  min-width: 84px;
  padding: 8px 10px;
  border: none;
  border-radius: 0;
  background: none;
  font-family: var(--mono);
  font-size: 0.85rem;
  color: var(--texto);
  transition: background 0.15s, box-shadow 0.15s;
}
.celda:hover:not(:disabled) { background: var(--panel-alto); }
.celda.activa { box-shadow: inset 0 0 0 2px var(--cobre); background: rgba(201, 139, 75, 0.08); }
.celda.puesta .valor { color: var(--cobre-claro); }
.celda.acierto { background: rgba(95, 185, 138, 0.10); }
.celda.acierto .valor { color: var(--verde); }
.celda.fallo { background: rgba(224, 122, 114, 0.10); }
.celda.fallo .valor { color: var(--texto-apagado); text-decoration: line-through; }
.celda:disabled { cursor: default; }
.era { font-size: 0.8rem; color: var(--rojo); }

.valores { display: flex; flex-wrap: wrap; gap: 8px; }
.valor-ficha {
  padding: 5px 11px;
  font-family: var(--mono);
  font-size: 0.83rem;
  border-radius: 7px;
  color: var(--texto-tenue);
}
.valor-ficha:hover:not(:disabled) { border-color: var(--cobre); color: var(--cobre-claro); }

.veredicto { border-color: var(--rojo); }
.veredicto.bien { border-color: var(--verde); }
.veredicto .titular { margin: 0; font-weight: 600; color: var(--rojo); }
.veredicto.bien .titular { color: var(--verde); }
.porque { margin-top: 8px; font-size: 0.88rem; color: var(--texto-tenue); }
.porque :deep(p) { margin: 0; }
</style>
