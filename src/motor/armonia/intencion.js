/**
 * Qué te ha preguntado.
 *
 * Reglas y no adivinación: se mira la frase, se decide, y decidiendo lo mismo
 * siempre. Un clasificador que a veces acierta sería peor que ninguno, porque
 * la respuesta de Armonía depende entera de esto.
 *
 * El orden de las comprobaciones es el orden de prioridad, y no es casual:
 * «no me sale, dame la solución» es una petición de solución aunque también
 * suene a que está atascado.
 */
import { traducirImprevisto } from '../../contenido/imprevistos.js'
import { normalizar, terminosMencionados } from './buscar.js'

export const INTENCIONES = ['peticion', 'error', 'diagnostico', 'donde', 'definicion', 'general']

/** Pedir la respuesta, en todas las formas en que se pide. */
const PETICION = [
  /\b(dame|dime|damela|escribeme|ponme|pasame|necesito)\b.{0,30}\b(solucion|respuesta|codigo|resultado)\b/,
  /\b(cual|cuales)\b.{0,20}\b(es|son)\b.{0,20}\b(la solucion|la respuesta|el codigo)\b/,
  /\b(resuelve|resuelvelo|resuelvemelo|hazlo|hazmelo|complet(a|amelo))\b/,
  /\b(la solucion|la respuesta correcta)\b/,
  /\bcomo se (hace|resuelve|soluciona)\b.{0,20}\b(este|el) (reto|ejercicio)\b/,
  /\bhaz(lo)? (tu|por mi)\b/,
]

/** Está atascado y quiere saber por qué. */
const DIAGNOSTICO = [
  /\bpor que\b.{0,25}\b(falla|no funciona|no va|no pasa|no me sale|da error|esta mal)\b/,
  /\b(no funciona|no me funciona|no va|no me va|no me sale|no lo consigo)\b/,
  /\b(que|donde) (hago|estoy haciendo|tengo) mal\b/,
  /\bno (se|entiendo) (que|por que|donde)\b.{0,25}\b(falla|pasa|va mal|esta mal)\b/,
  /\b(estoy|ando) atascad/,
  /\bno (me )?pasa(n)? (el|los) test/,
  /\bque me falta\b/,
]

/** Dónde estaba explicado esto. */
const DONDE = [
  // Con la terminación abierta: «se explica», «se explicaba», «se explicó».
  /\bdonde\b.{0,25}\b(se explic\w*|lo explic\w*|estaba|se ve|se vio|lo vi|aparec\w*|sal[ie]\w*)\b/,
  /\ben que (reto|ejercicio|mundo|apunte)\b/,
  /\b(repasar|volver a ver|releer)\b/,
]

/** Qué es esto. */
const DEFINICION = [
  /\bque (es|son|significa|significan|quiere decir)\b/,
  /\bpara que (sirve|sirven|vale|valen|se usa|se usan)\b/,
  /\bque (hace|hacen)\b/,
  /\bdiferencia entre\b/,
  /\bcuando se usa\b/,
]

const casaAlguno = (patrones, texto) => patrones.some((patron) => patron.test(texto))

/**
 * @param {string} pregunta lo que ha escrito el jugador
 * @param {{resultado?: object}} contexto para saber si hay un error a la vista
 * @returns {{tipo: string, terminos: Array, errorDetectado: object|null}}
 */
export function clasificar(pregunta, { resultado = null, lenguaje = 'js' } = {}) {
  const plano = normalizar(pregunta).replace(/[¿?¡!.,;:]/g, ' ').replace(/\s+/g, ' ').trim()
  const terminos = terminosMencionados(pregunta)

  // Un error pegado en la caja de texto se reconoce venga como venga, y manda
  // sobre todo lo demás: es lo más concreto que puede traer nadie.
  const errorPegado = traducirImprevisto(pregunta, lenguaje)

  if (casaAlguno(PETICION, plano)) return { tipo: 'peticion', terminos, errorDetectado: null }
  if (errorPegado) return { tipo: 'error', terminos, errorDetectado: errorPegado }

  if (casaAlguno(DIAGNOSTICO, plano)) {
    // «No funciona» con un error en pantalla es una pregunta sobre ese error.
    const delResultado = traducirImprevisto(resultado?.error?.mensaje ?? resultado?.error, lenguaje)
    if (delResultado) return { tipo: 'error', terminos, errorDetectado: delResultado }
    return { tipo: 'diagnostico', terminos, errorDetectado: null }
  }

  if (casaAlguno(DONDE, plano)) return { tipo: 'donde', terminos, errorDetectado: null }
  if (casaAlguno(DEFINICION, plano)) return { tipo: 'definicion', terminos, errorDetectado: null }

  // Escribir un término a secas -«computed»- es preguntar qué es.
  const soloUnTermino =
    terminos.length > 0 && plano.split(' ').filter(Boolean).length <= 3
  if (soloUnTermino) return { tipo: 'definicion', terminos, errorDetectado: null }

  return { tipo: 'general', terminos, errorDetectado: null }
}
