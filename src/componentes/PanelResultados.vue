<script setup>
import { computed } from 'vue'
import SombreroEscondido from './SombreroEscondido.vue'

import Avatar from './Avatar.vue'
import Marcado from './Marcado.vue'
import { traducirImprevisto } from '../contenido/imprevistos.js'
import { FASES } from '../motor/ejecutor.js'
import { revisar } from '../motor/marasi/revisar.js'
import { usarArmonia } from '../almacen/armonia.js'
import { usarGatos } from '../almacen/gatos.js'

const props = defineProps({
  resultado: { type: Object, default: null },
  ejecutando: { type: Boolean, default: false },
  /** Lo que el jugador tiene escrito, para que Marasi pueda revisarlo. */
  codigo: { type: String, default: '' },
})

const armonia = usarArmonia()
const gatos = usarGatos()

/**
 * La revisión solo cuando ya está superado. Antes sería un reproche a alguien
 * que todavía está peleando, y esto no viene a eso.
 */
const informe = computed(() => (props.resultado?.ok ? revisar(props.codigo) : []))

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

/**
 * Steris traduce el error. Se mira primero el que ha parado la ejecución y, si
 * no hay, el mensaje del primer test en rojo: cuando el código del jugador
 * revienta dentro de un test, el error de verdad viene por ahí.
 */
const imprevisto = computed(() => {
  if (!props.resultado) return null
  return (
    traducirImprevisto(props.resultado.error?.mensaje) ??
    traducirImprevisto(primerFallo.value?.mensaje)
  )
})
</script>

<template>
  <section class="resultados panel">
    <SombreroEscondido id="resultados" :posicion="{ top: '10px', right: '12px' }" :tamano="17" />
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
      <ul v-if="testsVisibles.length" class="tests escalonado">
        <li
          v-for="(test, orden) in testsVisibles"
          :key="test.nombre"
          :class="{ ok: test.ok, mal: !test.ok }"
          :style="{ '--orden': orden }"
        >
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

      <!-- La lista de imprevistos de Steris -->
      <section v-if="imprevisto" class="imprevisto">
        <header>
          <Avatar quien="steris" :tamano="34" />
          <div>
            <p class="quien">Steris lo tenía previsto</p>
            <p class="titulo-imprevisto">{{ imprevisto.titulo }}</p>
          </div>
        </header>
        <Marcado class="significa" :texto="imprevisto.significa" />
        <p class="tenue etiqueta-causas">Lo que suele ser</p>
        <ul class="causas">
          <li v-for="causa in imprevisto.causas" :key="causa">
            <Marcado :texto="causa" />
          </li>
        </ul>
      </section>

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

      <!-- El informe de Marasi: solo cuando ya está superado. Que funcione y
           que esté bien escrito son dos preguntas distintas, y esta es la
           segunda; preguntarla antes de tiempo solo desanima. -->
      <section v-if="informe.length" class="informe">
        <header>
          <Avatar quien="marasi" :tamano="34" />
          <div>
            <p class="quien">El informe de Marasi</p>
            <p class="tenue nota-informe">Funciona. Ahora hablemos de cómo está escrito.</p>
          </div>
        </header>

        <ul class="apuntado">
          <li v-for="aviso in informe" :key="aviso.id">
            <Marcado class="que" :texto="aviso.titulo" />
            <Marcado
              v-if="aviso.ejemplos.length"
              class="tenue cuales"
              :texto="aviso.ejemplos.map((e) => '`' + e + '`').join(', ')"
              :enlazar="false"
            />
            <Marcado class="tenue porque" :texto="aviso.porque" />
          </li>
        </ul>

        <p class="tenue cierre">
          No hace falta que lo cambies: el reto está superado y las croquetas son tuyas.
          Pero si vas a escribir código el resto de tu vida, más vale que te lo diga yo ahora.
        </p>
      </section>

      <!-- Cuando algo se pone rojo es justo el momento en que hace falta
           preguntar. Aquí, y no escondido en el menú de arriba. -->
      <button v-if="!resultado.ok" type="button" class="menudo preguntar-armonia" @click="armonia.abrir()">
        <Avatar quien="armonia" :tamano="22" />
        Preguntar a Armonía
      </button>
    </template>
  </section>
</template>

<style scoped>
.informe {
  margin-top: 18px;
  padding: 14px 16px;
  background: rgba(192, 105, 126, 0.06);
  border: 1px solid rgba(192, 105, 126, 0.28);
  border-radius: var(--radio-menudo);
}
.informe header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.informe .quien {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #c0697e;
}
.nota-informe { margin: 2px 0 0; font-size: 0.82rem; font-style: italic; }

.apuntado { list-style: none; margin: 0; padding: 0; }
.apuntado > li { margin-bottom: 14px; padding-left: 14px; border-left: 2px solid rgba(192, 105, 126, 0.35); }
.apuntado > li:last-child { margin-bottom: 0; }
.que :deep(p) { margin: 0; font-size: 0.92rem; font-weight: 600; }
.cuales :deep(p) { margin: 2px 0 0; font-size: 0.84rem; }
.porque :deep(p) { margin: 4px 0 0; font-size: 0.86rem; }
.cierre { margin: 14px 0 0; padding-top: 10px; border-top: 1px solid var(--borde-suave); font-size: 0.84rem; }

.preguntar-armonia {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 0.86rem;
  border-color: rgba(198, 164, 92, 0.35);
}
.preguntar-armonia:hover { border-color: #c6a45c; color: var(--texto); }

.resultados { position: relative; font-size: 0.93rem; }
.titular { font-weight: 650; margin-bottom: 10px; }
.titular.bien {
  color: var(--verde);
  font-size: 1.05rem;
  animation: asomar 0.4s cubic-bezier(0.2, 1.3, 0.4, 1) backwards;
}

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

/* El aviso de Steris va marcado con su lavanda: cuando aparece, lo que se
   necesita leer es esto y no la línea en inglés de arriba. */
.imprevisto {
  margin-top: 14px;
  padding: 13px 15px;
  border-radius: 8px;
  border: 1px solid rgba(154, 168, 216, 0.32);
  border-left: 3px solid #9aa8d8;
  background: rgba(154, 168, 216, 0.08);
}
.imprevisto header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.quien {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #9aa8d8;
}
.titulo-imprevisto { margin: 0; font-weight: 650; }
.significa { margin-bottom: 10px; }
.significa :deep(p) { margin: 0; }
.etiqueta-causas {
  margin: 0 0 5px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.causas { margin: 0; padding-left: 18px; font-size: 0.88rem; }
.causas li { margin-bottom: 5px; }
.causas :deep(p) { margin: 0; }

.consola { margin-top: 14px; }
.titulo-consola { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px; }
.consola pre { margin: 0; }

.recompensa {
  /* Entra la última, cuando ya se han pintado los tests. */
  animation: asomar 0.45s cubic-bezier(0.2, 1, 0.3, 1) 0.35s backwards;
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
