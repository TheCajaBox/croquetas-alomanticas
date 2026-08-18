<script setup>
import { computed } from 'vue'

import Marcado from './Marcado.vue'
import { FASES } from '../motor/ejecutor.js'
import { usarGatos } from '../almacen/gatos.js'

const props = defineProps({
  resultado: { type: Object, default: null },
  ejecutando: { type: Boolean, default: false },
})

const gatos = usarGatos()

/** Bronce, si está contento, aparta el ruido y deja solo el primer fallo. */
const rastreando = computed(() => gatos.tieneBonus('primerFalloDestacado'))

const primerFallo = computed(() => props.resultado?.tests?.find((test) => !test.ok) ?? null)

const testsVisibles = computed(() => {
  const tests = props.resultado?.tests ?? []
  if (!rastreando.value || !primerFallo.value) return tests
  return tests.filter((test) => test.ok || test === primerFallo.value)
})

const ocultosPorBronce = computed(() => (props.resultado?.tests?.length ?? 0) - testsVisibles.value.length)

const requisitosIncumplidos = computed(
  () => props.resultado?.requisitos?.filter((r) => !r.cumplido) ?? [],
)
</script>

<template>
  <section class="resultados panel">
    <p v-if="ejecutando" class="tenue">Ejecutando…</p>

    <p v-else-if="!resultado" class="tenue">
      Todavía no has ejecutado nada. Aquí saldrá qué funciona y qué no.
    </p>

    <template v-else>
      <p v-if="resultado.ok" class="titular bien">Reto superado.</p>

      <!-- Fallos que impiden llegar siquiera a los tests -->
      <div v-if="resultado.fase === FASES.SINTAXIS" class="aviso mal">
        <p class="cabecera">Tu código no se puede ni leer</p>
        <p class="detalle">{{ resultado.error.mensaje }}</p>
        <p v-if="resultado.error.linea" class="tenue posicion">
          Línea {{ resultado.error.linea }}<span v-if="resultado.error.columna">, columna {{ resultado.error.columna }}</span>
        </p>
      </div>

      <div v-else-if="resultado.fase === FASES.REQUISITOS" class="aviso mal">
        <p class="cabecera">Las normas del reto</p>
        <ul class="requisitos">
          <li v-for="requisito in requisitosIncumplidos" :key="requisito.tipo + requisito.mensaje">
            <Marcado :texto="requisito.mensaje" />
          </li>
        </ul>
        <p class="tenue posicion">Ni lo he ejecutado: arregla esto primero.</p>
      </div>

      <div v-else-if="resultado.fase === FASES.TIEMPO" class="aviso mal">
        <p class="cabecera">Se acabó el tiempo</p>
        <p class="detalle">{{ resultado.error.mensaje }}</p>
      </div>

      <div v-else-if="resultado.fase === FASES.EJECUCION" class="aviso mal">
        <p class="cabecera">{{ resultado.error.bucleInfinito ? 'Bucle sin salida' : 'Ha reventado al ejecutarlo' }}</p>
        <p class="detalle">{{ resultado.error.mensaje }}</p>
      </div>

      <!-- Tests -->
      <ul v-if="testsVisibles.length" class="tests">
        <li v-for="test in testsVisibles" :key="test.nombre" :class="{ ok: test.ok, mal: !test.ok }">
          <span class="marca">{{ test.ok ? '✓' : '✕' }}</span>
          <div>
            <p class="nombre">{{ test.nombre }}</p>
            <p v-if="!test.ok" class="mensaje">{{ test.mensaje }}</p>
          </div>
        </li>
      </ul>

      <p v-if="ocultosPorBronce > 0" class="tenue nota">
        Bronce ha apartado {{ ocultosPorBronce }} test{{ ocultosPorBronce === 1 ? '' : 's' }} para que veas primero el que importa.
      </p>

      <!-- Consola -->
      <div v-if="resultado.consola?.length" class="consola">
        <p class="titulo-consola tenue">Consola</p>
        <pre><code>{{ resultado.consola.map((l) => l.texto).join('\n') }}</code></pre>
      </div>

      <!-- Recompensa -->
      <div v-if="resultado.recompensa" class="recompensa">
        <p class="cabecera">+{{ resultado.recompensa.total }} croquetas</p>
        <ul>
          <li v-for="parte in resultado.recompensa.detalle" :key="parte.concepto">
            <span>{{ parte.concepto }}</span><span>+{{ parte.croquetas }}</span>
          </li>
        </ul>
      </div>
      <p v-else-if="resultado.repetido" class="tenue nota">
        Este ya lo tenías. Las croquetas se pagan una sola vez.
      </p>

      <p v-if="resultado.indultado" class="tenue nota">
        Oro se ha caído por ti: este fallo no cuenta.
      </p>
    </template>
  </section>
</template>

<style scoped>
.resultados { font-size: 0.93rem; }
.titular { font-weight: 650; margin-bottom: 10px; }
.titular.bien { color: var(--verde); }

.aviso { border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; }
.aviso.mal { background: rgba(224, 122, 114, 0.10); border: 1px solid rgba(224, 122, 114, 0.3); }
.cabecera { margin: 0 0 6px; font-weight: 650; color: var(--rojo); }
.detalle { margin: 0; font-family: var(--mono); font-size: 0.85rem; }
.posicion { margin: 6px 0 0; font-size: 0.82rem; }
.requisitos { margin: 0; padding-left: 20px; }
.requisitos :deep(p) { margin: 0; }
.requisitos li { margin-bottom: 5px; }

.tests { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.tests li { display: flex; gap: 10px; align-items: flex-start; }
.marca { font-weight: 700; line-height: 1.5; }
.tests li.ok .marca { color: var(--verde); }
.tests li.mal .marca { color: var(--rojo); }
.tests li.ok .nombre { color: var(--texto-tenue); }
.nombre { margin: 0; }
.mensaje { margin: 3px 0 0; font-size: 0.86rem; color: var(--rojo); }

.nota { margin: 10px 0 0; font-size: 0.85rem; }

.consola { margin-top: 14px; }
.titulo-consola { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px; }
.consola pre { margin: 0; }

.recompensa {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(201, 139, 75, 0.10);
  border: 1px solid rgba(201, 139, 75, 0.3);
}
.recompensa .cabecera { color: var(--cobre-claro); }
.recompensa ul { list-style: none; margin: 0; padding: 0; font-size: 0.86rem; }
.recompensa li { display: flex; justify-content: space-between; color: var(--texto-tenue); }
</style>
