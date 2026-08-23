<script setup>
import { computed, ref } from 'vue'

/**
 * Las tablas con las que habla la consulta: el esquema y las filas que hay.
 *
 * Sin esto los retos de SQL serían adivinanzas. Una consulta no se escribe
 * mirando el enunciado, se escribe mirando el esquema: qué tablas hay, cómo se
 * llaman sus columnas y de qué tipo son. En un trabajo de verdad es lo primero
 * que se abre, así que aquí también.
 *
 * El esquema se enseña **en SQL y tal cual**, no traducido a una tablita
 * bonita, y es a propósito: leer un `CREATE TABLE` es parte de lo que hay que
 * aprender, y una tabla dibujada se lo ahorraría justo el día que toca.
 *
 * Las filas van dobladas. Hacen falta -sin ver los datos no se sabe si «Kae»
 * está escrito así o en minúsculas-, pero no hacen falta **todo el rato**, y
 * seis `INSERT` abiertos empujan el editor fuera de la pantalla.
 */
const props = defineProps({
  esquema: { type: String, default: '' },
  datos: { type: String, default: '' },
})

const abierto = ref(false)

/**
 * Los nombres de las tablas, para poder decir cuántas hay antes de leer nada.
 *
 * Sale del propio esquema con una lectura mínima -`CREATE TABLE` y el nombre
 * que va detrás- y no de un campo que el reto declare aparte: un campo aparte
 * se queda desfasado el día que alguien añade una tabla y no lo actualiza.
 */
const tablas = computed(() =>
  [...props.esquema.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`[]?(\w+)/gi)].map(
    (cada) => cada[1],
  ),
)

const cuantasFilas = computed(() => (props.datos.match(/\(/g) ?? []).length)
</script>

<template>
  <section class="esquema panel">
    <header class="cabecera">
      <h3>Las tablas</h3>
      <span class="tenue cuantas">
        {{ tablas.length }} {{ tablas.length === 1 ? 'tabla' : 'tablas' }}<template v-if="tablas.length">:
        {{ tablas.join(', ') }}</template>
      </span>
    </header>

    <pre class="creacion"><code>{{ esquema }}</code></pre>

    <button v-if="datos" class="doblar" :aria-expanded="abierto" @click="abierto = !abierto">
      <span aria-hidden="true">{{ abierto ? '▾' : '▸' }}</span>
      Las filas que hay dentro<template v-if="cuantasFilas"> ({{ cuantasFilas }})</template>
    </button>
    <pre v-if="datos" v-show="abierto" class="filas"><code>{{ datos }}</code></pre>
  </section>
</template>

<style scoped>
.esquema {
  border-left: 3px solid #7fa8b8;
}

.cabecera {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.cabecera h3 { margin: 0; font-size: 0.98rem; }
.cuantas { font-size: 0.78rem; }

pre {
  margin: 0;
  background: #191f27;
  border: 1px solid #2c3742;
  font-size: 0.82rem;
  /* Un `CREATE TABLE` con seis columnas es una línea larga y no se parte: se
     desplaza dentro de su caja en vez de empujar la página entera. */
  overflow-x: auto;
}

.doblar {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 10px;
  padding: 0;
  background: none;
  border: none;
  color: var(--texto-apagado);
  font-size: 0.8rem;
}
.doblar:hover { color: var(--texto); background: none; }

.filas { margin-top: 8px; }
</style>
