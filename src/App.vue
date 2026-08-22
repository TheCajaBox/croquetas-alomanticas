<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import Narrador from './componentes/Narrador.vue'
import PanelArmonia from './componentes/PanelArmonia.vue'
import PanelGlosario from './componentes/PanelGlosario.vue'
import SombreroEscondido from './componentes/SombreroEscondido.vue'
import { usarArmonia } from './almacen/armonia.js'
import { usarEconomia } from './almacen/economia.js'
import { usarGatos } from './almacen/gatos.js'
import { usarProgreso } from './almacen/progreso.js'
import { usarRecortes } from './almacen/recortes.js'
import { usarSombreros } from './almacen/sombreros.js'
import { RETOS } from './contenido/retos/index.js'
import { RECORTES_POR_ID } from './contenido/recortes.js'
import { SOMBREROS_POR_ID } from './contenido/sombreros.js'

const armonia = usarArmonia()
const economia = usarEconomia()
const gatos = usarGatos()
const progreso = usarProgreso()
const sombreros = usarSombreros()
const recortes = usarRecortes()
const { croquetas } = storeToRefs(economia)
const { ultimoEncontrado } = storeToRefs(sombreros)
const { ultimoEncontrado: ultimoRecorte } = storeToRefs(recortes)

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
const recorteReciente = computed(() =>
  ultimoRecorte.value ? RECORTES_POR_ID[ultimoRecorte.value.id] : null,
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
          <span class="apagado lema">narra Wayne · pagan los gatos</span>
        </RouterLink>

        <nav class="navegacion">
          <RouterLink to="/">Caminos</RouterLink>
          <RouterLink to="/colonia">Colonia</RouterLink>
          <RouterLink to="/glosario">Glosario</RouterLink>
          <!-- Armonía no es una pantalla, es un cajón que se abre encima: va
               como botón, pero se viste igual que sus vecinos para que no
               parezca otra cosa. -->
          <button type="button" class="como-enlace" @click="armonia.abrir()">Armonía</button>
          <RouterLink to="/refugio" class="con-aviso">
            Refugio
            <span v-if="enElRefugio" class="aviso">{{ enElRefugio }}</span>
          </RouterLink>
          <RouterLink to="/sombrerera">Sombrerera</RouterLink>
          <RouterLink to="/trastos">Cajón</RouterLink>
          <RouterLink to="/ajustes">Ajustes</RouterLink>
        </nav>

        <div class="contadores">
          <RouterLink to="/sombrerera" class="contador sombreros" title="Sombreros encontrados">
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
        <p class="cabecera-periodico">Elendel Daily · edición especial</p>
        <p class="titular">{{ recorteReciente.titular }}</p>
        <p class="pie">Recorte nuevo en el cajón →</p>
      </RouterLink>
    </Transition>

    <PanelArmonia />
    <PanelGlosario />

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

.navegacion { display: flex; gap: 4px; margin-left: auto; flex-wrap: wrap; }
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

/* La barra dejó de caber en una línea cuando aparecieron el contador de racha y
   dos secciones más: a partir de aquí la navegación baja a su propia fila, en
   vez de doblarse dentro de una barra de altura fija y salirse por abajo. */
@media (max-width: 1150px) {
  .barra-superior { height: auto; padding-top: 12px; padding-bottom: 12px; flex-wrap: wrap; }
  .navegacion { order: 3; width: 100%; margin-left: 0; }
}

@media (max-width: 860px) {
  .hallazgo { right: 10px; left: 10px; }
}
</style>
