<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import EditorCodigo from '../componentes/EditorCodigo.vue'
import Marcado from '../componentes/Marcado.vue'
import PanelPistas from '../componentes/PanelPistas.vue'
import PanelResultados from '../componentes/PanelResultados.vue'
import VistaPreviaSandbox from '../componentes/VistaPreviaSandbox.vue'
import { MUNDOS_POR_ID } from '../contenido/mundos.js'
import { RETOS_POR_ID, retoSiguiente } from '../contenido/retos/index.js'
import { analizar } from '../motor/guardaBucles.js'
import { comprobarRequisitos } from '../motor/chequeosEstaticos.js'
import { crearPuente } from '../motor/ejecutor.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarJuego } from '../almacen/juego.js'
import { usarProgreso } from '../almacen/progreso.js'

const props = defineProps({ retoId: { type: String, required: true } })

const router = useRouter()
const juego = usarJuego()
const progreso = usarProgreso()
const gatos = usarGatos()

const reto = RETOS_POR_ID[props.retoId]
if (!reto) router.replace('/')

const mundo = computed(() => MUNDOS_POR_ID[reto?.mundo])
const siguiente = computed(() => (reto ? retoSiguiente(reto) : null))
const esPrediccion = computed(() => reto?.tipo === 'prediccion')

// El puente se crea aquí y se destruye con la vista. La clave por ruta del
// RouterView garantiza que cambiar de reto levante un sandbox limpio.
const puente = reto ? crearPuente(reto.entorno) : null

const codigo = ref(progreso.ficha(props.retoId).codigoGuardado ?? reto?.inicial ?? '')
const respuesta = ref('')
const resultado = ref(null)
const verSolucion = ref(false)

watch(codigo, (nuevo) => progreso.guardarBorrador(props.retoId, nuevo))

const yaSuperado = computed(() => progreso.superado(props.retoId))
const ficha = computed(() => progreso.ficha(props.retoId))

/**
 * El oído fino de Estaño: comprueba los requisitos mientras se escribe, sin
 * ejecutar nada. Si el código todavía no se puede parsear no dice nada, que
 * para eso ya está el mensaje de error al ejecutar.
 */
const avisosEnVivo = computed(() => {
  if (!gatos.tieneBonus('avisoDeRequisitos') || !reto?.requisitos?.length) return []
  if (!codigo.value.trim()) return []
  try {
    return comprobarRequisitos(analizar(codigo.value), reto.requisitos).filter((r) => !r.cumplido)
  } catch {
    return []
  }
})

async function ejecutar() {
  resultado.value = esPrediccion.value
    ? await juego.resolverPrediccion(reto, respuesta.value, puente)
    : await juego.enviar(reto, codigo.value, puente)
}

function reiniciarCodigo() {
  codigo.value = reto.inicial ?? ''
  resultado.value = null
}
</script>

