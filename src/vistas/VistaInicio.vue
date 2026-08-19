<script setup>
import { computed } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import { MUNDOS } from '../contenido/mundos.js'
import { retosDelMundo } from '../contenido/retos/index.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarProgreso } from '../almacen/progreso.js'
import Avatar from '../componentes/Avatar.vue'
import GatoSvg from '../componentes/GatoSvg.vue'
import wayneRetrato from '../recursos/wayne-retrato.webp'

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
      <SombreroEscondido id="mundos" :posicion="{ top: '14px', right: '18px' }" />

      <div class="texto-portada">
        <h1>Aprende a programar y págalo en croquetas</h1>
        <p class="tenue entradilla">
          Cuatro mundos, veintiocho retos y código que se ejecuta de verdad: nada de elegir
          la respuesta correcta de una lista. Se empieza señalando y colocando piezas, y se
          acaba montando componentes de Vue.
        </p>
        <p class="tenue entradilla">
          Wayne lo cuenta todo, se ríe de lo que haces y te vende pistas a precio de amigo.
          Con lo que ganes das de comer a una colonia de gatos que, cuando están contentos,
          te devuelven el favor.
        </p>
      </div>

      <!-- Wayne, en grande y presidiendo. Es su juego, al fin y al cabo. -->
      <figure class="anfitrion">
        <img
          :src="wayneRetrato"
          class="retrato-wayne"
          width="480"
          height="700"
          alt="Wayne, con su sombrero y el bastón al hombro"
        />
        <figcaption>«Yo no robo. Intercambio.»</figcaption>
      </figure>
    </section>

    <RouterLink v-if="!progreso.vistoLaAntesala" to="/antesala" class="panel antesala-aviso">
      <Avatar quien="steris" :tamano="52" />
      <div>
        <p class="titulo-antesala">¿No has programado nunca?</p>
        <p class="tenue">
          Steris ha preparado una lista con lo que hay que saber antes de empezar: qué es un
          programa, qué pintan aquí JavaScript y Vue, y cómo funciona esto. Dos minutos.
        </p>
      </div>
      <span class="flecha" aria-hidden="true">→</span>
    </RouterLink>

    <h2>Mundos</h2>
    <div class="mundos escalonado">
      <component
        :is="mundo.disponible ? 'RouterLink' : 'div'"
        v-for="(mundo, orden) in mundos"
        :key="mundo.id"
        :to="mundo.disponible ? { name: 'mundo', params: { mundoId: mundo.id } } : undefined"
        class="mundo panel"
        :class="{ bloqueado: !mundo.disponible }"
        :style="{ '--color-mundo': mundo.color, '--orden': orden }"
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
.portada {
  position: relative;
  display: flex;
  align-items: center;
  gap: 26px;
  background: linear-gradient(150deg, #26203a, #1c1826);
  border-color: var(--borde);
}
.texto-portada { flex: 1; min-width: 0; }
.portada h1 { max-width: 20ch; }
.entradilla { max-width: 62ch; margin: 0 0 0.8em; }
.entradilla:last-child { margin-bottom: 0; }

.anfitrion { flex-shrink: 0; margin: 0; text-align: center; }
.retrato-wayne {
  display: block;
  width: 200px;
  height: auto;
  /* Un poco de sombra para que no parezca pegado sobre el panel. */
  filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.45));
}
.anfitrion figcaption {
  margin-top: 4px;
  font-size: 0.8rem;
  font-style: italic;
  color: var(--cobre-claro);
}

@media (max-width: 760px) {
  .portada { flex-direction: column-reverse; align-items: flex-start; }
  .anfitrion { align-self: center; }
}

.antesala-aviso {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  border-left: 3px solid #9aa8d8;
  background: linear-gradient(180deg, #2a2a3d, #232235);
  transition: transform 0.14s, background 0.14s;
}
.antesala-aviso:hover { transform: translateX(3px); background: #302f45; }
.titulo-antesala { margin: 0 0 4px; font-weight: 650; }
.antesala-aviso p.tenue { margin: 0; font-size: 0.89rem; max-width: 72ch; }
.antesala-aviso .flecha { margin-left: auto; color: #9aa8d8; font-size: 1.2rem; }

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
