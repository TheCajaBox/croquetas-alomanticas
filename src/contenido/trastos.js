/**
 * Lo que te dejan a cambio cuando compras una pista.
 *
 * No valen nada, no hacen nada y no se pueden vender. Son el registro
 * permanente de cuántas veces has pedido ayuda, y por eso están aquí: pagar una
 * pista se olvida, un cajón con dieciséis cachivaches dentro no.
 *
 * ## Uno por camino, y esto no era un adorno
 *
 * Los dieciséis primeros los daba Wayne y hablaban de Wayne, de Elendel y de los
 * Áridos. Con cuatro caminos eso se rompió sin que nada fallara: en Elantris las
 * pistas las vende Karata, y te entregaba «un mapa de los Áridos» de parte de un
 * hombre que está a mil años de allí. Es el mismo error que tenían la insignia y
 * la cabecera del cajón, escondido en el sitio más tonto.
 *
 * Así que cada camino tiene su cajón, y cada cajón el humor de quien lo llena,
 * que es la parte que merecía la pena:
 *
 * - **Wayne** (segunda era) intercambia. Nunca roba: intercambia. Lo que te deja
 *   es basura elegida con un cuidado sospechoso, y siempre insiste en que es
 *   buena.
 * - **Fantasma** (primera era) fue un crío de la calle y sigue guardándolo todo
 *   por si acaso. Lo suyo no es basura: es reserva. Y no la suelta contento.
 * - **Karata** (Elantris) vive donde nada se tira porque nada llega. Lo que te
 *   da lo tenía guardado, y te lo da sin ceremonia y sin explicarlo.
 * - **Han ShuXen** (Sel) es un general. Lo que te entrega es material, viene con
 *   su procedencia y, si se puede, con su informe.
 *
 * `camino` no es decorativo: `trastosDelCamino` es lo único que mira
 * `recibirTrasto`, así que un trasto sin camino no se entrega nunca.
 */
