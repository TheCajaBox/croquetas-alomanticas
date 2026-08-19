<script setup>
import { computed, ref } from 'vue'

import Avatar from '../componentes/Avatar.vue'
import Marcado from '../componentes/Marcado.vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import { GLOSARIO } from '../contenido/glosario.js'
import { usarGlosario } from '../almacen/glosario.js'

const glosario = usarGlosario()
const filtro = ref('')

const sinTildes = (texto) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const entradas = computed(() => {
  const buscado = sinTildes(filtro.value.trim())
  const ordenadas = [...GLOSARIO].sort((a, b) => a.termino.localeCompare(b.termino, 'es'))
  if (!buscado) return ordenadas
  return ordenadas.filter((entrada) =>
    sinTildes(`${entrada.termino} ${(entrada.alias ?? []).join(' ')} ${entrada.definicion}`).includes(buscado),
  )
})
</script>

<template>
  <div class="pila">
    <section class="panel encabezado">
      <SombreroEscondido id="glosario" :posicion="{ bottom: '16px', right: '18px' }" />

      <div class="cabecera">
        <Avatar quien="steris" :tamano="64" />
        <div>
          <h1>El glosario de Steris</h1>
          <p class="tenue">
            Toda palabra técnica que sale en el juego, explicada sin usar otras palabras
            técnicas sin explicar. No hace falta leerlo entero: está entero por si acaso.
          </p>
        </div>
      </div>

      <div class="fila herramientas">
        <input v-model="filtro" type="search" placeholder="Buscar un término…" class="buscador" />
        <span class="tenue cuenta">
          {{ entradas.length }} de {{ GLOSARIO.length }} · {{ glosario.cuantosConsultados }} consultados
        </span>
      </div>
    </section>

    <div class="rejilla">
      <article
        v-for="entrada in entradas"
        :key="entrada.id"
        class="termino panel"
        :class="{ visto: glosario.consultado(entrada.id) }"
      >
        <h3>{{ entrada.termino }}</h3>
        <p v-if="entrada.alias?.length" class="tenue alias">
          también: {{ entrada.alias.join(', ') }}
        </p>
        <!-- Sin enlazar: dentro del glosario, enlazar al glosario no lleva a nada. -->
        <Marcado class="definicion" :texto="entrada.definicion" :enlazar="false" />
        <pre v-if="entrada.ejemplo"><code>{{ entrada.ejemplo }}</code></pre>
      </article>
    </div>

    <p v-if="!entradas.length" class="panel centrado tenue">
      Nada con ese nombre. Steris pide disculpas y toma nota.
    </p>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.cabecera { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
.cabecera h1 { margin: 0 0 6px; }
.cabecera p { max-width: 70ch; margin: 0; }

.herramientas { justify-content: space-between; }
.buscador { flex: 1; max-width: 320px; }
.cuenta { font-size: 0.85rem; }

.rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px; }
.termino h3 { margin: 0 0 2px; font-size: 1rem; color: var(--cobre-claro); }
.termino.visto h3::after { content: ' ✓'; color: var(--verde); font-size: 0.8em; }
.alias { margin: 0 0 8px; font-size: 0.78rem; }
.definicion { font-size: 0.9rem; margin-bottom: 10px; }
.termino pre { margin: 0; font-size: 0.8rem; padding: 9px 11px; }
</style>
