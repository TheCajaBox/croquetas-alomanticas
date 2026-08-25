/**
 * Recortes: coleccionables secretos, uno por cada cosa que le pasa a cualquiera
 * que esté aprendiendo.
 *
 * No se buscan, se desbloquean solos. El titular es la broma; **el consejo del
 * pie, no**: ahí va algo que sirve de verdad, y por eso es lo único que no
 * cambia de un camino a otro.
 *
 * La condición no se enseña nunca. Un secreto que viene con instrucciones no es
 * un secreto.
 *
 * ## Cuatro cabeceras, y no era un capricho
 *
 * Los nueve recortes eran del **Elendel Daily**, y se leen desde los cuatro
 * caminos: en Elantris te desbloqueabas un tranvía de la línea 4 en una ciudad
 * donde no hay tranvías, ni línea 4, ni periódico. Es el mismo fallo que tenían
 * los trastos y las insignias -material compartido que hablaba de un solo sitio-
 * y aquí se veía peor, porque el chiste es justo el sitio.
 *
 * Así que cada camino tiene su propia prensa, y cada prensa su forma de mentir:
 *
 * - **El Elendel Daily** (segunda era) es un periódico de verdad, con sucesos y
 *   vecinos que declaran cosas.
 * - **La circular del Cantón** (primera era) no informa: notifica. Todo está en
 *   orden, todo consta, y el ciudadano no necesita saber nada más.
 * - **El parte de la muralla** (Elantris) está escrito con tiza en una pared, lo
 *   firma quien pasaba por allí y no hay nada que se pueda comprobar.
 * - **El acta del consejo** (Sel) es la minuta de una reunión: puntos numerados,
 *   nadie se moja y todo queda registrado para no volver a mirarlo.
 *
 * `edicionesDe` resuelve la que toca. Un camino sin edición propia lee la de la
 * segunda era -mejor un chiste de otro sitio que ninguno-, pero eso no le pasa a
 * ninguno hoy y hay una prueba que lo mantiene así.
 */

/** Cómo se llama la prensa de cada camino, para la cabecera del papel. */
export const CABECERAS = {
  era2: 'Elendel Daily',
  era1: 'Cantón de Ortodoxia · circular',
  elantris: 'El parte de la muralla',
  sel: 'Consejo de arcanistas · acta',
}

