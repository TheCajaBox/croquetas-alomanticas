<script setup>
import { computed, ref } from 'vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'

import { NIVELES_DE_VERBORREA, usarNarrador } from '../almacen/narrador.js'
import { usarEconomia } from '../almacen/economia.js'
import { usarGatos } from '../almacen/gatos.js'
import { usarProgreso } from '../almacen/progreso.js'
import { usarSombreros } from '../almacen/sombreros.js'
import { borrarPartida, exportarPartida, importarPartida } from '../almacen/persistencia.js'
import { olvidarAjustesDeProveedor } from '../almacen/clave.js'
import { usarArmonia } from '../almacen/armonia.js'
import { usarRumbo } from '../almacen/rumbo.js'
import { ITINERARIOS_POR_ID } from '../contenido/itinerarios.js'
import { nombreDe } from '../contenido/personajes.js'
import { PROVEEDORES, PROVEEDORES_POR_ID } from '../motor/armonia/proveedores.js'

const narrador = usarNarrador()
const rumbo = usarRumbo()

/**
 * Quién narra donde estés, para el rótulo de la verborrea.
 *
 * Decía «Cuánto habla Wayne» en los cuatro caminos, y Wayne no habla en tres de
 * ellos. Los ajustes no pertenecen a ningún camino, así que se hereda el último
 * por el que pasaste, que es exactamente lo que hace la barra de arriba.
 */
const quienNarraAqui = computed(() =>
  nombreDe(ITINERARIOS_POR_ID[rumbo.dondeEstoy]?.reparto.narra ?? 'wayne'),
)
const progreso = usarProgreso()
const economia = usarEconomia()
const gatos = usarGatos()
const sombreros = usarSombreros()

const armonia = usarArmonia()

const proveedorElegido = ref(armonia.proveedor.proveedor)
const clave = ref(armonia.proveedor.clave)
const modelo = ref(armonia.proveedor.modelo)
const url = ref(armonia.proveedor.url)
const avisoVoz = ref('')

/** Al cambiar de proveedor se propone su modelo, que nadie se los sabe. */
function alCambiarProveedor() {
  avisoVoz.value = ''
  const elegido = PROVEEDORES_POR_ID[proveedorElegido.value]
  if (!elegido) return
  if (!modelo.value) modelo.value = elegido.modeloPorDefecto
  if (!url.value) url.value = elegido.url
}

function guardarVoz() {
  armonia.guardarProveedor({
    proveedor: proveedorElegido.value,
    clave: clave.value.trim(),
    modelo: modelo.value.trim() || PROVEEDORES_POR_ID[proveedorElegido.value]?.modeloPorDefecto || '',
    url: url.value.trim(),
  })
  avisoVoz.value = armonia.conVozPrestada ? 'Guardado. Armonía ya conversa.' : 'Falta la clave.'
}

function quitarVoz() {
  olvidarAjustesDeProveedor()
  armonia.guardarProveedor({ proveedor: '', clave: '', modelo: '', url: '' })
  proveedorElegido.value = ''
  clave.value = ''
  modelo.value = ''
  url.value = ''
  avisoVoz.value = 'Quitada. Armonía vuelve a contestar solo con lo que recuerda.'
}

const textoDePartida = ref('')
const aviso = ref('')
const confirmandoBorrado = ref(false)

const resumen = computed(() => [
  { titulo: 'Retos superados', valor: progreso.retosSuperados },
  { titulo: 'Mejor racha sin pistas', valor: progreso.mejorRacha },
  { titulo: 'Croquetas ganadas', valor: economia.ganadasEnTotal },
  { titulo: 'Croquetas gastadas en pistas', valor: economia.gastadasEnTotal },
  { titulo: 'Gatos en la colonia', valor: gatos.adoptados.length },
  { titulo: 'Sombreros encontrados', valor: `${sombreros.cuantos} de ${sombreros.total}` },
])

