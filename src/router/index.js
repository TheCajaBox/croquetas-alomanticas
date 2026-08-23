import { createRouter, createWebHashHistory } from 'vue-router'

import VistaEntrada from '../vistas/VistaEntrada.vue'
import { itinerarioDeLaRuta, mundoDeLaRuta } from '../contenido/dondeEstas.js'
import { RETOS_POR_ID } from '../contenido/retos/index.js'
import { usarRumbo } from '../almacen/rumbo.js'

/** Lo que hay que ver en la pestaña, de lo más concreto a lo más general. */
const EL_JUEGO = 'Gatos y Código'

/**
 * El título de la pestaña dice dónde estás.
 *
 * Estaba clavado en el `index.html`, así que quien deja tres pestañas abiertas
 * -y aquí eso pasa: el reto en una, el glosario en otra, los apuntes en la
 * tercera- veía «Gatos y Código» tres veces y tenía que abrirlas para saber
 * cuál era cuál. También es lo que se guarda en un marcador y lo que se lee en
 * el historial, así que es la única parte del «dónde estoy» que sobrevive a
 * cerrar el navegador.
 *
 * El orden va de dentro hacia fuera, que es como lo lee una pestaña estrecha:
 * cuando el navegador recorta, lo que se ve es el reto y su mundo, no el nombre
 * del juego.
 */
export function tituloDe(ruta) {
  const mundo = mundoDeLaRuta(ruta.params)
  const reto = ruta.params.retoId ? RETOS_POR_ID[ruta.params.retoId] : null

  if (reto && mundo) return `${reto.titulo} · ${mundo.nombre} — ${EL_JUEGO}`
  if (ruta.name === 'repaso' && mundo) return `Repaso de ${mundo.nombre} — ${EL_JUEGO}`
  if (mundo) return `${mundo.nombre} · ${itinerarioDeLaRuta(ruta.params).nombre} — ${EL_JUEGO}`
  if (ruta.params.itinerarioId) return `${itinerarioDeLaRuta(ruta.params).nombre} — ${EL_JUEGO}`

  const suelto = {
    glosario: 'Glosario',
    colonia: 'La colonia',
    refugio: 'El refugio',
    sombrerera: 'La sombrerera',
    trastos: 'El cajón',
    ajustes: 'Ajustes',
    antesala: 'La antesala',
  }[ruta.name]
  return suelto ? `${suelto} — ${EL_JUEGO}` : EL_JUEGO
}

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

  // Después y no antes: si la navegación se cancela -el guardián de arriba
  // desvía a la portada del camino-, el título tiene que ser el del sitio donde
  // acabas, no el del que pediste.
  enrutador.afterEach((hacia) => {
    document.title = tituloDe(hacia)
  })

  return enrutador
}
