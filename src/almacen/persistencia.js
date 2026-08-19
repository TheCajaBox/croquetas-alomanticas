/**
 * La partida guardada.
 *
 * Todo vive bajo una sola clave de localStorage y con número de versión, para
 * que el día que cambie el formato haya un único sitio donde arreglarlo en vez
 * de diez almacenes adivinando.
 */
export const CLAVE = 'gatosYCodigo'
export const VERSION = 1

const hayNavegador = () => typeof localStorage !== 'undefined'

/**
 * Punto único de migraciones. Hoy solo sabe reconocer lo que no entiende y
 * empezar de cero, que es mejor que arrancar con datos a medias.
 */
export function migrar(datos) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return { version: VERSION }
  }
  if (datos.version === VERSION) return datos
  if (typeof datos.version !== 'number') return { version: VERSION }
  // De momento no hay saltos de versión que traducir: se conserva lo que haya
  // y se sella con la versión actual.
  return { ...datos, version: VERSION }
}

function leerDelDisco() {
  if (!hayNavegador()) return { version: VERSION }
  try {
    const crudo = localStorage.getItem(CLAVE)
    return migrar(crudo ? JSON.parse(crudo) : null)
  } catch (error) {
    console.warn('La partida guardada no se puede leer; se empieza de cero.', error)
    return { version: VERSION }
  }
}

let partida = leerDelDisco()
let volcadoPendiente = null

function volcar() {
  volcadoPendiente = null
  if (!hayNavegador()) return
  try {
    localStorage.setItem(CLAVE, JSON.stringify(partida))
  } catch (error) {
    // Cuota llena o modo privado: el juego sigue, pero sin memoria.
    console.warn('No he podido guardar la partida.', error)
  }
}

export const trozoGuardado = (clave) => partida[clave] ?? null

/** Guarda con un respiro: escribir en cada tecla del editor no tiene sentido. */
export function programarGuardado(clave, estado) {
  partida[clave] = JSON.parse(JSON.stringify(estado))
  if (volcadoPendiente) clearTimeout(volcadoPendiente)
  volcadoPendiente = setTimeout(volcar, 300)
}

/** Escribe ya lo que hubiera pendiente, sin esperar al respiro. */
export function volcarAhora() {
  if (volcadoPendiente) {
    clearTimeout(volcadoPendiente)
    volcar()
  }
}

// Guardar con respiro está bien mientras la pestaña siga abierta, pero si el
// jugador cierra o recarga justo después de ganar unas croquetas, ese respiro
// se las lleva por delante. Al esconderse la página se vuelca lo que quede.
if (hayNavegador() && typeof window !== 'undefined') {
  window.addEventListener('pagehide', volcarAhora)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') volcarAhora()
  })
}

export function exportarPartida() {
  volcarAhora()
  return JSON.stringify({ ...partida, exportadaEn: new Date().toISOString() }, null, 2)
}

/**
 * Mete una partida traída de otro navegador. Recarga después, porque los
 * almacenes ya montados no se enteran solos.
 * @returns {boolean} si el texto era una partida reconocible
 */
export function importarPartida(texto) {
  try {
    const datos = migrar(JSON.parse(texto))
    if (!datos || Object.keys(datos).length <= 1) return false
    partida = datos
    volcar()
    return true
  } catch {
    return false
  }
}

export function borrarPartida() {
  partida = { version: VERSION }
  if (hayNavegador()) localStorage.removeItem(CLAVE)
}

/**
 * Engancha un almacén a la partida: lo rellena con lo guardado y se apunta
 * para guardar cada cambio.
 *
 * `omitir` deja fuera campos que no son partida: estado de trabajo que se
 * recalcula al vuelo y que solo ocuparía sitio y se quedaría rancio. El
 * contexto de Armonía es el caso: guarda una foto de tu código y del último
 * resultado, y las dos cosas ya viven en su sitio.
 */
export function autoguardar(almacen, clave, { omitir = [] } = {}) {
  const guardado = trozoGuardado(clave)
  if (guardado) {
    const limpio = { ...guardado }
    for (const campo of omitir) delete limpio[campo]
    almacen.$patch(limpio)
  }

  almacen.$subscribe(
    (_mutacion, estado) => {
      if (omitir.length === 0) return programarGuardado(clave, estado)
      const recortado = { ...estado }
      for (const campo of omitir) delete recortado[campo]
      return programarGuardado(clave, recortado)
    },
    { detached: true },
  )
}
