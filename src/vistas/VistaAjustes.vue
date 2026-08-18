<script setup>
import { computed, ref } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import { NIVELES_DE_VERBORREA, usarNarrador } from '../almacen/narrador.js'
import { usarEconomia } from '../almacen/economia.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarProgreso } from '../almacen/progreso.js'
import { usarSombreros } from '../almacen/sombreros.js'
import { borrarPartida, exportarPartida, importarPartida } from '../almacen/persistencia.js'

const narrador = usarNarrador()
const progreso = usarProgreso()
const economia = usarEconomia()
const gatos = usarGatos()
const sombreros = usarSombreros()

const textoDePartida = ref('')
const aviso = ref('')
const confirmandoBorrado = ref(false)

const resumen = computed(() => [
  { titulo: 'Retos superados', valor: progreso.retosSuperados },
  { titulo: 'Mejor racha sin pistas', valor: progreso.mejorRacha },
  { titulo: 'Croquetas ganadas', valor: economia.ganadasEnTotal },
  { titulo: 'Croquetas gastadas en pistas', valor: economia.gastadasEnTotal },
  { titulo: 'Gatos en la colonia', valor: gatos.adoptados.length },
  { titulo: 'Sombreros encontrados', valor: `${sombreros.cuantos} de ${sombreros.total}` },
])

function copiarPartida() {
  textoDePartida.value = exportarPartida()
  aviso.value = 'Ahí tienes la partida. Cópiala y guárdala donde quieras.'
}

function traerPartida() {
  aviso.value = importarPartida(textoDePartida.value)
    ? 'Partida cargada. Recarga la página para verla.'
    : 'Eso no parece una partida de este juego.'
}

function empezarDeCero() {
  if (!confirmandoBorrado.value) {
    confirmandoBorrado.value = true
    return
  }
  borrarPartida()
  window.location.reload()
}
</script>

<template>
  <div class="pila">
    <section class="panel">
      <h1>Ajustes</h1>
      <p class="tenue">El progreso se guarda en este navegador. Ni cuentas ni servidores.</p>
    </section>

    <section class="panel">
      <h2>Cuánto habla Wayne</h2>
      <div class="opciones">
        <label v-for="nivel in NIVELES_DE_VERBORREA" :key="nivel.id" class="opcion">
          <input
            type="radio"
            name="verborrea"
            :value="nivel.id"
            :checked="narrador.verborrea === nivel.id"
            @change="narrador.cambiarVerborrea(nivel.id)"
          />
          <span>{{ nivel.titulo }}</span>
        </label>
      </div>
      <p class="tenue nota">
        Ni con la última se calla del todo: los avisos que hacen falta para resolver un reto
        los sigue dando.
      </p>
    </section>

    <section class="panel">
      <h2>Cómo va la cosa</h2>
      <ul class="resumen">
        <li v-for="dato in resumen" :key="dato.titulo">
          <span class="tenue">{{ dato.titulo }}</span>
          <strong>{{ dato.valor }}</strong>
        </li>
      </ul>
    </section>

    <section class="panel">
      <h2>Llevarte la partida a otro sitio</h2>
      <p class="tenue nota">
        El móvil y el ordenador son partidas distintas: cada navegador guarda la suya. Con esto
        se pasa de uno a otro.
      </p>
      <div class="fila botones">
        <button @click="copiarPartida">Exportar</button>
        <button :disabled="!textoDePartida.trim()" @click="traerPartida">Importar lo de abajo</button>
      </div>
      <textarea
        v-model="textoDePartida"
        rows="6"
        spellcheck="false"
        placeholder="Aquí saldrá tu partida al exportar, o pega aquí la que quieras importar."
      />
      <p v-if="aviso" class="aviso">{{ aviso }}</p>
    </section>

    <section class="panel peligro">
      <SombreroEscondido id="ajustes" :posicion="{ top: '14px', right: '16px' }" />
      <h2>Empezar de cero</h2>
      <p class="tenue nota">
        Se borra todo: retos, croquetas, trastos y gatos. No hay vuelta atrás.
      </p>
      <button class="borrar" @click="empezarDeCero">
        {{ confirmandoBorrado ? 'Pulsa otra vez para borrarlo todo' : 'Borrar la partida' }}
      </button>
    </section>
  </div>
</template>

<style scoped>
h2 { font-size: 1.05rem; }
.nota { font-size: 0.87rem; }

.opciones { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
.opcion { display: flex; align-items: center; gap: 9px; cursor: pointer; }
.opcion input { width: auto; padding: 0; }

.resumen { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
.resumen li { display: flex; justify-content: space-between; font-size: 0.92rem; }

.botones { margin-bottom: 10px; }
textarea { width: 100%; font-family: var(--mono); font-size: 0.78rem; resize: vertical; }
.aviso { margin: 8px 0 0; font-size: 0.87rem; color: var(--cobre-claro); }

.peligro { position: relative; border-color: rgba(224, 122, 114, 0.3); }
.borrar { border-color: rgba(224, 122, 114, 0.5); color: var(--rojo); }
.borrar:hover { background: rgba(224, 122, 114, 0.12); }
</style>
