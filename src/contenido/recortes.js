/**
 * Recortes del Elendel Daily.
 *
 * Coleccionables secretos: no se buscan, se desbloquean solos al hacer cosas
 * concretas, casi todas cosas que le pasan a cualquiera que esté aprendiendo.
 * El titular es la broma; el consejo del pie, no: ahí va algo que sirve.
 *
 * La condición no se enseña nunca. Un secreto que viene con instrucciones no
 * es un secreto.
 */
export const RECORTES = [
  {
    id: 'primer-fallo',
    titular: 'UN HOMBRE PASA LA TARDE DISCUTIENDO CON UNA MÁQUINA',
    entradilla: 'Los vecinos aseguran haber oído razonamientos por ambas partes. La máquina no ha querido hacer declaraciones.',
    consejo:
      'Léete el mensaje de error entero, hasta el final. Casi siempre dice exactamente qué esperaba y qué ha recibido, y casi nadie lo lee más allá de la primera línea.',
  },
  {
    id: 'bucle-infinito',
    titular: 'EL TRANVÍA DE LA LÍNEA 4 LLEVA DOS DÍAS DANDO VUELTAS',
    entradilla: 'La compañía admite que nadie recuerda haberle puesto una última parada. Los pasajeros ya se conocen entre ellos.',
    consejo:
      'Todo bucle necesita dos cosas: una condición de salida y algo que haga que esa condición se cumpla algún día. Si te falta la segunda, la primera no sirve de nada.',
  },
  {
    id: 'error-de-sintaxis',
    titular: 'SE BUSCA: PARÉNTESIS DE CIERRE',
    entradilla: 'Visto por última vez en la línea 12. Su pareja lleva esperándolo desde ayer y empieza a preocuparse.',
    consejo:
      'Los símbolos van por parejas: (), [], {} y las comillas. Cuando el editor te marque una y no encuentres el fallo, mira la línea de ARRIBA: el error suele estar donde se abrió, no donde se ha notado.',
  },
  {
    id: 'tres-pistas',
    titular: 'UN CIUDADANO COMPRA TRES PISTAS Y SIGUE SIN SABER NADA',
    entradilla: 'El vendedor, un tal W., asegura que el producto se entregó en perfectas condiciones.',
    consejo:
      'Si has necesitado las tres pistas, el problema no era ese reto: era el concepto de antes. Vuelve al apunte de Wax y léelo entero. Es gratis y suele ser más rápido.',
  },
  {
    id: 'sin-tocar-nada',
    titular: 'EJECUTA EL PROGRAMA SIN MODIFICARLO Y SE SORPRENDE DEL RESULTADO',
    entradilla: 'Preguntado por lo ocurrido, declaró: «quería ver qué pasaba». Pasó lo que estaba escrito.',
    consejo:
      'Pues resulta que es buena costumbre. Ejecutar antes de tocar nada te enseña de qué punto partes, y cuando algo se rompa sabrás si lo has roto tú.',
  },
  {
    id: 'gato-al-limite',
    titular: 'LA PROTECTORA FELINA DE ELENDEL EMITE UN COMUNICADO',
    entradilla: 'En él se recuerda que los gatos comen todos los días, no solo los días en que uno se acuerda.',
    consejo:
      'En programación pasa igual con lo que abres: un temporizador, una conexión, un fichero. Si lo enciendes, apágalo. Lo que se queda encendido no avisa, solo va comiendo.',
  },
  {
    id: 'seis-sombreros',
    titular: 'OLA DE APARICIONES DE SOMBREROS EN ELENDEL',
    entradilla: 'La policía descarta el robo: en todos los casos el sombrero fue dejado, no sustraído. No hay sospechosos, pero sí una descripción.',
    consejo:
      'Ponles nombres a las cosas como si el que va a leerlas fueras tú dentro de seis meses, cansado y con prisa. Porque va a ser exactamente eso.',
  },
  {
    id: 'insistente',
    titular: 'TRAS SEIS INTENTOS, LO CONSIGUE',
    entradilla: 'Testigos presenciales afirman que en el quinto ya nadie daba nada por él.',
    consejo:
      'Cuando algo lleve veinte minutos resistiéndose, levántate. En serio. Vuelves y está resuelto, y nadie sabe explicar del todo por qué.',
  },
  {
    id: 'nocturno',
    titular: '¿QUIÉN ANDA DESPIERTO A ESTAS HORAS?',
    entradilla: 'La bruma cubre la ciudad. Solo quedan encendidas dos ventanas, y en una de ellas hay alguien programando.',
    consejo:
      'El código escrito de madrugada parece brillante de madrugada. Guárdalo, vete a dormir y léelo mañana antes de enseñárselo a nadie.',
  },
]

export const RECORTES_POR_ID = Object.fromEntries(RECORTES.map((r) => [r.id, r]))
