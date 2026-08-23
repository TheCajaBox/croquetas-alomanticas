<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import Avatar from './Avatar.vue'
import { lenguajeDeLaRuta, mundoDeLaRuta } from '../contenido/dondeEstas.js'
import { entradaDe } from '../contenido/glosario.js'
import { repartoDelMundo } from '../contenido/itinerarios.js'
import { nombreDe } from '../contenido/personajes.js'
import { usarGlosario } from '../almacen/glosario.js'

/**
 * La definición de un término, abierta desde donde se haya pulsado.
 *
 * Va como diálogo y no como aviso en una esquina porque aquí el jugador ha
 * pulsado a propósito: quiere leer esto ahora, no enterarse de refilón.
 */
const glosario = usarGlosario()
const ruta = useRoute()

/**
 * La entrada, **en el lenguaje de donde estás**: en un mundo de PHP, «variable»
 * se explica con `$sombrero` y no con `const sombrero`. El almacén solo guarda
 * qué término se ha pulsado; el ejemplo lo resuelve aquí.
 */
const entrada = computed(() =>
  glosario.abierto ? entradaDe(glosario.abierto, lenguajeDeLaRuta(ruta.params)) : null,
)

/**
 * De quién es el glosario depende de dónde estés.
 *
 * Estaba escrito «steris» a mano, así que en la primera era -donde lo lleva
 * Sazed- salía ella. El mundo se saca de la ruta: un reto sabe a qué mundo
 * pertenece, y fuera de un mundo manda el reparto del itinerario por defecto,
 * que es el de Steris.
 */
const quien = computed(() => repartoDelMundo(mundoDeLaRuta(ruta.params)).glosario)

// Al cambiar de pantalla se cierra solo. Si no, el diálogo sobrevive a la
// navegación y su fondo se queda tapando la página siguiente.
watch(ruta, () => glosario.cerrar())

function alPulsarTecla(evento) {
  if (evento.key === 'Escape') glosario.cerrar()
}

onMounted(() => window.addEventListener('keydown', alPulsarTecla))
onBeforeUnmount(() => window.removeEventListener('keydown', alPulsarTecla))
</script>

<template>
  <Transition name="glosario">
    <div v-if="entrada" class="fondo" @click.self="glosario.cerrar()">
      <div class="ficha" role="dialog" aria-modal="true" :aria-label="`Qué es ${entrada.termino}`">
        <header>
          <Avatar :quien="quien" :tamano="44" />
          <div class="titulo">
            <p class="quien">Del glosario de {{ nombreDe(quien) }}</p>
            <h2>{{ entrada.termino }}</h2>
          </div>
          <button class="cerrar" title="Cerrar" @click="glosario.cerrar()">×</button>
        </header>

        <p class="definicion">{{ entrada.definicion }}</p>
        <pre v-if="entrada.ejemplo"><code>{{ entrada.ejemplo }}</code></pre>

        <RouterLink to="/glosario" class="todo" @click="glosario.cerrar()">
          Ver el glosario entero →
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fondo {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(12, 10, 18, 0.6);
  backdrop-filter: blur(3px);
}

.ficha {
  width: min(460px, 100%);
  padding: 20px 22px;
  background: linear-gradient(180deg, #2b2a3e, #232235);
  border: 1px solid #45426a;
  border-left: 3px solid #9aa8d8;
  border-radius: var(--radio);
  box-shadow: var(--sombra);
}

header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.titulo { flex: 1; min-width: 0; }
.quien {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #9aa8d8;
}
.ficha h2 { margin: 0; font-size: 1.15rem; }

.cerrar {
  padding: 0;
  width: 26px;
  height: 26px;
  line-height: 1;
  font-size: 1.2rem;
  background: none;
  border: none;
  color: var(--texto-apagado);
}
.cerrar:hover { background: none; color: var(--texto); }

.definicion { margin: 0 0 12px; font-size: 0.95rem; }
.ficha pre { margin: 0 0 14px; background: #191826; border-color: #3a3757; }
.todo { font-size: 0.86rem; text-decoration: none; }

.glosario-enter-active { transition: opacity 0.2s; }
.glosario-leave-active { transition: opacity 0.15s; }
.glosario-enter-from, .glosario-leave-to { opacity: 0; }
.glosario-enter-active .ficha { transition: transform 0.25s cubic-bezier(0.2, 1.2, 0.4, 1); }
.glosario-enter-from .ficha { transform: translateY(14px) scale(0.97); }
</style>
