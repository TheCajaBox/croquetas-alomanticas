<script setup>
import { computed, ref } from 'vue'
import SombreroEscondido from './SombreroEscondido.vue'

import Marcado from './Marcado.vue'
import Avatar from './Avatar.vue'
import { usarEconomia } from '../almacen/economia.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarJuego } from '../almacen/juego.js'
import { usarProgreso } from '../almacen/progreso.js'
import { TRASTOS_POR_ID } from '../contenido/trastos.js'
import { MUNDOS_POR_ID } from '../contenido/mundos.js'
import { repartoDelMundo } from '../contenido/itinerarios.js'
import { nombreDe } from '../contenido/personajes.js'

const props = defineProps({ reto: { type: Object, required: true } })

const juego = usarJuego()
const progreso = usarProgreso()
const economia = usarEconomia()
const gatos = usarGatos()

/**
 * Quién vende las pistas aquí. En la segunda era es Wayne; en la primera,
 * Fantasma. Estaba escrito a mano y La Ceniza salía con «Pistas de Wayne».
 */
const vendedor = computed(() => repartoDelMundo(MUNDOS_POR_ID[props.reto.mundo]).pistas)
const comoSeLlama = computed(() => nombreDe(vendedor.value))

const ultimoTrasto = ref(null)
const aviso = ref('')

const compradas = computed(() => progreso.ficha(props.reto.id).pistasUsadas)

/**
 * Los jefes no llevan pistas. Cierran un mundo, y todo lo que hace falta se ha
 * visto en los retos de antes: saber que lo sabes es precisamente resolverlo
 * sin nadie detrás.
 */
const esJefe = computed(() => !props.reto.pistas?.length)

const pistas = computed(() =>
  (props.reto.pistas ?? []).map((pista, nivel) => {
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
      <!-- Que se vea quién cobra. -->
      <Avatar class="vendedor" :quien="vendedor" :tamano="46" />
      <div class="titulo-pistas">
        <h3>Pistas de {{ comoSeLlama }}</h3>
        <span class="tenue coletilla">{{ esJefe ? 'hoy tiene el puesto cerrado' : 'la primera invita la casa' }}</span>
      </div>
      <span v-if="!esJefe" class="tenue saldo">{{ economia.croquetas }} croquetas</span>
    </div>

    <!-- En los jefes no hay nada que vender, y conviene que lo diga quien
         vende en vez de dejar el panel vacío y que parezca que se ha roto algo. -->
    <p v-if="esJefe" class="cerrado">
      «Este no te lo vendo. No es que no sepa cómo va —que tampoco—, es que si te lo suelto
      ahora te quedas sin saber si sabías. Todo lo que hace falta te lo han contado ya en los
      retos de antes. Búscalo ahí, o pregúntale a Quien Tú Sabes, que hoy tampoco va a soltar
      prenda.»
    </p>

    <p v-if="cortesiaDeCobre && !esJefe" class="cortesia">
      Cobre te cubre una pista de pago hoy. {{ comoSeLlama }} no se ha enterado.
    </p>

    <ol v-if="!esJefe" class="lista">
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
      <p class="titulo">A cambio, {{ comoSeLlama }} te deja</p>
      <p class="nombre">{{ ultimoTrasto.nombre }}</p>
      <p class="nota tenue">{{ TRASTOS_POR_ID[ultimoTrasto.id].nota }}</p>
    </div>
  </section>
</template>

<style scoped>
.cerrado {
  margin: 4px 0 0;
  font-size: 0.9rem;
  font-style: italic;
  color: var(--texto-tenue);
}

.pistas { position: relative; }
.cabecera { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.vendedor { flex-shrink: 0; }
.titulo-pistas { display: flex; flex-direction: column; line-height: 1.2; flex: 1; min-width: 0; }
.cabecera h3 { margin: 0; }
.coletilla { font-size: 0.76rem; }
.saldo { font-size: 0.85rem; white-space: nowrap; }

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
