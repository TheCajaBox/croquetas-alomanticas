import { GATOS } from './gatos.js'
import { ITINERARIOS_POR_ID, ITINERARIO_POR_DEFECTO } from './itinerarios.js'
import { MUNDOS } from './mundos.js'
import { nombreDe } from './personajes.js'
import { RECORTES } from './recortes.js'
import { RETOS } from './retos/index.js'
import { SOMBREROS } from './sombreros.js'

/**
 * Las insignias que apunta quien revise en tu camino.
 *
 * ## Por qué no dan croquetas
 *
 * Por lo mismo que no las dan sus revisiones de código, y merece la pena
 * escribirlo otra vez porque es la decisión que sostiene todo esto: **pagar por
 * ellas las convertiría en requisitos**. En cuanto una insignia da croquetas
 * deja de ser un reconocimiento y pasa a ser una tarea pendiente, y entonces no
 * hacerla se siente como perder algo.
 *
 * Aquí son lo contrario: nadie las pide, no aparecen en ninguna lista de cosas
 * por hacer, y quien no se entere de que existen jugará exactamente igual. La
 * economía tampoco se mueve, que era el otro requisito -las croquetas por reto
 * se acaban de calibrar y no se tocan-.
 *
 * ## Cómo se eligen
 *
 * Cada una tiene que premiar algo que **ya estabas haciendo bien**, no algo que
 * haya que ir a buscar. Ninguna dice «juega veinte días seguidos» ni «entra a
 * las tres de la mañana»: eso es tirar del jugador, y este juego no va de eso.
 *
 * `cumple` recibe los almacenes ya leídos y devuelve un booleano. Se comprueban
 * al superar un reto y al terminar un repaso, que es cuando puede cambiar algo.
 *
 * ## Los huecos, y por qué no se quitaron los nombres
 *
 * Cinco de estos textos nombraban a Wayne o a Marasi, y las insignias se ganan
 * en cualquier camino y se leen en el cajón, que no pertenece a ninguno: en la
 * primera era anunciaban a gente que no está allí.
 *
 * La salida fácil era quitar los nombres y dejar «quien vende las pistas», y es
 * peor: la mitad de la gracia de una insignia es que alguien concreto opine de
 * ti. Así que llevan huecos -`{pistas}`, `{revisa}`, `{narra}`- y los rellena el
 * reparto del camino donde estés. En la primera era, «el puesto de Fantasma es
 * decorativo».
 *
 * ## Y los números tampoco se escriben a mano
 *
 * Por lo mismo, y esto se descubrió tarde: estas frases decían «los noventa
 * retos» cuando ya había más de trescientos, «los nueve finales» con veintisiete
 * mundos declarados y «los catorce sombreros» con quince escondidos. Nadie
 * miente a propósito -el contenido creció y el texto se quedó donde estaba-,
 * pero el efecto es el mismo: la insignia que se gana por terminarlo todo
 * anunciaba una décima parte del juego.
 *
 * Así que los números van en huecos igual que los nombres -`{retos}`,
 * `{mundos}`, `{sombreros}`, `{recortes}`, `{gatos}`- y los rellenan los propios
 * corpus al leerlos. Escribir la cifra a mano es lo único que hay que no hacer,
 * y hay una prueba que la caza.
 */

/**
 * Las cuentas del juego, leídas de donde viven.
 *
 * No cuesta nada de paquete: los cinco corpus ya viajan en el arranque -la
 * portada cuenta mundos y retos, la barra lleva los sombreros y los recortes, y
 * los gatos dan sus bonos jugando en cualquier camino-.
 */
