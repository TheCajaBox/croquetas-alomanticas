<script setup>
import { computed, ref } from 'vue'

import Avatar from '../componentes/Avatar.vue'
import GatoSvg from '../componentes/GatoSvg.vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import { ITINERARIOS, ITINERARIO_POR_DEFECTO, itinerarioDelSitio } from '../contenido/itinerarios.js'
import { LEMAS_POR_NARRADOR } from '../contenido/narrador/lemas.js'
import { mundosDelItinerario } from '../contenido/mundos.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarProgreso } from '../almacen/progreso.js'
import { usarRumbo } from '../almacen/rumbo.js'

/**
 * La puerta: qué se quiere aprender.
 *
 * Antes esto era la lista de mundos, y con un solo itinerario estaba bien. Con
 * varios, lo primero tiene que ser elegir, y **no se redirige solo** al que
 * venías jugando: si `/` salta directo al itinerario de siempre, los demás dejan
 * de existir para quien ya tenía partida. Se marca por dónde ibas en cada uno y
 * se elige igual.
 *
 * ## Por qué el orden importa y no se toca aquí
 *
 * Las tarjetas salen en el orden de `ITINERARIOS`, que es una decisión escrita
 * en `contenido/itinerarios.js` y con su prueba: primero los dos que más se
 * usan, después el de mirar el código como quien quiere entrar, y al final el de
 * entender lo que pasa por debajo. Esta vista no reordena nada; si el orden
 * cambia, se cambia allí.
 *
 * Y **ninguna tarjeta se cierra nunca**. Los cuatro caminos son independientes:
 * no hay que terminar uno para empezar otro, y por eso aquí no hay candados. Lo
 * único que puede estar cerrado es un camino sin escribir, y eso se dice.
 */
const progreso = usarProgreso()
const gatos = usarGatos()
const rumbo = usarRumbo()

const caminos = computed(() =>
  ITINERARIOS.map((itinerario) => {
    const avance = progreso.avanceDelItinerario(itinerario.id)
    const siguiente = progreso.porDondeIba(itinerario.id)
    const mundos = mundosDelItinerario(itinerario.id)
    return {
      ...itinerario,
      ...avance,
      siguiente,
      // Los nombres de los mundos, para verlos sin entrar: es la pregunta que
      // se hace cualquiera antes de elegir -«¿y qué hay dentro?»- y contestarla
      // aquí ahorra cuatro vueltas.
      nombresDeMundos: mundos.map((mundo) => mundo.nombre),
      // Un itinerario sin mundos todavía no se puede jugar. Sale igual, para
      // que se vea que viene, pero no lleva a ninguna parte.
      enObras: avance.mundos === 0,
      porcentaje: avance.total ? Math.round((avance.hechos / avance.total) * 100) : 0,
      empezadoAqui: avance.hechos > 0,
    }
  }),
)

/** Los tres números del héroe, contados y no escritos a mano. */
const cuentas = computed(() => {
  const jugables = caminos.value.filter((camino) => !camino.enObras)
  return {
    caminos: jugables.length,
    mundos: jugables.reduce((suma, camino) => suma + camino.mundos, 0),
    retos: jugables.reduce((suma, camino) => suma + camino.total, 0),
  }
})

/** Cuántos caminos llevas tocados: lo que decide el saludo de arriba. */
const empezados = computed(() => caminos.value.filter((camino) => camino.empezadoAqui).length)

/**
 * El lema del retrato, y cambia al pulsarlo.
 *
 * Quién sale aquí no se escribe a mano: es quien narra el camino por defecto,
 * con su retrato y sus lemas. Escribirlo a mano es el fallo que este proyecto ha
 * cometido cinco veces, y hay una prueba que lo caza.
 */
const quienRecibe = ITINERARIOS.find((cada) => cada.id === ITINERARIO_POR_DEFECTO)?.retrato
const susLemas = LEMAS_POR_NARRADOR[quienRecibe] ?? []
const cualLema = ref(0)
const lema = computed(() => susLemas[cualLema.value % (susLemas.length || 1)] ?? '')
const otroLema = () => {
  cualLema.value += 1
}

const colonia = computed(() => gatos.adoptados)

/**
 * A dónde lleva pulsar un gato desde aquí.
 *
 * Los gatos son tuyos en los cuatro caminos y esta es la puerta de los cuatro,
 * así que aquí se enseñan siempre. Su **casa**, en cambio, está en Elendel: si
 * el camino donde estabas no la tiene, el enlace no puede ir a la casa —el
 * guardián del enrutador te devolvería— y va al camino donde la casa está. Un
 * enlace que lleva a algo, en vez de una puerta que rebota.
 */
