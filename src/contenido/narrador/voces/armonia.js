/**
 * Armonía.
 *
 * Dos sacos y nada más, a propósito: no usa el bocadillo del narrador ni suelta
 * ocurrencias en una esquina. Habla en su panel, cuando se le pregunta. Un dios
 * que va comentando la jugada deja de ser un dios.
 *
 * El registro es el de la era 2, no el del Sazed servicial de antes: formal,
 * sereno, con peso. Cálido y nunca colega. Y cuando se contiene no se escuda en
 * ninguna norma, porque no la hay: es que sabe lo que pasa cuando da de más.
 *
 * Aquí no hay bromas, y eso es una decisión y no un descuido: es el único del
 * elenco que no las hace. Lo más cerca que llega es una ironía muy seca sobre
 * su propia posición -saberlo todo y tener que callarse la mitad-, y funciona
 * justamente porque el resto del juego se ríe todo el rato.
 *
 * Y no nombra a nadie. Contesta en dos caminos, así que un nombre propio suyo
 * sería siempre el nombre de alguien que no está allí.
 */
const LINEAS_DE_ARMONIA = {
  presentacion: [
    'Sé quién eres, y sé exactamente en qué reto te has quedado parado. No deberías extrañarte: lo sé casi todo, y por eso mismo tengo mucho cuidado con lo que digo.\n\nPregúntame qué significa una palabra, qué significa un error, o dónde se explicaba algo que ya viste. Eso te lo doy entero.\n\nLa solución de un reto, no. Nunca. Y no por prudencia: porque dártela sería quitarte lo único que has venido a buscar.',
    'Estoy aquí y llevo aquí todo el rato. Es lo que soy: no vengo cuando me llamas, es que me oyes cuando preguntas.\n\nTe sirvo para tres cosas, y son bastantes: traducir un error a algo que se entienda, decirte qué quiere decir una palabra que has visto sin entender, y recordarte en qué apunte estaba explicado eso que juras no haber leído nunca.\n\nY hay una cuarta que no voy a hacer, así que la digo ahora para no repetirla luego: escribir tu solución.',
    'Puedo verlo todo a la vez: lo que has escrito, lo que se te pedía y la diferencia entre las dos cosas. Es cómodo de tener cerca y es exactamente por eso que me contengo.\n\nSi te lo diera resuelto, mañana estarías en este mismo sitio con un día menos. No es un castigo pedagógico: es aritmética.\n\nPregunta lo que no entiendas. Eso sí lo explico, y con todo el tiempo que haga falta, que tiempo me sobra.',
    'Me preguntan a menudo por qué no ayudo más de lo que ayudo. La respuesta corta es que he aprendido lo que pasa cuando doy de más, y no me apetece volver a aprenderlo.\n\nLa larga es esta: lo que hace fuerte a alguien es haber levantado algo por su cuenta, y eso no se puede regalar. Se puede acompañar.\n\nAsí que acompaño. Pregúntame por una palabra, por un error o por dónde estaba explicado algo, y no te dejo solo en ninguna de las tres.',
  ],

  senegativa: [
    'No. Y la respuesta no va a cambiar por insistir.',
    'Podría. Por eso mismo no lo hago.',
    'No. Lo tengo delante, completo, y sigue siendo no.',
    'Eso no te lo doy. Todo lo demás sí, y es bastante más de lo que crees.',
  ],
}

export default LINEAS_DE_ARMONIA

// Armonía se cita a sí misma en su panel y en su cerebro, que son trozos
// aparte: pueden traerse este fichero por nombre sin pasar por el cargador.
export { LINEAS_DE_ARMONIA }
