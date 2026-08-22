import { createRouter, createWebHashHistory } from 'vue-router'

import VistaEntrada from '../vistas/VistaEntrada.vue'

/**
 * Historial de hash y no de rutas limpias: el juego se publica en GitHub
 * Pages, que es un servidor de ficheros estáticos y devolvería un 404 al
 * recargar dentro de un reto.
 */
export function crearEnrutador() {
  return createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      // La puerta es elegir lenguaje; la lista de mundos es lo de dentro de
      // cada itinerario. Antes «/» era la lista, y con dos caminos eso dejaba
      // uno de los dos sin sitio donde vivir.
      { path: '/', name: 'entrada', component: VistaEntrada },
      {
        path: '/itinerario/:itinerarioId',
        name: 'itinerario',
        component: () => import('../vistas/VistaInicio.vue'),
        props: true,
      },
      {
        path: '/mundo/:mundoId',
        name: 'mundo',
        component: () => import('../vistas/VistaMundo.vue'),
        props: true,
      },
      {
        path: '/reto/:retoId',
        name: 'reto',
        component: () => import('../vistas/VistaReto.vue'),
        props: true,
      },
      { path: '/colonia', name: 'colonia', component: () => import('../vistas/VistaColonia.vue') },
      { path: '/refugio', name: 'refugio', component: () => import('../vistas/VistaRefugio.vue') },
      { path: '/trastos', name: 'trastos', component: () => import('../vistas/VistaTrastos.vue') },
      {
        path: '/repaso/:mundoId',
        name: 'repaso',
        component: () => import('../vistas/VistaRepaso.vue'),
        props: true,
      },
      { path: '/antesala', name: 'antesala', component: () => import('../vistas/VistaAntesala.vue') },
      { path: '/glosario', name: 'glosario', component: () => import('../vistas/VistaGlosario.vue') },
      { path: '/sombrerera', name: 'sombrerera', component: () => import('../vistas/VistaSombrerera.vue') },
      { path: '/ajustes', name: 'ajustes', component: () => import('../vistas/VistaAjustes.vue') },
      { path: '/:resto(.*)', redirect: '/' },
    ],
    scrollBehavior: () => ({ top: 0 }),
  })
}
