/**
 * Los ajustes de la voz prestada, guardados aparte de la partida.
 *
 * Y aparte a propósito. `exportarPartida` serializa la partida entera para que
 * te la puedas llevar al móvil: si la clave viviera ahí dentro, exportar tu
 * progreso significaría exportar también tu clave de API, y eso no se le puede
 * hacer a nadie. Con su propia entrada de localStorage, la partida se puede
 * mandar por donde sea sin llevarse nada que no debiera.
 *
 * Tampoco se sincroniza ni se sube a ningún sitio: vive en este navegador y en
 * ninguno más.
 */
const CLAVE_GUARDADO = 'gatosYCodigo:armonia:proveedor'

const VACIO = { proveedor: '', clave: '', modelo: '', url: '' }

const hayNavegador = () => typeof localStorage !== 'undefined'

export function leerAjustesDeProveedor() {
  if (!hayNavegador()) return { ...VACIO }
  try {
    const crudo = localStorage.getItem(CLAVE_GUARDADO)
    return crudo ? { ...VACIO, ...JSON.parse(crudo) } : { ...VACIO }
  } catch {
    return { ...VACIO }
  }
}

export function guardarAjustesDeProveedor(ajustes) {
  if (!hayNavegador()) return
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify({ ...VACIO, ...ajustes }))
  } catch {
    // Cuota llena o modo privado: se queda sin recordar la clave y ya está.
  }
}

export function olvidarAjustesDeProveedor() {
  if (hayNavegador()) localStorage.removeItem(CLAVE_GUARDADO)
}

/** ¿Hay voz prestada disponible? */
export const hayClave = (ajustes) => Boolean(ajustes?.proveedor && ajustes?.clave)
