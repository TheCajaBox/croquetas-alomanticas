<script setup>
import { computed, ref } from 'vue'

import BarraEstado from './BarraEstado.vue'
import CepilloGato from './CepilloGato.vue'
import GatoSvg from './GatoSvg.vue'
import { CUIDADOS, FELICIDAD_PARA_BONUS } from '../contenido/gatos.js'
import { usarGatos } from '../almacen/gatos.js'

const props = defineProps({ gato: { type: Object, required: true } })

const gatos = usarGatos()
const aviso = ref('')
/** Cepillar no es pulsar un botón: es arrastrar por encima del gato. */
const cepillando = ref(false)

const animo = computed(() => {
  if (props.gato.felicidad >= 60) return 'contento'
  return props.gato.felicidad >= 30 ? 'normal' : 'triste'
})

const bonusActivo = computed(() => props.gato.felicidad >= FELICIDAD_PARA_BONUS)

const acciones = computed(() =>
  Object.entries(CUIDADOS).map(([id, cuidado]) => ({
    id,
    ...cuidado,
    espera: gatos.esperaRestante(props.gato.id, id),
  })),
)

function cuidar(accion) {
  const resultado = gatos.cuidar(props.gato.id, accion)
  aviso.value = resultado.ok ? '' : resultado.motivo
}

/**
 * El cepillado se cobra y se aplica al terminar de arrastrar, no al empezar:
 * quien deja el cepillo a medias no ha cepillado a nadie.
 */
function empezarACepillar() {
  const espera = gatos.esperaRestante(props.gato.id, 'cepillar')
  if (espera > 0) {
    aviso.value = `Acabas de hacerlo. Vuelve dentro de ${espera} min.`
    return
  }
  aviso.value = ''
  cepillando.value = true
}

function cepillado() {
  cuidar('cepillar')
  setTimeout(() => { cepillando.value = false }, 700)
}
</script>

<template>
  <article class="tarjeta panel" :class="{ triste: animo === 'triste' }">
    <div class="retrato" :style="{ '--pelo': gato.aspecto.pelo }">
      <CepilloGato
        v-if="cepillando"
        :gato="gato"
        :animo="animo"
        @completado="cepillado"
        @salir="cepillando = false"
      />
      <GatoSvg v-else :aspecto="gato.aspecto" :animo="animo" :tamano="118" />
    </div>

    <div class="ficha">
      <div class="fila titulo">
        <h3>{{ gato.nombre }}</h3>
        <span class="etiqueta">{{ gato.poder }}</span>
        <!-- Lo usa la vista de la casa para poder cerrar la ficha que abre. -->
        <slot name="cerrar" />
      </div>
      <p class="tenue personalidad">{{ gato.personalidad }}</p>

      <div class="estados">
        <BarraEstado titulo="Comida" :valor="gato.comida" />
        <BarraEstado titulo="Ánimo" :valor="gato.felicidad" />
        <BarraEstado titulo="Aseo" :valor="gato.limpieza" />
      </div>

      <div class="bonus" :class="{ activo: bonusActivo }">
        <p class="nombre-bonus">{{ gato.bonus.titulo }}</p>
        <p class="descripcion">{{ gato.bonus.descripcion }}</p>
        <p v-if="!bonusActivo && gato.bonus.id !== 'ninguno'" class="tenue dormido">
          Dormido: necesita al menos {{ FELICIDAD_PARA_BONUS }} de ánimo.
        </p>
      </div>

      <div class="acciones">
        <button
          v-for="accion in acciones"
          :key="accion.id"
          :disabled="accion.espera > 0 || (accion.id === 'cepillar' && cepillando)"
          class="menudo"
          @click="accion.id === 'cepillar' ? empezarACepillar() : cuidar(accion.id)"
        >
          {{ accion.titulo }}
          <span v-if="accion.espera > 0" class="tenue"> · {{ accion.espera }} min</span>
          <span v-else-if="accion.coste" class="coste"> · {{ accion.coste }} ●</span>
        </button>
      </div>

      <p v-if="aviso" class="aviso">{{ aviso }}</p>
    </div>
  </article>
</template>

<style scoped>
.tarjeta { display: flex; gap: 18px; align-items: flex-start; }
.tarjeta.triste { border-color: rgba(224, 122, 114, 0.35); }

.retrato {
  flex-shrink: 0;
  border-radius: var(--radio);
  padding: 6px;
  background: radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--pelo) 22%, transparent), transparent 70%);
}

.ficha { flex: 1; min-width: 0; }
.titulo { justify-content: space-between; margin-bottom: 4px; }
.titulo h3 { margin: 0; }
.personalidad { font-size: 0.87rem; margin-bottom: 12px; }

.estados { display: flex; gap: 14px; margin-bottom: 14px; flex-wrap: wrap; }

.bonus {
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px dashed var(--borde);
  margin-bottom: 12px;
  opacity: 0.55;
}
.bonus.activo { opacity: 1; border-style: solid; border-color: rgba(201, 139, 75, 0.4); background: rgba(201, 139, 75, 0.08); }
.nombre-bonus { margin: 0 0 2px; font-weight: 650; font-size: 0.88rem; color: var(--cobre-claro); }
.descripcion { margin: 0; font-size: 0.85rem; }
.dormido { margin: 5px 0 0; font-size: 0.78rem; }

.acciones { display: flex; gap: 8px; flex-wrap: wrap; }
.menudo { padding: 6px 11px; font-size: 0.84rem; }
.coste { color: var(--cobre-claro); }
.aviso { margin: 10px 0 0; font-size: 0.84rem; color: var(--rojo); }

@media (max-width: 620px) {
  .tarjeta { flex-direction: column; align-items: center; }
  .ficha { width: 100%; }
}
</style>
