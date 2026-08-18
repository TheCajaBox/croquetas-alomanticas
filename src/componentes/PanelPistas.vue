<script setup>
import { computed, ref } from 'vue'
import SombreroEscondido from './SombreroEscondido.vue'

import Marcado from './Marcado.vue'
import { usarEconomia } from '../almacen/economia.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarJuego } from '../almacen/juego.js'
import { usarProgreso } from '../almacen/progreso.js'
import { TRASTOS_POR_ID } from '../contenido/trastos.js'

const props = defineProps({ reto: { type: Object, required: true } })

const juego = usarJuego()
const progreso = usarProgreso()
const economia = usarEconomia()
const gatos = usarGatos()

const ultimoTrasto = ref(null)
const aviso = ref('')

const compradas = computed(() => progreso.ficha(props.reto.id).pistasUsadas)

const pistas = computed(() =>
  props.reto.pistas.map((pista, nivel) => {
    const precio = juego.precioDePista(props.reto, nivel)
    const anteriorPedida = nivel === 0 || compradas.value.includes(nivel - 1)
    return {
      nivel,
      texto: pista.texto,
      precio,
      comprada: compradas.value.includes(nivel),
      // Las pistas se piden en orden: la tercera sin haber leído la segunda no
      // tiene ningún sentido, y además se saltaría lo barato para ir a lo caro.
      disponible: anteriorPedida,
      asequible: precio === 0 || economia.puedePagar(precio),
    }
  }),
)

const cortesiaDeCobre = computed(() => gatos.bonusDiarioDisponible('pistaGratisDiaria'))

function pedir(nivel) {
  aviso.value = ''
  const resultado = juego.comprarPista(props.reto, nivel)
  if (!resultado.ok) {
    aviso.value = resultado.motivo ?? 'Ahora mismo no.'
    return
  }
  if (resultado.trasto) ultimoTrasto.value = resultado.trasto
}
</script>

<template>
  <section class="pistas panel">
    <SombreroEscondido id="pistas" :posicion="{ bottom: '12px', right: '14px' }" :tamano="17" />
    <div class="cabecera">
      <h3>Pistas de Wayne</h3>
      <span class="tenue saldo">{{ economia.croquetas }} croquetas</span>
    </div>

    <p v-if="cortesiaDeCobre" class="cortesia">
      Cobre te cubre una pista de pago hoy. Wayne no se ha enterado.
    </p>

    <ol class="lista">
      <li v-for="pista in pistas" :key="pista.nivel" :class="{ abierta: pista.comprada }">
        <template v-if="pista.comprada">
          <Marcado class="texto" :texto="pista.texto" />
        </template>
        <template v-else>
          <button
            class="pedir"
            :disabled="!pista.disponible || !pista.asequible"
            @click="pedir(pista.nivel)"
          >
            <span>Pista {{ pista.nivel + 1 }}</span>
            <span class="precio">{{ pista.precio === 0 ? 'gratis' : `${pista.precio} croquetas` }}</span>
          </button>
          <p v-if="!pista.disponible" class="tenue condicion">Antes lee la anterior.</p>
          <p v-else-if="!pista.asequible" class="tenue condicion">No te llegan las croquetas.</p>
        </template>
      </li>
    </ol>

    <p v-if="aviso" class="aviso">{{ aviso }}</p>

    <div v-if="ultimoTrasto" class="trasto">
      <p class="titulo">A cambio, Wayne te deja</p>
      <p class="nombre">{{ ultimoTrasto.nombre }}</p>
      <p class="nota tenue">{{ TRASTOS_POR_ID[ultimoTrasto.id].nota }}</p>
    </div>
  </section>
</template>

<style scoped>
.pistas { position: relative; }
.cabecera { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
.cabecera h3 { margin: 0; }
.saldo { font-size: 0.85rem; }

.cortesia {
  font-size: 0.84rem;
  color: var(--verde);
  background: rgba(95, 185, 138, 0.10);
  border: 1px solid rgba(95, 185, 138, 0.28);
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 12px;
}

.lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.pedir { width: 100%; display: flex; justify-content: space-between; gap: 12px; }
.precio { color: var(--cobre-claro); font-weight: 600; }
.pedir:disabled .precio { color: inherit; }
.condicion { margin: 4px 0 0; font-size: 0.8rem; }

li.abierta .texto {
  padding: 11px 13px;
  font-size: 0.92rem;
  background: var(--panel-alto);
  border-left: 3px solid var(--cobre);
  border-radius: 0 8px 8px 0;
}

.aviso { margin: 12px 0 0; font-size: 0.86rem; color: var(--rojo); }

.trasto {
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px dashed var(--borde);
  border-radius: 8px;
}
.trasto .titulo { margin: 0 0 4px; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--texto-apagado); }
.trasto .nombre { margin: 0 0 3px; font-weight: 600; }
.trasto .nota { margin: 0; font-size: 0.84rem; font-style: italic; }
</style>
