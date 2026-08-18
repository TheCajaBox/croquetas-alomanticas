<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import Narrador from './componentes/Narrador.vue'
import { usarEconomia } from './almacen/economia.js'
import { usarGatos } from './almacen/gatos.js'
import { usarProgreso } from './almacen/progreso.js'
import { RETOS } from './contenido/retos/index.js'

const economia = usarEconomia()
const gatos = usarGatos()
const progreso = usarProgreso()
const { croquetas } = storeToRefs(economia)

const enElRefugio = computed(() => gatos.enElRefugio.length)
const avance = computed(() => `${progreso.retosSuperados}/${RETOS.length}`)
</script>

<template>
  <div class="juego">
    <header class="cabecera">
      <div class="contenedor barra-superior">
        <RouterLink to="/" class="marca">
          <span class="titulo">Gatos y Código</span>
          <span class="apagado lema">narra Wayne · pagan los gatos</span>
        </RouterLink>

        <nav class="navegacion">
          <RouterLink to="/">Mundos</RouterLink>
          <RouterLink to="/colonia">Colonia</RouterLink>
          <RouterLink to="/refugio" class="con-aviso">
            Refugio
            <span v-if="enElRefugio" class="aviso">{{ enElRefugio }}</span>
          </RouterLink>
          <RouterLink to="/trastos">Trastos</RouterLink>
          <RouterLink to="/ajustes">Ajustes</RouterLink>
        </nav>

        <div class="contadores">
          <span class="contador" title="Retos superados">{{ avance }}</span>
          <span class="contador croquetas" title="Croquetas">{{ croquetas }}</span>
        </div>
      </div>
    </header>

    <main class="contenedor principal">
      <RouterView :key="$route.fullPath" />
    </main>

    <Narrador />
  </div>
</template>

<style scoped>
.juego { min-height: 100%; display: flex; flex-direction: column; }

.cabecera {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(20, 18, 26, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--borde-suave);
}
.barra-superior {
  display: flex;
  align-items: center;
  gap: 22px;
  height: 62px;
}

.marca { text-decoration: none; color: inherit; display: flex; flex-direction: column; line-height: 1.15; }
.titulo { font-weight: 700; letter-spacing: -0.01em; }
.lema { font-size: 0.72rem; }

.navegacion { display: flex; gap: 4px; margin-left: auto; flex-wrap: wrap; }
.navegacion a {
  position: relative;
  color: var(--texto-tenue);
  text-decoration: none;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 0.92rem;
}
.navegacion a:hover { color: var(--texto); background: var(--panel); }
.navegacion a.router-link-active { color: var(--cobre-claro); background: rgba(201, 139, 75, 0.12); }

.con-aviso { display: inline-flex; align-items: center; gap: 6px; }
.aviso {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--cobre);
  color: #241705;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.contadores { display: flex; gap: 8px; }
.contador {
  font-variant-numeric: tabular-nums;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 5px 11px;
  border: 1px solid var(--borde);
  border-radius: 999px;
  color: var(--texto-tenue);
}
.contador.croquetas { color: var(--cobre-claro); border-color: rgba(201, 139, 75, 0.4); }
.contador.croquetas::after { content: ' ●'; font-size: 0.7em; }

.principal { padding-top: 28px; padding-bottom: 120px; flex: 1; }

@media (max-width: 860px) {
  .barra-superior { height: auto; padding-top: 12px; padding-bottom: 12px; flex-wrap: wrap; }
  .navegacion { order: 3; width: 100%; margin-left: 0; }
}
</style>
