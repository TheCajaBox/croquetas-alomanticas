<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import Narrador from './componentes/Narrador.vue'
import SombreroEscondido from './componentes/SombreroEscondido.vue'

/**
 * Los dos paneles que se abren desde cualquier pantalla, en diferido.
 *
 * Viven en la barra porque se pueden abrir desde donde sea, y eso los metía en
 * el paquete inicial con todo lo que arrastran: `PanelGlosario` se llevaba
 * detrás **las 128 entradas del glosario** -70 kB de definiciones y ejemplos-
 * para pintar una ficha que casi nadie abre en el primer minuto.
 *
 * Se piden la primera vez que se abren y se quedan montados desde entonces, que
 * es lo que conserva las transiciones de abrir y cerrar tal y como estaban.
 */
const PanelArmonia = defineAsyncComponent(() => import('./componentes/PanelArmonia.vue'))
const PanelGlosario = defineAsyncComponent(() => import('./componentes/PanelGlosario.vue'))
import { usarArmonia } from './almacen/armonia.js'
import { usarEconomia } from './almacen/economia.js'
import { usarGatos } from './almacen/gatos.js'
import { usarGlosario } from './almacen/glosario.js'
import { usarNarrador } from './almacen/narrador.js'
import { usarProgreso } from './almacen/progreso.js'
import { usarRecortes } from './almacen/recortes.js'
import { usarRumbo } from './almacen/rumbo.js'
import { usarSombreros } from './almacen/sombreros.js'
import { nombreDe } from './contenido/personajes.js'
import { itinerarioDeLaRuta, mundoDeLaRuta } from './contenido/dondeEstas.js'
import { mundosDelItinerario } from './contenido/mundos.js'
import { RETOS, RETOS_POR_ID, retosDelMundo } from './contenido/retos/index.js'
import { recorteDe } from './contenido/recortes.js'
import { SOMBREROS_POR_ID } from './contenido/sombreros.js'

const armonia = usarArmonia()
const economia = usarEconomia()
const gatos = usarGatos()
const narrador = usarNarrador()
const progreso = usarProgreso()
const sombreros = usarSombreros()
const recortes = usarRecortes()
const rumbo = usarRumbo()
const glosario = usarGlosario()

/**
 * Si alguno de los dos paneles se ha abierto **alguna vez** en esta visita.
 *
 * No es lo mismo que «está abierto ahora»: se enciende y no se apaga. Así el
 * panel se pide en diferido la primera vez que hace falta y a partir de ahí
 * queda montado, con lo que sus transiciones de abrir y cerrar siguen siendo
 * las de siempre. Con un `v-if` atado a «está abierto», el panel se desmontaría
 * al cerrarse y la animación de salida no se vería.
 */
const armoniaAbiertaAlguna = ref(false)
const glosarioAbiertoAlguna = ref(false)
watch(() => armonia.abierto, (abierto) => { if (abierto) armoniaAbiertaAlguna.value = true })
watch(() => glosario.abierto, (abierto) => { if (abierto) glosarioAbiertoAlguna.value = true })

const { croquetas } = storeToRefs(economia)
const { ultimoEncontrado } = storeToRefs(sombreros)
const { ultimoEncontrado: ultimoRecorte } = storeToRefs(recortes)

/**
 * La barra se pinta en todas las pantallas, así que es la que tiene que saber
 * en qué camino estás: cada vez que la ruta nombra un itinerario, un mundo o un
 * reto se lo apunta, y las pantallas de en medio -el glosario, los ajustes, la
 * propia casa de los gatos- heredan el último.
 *
 * De aquí sale que la casa, el refugio y la sombrerera solo se ofrezcan donde
 * existen. No es un permiso: es que en la Luthadel de la primera era no hay una
 * casa con jardín en Elendel, y ofrecerla era prometer un sitio que no está.
 */
