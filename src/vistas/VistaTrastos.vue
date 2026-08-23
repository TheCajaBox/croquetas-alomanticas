<script setup>
import { computed } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import { RECORTES } from '../contenido/recortes.js'
import { TRASTOS, TRASTOS_POR_ID, trastosDelCamino } from '../contenido/trastos.js'
import { usarEconomia } from '../almacen/economia.js'

import { porqueDe } from '../contenido/insignias.js'
import { usarInsignias } from '../almacen/insignias.js'
import { usarRecortes } from '../almacen/recortes.js'
import { usarRumbo } from '../almacen/rumbo.js'
import { ITINERARIOS, ITINERARIOS_POR_ID } from '../contenido/itinerarios.js'
import { nombreDe } from '../contenido/personajes.js'

const economia = usarEconomia()
const recortes = usarRecortes()
const insignias = usarInsignias()

/**
 * De quién son las insignias.
 *
 * El cajón es una página global -las insignias se ganan en cualquier camino- y
 * ponía «Las insignias de Marasi» a mano, que es quien revisa en la segunda era.
 * Las reparte quien revisa allí donde estés: en la primera era, Brisa.
 */
const rumbo = usarRumbo()
const quienLasReparte = computed(
  () => ITINERARIOS_POR_ID[rumbo.dondeEstoy]?.reparto.revisa ?? 'marasi',
)

/**
 * Y quién vende las pistas, por lo mismo.
 *
 * La entradilla decía «Wayne no roba: intercambia», y los trastos los da quien
 * te vende las pistas, que en la primera era es Fantasma, en Elantris Karata y
 * en Sel Han ShuXen. Es la misma errata que la de las insignias, en el párrafo
 * de al lado.
 */
const quienLosCambia = computed(
  () => nombreDe(ITINERARIOS_POR_ID[rumbo.dondeEstoy]?.reparto.pistas ?? 'wayne'),
)

const mios = computed(() =>
  [...new Set(economia.trastos)].map((id) => ({
    ...TRASTOS_POR_ID[id],
    veces: economia.trastos.filter((otro) => otro === id).length,
  })),
)

/**
 * El cajón, ordenado por el camino de donde salió cada cosa.
 *
 * Cada camino tiene el suyo -Wayne intercambia, Fantasma guarda por si acaso,
 * Karata vive donde nada se tira y Han ShuXen entrega material con su
 * procedencia-, así que verlos revueltos perdía la mitad de la gracia: junta el
 * mendrugo de Luthadel con el informe de tres líneas de un general de Sel y no
 * se entiende ninguno de los dos.
 *
 * Solo salen los caminos de los que tengas algo. Un apartado vacío diría
 * «aquí falta algo», y no falta: es que no has pedido pistas allí.
 */
const porCaminos = computed(() =>
  ITINERARIOS.map((itinerario) => ({
    itinerario,
    suyos: mios.value.filter((trasto) => trasto.camino === itinerario.id),
    cuantos: trastosDelCamino(itinerario.id).length,
  })).filter((grupo) => grupo.suyos.length > 0),
)
</script>

