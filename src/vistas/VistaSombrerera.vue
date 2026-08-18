<script setup>
import { computed } from 'vue'

import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import { CROQUETAS_POR_SOMBRERO } from '../contenido/sombreros.js'
import { usarSombreros } from '../almacen/sombreros.js'

const sombreros = usarSombreros()
const lista = computed(() => sombreros.lista)
</script>

<template>
  <div class="pila">
    <section class="panel encabezado">
      <!-- El chiste de la casa: uno de los doce está aquí mismo. -->
      <SombreroEscondido id="sombrerera" :posicion="{ bottom: '14px', right: '18px' }" :tamano="22" />

      <h1>La sombrerera</h1>
      <p class="tenue">
        Wayne ha ido dejando sombreros por todo el juego. Están medio escondidos, así que hay que
        pasar el ratón por los rincones. Cada uno que encuentres, él jurará que era suyo y te lo
        cambiará por {{ CROQUETAS_POR_SOMBRERO }} croquetas. Tú te lo quedas igual.
      </p>
      <p class="cuenta">{{ sombreros.cuantos }} de {{ sombreros.total }} encontrados</p>
      <div class="barra"><i :style="{ width: `${(sombreros.cuantos / sombreros.total) * 100}%` }" /></div>
    </section>

    <section v-if="sombreros.estanTodos" class="panel completo">
      <h2>Los doce</h2>
      <p>
        No queda ni uno escondido. Wayne dice que se siente raro y que te los quedes todos, que se
        te da mejor guardarlos que a él.
      </p>
    </section>

    <div class="rejilla escalonado">
      <article
        v-for="(sombrero, orden) in lista"
        :key="sombrero.id"
        :style="{ '--orden': orden }"
        class="ficha panel"
        :class="{ vacia: !sombrero.encontrado }"
      >
        <svg class="dibujo" viewBox="0 0 32 24" aria-hidden="true">
          <ellipse cx="16" cy="19" rx="15" ry="4" fill="currentColor" />
          <path d="M6 19 Q 6 4 16 4 Q 26 4 26 19 Z" fill="currentColor" />
          <rect x="5.5" y="14" width="21" height="4" rx="2" fill="rgba(0,0,0,0.45)" />
        </svg>

        <template v-if="sombrero.encontrado">
          <h3>{{ sombrero.nombre }}</h3>
          <p class="tenue donde">{{ sombrero.donde }}</p>
          <p class="dice">«{{ sombrero.dice }}»</p>
        </template>
        <template v-else>
          <h3 class="apagado">Sin encontrar</h3>
          <p class="pista">{{ sombrero.pista }}</p>
        </template>
      </article>
    </div>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.encabezado p { max-width: 72ch; }
.cuenta { margin: 0 0 8px; font-size: 0.9rem; color: var(--cobre-claro); }
.encabezado .barra > i { background: var(--cobre); }

.completo { border-color: rgba(201, 139, 75, 0.45); background: rgba(201, 139, 75, 0.08); }
.completo h2 { margin-bottom: 6px; }
.completo p { margin: 0; max-width: 70ch; }

.rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
.ficha { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
.dibujo { width: 46px; height: 35px; color: var(--cobre); margin-bottom: 4px; }
.ficha h3 { margin: 0; font-size: 0.98rem; }
.donde { margin: 0; font-size: 0.84rem; }
.dice { margin: 6px 0 0; font-size: 0.86rem; font-style: italic; color: var(--texto-tenue); }

.ficha.vacia { border-style: dashed; opacity: 0.75; }
.ficha.vacia .dibujo { color: var(--borde); }
.pista { margin: 4px 0 0; font-size: 0.86rem; color: var(--texto-tenue); }
</style>