<template>
  <div v-if="reto" class="reto">
    <header class="encabezado">
      <RouterLink :to="{ name: 'mundo', params: { mundoId: reto.mundo } }" class="tenue volver">
        ← {{ mundo.nombre }}
      </RouterLink>
      <div class="fila etiquetas">
        <span class="etiqueta" :style="{ color: mundo.color, borderColor: mundo.color }">{{ mundo.subtitulo }}</span>
        <span v-if="reto.jefe" class="etiqueta jefe">jefe</span>
        <span v-if="yaSuperado" class="etiqueta superado">superado</span>
      </div>
      <h1>{{ reto.titulo }}</h1>
    </header>

    <div class="tablero">
      <div class="columna izquierda">
        <section class="panel enunciado">
          <Marcado :texto="reto.enunciado" />
        </section>

        <PanelPistas :reto="reto" />

        <section v-if="yaSuperado && reto.solucion" class="panel solucion">
          <button v-if="!verSolucion" @click="verSolucion = true">Ver una solución posible</button>
          <template v-else>
            <h3>Una solución posible</h3>
            <p class="tenue nota">No es la única. Si la tuya pasa los tests, la tuya vale.</p>
            <pre><code>{{ reto.solucion }}</code></pre>
          </template>
        </section>
      </div>

      <div class="columna derecha">
        <!-- Predicción: el código se lee, no se toca; lo que se escribe es la respuesta -->
        <template v-if="esPrediccion">
          <section class="panel bloque">
            <h3>El código</h3>
            <pre><code>{{ reto.codigoMostrado }}</code></pre>
          </section>

          <section class="panel bloque">
            <h3>Tu predicción</h3>
            <textarea
              v-model="respuesta"
              class="respuesta"
              rows="5"
              spellcheck="false"
              placeholder="Una línea por cada cosa que se imprima…"
            />
          </section>
        </template>

        <template v-else>
          <section class="bloque editor-bloque">
            <div class="cabecera-editor">
              <h3>Tu código</h3>
              <button class="menudo" @click="reiniciarCodigo">Empezar de nuevo</button>
            </div>
            <EditorCodigo v-model="codigo" />
          </section>
        </template>

        <div v-if="avisosEnVivo.length" class="oido-fino">
          <p class="titulo">Estaño ha oído algo</p>
          <ul>
            <li v-for="aviso in avisosEnVivo" :key="aviso.tipo + aviso.mensaje">{{ aviso.mensaje }}</li>
          </ul>
        </div>

        <div class="acciones">
          <button class="principal" :disabled="juego.ejecutando" @click="ejecutar">
            {{ juego.ejecutando ? 'Ejecutando…' : esPrediccion ? 'Comprobar predicción' : 'Ejecutar' }}
          </button>
          <span class="tenue intentos">
            {{ ficha.intentos }} intento{{ ficha.intentos === 1 ? '' : 's' }}
          </span>
        </div>

        <VistaPreviaSandbox v-if="reto.entorno !== 'worker'" :puente="puente" :entorno="reto.entorno" />

        <PanelResultados :resultado="resultado" :ejecutando="juego.ejecutando" />

        <section v-if="resultado?.ok && esPrediccion" class="panel bloque">
          <h3>Lo que ha pasado de verdad</h3>
          <pre><code>{{ resultado.salidaReal }}</code></pre>
        </section>

        <div v-if="resultado?.ok" class="siguiente">
          <RouterLink
            v-if="siguiente"
            :to="{ name: 'reto', params: { retoId: siguiente.id } }"
            class="boton-siguiente"
          >
            Siguiente reto: {{ siguiente.titulo }} →
          </RouterLink>
          <RouterLink v-else :to="{ name: 'mundo', params: { mundoId: reto.mundo } }" class="boton-siguiente">
            Has terminado este mundo →
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.encabezado { margin-bottom: 20px; }
.volver { display: inline-block; text-decoration: none; font-size: 0.85rem; margin-bottom: 10px; }
.etiquetas { gap: 6px; margin-bottom: 8px; }
.encabezado h1 { margin: 0; }

.tablero { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 18px; align-items: start; }
.columna { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

.enunciado { font-size: 0.95rem; }

.bloque h3 { margin: 0 0 10px; font-size: 0.95rem; }
.bloque pre { margin: 0; }
.editor-bloque { display: flex; flex-direction: column; }
.cabecera-editor { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cabecera-editor h3 { margin: 0; font-size: 0.95rem; }
.menudo { padding: 5px 10px; font-size: 0.8rem; }

.respuesta { width: 100%; font-family: var(--mono); font-size: 0.87rem; resize: vertical; }

.oido-fino {
  padding: 11px 14px;
  border-radius: 8px;
  background: rgba(127, 216, 232, 0.08);
  border: 1px solid rgba(127, 216, 232, 0.28);
  font-size: 0.87rem;
}
.oido-fino .titulo {
  margin: 0 0 6px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #7fd8e8;
  font-weight: 700;
}
.oido-fino ul { margin: 0; padding-left: 18px; }

.acciones { display: flex; align-items: center; gap: 14px; }
.intentos { font-size: 0.83rem; }

.solucion .nota { margin: 0 0 10px; font-size: 0.85rem; }

.siguiente { display: flex; }
.boton-siguiente {
  flex: 1;
  text-align: center;
  text-decoration: none;
  padding: 13px 18px;
  border-radius: var(--radio);
  background: rgba(95, 185, 138, 0.12);
  border: 1px solid rgba(95, 185, 138, 0.35);
  color: var(--verde);
  font-weight: 600;
}
.boton-siguiente:hover { background: rgba(95, 185, 138, 0.2); }

@media (max-width: 1000px) {
  .tablero { grid-template-columns: 1fr; }
}
</style>