function copiarPartida() {
  textoDePartida.value = exportarPartida()
  aviso.value = 'Ahí tienes la partida. Cópiala y guárdala donde quieras.'
}

function traerPartida() {
  aviso.value = importarPartida(textoDePartida.value)
    ? 'Partida cargada. Recarga la página para verla.'
    : 'Eso no parece una partida de este juego.'
}

function empezarDeCero() {
  if (!confirmandoBorrado.value) {
    confirmandoBorrado.value = true
    return
  }
  borrarPartida()
  window.location.reload()
}
</script>

<template>
  <div class="pila">
    <section class="panel">
      <h1>Ajustes</h1>
      <p class="tenue">El progreso se guarda en este navegador. Ni cuentas ni servidores.</p>
    </section>

    <section class="panel">
      <h2>Cuánto habla {{ quienNarraAqui }}</h2>
      <div class="opciones">
        <label v-for="nivel in NIVELES_DE_VERBORREA" :key="nivel.id" class="opcion">
          <input
            type="radio"
            name="verborrea"
            :value="nivel.id"
            :checked="narrador.verborrea === nivel.id"
            @change="narrador.cambiarVerborrea(nivel.id)"
          />
          <span>{{ nivel.titulo }}</span>
        </label>
      </div>
      <p class="tenue nota">
        Ni con la última se calla del todo: los avisos que hacen falta para resolver un reto
        los sigue dando.
      </p>
    </section>

    <section class="panel">
      <h2>Cómo va la cosa</h2>
      <ul class="resumen">
        <li v-for="dato in resumen" :key="dato.titulo">
          <span class="tenue">{{ dato.titulo }}</span>
          <strong>{{ dato.valor }}</strong>
        </li>
      </ul>
    </section>

    <section class="panel">
      <h2>La voz de Armonía</h2>
      <p class="tenue">
        Armonía funciona sin configurar nada: recuerda los apuntes, el glosario y los errores
        del juego, y lee tu código para decirte qué le pasa. Si quieres que además
        <strong>converse</strong>, puedes enchufarle una clave tuya.
      </p>

      <div class="aviso-clave">
        <p><strong>Antes de poner nada, dos cosas.</strong></p>
        <ul>
          <li>
            La clave se guarda <strong>solo en este navegador</strong>, aparte de la partida.
            Exportar tu partida no se la lleva.
          </li>
          <li>
            Tu pregunta, el enunciado, el apunte y <strong>el código que tengas escrito</strong>
            se envían al proveedor que elijas. Si eso no te vale, deja esto vacío: sin clave el
            juego no manda nada a ninguna parte.
          </li>
        </ul>
        <p class="tenue">
          Siga como siga configurado, Armonía nunca te dará la solución de un reto: no la
          recibe, así que no puede repetirla.
        </p>
      </div>

      <label class="campo">
        <span>Proveedor</span>
        <select v-model="proveedorElegido" @change="alCambiarProveedor">
          <option value="">Ninguno (solo lo que recuerda)</option>
          <option v-for="p in PROVEEDORES" :key="p.id" :value="p.id">{{ p.nombre }}</option>
        </select>
      </label>

      <template v-if="proveedorElegido">
        <p class="tenue nota-proveedor">{{ PROVEEDORES_POR_ID[proveedorElegido].nota }}</p>

        <label class="campo">
          <span>Tu clave</span>
          <input v-model="clave" type="password" autocomplete="off" placeholder="sk-..." />
        </label>

        <label class="campo">
          <span>Modelo</span>
          <input v-model="modelo" type="text" :placeholder="PROVEEDORES_POR_ID[proveedorElegido].modeloPorDefecto" />
        </label>

        <label v-if="proveedorElegido === 'personalizado'" class="campo">
          <span>Dirección</span>
          <input v-model="url" type="text" placeholder="https://…/v1" />
        </label>

        <div class="fila acciones">
          <button class="principal" @click="guardarVoz">Guardar</button>
          <button @click="quitarVoz">Quitar la clave</button>
        </div>
      </template>

      <!-- Fuera del v-if a propósito: al quitar la clave la sección de arriba
           desaparece, y con ella desaparecería la confirmación de que se ha
           quitado. Quedarse sin respuesta ninguna se lee como que no funcionó. -->
      <p v-if="avisoVoz" class="tenue confirmacion">{{ avisoVoz }}</p>
    </section>

    <section class="panel">
      <h2>Llevarte la partida a otro sitio</h2>
      <p class="tenue nota">
        El móvil y el ordenador son partidas distintas: cada navegador guarda la suya. Con esto
        se pasa de uno a otro.
      </p>
      <div class="fila botones">
        <button @click="copiarPartida">Exportar</button>
        <button :disabled="!textoDePartida.trim()" @click="traerPartida">Importar lo de abajo</button>
      </div>
      <textarea
        v-model="textoDePartida"
        rows="6"
        spellcheck="false"
        placeholder="Aquí saldrá tu partida al exportar, o pega aquí la que quieras importar."
      />
      <p v-if="aviso" class="aviso">{{ aviso }}</p>
    </section>

    <section class="panel peligro">
      <SombreroEscondido id="ajustes" :posicion="{ top: '14px', right: '16px' }" />
      <h2>Empezar de cero</h2>
      <p class="tenue nota">
        Se borra todo: retos, croquetas, trastos y gatos. No hay vuelta atrás.
      </p>
      <button class="borrar" @click="empezarDeCero">
        {{ confirmandoBorrado ? 'Pulsa otra vez para borrarlo todo' : 'Borrar la partida' }}
      </button>
    </section>
  </div>
