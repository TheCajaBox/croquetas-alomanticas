<script setup>
import { computed } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import { LEMAS_POR_NARRADOR } from '../contenido/narrador/lineas.js'
import { ITINERARIOS_POR_ID, ITINERARIO_POR_DEFECTO } from '../contenido/itinerarios.js'
import { MUNDOS_POR_ID, mundosDelItinerario } from '../contenido/mundos.js'
import { retosDelMundo } from '../contenido/retos/index.js'
import { usarEconomia } from '../almacen/economia.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarInsignias } from '../almacen/insignias.js'
import { usarProgreso } from '../almacen/progreso.js'
import { usarSombreros } from '../almacen/sombreros.js'
import Avatar from '../componentes/Avatar.vue'
import GatoSvg from '../componentes/GatoSvg.vue'
import wayneRetrato from '../recursos/wayne-retrato.webp'

/**
 * La portada de un itinerario: sus mundos y por dónde ibas en él.
 *
 * Antes esto era la única portada y enseñaba todos los mundos que había. Ahora
 * la puerta es la entrada -elegir lenguaje- y esto es lo de dentro de cada
 * camino, que es lo mismo pero de uno solo.
 */
const props = defineProps({
  itinerarioId: { type: String, default: ITINERARIO_POR_DEFECTO },
})

const progreso = usarProgreso()
const gatos = usarGatos()

const itinerario = computed(
  () => ITINERARIOS_POR_ID[props.itinerarioId] ?? ITINERARIOS_POR_ID[ITINERARIO_POR_DEFECTO],
)
const mundosDeAqui = computed(() => mundosDelItinerario(itinerario.value.id))
const economia = usarEconomia()
const insignias = usarInsignias()
const sombreros = usarSombreros()

/** Una frase distinta cada vez que se entra. Es su casa; que hable. */
const lema = computed(() => {
  const suyos = LEMAS_POR_NARRADOR[itinerario.value.narrador] ?? []
  return suyos.length ? suyos[Math.floor(Math.random() * suyos.length)] : null
})

