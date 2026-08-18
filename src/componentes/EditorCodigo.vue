<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { HighlightStyle, syntaxHighlighting, indentUnit, bracketMatching } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const props = defineProps({
  modelValue: { type: String, default: '' },
  soloLectura: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const hueco = ref(null)
let vista = null

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
        javascript(),
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
})

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
