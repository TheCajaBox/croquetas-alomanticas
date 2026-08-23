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
 * Interrumpe **una de cada tres veces** que podría (ver `CADA_CUANTAS_INTERRUMPE`
 * en el almacén). En todas sería un pesado, y un pesado se cierra sin leer.
 */
const LINEAS_DE_HAM = {
  presentacion: [
    'Ham. Yo pego cuando hay que pegar, y el resto del tiempo pregunto cosas. Vas a ver que lo segundo molesta más.',
  ],

  retoSuperado: [
    'Funciona, vale. Pero ¿por qué funciona? Si no sabes contestar eso, no lo has resuelto: lo has acertado.',
    'Espera, espera. ¿Habrías sabido escribirlo si no te lo hubieran pedido así?',
    'Una pregunta y me callo: ¿qué línea de ahí es la que hace el trabajo de verdad? Las otras acompañan.',
    '¿Y si te lo pidieran mañana otra vez, con otros números? ¿Cambiarías algo o cambiarías todo?',
    'Ahí hay una parte que has escrito porque la entendías y otra que has escrito porque sonaba bien. ¿Sabes cuál es cuál?',
  ],

  superadoSinPistas: [
    'Sin ayuda. Entonces ya lo sabías, ¿o lo has deducido? No es lo mismo, y conviene saber de qué vas sobrado.',
    'A la primera. ¿Suerte o lo tenías claro? Contéstate en voz baja, que aquí nadie te va a corregir.',
  ],

  errorDeSintaxis: [
    'Se ha roto por un símbolo. ¿Y por qué el ordenador necesita ese símbolo y tú no? Piénsalo, que tiene su gracia.',
    'No lo entiende. Fíjate en que no dice que esté mal: dice que no sabe leerlo. Son dos cosas distintas.',
  ],

  testFallado: [
    'Ha fallado. ¿Sabías que iba a fallar? Porque si no lo sabías, lo interesante no es el fallo: es lo que creías tú.',
    'Antes de cambiar nada: ¿qué pensabas que iba a salir? Escríbelo por dentro y luego mira lo que ha salido.',
    'Está mal, sí. ¿Está mal la idea o está mal cómo la has escrito? Se arreglan de maneras muy distintas.',
  ],

  requisitoIncumplido: [
    'Funciona y no vale. ¿Por qué crees que el reto pide esa manera y no la tuya? Casi siempre hay un motivo.',
  ],

  entrarAlMundo: [
    'Antes de entrar: ¿para qué sirve esto que vas a aprender? Si no lo sabes todavía, apúntalo y pregúntatelo al salir.',
    'Yo siempre pregunto lo mismo al llegar a un sitio nuevo: ¿qué se puede hacer aquí que no se pudiera antes?',
  ],

  jefeDerrotado: [
    'Ha caído el gordo. ¿Y qué has usado de todo lo anterior? Eso es lo que te has quedado de verdad.',
    'Bien. Ahora la pregunta incómoda: ¿podrías volver a hacerlo desde cero, sin mirar?',
  ],

  charla: [
    'Una cosa que llevo pensando: si un programa hace lo correcto por el motivo equivocado, ¿está bien o está mal?',
    'Brisa dice que preguntar por qué es perder el tiempo. Brisa también dice que hablar es trabajar.',
    'Nadie sabe explicar del todo lo que entiende. Pero si no puedes explicarlo ni un poco, no lo entiendes.',
    '¿Por qué la gente copia código que no entiende y luego se sorprende de que se rompa? Lo pregunto en serio.',
    'Kelsier resuelve. Yo pregunto. Los dos hacemos falta, aunque él no lo diría así.',
  ],

  mundoCompletado: [
    (contexto) => `${contexto.mundo}, hecho. ¿Qué sabes hacer hoy que no supieras al entrar? Dilo en una frase; si no puedes, vuelve a mirarlo.`,
  ],
}

export default LINEAS_DE_HAM
