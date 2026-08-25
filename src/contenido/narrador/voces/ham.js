/**
 * Lo que dice Ham cuando interrumpe.
 *
 * Ham es el músculo de la banda y hace preguntas filosóficas que nadie quiere
 * contestar. Brisa se desespera con él, Kelsier le sigue el juego a ratos, y
 * todos acaban pensando en lo que ha preguntado.
 *
 * Aquí hace exactamente eso, y por eso está en el juego: **pregunta por qué**.
 * Brisa cuenta lo que ha pasado; Ham pregunta la razón. Que un test pase no es
 * lo mismo que entender por qué pasa, y esa distancia es la que separa copiar
 * de aprender. Sus frases son preguntas de verdad -no hay que contestarlas por
 * escrito ni dan croquetas- y por eso no llevan respuesta: la respuesta la
 * pones tú, para ti, mirando lo que acabas de escribir.
 *
 * Su humor es **el de la pregunta incómoda en el peor momento**: llega justo al
 * ver el verde, se disculpa a medias y pregunta de todas formas. Nunca hay burla
 * en la pregunta -eso sería reírse de quien aprende, que es lo único prohibido-;
 * la gracia está en el momento y en que él sabe perfectamente que molesta.
 *
 * Interrumpe **una de cada tres veces** que podría (ver `CADA_CUANTAS_INTERRUMPE`
 * en el almacén). En todas sería un pesado, y un pesado se cierra sin leer.
 */
