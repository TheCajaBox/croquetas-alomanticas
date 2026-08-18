<script setup>
import { computed } from 'vue'

/**
 * Markdown mínimo para los enunciados: párrafos, listas, titulares, negrita,
 * código en línea y bloques de código. Nada más, que es todo lo que usan.
 *
 * Prefiero cincuenta líneas propias a una dependencia entera para esto, y
 * escapando el HTML antes de tocar nada no hace falta sanear después.
 */
const props = defineProps({ texto: { type: String, default: '' } })

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
  let bloqueDeCodigo = null

  const cerrarParrafo = () => {
    if (parrafo.length) salida.push(`<p>${enLinea(parrafo.join(' '))}</p>`)
    parrafo = []
  }
  const cerrarLista = () => {
    if (lista.length) salida.push(`<ul>${lista.map((l) => `<li>${enLinea(l)}</li>`).join('')}</ul>`)
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
      lista.push(linea.slice(2))
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

  return salida.join('\n')
})
</script>

<template>
  <div class="marcado" v-html="html" />
</template>

<style scoped>
.marcado :deep(ul) { padding-left: 20px; margin: 0 0 1em; }
.marcado :deep(li) { margin-bottom: 0.35em; }
.marcado :deep(h2) { margin-top: 1.2em; font-size: 1.15rem; }
.marcado :deep(h3) { margin-top: 1em; font-size: 1rem; }
.marcado :deep(p:last-child) { margin-bottom: 0; }
</style>
