<script setup>
import { computed } from 'vue'

import { MUNDOS } from '../contenido/mundos.js'
import { retosDelMundo } from '../contenido/retos/index.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarProgreso } from '../almacen/progreso.js'
import GatoSvg from '../componentes/GatoSvg.vue'

const progreso = usarProgreso()
const gatos = usarGatos()

const mundos = computed(() =>
  MUNDOS.map((mundo) => {
    const total = retosDelMundo(mundo.id).length
    const hechos = progreso.superadosDelMundo(mundo.id)
    return {
      ...mundo,
      total,
      hechos,
      porcentaje: total ? Math.round((hechos / total) * 100) : 0,
      disponible: progreso.mundoDisponible(mundo.id),
      completado: progreso.mundoCompletado(mundo.id),
    }
  }),
)

const colonia = computed(() => gatos.adoptados)
</script>

<template>
  <div class="pila">
    <section class="portada panel">
      <h1>Aprende a programar y págalo en croquetas</h1>
      <p class="tenue entradilla">
        Tres mundos, veintiún retos y código que se ejecuta de verdad: nada de elegir la
        respuesta correcta de una lista. Wayne comenta lo que haces, te vende pistas a precio
        de amigo y con lo que ganes das de comer a una colonia de gatos que, cuando están
        contentos, te devuelven el favor.
      </p>
    </section>

    <h2>Mundos</h2>
    <div class="mundos">
      <component
        :is="mundo.disponible ? 'RouterLink' : 'div'"
        v-for="mundo in mundos"
        :key="mundo.id"
        :to="mundo.disponible ? { name: 'mundo', params: { mundoId: mundo.id } } : undefined"
        class="mundo panel"
        :class="{ bloqueado: !mundo.disponible }"
        :style="{ '--color-mundo': mundo.color }"
      >
        <div class="fila cabecera">
          <span class="etiqueta" :style="{ color: mundo.color, borderColor: mundo.color }">
            {{ mundo.subtitulo }}
          </span>
          <span v-if="mundo.completado" class="etiqueta superado">completado</span>
          <span v-else-if="!mundo.disponible" class="etiqueta bloqueado">cerrado</span>
        </div>

        <h3>{{ mundo.nombre }}</h3>
        <p class="tenue resumen">{{ mundo.resumen }}</p>

        <p v-if="!mundo.disponible" class="tenue candado">
          Antes hay que terminar Los Áridos.
        </p>

        <div v-else class="avance">
          <div class="barra"><i :style="{ width: `${mundo.porcentaje}%`, background: mundo.color }" /></div>
          <span class="tenue cuenta">{{ mundo.hechos }} de {{ mundo.total }}</span>
        </div>
      </component>
    </div>

    <section v-if="colonia.length" class="colonia panel">
      <div class="fila cabecera-colonia">
        <h2>Tu colonia</h2>
        <RouterLink to="/colonia" class="tenue">Ir a cuidarlos →</RouterLink>
      </div>
      <div class="miniaturas">
        <RouterLink v-for="gato in colonia" :key="gato.id" to="/colonia" class="miniatura" :title="gato.nombre">
          <GatoSvg
            :aspecto="gato.aspecto"
            :animo="gato.felicidad >= 60 ? 'contento' : gato.felicidad >= 30 ? 'normal' : 'triste'"
            :tamano="62"
          />
          <span class="nombre tenue">{{ gato.nombre }}</span>
        </RouterLink>
      </div>
    </section>

    <section v-else class="panel centrado sin-gatos">
      <p class="tenue">
        Todavía no tienes ningún gato. Supera un reto y Wayne te llevará al refugio.
      </p>
    </section>
  </div>
</template>

<style scoped>
.portada { background: linear-gradient(150deg, #26203a, #1c1826); border-color: var(--borde); }
.portada h1 { max-width: 22ch; }
.entradilla { max-width: 68ch; margin: 0; }

.mundos { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.mundo {
  display: block;
  text-decoration: none;
  color: inherit;
  border-top: 3px solid var(--color-mundo);
  transition: transform 0.15s, border-color 0.15s, background 0.15s;
}
a.mundo:hover { transform: translateY(-2px); background: var(--panel-alto); }
.mundo.bloqueado { opacity: 0.55; }
.cabecera { margin-bottom: 10px; }
.mundo h3 { margin-bottom: 6px; }
.resumen { font-size: 0.9rem; min-height: 3em; }
.candado { font-size: 0.85rem; margin: 0; }
.avance { display: flex; align-items: center; gap: 10px; }
.avance .barra { flex: 1; }
.cuenta { font-size: 0.8rem; white-space: nowrap; }

.cabecera-colonia { justify-content: space-between; margin-bottom: 14px; }
.cabecera-colonia h2 { margin: 0; }
.cabecera-colonia a { text-decoration: none; font-size: 0.88rem; }
.miniaturas { display: flex; flex-wrap: wrap; gap: 14px; }
.miniatura { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; }
.miniatura .nombre { font-size: 0.78rem; }
.sin-gatos p { margin: 0; }
</style>