</template>

<style scoped>
.aviso-clave {
  margin: 12px 0 16px;
  padding: 12px 14px;
  font-size: 0.88rem;
  background: rgba(198, 164, 92, 0.08);
  border: 1px solid rgba(198, 164, 92, 0.28);
  border-radius: var(--radio-menudo);
}
.aviso-clave p { margin: 0 0 8px; }
.aviso-clave ul { margin: 0 0 8px; padding-left: 20px; }
.aviso-clave li { margin-bottom: 5px; }
.aviso-clave p:last-child { margin-bottom: 0; }

.campo { display: block; margin-bottom: 12px; }
.campo > span { display: block; margin-bottom: 4px; font-size: 0.82rem; color: var(--texto-tenue); }
.campo input,
.campo select {
  width: 100%;
  padding: 9px 12px;
  font: inherit;
  font-size: 0.9rem;
  color: var(--texto);
  background: #16151f;
  border: 1px solid var(--borde-suave);
  border-radius: var(--radio-menudo);
}
.campo input:focus, .campo select:focus { outline: none; border-color: #c6a45c; }
.nota-proveedor { margin: -4px 0 12px; font-size: 0.85rem; }
.acciones { align-items: center; gap: 10px; }
.confirmacion { margin: 10px 0 0; }

h2 { font-size: 1.05rem; }
.nota { font-size: 0.87rem; }

.opciones { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
.opcion { display: flex; align-items: center; gap: 9px; cursor: pointer; }
.opcion input { width: auto; padding: 0; }

.resumen { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
.resumen li { display: flex; justify-content: space-between; font-size: 0.92rem; }

.botones { margin-bottom: 10px; }
textarea { width: 100%; font-family: var(--mono); font-size: 0.78rem; resize: vertical; }
.aviso { margin: 8px 0 0; font-size: 0.87rem; color: var(--cobre-claro); }

.peligro { position: relative; border-color: rgba(224, 122, 114, 0.3); }
.borrar { border-color: rgba(224, 122, 114, 0.5); color: var(--rojo); }
.borrar:hover { background: rgba(224, 122, 114, 0.12); }
</style>
