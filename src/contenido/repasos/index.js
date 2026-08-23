/**
 * Los repasos: la ficha en el arranque, las preguntas al abrirlo.
 *
 * Un repaso son seis o nueve preguntas con tres opciones cada una y una
 * explicación por opción -también por las falsas, que es donde está la mitad de
 * lo que se aprende-. Salen unos 5 kB por repaso, 60 entre los doce.
 *
 * Iban todos juntos y ansiosos, y como los importan tres pantallas distintas
 * -la lista de un mundo, la celebración de cerrarlo y el propio repaso- Rollup
 * los subía al **paquete principal**: los descargaba también quien entraba a
 * mirar la portada. Medido: 60 kB, y con los catorce mundos que faltan serían
 * casi 200.
 *
 * Así que se parten como los retos: **ficha y cuerpo**.
 *
 * - La **ficha** -id, mundo, quién pregunta, título y cuántas preguntas- es lo
 *   que necesitan la tarjeta del mundo y la tarjeta de cierre para ofrecer el
 *   repaso sin abrirlo. Va aquí, escrita a mano, y una prueba comprueba que no
 *   miente: si el fichero del repaso tiene otro título u otras preguntas, falla.
 * - El **cuerpo** son las preguntas, en `repasos/<mundo>.js`, y se piden con
 *   `cargarRepaso` al entrar.
 *
 * Los `import()` de los cuerpos viven **solo en este fichero**: si otro módulo
 * importara un repaso de forma estática, su trozo volvería al paquete principal
 * sin que nada fallara ni avisara. Hay una prueba que lo vigila.
 */
const cuerpos = import.meta.glob('./*.js')

/** Las fichas, en el orden en que se juegan sus mundos. */
export const REPASOS = [
  { id: 'repaso-primer-dia', mundo: 'primer-dia', titulo: 'El caso de los primeros pasos', cuantasPreguntas: 6 },
  { id: 'repaso-es6', mundo: 'es6', titulo: 'El caso de los Áridos', cuantasPreguntas: 6 },
  { id: 'repaso-vue2', mundo: 'vue2', titulo: 'El caso de la mansión', cuantasPreguntas: 6 },
  { id: 'repaso-vue3', mundo: 'vue3', titulo: 'El caso de la ciudad nueva', cuantasPreguntas: 6 },
  { id: 'repaso-melaan', mundo: 'melaan', titulo: 'El caso del cambio de forma', cuantasPreguntas: 6 },
  { id: 'repaso-comisaria', mundo: 'comisaria', titulo: 'El caso de los cimientos', cuantasPreguntas: 6 },
  { id: 'repaso-taller', mundo: 'taller', titulo: 'El caso del oficio', cuantasPreguntas: 6 },
  { id: 'repaso-elendel', mundo: 'elendel', titulo: 'El caso de la ciudad', cuantasPreguntas: 6 },
  { id: 'repaso-ferrocarril', mundo: 'ferrocarril', titulo: 'El caso de la línea', cuantasPreguntas: 6 },
  { id: 'repaso-ceniza', mundo: 'ceniza', quien: 'brisa', titulo: 'El caso de la ceniza', cuantasPreguntas: 9 },
  { id: 'repaso-tripulacion', mundo: 'tripulacion', quien: 'brisa', titulo: 'El caso de la tripulación', cuantasPreguntas: 9 },
  { id: 'repaso-pozo', mundo: 'pozo', quien: 'brisa', titulo: 'El caso del Pozo', cuantasPreguntas: 9 },
  { id: 'repaso-fundacion', mundo: 'fundacion', quien: 'brisa', titulo: 'El caso de la Fundación', cuantasPreguntas: 9 },
  { id: 'repaso-kandra', mundo: 'kandra', quien: 'brisa', titulo: 'El caso del kandra', cuantasPreguntas: 9 },
  { id: 'repaso-ruina', mundo: 'ruina', quien: 'brisa', titulo: 'El caso del final', cuantasPreguntas: 9 },
  // Elantris: aquí revisa Sarene, que es quien mira lo que escribes en ese camino.
  { id: 'repaso-kae', mundo: 'kae', quien: 'sarene', titulo: 'El caso de Kae', cuantasPreguntas: 9 },
  { id: 'repaso-muros', mundo: 'muros', quien: 'sarene', titulo: 'El caso de los muros', cuantasPreguntas: 9 },
  { id: 'repaso-mercado', mundo: 'mercado', quien: 'sarene', titulo: 'El caso del mercado', cuantasPreguntas: 9 },
  { id: 'repaso-dor', mundo: 'dor', quien: 'sarene', titulo: 'El caso del Dor', cuantasPreguntas: 9 },
  { id: 'repaso-trazos', mundo: 'trazos', quien: 'sarene', titulo: 'El caso de los trazos', cuantasPreguntas: 9 },
  { id: 'repaso-linea', mundo: 'linea', quien: 'sarene', titulo: 'El caso de la línea que falta', cuantasPreguntas: 9 },
  { id: 'repaso-sello', mundo: 'sello', quien: 'gaotona', titulo: 'El caso del sello', cuantasPreguntas: 9 },
  { id: 'repaso-inspeccion', mundo: 'inspeccion', quien: 'gaotona', titulo: 'El caso de la inspección', cuantasPreguntas: 9 },
  { id: 'repaso-grieta', mundo: 'grieta', quien: 'gaotona', titulo: 'El caso de la grieta', cuantasPreguntas: 9 },
  { id: 'repaso-cien-dias', mundo: 'cien-dias', quien: 'gaotona', titulo: 'El caso de los cien días', cuantasPreguntas: 9 },
  { id: 'repaso-original', mundo: 'original', quien: 'gaotona', titulo: 'El caso del original', cuantasPreguntas: 9 },
  { id: 'repaso-alma', mundo: 'alma', quien: 'gaotona', titulo: 'El caso del alma del emperador', cuantasPreguntas: 9 },
]

export const REPASOS_POR_MUNDO = Object.fromEntries(REPASOS.map((cada) => [cada.mundo, cada]))

/**
 * El repaso entero de un mundo, con sus preguntas.
 *
 * @returns {Promise<object|null>} el repaso, o null si ese mundo no tiene.
 */
export async function cargarRepaso(mundoId) {
  const cargador = cuerpos[`./${mundoId}.js`]
  if (!cargador) return null
  return (await cargador()).default
}

let todos = null

/**
 * Todos los repasos enteros, para lo que necesite mirarlos juntos: el corpus de
 * Armonía y las pruebas del contenido. Se piden una sola vez y se guardan.
 */
export async function cargarTodosLosRepasos() {
  if (todos) return todos
  todos = (await Promise.all(REPASOS.map((ficha) => cargarRepaso(ficha.mundo)))).filter(Boolean)
  return todos
}

/** Lo que paga cada acierto nuevo. Solo se cobra lo que se mejora sobre el mejor intento. */
export const CROQUETAS_POR_ACIERTO = 2
