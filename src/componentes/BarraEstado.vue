<script setup>
import { computed } from 'vue'

const props = defineProps({
  titulo: { type: String, required: true },
  valor: { type: Number, required: true },
})

/** Verde bien, ámbar regular, rojo mal: se lee de un vistazo y sin leer. */
const color = computed(() => {
  if (props.valor >= 60) return 'var(--verde)'
  if (props.valor >= 30) return 'var(--ambar)'
  return 'var(--rojo)'
})
</script>

<template>
  <div class="estado">
    <div class="cabecera">
      <span class="tenue">{{ titulo }}</span>
      <span :style="{ color }">{{ Math.round(valor) }}</span>
    </div>
    <div class="barra"><i :style="{ width: `${Math.max(0, Math.min(100, valor))}%`, background: color }" /></div>
  </div>
</template>

<style scoped>
.estado { flex: 1; min-width: 90px; }
.cabecera { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px; }
</style>
