/**
 * Marca en un texto ya convertido a HTML los términos que están en el glosario,
 * para poder pulsarlos y leer qué significan sin salir del reto.
 *
 * Tres reglas, y las tres importan:
 *
 * 1. No se toca nada dentro de `<code>` ni de `<pre>`. Ahí `map` es una llamada
 *    y no una palabra que explicar; enlazarla sería estropear el ejemplo.
 * 2. No se toca nada dentro de una etiqueta HTML, o se enlazarían atributos.
 * 3. Cada término se marca UNA vez por bloque. Marcar todas sus apariciones
 *    convierte el enunciado en una alfombra de enlaces y no se lee nada.
 */

/** Se usa \p{L} y no \w porque \w se deja fuera las tildes y la eñe. */
const ES_LETRA = /[\p{L}\p{N}_]/u

/** Busca una palabra suelta, no un trozo dentro de otra palabra. */
function buscarPalabra(texto, aguja) {
  const enMinusculas = texto.toLowerCase()
  const buscada = aguja.toLowerCase()
  let desde = 0

  while (desde <= enMinusculas.length - buscada.length) {
    const posicion = enMinusculas.indexOf(buscada, desde)
    if (posicion === -1) return -1

    const antes = texto[posicion - 1]
    const despues = texto[posicion + aguja.length]
    if ((!antes || !ES_LETRA.test(antes)) && (!despues || !ES_LETRA.test(despues))) {
      return posicion
    }
    desde = posicion + 1
  }
  return -1
}

function marcarEnTexto(texto, buscables, yaPuestos) {
  const marcas = []

  for (const { texto: aguja, id } of buscables) {
    if (yaPuestos.has(id)) continue
    const inicio = buscarPalabra(texto, aguja)
    if (inicio === -1) continue

    const fin = inicio + aguja.length
    // Los términos vienen del más largo al más corto, así que el largo pilla
    // sitio primero y el corto que se solape se queda fuera.
    if (marcas.some((marca) => inicio < marca.fin && fin > marca.inicio)) continue

    marcas.push({ inicio, fin, id })
    yaPuestos.add(id)
  }

  if (marcas.length === 0) return texto

  marcas.sort((a, b) => a.inicio - b.inicio)
  let salida = ''
  let cursor = 0
  for (const marca of marcas) {
    salida += texto.slice(cursor, marca.inicio)
    salida += `<button type="button" class="termino" data-termino="${marca.id}">`
    salida += texto.slice(marca.inicio, marca.fin)
    salida += '</button>'
    cursor = marca.fin
  }
  return salida + texto.slice(cursor)
}

export function enlazarTerminos(html, buscables) {
  const yaPuestos = new Set()
  let salida = ''
  let posicion = 0
  let dentroDeCodigo = 0

  while (posicion < html.length) {
    if (html[posicion] === '<') {
      const cierre = html.indexOf('>', posicion)
      if (cierre === -1) {
        salida += html.slice(posicion)
        break
      }
      const etiqueta = html.slice(posicion, cierre + 1)
      if (/^<(code|pre)\b/i.test(etiqueta)) dentroDeCodigo += 1
      else if (/^<\/(code|pre)>/i.test(etiqueta)) dentroDeCodigo = Math.max(0, dentroDeCodigo - 1)
      salida += etiqueta
      posicion = cierre + 1
      continue
    }

    const siguiente = html.indexOf('<', posicion)
    const trozo = html.slice(posicion, siguiente === -1 ? html.length : siguiente)
    salida += dentroDeCodigo > 0 ? trozo : marcarEnTexto(trozo, buscables, yaPuestos)
    posicion += trozo.length
  }

  return salida
}