const CUENTAS = {
  retos: () => RETOS.length,
  mundos: () => MUNDOS.length,
  sombreros: () => SOMBREROS.length,
  recortes: () => RECORTES.length,
  gatos: () => GATOS.length,
}
export const INSIGNIAS = [
  {
    id: 'primer-mundo',
    nombre: 'Primer día resuelto',
    porque: 'Terminaste tu primer mundo entero. Lo demás es esto mismo, más veces.',
    cumple: ({ progreso }) => progreso.mundosCompletados >= 1,
  },
  {
    id: 'medio-camino',
    // Se llamaba «A mitad de la cuesta» cuando el juego entero eran noventa
    // retos. Ahora cuarenta y cinco no son la mitad de nada -son la mitad de un
    // camino corto-, y lo que sigue siendo verdad es la frase, no la fracción.
    nombre: 'Cuarenta y cinco',
    porque: 'Cuarenta y cinco retos resueltos. Ya no estás aprendiendo a programar: estás programando.',
    cumple: ({ progreso }) => progreso.retosSuperados >= 45,
  },
  {
    id: 'todo-el-camino',
    nombre: 'La línea entera',
    porque:
      'Los {retos} retos, los de los cuatro caminos. No queda nada de este juego que no hayas resuelto, y eso incluye lo que casi nadie termina.',
    cumple: ({ progreso, totalDeRetos }) => progreso.retosSuperados >= totalDeRetos,
  },
  {
    id: 'sin-preguntar',
    nombre: 'Sin preguntarle a nadie',
    porque: 'Un mundo entero sin comprar una sola pista. Quien las vende lo lleva peor que tú.',
    cumple: ({ mundosSinPistas }) => mundosSinPistas >= 1,
  },
  {
    id: 'racha-de-diez',
    nombre: 'Diez de seguido',
    porque: 'Diez retos encadenados sin pedir una pista. Eso ya no es suerte.',
    cumple: ({ progreso }) => progreso.mejorRacha >= 10,
  },
  {
    id: 'racha-de-veinte',
    nombre: 'Veinte de seguido',
    porque: 'Veinte. A estas alturas el puesto de {pistas} es decorativo.',
    cumple: ({ progreso }) => progreso.mejorRacha >= 20,
  },
  {
    id: 'jefe-limpio',
    nombre: 'Un jefe a la primera',
    porque: 'Cerraste un mundo sin fallar ni una vez. Y los jefes no tienen pistas.',
    cumple: ({ jefesALaPrimera }) => jefesALaPrimera >= 1,
  },
  {
    id: 'tres-jefes-limpios',
    nombre: 'Tres jefes a la primera',
    porque: 'Tres finales de mundo sin un solo intento fallido.',
    cumple: ({ jefesALaPrimera }) => jefesALaPrimera >= 3,
  },
  {
    id: 'todos-los-jefes',
    nombre: 'Todos los finales',
    porque: 'Los {mundos} mundos cerrados por su jefe. Ni uno se ha quedado a medias.',
    cumple: ({ progreso, totalDeMundos }) => progreso.jefesDerrotados >= totalDeMundos,
  },
  {
    id: 'repaso-bordado',
    nombre: 'Un caso sin fisuras',
    porque: 'Un repaso de {revisa} con las seis. No lo dirá, pero le ha gustado.',
    cumple: ({ repasos }) => repasos.perfectos >= 1,
  },
  {
    id: 'todos-los-repasos',
    nombre: 'El expediente completo',
    porque: 'Todos los repasos bordados. {revisa} ya no tiene nada que objetarte.',
    cumple: ({ repasos, totalDeMundos }) => repasos.perfectos >= totalDeMundos,
  },
  {
    id: 'coleccionista',
    nombre: 'La sombrerera llena',
    porque: 'Los {sombreros} sombreros. {narra} jura que eran todos suyos.',
    cumple: ({ sombreros }) => sombreros.estanTodos,
  },
  {
    id: 'lector',
    nombre: 'Todo el periódico',
    porque:
      'Los {recortes} recortes del Elendel Daily. Los titulares son broma; los consejos del pie, no.',
    cumple: ({ recortes }) => recortes.cuantos >= recortes.total,
  },
  {
    id: 'colonia-entera',
    nombre: 'Todos los metales',
    porque: 'Los {gatos} gatos adoptados. Incluido Aluminio, que no sirve para nada.',
    cumple: ({ gatos }) => gatos.adoptados.length >= GATOS.length,
  },
  {
    id: 'colonia-contenta',
    nombre: 'Nadie triste',
    porque: 'Toda la colonia por encima del umbral a la vez. Cuesta más de lo que parece.',
    cumple: ({ gatos }) => gatos.adoptados.length >= 5 && gatos.adoptados.every((g) => g.felicidad >= 60),
  },
  {
    id: 'sin-red',
    nombre: 'Sin red',
    porque: 'Un mundo entero a la primera, reto a reto, sin un solo intento fallido.',
    cumple: ({ mundosALaPrimera }) => mundosALaPrimera >= 1,
  },
  {
    id: 'limpio',
    nombre: 'Nada que objetar',
    porque: 'Diez retos seguidos sin que {revisa} te encontrara una sola pega en el código.',
    cumple: ({ revisionesLimpias }) => revisionesLimpias >= 10,
  },
  {
    id: 'insistente',
    nombre: 'La tercera va la vencida',
    porque: 'Un reto que se te resistió cinco veces y acabaste sacando. Cuenta doble.',
    cumple: ({ retosPeleados }) => retosPeleados >= 1,
  },
]

export const INSIGNIAS_POR_ID = Object.fromEntries(INSIGNIAS.map((i) => [i.id, i]))

/**
 * El texto de una insignia con los huecos rellenos: los papeles, por el reparto
 * del camino donde estés; los números, por los corpus.
 *
 * Un hueco que no se sepa rellenar se queda como está, que es feo pero visible;
 * borrarlo dejaría la frase sin sujeto y nadie se enteraría de que faltaba
 * algo.
 */
export function porqueDe(insignia, itinerarioId) {
  const reparto =
    ITINERARIOS_POR_ID[itinerarioId]?.reparto ?? ITINERARIOS_POR_ID[ITINERARIO_POR_DEFECTO].reparto
  return String(insignia?.porque ?? '').replace(/\{(\w+)\}/g, (entero, hueco) => {
    if (CUENTAS[hueco]) return String(CUENTAS[hueco]())
    const quien = [reparto[hueco]].flat()[0]
    return quien ? nombreDe(quien) : entero
  })
}
