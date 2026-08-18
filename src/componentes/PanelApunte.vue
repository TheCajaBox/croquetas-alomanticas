<script setup>
import { ref } from 'vue'

import Marcado from './Marcado.vue'

/**
 * El apunte de Wax: la explicación del concepto que hace falta para el reto.
 *
 * No es una pista y no cuesta nada. Wayne cobra por decirte la respuesta; esto
 * es el material, y el material no se cobra. Viene abierto mientras el reto
 * está sin resolver, porque la idea es leerlo antes de pelearse con el código.
 */
const props = defineProps({
  texto: { type: String, required: true },
  empiezaAbierto: { type: Boolean, default: true },
})

const abierto = ref(props.empiezaAbierto)
</script>

<template>
  <section class="apunte panel" :class="{ cerrado: !abierto }">
    <button class="titulo" :aria-expanded="abierto" @click="abierto = !abierto">
      <svg class="retrato" viewBox="0 0 64 64" aria-hidden="true">
        <ellipse cx="32" cy="36" rx="13" ry="16" fill="#d9b48e" />
        <rect x="11" y="25" width="42" height="4" rx="2" fill="#1f2630" />
        <rect x="21" y="8" width="22" height="18" rx="2" fill="#2b3540" />
        <rect x="21" y="20" width="22" height="4" fill="#4a5866" />
        <circle cx="27" cy="36" r="2" fill="#1f2630" />
        <circle cx="37" cy="36" r="2" fill="#1f2630" />
        <path d="M27 45 L37 45" stroke="#1f2630" stroke-width="2" stroke-linecap="round" />
      </svg>
      <span class="texto-titulo">
        <span class="quien">El apunte de Wax</span>
        <span class="coletilla">gratis, esto no se cobra</span>
      </span>
      <span class="flecha" aria-hidden="true">{{ abierto ? '▾' : '▸' }}</span>
    </button>

    <div v-show="abierto" class="cuerpo">
      <Marcado :texto="texto" />
    </div>
  </section>
</template>

<style scoped>
.apunte {
  border-left: 3px solid #6f93b0;
  background: linear-gradient(180deg, #232c36, #1f262f);
  padding: 0;
  overflow: hidden;
}

.titulo {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  background: none;
  border: none;
  border-radius: 0;
  text-align: left;
  color: inherit;
}
.titulo:hover { background: rgba(143, 180, 208, 0.07); }

.retrato { width: 32px; height: 32px; flex-shrink: 0; }
.texto-titulo { display: flex; flex-direction: column; line-height: 1.25; flex: 1; }
.quien { font-weight: 650; color: #8fb4d0; }
.coletilla { font-size: 0.76rem; color: var(--texto-apagado); }
.flecha { color: var(--texto-apagado); font-size: 0.8rem; }

.cuerpo {
  padding: 2px 18px 18px;
  font-size: 0.93rem;
}
.cuerpo :deep(pre) { background: #191f27; border-color: #2c3742; }
.cuerpo :deep(code) { background: rgba(143, 180, 208, 0.14); color: #a8cbe4; }
.cuerpo :deep(p:last-child) { margin-bottom: 0; }
</style>