const LINEAS_DE_HAM = {
  presentacion: [
    'Ham. Yo pego cuando hay que pegar, y el resto del tiempo pregunto cosas. Vas a ver que lo segundo molesta más.',
    'Ham. Soy el que reparte los golpes y, en los ratos libres, el que pregunta por qué. Brisa dice que lo segundo hace más daño.',
    'Ham. No te voy a explicar nada: para eso está él, que además cobra en palabras. Yo pregunto y luego me callo. Lo de callarme es negociable.',
    'Me llamo Ham. Aviso de una vez: mis preguntas no tienen respuesta correcta y no dan croquetas. Contéstalas para ti, que es donde sirven.',
  ],

  retoSuperado: [
    'Funciona, vale. Pero ¿por qué funciona? Si no sabes contestar eso, no lo has resuelto: lo has acertado.',
    'Espera, espera. ¿Habrías sabido escribirlo si no te lo hubieran pedido así?',
    'Una pregunta y me callo: ¿qué línea de ahí es la que hace el trabajo de verdad? Las otras acompañan.',
    '¿Y si te lo pidieran mañana otra vez, con otros números? ¿Cambiarías algo o cambiarías todo?',
    'Ahí hay una parte que has escrito porque la entendías y otra que has escrito porque sonaba bien. ¿Sabes cuál es cuál?',
    'Bien. ¿Y cuál de esas líneas borrarías si te obligaran a borrar una? Fíjate: la que más te duele borrar es la que hace el trabajo.',
    'Pasa. Pregunta tonta: ¿lo entenderías si lo hubiera escrito otro? Porque dentro de un mes lo habrá escrito otro, y ese otro eres tú.',
  ],

  superadoSinPistas: [
    'Sin ayuda. Entonces ya lo sabías, ¿o lo has deducido? No es lo mismo, y conviene saber de qué vas sobrado.',
    'A la primera. ¿Suerte o lo tenías claro? Contéstate en voz baja, que aquí nadie te va a corregir.',
    'Ni una pista. ¿Sabrías decir en qué momento se te ocurrió? Ese momento es lo que hay que aprender a repetir; el resultado ya está hecho.',
    'Solo y a la primera. Pues contéstame a esto: ¿qué habrías mirado primero si no te hubiera salido? Tenerlo pensado de antemano ahorra tardes enteras.',
  ],

  errorDeSintaxis: [
    'Se ha roto por un símbolo. ¿Y por qué el ordenador necesita ese símbolo y tú no? Piénsalo, que tiene su gracia.',
    'No lo entiende. Fíjate en que no dice que esté mal: dice que no sabe leerlo. Son dos cosas distintas.',
    '¿Por qué crees que se para justo ahí y no donde de verdad está el problema? Contéstate eso una vez y te sirve para todos los demás.',
    'Un símbolo. ¿Y por qué siempre es uno de los que van en pareja? Cuenta las parejas, verás qué rápido aparece.',
  ],

  testFallado: [
    'Ha fallado. ¿Sabías que iba a fallar? Porque si no lo sabías, lo interesante no es el fallo: es lo que creías tú.',
    'Antes de cambiar nada: ¿qué pensabas que iba a salir? Escríbelo por dentro y luego mira lo que ha salido.',
    'Está mal, sí. ¿Está mal la idea o está mal cómo la has escrito? Se arreglan de maneras muy distintas.',
    '¿Qué te dice ese mensaje que no supieras ya? Léelo hasta encontrar una palabra que no esperabas; ahí está el asunto.',
    'Ha fallado. ¿Y qué pasaría si el reto pidiera justo lo contrario? Lo pregunto en serio: por ahí se ve el error más veces de las que parece.',
    'Vale, no. ¿Estás arreglando lo que tú has entendido o lo que dice el mensaje? Suelen ser dos cosas y solo una es la verdad.',
    'Falla. ¿Cuántas cosas has cambiado desde el intento anterior? Si son más de una, ya no sabes cuál era.',
  ],

  requisitoIncumplido: [
    'Funciona y no vale. ¿Por qué crees que el reto pide esa manera y no la tuya? Casi siempre hay un motivo.',
    'Funciona por otro camino. ¿Y si dentro de tres retos hay que ampliarlo? ¿Aguanta el tuyo o aguanta el que te pedían?',
    'No cumple. ¿No habías leído la norma, o la has leído y te ha parecido una tontería? Las dos cosas pasan y se arreglan distinto.',
    'Te has salido de lo que pedía. ¿Sabrías escribirlo de la otra manera si te obligaran? Porque si no, no era un atajo: era la única puerta que ves.',
  ],

  entrarAlMundo: [
    'Antes de entrar: ¿para qué sirve esto que vas a aprender? Si no lo sabes todavía, apúntalo y pregúntatelo al salir.',
    'Yo siempre pregunto lo mismo al llegar a un sitio nuevo: ¿qué se puede hacer aquí que no se pudiera antes?',
    'Mundo nuevo. ¿Qué crees que va a ser lo difícil? Apúntalo y compáralo al salir; casi nunca se acierta, y eso enseña más que acertar.',
    'Antes de empezar: ¿esto lo vas a aprender para saberlo o para usarlo? No es lo mismo y no se estudia igual.',
    'Otro sitio. Va la mía: si al terminar tuvieras que explicárselo a alguien en cinco minutos, ¿por dónde empezarías? Piénsalo mientras juegas.',
    'Aquí llegamos todos igual, sin saber. La diferencia está en si preguntas por qué o te lo aprendes de memoria y sigues corriendo.',
    'Un mundo más. ¿Te acuerdas de lo del anterior? No hace falta que me contestes a mí; hace falta que te contestes tú.',
  ],

  jefeDerrotado: [
    'Ha caído el gordo. ¿Y qué has usado de todo lo anterior? Eso es lo que te has quedado de verdad.',
    'Bien. Ahora la pregunta incómoda: ¿podrías volver a hacerlo desde cero, sin mirar?',
    'Ha caído. ¿En qué momento has sabido que iba a salir? Ese momento es el que hay que buscar la próxima vez.',
    'Se acabó. Y la de siempre: ¿lo has resuelto o lo has acertado? Te lo pregunto porque solo tú lo sabes.',
  ],

  charla: [
    'Una cosa que llevo pensando: si un programa hace lo correcto por el motivo equivocado, ¿está bien o está mal?',
    'Brisa dice que preguntar por qué es perder el tiempo. Brisa también dice que hablar es trabajar.',
    'Nadie sabe explicar del todo lo que entiende. Pero si no puedes explicarlo ni un poco, no lo entiendes.',
    '¿Por qué la gente copia código que no entiende y luego se sorprende de que se rompa? Lo pregunto en serio.',
    'Kelsier resuelve. Yo pregunto. Los dos hacemos falta, aunque él no lo diría así.',
    'Llevo días con esta: si nadie lee un código, ¿está bien escrito o solamente está escrito?',
    'Otra que no le gusta a nadie: cuando copias algo que funciona y lo pegas, ¿qué has aprendido exactamente? Yo creo que a pegar.',
    'Se puede saber hacer algo sin entenderlo. Yo aprendí a pelear así, y arreglarlo después me costó años.',
  ],

  mundoCompletado: [
    (contexto) => `${contexto.mundo}, hecho. ¿Qué sabes hacer hoy que no supieras al entrar? Dilo en una frase; si no puedes, vuelve a mirarlo.`,
    (contexto) => `Se acabó ${contexto.mundo}. ¿Qué reto de ahí te ha costado más? Ese es el que hay que volver a mirar, no el que salió a la primera.`,
    (contexto) => `${contexto.mundo}, cerrado. De todo lo de dentro, ¿qué usarías mañana si te pusieran a trabajar? Contéstate y ya sabes qué repasar.`,
    'Mundo terminado. Pregunta de las mías: ¿lo has terminado o lo has atravesado? No es lo mismo, y solo lo sabes tú.',
  ],
}

export default LINEAS_DE_HAM
