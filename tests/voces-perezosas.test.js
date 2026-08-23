import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { MUNDOS } from '../src/contenido/mundos.js'
import { cargarTodasLasVoces, cargarVoz } from '../src/contenido/narrador/index.js'
import { usarNarrador } from '../src/almacen/narrador.js'

/**
 * Lo que pasa **antes** de que las voces lleguen.
 *
 * Va en su propio fichero a propósito: la caché de voces es de módulo, así que
 * la primera prueba que pida una la deja caliente para todas las demás. Aquí
 * nadie la calienta antes de tiempo, y así se puede comprobar lo único que de
 * verdad importa de este reparto: que el juego no se queda callado mientras
 * espera.
 */
describe('el narrador antes de que lleguen las voces', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('quien no ha llegado todavía no se queda sin hablar: se le espera', async () => {
    // La red del diseño. `decir` con la voz sin traer devuelve null -no hay nada
    // que decir *todavía*- y vuelve a intentarlo cuando llega, así que la frase
    // sale un tic más tarde en vez de perderse. Sin esto, el bocadillo de
    // bienvenida no aparecía nunca en la primera carga.
    setActivePinia(createPinia())
    const narrador = usarNarrador()
    expect(narrador.decir('bienvenida', {}, { forzar: true })).toBeNull()
    expect(narrador.mensaje).toBeNull()

    await cargarVoz('wayne')
    await Promise.resolve()
    expect(narrador.mensaje?.evento).toBe('bienvenida')
    expect(narrador.mensaje?.personaje).toBe('wayne')
  })

  it('una presentación no se gasta mientras se espera a la voz', async () => {
    // Este es el fallo caro del reintento: `entrarAlMundo` apunta al anfitrión
    // como presentado *antes* de hablar, así que si se quedaba sin frase por no
    // tener la voz, la presentación se gastaba en silencio y ya no volvía.
    setActivePinia(createPinia())
    const narrador = usarNarrador()
    const suyo = MUNDOS.find((mundo) => mundo.anfitrion && mundo.anfitrion !== 'wayne')

    expect(narrador.entrarAlMundo(suyo)).toBeNull()
    expect(narrador.presentados, 'se ha gastado la presentación esperando').toEqual([])

    await cargarTodasLasVoces()
    await Promise.resolve()
    expect(narrador.mensaje?.personaje).toBe(suyo.anfitrion)
    expect(narrador.mensaje?.evento).toBe('presentacion')
  })})
