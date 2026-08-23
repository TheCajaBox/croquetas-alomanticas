/**
 * Los lemas del retrato de la portada, por camino.
 *
 * Cortos y de los suyos: la portada enseña uno distinto cada vez que se entra,
 * porque leer siempre la misma frase debajo de la misma cara acaba siendo parte
 * del mueble y deja de leerse. Por eso hay de sobra en cada lista: cuantos más
 * haya, más tarda uno en volver a salir.
 *
 * Viven aparte de las voces porque se leen en un sitio donde nadie habla -la
 * entrada, antes de elegir camino- y porque son unas pocas líneas por
 * personaje: traerse el saco entero de frases de Wayne para pintar un lema
 * debajo de su cara sería pagar cuarenta veces lo que se usa.
 *
 * Van **debajo de una cara y en cursiva**, así que se escriben cortos: uno
 * largo rompe la portada, y hay una prueba que lo vigila.
 */

/** Los de Wayne: la broma primero y el consejo escondido detrás. */
export const LEMAS_DE_WAYNE = [
  'Yo no robo. Intercambio.',
  'Un sombrero prestado también es un sombrero.',
  'Nunca llevo pistola. Llevo conversación.',
  'Si sale mal, lo contamos de otra manera.',
  'El acento se cambia; las manías no.',
  'Wax dice muchas cosas. Yo digo las buenas.',
  'Todo se arregla hablando. Casi todo. Bueno, algunas cosas.',
  'Aquí se paga en croquetas, que es la única moneda seria.',
  'Le hablo al sombrero. Él me contesta menos.',
  'Investigo estados alternativos a la sobriedad.',
  'Consuélate: podría ser peor. Casi siempre puede.',
  'Si te sale a la primera, desconfía. Yo desconfío a la tercera.',
  'Yo no doy pistas: las vendo, que es más honrao.',
  'De los errores se aprende. Yo llevo unos cuatrocientos.',
  'Un paréntesis solo es un paréntesis triste.',
  'Léete el error entero: está siendo sincero contigo.',
  'No he perdido el sombrero. Anda investigando por su cuenta.',
]

/**
 * Los de Vin, para el retrato de la primera era.
 *
 * Ella no hace gracias: comprueba. Cuatro palabras y ya está dicho, que es
 * justo lo contrario de Wayne y por eso funciona tenerlos en el mismo juego.
 */
export const LEMAS_DE_VIN = [
  'No confíes en lo que no has probado.',
  'Si funciona a la primera, míralo otra vez.',
  'Nadie te va a dar nada. Cógelo.',
  'La ceniza cae igual para todos.',
  'Yo tampoco sabía. Aprendí.',
  'Lo que se sabe se hace. Lo demás se estudia.',
  'Falla pronto. Falla barato.',
  'No hay atajos. Hay caminos cortos que engañan.',
  'Menos palabras. Más pruebas.',
]

/**
 * Los de Brisa, que narra la primera era.
 *
 * Aplacador de oficio: habla mucho, se escucha con gusto y te está empujando el
 * ánimo mientras te lo cuenta. Nunca dice tres palabras si le caben nueve.
 */
export const LEMAS_DE_BRISA = [
  'Yo no te obligo a nada. Solo te lo pongo fácil.',
  'Hablar es gratis. Escuchar, no siempre.',
  'Todo el mundo quiere algo. Averigua qué, y ya está.',
  'Una buena explicación es media victoria. La otra media es tuya.',
  'Confía en mí, querido amigo. Es literalmente mi trabajo.',
  'Si hay que explicarlo dos veces, no estaba bien escrito.',
  'Nunca digo tres palabras si me caben nueve. Nunca.',
  'Un nombre malo cuesta más caro que un error.',
  'Se aprende hablando. Yo, sobre todo, hablando yo.',
]

/**
 * Los de Raoden, que narra Elantris: reparte trabajo en vez de consuelo.
 *
 * Van en la portada de su camino, debajo de su retrato, y dicen de qué va el
 * itinerario antes de entrar: que una consulta es un aon, que la base contesta
 * lo que le preguntas y no lo que querías preguntar, y que esto se aprende
 * trazando.
 */
export const LEMAS_DE_RAODEN = [
  'Un aon bien trazado hace algo. Una consulta también.',
  'La base nunca discute: contesta lo que le preguntas.',
  'Aquí no hace falta talento. Hace falta trazar y corregir.',
  'Pedir «todo» es pedir lo que todavía no existe.',
  'Aquí no se consuela a nadie: se reparte trabajo.',
  'Traza, mira lo que sale, corrige. El oficio entero.',
  'Una tabla vacía también es una respuesta.',
  'Nadie trazó bien un aon a la primera. Nadie.',
]

/** Los de Galladon, que aquí interrumpe: escéptico y con paciencia corta. */
export const LEMAS_DE_GALLADON = [
  'Una línea de más y el aon no hace nada. Nada de nada.',
  'Aquí todo el mundo tiene un plan. Pregúntame qué tal salen.',
  'Trázalo bien o no lo traces.',
  'En mi tierra a esto lo llamaríamos optimismo.',
  'Pruébala con la tabla vacía. Luego hablamos.',
  'Un campo nulo no es un cero. No lo ha sido nunca.',
  'Funciona con seis filas. Enhorabuena, supongo.',
  'Yo pregunto lo que va a romperse. Alguien tiene que.',
]

/** Los de Shai, que narra Sel: falsificadora, y buena. */
export const LEMAS_DE_SHAI = [
  'Todo lo que hay que verificar se puede falsificar.',
  'Nadie mira los sellos. Ese es el problema.',
  'No robo objetos. Robo el original.',
  'Si pasa la inspección, es verdad. Por ahora.',
  'Nunca he roto un cifrado. Nunca me ha hecho falta.',
  'La comodidad abre más puertas que ninguna llave.',
  'Falsificar es entender. No hay atajo.',
  'La puerta «solo para pruebas» sigue abierta. Siempre.',
]

/** Quién dice qué debajo de su retrato, por quien narre. */
export const LEMAS_POR_NARRADOR = {
  wayne: LEMAS_DE_WAYNE,
  vin: LEMAS_DE_VIN,
  brisa: LEMAS_DE_BRISA,
  raoden: LEMAS_DE_RAODEN,
  // Galladon no narra -interrumpe-, pero sus lemas se quedan: son buenos y
  // están escritos. Aquí no estorban a nadie.
  galladon: LEMAS_DE_GALLADON,
  shai: LEMAS_DE_SHAI,
}