const dondeVivenLosGatos = computed(() => {
  if (rumbo.hay('colonia')) return { to: '/colonia', etiqueta: 'Ir a la casa →' }
  const suyo = itinerarioDelSitio('colonia')
  if (!suyo) return null
  return {
    to: { name: 'itinerario', params: { itinerarioId: suyo.id } },
    etiqueta: `Su casa está en ${suyo.nombre} →`,
  }
})
</script>

<template>
  <div class="pila entrada">
    <section class="panel heroe">
      <SombreroEscondido id="entrada" :posicion="{ top: '14px', right: '18px' }" />

      <div class="heroe-texto">
        <p class="sobretitulo">Aprender a programar, versión larga</p>
        <h1>Escribes código. Se ejecuta. Te pagan en croquetas.</h1>
        <p class="entradilla">
          Nada de elegir la respuesta correcta de una lista: escribes, se ejecuta en un sandbox
          de verdad y unos tests dicen si va. Lo que ganes se lo comen unos gatos que, cuando
          están contentos, te devuelven el favor cambiando las reglas a tu favor.
        </p>

        <div class="cuentas">
          <span class="cuenta"><b>{{ cuentas.caminos }}</b> caminos</span>
          <span class="cuenta"><b>{{ cuentas.mundos }}</b> mundos</span>
          <span class="cuenta"><b>{{ cuentas.retos }}</b> retos</span>
          <span class="cuenta suelto">0 anuncios</span>
        </div>

        <p class="tenue letra-pequena">
          Los cuatro son <b>independientes</b>: no hay que terminar ninguno para empezar otro, y
          las croquetas, los gatos, los sombreros y las insignias son los mismos en los cuatro.
          Lo ganaste tú, no lo ganó un camino.
        </p>
      </div>

      <button v-if="quienRecibe" class="retrato" type="button" @click="otroLema">
        <Avatar :quien="quienRecibe" :tamano="96" />
        <span class="bocadillo">{{ lema }}</span>
        <span class="tenue otra">otra ↻</span>
      </button>
    </section>

    <div class="fila titulo-caminos">
      <h2>{{ empezados > 0 ? 'Por dónde sigues hoy' : 'Elige por dónde empiezas' }}</h2>
      <p v-if="empezados > 1" class="tenue">
        Llevas {{ empezados }} caminos abiertos a la vez. Muy bien, eso está permitido.
      </p>
    </div>

    <div class="caminos">
      <component
        :is="camino.enObras ? 'div' : 'RouterLink'"
        v-for="(camino, cual) in caminos"
        :key="camino.id"
        :to="camino.enObras ? undefined : { name: 'itinerario', params: { itinerarioId: camino.id } }"
        class="camino panel"
        :class="{ obras: camino.enObras }"
        :style="{ '--color-camino': camino.color }"
      >
        <div class="fila cabecera">
          <span class="etiqueta lenguaje">{{ camino.etiquetaLenguaje }}</span>
          <span v-if="cual === 0 && !camino.empezadoAqui" class="etiqueta sugerido">
            si no sabes por dónde, por aquí
          </span>
          <span v-if="camino.enObras" class="etiqueta obras-aviso">en obras</span>
          <span v-else-if="camino.hechos === camino.total" class="etiqueta hecho">completado</span>
          <span v-else-if="camino.empezadoAqui" class="etiqueta empezado">empezado</span>
        </div>

        <div class="fila titulo">
          <Avatar :quien="camino.reparto.narra" :tamano="56" />
          <div>
            <h3>{{ camino.nombre }}</h3>
            <p class="tenue ambiente">{{ camino.ambiente }}</p>
          </div>
        </div>

        <p class="para-que">{{ camino.paraQue }}</p>
        <p class="tenue resumen">{{ camino.resumen }}</p>

        <p v-if="camino.enObras" class="tenue en-obras">
          Todavía no hay nada que jugar aquí. Está en camino.
        </p>

        <template v-else>
          <ol class="mundos">
            <li v-for="nombre in camino.nombresDeMundos" :key="nombre">{{ nombre }}</li>
          </ol>

          <div class="avance">
            <div class="barra">
              <i :style="{ width: `${camino.porcentaje}%`, background: camino.color }" />
            </div>
            <span class="tenue cuenta-retos">{{ camino.hechos }} de {{ camino.total }}</span>
          </div>

          <div class="fila pie">
            <p class="siguiente">
              <template v-if="camino.siguiente">
                <span class="tenue">{{ camino.empezado ? 'Seguías por' : 'Se empieza por' }}</span>
                «{{ camino.siguiente.titulo }}»
              </template>
              <template v-else>No te queda nada aquí. Enhorabuena, y qué vacío se queda esto.</template>
            </p>
            <span class="boton">{{ camino.empezado ? 'Seguir' : 'Empezar' }} →</span>
          </div>
        </template>
      </component>
    </div>

    <RouterLink v-if="!progreso.vistoLaAntesala" to="/antesala" class="panel antesala-aviso">
      <Avatar quien="steris" :tamano="52" />
      <div>
        <p class="titulo-antesala">¿No has programado nunca?</p>
        <p class="tenue">
          Steris ha preparado una lista con lo que hay que saber antes de empezar, valga el
          camino que valga: qué es un programa, qué es un lenguaje y cómo funciona esto. Dos
          minutos, y los ha contado.
        </p>
      </div>
      <span class="flecha" aria-hidden="true">→</span>
    </RouterLink>

    <section v-if="colonia.length" class="panel colonia">
      <div class="fila cabecera-colonia">
        <h2>Tu colonia</h2>
        <RouterLink v-if="dondeVivenLosGatos" :to="dondeVivenLosGatos.to" class="tenue">
          {{ dondeVivenLosGatos.etiqueta }}
        </RouterLink>
      </div>
      <p class="tenue vive-aqui">
        Los mismos gatos para los cuatro caminos: lo que ganes en uno se lo comen igual, y sus
        bonos te los dan donde estés. No tienen ninguna opinión sobre qué lenguaje aprendes.
      </p>
      <div class="miniaturas">
        <component
          :is="dondeVivenLosGatos ? 'RouterLink' : 'div'"
          v-for="gato in colonia"
          :key="gato.id"
          :to="dondeVivenLosGatos?.to"
          class="miniatura"
          :title="gato.nombre"
        >
          <GatoSvg
            :aspecto="gato.aspecto"
            :animo="gato.felicidad >= 60 ? 'contento' : gato.felicidad >= 30 ? 'normal' : 'triste'"
            :tamano="62"
          />
          <span class="nombre tenue">{{ gato.nombre }}</span>
        </component>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* --- el héroe ------------------------------------------------------------ */

