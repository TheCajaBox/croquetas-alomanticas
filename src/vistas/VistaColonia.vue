<script setup>
import { computed } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import TarjetaGato from '../componentes/TarjetaGato.vue'
import { usarGatos } from '../almacen/gatos.js'

const gatos = usarGatos()

const colonia = computed(() => gatos.adoptados)
const enElRefugio = computed(() => gatos.enElRefugio.length)
const beneficiosActivos = computed(
  () => colonia.value.filter((gato) => gatos.bonusActivos.has(gato.bonus.id) && gato.bonus.id !== 'ninguno').length,
)
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
      <p v-if="colonia.length" class="resumen">
        {{ colonia.length }} gato{{ colonia.length === 1 ? '' : 's' }} ·
        {{ beneficiosActivos }} beneficio{{ beneficiosActivos === 1 ? '' : 's' }} despierto{{ beneficiosActivos === 1 ? '' : 's' }}
      </p>
    </section>

    <div v-if="colonia.length" class="tarjetas escalonado">
      <TarjetaGato
        v-for="(gato, orden) in colonia"
        :key="gato.id"
        :gato="gato"
        :style="{ '--orden': orden }"
      />
    </div>

    <section v-else class="panel centrado vacia">
      <p>Aquí todavía no vive nadie.</p>
      <RouterLink v-if="enElRefugio" to="/refugio">
        Hay {{ enElRefugio }} esperando en el refugio →
      </RouterLink>
      <p v-else class="tenue">Supera retos y se irán apuntando solos.</p>
    </section>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.encabezado p { max-width: 72ch; }
.encabezado .resumen { margin: 0; font-size: 0.9rem; color: var(--cobre-claro); }
.tarjetas { display: grid; grid-template-columns: repeat(auto-fit, minmax(430px, 1fr)); gap: 16px; }
.vacia p { margin: 0 0 8px; }
@media (max-width: 700px) {
  .tarjetas { grid-template-columns: 1fr; }
}
</style>
