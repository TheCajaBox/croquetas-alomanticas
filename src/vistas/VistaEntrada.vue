<script setup>
import { computed } from 'vue'

import Avatar from '../componentes/Avatar.vue'
import GatoSvg from '../componentes/GatoSvg.vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import { ITINERARIOS } from '../contenido/itinerarios.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarProgreso } from '../almacen/progreso.js'

/**
 * La puerta: qué se quiere aprender.
 *
 * Antes esto era la lista de mundos, y con un solo itinerario estaba bien. Con
 * varios, lo primero tiene que ser elegir, y **no se redirige solo** al que
 * venías jugando: si `/` salta directo al itinerario de siempre, los demás dejan
 * de existir para quien ya tenía partida. Se marca por dónde ibas en cada uno y
 * se elige igual.
 */
const progreso = usarProgreso()
const gatos = usarGatos()

const caminos = computed(() =>
  ITINERARIOS.map((itinerario) => {
    const avance = progreso.avanceDelItinerario(itinerario.id)
    const siguiente = progreso.porDondeIba(itinerario.id)
    return {
      ...itinerario,
      ...avance,
      siguiente,
      // Un itinerario sin mundos todavía no se puede jugar. Sale igual, para
      // que se vea que viene, pero no lleva a ninguna parte.
      enObras: avance.mundos === 0,
      porcentaje: avance.total ? Math.round((avance.hechos / avance.total) * 100) : 0,
    }
  }),
)

const colonia = computed(() => gatos.adoptados)

