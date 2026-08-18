<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { ENTORNOS } from '../motor/protocolo.js'

/**
 * El hueco donde vive el iframe del sandbox. No pinta nada por su cuenta: le
 * pasa su contenedor al puente y el puente mete ahí el iframe, para que el
 * jugador vea su componente de verdad, no una foto suya.
 */
const props = defineProps({
  puente: { type: Object, required: true },
  entorno: { type: String, required: true },
})

const hueco = ref(null)

onMounted(() => props.puente.montarEn(hueco.value))
onBeforeUnmount(() => props.puente.destruir())
</script>

<template>
  <section class="vista-previa">
    <div class="cabecera">
      <h3>Vista previa</h3>
      <span class="etiqueta">{{ ENTORNOS[entorno].etiqueta }}</span>
    </div>
    <div ref="hueco" class="lienzo" />
    <p class="tenue nota">
      Corre aislado del juego: tu código no puede tocar la partida ni esta página.
    </p>
  </section>
</template>

<style scoped>
.vista-previa { display: flex; flex-direction: column; }
.cabecera { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cabecera h3 { margin: 0; font-size: 0.95rem; }
.lienzo {
  flex: 1;
  min-height: 230px;
  background: #16131f;
  border: 1px solid var(--borde-suave);
  border-radius: var(--radio);
  overflow: hidden;
}
.nota { margin: 8px 0 0; font-size: 0.78rem; }
</style>