export const TRASTOS = [
  // ── La segunda era. Wayne. ────────────────────────────────────────────────
  { id: 'guijarro', camino: 'era2', nombre: 'Un guijarro', nota: 'Es un buen guijarro. Wayne insiste mucho en eso.' },
  { id: 'guante', camino: 'era2', nombre: 'Un guante desparejado', nota: 'De la mano izquierda. Siempre de la izquierda.' },
  { id: 'sombrero', camino: 'era2', nombre: 'Un sombrero que no te vale', nota: 'Te queda enorme. A Wayne le quedaba perfecto.' },
  { id: 'chicle', camino: 'era2', nombre: 'Chicle masticado', nota: '«Pero del bueno», dice. No aclara qué significa eso.' },
  { id: 'boton', camino: 'era2', nombre: 'Un botón de latón', nota: 'Arrancado de un abrigo que ojalá no fuera tuyo.' },
  { id: 'cuerda', camino: 'era2', nombre: 'Un trozo de cuerda', nota: 'Demasiado corta para atar nada. Demasiado larga para tirarla.' },
  { id: 'moneda', camino: 'era2', nombre: 'Una moneda doblada', nota: 'Alguien la usó para algo. Wayne cambia de tema.' },
  { id: 'lapiz', camino: 'era2', nombre: 'Medio lápiz', nota: 'La mitad sin punta, claro.' },
  { id: 'llave', camino: 'era2', nombre: 'Una llave sin cerradura', nota: 'Abre algo. En algún sitio. Probablemente.' },
  { id: 'pluma', camino: 'era2', nombre: 'Una pluma de ganso', nota: 'Sin tinta y bastante despeinada.' },
  { id: 'canica', camino: 'era2', nombre: 'Una canica turbia', nota: 'Dentro hay algo que se mueve si la agitas. No la agites.' },
  { id: 'recibo', camino: 'era2', nombre: 'Un recibo ajeno', nota: 'De una taberna de Elendel. La firma no es la suya. Eso dice.' },
  { id: 'pañuelo', camino: 'era2', nombre: 'Un pañuelo con iniciales', nota: 'Las iniciales no son «W» ni «L». Wayne no se inmuta.' },
  { id: 'tuerca', camino: 'era2', nombre: 'Una tuerca suelta', nota: 'Venía de una máquina que ahora funciona igual. Casi igual.' },
  { id: 'mapa', camino: 'era2', nombre: 'Un mapa de los Áridos', nota: 'Está dibujado a mano y no coincide con ningún sitio real.' },
  { id: 'diente', camino: 'era2', nombre: 'Un diente de algo', nota: 'Wayne asegura que era suyo. Wayne tiene todos los dientes.' },

  // ── La primera era. Fantasma, que lo guarda todo por si acaso. ────────────
  { id: 'mendrugo', camino: 'era1', nombre: 'Un mendrugo envuelto en un trapo', nota: 'Lo llevaba encima. Lo lleva siempre. Te mira un rato antes de dártelo.' },
  { id: 'clavo', camino: 'era1', nombre: 'Un clavo enderezado a martillazos', nota: 'Estaba torcido y ahora no. Eso cuenta como arreglarlo.' },
  { id: 'ceniza', camino: 'era1', nombre: 'Un frasquito de ceniza', nota: 'Cae del cielo todos los días y aun así lo ha guardado. Por si algún día no cae.' },
  { id: 'cordel', camino: 'era1', nombre: 'Un cordel con siete nudos', nota: 'Los nudos significan algo. Te dice que ya los contarás tú.' },
  { id: 'cuchara', camino: 'era1', nombre: 'Una cuchara de estaño abollada', nota: 'Abollada del lado de morder. No preguntes por el lado de morder.' },
  { id: 'esquirla', camino: 'era1', nombre: 'Una esquirla de cristal ahumado', nota: 'Se mira el sol a través y no ciega. Es lo más útil del cajón, y él lo sabe.' },
  { id: 'plano', camino: 'era1', nombre: 'Un plano de un almacén', nota: 'Con dos salidas marcadas y una tachada. La tachada es la que él usaría.' },
  { id: 'hebilla', camino: 'era1', nombre: 'Una hebilla sin correa', nota: 'La correa se cambió por comida. La hebilla no valía nada, así que se queda.' },
  { id: 'guijas', camino: 'era1', nombre: 'Tres guijas de contar', nota: 'Aprendió a contar con ellas. Te las da igual, y luego se arrepiente un poco.' },
  { id: 'trapo', camino: 'era1', nombre: 'Un trapo limpio', nota: 'Limpio de verdad, y en Luthadel eso es un lujo. Lo dice sin ironía.' },
  { id: 'silbato', camino: 'era1', nombre: 'Un silbato de hueso', nota: 'No suena. Suena si sabes soplarlo, y él no te va a enseñar cómo.' },
  { id: 'moneda-vieja', camino: 'era1', nombre: 'Una moneda de antes', nota: 'De un imperio que ya no cobra. Sigue siendo metal, dice, y el metal sirve.' },
  { id: 'boceto', camino: 'era1', nombre: 'Un boceto a carbón de una puerta', nota: 'Una puerta y nada más. Dibujó la puerta porque estaba abierta.' },
  { id: 'saquito', camino: 'era1', nombre: 'Un saquito vacío', nota: 'Vacío ahora. Insiste en que lo importante de un saco es que se pueda llenar.' },

  // ── Elantris. Karata, donde nada se tira porque nada llega. ───────────────
  { id: 'tiza', camino: 'elantris', nombre: 'Un cabo de tiza', nota: 'Gastado por los dos extremos. Aquí se traza en el suelo, y el suelo no perdona.' },
  { id: 'teja', camino: 'elantris', nombre: 'Media teja de Kae', nota: 'Del lado bueno del muro. La trajo alguien que entró, no alguien que salió.' },
  { id: 'aguja', camino: 'elantris', nombre: 'Una aguja sin ojo', nota: 'Se le rompió el ojo y no sirve para coser. Sirve para señalar, y eso también hace falta.' },
  { id: 'listado', camino: 'elantris', nombre: 'Un listado de nombres', nota: 'Escrito con letra clara y sin una sola tachadura. Ella se acuerda de los nombres; el papel es por si acaso.' },
  { id: 'cuenco', camino: 'elantris', nombre: 'Un cuenco desportillado', nota: 'Aguanta el agua si lo inclinas hacia el lado bueno. Aquí eso se llama «que funciona».' },
  { id: 'llave-torcida', camino: 'elantris', nombre: 'Una llave que ya no abre nada', nota: 'La cerradura sigue en su puerta y la puerta ya no está. Se la queda igual.' },
  { id: 'trazo', camino: 'elantris', nombre: 'Un aon a medio trazar', nota: 'Le falta una línea, así que no hace nada. Es exactamente el chiste de este camino.' },
  { id: 'venda', camino: 'elantris', nombre: 'Una venda enrollada', nota: 'Limpia, doblada y enrollada apretada. La da como quien da algo que va a hacer falta.' },
  { id: 'candil', camino: 'elantris', nombre: 'Un candil sin aceite', nota: 'El candil es lo fácil. Lo que aquí no hay es el aceite.' },
  { id: 'astilla', camino: 'elantris', nombre: 'Una astilla de madera pintada', nota: 'Se ve un trozo de azul. Alguien pintó algo de azul, alguna vez, en esta ciudad.' },
  { id: 'anilla', camino: 'elantris', nombre: 'Una anilla de hierro', nota: 'De una cadena a la que le faltan las demás anillas. No dice qué pasó con las demás.' },
  { id: 'medida', camino: 'elantris', nombre: 'Una cuerda con marcas', nota: 'Marcas a intervalos iguales. Alguien midió algo con cuidado y aquí eso es raro.' },
  { id: 'pizarrin', camino: 'elantris', nombre: 'Un pizarrín partido', nota: 'Partido en dos y las dos mitades escriben. Es el trasto más optimista del cajón.' },
  { id: 'sello-cera', camino: 'elantris', nombre: 'Un pegote de cera roja', nota: 'Fue el sello de una carta. La carta llegó, que es lo que casi nunca pasa.' },

  // ── Sel. Han ShuXen, que entrega material con su procedencia. ─────────────
  { id: 'sello-usado', camino: 'sel', nombre: 'Un sello de madera gastado', nota: 'Estampa una marca que ya no certifica nada. La conserva por eso mismo.' },
  { id: 'lacre', camino: 'sel', nombre: 'Una barra de lacre empezada', nota: 'Entregada con la nota de quién la usó por última vez. Todo aquí viene con su procedencia.' },
  { id: 'pincel', camino: 'sel', nombre: 'Un pincel de un solo pelo', nota: 'Para trazos finos. Los que se falsifican son los finos, dice, y lo dice sin levantar la voz.' },
  { id: 'contraseña', camino: 'sel', nombre: 'Una consigna caducada', nota: 'Escrita en un papel que había que quemar. No la quemó, y ese es el problema entero.' },
  { id: 'plancha', camino: 'sel', nombre: 'Una plancha de prueba', nota: 'Con la misma marca estampada nueve veces. Ocho son buenas. Buena suerte con la novena.' },
  { id: 'llave-doble', camino: 'sel', nombre: 'Una llave con dos dientes iguales', nota: 'Dos dientes iguales significa una comprobación de menos. La guarda como aviso.' },
  { id: 'informe', camino: 'sel', nombre: 'Un informe de tres líneas', nota: 'Tres líneas y una firma. Los informes largos, dice, se escriben para que nadie los lea.' },
  { id: 'reloj', camino: 'sel', nombre: 'Un reloj de arena atascado', nota: 'Mide siempre lo mismo, y lo mismo no es un minuto. Un plazo que no avanza no es un plazo.' },
  { id: 'ficha-guardia', camino: 'sel', nombre: 'Una ficha de guardia', nota: 'Sirve para entrar. No dice quién eres, solo que la llevas, y eso ya es la mitad del temario.' },
  { id: 'tinta-negra', camino: 'sel', nombre: 'Un tintero casi vacío', nota: 'Del negro que se usa en los originales. Casi vacío, y de eso se ha escrito un mundo entero.' },
  { id: 'cordon', camino: 'sel', nombre: 'Un cordón de expediente', nota: 'Cortado y vuelto a atar. Se nota si se mira; nadie lo miró.' },
  { id: 'copia', camino: 'sel', nombre: 'La copia de un documento', nota: 'Idéntica al original salvo en una cifra. Te deja encontrar la cifra tú.' },
  { id: 'lupa', camino: 'sel', nombre: 'Una lupa rajada', nota: 'La raja cruza justo el centro. Se puede mirar por los lados, y por los lados no se ve el centro.' },
  { id: 'lista-blanca', camino: 'sel', nombre: 'Una lista de lo permitido', nota: 'Corta, escrita a mano y sin una sola excepción apuntada al margen. Está orgulloso de ella.' },
]

export const TRASTOS_POR_ID = Object.fromEntries(TRASTOS.map((trasto) => [trasto.id, trasto]))

/**
 * Los trastos que se entregan en un camino.
 *
 * Un camino sin trastos propios se queda con los de la segunda era, que son los
 * que había: es mejor entregar algo de otro sitio que no entregar nada y dejar
 * la pista sin su parte de comedia. Pero eso no pasa hoy con ninguno, y hay una
 * prueba que lo mantiene así.
 */
export const trastosDelCamino = (itinerarioId) => {
  const suyos = TRASTOS.filter((trasto) => trasto.camino === itinerarioId)
  return suyos.length > 0 ? suyos : TRASTOS.filter((trasto) => trasto.camino === 'era2')
}