const NUMEROS = ['ningún', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete']
/** Contarlos a mano en el texto se rompe solo en cuanto se añade otro. */
const cuantos = computed(() => NUMEROS[caminos.value.length] ?? caminos.value.length)
const materias = computed(() => {
  const nombres = caminos.value.map((camino) => camino.materia)
  return `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`
})
</script>

<template>
  <div class="pila">
    <section class="panel bienvenida">
      <SombreroEscondido id="entrada" :posicion="{ top: '14px', right: '18px' }" />
      <h1>Aprende a programar y págalo en croquetas</h1>
      <p class="tenue entradilla">
        {{ cuantos.charAt(0).toUpperCase() + cuantos.slice(1) }} caminos —{{ materias }}— y código
        que se ejecuta de verdad, con sus tests: nada de elegir la respuesta correcta de una
        lista. Con lo que ganes das de comer a una colonia de gatos que vive en su casa y que,
        cuando están contentos, te devuelven el favor.
      </p>
      <p class="tenue entradilla">
        Todos comparten croquetas, gatos, sombreros e insignias, y no hay que terminar uno para
        empezar otro. Elige por dónde te apetece hoy.
      </p>
    </section>

    <div class="caminos">
      <component
        :is="camino.enObras ? 'div' : 'RouterLink'"
        v-for="camino in caminos"
        :key="camino.id"
        :to="camino.enObras ? undefined : { name: 'itinerario', params: { itinerarioId: camino.id } }"
        class="camino panel"
        :class="{ obras: camino.enObras }"
        :style="{ '--color-camino': camino.color }"
      >
        <div class="fila cabecera">
          <span class="etiqueta lenguaje">{{ camino.etiquetaLenguaje }}</span>
          <span v-if="camino.enObras" class="etiqueta obras-aviso">en obras</span>
          <span v-else-if="camino.hechos === camino.total" class="etiqueta hecho">completado</span>
        </div>

        <div class="fila titulo">
          <Avatar :quien="camino.reparto.narra" :tamano="56" />
          <div>
            <h2>{{ camino.nombre }}</h2>
            <p class="tenue ambiente">{{ camino.ambiente }}</p>
          </div>
        </div>

        <p class="resumen">{{ camino.resumen }}</p>
        <p class="tenue promesa">{{ camino.promesa }}</p>

        <p v-if="camino.enObras" class="tenue en-obras">
          Todavía no hay nada que jugar aquí. Está en camino.
        </p>

        <template v-else>
          <div class="avance">
            <div class="barra">
              <i :style="{ width: `${camino.porcentaje}%`, background: camino.color }" />
            </div>
            <span class="tenue cuenta">{{ camino.hechos }} de {{ camino.total }}</span>
          </div>

          <p class="siguiente">
            <template v-if="camino.siguiente">
              <span class="tenue">{{ camino.empezado ? 'Seguías por' : 'Empieza por' }}</span>
              «{{ camino.siguiente.titulo }}»
            </template>
            <template v-else>No te queda nada aquí.</template>
          </p>

          <span class="boton">{{ camino.empezado ? 'Seguir' : 'Empezar' }} →</span>
        </template>
      </component>
    </div>

    <RouterLink v-if="!progreso.vistoLaAntesala" to="/antesala" class="panel antesala-aviso">
      <Avatar quien="steris" :tamano="52" />
      <div>
        <p class="titulo-antesala">¿No has programado nunca?</p>
        <p class="tenue">
          Steris ha preparado una lista con lo que hay que saber antes de empezar, valga el
          camino que valga: qué es un programa, qué es un lenguaje y cómo funciona esto. Dos
          minutos.
        </p>
      </div>
      <span class="flecha" aria-hidden="true">→</span>
    </RouterLink>

    <section v-if="colonia.length" class="panel colonia">
      <div class="fila cabecera-colonia">
        <h2>Tu colonia</h2>
        <RouterLink to="/colonia" class="tenue">Ir a la casa →</RouterLink>
      </div>
      <p class="tenue vive-aqui">
        Los mismos gatos para todos los caminos: lo que ganes en uno se lo comen igual.
      </p>
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
  </div>
</template>

<style scoped>
.bienvenida { position: relative; }
.bienvenida h1 { max-width: 26ch; }
.entradilla { max-width: 70ch; margin: 0 0 0.8em; }
.entradilla:last-child { margin-bottom: 0; }

/* 400 y no 340: con cuatro caminos, a 340 entran tres en la primera fila y el
   cuarto se queda solo debajo. A 400 caen de dos en dos y se lee como una
   rejilla en vez de como una lista mal cortada. */
.caminos { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 18px; }
.camino {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  border-top: 3px solid var(--color-camino);
  transition: transform 0.15s, background 0.15s;
}
a.camino:hover { transform: translateY(-3px); background: var(--panel-alto); }
.camino.obras { opacity: 0.72; }

.cabecera { gap: 8px; }
.lenguaje { color: var(--color-camino); border-color: var(--color-camino); }
.obras-aviso, .hecho { font-size: 0.7rem; }

.titulo { gap: 14px; align-items: center; }
.titulo h2 { margin: 0 0 2px; font-size: 1.35rem; }
.ambiente { margin: 0; font-size: 0.83rem; }

.resumen { margin: 0; font-size: 0.94rem; }
.promesa { margin: 0; font-size: 0.86rem; font-style: italic; }
.en-obras { margin: 0; font-size: 0.86rem; }

.avance { display: flex; align-items: center; gap: 10px; margin-top: auto; }
.avance .barra { flex: 1; }
.cuenta { font-size: 0.8rem; white-space: nowrap; }

.siguiente { margin: 0; font-size: 0.88rem; }
.boton {
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: var(--radio-menudo);
  font-weight: 650;
  font-size: 0.92rem;
  color: var(--color-camino);
  border: 1px solid var(--color-camino);
}
a.camino:hover .boton { background: var(--color-camino); color: #16131f; }

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

.cabecera-colonia { justify-content: space-between; margin-bottom: 6px; }
.cabecera-colonia h2 { margin: 0; }
.cabecera-colonia a { text-decoration: none; font-size: 0.88rem; }
.vive-aqui { margin: 0 0 14px; font-size: 0.88rem; }
.miniaturas { display: flex; flex-wrap: wrap; gap: 14px; }
.miniatura { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; }
.miniatura .nombre { font-size: 0.78rem; }

@media (prefers-reduced-motion: reduce) {
  .camino, .antesala-aviso { transition: none; }
  a.camino:hover, .antesala-aviso:hover { transform: none; }
}
</style>
