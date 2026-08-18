<script setup>
import { computed, ref } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import GatoSvg from '../componentes/GatoSvg.vue'
import { usarGatos } from '../almacen/gatos.js'
import { usarNarrador } from '../almacen/narrador.js'

const gatos = usarGatos()
const narrador = usarNarrador()
const reciente = ref(null)

const disponibles = computed(() => gatos.enElRefugio)
const porVenir = computed(() => gatos.porVenir)

function adoptar(gatoId) {
  const gato = gatos.adoptar(gatoId)
  if (!gato) return
  reciente.value = gato
  narrador.decir('gatoAdoptado', { gato: gato.nombre }, { forzar: true })
}
</script>

<template>
  <div class="pila">
    <section class="panel encabezado">
      <SombreroEscondido id="refugio" :posicion="{ top: '16px', right: '18px' }" />
      <h1>El refugio</h1>
      <p class="tenue">
        Cada gato lleva el nombre de un metal y se comporta como él. Se ganan resolviendo retos,
        y una vez en casa hay que cuidarlos: un gato contento echa una mano, uno triste no.
      </p>
    </section>

    <section v-if="reciente" class="panel bienvenida">
      <GatoSvg :aspecto="reciente.aspecto" animo="contento" :tamano="90" />
      <div>
        <h3>{{ reciente.nombre }} ya vive contigo</h3>
        <p class="tenue">{{ reciente.presentacion }}</p>
        <RouterLink to="/colonia">Ir a la colonia →</RouterLink>
      </div>
    </section>

    <template v-if="disponibles.length">
      <h2>Te están esperando</h2>
      <div class="rejilla">
        <article v-for="gato in disponibles" :key="gato.id" class="ficha panel">
          <GatoSvg :aspecto="gato.aspecto" animo="normal" :tamano="104" />
          <h3>{{ gato.nombre }}</h3>
          <p class="etiqueta">{{ gato.grupo }} · {{ gato.poder }}</p>
          <p class="tenue presentacion">{{ gato.presentacion }}</p>
          <p class="bonus">{{ gato.bonus.titulo }}: {{ gato.bonus.descripcion }}</p>
          <button class="principal" @click="adoptar(gato.id)">Adoptar a {{ gato.nombre }}</button>
        </article>
      </div>
    </template>

    <h2 v-if="porVenir.length">Todavía no se fían de ti</h2>
    <div v-if="porVenir.length" class="rejilla">
      <article v-for="gato in porVenir" :key="gato.id" class="ficha panel oculta">
        <GatoSvg :aspecto="{ ...gato.aspecto, pelo: '#312b42', manchas: '#272134', ojos: '#4a4361' }" animo="triste" :tamano="104" />
        <h3>¿?</h3>
        <p class="etiqueta bloqueado">{{ gato.grupo }}</p>
        <p class="condicion">{{ gato.desbloqueo.texto }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.encabezado p { max-width: 72ch; margin: 0; }

.bienvenida { display: flex; gap: 18px; align-items: center; border-color: rgba(201, 139, 75, 0.4); background: rgba(201, 139, 75, 0.07); }
.bienvenida h3 { margin: 0 0 4px; }
.bienvenida p { margin: 0 0 6px; font-size: 0.9rem; }
.bienvenida a { font-size: 0.88rem; }

.rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
.ficha { max-width: 330px; }
.ficha { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.ficha h3 { margin: 4px 0 0; }
.ficha .presentacion { font-size: 0.85rem; margin: 4px 0; }
.ficha .bonus { font-size: 0.84rem; color: var(--cobre-claro); margin: 0 0 10px; }
.ficha button { margin-top: auto; width: 100%; }
.ficha.oculta { opacity: 0.7; }
.condicion { font-size: 0.86rem; margin: 6px 0 0; }
</style>
