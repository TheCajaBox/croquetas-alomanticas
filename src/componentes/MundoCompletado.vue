<script setup>
import { computed } from 'vue'

import Avatar from './Avatar.vue'
import Marcado from './Marcado.vue'
import { MUNDOS, MUNDOS_POR_ID } from '../contenido/mundos.js'
import { REPASOS_POR_MUNDO } from '../contenido/repasos.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarInsignias } from '../almacen/insignias.js'
import { usarProgreso } from '../almacen/progreso.js'

/**
 * El cierre de un mundo.
 *
 * Antes no había ninguno: la `despedida` que Wayne tenía escrita para cada
 * mundo salía como un párrafo más en la cabecera de la lista de retos, y quien
 * volvía a la portada después del jefe no veía nada distinto de haber superado
 * un reto cualquiera.
 *
 * Terminar un mundo es lo que más cuesta de este juego -entre siete y doce
 * retos- y era lo único que no se celebraba. Aquí se junta todo lo que ha
 * pasado: la despedida, lo que se ha abierto, y lo que queda.
 */
const props = defineProps({ mundoId: { type: String, required: true } })

const progreso = usarProgreso()
const gatos = usarGatos()
const insignias = usarInsignias()

const mundo = computed(() => MUNDOS_POR_ID[props.mundoId])
const repaso = computed(() => REPASOS_POR_MUNDO[props.mundoId])

const retosDelMundo = computed(() => progreso.superadosDelMundo(props.mundoId))

/** Sin pistas y a la primera, que es lo que de verdad cuesta. */
const limpio = computed(() =>
  MUNDOS.some((m) => m.id === props.mundoId) &&
  progreso.mundosSinPistas > 0 &&
  progreso.mundoCompletado(props.mundoId),
)

/** Los mundos que este acaba de abrir. */
const abiertos = computed(() =>
  MUNDOS.filter((otro) => {
    const exigidos = Array.isArray(otro.requiere) ? otro.requiere : [otro.requiere]
    return exigidos.includes(props.mundoId) && progreso.mundoDisponible(otro.id)
  }),
)

/**
 * El gato que abre este mundo, si todavía está esperando.
 *
 * Se mira el refugio y no la colonia: los gatos se recogen a mano, así que
 * justo al terminar el mundo el gato está ganado pero no adoptado.
 */
const gatosNuevos = computed(() =>
  gatos.enElRefugio.filter(
    (gato) => gato.desbloqueo?.tipo === 'mundoCompletado' && gato.desbloqueo.valor === props.mundoId,
  ),
)

const insigniasRecientes = computed(() => insignias.mias.slice(-2))
</script>

<template>
  <section v-if="mundo" class="cierre panel">
    <header class="fila">
      <Avatar quien="wayne" :tamano="46" />
      <div>
        <p class="titular">{{ mundo.nombre }}, terminado</p>
        <p class="tenue cuenta">
          {{ retosDelMundo }} retos<span v-if="limpio"> · sin comprar una sola pista</span>
        </p>
      </div>
    </header>

    <Marcado class="despedida" :texto="mundo.despedida" />

    <ul v-if="gatosNuevos.length || abiertos.length || insigniasRecientes.length" class="abierto">
      <li v-for="gato in gatosNuevos" :key="gato.id">
        <strong>{{ gato.nombre }}</strong> te espera en el refugio.
      </li>
      <li v-for="insignia in insigniasRecientes" :key="insignia.id">
        Insignia: <strong>{{ insignia.nombre }}</strong>.
      </li>
      <li v-for="otro in abiertos" :key="otro.id">
        Se abre <strong>{{ otro.nombre }}</strong>.
      </li>
    </ul>

    <div class="salidas">
      <RouterLink v-if="repaso" :to="{ name: 'repaso', params: { mundoId } }" class="boton-siguiente">
        El repaso de Marasi →
      </RouterLink>
      <RouterLink
        :to="{ name: 'itinerario', params: { itinerarioId: mundo.itinerario } }"
        class="tenue volver-portada"
      >Volver a los mundos</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.cierre {
  border-color: var(--cobre);
  background: linear-gradient(160deg, rgba(201, 139, 75, 0.10), transparent 65%), var(--panel);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cierre header { gap: 12px; align-items: center; }
.titular { margin: 0; font-size: 1.05rem; font-weight: 600; color: var(--cobre-claro); }
.cuenta { margin: 2px 0 0; font-size: 0.84rem; }

.despedida { font-style: italic; color: var(--texto-tenue); }
.despedida :deep(p) { margin: 0; }

.abierto { list-style: none; margin: 0; padding: 12px 0 0; border-top: 1px solid var(--borde-suave); display: flex; flex-direction: column; gap: 5px; font-size: 0.89rem; }
.abierto strong { color: var(--texto); font-weight: 600; }

.salidas { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.volver-portada { font-size: 0.85rem; }
</style>
