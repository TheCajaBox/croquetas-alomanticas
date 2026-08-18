/**
 * Lo que Wayne te deja a cambio cuando le compras una pista.
 *
 * No valen nada, no hacen nada y no se pueden vender. Son el registro
 * permanente de cuántas veces has pedido ayuda, y por eso están aquí.
 */
export const TRASTOS = [
  { id: 'guijarro', nombre: 'Un guijarro', nota: 'Es un buen guijarro. Wayne insiste mucho en eso.' },
  { id: 'guante', nombre: 'Un guante desparejado', nota: 'De la mano izquierda. Siempre de la izquierda.' },
  { id: 'sombrero', nombre: 'Un sombrero que no te vale', nota: 'Te queda enorme. A Wayne le quedaba perfecto.' },
  { id: 'chicle', nombre: 'Chicle masticado', nota: '«Pero del bueno», dice. No aclara qué significa eso.' },
  { id: 'boton', nombre: 'Un botón de latón', nota: 'Arrancado de un abrigo que ojalá no fuera tuyo.' },
  { id: 'cuerda', nombre: 'Un trozo de cuerda', nota: 'Demasiado corta para atar nada. Demasiado larga para tirarla.' },
  { id: 'moneda', nombre: 'Una moneda doblada', nota: 'Alguien la usó para algo. Wayne cambia de tema.' },
  { id: 'lapiz', nombre: 'Medio lápiz', nota: 'La mitad sin punta, claro.' },
  { id: 'llave', nombre: 'Una llave sin cerradura', nota: 'Abre algo. En algún sitio. Probablemente.' },
  { id: 'pluma', nombre: 'Una pluma de ganso', nota: 'Sin tinta y bastante despeinada.' },
  { id: 'canica', nombre: 'Una canica turbia', nota: 'Dentro hay algo que se mueve si la agitas. No la agites.' },
  { id: 'recibo', nombre: 'Un recibo ajeno', nota: 'De una taberna de Elendel. La firma no es la suya. Eso dice.' },
  { id: 'pañuelo', nombre: 'Un pañuelo con iniciales', nota: 'Las iniciales no son "W" ni "L". Wayne no se inmuta.' },
  { id: 'tuerca', nombre: 'Una tuerca suelta', nota: 'Venía de una máquina que ahora funciona igual. Casi igual.' },
  { id: 'mapa', nombre: 'Un mapa de los Áridos', nota: 'Está dibujado a mano y no coincide con ningún sitio real.' },
  { id: 'diente', nombre: 'Un diente de algo', nota: 'Wayne asegura que era suyo. Wayne tiene todos los dientes.' },
]

export const TRASTOS_POR_ID = Object.fromEntries(TRASTOS.map((trasto) => [trasto.id, trasto]))