.heroe {
  position: relative;
  display: flex;
  gap: 28px;
  align-items: flex-start;
  overflow: hidden;
  background:
    radial-gradient(120% 140% at 88% 0%, rgba(201, 139, 75, 0.16), transparent 62%),
    radial-gradient(90% 120% at 0% 100%, rgba(149, 120, 186, 0.14), transparent 58%),
    var(--panel);
}
.heroe-texto { flex: 1; min-width: 0; }

.sobretitulo {
  margin: 0 0 6px;
  font-family: var(--mono);
  font-size: 0.76rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--cobre-claro);
}
.heroe h1 {
  margin: 0 0 12px;
  max-width: 30ch;
  font-size: clamp(1.6rem, 4.4vw, 2.5rem);
  line-height: 1.12;
  letter-spacing: -0.015em;
}
.entradilla { margin: 0 0 16px; max-width: 66ch; font-size: 1rem; }
.letra-pequena { margin: 14px 0 0; max-width: 72ch; font-size: 0.85rem; }

.cuentas { display: flex; flex-wrap: wrap; gap: 8px; }
.cuenta {
  padding: 5px 11px;
  border: 1px solid var(--borde);
  border-radius: 999px;
  background: var(--fondo-alto);
  font-size: 0.84rem;
  color: var(--texto-tenue);
}
.cuenta b { color: var(--texto); font-size: 0.98rem; }
/* El de los anuncios es un chiste y se le nota: va en cursiva y sin número. */
.cuenta.suelto { font-style: italic; border-style: dashed; }

/* El retrato es un botón: pulsarlo cambia el lema. Es un juguete, y por eso no
   lleva ningún indicio de que haga falta pulsarlo para algo. */
.retrato {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 210px;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
}
.bocadillo {
  position: relative;
  padding: 10px 13px;
  border: 1px solid var(--borde);
  border-radius: var(--radio-menudo);
  background: var(--fondo-alto);
  font-size: 0.85rem;
  line-height: 1.4;
  text-align: center;
}
.bocadillo::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  width: 10px;
  height: 10px;
  transform: translateX(-50%) rotate(45deg);
  border-top: 1px solid var(--borde);
  border-left: 1px solid var(--borde);
  background: var(--fondo-alto);
}
.retrato .otra { font-size: 0.72rem; opacity: 0; transition: opacity 0.15s; }
.retrato:hover .otra, .retrato:focus-visible .otra { opacity: 1; }

