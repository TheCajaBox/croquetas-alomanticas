import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { crearEnrutador } from './router/index.js'
import { engancharArmonia, usarArmonia } from './almacen/armonia.js'
import { engancharEconomia, usarEconomia } from './almacen/economia.js'
import { engancharGatos, usarGatos } from './almacen/gatos.js'
import { engancharGlosario, usarGlosario } from './almacen/glosario.js'
import { engancharInsignias, usarInsignias } from './almacen/insignias.js'
import { engancharNarrador, usarNarrador } from './almacen/narrador.js'
import { engancharProgreso, usarProgreso } from './almacen/progreso.js'
import { engancharRecortes, usarRecortes } from './almacen/recortes.js'
import { engancharRepasos, usarRepasos } from './almacen/repasos.js'
import { engancharSombreros, usarSombreros } from './almacen/sombreros.js'
import { usarJuego } from './almacen/juego.js'
import './estilos/base.css'
import './estilos/animaciones.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(crearEnrutador())

// Primero se rellenan los almacenes con la partida guardada y solo después se
// arranca la sesión: si se hiciera al revés, el desgaste de los gatos se
// calcularía sobre una colonia vacía y se perdería.
engancharProgreso(usarProgreso(pinia))
engancharEconomia(usarEconomia(pinia))
engancharGatos(usarGatos(pinia))
engancharNarrador(usarNarrador(pinia))
engancharSombreros(usarSombreros(pinia))
engancharRecortes(usarRecortes(pinia))
engancharGlosario(usarGlosario(pinia))
engancharRepasos(usarRepasos(pinia))
engancharInsignias(usarInsignias(pinia))
engancharArmonia(usarArmonia(pinia))

usarJuego(pinia).arrancarSesion()

app.mount('#app')
