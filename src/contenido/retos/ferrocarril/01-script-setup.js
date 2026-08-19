import { codigo, pista } from '../comun.js'

export default {
  id: "ferro-01-script-setup",
  mundo: "ferrocarril",
  entorno: "vue3",
  tipo: "eleccion",
  titulo: "El azúcar que se usa de verdad",
  enunciado: codigo(
    "Los retos de La Nueva Seran usan `setup()` como función, porque es la forma que se",
    "puede ejecutar aquí dentro. En un proyecto real casi nadie la escribe así: se escribe",
    "`<script setup>`, que hace lo mismo con la mitad de las letras.",
    "",
    "Conviene ver las dos, porque toda la documentación usa la corta y todo el código",
    "antiguo usa la larga.",
  ),
  pregunta: codigo(
    "Este componente, con `setup()` de toda la vida:",
    "",
    "```js",
    "export default {",
    "  props: ['dueno'],",
    "  emits: ['recargar'],",
    "  setup(props, { emit }) {",
    "    const balas = ref(6)",
    "    const resumen = computed(() => `${props.dueno}: ${balas.value}`)",
    "    function vaciar() {",
    "      balas.value = 0",
    "      emit('recargar')",
    "    }",
    "    return { balas, resumen, vaciar }",
    "  },",
    "}",
    "```",
    "",
    "¿Cuál es su equivalente exacto con `<script setup>`?",
  ),
  opciones: [
    {
      texto: codigo(
        "```js",
        "const props = defineProps(['dueno'])",
        "const emit = defineEmits(['recargar'])",
        "",
        "const balas = ref(6)",
        "const resumen = computed(() => `${props.dueno}: ${balas.value}`)",
        "function vaciar() {",
        "  balas.value = 0",
        "  emit('recargar')",
        "}",
        "```",
      ),
      correcta: true,
      porque:
        "Eso es. `defineProps` y `defineEmits` sustituyen a las opciones y al segundo argumento de `setup`, y **el `return` desaparece**: todo lo que declares arriba queda visible para la plantilla. Es literalmente el mismo componente; el compilador lo convierte en el de arriba.",
    },
    {
      texto: codigo(
        "```js",
        "const props = defineProps(['dueno'])",
        "const emit = defineEmits(['recargar'])",
        "",
        "const balas = ref(6)",
        "const resumen = computed(() => `${props.dueno}: ${balas.value}`)",
        "function vaciar() { balas.value = 0; emit('recargar') }",
        "",
        "return { balas, resumen, vaciar }",
        "```",
      ),
      porque:
        "Casi, y sobra la última línea. En `<script setup>` no hay ninguna función de la que devolver nada: el `return` sería un error de sintaxis. Todo lo declarado ya está a la vista de la plantilla, y eso es justo lo que ahorra.",
    },
    {
      texto: codigo(
        "```js",
        "props: ['dueno']",
        "emits: ['recargar']",
        "",
        "const balas = ref(6)",
        "```",
      ),
      porque:
        "Eso no es JavaScript válido: `props:` suelto en un archivo no significa nada. Las opciones del componente se declaran con las funciones `defineProps` y `defineEmits`, no dejando la sintaxis de objeto por ahí.",
    },
    {
      texto: codigo(
        "```js",
        "import { defineProps, defineEmits } from 'vue'",
        "const props = defineProps(['dueno'])",
        "const emit = defineEmits(['recargar'])",
        "```",
      ),
      porque:
        "El import sobra, y de hecho da un aviso. `defineProps` y `defineEmits` no son funciones de verdad que se importen: son instrucciones para el compilador, que las reconoce por el nombre y las sustituye. Por eso solo funcionan dentro de `<script setup>` y en el nivel de arriba.",
    },
  ],
  pistas: [
    pista("Dos de las cuatro se parecen mucho y solo se diferencian en una línea del final. Piensa si en `<script setup>` hay alguna función de la que devolver algo.", 0),
    pista("`<script setup>` no es una opción más del componente: **es el cuerpo de `setup()`**. Lo que escribes ahí ya está dentro de la función.", 1),
    pista("Descarta primero la que no es JavaScript válido y la que importa dos cosas que no se importan. De las dos que quedan, sobra un `return`.", 2),
  ],
  recompensa: { croquetas: 12 },
}