const ruta = useRoute()
watch(() => ruta.params, (params) => rumbo.situar(params), { immediate: true, deep: true })

/**
 * Dónde estás, con nombres y con números: el camino, el mundo, cuál de cuántos
 * y qué parte de él.
 *
 * Esto es lo que faltaba y se notaba. El juego tiene cuatro caminos de veinte
 * mundos y doscientos cincuenta retos, y desde dentro de un reto **no había
 * forma de saber en cuál estabas**: el título del reto, el editor y nada más.
 * Quien vuelve al día siguiente aterriza en una pantalla que no dice de dónde
 * es. Y con cuatro lenguajes distintos eso no es un detalle: la diferencia
 * entre estar en SQL y estar en PHP es la diferencia entre que lo que escribas
 * tenga sentido o no.
 *
 * Sale de la **ruta** y no del rumbo guardado, y esa es la decisión de diseño:
 * el rumbo hereda el último camino para que la barra no se quede a medias en el
 * glosario, y eso está bien para saber qué puertas ofrecer. Pero para decir
 * «estás aquí» heredar es mentir. Así que la tira aparece donde la ruta sabe de
 * verdad de qué sitio se trata -un camino, un mundo, un reto, un repaso- y en
 * el glosario, los ajustes o el cajón no aparece, porque de esos sitios la
 * respuesta honrada es que no estás en ningún mundo.
 */
const sitio = computed(() => {
  const params = ruta.params
  if (!params.itinerarioId && !params.mundoId && !params.retoId) return null

  const itinerario = itinerarioDeLaRuta(params)
  const mundo = mundoDeLaRuta(params)
  if (!mundo) return { itinerario, mundo: null, parte: 'la portada del camino' }

  const hermanos = mundosDelItinerario(itinerario.id)
  const delMundo = retosDelMundo(mundo.id)
  const reto = params.retoId ? RETOS_POR_ID[params.retoId] : null
  const cualReto = reto ? delMundo.findIndex((cada) => cada.id === reto.id) + 1 : 0

  return {
    itinerario,
    mundo,
    // «mundo 3 de 6» contesta la otra mitad de la pregunta: no solo dónde
    // estás, sino cuánto falta. Sin eso, un camino de seis mundos y uno de
    // veinte se ven exactamente igual desde dentro.
    cual: hermanos.findIndex((cada) => cada.id === mundo.id) + 1,
    cuantos: hermanos.length,
    parte: reto ? `reto ${cualReto} de ${delMundo.length}` : ruta.name === 'repaso' ? 'el repaso' : '',
  }
})

const enElRefugio = computed(() => gatos.enElRefugio.length)
const avance = computed(() => `${progreso.retosSuperados}/${RETOS.length}`)

// Las croquetas que entran se anuncian con un número que sube y se desvanece.
const ganancias = ref([])
let siguienteGanancia = 0
watch(croquetas, (nuevo, viejo) => {
  const diferencia = nuevo - viejo
  if (diferencia <= 0) return
  const id = ++siguienteGanancia
  ganancias.value.push({ id, cantidad: diferencia })
  setTimeout(() => {
    ganancias.value = ganancias.value.filter((g) => g.id !== id)
  }, 1400)
})

// Al encontrar un sombrero se enseña un rato y luego se olvida solo.
const sombreroReciente = computed(() =>
  ultimoEncontrado.value ? SOMBREROS_POR_ID[ultimoEncontrado.value.id] : null,
)
watch(ultimoEncontrado, (nuevo) => {
  if (nuevo) setTimeout(() => sombreros.olvidarUltimo(), 4200)
})

// Los recortes no se buscan: caen solos. Por eso se anuncian, o pasarían
// desapercibidos y nadie llegaría a leerlos nunca.
// Del camino donde estés: cada uno tiene su prensa, y el chiste de un recorte
// es justo el sitio. Ver `contenido/recortes.js`.
const recorteReciente = computed(() =>
  ultimoRecorte.value ? recorteDe(ultimoRecorte.value.id, rumbo.dondeEstoy) : null,
)
watch(ultimoRecorte, (nuevo) => {
  if (nuevo) setTimeout(() => recortes.olvidarUltimo(), 6500)
})
</script>