<template>
  <div class="pila">
    <section class="panel encabezado">
      <SombreroEscondido id="trastos" :posicion="{ bottom: '16px', right: '18px' }" />
      <h1>El cajón</h1>
      <p class="tenue">
        {{ quienLosCambia }} no roba: intercambia. Cada pista que le compras se paga en croquetas
        y te deja algo a cambio, muy serio. Nada de esto vale nada ni sirve para nada; es solo el
        recordatorio de cuántas veces has pedido ayuda.
      </p>
      <p class="cuenta">
        {{ economia.trastos.length }} intercambio{{ economia.trastos.length === 1 ? '' : 's' }} ·
        {{ mios.length }} de {{ TRASTOS.length }} trastos distintos
      </p>
    </section>

    <template v-if="mios.length">
      <section v-for="grupo in porCaminos" :key="grupo.itinerario.id" class="de-un-camino">
        <h2 class="de-donde" :style="{ '--tono': grupo.itinerario.color }">
          <span class="punto" aria-hidden="true" />
          {{ grupo.itinerario.nombre }}
          <span class="cuantos tenue">{{ grupo.suyos.length }} de {{ grupo.cuantos }}</span>
        </h2>
        <div class="rejilla">
          <article v-for="trasto in grupo.suyos" :key="trasto.id" class="trasto panel">
            <div class="fila cabecera">
              <h3>{{ trasto.nombre }}</h3>
              <span v-if="trasto.veces > 1" class="etiqueta">×{{ trasto.veces }}</span>
            </div>
            <p class="tenue nota">{{ trasto.nota }}</p>
          </article>
        </div>
      </section>
    </template>

    <section v-else class="panel centrado">
      <p class="tenue">De momento no hay trastos. Enhorabuena: no has pedido ni una pista de pago.</p>
    </section>

    <section class="panel encabezado">
      <h2>Las insignias de {{ nombreDe(quienLasReparte) }}</h2>
      <p class="tenue">
        Las apunta ella, y no valen ni una croqueta a propósito: si pagaran dejarían de ser
        un reconocimiento y pasarían a ser deberes. Nadie te las pide y no hacen falta para
        nada.
      </p>
      <p class="cuenta">{{ insignias.cuantas }} de {{ insignias.total }} insignias</p>
    </section>

    <div v-if="insignias.mias.length" class="rejilla">
      <article v-for="insignia in insignias.mias" :key="insignia.id" class="insignia panel">
        <h3>{{ insignia.nombre }}</h3>
        <p class="tenue">{{ porqueDe(insignia, rumbo.dondeEstoy) }}</p>
      </article>
    </div>

    <section v-else class="panel centrado">
      <p class="tenue">Ninguna todavía. No las busques: llegan solas.</p>
    </section>

    <section class="panel encabezado recortes-cabecera">
      <h2>Recortes del Elendel Daily</h2>
      <p class="tenue">
        Aparecen solos, y no por buscarlos: se consiguen haciendo cosas. Cuáles, no se dice.
        El titular es cosa del periódico; lo de abajo suele merecer la pena.
      </p>
      <p class="cuenta">{{ recortes.cuantos }} de {{ recortes.total }} recortes</p>
    </section>

    <div v-if="recortes.mios.length" class="rejilla">
      <article v-for="recorte in recortes.mios" :key="recorte.id" class="recorte panel">
        <p class="cabecera-periodico">Elendel Daily</p>
        <h3>{{ recorte.titular }}</h3>
        <p class="entradilla">{{ recorte.entradilla }}</p>
        <p class="consejo">{{ recorte.consejo }}</p>
      </article>
    </div>

    <section v-else class="panel centrado">
      <p class="tenue">Ni un recorte todavía. Sigue jugando; ya caerá alguno.</p>
    </section>

    <p class="tenue nota-final">
      Faltan {{ recortes.total - recortes.cuantos }} recorte(s) por descubrir de
      {{ RECORTES.length }}.
    </p>
  </div>
</template>

<style scoped>
.de-un-camino + .de-un-camino { margin-top: 26px; }
.de-donde {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 12px;
  font-size: 0.95rem;
  font-weight: 650;
}
.de-donde .punto {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--tono);
  box-shadow: 0 0 9px color-mix(in srgb, var(--tono) 65%, transparent);
}
.de-donde .cuantos { font-weight: 400; font-size: 0.8rem; font-variant-numeric: tabular-nums; }

.insignia h3 { margin: 0 0 6px; font-size: 0.98rem; color: var(--cobre-claro); }
.insignia p { margin: 0; font-size: 0.86rem; }

.encabezado { position: relative; }
.encabezado p { max-width: 72ch; }
.cuenta { margin: 0; font-size: 0.9rem; color: var(--cobre-claro); }
.rejilla { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.recortes-cabecera { margin-top: 8px; }
.recortes-cabecera h2 { margin-bottom: 6px; }

/* Los recortes van con aire de papel viejo, para que no parezcan una tarjeta más. */
.recorte {
  background: linear-gradient(180deg, #262032, #201b2a);
  border-color: #3d3552;
}
.cabecera-periodico {
  margin: 0 0 8px;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--texto-apagado);
  border-bottom: 1px solid var(--borde-suave);
  padding-bottom: 6px;
}
.recorte h3 {
  margin: 0 0 8px;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  line-height: 1.3;
}
.entradilla { margin: 0 0 12px; font-size: 0.86rem; font-style: italic; color: var(--texto-tenue); }
.consejo {
  margin: 0;
  font-size: 0.87rem;
  padding-top: 10px;
  border-top: 1px dashed var(--borde);
}
.nota-final { text-align: center; font-size: 0.85rem; margin: 0; }
.cabecera { justify-content: space-between; margin-bottom: 6px; }
.trasto h3 { margin: 0; font-size: 0.98rem; }
.nota { margin: 0; font-size: 0.86rem; font-style: italic; }
</style>
