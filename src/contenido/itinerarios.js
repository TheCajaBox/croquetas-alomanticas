/**
 * Los itinerarios: caminos de aprendizaje completos, cada uno con su materia.
 *
 * Un itinerario es un juego entero dentro del juego: sus mundos, su temario, su
 * reparto y lo que se ejecuta al enviar código. Se eligen en la entrada y no
 * compiten entre ellos —no hay que terminar uno para empezar otro— porque
 * enseñan cosas distintas, y a nadie hay que obligarle a aprender JavaScript
 * para poder aprender SQL.
 *
 * Lo que **sí** comparten, y a propósito: las croquetas, los gatos que tengas,
 * sus bonos, los sombreros, los recortes y las insignias. Lo ganaste tú, no lo
 * ganó un camino. Es un solo juego con varios temarios, no cuatro juegos que se
 * instalan aparte.
 *
 * Lo que **no** comparten son los **sitios**: la casa de los gatos, el refugio
 * y la sombrerera son de Elendel, y en la Luthadel de la primera era no existen
 * -ni existirán en Elantris ni en Sel-. Los declara cada itinerario en
 * `sitios`, y los que no los tienen ni los enseñan en la barra ni dejan entrar
 * escribiendo la dirección a mano. Los gatos siguen dándote sus bonos mientras
 * juegas en cualquier camino: lo que no hay es una casa a la que ir a verlos.
 *
 * ## Los campos que deciden cosas
 *
 * - `materia` es lo que se aprende, y es lo que se lee en la tarjeta.
 * - `lenguajes` es con qué se **ejecuta** el código del jugador (ver
 *   `motor/protocolo.js`). Casi siempre es uno; seguridad usa dos, porque una
 *   inyección de SQL no se entiende sin una base de datos delante.
 * - `sitios` son las pantallas del itinerario que no son mundos: la casa de los
 *   gatos, el refugio y la sombrerera. Vacío significa que ese camino no tiene
 *   ninguna, y entonces no salen en la barra ni se puede entrar a mano.
 * - `reparto` es quién habla y para qué. No es adorno: de aquí sale quién
 *   narra, quién escribe los apuntes de cada parte, quién vende las pistas y
 *   quién contesta dudas. Un itinerario con el reparto mal puesto suena a otro.
 */
