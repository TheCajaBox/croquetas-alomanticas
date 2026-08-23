<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { HighlightStyle, syntaxHighlighting, indentUnit, bracketMatching } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const props = defineProps({
  modelValue: { type: String, default: '' },
  soloLectura: { type: Boolean, default: false },
  /** Con qué gramática se colorea. Ver `ENTORNOS[…].lenguaje` en el protocolo. */
  lenguaje: { type: String, default: 'js' },
})
const emit = defineEmits(['update:modelValue'])

const hueco = ref(null)
let vista = null

/**
 * El lenguaje va en un compartimento porque se cambia en caliente.
 *
 * Un reto de PHP coloreado con la gramática de JavaScript se lee mal de verdad:
 * `<?php` sale como dos operadores y una variable, `$nombre` no es nada, y
 * `->` tampoco. Se notaba al abrir La Ceniza.
 *
 * La gramática de PHP se pide en diferido: quien juega en la segunda era no
 * tiene por qué descargarla, igual que no descarga el wasm.
 */
const gramatica = new Compartment()

const GRAMATICAS = {
  js: () => Promise.resolve(javascript()),
  php: async () => {
    // Por el módulo de al lado y no por el paquete: así el trozo empaquetado
    // se llama `gramatica-php` y se puede comprobar que no se descarga donde no
    // toca. Ver src/motor/gramatica-php.js.
    const { php } = await import('../motor/gramatica-php.js')
    // `plain: false` -que es el valor de serie, y se escribe para que se vea-
    // porque el código del jugador empieza por `<?php`. Con `plain: true` el
    // analizador daría por hecho que ya está dentro de PHP y la etiqueta de
    // apertura saldría marcada como sobrante.
    return php({ plain: false })
  },
  sql: async () => {
    const { sql, SQLite } = await import('../motor/gramatica-sql.js')
    // El dialecto importa: `upperCaseKeywords` deja escribir en minúsculas sin
    // que el coloreado se pierda, y SQLite es el motor que hay detrás de
    // verdad. Un `dialect` genérico marcaría por bueno lo que SQLite no acepta.
    return sql({ dialect: SQLite, upperCaseKeywords: false })
  },
}

/** Cambia la gramática de la vista ya montada, si el lenguaje tiene una. */
async function ponerGramatica(cual) {
  const cargar = GRAMATICAS[cual] ?? GRAMATICAS.js
  const extension = await cargar()
  // Entre el `await` y aquí el componente puede haberse desmontado, o el reto
  // haber cambiado a otro lenguaje.
  if (!vista) return
  vista.dispatch({ effects: gramatica.reconfigure(extension) })
}

const colores = HighlightStyle.define([
  { tag: tags.keyword, color: '#c88fd8' },
  { tag: [tags.string, tags.special(tags.string)], color: '#8fce9b' },
  { tag: tags.number, color: '#e3ab6b' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: '#6f6880', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '#e0c06b' },
  { tag: tags.propertyName, color: '#9fc7e8' },
  { tag: [tags.definition(tags.variableName), tags.definition(tags.propertyName)], color: '#ece6da' },
  { tag: tags.operator, color: '#c98b4b' },
  { tag: [tags.bool, tags.null], color: '#e07a72' },
])

const tema = EditorView.theme(
  {
    '&': { backgroundColor: '#16131f', color: '#ece6da', fontSize: '13.5px', height: '100%' },
    '.cm-content': { fontFamily: 'var(--mono)', padding: '12px 0' },
    '.cm-gutters': { backgroundColor: '#16131f', color: '#544d66', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(201, 139, 75, 0.07)' },
    '.cm-cursor': { borderLeftColor: '#e3ab6b' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: 'rgba(149, 120, 186, 0.35)',
    },
    '.cm-scroller': { overflow: 'auto' },
  },
  { dark: true },
)

onMounted(() => {
  vista = new EditorView({
    parent: hueco.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        lineNumbers(),
        history(),
        bracketMatching(),
        highlightActiveLine(),
        indentUnit.of('  '),
        // Arranca en JavaScript y se reconfigura al vuelo: montar el editor no
        // puede esperar a una descarga.
        gramatica.of(javascript()),
        syntaxHighlighting(colores),
        tema,
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        EditorView.lineWrapping,
        EditorState.readOnly.of(props.soloLectura),
        EditorView.updateListener.of((cambio) => {
          if (cambio.docChanged) emit('update:modelValue', cambio.state.doc.toString())
        }),
      ],
    }),
  })

  if (props.lenguaje !== 'js') ponerGramatica(props.lenguaje)
})

watch(() => props.lenguaje, (nuevo) => ponerGramatica(nuevo))

// Solo se reemplaza el contenido cuando el cambio viene de fuera (reiniciar el
// reto, cargar la solución); si no, cada tecla movería el cursor al final.
watch(
  () => props.modelValue,
  (nuevo) => {
    if (!vista || nuevo === vista.state.doc.toString()) return
    vista.dispatch({ changes: { from: 0, to: vista.state.doc.length, insert: nuevo } })
  },
)

onBeforeUnmount(() => vista?.destroy())
</script>

<template>
  <div ref="hueco" class="editor" />
</template>

<style scoped>
.editor {
  height: 100%;
  min-height: 260px;
  background: #16131f;
  border: 1px solid var(--borde-suave);
  border-radius: var(--radio);
  overflow: hidden;
}
</style>