/* --- las tarjetas ------------------------------------------------------- */

.titulo-caminos { justify-content: space-between; align-items: baseline; gap: 12px; margin: 6px 0 -4px; }
.titulo-caminos h2 { margin: 0; }
.titulo-caminos p { margin: 0; font-size: 0.86rem; }

/* 400 y no 340: con cuatro caminos, a 340 entran tres en la primera fila y el
   cuarto se queda solo debajo. A 400 caen de dos en dos y se lee como una
   rejilla en vez de como una lista mal cortada. */
.caminos { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 18px; }
.camino {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 11px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  border-top: 3px solid var(--color-camino);
  transition: transform 0.15s, background 0.15s, box-shadow 0.15s;
}
/* Un halo del color del camino, muy flojo, que se enciende al pasar por encima:
   es lo que hace que cuatro tarjetas iguales dejen de parecer una tabla. */
.camino::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(80% 60% at 50% -10%, var(--color-camino), transparent 70%);
  opacity: 0.06;
  transition: opacity 0.15s;
}
a.camino:hover { transform: translateY(-3px); background: var(--panel-alto); box-shadow: var(--sombra); }
a.camino:hover::after { opacity: 0.14; }
.camino.obras { opacity: 0.72; }

.cabecera { gap: 8px; flex-wrap: wrap; }
.lenguaje { color: var(--color-camino); border-color: var(--color-camino); }
.obras-aviso, .hecho, .empezado, .sugerido { font-size: 0.7rem; }
.sugerido { color: var(--verde); border-color: rgba(95, 185, 138, 0.45); }
.empezado { color: var(--ambar); border-color: rgba(217, 180, 92, 0.4); }

.titulo { gap: 14px; align-items: center; }
.titulo h3 { margin: 0 0 2px; font-size: 1.3rem; }
.ambiente { margin: 0; font-size: 0.82rem; }

.para-que { margin: 0; font-size: 0.95rem; font-weight: 550; }
.resumen { margin: 0; font-size: 0.87rem; }
.en-obras { margin: 0; font-size: 0.86rem; }

/* Los mundos, en pequeño y numerados: es la respuesta a «¿y qué hay dentro?»
   sin tener que entrar a mirar. */
.mundos {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px;
  margin: 2px 0 0;
  padding: 0;
  list-style: none;
  counter-reset: mundo;
}
.mundos li {
  padding: 3px 8px;
  border: 1px solid var(--borde-suave);
  border-radius: 999px;
  background: var(--fondo-alto);
  font-size: 0.74rem;
  color: var(--texto-tenue);
  counter-increment: mundo;
}
.mundos li::before { content: counter(mundo) '. '; color: var(--texto-apagado); }

.avance { display: flex; align-items: center; gap: 10px; margin-top: auto; }
.avance .barra { flex: 1; }
.cuenta-retos { font-size: 0.8rem; white-space: nowrap; }

.pie { justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.siguiente { margin: 0; font-size: 0.88rem; }
.boton {
  padding: 8px 16px;
  border-radius: var(--radio-menudo);
  font-weight: 650;
  font-size: 0.92rem;
  color: var(--color-camino);
  border: 1px solid var(--color-camino);
  white-space: nowrap;
}
a.camino:hover .boton { background: var(--color-camino); color: #16131f; }

/* --- lo de abajo -------------------------------------------------------- */

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

.cabecera-colonia { justify-content: space-between; margin-bottom: 6px; }
.cabecera-colonia h2 { margin: 0; }
.cabecera-colonia a { text-decoration: none; font-size: 0.88rem; }
.vive-aqui { margin: 0 0 14px; font-size: 0.88rem; max-width: 78ch; }
.miniaturas { display: flex; flex-wrap: wrap; gap: 14px; }
.miniatura { display: flex; flex-direction: column; align-items: center; gap: 2px; text-decoration: none; }
.miniatura .nombre { font-size: 0.78rem; }

/* El retrato es lo primero que se va cuando no hay sitio: es adorno, y el texto
   del héroe no lo es. */
@media (max-width: 780px) {
  .heroe { flex-direction: column; }
  .retrato { flex-direction: row; align-self: stretch; width: auto; }
  .bocadillo { text-align: left; }
  .bocadillo::before { top: 50%; left: -6px; transform: translateY(-50%) rotate(-45deg); }
  .retrato .otra { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .camino, .antesala-aviso, .camino::after, .retrato .otra { transition: none; }
  a.camino:hover, .antesala-aviso:hover { transform: none; }
}
</style>
