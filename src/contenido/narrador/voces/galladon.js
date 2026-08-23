/**
 * Galladon, que interrumpe.
 *
 * Ham pregunta *por qué funciona*. Galladon pregunta otra cosa, y hace la misma
 * falta: **qué pasa cuando no funcione**. Ha visto tres planes buenos irse al
 * suelo y no se le ha quitado; a cambio, cuando dice que algo va a aguantar, es
 * que va a aguantar.
 *
 * No es el gracioso amargado: es el que hace la pregunta que nadie quiere oír
 * justo cuando todavía se puede arreglar. Llama «sule» a quien le cae bien, y
 * eso incluye a quien está aprendiendo.
 */
const LINEAS_DE_GALLADON = {
  presentacion: [
    'Galladon. Yo no voy a animarte: para eso ya está él. Yo voy a preguntarte qué pasa con esa consulta el día que la tabla tenga un millón de filas en vez de seis.',
  ],

  retoSuperado: [
    '¿Y con la tabla vacía? Funciona con seis filas, sule. Pruébala con ninguna.',
    'Bien. Ahora la pregunta fea: ¿qué devuelve eso si uno de esos campos viene a nulo?',
    'Funciona. ¿Funcionaría igual si las filas estuvieran en otro orden? Porque las bases no prometen ningún orden si tú no lo pides.',
    'Vale. ¿Y cuántas veces recorre la tabla para contestar eso? No hace falta que lo sepas hoy. Hace falta que te lo preguntes.',
    'Ha salido. ¿Ha salido porque la consulta está bien o porque los datos son pocos y amables?',
  ],

  superadoSinPistas: [
    'Sin pistas. Entonces contéstame a una: ¿podrías explicársela a alguien que no la haya visto?',
    'A la primera. Eso o los datos te han hecho un favor. Averigua cuál de las dos.',
  ],

  errorDeSintaxis: [
    'No te entiende. Fíjate en que no dice que esté mal: dice que no sabe leerlo. Son cosas distintas y se arreglan distinto.',
    'Una línea de más en el aon. Ni humo ni ruido: nada.',
  ],

  testFallado: [
    'Ha fallado. ¿Sabías que iba a fallar? Porque si no lo sabías, lo interesante no es el fallo.',
    'Antes de cambiar nada: dime qué filas esperabas. Si no lo sabes decir, la consulta no era el problema.',
  ],

  requisitoIncumplido: [
    'Devuelve lo correcto por el camino corto. Y el camino corto es el que el mes que viene no se puede tocar.',
  ],

  entrarAlMundo: [
    'Antes de entrar: ¿esto para qué sirve fuera de aquí? Si no lo sabes todavía, apúntatelo y me lo dices al salir.',
    'Otro mundo. Yo pregunto lo de siempre: ¿qué se puede hacer aquí que no se pudiera antes?',
  ],

  jefeDerrotado: [
    'Ha caído el gordo. ¿Y qué has usado de todo lo anterior? Eso es lo que te has quedado de verdad.',
    'Bien, sule. Ahora lo incómodo: ¿lo harías otra vez desde cero, sin mirar?',
  ],

  charla: [
    'Él te dirá que se puede. Yo te digo que se puede **si lo compruebas**, que no es lo mismo.',
    'Una consulta que va rápido con seis filas no dice nada. Ninguna base de datos tiene seis filas.',
    'Yo llevo aquí más tiempo que él. Lo que he aprendido es que las cosas fallan por el sitio que nadie miró.',
  ],

  mundoCompletado: [
    'Mundo cerrado. ¿Y ahora sabrías decir cuál de todos esos retos era el importante? Porque uno lo era.',
  ],
}

export default LINEAS_DE_GALLADON
