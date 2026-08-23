<script setup>
import { computed } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import { useRouter } from 'vue-router'

import { MUNDOS_POR_ID } from '../contenido/mundos.js'
import { quienRepasa, repartoDelMundo } from '../contenido/itinerarios.js'
import { retosDelMundo } from '../contenido/retos/index.js'
import Avatar from '../componentes/Avatar.vue'
import { nombreDe } from '../contenido/personajes.js'
import { REPASOS_POR_MUNDO } from '../contenido/repasos/index.js'
import { etiquetaDelTipo } from '../contenido/retos/tipos.js'
import { usarNarrador } from '../almacen/narrador.js'
import { usarProgreso } from '../almacen/progreso.js'
import { usarRepasos } from '../almacen/repasos.js'

const props = defineProps({ mundoId: { type: String, required: true } })

const router = useRouter()
const progreso = usarProgreso()
const repasos = usarRepasos()
const narrador = usarNarrador()

const repaso = computed(() =>
  progreso.mundoCompletado(props.mundoId) ? REPASOS_POR_MUNDO[props.mundoId] : null,
)

const mundo = computed(() => MUNDOS_POR_ID[props.mundoId])
/** Quién pregunta en este mundo: lo decide el repaso o el reparto, no la plantilla. */
const examinador = computed(() => quienRepasa(repaso.value, mundo.value))
// La voz del itinerario al que pertenece este mundo.
narrador.ponerNarrador(repartoDelMundo(mundo.value)?.narra)

narrador.entrarAlMundo(mundo.value)


const retos = computed(() =>
  retosDelMundo(props.mundoId).map((reto, indice) => {
    const ficha = progreso.ficha(reto.id)
    const anterior = retosDelMundo(props.mundoId)[indice - 1]
    return {
      ...reto,
      numero: indice + 1,
      superado: ficha.superado,
      empezado: ficha.intentos > 0,
      // Los retos se abren en orden: cada uno se apoya en el anterior. La regla
      // vive en el almacén porque hay tres sitios que la preguntan.
      abierto: progreso.retoDisponible(reto.id),
    }
  }),
)

if (!mundo.value || !progreso.mundoDisponible(props.mundoId)) router.replace('/')
</script>

<template>
  <div v-if="mundo" class="pila">
    <section class="panel encabezado" :style="{ '--color-mundo': mundo.color }">
      <SombreroEscondido id="mundo" :posicion="{ bottom: '16px', right: '20px' }" />
      <RouterLink :to="{ name: 'itinerario', params: { itinerarioId: mundo.itinerario } }" class="tenue volver">← Mundos</RouterLink>
      <span class="etiqueta" :style="{ color: mundo.color, borderColor: mundo.color }">{{ mundo.subtitulo }}</span>
      <h1>{{ mundo.nombre }}</h1>
      <p class="presentacion">{{ mundo.presentacion }}</p>
      <p v-if="progreso.mundoCompletado(mundoId)" class="despedida">{{ mundo.despedida }}</p>
    </section>

    <RouterLink v-if="repaso" :to="{ name: 'repaso', params: { mundoId } }" class="panel caso">
      <!-- Estaba escrito «marasi» a mano, así que la tarjeta anunciaba su cara
           y su nombre también donde pregunta otro. Ver `quienRepasa`. -->
      <Avatar :quien="examinador" :tamano="48" />
      <div>
        <p class="titulo-caso">{{ repaso.titulo }}</p>
        <p class="tenue">
          <!-- De la ficha: las preguntas se descargan al entrar en el repaso, y
               esta tarjeta se pinta antes de que nadie decida entrar. -->
          {{ nombreDe(examinador) }} repasa lo de este mundo con
          {{ repaso.cuantasPreguntas }} preguntas.
          <template v-if="repasos.hecho(repaso.id)">
            Tu mejor marca: {{ repasos.mejor(repaso.id) }} de {{ repaso.cuantasPreguntas }}.
          </template>
        </p>
      </div>
      <span class="flecha" aria-hidden="true">→</span>
    </RouterLink>

    <ol class="retos escalonado">
      <li v-for="(reto, orden) in retos" :key="reto.id" :style="{ '--orden': orden }">
        <component
          :is="reto.abierto ? 'RouterLink' : 'div'"
          :to="reto.abierto ? { name: 'reto', params: { retoId: reto.id } } : undefined"
          class="reto panel"
          :class="{ bloqueado: !reto.abierto, hecho: reto.superado }"
        >
          <span class="numero">{{ String(reto.numero).padStart(2, '0') }}</span>
          <div class="cuerpo">
            <div class="fila etiquetas">
              <span class="etiqueta">{{ etiquetaDelTipo(reto.tipo) }}</span>
              <span v-if="reto.jefe" class="etiqueta jefe">jefe</span>
              <span v-if="reto.superado" class="etiqueta superado">superado</span>
              <span v-else-if="reto.empezado" class="etiqueta">empezado</span>
            </div>
            <h3>{{ reto.titulo }}</h3>
            <p v-if="!reto.abierto" class="tenue candado">Supera el anterior para abrir este.</p>
          </div>
          <span v-if="reto.abierto" class="croquetas">{{ reto.recompensa.croquetas }} ●</span>
        </component>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.encabezado { position: relative; border-top: 3px solid var(--color-mundo); }
.volver { display: inline-block; text-decoration: none; font-size: 0.85rem; margin-bottom: 10px; }
.encabezado h1 { margin: 8px 0 10px; }
.presentacion { max-width: 70ch; margin: 0; font-style: italic; color: var(--texto-tenue); }
.despedida {
  margin: 14px 0 0;
  padding: 10px 12px;
  border-left: 3px solid var(--verde);
  background: rgba(95, 185, 138, 0.08);
  border-radius: 0 8px 8px 0;
  font-size: 0.9rem;
}

.caso {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
  border-left: 3px solid #c0697e;
  transition: transform 0.14s, background 0.14s;
}
.caso:hover { transform: translateX(3px); background: var(--panel-alto); }
.titulo-caso { margin: 0 0 3px; font-weight: 650; }
.caso p.tenue { margin: 0; font-size: 0.87rem; }
.caso .flecha { margin-left: auto; color: #c0697e; font-size: 1.2rem; }

.retos { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.reto {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  padding: 14px 18px;
  transition: transform 0.12s, background 0.12s;
}
a.reto:hover { transform: translateX(3px); background: var(--panel-alto); }
.reto.bloqueado { opacity: 0.5; }
.reto.hecho { border-left: 3px solid var(--verde); }

.numero {
  font-family: var(--mono);
  font-size: 1.25rem;
  color: var(--texto-apagado);
  font-variant-numeric: tabular-nums;
}
.cuerpo { flex: 1; min-width: 0; }
.etiquetas { gap: 6px; margin-bottom: 6px; }
.reto h3 { margin: 0; font-size: 1rem; }
.candado { margin: 5px 0 0; font-size: 0.83rem; }
.croquetas { color: var(--cobre-claro); font-size: 0.85rem; font-weight: 600; white-space: nowrap; }
</style>
