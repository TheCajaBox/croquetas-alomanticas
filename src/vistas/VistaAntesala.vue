<script setup>
import Avatar from '../componentes/Avatar.vue'
import Marcado from '../componentes/Marcado.vue'
import SombreroEscondido from '../componentes/SombreroEscondido.vue'
import { ANTESALA } from '../contenido/antesala.js'
import { usarProgreso } from '../almacen/progreso.js'

const progreso = usarProgreso()
// Con haberla abierto basta: a partir de aquí la portada deja de insistir.
progreso.vistoLaAntesala = true
</script>

<template>
  <div class="pila antesala">
    <section class="panel encabezado">
      <SombreroEscondido id="antesala" :posicion="{ top: '16px', right: '18px' }" />

      <div class="cabecera">
        <Avatar quien="steris" :tamano="72" />
        <div>
          <p class="quien">Steris Harms</p>
          <h1>Antes de empezar</h1>
          <Marcado class="entradilla tenue" :texto="ANTESALA.entradilla" />
        </div>
      </div>
    </section>

    <ol class="secciones">
      <li v-for="(seccion, orden) in ANTESALA.secciones" :key="seccion.titulo" class="seccion panel">
        <h2><span class="numero">{{ orden + 1 }}</span>{{ seccion.titulo }}</h2>
        <Marcado :texto="seccion.texto" />
      </li>
    </ol>

    <section class="panel cierre">
      <Marcado :texto="ANTESALA.cierre" />
      <RouterLink :to="{ name: 'mundo', params: { mundoId: 'primer-dia' } }" class="empezar">
        Empezar por el primer día →
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.encabezado { position: relative; }
.cabecera { display: flex; align-items: flex-start; gap: 18px; }
.quien {
  margin: 0 0 2px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #9aa8d8;
}
.cabecera h1 { margin: 0 0 8px; }
.entradilla { max-width: 68ch; }

.secciones { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.seccion { border-left: 3px solid #9aa8d8; }
.seccion h2 { display: flex; align-items: center; gap: 12px; font-size: 1.1rem; margin-bottom: 12px; }
.numero {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(154, 168, 216, 0.16);
  border: 1px solid rgba(154, 168, 216, 0.4);
  color: #9aa8d8;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}
/* Ancho de lectura para el texto; el código, entero. */
.seccion :deep(p), .seccion :deep(ul), .seccion :deep(ol) { max-width: 78ch; }

.cierre { display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
.cierre :deep(p) { margin: 0; max-width: 62ch; font-style: italic; color: var(--texto-tenue); }
.empezar {
  text-decoration: none;
  padding: 11px 18px;
  border-radius: var(--radio);
  background: rgba(95, 185, 138, 0.12);
  border: 1px solid rgba(95, 185, 138, 0.35);
  color: var(--verde);
  font-weight: 600;
  white-space: nowrap;
}
.empezar:hover { background: rgba(95, 185, 138, 0.2); }
</style>
