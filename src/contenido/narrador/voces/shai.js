/**
 * Shai, que narra Sel.
 *
 * Falsificadora de almas, y buena: la mejor. Su oficio es hacer una copia que
 * pase por el original ante quien la mire con atención, y por eso sabe una cosa
 * que en seguridad es la única que importa de verdad: **todo lo que hay que
 * verificar se puede falsificar si nadie lo mira bien**.
 *
 * Su registro es **el del artesano orgulloso**: precisa, un poco vanidosa, y
 * sin una gota de moralina. No dice «esto está mal»; dice «esto lo paso yo en
 * dos minutos, y te voy a explicar cómo». Habla del atacante en primera
 * persona, porque es ella.
 *
 * Y no da lecciones de ética: da lecciones de oficio. El único juicio que
 * emite es sobre el trabajo mal hecho.
 */
const LINEAS_DE_SHAI = {
  // Como anfitriona de El sello, su mundo.
  presentacion: [
    'Shai. Falsifico almas, y no es un eufemismo. Empezamos por lo más fácil de falsificar que existe: una contraseña guardada como quien guarda la lista de la compra. Cuando acabes, la guardarás de otra manera.',
  ],

  bienvenida: [
    'Shai. Esto va a ser distinto de lo que hayas hecho antes: aquí el código que te doy funciona. Pasa sus pruebas, hace lo que promete y lo firmaría cualquiera. Y tiene un agujero. Tu trabajo es encontrarlo y taparlo, y los tests van a intentar colarse por él.',
    'Cien días para falsificar un alma. A ti te va a costar menos aprender a defender una, pero el oficio es el mismo: mirar lo que todo el mundo da por bueno y preguntarse quién lo comprueba.',
  ],

  entrarAlMundo: [
    'Sitio nuevo. Lo primero, como siempre: qué se está dando por bueno aquí sin comprobarlo.',
    'Aquí dentro hay algo que funciona y no debería. Vamos a encontrarlo, y luego vamos a arreglarlo sin romper lo que sí funcionaba.',
    'Antes de escribir nada, lee el código que te doy. Está bien escrito a propósito: si el agujero se viera, no habría nada que aprender.',
  ],

  primerIntento: [
    'Primer intento. Aquí los tests no comprueban que funcione: comprueban que no se pueda romper. Es otra cosa y se nota.',
    'Adelante. Y si pasa a la primera, mira el código otra vez: los agujeros que pasan a la primera son los que siguen ahí.',
  ],

  testFallado: [
    (contexto) =>
      `El ataque ha entrado: ${contexto.fallo ?? 'un test ha pasado por donde no debía'}. Eso es una buena noticia, porque lo ha hecho un test y no otra persona.`,
    'No ha aguantado. Mira qué entrada usa el test que falla: te está diciendo exactamente por dónde se cuela.',
    'Falla. Y falla en lo interesante: no en lo que el código hace, en lo que el código **permite**.',
  ],

  errorDeSintaxis: [
    (contexto) =>
      `No se entiende, línea ${contexto.linea ?? '?'}. Esto es lo de menos: un error que se ve es un error que se arregla.`,
    'No compila. Mejor así que un código que compila y deja entrar a cualquiera.',
  ],

  requisitoIncumplido: [
    'Falta una norma del reto, y en este camino las normas no son estética: son la diferencia entre parecer seguro y serlo.',
    'Te falta algo que el reto te pedía. Lee la lista: cada línea de ahí tapa un agujero distinto.',
  ],

  tiempoAgotado: [
    'Se ha quedado dando vueltas. Un sistema que no contesta también es un sistema caído, por cierto.',
    'Demasiado tiempo. Y ojo, que eso mismo es un ataque: hacer trabajar de más al que te atiende.',
  ],

  retoSuperado: [
    'Aguanta. Ese agujero ya no está.',
    'Hecho. Y fíjate en lo que ha cambiado: no hace nada nuevo, simplemente ya no se le puede pedir lo que no debe.',
    'Pasa. Buen trabajo, y lo digo yo, que vivo de que la gente lo haga mal.',
  ],

  superadoSinPistas: [
    'Sin pistas. Has visto el agujero tú sola, y eso es lo que se paga en mi oficio.',
    'A la primera y sin ayuda. Ahora ya no puedes desaprenderlo: vas a ver ese fallo en todas partes.',
  ],

  jefeDerrotado: [
    'El Sellador ha perdido. No le pasa a menudo.',
    'Cerrado. Ese sistema entero era una copia mala, y la has descubierto.',
  ],

  sinCroquetas: [
    'No te llega. Han ShuXen no fía: es militar, y los militares no fían.',
    'Sin croquetas no hay pista. Resuelve uno más fácil y vuelve, que las pistas no caducan.',
  ],

  inactividad: [
    'Sigues ahí. Sin prisa: mi trabajo también es mirar una cosa durante horas hasta que enseña la costura.',
    'Cuando no encuentres el agujero, cambia la pregunta: no «qué hace esto», sino «qué le puedo pedir yo a esto».',
  ],

  charla: [
    'Un sello mío pasa cualquier inspección menos una: la que compara con el original. Casi nadie compara con el original.',
    'La gente cree que forzamos las puertas. No: usamos las que están abiertas y nadie ha mirado.',
    'Nunca he necesitado romper un cifrado. He necesitado que alguien guarde la llave debajo del felpudo, y siempre la guarda.',
    'Lo más peligroso de un sistema no es lo que hace mal: es lo que hace bien y nadie sabe por qué.',
    'Falsificar es entender. No puedes copiar lo que no has entendido, y no puedes defender lo que no sabrías atacar.',
  ],

  mundoCompletado: [
    'Mundo cerrado. Un agujero menos de los que yo usaría.',
    'Terminado. Y ahora sabes algo incómodo: que el código que parece bien escrito y el código que está bien hecho no son lo mismo.',
  ],
}

export default LINEAS_DE_SHAI
