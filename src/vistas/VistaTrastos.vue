<script setup>
import { computed } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import { RECORTES } from '../contenido/recortes.js'
import { TRASTOS, TRASTOS_POR_ID } from '../contenido/trastos.js'
import { usarEconomia } from '../almacen/economia.js'

import { usarRecortes } from '../almacen/recortes.js'

const economia = usarEconomia()
const recortes = usarRecortes()

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
      <h1>El cajón</h1>
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
      <p class="tenue">De momento no hay trastos. Enhorabuena: no has pedido ni una pista de pago.</p>
    </section>

    <section class="panel encabezado recortes-cabecera">
      <h2>Recortes del Elendel Daily</h2>
      <p class="tenue">
        Aparecen solos, y no por buscarlos: se consiguen haciendo cosas. Cuáles, no se dice.
        El titular es cosa del periódico; lo de abajo suele merecer la pena.
      </p>
      <p class="cuenta">{{ recortes.cuantos }} de {{ recortes.total }} recortes</p>
    </section>

    <div v-if="recortes.mios.length" class="rejilla">
      <article v-for="recorte in recortes.mios" :key="recorte.id" class="recorte panel">
        <p class="cabecera-periodico">Elendel Daily</p>
        <h3>{{ recorte.titular }}</h3>
        <p class="entradilla">{{ recorte.entradilla }}</p>
        <p class="consejo">{{ recorte.consejo }}</p>
      </article>
    </div>

    <section v-else class="panel centrado">
      <p class="tenue">Ni un recorte todavía. Sigue jugando; ya caerá alguno.</p>
    </section>

    <p class="tenue nota-final">
      Faltan {{ recortes.total - recortes.cuantos }} recorte(s) por descubrir de
      {{ RECORTES.length }}.
    </p>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.encabezado p { max-width: 72ch; }
.cuenta { margin: 0; font-size: 0.9rem; color: var(--cobre-claro); }
.rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.recortes-cabecera { margin-top: 8px; }
.recortes-cabecera h2 { margin-bottom: 6px; }

/* Los recortes van con aire de papel viejo, para que no parezcan una tarjeta más. */
.recorte {
  background: linear-gradient(180deg, #262032, #201b2a);
  border-color: #3d3552;
}
.cabecera-periodico {
  margin: 0 0 8px;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--texto-apagado);
  border-bottom: 1px solid var(--borde-suave);
  padding-bottom: 6px;
}
.recorte h3 {
  margin: 0 0 8px;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  line-height: 1.3;
}
.entradilla { margin: 0 0 12px; font-size: 0.86rem; font-style: italic; color: var(--texto-tenue); }
.consejo {
  margin: 0;
  font-size: 0.87rem;
  padding-top: 10px;
  border-top: 1px dashed var(--borde);
}
.nota-final { text-align: center; font-size: 0.85rem; margin: 0; }
.cabecera { justify-content: space-between; margin-bottom: 6px; }
.trasto h3 { margin: 0; font-size: 0.98rem; }
.nota { margin: 0; font-size: 0.86rem; font-style: italic; }
</style>