const NUMEROS = ['Cero', 'Un', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve']

// Contar los mundos y los retos a mano en el texto es una promesa que se rompe
// sola: se añade contenido y la portada se queda mintiendo. Se calculan.
const cuantosMundos = computed(() => NUMEROS[mundosDeAqui.value.length] ?? mundosDeAqui.value.length)
const cuantosRetos = computed(() =>
  mundosDeAqui.value.reduce((suma, mundo) => suma + retosDelMundo(mundo.id).length, 0),
)

/** Los mundos que le faltan a este para abrirse, ya escritos como frase. */
function nombresQueFaltan(mundo) {
  if (!mundo.requiere) return null
  const exigidos = Array.isArray(mundo.requiere) ? mundo.requiere : [mundo.requiere]
  const nombres = exigidos
    .filter((id) => !progreso.mundoCompletado(id))
    .map((id) => MUNDOS_POR_ID[id]?.nombre)
    .filter(Boolean)
  if (nombres.length === 0) return null
  return nombres.length === 1 ? nombres[0] : `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`
}

const mundos = computed(() =>
  mundosDeAqui.value.map((mundo) => {
    const total = retosDelMundo(mundo.id).length
    const hechos = progreso.superadosDelMundo(mundo.id)
    return {
      ...mundo,
      total,
      hechos,
      porcentaje: total ? Math.round((hechos / total) * 100) : 0,
      disponible: progreso.mundoDisponible(mundo.id),
      completado: progreso.mundoCompletado(mundo.id),
      // Cada mundo cerrado dice cuál es el que lo abre, no siempre el primero.
      // Y alguno pide dos, así que se nombran los que falten, no todos.
      loAbre: nombresQueFaltan(mundo),
    }
  }),
)

const colonia = computed(() => gatos.adoptados)

/**
 * Por dónde iba y qué lleva hecho.
 *
 * La portada enseñaba nueve mundos y ni una palabra de dónde te habías
 * quedado: para seguir jugando había que acordarse. Ahora lo primero que hay
 * al entrar, si ya has empezado, es el reto siguiente y un botón.
 */
const siguiente = computed(() => {
  const reto = progreso.porDondeIba(itinerario.value.id)
  if (!reto) return null
  return { ...reto, mundo: MUNDOS_POR_ID[reto.mundo] }
})

const empezado = computed(() => progreso.retosSuperados > 0)

const marcadores = computed(() =>
  [
    { id: 'retos', valor: `${progreso.retosSuperados}/${cuantosRetos.value}`, que: 'retos' },
    progreso.rachaSinPistas >= 2 && { id: 'racha', valor: progreso.rachaSinPistas, que: 'de racha' },
    insignias.cuantas > 0 && { id: 'insignias', valor: `${insignias.cuantas}/${insignias.total}`, que: 'insignias' },
    sombreros.cuantos > 0 && { id: 'sombreros', valor: `${sombreros.cuantos}/${sombreros.total}`, que: 'sombreros' },
    { id: 'croquetas', valor: economia.croquetas, que: 'croquetas' },
  ].filter(Boolean),
)
</script>

<template>
  <div class="pila">
    <section class="portada panel">
      <SombreroEscondido id="mundos" :posicion="{ top: '14px', right: '18px' }" />

      <div class="texto-portada">
        <RouterLink to="/" class="volver tenue">← Elegir otro camino</RouterLink>
        <h1>{{ itinerario.nombre }}</h1>
        <p class="tenue entradilla">
          {{ cuantosMundos }} mundos, {{ cuantosRetos }} retos y código {{ itinerario.lenguajeEnFrase }} que
          se ejecuta de verdad, con sus tests: nada de elegir la respuesta correcta de una
          lista. {{ itinerario.resumen }}
        </p>
        <p class="tenue entradilla">
          {{ itinerario.presentacion }} Con lo que ganes das de comer a una colonia de gatos que
          vive en su casa y que, cuando están contentos, te devuelven el favor.
        </p>
      </div>

      <!-- Quien narra, en grande y presidiendo. Es su itinerario, al fin y al cabo. -->
      <figure class="anfitrion">
        <img
          v-if="itinerario.retrato === 'wayne'"
          :src="wayneRetrato"
          class="retrato-wayne"
          width="480"
          height="700"
          alt="Wayne, con su sombrero y el bastón al hombro"
        />
        <Avatar v-else :quien="itinerario.narrador" :tamano="150" />
        <figcaption v-if="lema">«{{ lema }}»</figcaption>
      </figure>
    </section>

    <section v-if="siguiente" class="panel seguir">
      <div class="donde">
        <p class="tenue etiqueta-seguir">{{ empezado ? 'Por dónde ibas' : 'Por aquí se empieza' }}</p>
        <h2>{{ siguiente.titulo }}</h2>
        <p class="tenue">
          {{ siguiente.mundo?.nombre }}
          <span v-if="siguiente.jefe" class="etiqueta jefe">jefe</span>
        </p>
      </div>

      <ul v-if="empezado" class="marcadores">
        <li v-for="marcador in marcadores" :key="marcador.id">
          <strong>{{ marcador.valor }}</strong>
          <span class="tenue">{{ marcador.que }}</span>
        </li>
      </ul>

      <RouterLink class="principal seguir-boton" :to="{ name: 'reto', params: { retoId: siguiente.id } }">
        {{ empezado ? 'Seguir' : 'Empezar' }} →
      </RouterLink>
    </section>

    <section v-else-if="empezado" class="panel seguir">
      <div class="donde">
        <p class="tenue etiqueta-seguir">Ya está</p>
        <h2>No queda un solo reto sin resolver</h2>
        <p class="tenue">
          Quedan los repasos de Marasi, las insignias que falten y unos gatos a los que no les
          vendría mal que les hicieras caso.
        </p>
      </div>
      <RouterLink class="principal seguir-boton" to="/colonia">A la casa →</RouterLink>
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
          Antes hay que terminar {{ mundo.loAbre }}.
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
        <RouterLink to="/colonia" class="tenue">Ir a la casa →</RouterLink>
      </div>
      <p class="tenue vive-aqui">
        Viven en una casa con jardín y se mueven por ella. Se les da de comer, se les cepilla
        arrastrando por encima y se juega con ellos moviéndoles una pluma.
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

    <section v-else class="panel centrado sin-gatos">
      <p class="tenue">
        Todavía no tienes ningún gato. Supera un reto y Wayne te llevará al refugio; de ahí se
        vienen a la casa, donde se les cuida.
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
.volver { display: inline-block; margin-bottom: 6px; font-size: 0.82rem; text-decoration: none; }
.volver:hover { color: var(--texto); }
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

.seguir {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  border-left: 3px solid var(--cobre);
  background: linear-gradient(180deg, #2b2437, #221e30);
}
.donde { flex: 1; min-width: 220px; }
.donde h2 { margin: 2px 0 4px; font-size: 1.15rem; }
.donde p { margin: 0; font-size: 0.88rem; }
.etiqueta-seguir {
  margin: 0;
  font-size: 0.7rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cobre-claro);
}
.jefe { margin-left: 6px; border-color: var(--rojo); color: var(--rojo); }

.marcadores { display: flex; gap: 18px; flex-wrap: wrap; list-style: none; margin: 0; padding: 0; }
.marcadores li { display: flex; flex-direction: column; line-height: 1.2; }
.marcadores strong { font-size: 1.05rem; color: var(--texto); }
.marcadores span { font-size: 0.76rem; }

.seguir-boton { text-decoration: none; white-space: nowrap; }

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
.vive-aqui { margin: -6px 0 14px; font-size: 0.88rem; max-width: 72ch; }
.miniaturas { display: flex; flex-wrap: wrap; gap: 14px; }
.miniatura { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; }
.miniatura .nombre { font-size: 0.78rem; }
.sin-gatos p { margin: 0; }
</style>
