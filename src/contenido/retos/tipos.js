/**
 * Los tipos de reto, en un solo sitio.
 *
 * Antes esto vivía repartido en cuatro listas escritas a mano que había que
 * acordarse de tocar a la vez: los que se escriben y los que se señalan (en
 * `VistaReto`), los que enseñan la vista previa del sandbox (una condición que
 * nombraba dos tipos a pelo) y las etiquetas de `VistaMundo`. Con ocho tipos ya
 * escocía; con doce era insostenible.
 *
 * Y había algo peor que la repetición: la plantilla de `VistaReto` termina en un
 * `v-else` que pinta el editor de código. Un tipo mal cableado no fallaba, salía
 * **como si fuera de escribir**, que es la peor forma de enterarse. Ahora el
 * tipo que no esté aquí revienta al abrirse, y hay un test que comprueba que
 * todos los tipos usados están declarados.
 *
 * ## Qué significa cada campo
 *
 * - `etiqueta`: cómo se llama en la lista del mundo. En infinitivo, porque lo
 *   que se lee ahí es «qué me toca hacer».
 * - `seEscribe`: trae editor de código. Enciende el oído fino de Estaño (los
 *   requisitos comprobados mientras escribes) y la revisión de Marasi al
 *   superarlo, que necesita el código para poder leerlo.
 * - `tactil`: se resuelve señalando y colocando, y trae su propio botón de
 *   enviar. Los que no son ni una cosa ni la otra -la predicción- usan el botón
 *   general.
 * - `vistaPrevia`: si en un mundo de Vue se enseña el componente pintado. Los de
 *   señalar no ejecutan nada del jugador, así que ahí no hay nada que enseñar.
 * - `referencia`: de qué campo sale el código con el que **debería** resolverse,
 *   para que las pruebas puedan ejecutarlo y comprobar que el reto es
 *   resoluble. `null` significa que no hay código que ejecutar: la respuesta es
 *   una elección, no un programa.
 */
export const TIPOS_DE_RETO = {
  codigo: {
    etiqueta: 'escribir',
    seEscribe: true,
    vistaPrevia: true,
    referencia: (reto) => reto.solucion,
  },
  bug: {
    etiqueta: 'cazar el fallo',
    seEscribe: true,
    vistaPrevia: true,
    referencia: (reto) => reto.solucion,
  },
  refactor: {
    etiqueta: 'reescribir',
    seEscribe: true,
    vistaPrevia: true,
    referencia: (reto) => reto.solucion,
  },
  prediccion: {
    etiqueta: 'acertijo',
    vistaPrevia: true,
    // No hay solución que escribir: lo que se ejecuta es el código que se lee.
    referencia: (reto) => reto.codigoMostrado,
  },
  eleccion: {
    etiqueta: 'elegir',
    tactil: true,
    referencia: null,
  },
  emparejar: {
    etiqueta: 'emparejar',
    tactil: true,
    referencia: null,
  },
  ordenar: {
    etiqueta: 'ordenar',
    tactil: true,
    vistaPrevia: true,
    // Las líneas en su orden bueno **son** la solución; no hay campo aparte.
    referencia: (reto) => reto.lineas.join('\n'),
  },
  completar: {
    etiqueta: 'rellenar',
    tactil: true,
    vistaPrevia: true,
    referencia: (reto) => reto.solucion,
  },

  // ---- Los cuatro que se señalan sobre código que no se toca ----------------

  trazar: {
    etiqueta: 'seguir el hilo',
    tactil: true,
    // Se corrige comparando la tabla, sin ejecutar nada del jugador; pero el
    // código que se lee sí se ejecuta en las pruebas, para que nadie publique
    // una traza que no es la que de verdad pasa.
    referencia: (reto) => reto.codigoMostrado,
  },
  'cazar-linea': {
    etiqueta: 'cazar la línea',
    tactil: true,
    // El código que se enseña está roto a propósito: ejecutarlo es justamente
    // lo que no se puede hacer.
    referencia: null,
  },
  etiquetar: {
    etiqueta: 'poner nombre',
    tactil: true,
    referencia: null,
  },
  'verdadero-o-falso': {
    etiqueta: 'verdadero o falso',
    tactil: true,
    referencia: null,
  },
}

/** Los nombres de los tipos, para recorrerlos y para los mensajes de error. */
export const NOMBRES_DE_TIPO = Object.keys(TIPOS_DE_RETO)

/**
 * Los datos del tipo, o un error que se entiende.
 *
 * Se prefiere reventar a seguir: un tipo desconocido antes se colaba y salía
 * pintado como un reto de escribir, y eso no se nota hasta que alguien juega.
 */
export function datosDelTipo(tipo) {
  const datos = TIPOS_DE_RETO[tipo]
  if (!datos) {
    throw new Error(
      `Tipo de reto desconocido: "${tipo}". Los que hay son: ${NOMBRES_DE_TIPO.join(', ')}.`,
    )
  }
  return datos
}

/** Trae editor de código: requisitos en vivo y revisión de Marasi. */
export const seEscribe = (tipo) => Boolean(TIPOS_DE_RETO[tipo]?.seEscribe)

/** Se resuelve señalando, y trae su propio botón. */
export const esTactil = (tipo) => Boolean(TIPOS_DE_RETO[tipo]?.tactil)

/** En un mundo de Vue, si se enseña el componente pintado. */
export const tieneVistaPrevia = (tipo) => Boolean(TIPOS_DE_RETO[tipo]?.vistaPrevia)

/** Cómo se llama en la lista del mundo. */
export const etiquetaDelTipo = (tipo) => TIPOS_DE_RETO[tipo]?.etiqueta ?? tipo

/** Si su respuesta es una elección y no un programa. */
export const sinCodigo = (tipo) => TIPOS_DE_RETO[tipo]?.referencia === null

/** El código con el que debería resolverse, o null si no hay ninguno. */
export function codigoDeReferencia(reto) {
  const { referencia } = datosDelTipo(reto.tipo)
  return referencia ? referencia(reto) : null
}
