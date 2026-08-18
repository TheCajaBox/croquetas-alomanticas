/**
 * Los sombreros escondidos.
 *
 * Hay uno en cada rincón del juego, medio disimulado, esperando a que alguien
 * pase el ratón por encima. Wayne jura que todos son suyos.
 *
 * Cada uno se coloca poniendo <SombreroEscondido id="..." /> dentro de un
 * elemento con `position: relative`. La `pista` es lo único que se enseña de
 * los que aún no has encontrado; el `donde` aparece después, cuando ya no hay
 * nada que destripar.
 */
export const SOMBREROS = [
  {
    id: 'cabecera',
    nombre: 'El bombín de la casa',
    pista: 'Lo tienes delante desde el primer segundo, arriba del todo.',
    donde: 'Colgado del nombre del juego.',
    dice: 'Ese estaba ahí desde el principio. Llevas todo el rato mirándolo.',
  },
  {
    id: 'mundos',
    nombre: 'El polvoriento',
    pista: 'Donde se eligen los mundos, alguien dejó uno en la puerta.',
    donde: 'En la portada, junto al titular.',
    dice: 'Cogió polvo de los Áridos. Le sienta bien, la verdad.',
  },
  {
    id: 'mundo',
    nombre: 'El de la entrada',
    pista: 'Al entrar en un mundo, mira bien la placa con el nombre.',
    donde: 'En la cabecera de un mundo.',
    dice: 'Uno se lo deja al entrar y ya no se acuerda. Me pasa mucho.',
  },
  {
    id: 'enunciado',
    nombre: 'El del que lee dos veces',
    pista: 'Sobre el papel donde te explican lo que hay que hacer.',
    donde: 'En el enunciado de un reto.',
    dice: 'Ese es de leer despacio. Se nota en lo aplastado que está.',
  },
  {
    id: 'pistas',
    nombre: 'El del prestamista',
    pista: 'Donde se paga por saber, alguien dejó su prenda.',
    donde: 'En el panel de pistas.',
    dice: 'Ese lo dejé yo de garantía. Ya no me acuerdo de qué.',
  },
  {
    id: 'resultados',
    nombre: 'El del que falla',
    pista: 'Donde te dicen lo que has hecho mal.',
    donde: 'En el panel de resultados.',
    dice: 'Ese se lo quitó alguien al ver los tests en rojo. Muy comprensible.',
  },
  {
    id: 'vista-previa',
    nombre: 'El del escaparate',
    pista: 'Donde se ve lo que pinta tu componente.',
    donde: 'En la vista previa del sandbox.',
    dice: 'Estaba puesto ahí para que se viera. Y no lo veías.',
  },
  {
    id: 'colonia',
    nombre: 'El que el gato usa de cama',
    pista: 'Donde se cuida a los gatos. Ellos ya lo han encontrado.',
    donde: 'En la colonia.',
    dice: 'Ese ya no es mío. Ese es del gato, y no pienso discutírselo.',
  },
  {
    id: 'refugio',
    nombre: 'El de las visitas',
    pista: 'En la puerta del refugio, esperando a alguien.',
    donde: 'En el refugio.',
    dice: 'Me lo pongo para adoptar. Da un aire responsable que no tengo.',
  },
  {
    id: 'trastos',
    nombre: 'El del fondo del cajón',
    pista: 'Entre las cosas que no valen nada. Encaja perfectamente.',
    donde: 'En el cajón de los trastos.',
    dice: 'Ese sí que no vale nada. Por eso está tan a gusto ahí.',
  },
  {
    id: 'ajustes',
    nombre: 'El de emergencia',
    pista: 'Cerca del botón que borra la partida. Por si acaso.',
    donde: 'En los ajustes.',
    dice: 'Uno de repuesto. Siempre hay que tener uno de repuesto.',
  },
  {
    id: 'sombrerera',
    nombre: 'El que estaba a la vista',
    pista: 'En esta misma habitación. Sí, aquí. Vuelve a mirar.',
    donde: 'En la propia sombrerera.',
    dice: 'Ese estaba aquí desde el principio y has tardado lo tuyo. Bien jugado igual.',
  },
]

export const SOMBREROS_POR_ID = Object.fromEntries(SOMBREROS.map((s) => [s.id, s]))

/** Lo que Wayne paga por cada sombrero que le devuelves. Regatear no sirve. */
export const CROQUETAS_POR_SOMBRERO = 15
