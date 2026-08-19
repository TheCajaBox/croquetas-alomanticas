/**
 * Dónde está el puntero dentro de un elemento, en tanto por uno.
 *
 * Lo usan el cepillo y la pluma, que hacen cosas muy distintas con lo mismo:
 * saber dónde está el dedo -o el ratón, que con eventos de puntero es el mismo
 * camino- sin depender del tamaño que tenga la caja en pantalla.
 */
export function dentroDe(evento, elemento) {
  const caja = elemento.getBoundingClientRect()
  return {
    x: (evento.clientX - caja.left) / caja.width,
    y: (evento.clientY - caja.top) / caja.height,
    ancho: caja.width,
    alto: caja.height,
  }
}