<template>
  <div class="juego">
    <!-- Bruma. Puramente decorativa y detrás de todo. -->
    <div class="bruma" aria-hidden="true"><i /><i /><i /></div>

    <header class="cabecera">
      <div class="contenedor barra-superior">
        <RouterLink to="/" class="marca">
          <SombreroEscondido id="cabecera" :posicion="{ top: '-2px', right: '-16px' }" :tamano="17" />
          <span class="titulo">Gatos y Código</span>
          <!-- Quien narra depende de dónde estés: en la primera era no es Wayne.
             Estaba escrito a mano y mentía en tres de los cuatro caminos. -->
        <span class="apagado lema">narra {{ nombreDe(narrador.quienNarra) }} · pagan los gatos</span>
        </RouterLink>

        <nav class="navegacion">
          <RouterLink to="/">Caminos</RouterLink>
          <RouterLink v-if="rumbo.hay('colonia')" to="/colonia">Colonia</RouterLink>
          <RouterLink to="/glosario">Glosario</RouterLink>
          <!-- Armonía no es una pantalla, es un cajón que se abre encima: va
               como botón, pero se viste igual que sus vecinos para que no
               parezca otra cosa. -->
          <button type="button" class="como-enlace" @click="armonia.abrir()">Armonía</button>
          <RouterLink v-if="rumbo.hay('refugio')" to="/refugio" class="con-aviso">
            Refugio
            <span v-if="enElRefugio" class="aviso">{{ enElRefugio }}</span>
          </RouterLink>
          <RouterLink v-if="rumbo.hay('sombrerera')" to="/sombrerera">Sombrerera</RouterLink>
          <RouterLink to="/trastos">Cajón</RouterLink>
          <RouterLink to="/ajustes">Ajustes</RouterLink>
        </nav>

        <div class="contadores">
          <RouterLink
            v-if="rumbo.hay('sombrerera')"
            to="/sombrerera"
            class="contador sombreros"
            title="Sombreros encontrados"
          >
            <svg viewBox="0 0 32 24" aria-hidden="true">
              <ellipse cx="16" cy="19" rx="15" ry="4" fill="currentColor" />
              <path d="M6 19 Q 6 4 16 4 Q 26 4 26 19 Z" fill="currentColor" />
              <rect x="5.5" y="14" width="21" height="4" rx="2" fill="rgba(0,0,0,0.45)" />
            </svg>
            {{ sombreros.cuantos }}/{{ sombreros.total }}
          </RouterLink>

          <span class="contador retos" title="Retos superados">{{ avance }}</span>

          <!-- La racha ya se llevaba, y solo se veía en Ajustes. Aparece a
               partir de dos: con una no hay racha que enseñar. -->
          <Transition name="racha">
            <span
              v-if="progreso.rachaSinPistas >= 2"
              class="contador racha"
              :class="{ larga: progreso.rachaSinPistas >= 5 }"
              :title="`${progreso.rachaSinPistas} retos seguidos sin pedir una pista`"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13 2 L5 14 h6 l-2 8 8-12 h-6 z" fill="currentColor" />
              </svg>
              {{ progreso.rachaSinPistas }}
            </span>
          </Transition>

          <!-- El número que sube va FUERA del contador: dentro contaminaría su
               texto y lo leería mal cualquiera que lo consulte, tests incluidos. -->
          <span class="hueco-croquetas">
            <span class="contador croquetas" title="Croquetas">{{ croquetas }}</span>
            <TransitionGroup name="ganancia">
              <b v-for="ganancia in ganancias" :key="ganancia.id" class="ganancia" aria-hidden="true">
                +{{ ganancia.cantidad }}
              </b>
            </TransitionGroup>
          </span>
        </div>
      </div>

      <!-- La tira de sitio. Dentro de la cabecera y no debajo, para que se
           quede pegada arriba con ella al bajar por un reto largo: es
           precisamente ahí, a mitad de un enunciado de cuarenta líneas, donde
           uno pierde de vista dónde está. -->
      <Transition name="tira">
        <nav v-if="sitio" class="tira-sitio" :style="{ '--tono': sitio.mundo?.color ?? sitio.itinerario.color }">
          <div class="contenedor tira">
            <span class="punto" aria-hidden="true" />
            <RouterLink :to="`/itinerario/${sitio.itinerario.id}`" class="eslabon camino">
              {{ sitio.itinerario.nombre }}
            </RouterLink>
            <span class="materia">{{ sitio.itinerario.etiquetaLenguaje }}</span>

            <template v-if="sitio.mundo">
              <span class="flecha" aria-hidden="true">›</span>
              <RouterLink :to="`/mundo/${sitio.mundo.id}`" class="eslabon mundo">
                {{ sitio.mundo.nombre }}
              </RouterLink>
              <span class="cuenta">mundo {{ sitio.cual }} de {{ sitio.cuantos }}</span>
            </template>

            <span v-if="sitio.parte" class="parte">{{ sitio.parte }}</span>
          </div>
        </nav>
      </Transition>
    </header>

    <main class="contenedor principal">
      <RouterView v-slot="{ Component, route }">
        <Transition name="pagina" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <!-- Aviso de sombrero encontrado -->
    <Transition name="hallazgo">
      <aside v-if="sombreroReciente" class="hallazgo">
        <svg class="sombrero" viewBox="0 0 32 24" aria-hidden="true">
          <ellipse cx="16" cy="19" rx="15" ry="4" fill="currentColor" />
          <path d="M6 19 Q 6 4 16 4 Q 26 4 26 19 Z" fill="currentColor" />
          <rect x="5.5" y="14" width="21" height="4" rx="2" fill="rgba(0,0,0,0.45)" />
        </svg>
        <div>
          <p class="titulo-hallazgo">Sombrero encontrado</p>
          <p class="nombre">{{ sombreroReciente.nombre }}</p>
        </div>
      </aside>
    </Transition>

    <!-- Aviso de recorte desbloqueado -->
    <Transition name="hallazgo">
      <RouterLink v-if="recorteReciente" to="/trastos" class="recorte-nuevo">
        <p class="cabecera-periodico">{{ recorteReciente.cabecera }} · edición especial</p>
        <p class="titular">{{ recorteReciente.titular }}</p>
        <p class="pie">Recorte nuevo en el cajón →</p>
      </RouterLink>
    </Transition>

    <PanelArmonia v-if="armoniaAbiertaAlguna" />
    <PanelGlosario v-if="glosarioAbiertoAlguna" />

    <Narrador />
  </div>
