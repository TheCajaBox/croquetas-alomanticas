/**
 * Baraja siempre igual para la misma semilla.
 *
 * Los retos de ordenar y de emparejar tienen que salir exactamente iguales cada
 * vez que se abren: si cambiaran en cada recarga, alguien atascado no podría
 * comparar con lo que probó antes, y además bastaría con recargar hasta que
 * saliera fácil.
 */
function numeroDesde(semilla) {
  let valor = 2166136261
  for (let i = 0; i < semilla.length; i += 1) {
    valor ^= semilla.charCodeAt(i)
    valor = Math.imul(valor, 16777619)
  }
  return () => {
    valor ^= valor << 13
    valor ^= valor >>> 17
    valor ^= valor << 5
    return Math.abs(valor % 100000) / 100000
  }
}

export function barajarConSemilla(lista, semilla) {
  const siguiente = numeroDesde(String(semilla))
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(siguiente() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  // Si la baraja deja algo en su sitio original, no pasa nada; lo que no puede
  // es devolver la lista entera sin tocar.
  const igual = copia.every((elemento, i) => elemento === lista[i])
  return igual && copia.length > 1 ? [...copia.slice(1), copia[0]] : copia
}
