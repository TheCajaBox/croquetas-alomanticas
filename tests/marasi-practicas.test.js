import { describe, expect, it } from 'vitest'

import { PRACTICAS } from '../src/contenido/marasi/practicas.js'
import { revisar } from '../src/motor/marasi/revisar.js'

/** Los ids que ha encontrado la revisión, para comprobar sin depender del orden. */
const ids = (codigo) => revisar(codigo).map((a) => a.id)

describe('el informe de Marasi', () => {
  it('no dice nada de un código limpio', () => {
    expect(
      ids(`
        const TARIFA = 25
        function cobrar(dias) {
          return TARIFA * dias
        }
      `),
    ).toEqual([])
  })

  it('nunca revienta, ni con código roto ni vacío', () => {
    expect(revisar('function a( {')).toEqual([])
    expect(revisar('')).toEqual([])
    expect(revisar(null)).toEqual([])
  })

  it('caza un let que nunca cambia, y nombra cuál', () => {
    const avisos = revisar('let total = 0\nconsole.log(total)')
    expect(avisos[0].id).toBe('let-que-no-cambia')
    expect(avisos[0].ejemplos).toContain('total')
  })

  it('no lo caza cuando de verdad cambia', () => {
    expect(ids('let total = 0\ntotal += 1')).not.toContain('let-que-no-cambia')
    expect(ids('let i = 0\ni++')).not.toContain('let-que-no-cambia')
  })

  it('tampoco cuando lo cambia el propio bucle', () => {
    expect(ids('for (let i = 0; i < 3; i += 1) { console.log(i) }')).not.toContain('let-que-no-cambia')
  })

  it('caza la igualdad floja', () => {
    expect(ids('const a = 1 == 2')).toContain('igualdad-floja')
    expect(ids('const a = 1 != 2')).toContain('igualdad-floja')
  })

  it('pero deja pasar la comparación con null, que es el uso defendible', () => {
    expect(ids('const a = x == null')).not.toContain('igualdad-floja')
  })

  it('caza el if que devuelve true o false', () => {
    expect(ids('function f(x) { if (x > 1) { return true } else { return false } }')).toContain(
      'booleano-con-vuelta',
    )
  })

  it('no lo caza cuando las ramas devuelven otra cosa', () => {
    expect(ids('function f(x) { if (x > 1) { return "si" } else { return "no" } }')).not.toContain(
      'booleano-con-vuelta',
    )
  })

  it('caza tres if anidados', () => {
    expect(
      ids('function f(a) { if (a) { if (a.b) { if (a.b.c) { return 1 } } } }'),
    ).toContain('anidamiento')
  })

  it('no caza dos, que es normal', () => {
    expect(ids('function f(a) { if (a) { if (a.b) { return 1 } } }')).not.toContain('anidamiento')
  })

  it('caza cuatro parámetros', () => {
    expect(ids('function f(a, b, c, d) { return a }')).toContain('muchos-parametros')
    expect(ids('function f(a, b, c) { return a }')).not.toContain('muchos-parametros')
  })

  it('caza un parámetro reasignado', () => {
    expect(ids('function f(nombre) { nombre = nombre.trim(); return nombre }')).toContain(
      'parametro-reasignado',
    )
  })

  it('caza el catch vacío', () => {
    expect(ids('try { hacer() } catch (e) {}')).toContain('catch-vacio')
    expect(ids('try { hacer() } catch (e) { avisar(e) }')).not.toContain('catch-vacio')
  })

  it('caza un número mágico repetido, y perdona el 0 y el 1', () => {
    expect(ids('const a = 500\nconst b = 500\nconst c = 500')).toContain('numero-magico')
    expect(ids('const a = 0\nconst b = 0\nconst c = 0')).not.toContain('numero-magico')
    expect(ids('const a = 500\nconst b = 500')).not.toContain('numero-magico')
  })

  it('caza un nombre de una letra, pero no los que son costumbre', () => {
    expect(ids('const q = 5\nconsole.log(q)')).toContain('nombre-de-una-letra')
    expect(ids('const i = 5\nconsole.log(i)')).not.toContain('nombre-de-una-letra')
  })

  it('no suelta más de tres avisos de golpe', () => {
    const horrible = `
      function f(a, b, c, d) {
        let x = 500
        let y = 500
        let z = 500
        if (a == b) { if (b) { if (c) { return true } else { return false } } }
        try { hacer() } catch (e) {}
        return x
      }
    `
    expect(revisar(horrible).length).toBeLessThanOrEqual(3)
    expect(revisar(horrible).length).toBeGreaterThan(0)
  })
})

describe('la lista de prácticas', () => {
  it('todas se explican, y con algo más que una frase suelta', () => {
    for (const practica of PRACTICAS) {
      expect(practica.titulo, practica.id).toBeTruthy()
      expect(practica.porque.length, `${practica.id} se explica de más`).toBeGreaterThan(80)
    }
  })

  it('no hay ids repetidos', () => {
    const vistos = PRACTICAS.map((p) => p.id)
    expect(new Set(vistos).size).toBe(vistos.length)
  })
})