export const ITINERARIOS = [
  {
    id: 'era2',
    nombre: 'La segunda era',
    materia: 'JavaScript y Vue',
    etiquetaLenguaje: 'JavaScript · Vue',
    // El de la etiqueta lleva un punto medio y no se puede meter en una frase.
    lenguajeEnFrase: 'JavaScript y Vue',
    lenguajes: ['js'],
    // Elendel: la casa de la colonia, el refugio de donde salen los gatos y la
    // sombrerera. Los sombreros escondidos también son de aquí.
    sitios: ['colonia', 'refugio', 'sombrerera'],
    retrato: 'wayne',
    color: '#c98b4b',
    resumen:
      'Del primer «qué es una variable» a montar una aplicación entera de Vue, pasando por lo que rodea al lenguaje.',
    promesa: 'Al salir sabrás escribir JavaScript moderno y montar interfaces con Vue 2 y Vue 3.',
    ambiente: 'Elendel, los Áridos y el ferrocarril. Narra Wayne, y cobra por las pistas.',
    presentacion:
      'Wayne lo cuenta todo, se ríe de lo que haces y te vende pistas a precio de amigo. Wax escribe los apuntes, Steris traduce los errores que asustan, Marasi te revisa el código y Armonía contesta dudas sin darte nunca la solución.',
    reparto: {
      narra: 'wayne',
      pistas: 'wayne',
      apuntes: ['wax'],
      glosario: 'steris',
      revisa: 'marasi',
      ayuda: 'armonia',
      refactor: 'melaan',
    },
  },
  {
    id: 'era1',
    nombre: 'La primera era',
    materia: 'PHP',
    etiquetaLenguaje: 'PHP',
    lenguajeEnFrase: 'PHP',
    lenguajes: ['php'],
    retrato: 'brisa',
    color: '#a8a2bd',
    resumen:
      'PHP desde cero: lo que mueve media web y casi nadie enseña con orden. Del primer echo a las clases.',
    promesa: 'Al salir sabrás escribir PHP moderno y estructurar un programa en clases.',
    ambiente: 'Ceniza, bruma y una tripulación que no se fía de nadie. Narra Brisa, y le interrumpen.',
    presentacion:
      'Brisa lo cuenta con bastantes más palabras de las necesarias y Ham le interrumpe para preguntar por qué. Kelsier explica la primera mitad; cuando ya no está, la segunda la explican Elend y Vin. Sazed lleva el glosario y contesta dudas —lo sabe todo y aun así no te da la solución— y las pistas las vende Fantasma.',
    reparto: {
      narra: 'brisa',
      interrumpe: 'ham',
      pistas: 'fantasma',
      // Dos mitades y dos maestros: Kelsier empieza y no llega al final. Que el
      // temario cambie de manos a mitad de camino no es un adorno, es la
      // historia que se está contando por debajo.
      apuntes: ['kelsier', 'elend', 'vin'],
      apuntesPorParte: { primera: ['kelsier'], segunda: ['elend', 'vin'] },
      glosario: 'sazed',
      revisa: 'brisa',
      ayuda: 'sazed',
      refactor: 'tensoon',
    },
  },
  {
    id: 'elantris',
    nombre: 'Elantris',
    materia: 'SQL',
    etiquetaLenguaje: 'SQL',
    lenguajeEnFrase: 'SQL',
    lenguajes: ['sql'],
    retrato: null,
    color: '#c9d8e4',
    resumen:
      'Preguntar bien a los datos: consultas, uniones, agrupaciones e índices. Un aon mal trazado no hace nada; una consulta mal escrita, tampoco.',
    promesa:
      'Al salir sabrás sacar de una base de datos exactamente lo que necesitas, y saber por qué tarda.',
    ambiente: 'La ciudad de los aones, donde una línea de más lo cambia todo. Narra Galladon.',
    presentacion:
      'Un aon es una figura que, trazada bien, hace algo, y trazada mal no hace nada. Una consulta es exactamente eso. Raoden lo explica con paciencia, Galladon lo cuenta con bastante menos, Sarene te revisa lo que escribes, Adien lleva el glosario porque se acuerda de todo, y las pistas las trae Karata.',
    reparto: {
      narra: 'galladon',
      pistas: 'karata',
      apuntes: ['raoden'],
      glosario: 'adien',
      revisa: 'sarene',
      ayuda: 'raoden',
      jefes: 'hrathen',
    },
  },
  {
    id: 'sel',
    nombre: 'El alma del emperador',
    materia: 'Ciberseguridad',
    etiquetaLenguaje: 'Seguridad',
    lenguajeEnFrase: 'código que hay que romper y luego arreglar',
    // Dos lenguajes porque una inyección no se entiende sin la base de datos
    // recibiéndola de verdad.
    lenguajes: ['js', 'sql'],
    retrato: null,
    color: '#c46a5a',
    resumen:
      'Falsificar es entender. Sellos que no deberían pasar la inspección, inyecciones, contraseñas mal guardadas y sesiones que se roban.',
    promesa: 'Al salir sabrás encontrar el agujero antes que quien iba a entrar por él, y taparlo.',
    ambiente: 'Cien días para falsificar un alma. Narra Shai, que de esto sabe porque vive de ello.',
    presentacion:
      'Shai falsifica almas, así que sabe una cosa que aquí importa mucho: todo lo que hay que verificar se puede falsificar si nadie lo mira bien. Ella lo cuenta, Gaotona escribe los apuntes y te revisa el trabajo —quiere aprender de verdad—, el Sellador de sangre pone los jefes y las pistas las suelta Han ShuXen, que ha visto caer murallas por menos.',
    reparto: {
      narra: 'shai',
      pistas: 'hanshuxen',
      apuntes: ['gaotona'],
      glosario: 'gaotona',
      revisa: 'gaotona',
      ayuda: 'shai',
      jefes: 'sellador',
    },
  },
]

export const ITINERARIOS_POR_ID = Object.fromEntries(ITINERARIOS.map((cada) => [cada.id, cada]))