</template>

<style scoped>
.contador.racha { color: var(--ambar); border-color: rgba(217, 180, 92, 0.45); }
.contador.racha.larga { color: var(--cobre-claro); border-color: var(--cobre); }
.contador.racha svg { width: 13px; height: 13px; }
.racha-enter-active, .racha-leave-active { transition: opacity 0.3s, transform 0.3s; }
.racha-enter-from, .racha-leave-to { opacity: 0; transform: scale(0.6); }

.juego { min-height: 100%; display: flex; flex-direction: column; position: relative; }
.cabecera, .principal { position: relative; z-index: 1; }

.cabecera {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(20, 18, 26, 0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--borde-suave);
}
.barra-superior { display: flex; align-items: center; gap: 16px; height: 62px; }

.marca {
  position: relative;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.titulo { font-weight: 700; letter-spacing: -0.01em; }
.lema { font-size: 0.72rem; }

/* `nowrap` a propósito y no por descuido: la barra tiene altura fija, así que
   una segunda fila no se aprieta, se sale por debajo y tapa el contenido. Cada
   reto que se añade ensancha el contador de retos un carácter, y así es como se
   rompió: con «0/97» cabía y con «0/105» ya no. Sin poder doblarse, cuando no
   quepa se desplaza -que se ve y se arregla- en vez de romper la página. */
.navegacion {
  display: flex;
  gap: 4px;
  margin-left: auto;
  flex-wrap: nowrap;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.navegacion::-webkit-scrollbar { display: none; }
.navegacion a, .navegacion .como-enlace { flex-shrink: 0; }
.navegacion a,
.navegacion .como-enlace {
  position: relative;
  color: var(--texto-tenue);
  text-decoration: none;
  /* Justo lo que hace falta para que las ocho secciones y los contadores
     quepan en una línea: con más aire, la navegación se doblaba dentro de una
     barra de altura fija y la última fila se salía por abajo. */
  padding: 7px 9px;
  border-radius: 8px;
  font-size: 0.88rem;
  transition: color 0.15s, background 0.15s;
}
.navegacion a:hover,
.navegacion .como-enlace:hover { color: var(--texto); background: var(--panel); }

/* El botón de Armonía tiene que pesar lo mismo que sus vecinos: sin borde, sin
   fondo y con la misma tipografía, o se lee como un botón perdido en un menú. */
.navegacion .como-enlace { background: none; border: none; font: inherit; cursor: pointer; }
.navegacion a.router-link-active { color: var(--cobre-claro); background: rgba(201, 139, 75, 0.12); }

.con-aviso { display: inline-flex; align-items: center; gap: 6px; }
.aviso {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--cobre);
  color: #241705;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: latido 2.6s ease-in-out infinite;
}

.contadores { display: flex; gap: 8px; }
.contador {
  position: relative;
  font-variant-numeric: tabular-nums;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 5px 11px;
  border: 1px solid var(--borde);
  border-radius: 999px;
  color: var(--texto-tenue);
  white-space: nowrap;
}
.contador.sombreros {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s;
}
.contador.sombreros svg { width: 15px; height: 12px; }
.contador.sombreros:hover { color: var(--cobre-claro); border-color: rgba(201, 139, 75, 0.4); }

.contador.croquetas { color: var(--cobre-claro); border-color: rgba(201, 139, 75, 0.4); }
.contador.croquetas::after { content: ' ●'; font-size: 0.7em; }

.hueco-croquetas { position: relative; display: inline-flex; }

.ganancia {
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translateX(-50%);
  color: var(--verde);
  font-size: 0.85rem;
  animation: subir-y-desvanecer 1.4s ease-out forwards;
  pointer-events: none;
}

.hallazgo {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: linear-gradient(180deg, #322641, #271f33);
  border: 1px solid rgba(201, 139, 75, 0.45);
  border-radius: var(--radio);
  box-shadow: var(--sombra);
}
.hallazgo .sombrero {
  width: 38px;
  height: 29px;
  color: var(--cobre-claro);
  animation: girar-entrando 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) backwards;
}
.titulo-hallazgo {
  margin: 0 0 2px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--cobre);
  font-weight: 700;
}
.nombre { margin: 0; font-weight: 600; }