export const RECORTES = [
  {
    id: 'primer-fallo',
    consejo:
      'Léete el mensaje de error entero, hasta el final. Casi siempre dice exactamente qué esperaba y qué ha recibido, y casi nadie lo lee más allá de la primera línea.',
    ediciones: {
      era2: {
        titular: 'UN HOMBRE PASA LA TARDE DISCUTIENDO CON UNA MÁQUINA',
        entradilla:
          'Los vecinos aseguran haber oído razonamientos por ambas partes. La máquina no ha querido hacer declaraciones.',
      },
      era1: {
        titular: 'SE NOTIFICA UNA DISCREPANCIA ENTRE LO ORDENADO Y LO OCURRIDO',
        entradilla:
          'La discrepancia ha sido registrada. No procede investigar quién ordenó qué, dado que lo ocurrido consta por escrito y lo ordenado también.',
      },
      elantris: {
        titular: 'ALGUIEN LLEVA UNA HORA DISCUTIENDO CON UNA PARED',
        entradilla:
          'La pared no contesta. Un testigo apunta que la pared nunca ha contestado y que eso no ha desanimado a nadie hasta ahora.',
      },
      sel: {
        titular: 'PUNTO PRIMERO: LA OBJECIÓN CONSTA POR ESCRITO',
        entradilla:
          'Se lee la objeción en voz alta hasta la mitad. La segunda mitad se da por leída, por economía de tiempo del consejo.',
      },
    },
  },
  {
    id: 'bucle-infinito',
    consejo:
      'Todo bucle necesita dos cosas: una condición de salida y algo que haga que esa condición se cumpla algún día. Si te falta la segunda, la primera no sirve de nada.',
    ediciones: {
      era2: {
        titular: 'EL TRANVÍA DE LA LÍNEA 4 LLEVA DOS DÍAS DANDO VUELTAS',
        entradilla:
          'La compañía admite que nadie recuerda haberle puesto una última parada. Los pasajeros ya se conocen entre ellos.',
      },
      era1: {
        titular: 'LA RONDA DE LA PLAZA CUARTA SE DECLARA PERMANENTE',
        entradilla:
          'Los guardias han recibido la orden de dar vueltas hasta nueva orden. No se ha previsto nueva orden. Se les agradece su constancia.',
      },
      elantris: {
        titular: 'UNA COLA QUE EMPIEZA DONDE ACABA',
        entradilla:
          'Nadie sabe por qué se hizo la cola ni qué se reparte al final. Los de delante dicen que llevan dos días y se les ve descansados.',
      },
      sel: {
        titular: 'PUNTO CUARTO: SE APLAZA EL APLAZAMIENTO',
        entradilla:
          'El consejo acuerda volver a reunirse para decidir cuándo dejar de reunirse. La fecha se fijará en la próxima reunión.',
      },
    },
  },
  {
    id: 'error-de-sintaxis',
    consejo:
      'Los símbolos van por parejas: (), [], {} y las comillas. Cuando el editor te marque una y no encuentres el fallo, mira la línea de ARRIBA: el error suele estar donde se abrió, no donde se ha notado.',
    ediciones: {
      era2: {
        titular: 'SE BUSCA: PARÉNTESIS DE CIERRE',
        entradilla:
          'Visto por última vez en la línea 12. Su pareja lleva esperándolo desde ayer y empieza a preocuparse.',
      },
      era1: {
        titular: 'SE REQUIERE LA PRESENCIA DEL SÍMBOLO QUE CIERRA',
        entradilla:
          'Su ausencia invalida el documento entero. Se recuerda que un expediente abierto no es un expediente: es una intención.',
      },
      elantris: {
        titular: 'FALTA UNA LÍNEA EN EL TRAZO DE LA PUERTA NORTE',
        entradilla:
          'El trazo está entero salvo por un lado. Lleva así desde antes de que llegara nadie y sigue sin hacer absolutamente nada.',
      },
      sel: {
        titular: 'PUNTO SEGUNDO: EL SELLO ESTÁ INCOMPLETO',
        entradilla:
          'Se hace constar que el sello incompleto no certifica nada, y que aun así lleva tres meses colgado en el pasillo.',
      },
    },
  },
  {
    id: 'tres-pistas',
    consejo:
      'Si has necesitado las tres pistas, el problema no era ese reto: era el concepto de antes. Vuelve al apunte del reto anterior y léelo entero. Es gratis y suele ser más rápido.',
    ediciones: {
      era2: {
        titular: 'UN CIUDADANO COMPRA TRES PISTAS Y SIGUE SIN SABER NADA',
        entradilla: 'El vendedor asegura que el producto se entregó en perfectas condiciones.',
      },
      era1: {
        titular: 'TRES CONSULTAS AL MISMO EXPEDIENTE EN UN SOLO DÍA',
        entradilla:
          'El archivo confirma que las tres se atendieron. Se sugiere al interesado consultar el expediente anterior, que es el que explica este.',
      },
      elantris: {
        titular: 'TRES FAVORES PEDIDOS Y NINGUNO DEVUELTO',
        entradilla:
          'Aquí los favores no se cobran, se apuntan. La que los apunta dice que no hay problema y luego se queda mirando un rato.',
      },
      sel: {
        titular: 'PUNTO SEXTO: TERCERA ACLARACIÓN SOBRE EL MISMO ASUNTO',
        entradilla:
          'El consejo observa que las tres aclaraciones eran correctas y que el asunto sigue sin entenderse. Se propone releer el asunto anterior.',
      },
    },
  },
  {
    id: 'sin-tocar-nada',
    consejo:
      'Pues resulta que es buena costumbre. Ejecutar antes de tocar nada te enseña de qué punto partes, y cuando algo se rompa sabrás si lo has roto tú.',
    ediciones: {
      era2: {
        titular: 'EJECUTA EL PROGRAMA SIN MODIFICARLO Y SE SORPRENDE DEL RESULTADO',
        entradilla:
          'Preguntado por lo ocurrido, declaró: «quería ver qué pasaba». Pasó lo que estaba escrito.',
      },
      era1: {
        titular: 'SE CUMPLE UNA ORDEN AL PIE DE LA LETRA Y OCURRE LO PREVISTO',
        entradilla:
          'La coincidencia entre lo previsto y lo ocurrido se considera excepcional y se archiva como ejemplo.',
      },
      elantris: {
        titular: 'PRUEBA EL TRAZO ANTES DE CAMBIARLO Y HACE LO DE SIEMPRE',
        entradilla:
          'Nadie lo felicita, porque nadie entiende qué esperaba. Él dice que ahora ya sabe de dónde parte, y tiene razón.',
      },
      sel: {
        titular: 'PUNTO TERCERO: SE ESTAMPA EL SELLO SIN RETOCARLO',
        entradilla:
          'El resultado coincide exactamente con el anterior. Se hace constar la coincidencia por si más adelante deja de coincidir.',
      },
    },
  },
  {
    id: 'gato-al-limite',
    consejo:
      'En programación pasa igual con lo que abres: un temporizador, una conexión, un fichero. Si lo enciendes, apágalo. Lo que se queda encendido no avisa, solo va comiendo.',
    ediciones: {
      era2: {
        titular: 'LA PROTECTORA FELINA DE ELENDEL EMITE UN COMUNICADO',
        entradilla:
          'En él se recuerda que los gatos comen todos los días, no solo los días en que uno se acuerda.',
      },
      era1: {
        titular: 'SE RECUERDA LA OBLIGACIÓN DE CERRAR LO QUE SE ABRE',
        entradilla:
          'Consta un almacén abierto desde hace nueve meses. Nadie lo ha denunciado y su contenido ha ido desapareciendo con toda normalidad.',
      },
      elantris: {
        titular: 'UN CANDIL ENCENDIDO TODA LA NOCHE Y SIN ACEITE AL AMANECER',
        entradilla:
          'Aquí el aceite es lo que no hay. Lo que se queda encendido no avisa de nada: simplemente, por la mañana ya no está.',
      },
      sel: {
        titular: 'PUNTO NOVENO: SIGUEN ABIERTOS CUATRO EXPEDIENTES DE HACE UN AÑO',
        entradilla:
          'No consta actividad en ninguno. Consta, eso sí, que cada uno ocupa una mesa y una lámpara desde entonces.',
      },
    },
  },
  {
    id: 'seis-sombreros',
    consejo:
      'Ponles nombres a las cosas como si el que va a leerlas fueras tú dentro de seis meses, cansado y con prisa. Porque va a ser exactamente eso.',
    ediciones: {
      era2: {
        titular: 'OLA DE APARICIONES DE SOMBREROS EN ELENDEL',
        entradilla:
          'La policía descarta el robo: en todos los casos el sombrero fue dejado, no sustraído. No hay sospechosos, pero sí una descripción.',
      },
      era1: {
        titular: 'APARECEN OBJETOS SIN DUEÑO Y CON NOMBRE ILEGIBLE',
        entradilla:
          'Cada uno lleva una etiqueta escrita por su propietario. Ninguna etiqueta permite averiguar quién es su propietario.',
      },
      elantris: {
        titular: 'CUATRO CAJAS MARCADAS «COSAS» EN EL ALMACÉN DEL FONDO',
        entradilla:
          'Las marcó alguien que ya sabía lo que había dentro. Ese alguien ya no está y las cajas siguen diciendo «cosas».',
      },
      sel: {
        titular: 'PUNTO SÉPTIMO: LOS LEGAJOS ESTÁN ROTULADOS «VARIOS»',
        entradilla:
          'Se acuerda no volver a rotular «varios». El acuerdo se archiva en el legajo rotulado «varios».',
      },
    },
  },
  {
    id: 'insistente',
    consejo:
      'Cuando algo lleve veinte minutos resistiéndose, levántate. En serio. Vuelves y está resuelto, y nadie sabe explicar del todo por qué.',
    ediciones: {
      era2: {
        titular: 'TRAS SEIS INTENTOS, LO CONSIGUE',
        entradilla: 'Testigos presenciales afirman que en el quinto ya nadie daba nada por él.',
      },
      era1: {
        titular: 'SE APRUEBA UNA SOLICITUD EN SU SEXTA PRESENTACIÓN',
        entradilla:
          'Las cinco anteriores eran idénticas. El archivo no encuentra explicación y no considera que le corresponda buscarla.',
      },
      elantris: {
        titular: 'SEIS INTENTOS Y A LA SEXTA SALE',
        entradilla:
          'Nadie aplaude. Aquí se cuenta hasta seis muy a menudo, y todo el mundo sabe que el sexto no era mejor que el quinto.',
      },
      sel: {
        titular: 'PUNTO OCTAVO: LA SEXTA PRUEBA RESULTA SATISFACTORIA',
        entradilla:
          'Las cinco primeras se conservan para su estudio. El estudio no se ha asignado a nadie.',
      },
    },
  },
  {
    id: 'nocturno',
    consejo:
      'El código escrito de madrugada parece brillante de madrugada. Guárdalo, vete a dormir y léelo mañana antes de enseñárselo a nadie.',
    ediciones: {
      era2: {
        titular: '¿QUIÉN ANDA DESPIERTO A ESTAS HORAS?',
        entradilla:
          'La bruma cubre la ciudad. Solo quedan encendidas dos ventanas, y en una de ellas hay alguien programando.',
      },
      era1: {
        titular: 'SE OBSERVA ACTIVIDAD NOCTURNA NO AUTORIZADA',
        entradilla:
          'La actividad consiste en escribir. Se ha decidido no intervenir: lo que se escribe de noche suele corregirse solo por la mañana.',
      },
      elantris: {
        titular: 'ALGUIEN SIGUE TRAZANDO CUANDO YA NO SE VE',
        entradilla:
          'A oscuras los trazos salen igual de convencidos y bastante peor. Por la mañana se ven, y por la mañana se borran.',
      },
      sel: {
        titular: 'PUNTO DÉCIMO: EL TRABAJO SE ENTREGÓ DE MADRUGADA',
        entradilla:
          'Se hace constar la hora. Se hace constar también que el consejo lo revisó a plena luz y tuvo bastante que decir.',
      },
    },
  },
]

export const RECORTES_POR_ID = Object.fromEntries(RECORTES.map((r) => [r.id, r]))

/**
 * El recorte tal y como lo lee un camino: su titular, su entradilla y la
 * cabecera de su prensa. El consejo es el mismo en los cuatro, que es lo único
 * de esto que sirve para algo.
 */
export function recorteDe(id, itinerarioId) {
  const recorte = RECORTES_POR_ID[id]
  if (!recorte) return null
  const edicion = recorte.ediciones[itinerarioId] ?? recorte.ediciones.era2
  return {
    ...recorte,
    ...edicion,
    cabecera: CABECERAS[itinerarioId] ?? CABECERAS.era2,
  }
}