/** El itinerario por defecto: el que se ofrece primero y el de quien llega de nuevas. */
export const ITINERARIO_POR_DEFECTO = ITINERARIOS[0].id

/**
 * El reparto que le toca a un mundo.
 *
 * Lo preguntan el panel de pistas, el narrador y el repaso: sin esto, cada uno
 * tenía escrito «Wayne» a mano y La Ceniza -que es de Brisa y de Fantasma-
 * sonaba a la segunda era.
 */
/**
 * Quién escribe los apuntes de un mundo.
 *
 * Casi siempre es uno para todo el itinerario -Wax en la segunda era-, pero la
 * primera cambia de manos a mitad de camino: Kelsier explica la primera parte y
 * cuando ya no está, la segunda la explican Elend y Vin. Eso no es un adorno, es
 * la historia que se cuenta por debajo, así que el mundo dice de qué parte es
 * con su campo `parte` y aquí se traduce a quién firma.
 */
export function quienEscribeElApunte(mundo) {
  // Un mundo puede decir quién firma los suyos, y hay dos que lo dicen: el de
  // refactor lo lleva TenSoon y el final lo explica Vin. Sin esto, el panel
  // anunciaba a Elend encima de un apunte escrito con otra voz, que es la misma
  // clase de mentira que los `quien="marasi"` de las plantillas.
  if (mundo?.apunte) return mundo.apunte
  const reparto = repartoDelMundo(mundo)
  const deSuParte = reparto.apuntesPorParte?.[mundo?.parte ?? 'primera']
  return deSuParte?.[0] ?? reparto.apuntes?.[0] ?? 'wax'
}

/**
 * Quién lleva el repaso de un mundo.
 *
 * Lo dice el propio repaso cuando lo declara, y si no, quien revise en ese
 * itinerario (`reparto.revisa`). Nueve de los once repasos no declaran nada
 * porque son de la segunda era y allí revisa Marasi siempre; declararlo once
 * veces sería repetir el reparto a mano.
 *
 * Estaba resuelto en tres sitios y de dos maneras distintas -«marasi» escrito
 * en la tarjeta del mundo, un `?? 'marasi'` en la vista del repaso y una tabla
 * de dos nombres al lado-, así que la tarjeta anunciaba a Marasi en mundos donde
 * pregunta otro. Una regla y un solo sitio.
 */
export function quienRepasa(repaso, mundo) {
  return repaso?.quien ?? repartoDelMundo(mundo).revisa
}

/**
 * Si un itinerario tiene ese sitio.
 *
 * Se pregunta desde la barra -para no ofrecer una puerta que no lleva a
 * ninguna parte- y desde el enrutador, para que escribir la dirección a mano
 * tampoco entre. Un itinerario sin `sitios` no tiene ninguno: se responde que
 * no, no se cae al de por defecto. Caerse al de por defecto es justo lo que
 * hacía que la casa de los gatos apareciera en la primera era.
 */
export function itinerarioTieneSitio(itinerarioId, sitio) {
  return (ITINERARIOS_POR_ID[itinerarioId]?.sitios ?? []).includes(sitio)
}

/**
 * El camino donde vive un sitio, para poder señalarlo desde fuera.
 *
 * La entrada -que es la puerta de los cuatro caminos y no está dentro de
 * ninguno- enseña la colonia que tengas, porque los gatos son tuyos en todos.
 * Lo que no puede hacer es enlazar a una casa a la que desde ahí no se entra,
 * así que enlaza al camino donde la casa está. Un enlace que lleva a algo.
 */
export function itinerarioDelSitio(sitio) {
  return ITINERARIOS.find((cada) => (cada.sitios ?? []).includes(sitio)) ?? null
}

/** Todos los sitios que existen en algún camino, para poder vigilarlos. */
export const SITIOS = [...new Set(ITINERARIOS.flatMap((cada) => cada.sitios ?? []))]

export function repartoDelMundo(mundo) {
  const itinerario = ITINERARIOS_POR_ID[mundo?.itinerario]
  return itinerario?.reparto ?? ITINERARIOS_POR_ID[ITINERARIO_POR_DEFECTO].reparto
}

