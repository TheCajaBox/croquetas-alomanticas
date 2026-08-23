<script setup>
import { computed, ref } from 'vue'

import Avatar from '../componentes/Avatar.vue'
import Marcado from '../componentes/Marcado.vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import { glosarioPorMundos } from '../contenido/glosario.js'
import { ITINERARIOS } from '../contenido/itinerarios.js'
import { mundosDelItinerario } from '../contenido/mundos.js'
import { nombreDe } from '../contenido/personajes.js'
import { usarGlosario } from '../almacen/glosario.js'

const glosario = usarGlosario()
const filtro = ref('')

/**
 * Esta página se abre desde la barra, fuera de cualquier mundo, así que aquí no
 * hay camino que deducir: se elige.
 *
 * Y hace falta elegirlo, porque el glosario no es el mismo en los dos: `ref` y
 * `computed` son de Vue, `foreach` y la interpolación son de PHP, y «variable»
 * se explica con `const sombrero` o con `$sombrero` según dónde estés.
 *
 * Aquí sí sale el temario **completo** del camino, y a propósito: dentro de un
 * reto el glosario se corta en el mundo donde estás -no tiene sentido ofrecer
 * «herencia» en el tercer reto de La Ceniza-, pero esta página es la de
 * consultar, y se viene a ella justamente a mirar lo que no sabes todavía. Lo
 * que hace es **partirlo por mundos**: así se ve de un vistazo qué enseña cada
 * uno y en qué orden, que es media gracia de mirarlo.
 *
 * Solo salen los caminos que ya tienen mundos: anunciar un glosario de SQL sin
 * un solo reto de SQL sería prometer algo que no está.
 */
const CAMINOS = ITINERARIOS.filter((cada) => mundosDelItinerario(cada.id).length > 0).map((cada) => ({
  id: cada.id,
  etiqueta: cada.etiquetaLenguaje,
  quien: cada.reparto.glosario,
}))
const eleccion = ref(CAMINOS[0].id)
const camino = computed(() => CAMINOS.find((cada) => cada.id === eleccion.value) ?? CAMINOS[0])

const porMundos = computed(() => glosarioPorMundos(camino.value.id))
const cuantas = computed(() => porMundos.value.reduce((suma, grupo) => suma + grupo.entradas.length, 0))

/**
 * Cuántos de **estos** términos has consultado.
 *
 * Se cuenta aquí y no en el almacén por dos motivos. El primero es que el
 * almacén guarda solo identificadores -para que el corpus no viaje en el
 * arranque- y no puede saber cuáles son de este camino. El segundo es que así
 * el número cuadra con el que tiene al lado: antes decía «30 de 30 · 45
 * consultados», que es una cuenta global puesta al lado de una del camino.
 */
const consultados = computed(
  () =>
    porMundos.value.reduce(
      (suma, grupo) => suma + grupo.entradas.filter((entrada) => glosario.consultado(entrada.id)).length,
      0,
    ),
)

const sinTildes = (texto) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** El filtro se aplica dentro de cada mundo, y un mundo sin resultados no sale. */
const grupos = computed(() => {
  const buscado = sinTildes(filtro.value.trim())
  return porMundos.value
    .map((grupo) => ({
      ...grupo,
      entradas: [...grupo.entradas]
        .sort((a, b) => a.termino.localeCompare(b.termino, 'es'))
        .filter(
          (entrada) =>
            !buscado ||
            sinTildes(
              `${entrada.termino} ${(entrada.alias ?? []).join(' ')} ${entrada.definicion}`,
            ).includes(buscado),
        ),
    }))
    .filter((grupo) => grupo.entradas.length > 0)
})

const encontradas = computed(() => grupos.value.reduce((suma, g) => suma + g.entradas.length, 0))
</script>

<template>
  <div class="pila">
    <section class="panel encabezado">
      <SombreroEscondido id="glosario" :posicion="{ bottom: '16px', right: '18px' }" />

      <div class="cabecera">
        <Avatar :quien="camino.quien" :tamano="64" />
        <div>
          <h1>El glosario de {{ nombreDe(camino.quien) }}</h1>
          <p class="tenue">
            Toda palabra técnica que sale en el juego, explicada sin usar otras palabras
            técnicas sin explicar. Va por mundos y en el orden en que se juegan: no hace falta
            leerlo entero, está entero por si acaso.
          </p>
        </div>
      </div>

      <div class="fila herramientas">
        <input v-model="filtro" type="search" placeholder="Buscar un término…" class="buscador" />
        <!-- Un camino por lenguaje: los términos y los ejemplos cambian. -->
        <div v-if="CAMINOS.length > 1" class="fila caminos-glosario">
          <button
            v-for="cada in CAMINOS"
            :key="cada.id"
            type="button"
            class="menudo"
            :class="{ elegido: cada.id === eleccion }"
            @click="eleccion = cada.id"
          >
            {{ cada.etiqueta }}
          </button>
        </div>
        <span class="tenue cuenta">
          {{ encontradas }} de {{ cuantas }} · {{ consultados }} consultados
        </span>
      </div>
    </section>

    <section v-for="grupo in grupos" :key="grupo.mundo.id" class="mundo-glosario">
      <div class="fila cabecera-mundo">
        <h2>{{ grupo.mundo.nombre }}</h2>
        <span class="tenue">{{ grupo.entradas.length }} términos · aquí se aprenden</span>
      </div>

      <div class="rejilla">
        <article
          v-for="entrada in grupo.entradas"
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
    </section>

    <p v-if="!grupos.length" class="panel centrado tenue">
      Nada con ese nombre. {{ nombreDe(camino.quien) }} pide disculpas y toma nota.
    </p>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.cabecera { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
.cabecera h1 { margin: 0 0 6px; }
.cabecera p { max-width: 70ch; margin: 0; }

.herramientas { justify-content: space-between; }
.caminos-glosario { gap: 6px; }
.caminos-glosario .elegido { color: var(--cobre-claro); border-color: var(--cobre); }

.buscador { flex: 1; max-width: 320px; }
.cuenta { font-size: 0.85rem; }

.mundo-glosario { display: flex; flex-direction: column; gap: 10px; }
.cabecera-mundo { justify-content: space-between; align-items: baseline; }
.cabecera-mundo h2 { margin: 0; font-size: 1.05rem; color: var(--cobre-claro); }
.cabecera-mundo span { font-size: 0.82rem; }

.rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 14px; }
.termino h3 { margin: 0 0 2px; font-size: 1rem; color: var(--cobre-claro); }
.termino.visto h3::after { content: ' ✓'; color: var(--verde); font-size: 0.8em; }
.alias { margin: 0 0 8px; font-size: 0.78rem; }
.definicion { font-size: 0.9rem; margin-bottom: 10px; }
.termino pre { margin: 0; font-size: 0.8rem; padding: 9px 11px; }
</style>
