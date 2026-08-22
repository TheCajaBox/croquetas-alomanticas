import { expect, it } from 'vitest'
import { obtenerCorpus } from '../src/contenido/armonia/corpus.js'

it('el corpus todavia tiene los enunciados', async () => {
  const trozos = await obtenerCorpus()
  const enunciados = trozos.filter((t) => t.tipo === 'enunciado')
  console.log('trozos', trozos.length, 'enunciados', enunciados.length)
  const conTexto = enunciados.filter((t) => (t.texto ?? '').trim().split('\n').length > 1)
  console.log('enunciados con texto de verdad', conTexto.length)
  console.log('ejemplo:', JSON.stringify(enunciados[0]?.texto?.slice(0, 120)))
  expect(conTexto.length).toBeGreaterThan(50)
})
