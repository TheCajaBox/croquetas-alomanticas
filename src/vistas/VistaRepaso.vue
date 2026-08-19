<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import Avatar from '../componentes/Avatar.vue'
import Marcado from '../componentes/Marcado.vue'
import { MUNDOS_POR_ID } from '../contenido/mundos.js'
import { REPASOS_POR_MUNDO } from '../contenido/repasos.js'
import { usarNarrador } from '../almacen/narrador.js'
import { usarProgreso } from '../almacen/progreso.js'
import { usarRepasos } from '../almacen/repasos.js'

const props = defineProps({ mundoId: { type: String, required: true } })

const router = useRouter()
const progreso = usarProgreso()
const repasos = usarRepasos()
const narrador = usarNarrador()

const repaso = REPASOS_POR_MUNDO[props.mundoId]
const mundo = MUNDOS_POR_ID[props.mundoId]

// Se abre al terminar el mundo: repasar lo que aún no has visto no es repasar.
const abierto = !!repaso && progreso.mundoCompletado(props.mundoId)
if (!abierto) router.replace('/')

const actual = ref(0)
const elegida = ref(null)
const aciertos = ref(0)
const terminado = ref(false)
const cobro = ref(null)

const pregunta = computed(() => repaso?.preguntas[actual.value])
const contestada = computed(() => elegida.value !== null)
const esLaUltima = computed(() => actual.value === repaso.preguntas.length - 1)

// Marasi solo abre el caso si el caso se abre: si esto redirige, se calla.
if (abierto) narrador.decir('abreCaso', {}, { personaje: 'marasi', forzar: true })

function responder(indice) {
  if (contestada.value) return
  elegida.value = indice
  if (repaso.preguntas[actual.value].opciones[indice].correcta) aciertos.value += 1
}

function siguiente() {
  if (!esLaUltima.value) {
    actual.value += 1
    elegida.value = null
    return
  }

  terminado.value = true
  cobro.value = repasos.registrar(repaso, aciertos.value)

  const total = repaso.preguntas.length
  const evento = aciertos.value === total ? 'bordado' : aciertos.value >= total / 2 ? 'bien' : 'flojo'
  narrador.decir(evento, {}, { personaje: 'marasi', forzar: true })
}

function otraVez() {
  actual.value = 0
  elegida.value = null
  aciertos.value = 0
  terminado.value = false
  cobro.value = null
}
</script>

<template>
  <div v-if="repaso" class="pila repaso">
    <section class="panel encabezado">
      <div class="cabecera">
        <Avatar quien="marasi" :tamano="60" />
        <div>
          <p class="quien">El caso de Marasi</p>
          <h1>{{ repaso.titulo }}</h1>
          <p class="tenue">
            Seis preguntas sobre {{ mundo.nombre }}. No cuentan para nada salvo para saber qué
            se te ha quedado; se puede repetir, pero solo se cobra lo que se mejore.
          </p>
        </div>
      </div>

      <div v-if="!terminado" class="avance">
        <div class="barra">
          <i :style="{ width: `${(actual / repaso.preguntas.length) * 100}%`, background: '#c0697e' }" />
        </div>
        <span class="tenue cuenta">{{ actual + 1 }} de {{ repaso.preguntas.length }}</span>
      </div>
    </section>

    <!-- Una pregunta cada vez -->
    <template v-if="!terminado">
      <section class="panel pregunta">
        <Marcado :texto="pregunta.pregunta" />
      </section>

      <ul class="opciones">
        <li
          v-for="(opcion, indice) in pregunta.opciones"
          :key="indice"
          class="panel opcion"
          :class="{
            marcada: elegida === indice,
            acierto: contestada && opcion.correcta,
            fallo: contestada && !opcion.correcta && elegida === indice,
          }"
        >
          <!-- El texto de la opción no enlaza al glosario: dentro de un botón,
               un término que se pulsa se comería la respuesta. El porqué sí
               enlaza, y por eso vive fuera del botón. -->
          <button class="eleccion" :disabled="contestada" @click="responder(indice)">
            <span class="marca" aria-hidden="true">
              {{ contestada && opcion.correcta ? '✓' : contestada && elegida === indice ? '✕' : '' }}
            </span>
            <Marcado class="texto" :texto="opcion.texto" :enlazar="false" />
          </button>

          <Marcado v-if="contestada" class="porque" :texto="opcion.porque" />
        </li>
      </ul>

      <button v-if="contestada" class="principal siguiente" @click="siguiente">
        {{ esLaUltima ? 'Ver el resultado' : 'Siguiente pregunta →' }}
      </button>
    </template>

    <!-- Resultado -->
    <section v-else class="panel resultado">
      <p class="marcador">{{ aciertos }} de {{ repaso.preguntas.length }}</p>

      <p v-if="cobro.pagado" class="pago">+{{ cobro.pagado }} croquetas</p>
      <p v-else-if="cobro.mejorAnterior" class="tenue pago">
        Tu mejor marca sigue siendo {{ cobro.mejorAnterior }}. Solo se cobra lo que se mejora.
      </p>

      <div class="fila acciones">
        <button @click="otraVez">Repetirlo</button>
        <RouterLink :to="{ name: 'mundo', params: { mundoId } }" class="volver">
          Volver a {{ mundo.nombre }} →
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cabecera { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 14px; }
.quien {
  margin: 0 0 2px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #c0697e;
}
.cabecera h1 { margin: 0 0 6px; font-size: 1.5rem; }
.cabecera p.tenue { margin: 0; max-width: 70ch; font-size: 0.9rem; }

.avance { display: flex; align-items: center; gap: 12px; }
.avance .barra { flex: 1; }
.cuenta { font-size: 0.83rem; white-space: nowrap; }

.pregunta { font-size: 1.02rem; }

.opciones { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.opcion {
  padding: 0;
  overflow: hidden;
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
}
.opcion:has(.eleccion:hover:not(:disabled)) { transform: translateX(3px); }

.eleccion {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  text-align: left;
  align-items: flex-start;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
}
.opcion.marcada { border-color: #c0697e; background: rgba(192, 105, 126, 0.10); }
.opcion.acierto { border-color: var(--verde); background: rgba(95, 185, 138, 0.10); }
.opcion.fallo { border-color: var(--rojo); background: rgba(224, 122, 114, 0.10); }
.eleccion:disabled { opacity: 1; cursor: default; }

.marca {
  flex-shrink: 0;
  width: 22px;
  text-align: center;
  font-weight: 700;
  line-height: 1.5;
}
.opcion.acierto .marca { color: var(--verde); }
.opcion.fallo .marca { color: var(--rojo); }
.texto { min-width: 0; }
.texto :deep(p) { margin: 0; }
.porque {
  margin: 0 16px 14px 50px;
  padding-top: 8px;
  border-top: 1px solid var(--borde-suave);
  font-size: 0.87rem;
  color: var(--texto-tenue);
}
.porque :deep(p) { margin: 0; }

.siguiente { align-self: flex-start; }

.resultado { text-align: center; }
.marcador { margin: 0 0 8px; font-size: 2rem; font-weight: 700; color: #c0697e; }
.pago { margin: 0 0 16px; color: var(--cobre-claro); font-weight: 600; }
.acciones { justify-content: center; }
.volver { text-decoration: none; padding: 9px 16px; font-size: 0.92rem; }
</style>
