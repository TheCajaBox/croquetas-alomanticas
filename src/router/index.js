import { createRouter, createWebHashHistory } from 'vue-router'

import VistaEntrada from '../vistas/VistaEntrada.vue'
import { usarRumbo } from '../almacen/rumbo.js'

/**
 * Historial de hash y no de rutas limpias: el juego se publica en GitHub
 * Pages, que es un servidor de ficheros estáticos y devolvería un 404 al
 * recargar dentro de un reto.
 */
export function crearEnrutador() {
  const enrutador = createRouter({
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
      // Los tres sitios de Elendel. `sitio` dice de cuál se trata y el guardián
      // de abajo comprueba que el camino donde estás lo tenga.
      {
        path: '/colonia',
        name: 'colonia',
        component: () => import('../vistas/VistaColonia.vue'),
        meta: { sitio: 'colonia' },
      },
      {
        path: '/refugio',
        name: 'refugio',
        component: () => import('../vistas/VistaRefugio.vue'),
        meta: { sitio: 'refugio' },
      },
      { path: '/trastos', name: 'trastos', component: () => import('../vistas/VistaTrastos.vue') },
      {
        path: '/repaso/:mundoId',
        name: 'repaso',
        component: () => import('../vistas/VistaRepaso.vue'),
        props: true,
      },
      { path: '/antesala', name: 'antesala', component: () => import('../vistas/VistaAntesala.vue') },
      { path: '/glosario', name: 'glosario', component: () => import('../vistas/VistaGlosario.vue') },
      {
        path: '/sombrerera',
        name: 'sombrerera',
        component: () => import('../vistas/VistaSombrerera.vue'),
        meta: { sitio: 'sombrerera' },
      },
      { path: '/ajustes', name: 'ajustes', component: () => import('../vistas/VistaAjustes.vue') },
      { path: '/:resto(.*)', redirect: '/' },
    ],
    scrollBehavior: () => ({ top: 0 }),
  })

  /**
   * A un sitio que no existe en tu camino no se entra, ni por la barra ni
   * escribiendo la dirección.
   *
   * La barra ya no ofrece la puerta, pero una dirección guardada en favoritos o
   * un enlace de hace tres meses sí que llevaban a la casa de los gatos desde
   * la primera era. Sale a la portada de donde estabas, que es lo mismo que
   * hace el candado de las lecciones cerradas.
   */
  enrutador.beforeEach((hacia) => {
    const sitio = hacia.meta?.sitio
    if (!sitio) return true
    const rumbo = usarRumbo()
    if (rumbo.hay(sitio)) return true
    return { name: 'itinerario', params: { itinerarioId: rumbo.dondeEstoy } }
  })

  return enrutador
}
