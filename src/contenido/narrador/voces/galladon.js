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
 *
 * Su humor es **el del escepticismo con paciencia**: la pregunta incómoda dicha
 * en voz baja, sin sarcasmo y sin subir el tono, y el contraste entre el
 * optimismo de Raoden y su lista de cosas que se van a romper. Se ríe de los
 * planes, de los datos de ejemplo y de sí mismo por seguir aquí; nunca de quien
 * pregunta.
 *
 * Y sus preguntas enseñan lo que no enseña ningún reto: las filas nulas, la
 * tabla que crece, el orden que nadie prometió y lo que cuesta una consulta.
 */
const LINEAS_DE_GALLADON = {
  presentacion: [
    'Galladon. Yo no voy a animarte: para eso ya está él. Yo voy a preguntarte qué pasa con esa consulta el día que la tabla tenga un millón de filas en vez de seis.',
    'Galladon. Él te dirá que se puede. Yo te preguntaré tres cosas, siempre las mismas: qué pasa cuando la tabla crezca, qué pasa cuando un campo venga vacío y qué pasa cuando el que la lea no seas tú.',
    'Galladon. Llevo aquí más tiempo que él y he visto más planes buenos irse al suelo, así que me toca la parte fea. Alguien tiene que preguntarla mientras todavía se puede arreglar.',
    'Soy Galladon. No vengo a animarte, sule: eso se le da mejor a él. Vengo a preguntarte lo que nadie quiere oír justo el día que todo funciona.',
  ],

  retoSuperado: [
    '¿Y con la tabla vacía? Funciona con seis filas, sule. Pruébala con ninguna.',
    'Bien. Ahora la pregunta fea: ¿qué devuelve eso si uno de esos campos viene a nulo?',
    'Funciona. ¿Funcionaría igual si las filas estuvieran en otro orden? Porque las bases no prometen ningún orden si tú no lo pides.',
    'Vale. ¿Y cuántas veces recorre la tabla para contestar eso? No hace falta que lo sepas hoy. Hace falta que te lo preguntes.',
    'Ha salido. ¿Ha salido porque la consulta está bien o porque los datos son pocos y amables?',
    'Sale. ¿Y si mañana alguien le añade una columna a esa tabla? ¿Sigue contestando lo mismo, o empieza a contestar más de lo que le has pedido?',
    'Correcto, sule. Ahora dime cuántas tablas está leyendo eso para darte una fila. Si no lo sabes, has escrito una consulta que no sabes lo que cuesta.',
  ],

  superadoSinPistas: [
    'Sin pistas. Entonces contéstame a una: ¿podrías explicársela a alguien que no la haya visto?',
    'A la primera. Eso o los datos te han hecho un favor. Averigua cuál de las dos.',
    'Sin pistas, vale. ¿La escribirías igual si en vez de seis filas hubiera un millón? Porque el que escribe una consulta y el que la sufre no siempre son la misma persona.',
    'Solo. Bien. Dime entonces qué haría esa consulta si le quitas la última línea. Si te sale de memoria, es tuya.',
  ],

  errorDeSintaxis: [
    'No te entiende. Fíjate en que no dice que esté mal: dice que no sabe leerlo. Son cosas distintas y se arreglan distinto.',
    'Una línea de más en el aon. Ni humo ni ruido: nada.',
    'No te entiende y encima te señala mal. ¿Sabes por qué? Porque se para donde deja de tener sentido, no donde empezó a perderlo. Mira una línea antes.',
    'Ni arranca. Es el error que menos daño hace y el único que se ve siempre. Los otros esperan escondidos, sule.',
  ],

  testFallado: [
    'Ha fallado. ¿Sabías que iba a fallar? Porque si no lo sabías, lo interesante no es el fallo.',
    'Antes de cambiar nada: dime qué filas esperabas. Si no lo sabes decir, la consulta no era el problema.',
    'No sale. Antes de tocarla: ¿seguro que los datos son los que crees? Yo he perdido tardes discutiendo con una tabla que estaba vacía.',
    'Falla. ¿Y falla siempre o solo con estas filas? Si no lo sabes, no sabes qué estás arreglando.',
    'No. Quítale condiciones hasta que devuelva algo y vuelve a ponerlas de una en una. Es lento y llega; lo otro es rápido y no llega.',
    'Ha fallado, sule. ¿Qué esperabas exactamente: cuántas filas y con qué columnas? Si no cabe en una frase, el problema no estaba en la consulta.',
    'No es. Y una cosa que conviene aprender pronto: un resultado vacío no es un error. Es una respuesta, y bastante clara.',
  ],

  requisitoIncumplido: [
    'Devuelve lo correcto por el camino corto. Y el camino corto es el que el mes que viene no se puede tocar.',
    'Cumple el resultado y no la forma. ¿Quién va a tocar esto cuando tú no estés? Porque alguien lo tocará, sule. Siempre lo toca alguien.',
    'Por el atajo. ¿Y qué pasa el día que el atajo se rompa? Nadie sabrá para qué estaba ahí, y eso cuesta más que hacerlo bien hoy.',
    'No es lo que pedía. Pregunta incómoda: ¿lo has hecho así porque es mejor o porque era lo único que se te ocurría? Las dos valen, pero conviene saber cuál.',
  ],

  entrarAlMundo: [
    'Antes de entrar: ¿esto para qué sirve fuera de aquí? Si no lo sabes todavía, apúntatelo y me lo dices al salir.',
    'Otro mundo. Yo pregunto lo de siempre: ¿qué se puede hacer aquí que no se pudiera antes?',
    'Un mundo nuevo. ¿Y qué vas a dejar de usar de lo que ya sabes? Nada. Eso es lo que nadie te cuenta al principio.',
    'Antes de entrar, sule: ¿qué crees que va a ser lo difícil? Apúntalo. Al salir lo comparas y te llevas una sorpresa.',
    'Otro sitio. Mi pregunta es siempre la misma: lo que vas a aprender aquí, ¿aguanta con muchos datos o solo con estos seis?',
    'Aquí se aprende algo nuevo, y con lo nuevo se rompen cosas viejas. Ve fijándote en cuáles.',
    'Entramos. Y ojo con la costumbre de probar solo el caso que sale bien: los datos amables engañan más que un enemigo.',
  ],

  jefeDerrotado: [
    'Ha caído el difícil. Mira qué le has traído de los retos de antes: eso es lo que ya no se te va a olvidar.',
    'Bien, sule. Ahora lo incómodo: ¿lo harías otra vez desde cero, sin mirar?',
    'Ha caído. ¿Cuánto de eso lo has pensado tú y cuánto lo has ido copiando de los retos de antes? La respuesta honrada suele ser la útil.',
    'Se acabó. La pregunta fea del final: si mañana te dieran la misma tabla con diez veces más filas, ¿tocarías algo de lo que has escrito?',
  ],

  charla: [
    'Él te dirá que se puede. Yo te digo que se puede **si lo compruebas**, que no es lo mismo.',
    'Una consulta que va rápido con seis filas no dice nada. Ninguna base de datos tiene seis filas.',
    'Yo llevo aquí más tiempo que él. Lo que he aprendido es que las cosas fallan por el sitio que nadie miró.',
    'Todo el mundo prueba su consulta con la tabla de ejemplo. Nadie la prueba con la de verdad hasta que ya es tarde.',
    'Una tabla sin índice es una calle sin números: la casa se encuentra igual, pero hay que llamar a todas las puertas.',
    'Un campo vacío no es un cero y no es una cadena vacía. Es «no lo sé», y con «no lo sé» no se puede sumar.',
    'Yo pregunto lo que va a fallar. Él dice que es pesimismo. Yo digo que es mantenimiento, y que alguien lo tiene que hacer.',
    'Aquí se dice que lo último que se pierde es la esperanza. En mi experiencia lo último que se pierde son los datos, y por eso conviene tratarlos con respeto.',
  ],

  mundoCompletado: [
    'Mundo cerrado. ¿Y ahora sabrías decir cuál de todos esos retos era el importante? Porque uno lo era.',
    'Cerrado. ¿Sabrías rehacer el más difícil sin mirar? Ahí se ve lo que te llevas puesto.',
    'Mundo terminado, sule. Una pregunta antes de irnos: ¿qué te ha salido bien a la primera? Eso es lo que ya no hace falta estudiar.',
    'Hecho. Y ahora lo incómodo: de todo lo que has escrito aquí, ¿qué aguantaría un millón de filas? Piénsalo por el camino.',
  ],
}

export default LINEAS_DE_GALLADON
