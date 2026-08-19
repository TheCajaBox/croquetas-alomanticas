<script setup>
import { computed, ref, watch } from 'vue'

import CasaYJardin from '../componentes/CasaYJardin.vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import TarjetaGato from '../componentes/TarjetaGato.vue'
import { usarGatos } from '../almacen/gatos.js'

const gatos = usarGatos()

const colonia = computed(() => gatos.adoptados)
const enElRefugio = computed(() => gatos.enElRefugio.length)
const beneficiosActivos = computed(
  () => colonia.value.filter((gato) => gatos.bonusActivos.has(gato.bonus.id) && gato.bonus.id !== 'ninguno').length,
)

/** La casa se ve por defecto; las fichas siguen ahí para quien quiera los números. */
const vista = ref('casa')

/**
 * Se guarda el id y no el gato: el objeto se rehace en cada cambio del almacén,
 * y si se guardara ese, la ficha abierta se quedaría con los datos de antes.
 */
const elegido = ref(null)
const gatoElegido = computed(() => colonia.value.find((gato) => gato.id === elegido.value) ?? null)

watch(vista, () => { elegido.value = null })
</script>

<template>
  <div class="pila">
    <section class="panel encabezado">
      <SombreroEscondido id="colonia" :posicion="{ bottom: '16px', right: '18px' }" />
      <h1>La colonia</h1>
      <p class="tenue">
        Los indicadores bajan con el tiempo real, estés o no estés. Ningún gato se muere ni se
        va nunca: como mucho se pone triste y deja de echarte una mano hasta que le hagas caso.
      </p>
      <div class="fila cabecera">
        <p v-if="colonia.length" class="resumen">
          {{ colonia.length }} gato{{ colonia.length === 1 ? '' : 's' }} ·
          {{ beneficiosActivos }} beneficio{{ beneficiosActivos === 1 ? '' : 's' }} despierto{{ beneficiosActivos === 1 ? '' : 's' }}
        </p>
        <div class="cambiavistas" role="group" aria-label="Cómo ver la colonia">
          <button class="menudo" :class="{ puesto: vista === 'casa' }" @click="vista = 'casa'">La casa</button>
          <button class="menudo" :class="{ puesto: vista === 'fichas' }" @click="vista = 'fichas'">Las fichas</button>
        </div>
      </div>
    </section>

    <template v-if="vista === 'casa'">
      <CasaYJardin :gatos="colonia" @elegir="elegido = $event.id" />

      <p v-if="colonia.length && !gatoElegido" class="tenue pista-casa">
        Pulsa un gato para darle de comer, jugar con él o cepillarlo.
      </p>

      <TarjetaGato v-if="gatoElegido" :key="gatoElegido.id" :gato="gatoElegido" class="elegido">
        <template #cerrar>
          <button class="cerrar-ficha menudo" @click="elegido = null">Cerrar</button>
        </template>
      </TarjetaGato>
    </template>

    <div v-else-if="colonia.length" class="tarjetas escalonado">
      <TarjetaGato
        v-for="(gato, orden) in colonia"
        :key="gato.id"
        :gato="gato"
        :style="{ '--orden': orden }"
      />
    </div>

    <section v-if="!colonia.length && vista === 'fichas'" class="panel centrado vacia">
      <p>Aquí todavía no vive nadie.</p>
      <RouterLink v-if="enElRefugio" to="/refugio">
        Hay {{ enElRefugio }} esperando en el refugio →
      </RouterLink>
      <p v-else class="tenue">Supera retos y se irán apuntando solos.</p>
    </section>

    <RouterLink v-if="enElRefugio && vista === 'casa'" class="al-refugio" to="/refugio">
      Hay {{ enElRefugio }} esperando en el refugio →
    </RouterLink>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.encabezado p { max-width: 72ch; }
.cabecera { justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.encabezado .resumen { margin: 0; font-size: 0.9rem; color: var(--cobre-claro); }

.cambiavistas { display: flex; gap: 6px; }
.cambiavistas .menudo { font-size: 0.82rem; }
.cambiavistas .puesto { color: var(--cobre-claro); border-color: rgba(201, 139, 75, 0.45); }

.pista-casa { margin: 0; text-align: center; font-size: 0.86rem; }
.elegido { animation: asomar 0.22s ease-out; }
.cerrar-ficha { font-size: 0.78rem; }

.tarjetas { display: grid; grid-template-columns: repeat(auto-fit, minmax(430px, 1fr)); gap: 16px; }
.vacia p { margin: 0 0 8px; }
.al-refugio { align-self: center; font-size: 0.9rem; }

@keyframes asomar {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .elegido { animation: none; }
}

@media (max-width: 700px) {
  .tarjetas { grid-template-columns: 1fr; }
}
</style>
