<script setup>
import { computed } from 'vue'

import { terminosBuscablesDe, terminosBuscablesHasta } from '../contenido/glosario.js'
import { useRoute } from 'vue-router'

import { lenguajeDeLaRuta, mundoDeLaRuta } from '../contenido/dondeEstas.js'
import { enlazarTerminos } from '../motor/enlazarTerminos.js'
import { usarGlosario } from '../almacen/glosario.js'

/**
 * Markdown mínimo para los enunciados: párrafos, listas (con guiones o
 * numeradas), titulares, negrita, código en línea y bloques de código. Nada
 * más, que es todo lo que usan.
 *
 * Prefiero cincuenta líneas propias a una dependencia entera para esto, y
 * escapando el HTML antes de tocar nada no hace falta sanear después.
 */
const props = defineProps({
  texto: { type: String, default: '' },
  /** Se apaga donde enlazar sobra: en el propio glosario, por ejemplo. */
  enlazar: { type: Boolean, default: true },
})

const glosario = usarGlosario()
const ruta = useRoute()
/**
 * Qué términos se pueden pulsar aquí.
 *
 * Dentro de un mundo, solo los que ese mundo y los anteriores han enseñado: que
 * un enunciado use la palabra «herencia» no significa que en el tercer reto de
 * La Ceniza se pueda pulsar y leer qué es. Fuera de un mundo -la antesala, los
 * ajustes- manda el lenguaje y ya.
 */
const mundo = computed(() => mundoDeLaRuta(ruta.params))
const buscables = computed(() =>
  mundo.value ? terminosBuscablesHasta(mundo.value.id) : terminosBuscablesDe(lenguajeDeLaRuta(ruta.params)),
)

/**
 * Los términos se pulsan por delegación en la raíz y no con un @click por
 * botón: los botones los inserta el enlazador dentro del HTML, así que Vue no
 * los conoce y no puede ponerles escuchas.
 */
function alPulsar(evento) {
  const boton = evento.target.closest?.('.termino')
  if (!boton) return
  evento.preventDefault()
  glosario.abrir(boton.dataset.termino)
}

const escapar = (texto) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const enLinea = (texto) =>
  escapar(texto)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

const html = computed(() => {
  const lineas = props.texto.split('\n')
  const salida = []
  let parrafo = []
  let lista = []
  let tipoDeLista = 'ul'
  let bloqueDeCodigo = null

  const cerrarParrafo = () => {
    if (parrafo.length) salida.push(`<p>${enLinea(parrafo.join(' '))}</p>`)
    parrafo = []
  }
  const cerrarLista = () => {
    if (lista.length) {
      const puntos = lista.map((l) => `<li>${enLinea(l)}</li>`).join('')
      salida.push(`<${tipoDeLista}>${puntos}</${tipoDeLista}>`)
    }
    lista = []
  }

  for (const linea of lineas) {
    if (linea.trim().startsWith('```')) {
      if (bloqueDeCodigo === null) {
        cerrarParrafo()
        cerrarLista()
        bloqueDeCodigo = []
      } else {
        salida.push(`<pre><code>${escapar(bloqueDeCodigo.join('\n'))}</code></pre>`)
        bloqueDeCodigo = null
      }
      continue
    }
    if (bloqueDeCodigo !== null) {
      bloqueDeCodigo.push(linea)
      continue
    }

    if (linea.trim() === '') {
      cerrarParrafo()
      cerrarLista()
      continue
    }
    if (linea.startsWith('- ')) {
      cerrarParrafo()
      if (tipoDeLista !== 'ul') cerrarLista()
      tipoDeLista = 'ul'
      lista.push(linea.slice(2))
      continue
    }
    const numerada = linea.match(/^(\d+)\.\s+(.*)$/)
    if (numerada) {
      cerrarParrafo()
      if (tipoDeLista !== 'ol') cerrarLista()
      tipoDeLista = 'ol'
      lista.push(numerada[2])
      continue
    }
    const titular = linea.match(/^(#{1,3})\s+(.*)$/)
    if (titular) {
      cerrarParrafo()
      cerrarLista()
      salida.push(`<h${titular[1].length + 1}>${enLinea(titular[2])}</h${titular[1].length + 1}>`)
      continue
    }
    // Línea de continuación de un punto de la lista: va con él, no aparte.
    if (lista.length && /^\s+\S/.test(linea)) {
      lista[lista.length - 1] += ` ${linea.trim()}`
      continue
    }
    cerrarLista()
    parrafo.push(linea)
  }

  cerrarParrafo()
  cerrarLista()
  if (bloqueDeCodigo !== null) salida.push(`<pre><code>${escapar(bloqueDeCodigo.join('\n'))}</code></pre>`)

  const montado = salida.join('\n')
  // Los términos que se marcan son los que ya se han enseñado donde estás: enlazar
  // «ref» o «computed» en un enunciado de PHP llevaría a una explicación de Vue.
  return props.enlazar ? enlazarTerminos(montado, buscables.value) : montado
})
</script>

<template>
  <div class="marcado" v-html="html" @click="alPulsar" />
</template>

<style scoped>
.marcado :deep(ul) { padding-left: 20px; margin: 0 0 1em; }
.marcado :deep(li) { margin-bottom: 0.35em; }
.marcado :deep(h2) { margin-top: 1.2em; font-size: 1.15rem; }
.marcado :deep(h3) { margin-top: 1em; font-size: 1rem; }
.marcado :deep(p:last-child) { margin-bottom: 0; }

/* Un término del glosario. Se marca con un subrayado de puntos y no con color:
   dentro de un párrafo, media docena de palabras en otro color se lee fatal. */
.marcado :deep(.termino) {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  border-radius: 3px;
  border-bottom: 1px dotted var(--texto-apagado);
  cursor: help;
  transition: color 0.15s, border-color 0.15s;
}
.marcado :deep(.termino:hover) {
  color: var(--cobre-claro);
  border-bottom-color: var(--cobre-claro);
}
</style>
