<script setup>
import { computed } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import { TRASTOS, TRASTOS_POR_ID } from '../contenido/trastos.js'
import { usarEconomia } from '../almacen/economia.js'

const economia = usarEconomia()

const mios = computed(() =>
  [...new Set(economia.trastos)].map((id) => ({
    ...TRASTOS_POR_ID[id],
    veces: economia.trastos.filter((otro) => otro === id).length,
  })),
)
</script>

<template>
  <div class="pila">
    <section class="panel encabezado">
      <SombreroEscondido id="trastos" :posicion="{ bottom: '16px', right: '18px' }" />
      <h1>El cajón de los trastos</h1>
      <p class="tenue">
        Wayne no roba: intercambia. Cada pista que le compras se paga en croquetas y él, muy
        serio, te deja algo a cambio. Nada de esto vale nada ni sirve para nada; es solo el
        recordatorio de cuántas veces has pedido ayuda.
      </p>
      <p class="cuenta">
        {{ economia.trastos.length }} intercambio{{ economia.trastos.length === 1 ? '' : 's' }} ·
        {{ mios.length }} de {{ TRASTOS.length }} trastos distintos
      </p>
    </section>

    <div v-if="mios.length" class="rejilla">
      <article v-for="trasto in mios" :key="trasto.id" class="trasto panel">
        <div class="fila cabecera">
          <h3>{{ trasto.nombre }}</h3>
          <span v-if="trasto.veces > 1" class="etiqueta">×{{ trasto.veces }}</span>
        </div>
        <p class="tenue nota">{{ trasto.nota }}</p>
      </article>
    </div>

    <section v-else class="panel centrado">
      <p class="tenue">El cajón está vacío. Enhorabuena: no has pedido ni una pista de pago.</p>
    </section>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.encabezado p { max-width: 72ch; }
.cuenta { margin: 0; font-size: 0.9rem; color: var(--cobre-claro); }
.rejilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
.cabecera { justify-content: space-between; margin-bottom: 6px; }
.trasto h3 { margin: 0; font-size: 0.98rem; }
.nota { margin: 0; font-size: 0.86rem; font-style: italic; }
</style>