.recorte-nuevo {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 40;
  display: block;
  max-width: 330px;
  padding: 14px 18px;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(180deg, #2a2436, #221d2d);
  border: 1px solid #3d3552;
  border-radius: var(--radio);
  box-shadow: var(--sombra);
}
.recorte-nuevo:hover { border-color: var(--borde); }
.recorte-nuevo .cabecera-periodico {
  margin: 0 0 6px;
  font-size: 0.64rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--texto-apagado);
}
.recorte-nuevo .titular { margin: 0 0 6px; font-weight: 650; font-size: 0.9rem; line-height: 1.3; }
.recorte-nuevo .pie { margin: 0; font-size: 0.78rem; color: var(--cobre-claro); }

.hallazgo-enter-active { transition: opacity 0.3s, transform 0.3s cubic-bezier(0.2, 1.2, 0.4, 1); }
.hallazgo-leave-active { transition: opacity 0.25s, transform 0.25s; }
.hallazgo-enter-from, .hallazgo-leave-to { opacity: 0; transform: translateY(14px) scale(0.95); }

.ganancia-leave-active { transition: opacity 0.2s; }
.ganancia-leave-to { opacity: 0; }

.principal { padding-top: 28px; padding-bottom: 120px; flex: 1; }

/* La tira de sitio.
   El color lo pone `--tono`, que es el del mundo si estás en uno y el del
   camino si estás en su portada. Es la única pieza del juego que cambia de
   color según dónde estés, y por eso funciona: se reconoce sin leerla. */
.tira-sitio {
  border-top: 1px solid var(--borde-suave);
  background: linear-gradient(90deg, color-mix(in srgb, var(--tono) 14%, transparent), transparent 62%);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--tono) 30%, transparent);
}
.tira {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 32px;
  font-size: 0.79rem;
  /* Igual que la navegación: se desplaza cuando no cabe, no se dobla. Aquí
     importa más todavía, porque la tira está pegada arriba y una segunda fila
     taparía la primera línea del enunciado. */
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
}
.tira::-webkit-scrollbar { display: none; }
.tira > * { flex-shrink: 0; }

.tira .punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tono);
  box-shadow: 0 0 8px color-mix(in srgb, var(--tono) 70%, transparent);
}
.tira .eslabon {
  color: var(--texto-tenue);
  text-decoration: none;
  border-radius: 6px;
  padding: 2px 5px;
  margin: 0 -5px;
  transition: color 0.15s, background 0.15s;
}
.tira .eslabon:hover { color: var(--texto); background: var(--panel); }
/* El mundo pesa más que el camino a propósito: dentro de un reto la pregunta
   que uno se hace es «¿en qué mundo estoy?», no «¿en qué camino?». */
.tira .mundo { color: var(--texto); font-weight: 600; }
.tira .flecha { color: var(--texto-apagado); }
.tira .materia,
.tira .cuenta,
.tira .parte {
  font-size: 0.72rem;
  color: var(--texto-apagado);
  border: 1px solid var(--borde-suave);
  border-radius: 999px;
  padding: 1px 8px;
}
.tira .materia { color: color-mix(in srgb, var(--tono) 72%, var(--texto-tenue)); border-color: color-mix(in srgb, var(--tono) 32%, transparent); }
.tira .parte { margin-left: auto; }

.tira-enter-active, .tira-leave-active { transition: opacity 0.2s; }
.tira-enter-from, .tira-leave-to { opacity: 0; }

/* La barra dejó de caber en una línea cuando aparecieron el contador de racha y
   dos secciones más: a partir de aquí la navegación baja a su propia fila, en
   vez de doblarse dentro de una barra de altura fija y salirse por abajo. */
/* El lema es adorno: es lo primero que se va cuando la barra va justa, y con
   eso la navegación gana los cien píxeles que necesita para caber entera. */
@media (max-width: 1360px) {
  .lema { display: none; }
}

@media (max-width: 1150px) {
  .barra-superior { height: auto; padding-top: 12px; padding-bottom: 12px; flex-wrap: wrap; }
  .navegacion { order: 3; width: 100%; margin-left: 0; overflow-x: visible; flex-wrap: wrap; }
}

@media (max-width: 860px) {
  .hallazgo { right: 10px; left: 10px; }
  /* Lo que sobra cuando falta sitio son las tres etiquetas de al lado. El
     nombre del mundo no se va nunca: es lo único que la tira existe para
     decir. */
  .tira .materia, .tira .cuenta { display: none; }
}
</style>
